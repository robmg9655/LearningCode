// Main JavaScript para funcionalidad dinámica

// Variables globales
let selectedTheme = "modern";
let uploadedImages = [];

// Función para scroll del carrusel
function scrollCarousel(direction) {
  const wrapper = document.getElementById("themeWrapper");
  if (wrapper) {
    const scrollAmount = 200;
    wrapper.scrollLeft += direction * scrollAmount;
  }
}

// Función para manejar el cambio entre login y signup
document.addEventListener("DOMContentLoaded", function () {
  // Manejo de selección de temas
  const themeCards = document.querySelectorAll(".theme-card");
  themeCards.forEach((card) => {
    card.addEventListener("click", function () {
      themeCards.forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");
      selectedTheme = this.getAttribute("data-theme");
    });
  });

  // Seleccionar el primer tema por defecto
  if (themeCards.length > 0) {
    themeCards[0].classList.add("selected");
  }

  // Manejo de upload de imágenes
  const imageUpload = document.getElementById("imageUpload");
  if (imageUpload) {
    imageUpload.addEventListener("change", function (e) {
      const files = Array.from(e.target.files);
      const preview = document.getElementById("imagePreview");

      files.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = function (e) {
            uploadedImages.push(e.target.result);

            const previewItem = document.createElement("div");
            previewItem.className = "preview-item";
            previewItem.innerHTML = `
                            <img src="${e.target.result}" alt="Preview">
                            <button type="button" class="remove-image" onclick="removeImage(${
                              uploadedImages.length - 1
                            })">×</button>
                        `;
            preview.appendChild(previewItem);
          };
          reader.readAsDataURL(file);
        }
      });
    });
  }

  // Manejo del formulario generador
  const generatorForm = document.getElementById("generatorForm");
  if (generatorForm) {
    generatorForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const businessDesc = document.getElementById("businessDesc").value;
      const selectedLanguages = Array.from(
        document.querySelectorAll('input[name="languages"]:checked')
      ).map((cb) => cb.value);
      const imageFiles = document.getElementById("imageUpload").files;

      // Mostrar estado de carga con animación progresiva
      const resultContainer = document.getElementById("resultContainer");
      resultContainer.innerHTML = `
                <div class="loading-state">
                    <div class="spinner"></div>
                    <h3 id="loadingTitle">🚀 Iniciando generación...</h3>
                    <p id="loadingSubtitle">La IA está preparando tu sitio con el tema <strong>${selectedTheme}</strong></p>
                    <div class="progress-bar-container">
                        <div class="progress-bar" id="progressBar"></div>
                        <span class="progress-text" id="progressText">0%</span>
                    </div>
                    <div class="progress-steps" id="progressSteps">
                        <div class="step" id="step1">
                            <span class="step-icon">📝</span>
                            <span class="step-text">Analizando descripción del negocio</span>
                        </div>
                        <div class="step" id="step2">
                            <span class="step-icon">🖼️</span>
                            <span class="step-text">Procesando y analizando imágenes</span>
                        </div>
                        <div class="step" id="step3">
                            <span class="step-icon">🎨</span>
                            <span class="step-text">Diseñando estructura y estilo</span>
                        </div>
                        <div class="step" id="step4">
                            <span class="step-icon">💻</span>
                            <span class="step-text">Generando código HTML/CSS/JS</span>
                        </div>
                        <div class="step" id="step5">
                            <span class="step-icon">📦</span>
                            <span class="step-text">Compilando y empaquetando sitio</span>
                        </div>
                    </div>
                    <p class="loading-tip" id="loadingTip">💡 Consejo: El tema ${selectedTheme} usa colores ${getThemeDescription(selectedTheme)}</p>
                </div>
            `;

      // Función de progreso animado
      const animateProgress = () => {
        const steps = [
          { id: 'step1', time: 2000, progress: 20, title: '📝 Analizando texto...', tip: 'Extrayendo palabras clave y conceptos principales' },
          { id: 'step2', time: imageFiles.length > 0 ? 8000 : 3000, progress: 40, title: '🖼️ Visualizando imágenes...', tip: 'Analizando colores y composición de las imágenes' },
          { id: 'step3', time: 10000, progress: 60, title: '🎨 Diseñando estilo...', tip: 'Aplicando paleta de colores y tipografía del tema ' + selectedTheme },
          { id: 'step4', time: 15000, progress: 85, title: '💻 Generando código...', tip: 'La IA está escribiendo HTML, CSS y JavaScript optimizado' },
          { id: 'step5', time: 5000, progress: 100, title: '📦 Finalizando...', tip: 'Compilando todos los archivos en un paquete listo para usar' }
        ];

        let currentStep = 0;
        let animationStopped = false;
        
        const updateStep = () => {
          if (animationStopped || currentStep >= steps.length) return;
          
          const step = steps[currentStep];
          
          // Verificar que los elementos aún existen
          const stepEl = document.getElementById(step.id);
          const titleEl = document.getElementById('loadingTitle');
          const tipEl = document.getElementById('loadingTip');
          const progressBar = document.getElementById('progressBar');
          const progressText = document.getElementById('progressText');
          
          if (!stepEl || !titleEl || !tipEl || !progressBar || !progressText) {
            animationStopped = true;
            return;
          }
          
          // Activar paso actual
          stepEl.classList.add('active');
          titleEl.textContent = step.title;
          tipEl.textContent = '💡 ' + step.tip;
          
          // Animar barra de progreso
          progressBar.style.width = step.progress + '%';
          progressText.textContent = step.progress + '%';
          
          // Completar paso después de un tiempo
          setTimeout(() => {
            if (animationStopped) return;
            const stepEl = document.getElementById(step.id);
            if (stepEl) {
              stepEl.classList.add('completed');
            }
            currentStep++;
            if (currentStep < steps.length) {
              updateStep();
            }
          }, step.time);
        };
        
        updateStep();
      };

      // Iniciar animación de progreso
      setTimeout(animateProgress, 500);

      try {
        // Obtener nombre de empresa
        const companyName = document.getElementById("companyName").value.trim();
        
        // Preparar FormData
        const formData = new FormData();
        formData.append("company_name", companyName || "Mi Empresa");
        formData.append("description", businessDesc);
        formData.append("theme_hint", selectedTheme);
        
        // Enviar páginas como string separado por comas (la API lo parsea)
        // Usar nombres simples sin guiones para evitar problemas de validación
        const pagesString = selectedLanguages.length > 1 
          ? "inicio,servicios,nosotros,contacto"
          : "inicio,servicios,contacto";
        
        formData.append("pages", pagesString);

        // Agregar imágenes si existen
        for (let i = 0; i < Math.min(imageFiles.length, 3); i++) {
          formData.append("images", imageFiles[i]);
        }

        // Debug: mostrar los datos que se están enviando
        console.log("Sending request with data:");
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}: ${value.name} (${value.size} bytes)`);
          } else {
            console.log(`  ${key}: ${value}`);
          }
        }

        // Llamar al API
        const response = await fetch("http://localhost:8080/generate", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          // Intentar obtener detalles del error del servidor
          let errorMsg = `Error: ${response.status} ${response.statusText}`;
          try {
            const errorData = await response.json();
            console.error("Server error details:", errorData);
            if (errorData.detail) {
              if (Array.isArray(errorData.detail)) {
                // Error de validación de Pydantic
                errorMsg = "Error de validación:\n" + errorData.detail.map(err => 
                  `- ${err.loc.join('.')}: ${err.msg}`
                ).join('\n');
              } else {
                errorMsg = errorData.detail;
              }
            }
          } catch (e) {
            console.error("Could not parse error response:", e);
          }
          throw new Error(errorMsg);
        }

        // Guardar el ZIP en memoria para descarga/preview
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const fileName = `website-${selectedTheme}-${Date.now()}.zip`;
        
        // Guardar en variable global para las funciones de ayuda
        window.generatedWebsite = {
          zipUrl: url,
          fileName: fileName,
          blob: blob,
          theme: selectedTheme
        };

        // Mostrar animación de finalización primero
        resultContainer.innerHTML = `
          <div class="completion-animation">
            <div class="success-burst">
              <div class="confetti"></div>
              <div class="confetti"></div>
              <div class="confetti"></div>
              <div class="confetti"></div>
              <div class="confetti"></div>
              <div class="confetti"></div>
            </div>
            <div class="success-icon-big">🎉</div>
            <h2 class="success-title">¡Completado!</h2>
            <p class="success-subtitle">Tu sitio web está listo</p>
          </div>
        `;

        // Después de 2 segundos, mostrar resultado completo
        setTimeout(() => {
          resultContainer.innerHTML = `
            <div class="result-content success">
              <div class="success-header">
                <div class="success-icon">✓</div>
                <div>
                  <h2>¡Sitio Web Generado Exitosamente!</h2>
                  <p>Tu sitio web ha sido generado con el tema <strong>${selectedTheme}</strong></p>
                </div>
              </div>
              
              <div class="result-stats">
                <div class="stat-card">
                  <div class="stat-icon">📄</div>
                  <div class="stat-value">3</div>
                  <div class="stat-label">Páginas</div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">🎨</div>
                  <div class="stat-value">${selectedTheme}</div>
                  <div class="stat-label">Tema</div>
                </div>
                <div class="stat-card">
                  <div class="stat-icon">📦</div>
                  <div class="stat-value">${(blob.size / 1024).toFixed(1)} KB</div>
                  <div class="stat-label">Tamaño</div>
                </div>
              </div>

              <div class="action-buttons">
                <button class="btn btn-primary btn-large" onclick="downloadGeneratedWebsite()">
                  <span class="btn-icon">⬇️</span>
                  Descargar ZIP
                </button>
                <button class="btn btn-secondary btn-large" onclick="previewGeneratedWebsite()">
                  <span class="btn-icon">👁️</span>
                  Vista Previa
                </button>
              </div>
              
              <div class="result-item">
                <h3>📦 Contenido del Archivo</h3>
                <div class="file-list">
                  <div class="file-item">
                    <span class="file-icon">📄</span>
                    <span class="file-name">index.html</span>
                    <span class="file-badge">HTML</span>
                  </div>
                  <div class="file-item">
                    <span class="file-icon">📄</span>
                    <span class="file-name">servicios.html</span>
                    <span class="file-badge">HTML</span>
                  </div>
                  <div class="file-item">
                    <span class="file-icon">📄</span>
                    <span class="file-name">contacto.html</span>
                    <span class="file-badge">HTML</span>
                  </div>
                  <div class="file-item">
                    <span class="file-icon">🎨</span>
                    <span class="file-name">styles.css</span>
                    <span class="file-badge">CSS</span>
                  </div>
                  <div class="file-item">
                    <span class="file-icon">⚡</span>
                    <span class="file-name">script.js</span>
                    <span class="file-badge">JS</span>
                  </div>
                </div>
              </div>
              
              <div class="result-item">
                <h3>🚀 Próximos Pasos</h3>
                <ol class="steps-list">
                  <li><strong>Vista Previa:</strong> Haz clic en "Vista Previa" para ver tu sitio en acción</li>
                  <li><strong>Descargar:</strong> Descarga el archivo ZIP cuando estés satisfecho</li>
                  <li><strong>Extraer:</strong> Descomprime el archivo en tu computadora</li>
                  <li><strong>Personalizar:</strong> Edita el contenido HTML según tus necesidades</li>
                  <li><strong>Publicar:</strong> Sube los archivos a tu hosting favorito</li>
                </ol>
              </div>
              
              <button class="btn btn-outline" onclick="location.reload()" style="margin-top: 2rem;">
                Generar Otro Sitio
              </button>
            </div>
          `;
        }, 2000);
      } catch (error) {
        console.error("Error generating website:", error);
        
        // Intentar obtener más detalles del error
        let errorDetail = error.message;
        if (error.response) {
          try {
            const errorData = await error.response.json();
            errorDetail = errorData.detail || error.message;
          } catch (e) {
            // Si no podemos parsear el error, usar el mensaje por defecto
          }
        }
        
        resultContainer.innerHTML = `
                    <div class="result-content error">
                        <div class="error-icon">✗</div>
                        <h2>Error al Generar el Sitio Web</h2>
                        <p style="color: var(--error-color);">${errorDetail}</p>
                        
                        <div class="result-item">
                            <h3>💡 Posibles Soluciones</h3>
                            <ul>
                                <li>Verifica que el servidor API esté ejecutándose (puerto 8080)</li>
                                <li>Revisa tu conexión a internet</li>
                                <li>Intenta con una descripción más corta</li>
                                <li>Reduce el número de imágenes</li>
                                <li>Revisa la consola del navegador para más detalles</li>
                            </ul>
                        </div>
                        
                        <button class="btn btn-primary" onclick="location.reload()">
                            Intentar de Nuevo
                        </button>
                    </div>
                `;
      }

      // Scroll al resultado
      resultContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  // Toggle entre Login y Signup
  const showSignupBtn = document.getElementById("showSignup");
  const showLoginBtn = document.getElementById("showLogin");
  const loginBox = document.getElementById("loginBox");
  const signupBox = document.getElementById("signupBox");

  // Check if URL has #signup hash to show signup form automatically
  if (loginBox && signupBox && window.location.hash === "#signup") {
    loginBox.classList.add("hidden");
    signupBox.classList.remove("hidden");
  }

  // Handle clicks on links with href="#signup" in navbar
  document.addEventListener("click", function (e) {
    if (
      e.target.matches('a[href="#signup"]') ||
      e.target.closest('a[href="#signup"]')
    ) {
      e.preventDefault();
      if (loginBox && signupBox) {
        loginBox.classList.add("hidden");
        signupBox.classList.remove("hidden");
        window.location.hash = "signup";
      }
    }
  });

  if (showSignupBtn && showLoginBtn) {
    showSignupBtn.addEventListener("click", function (e) {
      e.preventDefault();
      loginBox.classList.add("hidden");
      signupBox.classList.remove("hidden");
    });

    showLoginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      signupBox.classList.add("hidden");
      loginBox.classList.remove("hidden");
    });
  }

  // Manejo del formulario de login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      alert(`Bienvenido! Iniciando sesión con: ${email}`);
      // Aquí iría la lógica de autenticación
    });
  }

  // Manejo del formulario de signup
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("signupName").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById(
        "signupConfirmPassword"
      ).value;

      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      alert(`Cuenta creada exitosamente para: ${name}`);
      // Aquí iría la lógica de registro
    });
  }

  // Manejo del formulario de contacto
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      alert(
        `Gracias ${name}! Tu mensaje ha sido enviado.\nNos pondremos en contacto contigo pronto en: ${email}`
      );
      contactForm.reset();
      // Aquí iría la lógica para enviar el formulario
    });
  }

  // Animación suave al hacer scroll (opcional)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  console.log("Web dinámica cargada correctamente!");
});

// Función para eliminar imagen
function removeImage(index) {
  uploadedImages.splice(index, 1);
  const preview = document.getElementById("imagePreview");
  preview.innerHTML = "";

  uploadedImages.forEach((img, i) => {
    const previewItem = document.createElement("div");
    previewItem.className = "preview-item";
    previewItem.innerHTML = `
            <img src="${img}" alt="Preview">
            <button type="button" class="remove-image" onclick="removeImage(${i})">×</button>
        `;
    preview.appendChild(previewItem);
  });
}

// ===== PAYMENT MODAL FUNCTIONS =====

const planData = {
  basic: {
    ja: { name: "ベーシック Web", price: "¥8,000/月" },
    en: { name: "Basic Web", price: "$65/month" },
    es: { name: "Web Básica", price: "€60/mes" },
  },
  pro: {
    ja: { name: "カスタム Web", price: "¥35,000/月" },
    en: { name: "Custom Web", price: "$285/month" },
    es: { name: "Web Personalizada", price: "€260/mes" },
  },
  premium: {
    ja: { name: "プレミアム", price: "¥98,000/月" },
    en: { name: "Premium", price: "$800/month" },
    es: { name: "Premium", price: "€750/mes" },
  },
};

let currentPaymentMethod = "card";

function openPaymentModal(plan) {
  const modal = document.getElementById("paymentModal");
  const lang = localStorage.getItem("selectedLanguage") || "ja";

  // Actualizar información del plan
  const planInfo = planData[plan][lang];
  document.getElementById("modalPlanName").textContent = planInfo.name;
  document.getElementById("modalPlanPrice").textContent = planInfo.price;

  // Mostrar modal
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePaymentModal() {
  const modal = document.getElementById("paymentModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function selectPaymentMethod(method) {
  currentPaymentMethod = method;
  const methods = document.querySelectorAll(".payment-method");
  methods.forEach((m) => m.classList.remove("active"));
  event.currentTarget.classList.add("active");
}

function processPayment(event) {
  event.preventDefault();

  const lang = localStorage.getItem("selectedLanguage") || "ja";
  const t = translations[lang];

  // Simular procesamiento
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  submitBtn.disabled = true;
  submitBtn.textContent = "...";

  setTimeout(() => {
    alert(t.paymentSuccess || "Payment completed successfully!");
    closePaymentModal();
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }, 2000);
}

// Cerrar modal al hacer clic fuera
document.addEventListener("click", function (e) {
  const modal = document.getElementById("paymentModal");
  if (modal && e.target === modal) {
    closePaymentModal();
  }
});

// Cerrar modal con tecla ESC
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closePaymentModal();
  }
});

// Toggle user menu dropdown
function toggleUserMenu() {
  const dropdown = document.getElementById("userDropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
  }
}

// Toggle language dropdown menu
function toggleLanguageMenu() {
  const dropdown = document.getElementById("languageDropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
  }
}

// Close dropdowns when clicking outside
document.addEventListener("click", function (e) {
  // Close language dropdown
  const langSelector = document.querySelector(".language-selector");
  const langDropdown = document.getElementById("languageDropdown");

  if (langDropdown && langSelector && !langSelector.contains(e.target)) {
    langDropdown.classList.remove("active");
  }

  // Close user menu dropdown
  const userMenu = document.querySelector(".user-menu");
  const userDropdown = document.getElementById("userDropdown");

  if (userDropdown && userMenu && !userMenu.contains(e.target)) {
    userDropdown.classList.remove("active");
  }
});

// Update flag in button when language changes
function updateLanguageFlag(lang) {
  const currentLangButton = document.getElementById("currentLangButton");
  const flagClassMap = {
    ja: "flag-ja",
    en: "flag-en",
    es: "flag-es",
  };

  if (currentLangButton && flagClassMap[lang]) {
    const flagCircle = currentLangButton.querySelector(".flag-circle");
    if (flagCircle) {
      // Remove all flag classes
      flagCircle.classList.remove("flag-ja", "flag-en", "flag-es");
      // Add the correct flag class
      flagCircle.classList.add(flagClassMap[lang]);
    }
  }

  // Close dropdown after selection
  const dropdown = document.getElementById("languageDropdown");
  if (dropdown) {
    dropdown.classList.remove("active");
  }
}
