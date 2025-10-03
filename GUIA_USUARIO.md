# 🚀 Guía del Usuario - Generador de Sitios Web con IA

## 📋 Tabla de Contenidos
1. [Inicio Rápido](#inicio-rápido)
2. [Cómo Usar el Formulario](#cómo-usar-el-formulario)
3. [Temas Disponibles](#temas-disponibles)
4. [Subida de Imágenes](#subida-de-imágenes)
5. [Descarga y Uso del Sitio](#descarga-y-uso-del-sitio)
6. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Inicio Rápido

### Paso 1: Iniciar los Servicios

```bash
# Iniciar los servicios de backend (Docker)
docker-compose up -d

# Verificar que estén funcionando
curl http://localhost:8080/health
```

### Paso 2: Abrir la Aplicación

1. Abre `index.html` en tu navegador
2. Navega a la página **Demo** usando el menú
3. ¡Empieza a generar sitios web!

---

## 📝 Cómo Usar el Formulario

### 1. **Descripción del Negocio**
Escribe una descripción detallada de tu empresa o proyecto:

**Ejemplo:**
```
Una empresa innovadora de tecnología especializada en desarrollo 
web, diseño UX/UI y soluciones digitales para pequeñas y medianas 
empresas. Nos enfocamos en crear experiencias digitales modernas 
y accesibles.
```

**Consejos:**
- Sé específico sobre tu industria
- Menciona tus servicios principales
- Incluye tu propuesta de valor única
- Usa entre 50-500 caracteres para mejores resultados

### 2. **Selección de Idiomas**
Marca los idiomas en los que quieres que esté disponible tu sitio:

- 🇯🇵 **Japonés** - Para mercado japonés
- 🇬🇧 **Inglés** - Internacional
- 🇪🇸 **Español** - Mercado hispano
- 🇫🇷 **Francés** - Mercado francófono
- 🇩🇪 **Alemán** - Mercado alemán

**Nota:** La IA generará contenido apropiado para cada idioma seleccionado.

### 3. **Subir Imágenes** (Opcional)
Puedes subir hasta 3 imágenes para que la IA:
- Extraiga la paleta de colores de tu marca
- Use los colores en el diseño del sitio
- Adapte el tema visual según tus imágenes

**Formatos aceptados:** JPG, PNG, GIF, WEBP  
**Tamaño máximo por imagen:** 5MB

### 4. **Seleccionar Tema**
Usa el carrusel para elegir uno de los 5 temas disponibles.

---

## 🎨 Temas Disponibles

### 1. **Modern** (Moderno) 
**Ideal para:** Startups tecnológicas, empresas de software, agencias digitales

**Características:**
- Colores: Azul (#3B82F6) con tonos limpios
- Diseño limpio y contemporáneo
- Layouts basados en cards/tarjetas
- Sombras sutiles y efectos de profundidad
- Tipografía sans-serif moderna

**Ejemplo de uso:**
```
"Empresa de software SaaS para gestión de proyectos"
```

---

### 2. **Minimalist** (Minimalista)
**Ideal para:** Diseñadores, arquitectos, fotógrafos, portfolios personales

**Características:**
- Colores: Monocromo (negro, grises, blanco)
- Espacios en blanco generosos
- Tipografía simple y legible
- Sin decoraciones innecesarias
- Enfoque en contenido

**Ejemplo de uso:**
```
"Portfolio de diseño gráfico y fotografía artística"
```

---

### 3. **Colorful** (Colorido)
**Ideal para:** Agencias creativas, marcas juveniles, eventos, educación

**Características:**
- Colores: Púrpura (#8B5CF6), Rosa (#EC4899), Naranja (#F59E0B)
- Paleta vibrante y alegre
- Gradientes atractivos
- Tipografía bold y expresiva
- Diseño juguetón y energético

**Ejemplo de uso:**
```
"Agencia de marketing digital para marcas millennials"
```

---

### 4. **Elegant** (Elegante)
**Ideal para:** Marcas de lujo, joyerías, spas, boutiques, servicios premium

**Características:**
- Colores: Púrpura/Lavanda (#9333EA, #C084FC)
- Diseño sofisticado y refinado
- Fuentes serif elegantes
- Espaciado refinado
- Sensación de lujo y exclusividad

**Ejemplo de uso:**
```
"Spa boutique y centro de bienestar de alto nivel"
```

---

### 5. **Dark** (Oscuro)
**Ideal para:** Gaming, tech, música, entretenimiento, productos tech

**Características:**
- Fondo oscuro (#111827)
- Acentos neón verde (#10B981)
- Alto contraste
- Estilo moderno dark UI
- Perfecto para audiencias tech-savvy

**Ejemplo de uso:**
```
"Plataforma de streaming de gaming y esports"
```

---

## 📸 Subida de Imágenes

### Cómo Subir Imágenes

1. **Click o Drag & Drop**
   - Haz click en el área de carga
   - O arrastra tus imágenes directamente

2. **Previsualización**
   - Las imágenes aparecerán como miniaturas
   - Puedes eliminar cualquier imagen con el botón ×

3. **Análisis Automático**
   - La IA analiza automáticamente los colores
   - Extrae la paleta de colores dominante
   - Adapta el tema al estilo de tus imágenes

### Recomendaciones

**✅ Buenas Prácticas:**
- Usa el logo de tu empresa
- Incluye fotos de productos/servicios
- Asegúrate de que las imágenes representen tu marca
- Usa imágenes de alta calidad (pero no exceder 5MB)

**❌ Evita:**
- Imágenes muy oscuras o borrosas
- Screenshots con mucho texto
- Imágenes irrelevantes al negocio
- Más de 3 imágenes (solo se usan las primeras 3)

---

## 💾 Descarga y Uso del Sitio

### Proceso de Generación

1. **Envío del Formulario**
   - Click en "生成する" (Generar)
   - Aparecerá un spinner de carga
   - Verás el progreso paso a paso

2. **Tiempo de Espera**
   - **Promedio:** 30-90 segundos
   - **Factores:** Complejidad, número de páginas, imágenes
   - ⚠️ **NO cierres la página** durante la generación

3. **Descarga Automática**
   - El archivo ZIP se descarga automáticamente
   - Nombre: `website-[tema]-[timestamp].zip`
   - Tamaño típico: 2-10 KB

### Contenido del ZIP

```
website-modern-1234567890.zip
├── index.html           # Página principal
├── servicios.html       # Página de servicios
├── contacto.html        # Página de contacto
├── sobre-nosotros.html  # Sobre nosotros (según idiomas)
├── styles.css           # Estilos personalizados
└── script.js            # JavaScript interactivo
```

### Cómo Usar el Sitio Generado

#### Opción 1: Previsualización Local (Más Rápido)

```bash
# 1. Extrae el ZIP
unzip website-modern-1234567890.zip -d mi-sitio

# 2. Navega al directorio
cd mi-sitio

# 3. Inicia servidor local
python3 -m http.server 8000

# 4. Abre en navegador
open http://localhost:8000
```

#### Opción 2: Abrir Directamente

```bash
# Simplemente abre el index.html
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

#### Opción 3: Subir a Hosting

**Netlify (Gratis):**
```bash
# Instala Netlify CLI
npm install -g netlify-cli

# Despliega
cd mi-sitio
netlify deploy --prod
```

**GitHub Pages:**
```bash
# Crea repositorio en GitHub
git init
git add .
git commit -m "Mi sitio web generado por IA"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main

# Activa GitHub Pages en Settings > Pages
```

**Vercel, Render, CloudFlare Pages:** Soportados también!

---

## 🔧 Solución de Problemas

### Problema: "Error al Generar el Sitio Web"

**Causas comunes:**
1. ✗ API no está ejecutándose
2. ✗ Sin conexión a internet
3. ✗ Descripción demasiado larga
4. ✗ Imágenes muy grandes

**Soluciones:**

```bash
# 1. Verificar que el API esté corriendo
docker ps | grep fastapi

# 2. Reiniciar servicios
docker-compose restart

# 3. Ver logs de errores
docker logs fastapi_generator --tail 50

# 4. Verificar salud del API
curl http://localhost:8080/health
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "ollama_connected": true
}
```

---

### Problema: "Descarga muy lenta o se congela"

**Soluciones:**
- Reduce el número de imágenes
- Usa una descripción más corta
- Selecciona menos páginas (idiomas)
- Verifica tu conexión a internet
- Reinicia Docker: `docker-compose restart`

---

### Problema: "El sitio generado no se ve bien"

**Posibles causas:**
1. No usaste servidor local (rutas relativas)
2. Faltan archivos CSS/JS
3. Navegador antiguo

**Soluciones:**
1. Usa un servidor HTTP local (ver arriba)
2. Verifica que todos los archivos estén extraídos
3. Usa un navegador moderno (Chrome, Firefox, Safari, Edge)

---

### Problema: "CORS Error" en la consola del navegador

**Solución:**
```bash
# El API ya tiene CORS habilitado, pero verifica:
docker logs fastapi_generator | grep CORS

# Si persiste, asegúrate de acceder vía http://localhost
# NO uses file:/// directamente
```

---

## 📊 Estadísticas y Límites

### Límites del Sistema

| Recurso | Límite | Razón |
|---------|--------|-------|
| Páginas por sitio | 5 máximo | Optimización de tiempo |
| Imágenes | 3 máximo | Análisis de colores |
| Tamaño por imagen | 5 MB | Procesamiento rápido |
| Descripción | 2000 caracteres | Calidad del prompt |
| Requests por minuto | 10 | Rate limiting |
| Timeout de generación | 300 segundos | Evitar bloqueos |

### Tiempos Promedio

| Configuración | Tiempo Estimado |
|--------------|-----------------|
| Sitio simple (3 páginas, sin imágenes) | 30-45 segundos |
| Sitio completo (5 páginas, 3 imágenes) | 60-90 segundos |
| Sitio con análisis de imágenes | +15-20 segundos |

---

## 🎓 Consejos Pro

### Para Mejores Resultados

1. **Descripción Detallada**
   ```
   ❌ Malo: "Una empresa de tecnología"
   ✅ Bueno: "Una startup de inteligencia artificial especializada 
              en análisis predictivo para retail, con soluciones 
              cloud-native y enfoque en SMB en Latinoamérica"
   ```

2. **Combina Tema + Imágenes**
   - Sube logo con colores de tu marca
   - Elige tema que complemente tus colores
   - La IA fusionará ambos estilos

3. **Prueba Diferentes Temas**
   - Genera varios sitios con diferentes temas
   - Compara resultados
   - Combina elementos de cada uno

4. **Personalización Post-Generación**
   - Los archivos son HTML/CSS/JS estándar
   - Fácil de modificar en cualquier editor
   - Agrega tu propio contenido e imágenes

---

## 🆘 Soporte

### Recursos Adicionales

- **Documentación API:** `README_API.md`
- **Guía de Seguridad:** `SECURITY.md`
- **Testing:** `TESTING.md`
- **Arquitectura:** `PROJECT_SUMMARY.md`

### Contacto

- **Reportar Bugs:** [GitHub Issues](https://github.com/robmg9655/LearningCode/issues)
- **Preguntas:** Ver documentación en la carpeta del proyecto

---

## ✨ Próximas Funcionalidades

- [ ] Editor en vivo de sitios generados
- [ ] Más temas (Retro, Futurista, Corporate)
- [ ] Generación de sitios multiidioma real
- [ ] Integración con CMS
- [ ] Export a frameworks (React, Vue, Next.js)
- [ ] Análisis de SEO automático
- [ ] Generación de contenido con IA

---

**¡Disfruta generando sitios web increíbles con IA!** 🚀✨
