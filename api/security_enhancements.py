"""
Enhanced security middleware and utilities for production
Add these to main.py for production deployment
"""

import hashlib
import secrets
import time
from functools import wraps
from typing import Optional

from fastapi import Header, HTTPException, Request
from fastapi.responses import JSONResponse

# ============================================================================
# API Key Authentication
# ============================================================================

API_KEYS = set()  # Load from environment or database

def load_api_keys():
    """Load API keys from environment variable"""
    keys_str = os.getenv("API_KEYS", "")
    if keys_str:
        return set(keys_str.split(","))
    return set()

API_KEYS = load_api_keys()

async def verify_api_key(x_api_key: Optional[str] = Header(None)):
    """Verify API key if authentication is enabled"""
    if not API_KEYS:
        return None  # No auth required if no keys configured
    
    if not x_api_key or x_api_key not in API_KEYS:
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing API key",
            headers={"WWW-Authenticate": "ApiKey"}
        )
    return x_api_key


# ============================================================================
# Request ID for tracking
# ============================================================================

@app.middleware("http")
async def add_request_id(request: Request, call_next):
    """Add unique request ID to each request"""
    request_id = secrets.token_hex(16)
    request.state.request_id = request_id
    
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


# ============================================================================
# Security Headers Middleware
# ============================================================================

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to all responses"""
    response = await call_next(request)
    
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    
    # Only add HSTS in production with HTTPS
    if request.url.scheme == "https":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    return response


# ============================================================================
# Request Logging
# ============================================================================

@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests with timing"""
    start_time = time.time()
    
    # Get client IP
    client_ip = request.client.host if request.client else "unknown"
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        client_ip = forwarded_for.split(",")[0].strip()
    
    # Log request
    logger.info(
        f"Request: {request.method} {request.url.path} "
        f"from {client_ip}"
    )
    
    # Process request
    response = await call_next(request)
    
    # Calculate duration
    duration = time.time() - start_time
    
    # Log response
    logger.info(
        f"Response: {request.method} {request.url.path} "
        f"status={response.status_code} "
        f"duration={duration:.3f}s"
    )
    
    return response


# ============================================================================
# Input Sanitization
# ============================================================================

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal"""
    # Remove path components
    filename = os.path.basename(filename)
    
    # Remove dangerous characters
    filename = re.sub(r'[^\w\s.-]', '', filename)
    
    # Limit length
    filename = filename[:100]
    
    # Ensure not empty
    if not filename:
        filename = "file.txt"
    
    return filename


def sanitize_html_output(html: str) -> str:
    """Basic sanitization of generated HTML"""
    # Remove potentially dangerous elements
    dangerous_patterns = [
        r'<script[^>]*>.*?</script>',
        r'<iframe[^>]*>.*?</iframe>',
        r'<embed[^>]*>',
        r'<object[^>]*>.*?</object>',
        r'javascript:',
        r'on\w+\s*=',  # onclick, onerror, etc.
    ]
    
    for pattern in dangerous_patterns:
        html = re.sub(pattern, '', html, flags=re.IGNORECASE | re.DOTALL)
    
    return html


# ============================================================================
# Content Validation
# ============================================================================

def validate_generated_content(files: dict) -> bool:
    """Validate generated content for security issues"""
    dangerous_keywords = [
        'eval(',
        'exec(',
        'Function(',
        '__import__',
        'subprocess',
        '<script>alert',
        'document.cookie',
        'window.location',
    ]
    
    for filename, content in files.items():
        content_lower = content.lower()
        
        for keyword in dangerous_keywords:
            if keyword.lower() in content_lower:
                logger.warning(f"Dangerous keyword '{keyword}' found in {filename}")
                return False
    
    return True


# ============================================================================
# Enhanced Rate Limiting with Redis (optional)
# ============================================================================

"""
For production with multiple instances, use Redis-backed rate limiting:

from redis import Redis
from slowapi.util import get_remote_address

redis_client = Redis(host='redis', port=6379, decode_responses=True)

def redis_rate_limit(key: str, limit: int, window: int) -> bool:
    '''
    Check rate limit using Redis
    
    Args:
        key: Unique identifier (e.g., IP address)
        limit: Maximum requests allowed
        window: Time window in seconds
    
    Returns:
        True if within limit, False otherwise
    '''
    current = redis_client.get(key)
    
    if current is None:
        redis_client.setex(key, window, 1)
        return True
    
    if int(current) < limit:
        redis_client.incr(key)
        return True
    
    return False

@app.middleware("http")
async def custom_rate_limit(request: Request, call_next):
    client_ip = get_remote_address(request)
    key = f"rate_limit:{client_ip}"
    
    if not redis_rate_limit(key, limit=10, window=60):
        return JSONResponse(
            status_code=429,
            content={"detail": "Rate limit exceeded"}
        )
    
    return await call_next(request)
"""


# ============================================================================
# Webhooks for monitoring (optional)
# ============================================================================

async def send_alert(message: str, severity: str = "info"):
    """Send alert to monitoring service"""
    webhook_url = os.getenv("ALERT_WEBHOOK_URL")
    if not webhook_url:
        return
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(
                webhook_url,
                json={
                    "message": message,
                    "severity": severity,
                    "timestamp": time.time(),
                    "service": "ai-website-generator"
                }
            )
    except Exception as e:
        logger.error(f"Failed to send alert: {e}")


# ============================================================================
# Error Handler
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    # Send alert for server errors
    if not isinstance(exc, HTTPException):
        await send_alert(
            f"Unhandled exception: {str(exc)}",
            severity="error"
        )
    
    # Don't expose internal errors to clients
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "request_id": getattr(request.state, 'request_id', 'unknown')
        }
    )


# ============================================================================
# Usage in main.py
# ============================================================================

"""
Add to your generate endpoint:

@app.post("/generate", dependencies=[Depends(verify_api_key)])
@limiter.limit(RATE_LIMIT)
async def generate_website(...):
    # Sanitize inputs
    company_name = sanitize_input(company_name)
    description = sanitize_input(description)
    
    # Generate website
    files = await generate_website_with_llm(gen_request, design_hints)
    
    # Validate content
    if not validate_generated_content(files):
        raise HTTPException(
            status_code=400,
            detail="Generated content failed security validation"
        )
    
    # Sanitize HTML (optional, might break functionality)
    # for filename, content in files.items():
    #     if filename.endswith('.html'):
    #         files[filename] = sanitize_html_output(content)
    
    # Continue with ZIP creation...
"""
