#!/bin/bash

# Script para probar todos los temas del generador de sitios web
# Genera un sitio de ejemplo para cada tema disponible

echo "🚀 Probando Generador de Sitios Web con IA"
echo "=========================================="
echo ""

# Array de temas disponibles
themes=("modern" "minimalist" "colorful" "elegant" "dark")

# Descripciones de negocio para cada tema
declare -A descriptions
descriptions["modern"]="Una startup tecnológica innovadora especializada en desarrollo de software SaaS, con soluciones cloud-native para empresas modernas."
descriptions["minimalist"]="Estudio de diseño gráfico y fotografía artística enfocado en proyectos minimalistas y elegantes para clientes selectos."
descriptions["colorful"]="Agencia de marketing digital creativa para marcas juveniles, especializada en redes sociales y campañas virales."
descriptions["elegant"]="Spa boutique y centro de bienestar de lujo, ofreciendo tratamientos exclusivos y experiencias de relajación premium."
descriptions["dark"]="Plataforma de streaming para gamers y esports, con contenido exclusivo y comunidad activa de jugadores profesionales."

# Nombres de empresa para cada tema
declare -A companies
companies["modern"]="TechVision Solutions"
companies["minimalist"]="Minimal Studio"
companies["colorful"]="Rainbow Digital"
companies["elegant"]="Elegance Spa"
companies["dark"]="DarkGaming Pro"

# Directorio de salida
output_dir="test_websites"
mkdir -p "$output_dir"

echo "📁 Directorio de salida: $output_dir"
echo ""

# Función para generar sitio
generate_site() {
    local theme=$1
    local company="${companies[$theme]}"
    local description="${descriptions[$theme]}"
    local output_file="$output_dir/website-$theme.zip"
    
    echo "🎨 Generando sitio con tema: $theme"
    echo "   Empresa: $company"
    echo "   Descripción: ${description:0:60}..."
    echo "   ⏳ Generando (30-90 segundos)..."
    
    # Llamar al API
    curl -X POST http://localhost:8080/generate \
        -F "company_name=$company" \
        -F "description=$description" \
        -F "theme_hint=$theme" \
        -F "pages=inicio,servicios,sobre-nosotros,contacto" \
        -o "$output_file" \
        --silent \
        --show-error
    
    # Verificar resultado
    if [ -f "$output_file" ]; then
        file_size=$(ls -lh "$output_file" | awk '{print $5}')
        
        # Verificar si es un ZIP válido
        if file "$output_file" | grep -q "Zip archive"; then
            echo "   ✅ Generado exitosamente: $output_file ($file_size)"
            
            # Extraer el ZIP
            extract_dir="$output_dir/$theme"
            mkdir -p "$extract_dir"
            unzip -q -o "$output_file" -d "$extract_dir"
            
            echo "   📦 Extraído en: $extract_dir"
            echo "   📄 Archivos generados:"
            ls -1 "$extract_dir" | sed 's/^/      - /'
        else
            echo "   ❌ Error: No se generó un ZIP válido"
            echo "   Contenido del archivo:"
            cat "$output_file"
        fi
    else
        echo "   ❌ Error: No se pudo generar el sitio"
    fi
    
    echo ""
}

# Verificar que el API esté funcionando
echo "🔍 Verificando API..."
health_response=$(curl -s http://localhost:8080/health)

if echo "$health_response" | grep -q "healthy"; then
    echo "✅ API funcionando correctamente"
    echo ""
else
    echo "❌ Error: API no está respondiendo"
    echo "   Respuesta: $health_response"
    echo ""
    echo "💡 Sugerencia: Ejecuta 'docker-compose up -d' primero"
    exit 1
fi

# Generar sitio para cada tema
for theme in "${themes[@]}"; do
    generate_site "$theme"
    
    # Pequeña pausa entre generaciones (opcional)
    if [ "$theme" != "dark" ]; then
        echo "   ⏸️  Esperando 5 segundos antes del siguiente..."
        sleep 5
        echo ""
    fi
done

echo "=========================================="
echo "✨ ¡Prueba completada!"
echo ""
echo "📊 Resumen:"
echo "   - Temas probados: ${#themes[@]}"
echo "   - Directorio: $output_dir"
echo ""
echo "🌐 Para ver los sitios generados:"
echo "   cd $output_dir"
echo "   # Luego abre cualquier index.html en tu navegador"
echo ""
echo "Ejemplo:"
echo "   open $output_dir/modern/index.html"
echo "   open $output_dir/dark/index.html"
echo ""
