# AI Website Generator - Project Summary

## 📁 Project Structure

```
LearningCode-1/
│
├── api/                          # FastAPI application
│   ├── main.py                   # Main application code
│   ├── requirements.txt          # Python dependencies
│   ├── Dockerfile               # Container definition
│   ├── security_enhancements.py # Security utilities (reference)
│   └── .gitignore               # Git ignore rules
│
├── docker-compose.yml           # Multi-container orchestration
├── .env.example                 # Environment variables template
│
├── README_API.md                # Complete API documentation
├── SECURITY.md                  # Security guidelines and checklist
├── TESTING.md                   # Testing guide and procedures
│
├── setup.sh                     # Quick setup script
├── deploy.sh                    # Production deployment script
├── test_api.py                  # API testing script
│
└── nginx.conf.example           # Nginx reverse proxy config
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                       │
│  • SSL/TLS Termination                                       │
│  • Rate Limiting (10 req/min per IP)                        │
│  • Security Headers                                          │
│  • Request/Response Logging                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Application (Port 8080)             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Endpoints:                                           │  │
│  │  • GET  /health      → Health check                  │  │
│  │  • POST /generate    → Generate website              │  │
│  │  • GET  /            → Service info                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Security:                                            │  │
│  │  • Input validation (Pydantic)                       │  │
│  │  • XSS sanitization                                  │  │
│  │  • Rate limiting (SlowAPI)                           │  │
│  │  • File size limits                                  │  │
│  │  • CORS protection                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│               Ollama AI Service (Port 11434)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Models:                                              │  │
│  │  • qwen2.5-coder:7b    → Code generation            │  │
│  │  • llama3.2-vision     → Image analysis             │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Features:                                            │  │
│  │  • Local inference (no external API calls)           │  │
│  │  • Model caching                                     │  │
│  │  • GPU acceleration (if available)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Request Flow

```
1. Client Request
   ↓
2. Nginx → Security checks, rate limiting
   ↓
3. FastAPI → Input validation
   ↓
4. [Optional] Image Analysis
   • Upload images → Ollama Vision Model
   • Extract color palette
   • Get design suggestions
   ↓
5. Website Generation
   • Build prompt with requirements
   • Call Ollama Code Model
   • Generate HTML/CSS/JS files
   ↓
6. Validation & Processing
   • Validate JSON response
   • Check for required files
   • Sanitize content (optional)
   ↓
7. ZIP Creation
   • Package files in memory
   • Add to ZIP archive
   ↓
8. Response
   • Stream ZIP file to client
   • Add security headers
   • Log request completion
```

## 🔐 Security Layers

```
Layer 1: Network
├── Firewall rules
├── Private network between containers
└── Exposed ports: 80, 443 only (production)

Layer 2: Nginx
├── SSL/TLS encryption
├── Rate limiting (IP-based)
├── Request size limits (20MB)
└── Security headers (HSTS, CSP, etc.)

Layer 3: Application
├── Input validation (Pydantic)
├── XSS prevention (sanitization)
├── Path traversal protection
├── File type validation
├── Rate limiting (SlowAPI)
└── CORS configuration

Layer 4: Container
├── Non-root user
├── Read-only filesystem (where possible)
├── Resource limits (CPU, memory)
└── Network isolation

Layer 5: Runtime
├── Request timeout (300s)
├── Error handling
├── Logging and monitoring
└── Content validation
```

## 📊 Key Features

### ✅ Implemented

- [x] Multi-page website generation (3-5 pages)
- [x] Image analysis for design inspiration
- [x] Dark mode support
- [x] Responsive design output
- [x] Input validation and sanitization
- [x] Rate limiting (10 req/min per IP)
- [x] File size limits (5MB per image)
- [x] Request timeout protection
- [x] Health check endpoint
- [x] ZIP file streaming
- [x] Docker containerization
- [x] Non-root container user
- [x] Comprehensive error handling
- [x] Request/response logging

### 🔒 Security Features

- [x] XSS prevention
- [x] Path traversal protection
- [x] SQL injection prevention (input validation)
- [x] DoS protection (timeouts, limits)
- [x] CORS configuration
- [x] Security headers
- [x] Container isolation
- [x] Resource limits

### 📈 Performance

- Initial setup: ~5-10 minutes (model download)
- Generation time: 30-90 seconds (depends on complexity)
- Memory usage: ~4-8GB (with models loaded)
- Concurrent requests: Limited by rate limiting

## 🚀 Quick Start Commands

```bash
# 1. Setup and start services
./setup.sh

# 2. Test the API
python3 test_api.py

# 3. Generate a website
curl -X POST http://localhost:8080/generate \
  -F "company_name=MyCompany" \
  -F "description=My business description" \
  -F "theme_hint=modern" \
  -o website.zip

# 4. Extract and view
unzip website.zip -d my_website/
open my_website/index.html
```

## 🔧 Configuration

### Environment Variables

```bash
OLLAMA_HOST=http://ollama:11434
CODE_MODEL=qwen2.5-coder:7b
VISION_MODEL=llama3.2-vision
MAX_PAGES=5
MAX_IMAGES=3
MAX_IMAGE_SIZE_MB=5
REQUEST_TIMEOUT=300
RATE_LIMIT_PER_MINUTE=10
```

### Customization Options

- Change AI models (faster/slower/better)
- Adjust rate limits
- Modify max pages/images
- Configure CORS origins
- Add API key authentication
- Enable/disable image analysis

## 📝 API Endpoints

### GET /health

Returns service health status

```json
{
  "status": "healthy",
  "ollama_connected": true
}
```

### POST /generate

Generates a multi-page website

**Request (multipart/form-data):**

- `company_name`: string (required, max 100 chars)
- `description`: string (required, 10-2000 chars)
- `theme_hint`: string (optional, max 200 chars)
- `pages`: string (optional, comma-separated, max 5)
- `require_dark_mode`: boolean (optional, default: false)
- `images`: files (optional, max 3, 5MB each)

**Response:**

- Content-Type: application/zip
- Contains: HTML, CSS, JS files

## 🛠️ Troubleshooting

### Common Issues

1. **Ollama not connected**

   ```bash
   docker-compose restart ollama
   docker logs ollama
   ```

2. **Generation timeout**

   - Increase REQUEST_TIMEOUT
   - Use smaller/faster models
   - Reduce complexity

3. **Out of memory**

   - Increase Docker memory limit
   - Use smaller models
   - Limit concurrent requests

4. **Rate limit exceeded**
   - Wait 1 minute
   - Adjust RATE_LIMIT_PER_MINUTE

## 📚 Documentation Files

- `README_API.md` - Complete API documentation
- `SECURITY.md` - Security guidelines and checklist
- `TESTING.md` - Testing procedures
- `nginx.conf.example` - Nginx configuration
- `.env.example` - Environment variables

## 🎯 Production Deployment

1. Clone repository on server
2. Copy and configure `.env` file
3. Run `./deploy.sh`
4. Configure nginx with SSL
5. Set up monitoring
6. Configure backups
7. Test thoroughly

## 📞 Support & Maintenance

### Regular Tasks

- Update Docker images monthly
- Review security logs weekly
- Test backups monthly
- Update dependencies regularly
- Monitor resource usage

### Monitoring Points

- API response times
- Error rates
- Memory usage
- Disk usage
- Rate limit violations

## 🎉 Success Metrics

- ✅ Service starts in < 30 seconds
- ✅ Health check responds in < 100ms
- ✅ Generation completes in < 90 seconds
- ✅ Zero unhandled exceptions
- ✅ All security checks pass
- ✅ Rate limiting effective
- ✅ Clean error messages

---

**Version:** 1.0.0  
**Last Updated:** 2025-10-03  
**Status:** Production Ready ✅
