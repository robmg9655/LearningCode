// Main JavaScript para funcionalidad dinámica

// Variables globales
let selectedTheme = 'modern';
let uploadedImages = [];

// Función para scroll del carrusel
function scrollCarousel(direction) {
    const wrapper = document.getElementById('themeWrapper');
    if (wrapper) {
        const scrollAmount = 200;
        wrapper.scrollLeft += direction * scrollAmount;
    }
}

// Función para manejar el cambio entre login y signup
document.addEventListener('DOMContentLoaded', function() {
    
    // Manejo de selección de temas
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.addEventListener('click', function() {
            themeCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedTheme = this.getAttribute('data-theme');
        });
    });
    
    // Seleccionar el primer tema por defecto
    if (themeCards.length > 0) {
        themeCards[0].classList.add('selected');
    }
    
    // Manejo de upload de imágenes
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            const preview = document.getElementById('imagePreview');
            
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        uploadedImages.push(e.target.result);
                        
                        const previewItem = document.createElement('div');
                        previewItem.className = 'preview-item';
                        previewItem.innerHTML = `
                            <img src="${e.target.result}" alt="Preview">
                            <button type="button" class="remove-image" onclick="removeImage(${uploadedImages.length - 1})">×</button>
                        `;
                        preview.appendChild(previewItem);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }
    
    // Manejo del formulario generador
    const generatorForm = document.getElementById('generatorForm');
    if (generatorForm) {
        generatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const businessDesc = document.getElementById('businessDesc').value;
            const selectedLanguages = Array.from(document.querySelectorAll('input[name="languages"]:checked'))
                .map(cb => cb.nextElementSibling.textContent.trim());
            
            // Generar resultado
            const resultContainer = document.getElementById('resultContainer');
            resultContainer.innerHTML = `
                <div class="result-content">
                    <div class="result-item">
                        <h3>📝 Descripción del Negocio</h3>
                        <p>${businessDesc}</p>
                    </div>
                    
                    <div class="result-item">
                        <h3>🌐 Idiomas Seleccionados</h3>
                        <ul>
                            ${selectedLanguages.map(lang => `<li>${lang}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="result-item">
                        <h3>🎨 Tema Seleccionado</h3>
                        <p style="text-transform: capitalize;">${selectedTheme}</p>
                    </div>
                    
                    <div class="result-item">
                        <h3>🖼️ Imágenes (${uploadedImages.length})</h3>
                        <div class="result-images">
                            ${uploadedImages.map(img => `<img src="${img}" alt="Uploaded">`).join('')}
                        </div>
                    </div>
                    
                    <div class="result-item">
                        <h3>✨ Estado de Generación</h3>
                        <p style="color: var(--success-color); font-weight: 600;">
                            ✓ Website generado exitosamente con tema ${selectedTheme}
                        </p>
                        <p style="color: var(--text-secondary); margin-top: 1rem;">
                            Tu sitio web ha sido configurado con ${selectedLanguages.length} idioma(s) 
                            y ${uploadedImages.length} imagen(es). El tema ${selectedTheme} ha sido aplicado.
                        </p>
                    </div>
                </div>
            `;
            
            // Scroll al resultado
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
    
    // Toggle entre Login y Signup
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    const loginBox = document.getElementById('loginBox');
    const signupBox = document.getElementById('signupBox');

    if (showSignupBtn && showLoginBtn) {
        showSignupBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginBox.classList.add('hidden');
            signupBox.classList.remove('hidden');
        });

        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            signupBox.classList.add('hidden');
            loginBox.classList.remove('hidden');
        });
    }

    // Manejo del formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            alert(`Bienvenido! Iniciando sesión con: ${email}`);
            // Aquí iría la lógica de autenticación
        });
    }

    // Manejo del formulario de signup
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            alert(`Cuenta creada exitosamente para: ${name}`);
            // Aquí iría la lógica de registro
        });
    }

    // Manejo del formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            alert(`Gracias ${name}! Tu mensaje ha sido enviado.\nNos pondremos en contacto contigo pronto en: ${email}`);
            contactForm.reset();
            // Aquí iría la lógica para enviar el formulario
        });
    }

    // Animación suave al hacer scroll (opcional)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    console.log('Web dinámica cargada correctamente!');
});

// Función para eliminar imagen
function removeImage(index) {
    uploadedImages.splice(index, 1);
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    uploadedImages.forEach((img, i) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
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
        ja: { name: 'ベーシック Web', price: '¥8,000/月' },
        en: { name: 'Basic Web', price: '$65/month' },
        es: { name: 'Web Básica', price: '€60/mes' }
    },
    pro: {
        ja: { name: 'カスタム Web', price: '¥35,000/月' },
        en: { name: 'Custom Web', price: '$285/month' },
        es: { name: 'Web Personalizada', price: '€260/mes' }
    },
    premium: {
        ja: { name: 'プレミアム', price: '¥98,000/月' },
        en: { name: 'Premium', price: '$800/month' },
        es: { name: 'Premium', price: '€750/mes' }
    }
};

let currentPaymentMethod = 'card';

function openPaymentModal(plan) {
    const modal = document.getElementById('paymentModal');
    const lang = localStorage.getItem('selectedLanguage') || 'ja';
    
    // Actualizar información del plan
    const planInfo = planData[plan][lang];
    document.getElementById('modalPlanName').textContent = planInfo.name;
    document.getElementById('modalPlanPrice').textContent = planInfo.price;
    
    // Mostrar modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function selectPaymentMethod(method) {
    currentPaymentMethod = method;
    const methods = document.querySelectorAll('.payment-method');
    methods.forEach(m => m.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function processPayment(event) {
    event.preventDefault();
    
    const lang = localStorage.getItem('selectedLanguage') || 'ja';
    const t = translations[lang];
    
    // Simular procesamiento
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = '...';
    
    setTimeout(() => {
        alert(t.paymentSuccess || 'Payment completed successfully!');
        closePaymentModal();
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }, 2000);
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', function(e) {
    const modal = document.getElementById('paymentModal');
    if (modal && e.target === modal) {
        closePaymentModal();
    }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePaymentModal();
    }
});

// Toggle user menu dropdown
function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Toggle language dropdown menu
function toggleLanguageMenu() {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    // Close language dropdown
    const langSelector = document.querySelector('.language-selector');
    const langDropdown = document.getElementById('languageDropdown');
    
    if (langDropdown && langSelector && !langSelector.contains(e.target)) {
        langDropdown.classList.remove('active');
    }
    
    // Close user menu dropdown
    const userMenu = document.querySelector('.user-menu');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userDropdown && userMenu && !userMenu.contains(e.target)) {
        userDropdown.classList.remove('active');
    }
});

// Update flag in button when language changes
function updateLanguageFlag(lang) {
    const currentLangButton = document.getElementById('currentLangButton');
    const flagClassMap = {
        'ja': 'flag-ja',
        'en': 'flag-en',
        'es': 'flag-es'
    };
    
    if (currentLangButton && flagClassMap[lang]) {
        const flagCircle = currentLangButton.querySelector('.flag-circle');
        if (flagCircle) {
            // Remove all flag classes
            flagCircle.classList.remove('flag-ja', 'flag-en', 'flag-es');
            // Add the correct flag class
            flagCircle.classList.add(flagClassMap[lang]);
        }
    }
    
    // Close dropdown after selection
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}
