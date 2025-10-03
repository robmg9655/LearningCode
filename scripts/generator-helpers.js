// Funciones auxiliares para el generador de sitios web

// Descripción de temas
function getThemeDescription(theme) {
  const descriptions = {
    modern: "azul profesional y diseño limpio",
    minimalist: "monocromo y espacios blancos",
    colorful: "vibrantes y gradientes atractivos",
    elegant: "púrpura sofisticado y refinado",
    dark: "oscuro con acentos neón verdes"
  };
  return descriptions[theme] || "modernos y profesionales";
}

// Obtener icono según tipo de archivo
function getFileIcon(filename) {
  if (filename.endsWith('.html')) return '📄';
  if (filename.endsWith('.css')) return '🎨';
  if (filename.endsWith('.js')) return '⚡';
  if (filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return '🖼️';
  return '📁';
}

// Descargar el sitio web generado
function downloadGeneratedWebsite() {
  if (!window.generatedWebsite) {
    alert('No hay sitio web generado para descargar');
    return;
  }
  
  const a = document.createElement("a");
  a.href = window.generatedWebsite.zipUrl;
  a.download = window.generatedWebsite.fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Mostrar notificación
  showNotification('✅ Descarga iniciada', 'success');
}

// Previsualizar el sitio web generado
async function previewGeneratedWebsite() {
  if (!window.generatedWebsite) {
    alert('No hay sitio web generado para previsualizar');
    return;
  }
  
  try {
    // Mostrar loading
    showNotification('⏳ Preparando vista previa...', 'info');
    
    // Extraer archivos del ZIP
    const JSZip = window.JSZip;
    if (!JSZip) {
      // Si no está disponible JSZip, descargar y abrir manualmente
      alert('Por favor, descarga el ZIP y ábrelo manualmente en tu navegador');
      downloadGeneratedWebsite();
      return;
    }
    
    const zip = await JSZip.loadAsync(window.generatedWebsite.blob);
    const files = {};
    
    // Extraer todos los archivos
    for (const [filename, file] of Object.entries(zip.files)) {
      if (!file.dir) {
        const content = await file.async('text');
        files[filename] = content;
      }
    }
    
    // Buscar index.html
    const indexFile = files['index.html'] || files['inicio.html'] || Object.keys(files).find(f => f.endsWith('.html'));
    
    if (!indexFile) {
      throw new Error('No se encontró archivo HTML principal');
    }
    
    // Crear modal de previsualización
    const modal = document.createElement('div');
    modal.className = 'preview-modal active';
    modal.innerHTML = `
      <div class="preview-modal-content">
        <div class="preview-header">
          <h2>👁️ Vista Previa del Sitio Web</h2>
          <div class="preview-controls">
            <button class="btn-icon-only" onclick="togglePreviewDevice('desktop')" title="Vista Escritorio">
              🖥️
            </button>
            <button class="btn-icon-only" onclick="togglePreviewDevice('tablet')" title="Vista Tablet">
              📱
            </button>
            <button class="btn-icon-only" onclick="togglePreviewDevice('mobile')" title="Vista Móvil">
              📱
            </button>
            <button class="btn-icon-only" onclick="closePreview()" title="Cerrar">
              ✕
            </button>
          </div>
        </div>
        <div class="preview-body" id="previewBody">
          <iframe 
            id="previewFrame" 
            class="preview-iframe desktop"
            sandbox="allow-scripts allow-same-origin"
            title="Vista previa del sitio web"
          ></iframe>
        </div>
        <div class="preview-footer">
          <span class="preview-theme-badge">Tema: ${window.generatedWebsite.theme}</span>
          <button class="btn btn-primary" onclick="downloadGeneratedWebsite()">
            Descargar ZIP
          </button>
          <button class="btn btn-secondary" onclick="closePreview()">
            Cerrar
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Cargar contenido en el iframe
    const iframe = document.getElementById('previewFrame');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Crear el HTML completo con recursos inline
    let htmlContent = files[indexFile];
    
    // Reemplazar referencias a CSS
    if (files['styles.css']) {
      htmlContent = htmlContent.replace(
        /<link[^>]*href=["']styles\.css["'][^>]*>/gi,
        `<style>${files['styles.css']}</style>`
      );
    }
    
    // Reemplazar referencias a JS
    if (files['script.js']) {
      htmlContent = htmlContent.replace(
        /<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi,
        `<script>${files['script.js']}<\/script>`
      );
    }
    
    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
    
    showNotification('✅ Vista previa cargada', 'success');
    
  } catch (error) {
    console.error('Error al previsualizar:', error);
    alert('Error al preparar la vista previa. Por favor, descarga el ZIP y ábrelo manualmente.');
    showNotification('❌ Error en vista previa', 'error');
  }
}

// Cerrar modal de previsualización
function closePreview() {
  const modal = document.querySelector('.preview-modal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = 'auto';
    }, 300);
  }
}

// Cambiar dispositivo de previsualización
function togglePreviewDevice(device) {
  const iframe = document.getElementById('previewFrame');
  if (iframe) {
    iframe.className = `preview-iframe ${device}`;
  }
}

// Mostrar notificación
function showNotification(message, type = 'info') {
  // Eliminar notificaciones anteriores
  const existing = document.querySelector('.toast-notification');
  if (existing) {
    existing.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `toast-notification ${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Animar entrada
  setTimeout(() => notification.classList.add('show'), 100);
  
  // Auto-ocultar después de 3 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
