import asyncio
import io
import json
import logging
import os
import re
import zipfile
from typing import List, Optional

import httpx
from fastapi import FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from PIL import Image
from pydantic import BaseModel, Field, validator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Environment variables with defaults
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://ollama:11434")
CODE_MODEL = os.getenv("CODE_MODEL", "qwen2.5-coder:7b")
VISION_MODEL = os.getenv("VISION_MODEL", "llama3.2-vision")
MAX_PAGES = int(os.getenv("MAX_PAGES", "5"))
MAX_DESCRIPTION_LENGTH = int(os.getenv("MAX_DESCRIPTION_LENGTH", "2000"))
MAX_IMAGES = int(os.getenv("MAX_IMAGES", "3"))
MAX_IMAGE_SIZE_MB = int(os.getenv("MAX_IMAGE_SIZE_MB", "5"))
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "300"))
RATE_LIMIT = os.getenv("RATE_LIMIT_PER_MINUTE", "10 per minute")

# Initialize FastAPI app
app = FastAPI(
    title="AI Website Generator API",
    description="Generate multi-page static websites using AI",
    version="1.0.0"
)

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS middleware (configure allowed origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Configure specific origins in production
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

# Pydantic models
class GenerateRequest(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=10, max_length=MAX_DESCRIPTION_LENGTH)
    theme_hint: Optional[str] = Field(None, max_length=200)
    pages: Optional[List[str]] = Field(default=None, max_items=MAX_PAGES)
    require_dark_mode: bool = Field(default=False)

    @validator('company_name', 'description', 'theme_hint')
    def sanitize_input(cls, v):
        if v:
            # Remove potentially dangerous characters
            v = re.sub(r'[<>\"\'&]', '', v)
        return v

    @validator('pages')
    def validate_pages(cls, v):
        if v:
            if len(v) > MAX_PAGES:
                raise ValueError(f'Maximum {MAX_PAGES} pages allowed')
            # Validate page names - allow alphanumeric and common characters in any language
            for page in v:
                # Allow letters, numbers, spaces, hyphens, underscores in any language
                if not re.match(r'^[\w\s\-]+$', page, re.UNICODE):
                    raise ValueError(f'Invalid page name: {page}. Only letters, numbers, spaces, hyphens and underscores allowed.')
                if len(page) > 50:
                    raise ValueError(f'Page name too long: {page}')
        return v


class HealthResponse(BaseModel):
    status: str
    ollama_connected: bool


# Utility functions
async def check_ollama_health() -> bool:
    """Check if Ollama service is healthy"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{OLLAMA_HOST}/api/tags")
            return response.status_code == 200
    except Exception as e:
        logger.error(f"Ollama health check failed: {e}")
        return False


def validate_image(file: UploadFile) -> bool:
    """Validate uploaded image"""
    try:
        # Check file size
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset to start
        
        if file_size > MAX_IMAGE_SIZE_MB * 1024 * 1024:
            return False
        
        # Check if it's a valid image
        image = Image.open(file.file)
        image.verify()
        file.file.seek(0)  # Reset for later use
        
        # Check format
        if image.format not in ['JPEG', 'PNG', 'GIF', 'WEBP']:
            return False
        
        return True
    except Exception as e:
        logger.error(f"Image validation failed: {e}")
        return False


async def analyze_images_with_vision(images: List[UploadFile]) -> dict:
    """Analyze images using vision model to extract color palette and design hints"""
    try:
        # For simplicity, analyze first image only
        if not images:
            return {}
        
        image = images[0]
        image_data = await image.read()
        await image.seek(0)
        
        # Convert to base64 or process as needed
        # For this example, we'll extract basic info
        img = Image.open(io.BytesIO(image_data))
        
        # Get dominant colors (simplified)
        img_small = img.resize((50, 50))
        pixels = list(img_small.getdata())
        
        # Simple color extraction
        r_avg = sum(p[0] for p in pixels if len(p) >= 3) // len(pixels)
        g_avg = sum(p[1] for p in pixels if len(p) >= 3) // len(pixels)
        b_avg = sum(p[2] for p in pixels if len(p) >= 3) // len(pixels)
        
        primary_color = f"#{r_avg:02x}{g_avg:02x}{b_avg:02x}"
        
        prompt = f"""Analyze this image and suggest:
1. A complementary color palette (3-5 colors)
2. Font style suggestions (modern, classic, playful, professional)
3. Overall design mood

Image has a dominant color of {primary_color}. Provide suggestions in JSON format."""

        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{OLLAMA_HOST}/api/chat",
                json={
                    "model": VISION_MODEL,
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9
                    }
                },
                timeout=60.0
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get('message', {}).get('content', '{}')
                
                # Try to extract JSON from response
                try:
                    # Look for JSON in the response
                    json_match = re.search(r'\{.*\}', content, re.DOTALL)
                    if json_match:
                        design_hints = json.loads(json_match.group())
                    else:
                        design_hints = {"primary_color": primary_color}
                except:
                    design_hints = {"primary_color": primary_color}
                
                return design_hints
            
        return {"primary_color": primary_color}
        
    except Exception as e:
        logger.error(f"Image analysis failed: {e}")
        return {}


async def generate_website_with_llm(
    request: GenerateRequest,
    design_hints: dict = None
) -> dict:
    """Generate website files using code model"""
    
    # Theme configurations matching the frontend form
    theme_configs = {
        "modern": {
            "colors": {"primary": "#3B82F6", "secondary": "#1E40AF", "accent": "#60A5FA", "bg": "#F9FAFB"},
            "description": "Clean, contemporary design with blue tones, card-based layouts, subtle shadows"
        },
        "minimalist": {
            "colors": {"primary": "#1F2937", "secondary": "#6B7280", "accent": "#9CA3AF", "bg": "#FFFFFF"},
            "description": "Minimal, monochrome palette, generous whitespace, simple typography, no decorations"
        },
        "colorful": {
            "colors": {"primary": "#8B5CF6", "secondary": "#EC4899", "accent": "#F59E0B", "bg": "#FEF3C7"},
            "description": "Vibrant, playful colors (purple, pink, orange), gradients, bold typography"
        },
        "elegant": {
            "colors": {"primary": "#9333EA", "secondary": "#C084FC", "accent": "#D8B4FE", "bg": "#FAF5FF"},
            "description": "Sophisticated purple/lavender tones, serif fonts, refined spacing, luxury feel"
        },
        "dark": {
            "colors": {"primary": "#10B981", "secondary": "#059669", "accent": "#34D399", "bg": "#111827"},
            "description": "Dark backgrounds (#111827), neon green accents, high contrast, modern dark UI"
        }
    }
    
    # Determine theme (default to modern if not specified or invalid)
    theme_key = (request.theme_hint or "modern").lower()
    theme = theme_configs.get(theme_key, theme_configs["modern"])
    
    # Determine pages to generate
    default_pages = ["index", "about", "services", "pricing", "contact"]
    pages_to_generate = request.pages if request.pages else default_pages[:3]
    
    # Ensure we don't exceed max pages
    pages_to_generate = pages_to_generate[:MAX_PAGES]
    
    # Build enhanced prompt
    prompt = f"""You are an expert web developer. Generate a complete, modern, responsive multi-page static website.

Requirements:
- Company Name: {request.company_name}
- Description: {request.description}
- Theme Style: {theme_key.upper()} - {theme['description']}
- Color Palette: {json.dumps(theme['colors'])}
- Pages Required: {', '.join(pages_to_generate)}

{f"Additional Design Hints from Images: {json.dumps(design_hints)}" if design_hints else ""}

THEME REQUIREMENTS FOR '{theme_key.upper()}':
{theme['description']}
- Primary Color: {theme['colors']['primary']}
- Secondary Color: {theme['colors']['secondary']}
- Accent Color: {theme['colors']['accent']}
- Background: {theme['colors']['bg']}

Generate a professional, complete website with these files:
1. index.html - Homepage with hero section, company overview, call-to-action
2. {'.html, '.join(p for p in pages_to_generate if p != 'index')}.html - Additional pages with relevant content
3. styles.css - Complete responsive styling following the {theme_key} theme
4. script.js - Interactive features, smooth animations, mobile menu

CRITICAL DESIGN REQUIREMENTS:
- Semantic HTML5 with proper structure
- Mobile-first responsive design (breakpoints: 768px, 1024px, 1280px)
- CSS Grid and Flexbox for layouts
- Smooth animations and transitions
- Professional navigation bar (sticky on desktop)
- Hero section with compelling headline
- Feature/service sections with icons or cards
- Contact form with validation
- Footer with company info and links
- Accessibility: ARIA labels, semantic tags, keyboard navigation
- Modern typography (use system fonts or Google Fonts)
- Consistent spacing and rhythm
- Button hover effects and micro-interactions

Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, no explanations):
{{
  "index.html": "<!DOCTYPE html>...",
  "about.html": "<!DOCTYPE html>...",
  "styles.css": "* {{ margin: 0; ...",
  "script.js": "// JavaScript code..."
}}

Each HTML file must:
- Be complete and valid
- Include proper DOCTYPE and meta tags
- Link to styles.css and script.js
- Have consistent navigation
- Be production-ready

Each page should have meaningful, relevant content related to {request.company_name} and {request.description}.

IMPORTANT: Return ONLY the JSON object, nothing else."""

    try:
        async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT) as client:
            logger.info(f"Sending request to Ollama with model {CODE_MODEL}")
            
            response = await client.post(
                f"{OLLAMA_HOST}/api/chat",
                json={
                    "model": CODE_MODEL,
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are an expert web developer who generates complete, production-ready HTML/CSS/JS code. Always return valid JSON only."
                        },
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "num_predict": 8192
                    }
                },
                timeout=REQUEST_TIMEOUT
            )
            
            if response.status_code != 200:
                logger.error(f"Ollama API error: {response.status_code} - {response.text}")
                raise HTTPException(status_code=502, detail="AI model request failed")
            
            result = response.json()
            content = result.get('message', {}).get('content', '')
            
            if not content:
                raise HTTPException(status_code=502, detail="Empty response from AI model")
            
            logger.info(f"Received response from Ollama, length: {len(content)}")
            
            # Try to extract JSON from response
            # Remove markdown code blocks if present
            content = re.sub(r'^```json\s*', '', content, flags=re.MULTILINE)
            content = re.sub(r'^```\s*', '', content, flags=re.MULTILINE)
            content = re.sub(r'\s*```$', '', content, flags=re.MULTILINE)
            content = content.strip()
            
            # Find JSON object
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                content = json_match.group()
            
            # Parse JSON
            try:
                files = json.loads(content)
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {e}\nContent preview: {content[:500]}")
                raise HTTPException(
                    status_code=502,
                    detail="AI model returned invalid JSON. Please try again."
                )
            
            # Validate that we have the required files
            required_files = ['styles.css', 'script.js']
            for file in required_files:
                if file not in files:
                    logger.warning(f"Missing required file: {file}, adding default")
                    if file == 'styles.css':
                        files[file] = "/* Default styles */\n* { margin: 0; padding: 0; box-sizing: border-box; }"
                    elif file == 'script.js':
                        files[file] = "// Default script\nconsole.log('Website loaded');"
            
            # Ensure we have at least index.html
            if 'index.html' not in files:
                raise HTTPException(
                    status_code=502,
                    detail="AI model did not generate index.html"
                )
            
            # Validate HTML files
            html_files = [k for k in files.keys() if k.endswith('.html')]
            if not html_files:
                raise HTTPException(
                    status_code=502,
                    detail="No HTML files generated"
                )
            
            logger.info(f"Successfully generated {len(files)} files: {list(files.keys())}")
            return files
            
    except httpx.TimeoutException:
        logger.error("Request to Ollama timed out")
        raise HTTPException(
            status_code=504,
            detail="Request timeout. The AI model took too long to respond."
        )
    except httpx.RequestError as e:
        logger.error(f"Request error: {e}")
        raise HTTPException(
            status_code=502,
            detail="Failed to connect to AI model"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in generate_website_with_llm: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error during generation"
        )


def create_zip_file(files: dict) -> io.BytesIO:
    """Create ZIP file from generated files"""
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for filename, content in files.items():
            # Sanitize filename
            safe_filename = re.sub(r'[^a-zA-Z0-9._-]', '', filename)
            if not safe_filename:
                safe_filename = 'file.txt'
            
            # Write file to zip
            zip_file.writestr(safe_filename, content)
    
    zip_buffer.seek(0)
    return zip_buffer


# API Endpoints
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    ollama_healthy = await check_ollama_health()
    return HealthResponse(
        status="healthy" if ollama_healthy else "degraded",
        ollama_connected=ollama_healthy
    )


@app.post("/generate")
@limiter.limit(RATE_LIMIT)
async def generate_website(
    request: Request,
    company_name: str = Form(...),
    description: str = Form(...),
    theme_hint: Optional[str] = Form(None),
    pages: Optional[str] = Form(None),
    require_dark_mode: bool = Form(False),
    images: Optional[List[UploadFile]] = File(None)
):
    """
    Generate a multi-page static website
    
    Parameters:
    - company_name: Name of the company/project
    - description: Description of the business/purpose
    - theme_hint: Optional theme guidance (e.g., "modern", "elegant")
    - pages: Comma-separated list of pages to generate (max 5)
    - require_dark_mode: Whether to use dark mode
    - images: Optional images for design inspiration (max 3)
    """
    try:
        # Parse pages
        pages_list = None
        if pages:
            pages_list = [p.strip() for p in pages.split(',')][:MAX_PAGES]
        
        # Create request object
        gen_request = GenerateRequest(
            company_name=company_name,
            description=description,
            theme_hint=theme_hint,
            pages=pages_list,
            require_dark_mode=require_dark_mode
        )
        
        logger.info(f"Generating website for: {company_name}")
        
        # Validate images if provided
        design_hints = {}
        if images:
            if len(images) > MAX_IMAGES:
                raise HTTPException(
                    status_code=400,
                    detail=f"Maximum {MAX_IMAGES} images allowed"
                )
            
            valid_images = []
            for img in images:
                if validate_image(img):
                    valid_images.append(img)
                else:
                    logger.warning(f"Invalid image: {img.filename}")
            
            if valid_images:
                logger.info(f"Analyzing {len(valid_images)} images")
                design_hints = await analyze_images_with_vision(valid_images)
        
        # Generate website
        logger.info("Calling AI model to generate website")
        files = await generate_website_with_llm(gen_request, design_hints)
        
        # Create ZIP
        logger.info("Creating ZIP file")
        zip_buffer = create_zip_file(files)
        
        # Return ZIP file
        return StreamingResponse(
            zip_buffer,
            media_type="application/zip",
            headers={
                "Content-Disposition": f"attachment; filename={company_name.replace(' ', '_')}_website.zip"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in generate_website: {e}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "AI Website Generator",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "generate": "/generate (POST)"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
