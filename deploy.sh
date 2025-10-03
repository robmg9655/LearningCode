#!/bin/bash

# Production Deployment Script
# This script helps deploy the API to a production server

set -e  # Exit on error

echo "🚀 AI Website Generator - Production Deployment"
echo "================================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
    log_error "Please do not run as root"
    exit 1
fi

# Check prerequisites
log_info "Checking prerequisites..."

command -v docker >/dev/null 2>&1 || {
    log_error "Docker is not installed. Please install Docker first."
    exit 1
}

command -v docker-compose >/dev/null 2>&1 || {
    log_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
}

log_info "✓ Docker and Docker Compose are installed"

# Check if .env file exists
if [ ! -f .env ]; then
    log_warn ".env file not found. Creating from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        log_info "Created .env file. Please edit it with your production values."
        log_warn "Don't forget to set API_KEY and ALLOWED_ORIGINS!"
        read -p "Press enter to continue after editing .env..."
    else
        log_error ".env.example not found!"
        exit 1
    fi
fi

# Pull latest changes (if in git repo)
if [ -d .git ]; then
    log_info "Pulling latest changes from git..."
    git pull origin main || log_warn "Could not pull from git"
fi

# Backup current deployment (if exists)
if docker ps | grep -q "fastapi_generator"; then
    log_info "Creating backup of current deployment..."
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    docker-compose config > "$BACKUP_DIR/docker-compose.yml"
    cp .env "$BACKUP_DIR/.env" 2>/dev/null || true
    log_info "✓ Backup created in $BACKUP_DIR"
fi

# Stop existing containers
log_info "Stopping existing containers..."
docker-compose down || true

# Build new images
log_info "Building new Docker images..."
docker-compose build --no-cache

# Start services
log_info "Starting services..."
docker-compose up -d

# Wait for services to be healthy
log_info "Waiting for services to start..."
sleep 10

# Check Ollama health
log_info "Checking Ollama service..."
for i in {1..10}; do
    if docker exec ollama ollama list >/dev/null 2>&1; then
        log_info "✓ Ollama is running"
        break
    fi
    if [ $i -eq 10 ]; then
        log_error "Ollama did not start properly"
        exit 1
    fi
    sleep 3
done

# Pull required models
log_info "Checking if models are downloaded..."

if ! docker exec ollama ollama list | grep -q "qwen2.5-coder:7b"; then
    log_info "Downloading code model (this will take several minutes)..."
    docker exec ollama ollama pull qwen2.5-coder:7b
    log_info "✓ Code model downloaded"
else
    log_info "✓ Code model already present"
fi

if ! docker exec ollama ollama list | grep -q "llama3.2-vision"; then
    log_info "Downloading vision model (this will take several minutes)..."
    docker exec ollama ollama pull llama3.2-vision
    log_info "✓ Vision model downloaded"
else
    log_info "✓ Vision model already present"
fi

# Check API health
log_info "Checking API service..."
for i in {1..10}; do
    if curl -s http://localhost:8080/health >/dev/null 2>&1; then
        log_info "✓ API is running"
        break
    fi
    if [ $i -eq 10 ]; then
        log_error "API did not start properly"
        docker-compose logs api
        exit 1
    fi
    sleep 3
done

# Run health check
log_info "Running health check..."
HEALTH_RESPONSE=$(curl -s http://localhost:8080/health)
echo "$HEALTH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$HEALTH_RESPONSE"

# Security reminders
echo ""
echo "================================================"
log_info "Deployment completed successfully! 🎉"
echo "================================================"
echo ""
log_warn "⚠️  SECURITY REMINDERS:"
echo "  1. Configure firewall rules"
echo "  2. Set up HTTPS/SSL with Let's Encrypt"
echo "  3. Configure nginx reverse proxy"
echo "  4. Update CORS origins in .env"
echo "  5. Set strong API_KEY in .env"
echo "  6. Enable monitoring and logging"
echo "  7. Set up automated backups"
echo ""
log_info "Service URLs:"
echo "  API: http://localhost:8080"
echo "  Ollama: http://localhost:11434"
echo ""
log_info "Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Stop services: docker-compose stop"
echo "  Restart: docker-compose restart"
echo "  Update models: docker exec ollama ollama pull <model-name>"
echo ""
log_info "For SSL setup, see: https://letsencrypt.org/"
echo "For nginx config, check: nginx.conf.example"
echo ""
