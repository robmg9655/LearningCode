# AI Website Generator

Servicio de generación de sitios web estáticos multipágina usando IA (Ollama + FastAPI).

## 🚀 Características

- Generación de sitios web de 3-5 páginas personalizados
- Análisis de imágenes para paleta de colores
- Modo oscuro opcional
- Diseño responsive y moderno
- Validación de seguridad robusta
- Rate limiting por IP
- Arquitectura de microservicios con Docker

## 📋 Requisitos Previos

- Docker y Docker Compose instalados
- Al menos 8GB de RAM (recomendado 16GB)
- 20GB de espacio en disco para modelos de Ollama

## 🛠️ Instalación

1. Clona el repositorio:

```bash
git clone <repository-url>
cd LearningCode-1
```

2. Inicia los servicios:

```bash
docker-compose up -d
```

3. Descarga los modelos de Ollama (primera vez):

```bash
# Modelo de código
docker exec -it ollama ollama pull qwen2.5-coder:7b

# Modelo de visión (opcional)
docker exec -it ollama ollama pull llama3.2-vision
```

4. Verifica que los servicios estén funcionando:

```bash
curl http://localhost:8080/health
```

## 🔧 Configuración

Variables de entorno en `docker-compose.yml`:

- `OLLAMA_HOST`: URL del servicio Ollama (default: http://ollama:11434)
- `CODE_MODEL`: Modelo para generar código (default: qwen2.5-coder:7b)
- `VISION_MODEL`: Modelo para análisis de imágenes (default: llama3.2-vision)
- `MAX_PAGES`: Máximo de páginas a generar (default: 5)
- `MAX_DESCRIPTION_LENGTH`: Longitud máxima de descripción (default: 2000)
- `MAX_IMAGES`: Máximo de imágenes por request (default: 3)
- `MAX_IMAGE_SIZE_MB`: Tamaño máximo por imagen (default: 5MB)
- `REQUEST_TIMEOUT`: Timeout de generación (default: 300s)
- `RATE_LIMIT_PER_MINUTE`: Límite de requests por IP (default: 10/minute)

## 📡 API Endpoints

### GET /health

Verifica el estado del servicio.

**Response:**

```json
{
  "status": "healthy",
  "ollama_connected": true
}
```

### POST /generate

Genera un sitio web multipágina.

**Parameters (multipart/form-data):**

- `company_name` (required): Nombre de la empresa
- `description` (required): Descripción del negocio
- `theme_hint` (optional): Tema visual (ej: "modern", "elegant")
- `pages` (optional): Páginas separadas por comas (ej: "home,about,contact")
- `require_dark_mode` (optional): Boolean para modo oscuro
- `images` (optional): Hasta 3 imágenes para inspiración de diseño

**Response:**

- ZIP file con todos los archivos del sitio web

**Example usando cURL:**

```bash
curl -X POST http://localhost:8080/generate \
  -F "company_name=TechCorp" \
  -F "description=Empresa de tecnología innovadora" \
  -F "theme_hint=modern" \
  -F "pages=home,about,services,contact" \
  -F "require_dark_mode=true" \
  -o website.zip
```

**Example usando Python:**

```python
import requests

url = "http://localhost:8080/generate"
data = {
    "company_name": "TechCorp",
    "description": "Empresa de tecnología innovadora",
    "theme_hint": "modern",
    "pages": "home,about,services,contact",
    "require_dark_mode": True
}

response = requests.post(url, data=data)
with open("website.zip", "wb") as f:
    f.write(response.content)
```

## 🔒 Seguridad

Medidas de seguridad implementadas:

1. **Rate Limiting**: 10 requests por minuto por IP
2. **Validación de Input**:
   - Sanitización de caracteres peligrosos (XSS)
   - Límites de longitud en todos los campos
   - Validación de nombres de páginas contra whitelist
3. **Validación de Imágenes**:
   - Límite de tamaño (5MB por imagen)
   - Verificación de formato válido
   - Máximo 3 imágenes por request
4. **Container Security**:
   - Usuario no-root en contenedor
   - Sin privilegios elevados
   - Red aislada entre servicios
5. **Timeout Protection**: Timeout de 300 segundos para prevenir DoS
6. **CORS**: Configurar origins permitidos en producción

## 🐛 Troubleshooting

### Los modelos tardan mucho en responder

- Primera ejecución: Los modelos se descargan automáticamente
- Asegúrate de tener suficiente RAM (mínimo 8GB)
- Considera usar modelos más pequeños

### Error "Ollama not connected"

```bash
# Verifica que Ollama esté corriendo
docker ps | grep ollama

# Reinicia el servicio
docker-compose restart ollama

# Verifica logs
docker logs ollama
```

### Error de memoria

```bash
# Aumenta la memoria de Docker en Docker Desktop
# O usa un modelo más pequeño en docker-compose.yml
```

### Rate limit excedido

- Espera 1 minuto entre requests
- O ajusta `RATE_LIMIT_PER_MINUTE` en docker-compose.yml

## 📊 Monitoreo

Ver logs en tiempo real:

```bash
# API
docker logs -f fastapi_generator

# Ollama
docker logs -f ollama
```

## 🔄 Actualización

```bash
# Detener servicios
docker-compose down

# Actualizar código
git pull

# Reconstruir y reiniciar
docker-compose up -d --build
```

## 🛑 Detener Servicios

```bash
# Detener contenedores
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Eliminar todo incluyendo volúmenes
docker-compose down -v
```

## 📝 Notas de Producción

Para desplegar en producción:

1. **Configura CORS** en `api/main.py`:

   ```python
   allow_origins=["https://your-domain.com"]
   ```

2. **Usa HTTPS**: Configura un reverse proxy (nginx/traefik) con SSL

3. **Variables de Entorno**: Usa archivos `.env` y secrets de Docker

4. **Base de Datos**: Considera agregar persistencia para tracking

5. **Monitoring**: Integra con Prometheus/Grafana

6. **Backups**: Configura backups regulares del volumen `ollama_data`

7. **Firewall**: Expone solo los puertos necesarios

8. **Rate Limiting Avanzado**: Considera usar Redis para rate limiting distribuido

## 📄 Licencia

[Tu licencia aquí]

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue primero para discutir cambios mayores.
