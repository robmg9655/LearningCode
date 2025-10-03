# Security Checklist for Production Deployment

## ✅ Before Deploying to Production

### 1. Network Security

- [ ] Configure firewall rules (allow only necessary ports)
- [ ] Set up VPC/private network for container communication
- [ ] Use HTTPS/TLS for all external communication
- [ ] Configure reverse proxy (nginx/traefik) with SSL certificates

### 2. Application Security

- [ ] Update CORS origins in `api/main.py` to specific domains
- [ ] Implement API key authentication
- [ ] Enable request logging and monitoring
- [ ] Set up intrusion detection system (IDS)
- [ ] Configure proper rate limiting per user/API key
- [ ] Add request size limits at reverse proxy level

### 3. Container Security

- [ ] Run containers as non-root user (already implemented)
- [ ] Scan images for vulnerabilities (`docker scan`)
- [ ] Use specific version tags instead of `latest`
- [ ] Enable read-only root filesystem where possible
- [ ] Limit container resources (CPU, memory)
- [ ] Use Docker secrets for sensitive data

### 4. Data Security

- [ ] Encrypt data at rest
- [ ] Encrypt data in transit (TLS)
- [ ] Implement proper backup strategy
- [ ] Set up log rotation and retention policies
- [ ] Sanitize logs (remove sensitive data)

### 5. Access Control

- [ ] Implement authentication (JWT, OAuth2)
- [ ] Use role-based access control (RBAC)
- [ ] Enable 2FA for admin access
- [ ] Rotate API keys regularly
- [ ] Audit access logs regularly

### 6. Monitoring & Alerts

- [ ] Set up health check monitoring
- [ ] Configure error alerting (Sentry, CloudWatch)
- [ ] Monitor resource usage (CPU, memory, disk)
- [ ] Set up log aggregation (ELK, Splunk)
- [ ] Configure security alerts (failed auth attempts, rate limit exceeded)

### 7. Updates & Maintenance

- [ ] Keep Docker images updated
- [ ] Update Python dependencies regularly
- [ ] Monitor security advisories
- [ ] Test updates in staging environment first
- [ ] Have rollback plan ready

### 8. Compliance

- [ ] GDPR compliance (if applicable)
- [ ] Data retention policies
- [ ] Terms of service
- [ ] Privacy policy
- [ ] Content moderation for user inputs

### 9. Performance

- [ ] Load testing
- [ ] Database connection pooling
- [ ] Caching strategy (Redis)
- [ ] CDN for static assets
- [ ] Auto-scaling configuration

### 10. Disaster Recovery

- [ ] Automated backups
- [ ] Backup restoration testing
- [ ] Disaster recovery plan
- [ ] High availability setup
- [ ] Multi-region deployment (if needed)

## 🚨 Critical Security Configurations

### Update docker-compose.yml for Production

```yaml
services:
  api:
    environment:
      - ALLOWED_ORIGINS=https://yourdomain.com
      - SECURE_COOKIES=true
      - API_KEY_REQUIRED=true
    deploy:
      resources:
        limits:
          cpus: "2"
          memory: 4G
        reservations:
          cpus: "1"
          memory: 2G
```

### Add nginx reverse proxy

```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/m;
    limit_req zone=api_limit burst=20 nodelay;

    # Request size limit
    client_max_body_size 20M;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

### Enable API Key Authentication

Update `api/main.py`:

```python
from fastapi import Header, HTTPException

API_KEY = os.getenv("API_KEY", "")

async def verify_api_key(x_api_key: str = Header(...)):
    if not API_KEY or x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return x_api_key

@app.post("/generate", dependencies=[Depends(verify_api_key)])
async def generate_website(...):
    # ... existing code
```

## 📊 Monitoring Setup

### Prometheus metrics

```python
from prometheus_client import Counter, Histogram

requests_total = Counter('requests_total', 'Total requests')
request_duration = Histogram('request_duration_seconds', 'Request duration')
```

### Health check with detailed info

```python
@app.get("/health/detailed")
async def detailed_health():
    return {
        "api": "healthy",
        "ollama": await check_ollama_health(),
        "disk_usage": get_disk_usage(),
        "memory_usage": get_memory_usage(),
        "uptime": get_uptime()
    }
```

## 🔐 Additional Security Recommendations

1. **Input Validation**: Already implemented with Pydantic
2. **Output Encoding**: Ensure generated HTML is safe
3. **Content Security Policy**: Add CSP headers
4. **CSRF Protection**: Implement CSRF tokens for state-changing operations
5. **SQL Injection**: Use parameterized queries (when adding DB)
6. **XSS Prevention**: Already sanitizing inputs
7. **DDoS Protection**: Use CloudFlare or AWS Shield
8. **Penetration Testing**: Conduct regular security audits
9. **Bug Bounty Program**: Consider when service grows
10. **Incident Response Plan**: Document procedures for security incidents

## 📝 Regular Security Tasks

### Daily

- Monitor error logs
- Check rate limit violations
- Review failed authentication attempts

### Weekly

- Review access logs
- Check for security updates
- Monitor resource usage trends

### Monthly

- Update dependencies
- Rotate API keys
- Security audit
- Backup verification test

### Quarterly

- Penetration testing
- Review and update security policies
- Disaster recovery drill
- Performance optimization review
