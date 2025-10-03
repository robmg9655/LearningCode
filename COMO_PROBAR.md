# 🚀 Cómo Probar Tu Generador de Sitios Web

## ✅ Estado Actual

Tu sistema está **completamente funcional** con:

- ✅ Backend API corriendo en http://localhost:8080
- ✅ 5 temas listos: modern, minimalist, colorful, elegant, dark
- ✅ Soporte para imágenes
- ✅ Frontend conectado al backend

---

## 🎯 Opción 1: Usar el Frontend (Recomendado)

### Paso 1: Abrir la aplicación

```bash
# Abre la página demo en tu navegador
open /Users/robgm/Documents/LearningCode-1/pages/demo.html
```

### Paso 2: Llenar el formulario

1. **Descripción del negocio**: Escribe algo como:

   ```
   Una empresa moderna de tecnología especializada en desarrollo web
   ```

2. **Idiomas**: Selecciona los que quieras (opcional)

3. **Imágenes**: Sube imágenes si tienes (opcional, máximo 3)

4. **Tema**: Haz clic en uno de los 5 temas del carrusel:

   - Modern (azul)
   - Minimalist (monocromo)
   - Colorful (colores vibrantes)
   - Elegant (púrpura)
   - Dark (oscuro con verde neón)

5. **Click en "生成する"** (Generar)

6. **Espera 30-90 segundos** - verás un spinner de carga

7. **Descarga automática** del ZIP con tu sitio web

---

## 🎯 Opción 2: Prueba Rápida con cURL (5 minutos cada una)

### Tema Modern (Azul)

```bash
curl -X POST http://localhost:8080/generate \
  -F 'company_name=Tech Solutions' \
  -F 'description=Una startup tecnológica innovadora' \
  -F 'theme_hint=modern' \
  -F 'pages=inicio,servicios,contacto' \
  -o website-modern.zip
```

### Tema Colorful (Vibrante)

```bash
curl -X POST http://localhost:8080/generate \
  -F 'company_name=Agencia Creativa' \
  -F 'description=Agencia de marketing digital vibrante' \
  -F 'theme_hint=colorful' \
  -F 'pages=inicio,servicios,contacto' \
  -o website-colorful.zip
```

### Tema Dark (Gaming)

```bash
curl -X POST http://localhost:8080/generate \
  -F 'company_name=DarkGaming' \
  -F 'description=Plataforma de streaming para gamers' \
  -F 'theme_hint=dark' \
  -F 'pages=inicio,servicios,contacto' \
  -o website-dark.zip
```

**Después de cada comando:**

```bash
# Verificar que se generó
file website-modern.zip

# Extraer y ver
unzip website-modern.zip -d test-site
open test-site/index.html
```

---

## 🎯 Opción 3: Probar TODOS los temas automáticamente

```bash
# Este script genera un sitio para cada tema (tarda ~10 minutos)
./test_all_themes.sh
```

Luego puedes ver todos los sitios generados:

```bash
cd test_websites

# Ver cada tema
open modern/index.html
open colorful/index.html
open dark/index.html
open minimalist/index.html
open elegant/index.html
```

---

## ⚡ Prueba Ultra-Rápida (30 segundos)

Si solo quieres verificar que funciona:

```bash
# Prueba simple
curl -X POST http://localhost:8080/generate \
  -F 'company_name=Test' \
  -F 'description=Una empresa de prueba' \
  -F 'theme_hint=modern' \
  -F 'pages=inicio,contacto' \
  -o quick-test.zip && \
unzip -l quick-test.zip
```

Deberías ver algo como:

```
Archive:  quick-test.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
      570  10-03-2025 09:39   index.html
      916  10-03-2025 09:39   contacto.html
      779  10-03-2025 09:39   styles.css
       66  10-03-2025 09:39   script.js
```

---

## 🔍 Verificar que TODO está funcionando

```bash
# 1. Verificar servicios Docker
docker ps | grep -E "(fastapi|ollama)"

# 2. Verificar API
curl http://localhost:8080/health

# 3. Ver logs si hay problemas
docker logs fastapi_generator --tail 20
```

**Respuestas esperadas:**

- Docker: 2 contenedores corriendo (fastapi_generator, ollama)
- Health: `{"status":"healthy","ollama_connected":true}`
- Logs: Sin errores (solo INFO)

---

## 📊 Qué esperar

### Durante la generación (30-90 segundos):

- El comando curl mostrará progreso de descarga
- En el frontend verás un spinner animado
- Los logs mostrarán peticiones a Ollama

### Después de la generación:

- Archivo ZIP de ~2-5 KB
- Contiene: index.html, servicios.html, contacto.html, styles.css, script.js
- Cada HTML tiene navegación completa
- CSS adaptado al tema seleccionado
- JavaScript para interactividad

---

## 🎨 Diferencias entre Temas

Cuando abras los sitios, verás:

**Modern**:

- Colores azul (#3B82F6)
- Cards con sombras
- Diseño limpio

**Colorful**:

- Colores vibrantes (púrpura, rosa, naranja)
- Gradientes
- Energético

**Dark**:

- Fondo oscuro (#111827)
- Acentos verde neón
- Alto contraste

**Minimalist**:

- Monocromo (negro, gris, blanco)
- Espacios generosos
- Simple

**Elegant**:

- Púrpura/Lavanda
- Sofisticado
- Lujo

---

## 🐛 Si algo no funciona

### Problema: cURL se queda colgado

```bash
# Reinicia los servicios
docker-compose restart
```

### Problema: Error al generar

```bash
# Ver logs detallados
docker logs fastapi_generator --tail 50

# Verificar Ollama
docker logs ollama --tail 20
```

### Problema: ZIP no válido

```bash
# Ver qué devolvió el API
cat website-modern.zip

# Si ves un mensaje de error JSON, revisa los logs
```

---

## ✨ Próximos Pasos

1. **Prueba el frontend**: Es más visual y fácil

   ```bash
   open pages/demo.html
   ```

2. **Genera varios sitios**: Prueba diferentes temas y descripciones

3. **Personaliza**: Los archivos HTML/CSS/JS son editables

4. **Deploy**: Sube a Netlify, Vercel, o GitHub Pages

---

## 📚 Documentación Completa

- `GUIA_USUARIO.md` - Guía completa del usuario (muy detallada)
- `RESUMEN_IMPLEMENTACION.md` - Todo lo que se implementó
- `README_API.md` - Documentación del API
- `SECURITY.md` - Guía de seguridad
- `TESTING.md` - Procedimientos de testing

---

**¡Diviértete generando sitios web con IA!** 🎉
