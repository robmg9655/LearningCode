# Testing Guide

## Local Testing

### 1. Iniciar servicios

```bash
./setup.sh
```

O manualmente:

```bash
docker-compose up -d
docker exec -it ollama ollama pull qwen2.5-coder:7b
docker exec -it ollama ollama pull llama3.2-vision
```

### 2. Verificar health

```bash
curl http://localhost:8080/health
```

### 3. Prueba básica de generación

```bash
curl -X POST http://localhost:8080/generate \
  -F "company_name=TestCorp" \
  -F "description=Una empresa de prueba para testing" \
  -F "theme_hint=modern" \
  -F "pages=home,about,contact" \
  -F "require_dark_mode=false" \
  -o test_website.zip
```

### 4. Prueba con imágenes

```bash
curl -X POST http://localhost:8080/generate \
  -F "company_name=DesignCorp" \
  -F "description=Empresa de diseño creativo" \
  -F "theme_hint=creative and colorful" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.png" \
  -o design_website.zip
```

### 5. Ejecutar script de pruebas

```bash
python3 test_api.py
```

## Unit Tests (Opcional - Para desarrollo)

Crear `api/test_main.py`:

```python
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "service" in response.json()

def test_generate_missing_fields():
    response = client.post("/generate", data={})
    assert response.status_code == 422  # Validation error

def test_generate_invalid_pages():
    response = client.post("/generate", data={
        "company_name": "Test",
        "description": "Test description",
        "pages": "invalid,page,names"
    })
    assert response.status_code == 422

def test_sanitization():
    from main import GenerateRequest

    request = GenerateRequest(
        company_name="<script>alert('xss')</script>",
        description="Normal description",
    )
    assert "<script>" not in request.company_name
```

Ejecutar tests:

```bash
cd api
pytest test_main.py -v
```

## Load Testing

### Usando Apache Bench

```bash
# 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:8080/health
```

### Usando Locust

Crear `locustfile.py`:

```python
from locust import HttpUser, task, between

class WebsiteGeneratorUser(HttpUser):
    wait_time = between(5, 15)

    @task(1)
    def health_check(self):
        self.client.get("/health")

    @task(10)
    def generate_website(self):
        self.client.post("/generate", data={
            "company_name": "LoadTest Corp",
            "description": "Load testing company",
            "theme_hint": "modern",
            "pages": "home,about,contact"
        })
```

Ejecutar:

```bash
pip install locust
locust -f locustfile.py --host=http://localhost:8080
```

## Security Testing

### 1. Test Rate Limiting

```bash
for i in {1..15}; do
  curl -X POST http://localhost:8080/generate \
    -F "company_name=Test$i" \
    -F "description=Test description" &
done
wait
```

### 2. Test Input Validation

```bash
# XSS attempt
curl -X POST http://localhost:8080/generate \
  -F 'company_name=<script>alert("xss")</script>' \
  -F "description=Test"

# SQL Injection attempt (should be handled)
curl -X POST http://localhost:8080/generate \
  -F "company_name=Test' OR '1'='1" \
  -F "description=Test"

# Path traversal attempt
curl -X POST http://localhost:8080/generate \
  -F "company_name=../../etc/passwd" \
  -F "description=Test"
```

### 3. Test File Size Limits

```bash
# Create large image
dd if=/dev/zero of=large_image.jpg bs=1M count=10

# Try to upload
curl -X POST http://localhost:8080/generate \
  -F "company_name=Test" \
  -F "description=Test" \
  -F "images=@large_image.jpg"
```

### 4. Scan for vulnerabilities

```bash
# Docker image scan
docker scan fastapi_generator:latest

# Dependencies scan
cd api
pip install safety
safety check -r requirements.txt
```

## Integration Testing

### Test Ollama Integration

```bash
# Check if models are loaded
docker exec ollama ollama list

# Test model directly
docker exec ollama ollama run qwen2.5-coder:7b "Write a simple HTML page"
```

### Test Complete Flow

```python
import requests
import zipfile
import io

# Generate website
response = requests.post(
    "http://localhost:8080/generate",
    data={
        "company_name": "Integration Test",
        "description": "Testing complete flow",
        "pages": "home,about,contact"
    }
)

assert response.status_code == 200
assert response.headers['Content-Type'] == 'application/zip'

# Verify ZIP contents
zip_data = io.BytesIO(response.content)
with zipfile.ZipFile(zip_data, 'r') as zip_file:
    files = zip_file.namelist()

    assert 'index.html' in files
    assert 'styles.css' in files
    assert 'script.js' in files

    # Verify HTML is valid
    html_content = zip_file.read('index.html').decode('utf-8')
    assert '<!DOCTYPE html>' in html_content
    assert '</html>' in html_content

    print("✅ All files present and valid")
```

## Performance Benchmarks

### Expected Performance

- Health check: < 100ms
- Generation (no images): 30-60 seconds
- Generation (with images): 40-90 seconds

### Monitoring

```bash
# CPU and Memory usage
docker stats fastapi_generator ollama

# Request duration
docker logs fastapi_generator | grep "duration="

# Error rate
docker logs fastapi_generator | grep ERROR
```

## Continuous Integration

### GitHub Actions Example

```.yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2

    - name: Set up Docker Compose
      run: docker-compose up -d

    - name: Wait for services
      run: sleep 30

    - name: Run health check
      run: |
        curl -f http://localhost:8080/health || exit 1

    - name: Run tests
      run: python3 test_api.py

    - name: Cleanup
      run: docker-compose down
```

## Troubleshooting Tests

### Test fails with timeout

- Increase REQUEST_TIMEOUT in docker-compose.yml
- Check if Ollama has enough memory
- Verify models are downloaded

### Test fails with 502 error

- Check Ollama logs: `docker logs ollama`
- Ensure models are pulled correctly
- Verify network connectivity between containers

### ZIP file is corrupted

- Check API logs for generation errors
- Verify JSON parsing is working
- Test with simpler prompts first

## Pre-Production Checklist

- [ ] All unit tests pass
- [ ] Load tests complete successfully
- [ ] Security tests show no vulnerabilities
- [ ] Rate limiting works correctly
- [ ] Error handling is robust
- [ ] Logs are properly formatted
- [ ] Health checks are reliable
- [ ] Documentation is complete
- [ ] Environment variables are configured
- [ ] Backup and recovery tested
