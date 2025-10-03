#!/bin/bash

# Script para iniciar los servicios y descargar modelos

echo "🚀 Iniciando servicios..."
docker-compose up -d

echo "⏳ Esperando a que Ollama esté listo..."
sleep 10

echo "📥 Descargando modelo de código (esto puede tardar varios minutos)..."
docker exec -it ollama ollama pull qwen2.5-coder:7b

echo "📥 Descargando modelo de visión (opcional)..."
docker exec -it ollama ollama pull llama3.2-vision

echo "✅ Verificando estado de los servicios..."
curl http://localhost:8080/health

echo ""
echo "✨ ¡Listo! Los servicios están corriendo:"
echo "  - API: http://localhost:8080"
echo "  - Ollama: http://localhost:11434"
echo ""
echo "Para probar el API:"
echo "  curl -X POST http://localhost:8080/generate \\"
echo "    -F 'company_name=MiEmpresa' \\"
echo "    -F 'description=Una empresa innovadora' \\"
echo "    -o website.zip"
