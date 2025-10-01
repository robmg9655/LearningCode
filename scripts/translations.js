// Sistema de traducciones
const translations = {
    ja: {
        // Navbar
        navHome: 'ホーム',
        navDemo: 'デモ',
        navPricing: '料金',
        navContact: 'お問い合わせ',
        navLogin: 'ログイン',
        userMenuPricing: '料金プラン',
        userMenuContact: 'お問い合わせ',
        
        // Home
        heroBadge: 'AI駆動のWebサイトジェネレーター',
        heroTitle: 'AIでWebサイトを<br>数分で自動生成',
        heroSubtitle: 'あなたのビジネスアイデアを説明するだけで、プロフェッショナルなWebサイトが完成。コーディング不要、技術知識不要。',
        btnTryDemo: '無料で試す',
        btnViewDemo: 'デモを見る',
        btnViewPricing: '料金を見る',
        btnStartNow: '今すぐ始める',
        stat1Number: '1,000+',
        stat1Label: '作成されたサイト',
        stat2Number: '5分',
        stat2Label: '平均作成時間',
        stat3Number: '98%',
        stat3Label: '満足度',
        howItWorksTitle: 'たった3ステップで完成',
        howItWorksSubtitle: 'シンプルで直感的なプロセス',
        step1Title: 'ビジネスを説明',
        step1Desc: 'あなたのビジネスや目的を簡単に説明してください。AIが内容を理解します。',
        step2Title: 'スタイルを選択',
        step2Desc: '複数のプロフェッショナルなテーマから、お好みのデザインを選んでください。',
        step3Title: '即座に生成',
        step3Desc: 'AIが自動的に完全なWebサイトを生成。すぐに公開可能です。',
        featuresTitle: '強力な機能',
        featuresSubtitle: 'あなたのビジネスを成功に導く機能',
        feature1Title: 'AI駆動生成',
        feature1Desc: '最先端のAI技術により、コンテンツとデザインを自動生成。プロフェッショナルな仕上がりを保証。',
        feature2Title: '多言語対応',
        feature2Desc: '日本語、英語、スペイン語など、複数の言語でWebサイトを自動生成。グローバル展開も簡単。',
        feature3Title: '完全レスポンシブ',
        feature3Desc: 'スマートフォン、タブレット、PCなど、すべてのデバイスで最適表示。',
        feature4Title: '高速パフォーマンス',
        feature4Desc: '最適化されたコードで、読み込み速度が速く、SEOにも強いWebサイトを生成。',
        feature5Title: '多彩なテーマ',
        feature5Desc: 'モダン、ミニマル、エレガントなど、5種類以上のプロフェッショナルテーマから選択可能。',
        feature6Title: '安全・セキュア',
        feature6Desc: '最新のセキュリティ対策を実装。お客様のデータを確実に保護します。',
        ctaTitle: '今すぐ始めましょう',
        ctaSubtitle: '無料でAI Webサイトジェネレーターを体験してください',
        footerText: '© 2025 MiWeb. All rights reserved.',
        
        // Demo
        demoTitle: 'AIウェブサイトジェネレーター',
        demoSubtitle: 'あなたのビジネスのための完璧なWebサイトを数分で作成',
        formTitle: 'Webサイトを生成',
        businessDesc: 'ビジネスの説明',
        businessPlaceholder: 'あなたのビジネスを説明してください...',
        selectLanguages: '言語を選択',
        uploadImages: '画像をアップロード',
        selectTheme: 'テーマを選択',
        btnGenerate: '生成する',
        resultTitle: '結果',
        resultPlaceholder: 'フォームに記入して結果を生成してください',
        
        // Themes
        themeModern: 'モダン',
        themeMinimalist: 'ミニマリスト',
        themeColorful: 'カラフル',
        themeElegant: 'エレガント',
        themeDark: 'ダーク',
        
        // Pricing
        pricingTitle: 'プランと料金',
        pricingSubtitle: 'あなたにぴったりのプランを選択',
        planBasic: 'ベーシック Web',
        planPro: 'カスタム Web',
        planEnterprise: 'プレミアム',
        badgePopular: '人気',
        priceMonth: '/月',
        priceBasic: '¥8,000',
        pricePro: '¥35,000',
        priceEnterprise: '¥98,000',
        feature1: '基本的なWebサイト作成',
        feature2: 'ホスティング込み',
        feature3: '作成・投稿編集オプション',
        feature4: 'メンテナンス込み',
        feature5: 'カスタマイズWeb作成',
        feature6: 'API・AI・MCP統合',
        feature7: '人間による編集',
        feature8: 'ホスティング・メンテナンス',
        feature9: '複数Web無制限作成',
        feature10: 'シンプル＋カスタム両対応',
        feature11: '専用サポートチーム',
        feature12: '24/7プレミアムサポート',
        btnStart: '開始する',
        btnContact: 'お問い合わせ',
        
        // Contact
        contactTitle: 'お問い合わせ',
        contactSubtitle: '私たちはあなたを助けるためにここにいます',
        contactInfoTitle: 'お問い合わせ情報',
        contactEmail: '📧 メール',
        contactPhone: '📱 電話',
        contactAddress: '📍 住所',
        contactAddressText: '主要通り123<br>28001 マドリード、スペイン',
        contactHours: '🕐 営業時間',
        contactHoursText: '月曜日 - 金曜日: 9:00 - 18:00<br>土曜日: 10:00 - 14:00',
        contactFormTitle: 'メッセージを送信',
        formName: '名前',
        formEmail: 'メール',
        formSubject: '件名',
        formMessage: 'メッセージ',
        btnSend: 'メッセージを送信',
        
        // Login
        loginTitle: 'ログイン',
        signupTitle: 'アカウント作成',
        loginEmail: 'メール',
        loginPassword: 'パスワード',
        rememberMe: '記憶する',
        forgotPassword: 'パスワードをお忘れですか？',
        btnLogin: 'ログイン',
        btnSignup: 'アカウント作成',
        noAccount: 'アカウントをお持ちではありませんか？',
        hasAccount: 'すでにアカウントをお持ちですか？',
        linkSignup: '登録する',
        linkLogin: 'ログイン',
        signupName: 'フルネーム',
        confirmPassword: 'パスワード確認',
        acceptTerms: '利用規約に同意します',
        
        // Payment Modal
        paymentTitle: 'お支払い',
        cardholderName: 'カード名義人',
        cardNumber: 'カード番号',
        expiryDate: '有効期限',
        email: 'メールアドレス',
        btnPayNow: '今すぐ支払う',
        securePayment: '安全な支払い処理',
        paymentSuccess: 'お支払いが完了しました！',
        paymentError: 'エラーが発生しました。もう一度お試しください。'
    },
    en: {
        // Navbar
        navHome: 'Home',
        navDemo: 'Demo',
        navPricing: 'Pricing',
        navContact: 'Contact',
        navLogin: 'Login',
        userMenuPricing: 'Pricing Plans',
        userMenuContact: 'Contact',
        
        // Home
        heroBadge: 'AI-Powered Website Generator',
        heroTitle: 'Generate Websites<br>with AI in Minutes',
        heroSubtitle: 'Simply describe your business idea and get a professional website. No coding required, no technical knowledge needed.',
        btnTryDemo: 'Try for Free',
        btnViewDemo: 'View Demo',
        btnViewPricing: 'View Pricing',
        btnStartNow: 'Start Now',
        stat1Number: '1,000+',
        stat1Label: 'Websites Created',
        stat2Number: '5 min',
        stat2Label: 'Average Creation Time',
        stat3Number: '98%',
        stat3Label: 'Satisfaction Rate',
        howItWorksTitle: 'Complete in Just 3 Steps',
        howItWorksSubtitle: 'Simple and intuitive process',
        step1Title: 'Describe Your Business',
        step1Desc: 'Simply describe your business or purpose. AI will understand the content.',
        step2Title: 'Choose a Style',
        step2Desc: 'Select your preferred design from multiple professional themes.',
        step3Title: 'Generate Instantly',
        step3Desc: 'AI automatically generates a complete website. Ready to publish immediately.',
        featuresTitle: 'Powerful Features',
        featuresSubtitle: 'Features to drive your business success',
        feature1Title: 'AI-Powered Generation',
        feature1Desc: 'Automatically generate content and design with cutting-edge AI technology. Professional results guaranteed.',
        feature2Title: 'Multilingual Support',
        feature2Desc: 'Automatically generate websites in multiple languages including Japanese, English, and Spanish. Easy global expansion.',
        feature3Title: 'Fully Responsive',
        feature3Desc: 'Optimal display on all devices including smartphones, tablets, and PCs.',
        feature4Title: 'High Performance',
        feature4Desc: 'Optimized code for fast loading speeds and strong SEO performance.',
        feature5Title: 'Diverse Themes',
        feature5Desc: 'Choose from over 5 professional themes including Modern, Minimal, and Elegant.',
        feature6Title: 'Safe & Secure',
        feature6Desc: 'Latest security measures implemented. Your data is securely protected.',
        ctaTitle: 'Get Started Today',
        ctaSubtitle: 'Experience the AI Website Generator for free',
        footerText: '© 2025 MiWeb. All rights reserved.',
        
        // Demo
        demoTitle: 'AI Website Generator',
        demoSubtitle: 'Create the perfect website for your business in minutes',
        formTitle: 'Generate Website',
        businessDesc: 'Business Description',
        businessPlaceholder: 'Describe your business...',
        selectLanguages: 'Select Languages',
        uploadImages: 'Upload Images',
        selectTheme: 'Select Theme',
        btnGenerate: 'Generate',
        resultTitle: 'Result',
        resultPlaceholder: 'Fill out the form to generate a result',
        
        // Themes
        themeModern: 'Modern',
        themeMinimalist: 'Minimalist',
        themeColorful: 'Colorful',
        themeElegant: 'Elegant',
        themeDark: 'Dark',
        
        // Pricing
        pricingTitle: 'Plans and Pricing',
        pricingSubtitle: 'Choose the perfect plan for you',
        planBasic: 'Basic Web',
        planPro: 'Custom Web',
        planEnterprise: 'Premium',
        badgePopular: 'Popular',
        priceMonth: '/month',
        priceBasic: '$65',
        pricePro: '$285',
        priceEnterprise: '$800',
        feature1: 'Basic website creation',
        feature2: 'Hosting included',
        feature3: 'Creation & post-edit options',
        feature4: 'Maintenance included',
        feature5: 'Custom website creation',
        feature6: 'API, AI & MCP integration',
        feature7: 'Human editing',
        feature8: 'Hosting & maintenance',
        feature9: 'Unlimited multi-site creation',
        feature10: 'Simple + Custom websites',
        feature11: 'Dedicated support team',
        feature12: '24/7 premium support',
        btnStart: 'Get Started',
        btnContact: 'Contact',
        
        // Contact
        contactTitle: 'Contact Us',
        contactSubtitle: 'We are here to help you',
        contactInfoTitle: 'Contact Information',
        contactEmail: '📧 Email',
        contactPhone: '📱 Phone',
        contactAddress: '📍 Address',
        contactAddressText: 'Main Street 123<br>28001 Madrid, Spain',
        contactHours: '🕐 Hours',
        contactHoursText: 'Monday - Friday: 9:00 - 18:00<br>Saturday: 10:00 - 14:00',
        contactFormTitle: 'Send us a Message',
        formName: 'Name',
        formEmail: 'Email',
        formSubject: 'Subject',
        formMessage: 'Message',
        btnSend: 'Send Message',
        
        // Login
        loginTitle: 'Login',
        signupTitle: 'Create Account',
        loginEmail: 'Email',
        loginPassword: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot your password?',
        btnLogin: 'Login',
        btnSignup: 'Create Account',
        noAccount: "Don't have an account?",
        hasAccount: 'Already have an account?',
        linkSignup: 'Sign up',
        linkLogin: 'Login',
        signupName: 'Full Name',
        confirmPassword: 'Confirm Password',
        acceptTerms: 'I accept the terms and conditions',
        
        // Payment Modal
        paymentTitle: 'Payment',
        cardholderName: 'Cardholder Name',
        cardNumber: 'Card Number',
        expiryDate: 'Expiry Date',
        email: 'Email Address',
        btnPayNow: 'Pay Now',
        securePayment: 'Secure Payment Processing',
        paymentSuccess: 'Payment completed successfully!',
        paymentError: 'An error occurred. Please try again.'
    },
    es: {
        // Navbar
        navHome: 'Inicio',
        navDemo: 'Demo',
        navPricing: 'Precios',
        navContact: 'Contacto',
        navLogin: 'Login',
        userMenuPricing: 'Planes de Precios',
        userMenuContact: 'Contacto',
        
        // Home
        heroBadge: 'Generador de Sitios Web con IA',
        heroTitle: 'Genera Sitios Web<br>con IA en Minutos',
        heroSubtitle: 'Simplemente describe tu idea de negocio y obtén un sitio web profesional. Sin programación requerida, sin conocimientos técnicos necesarios.',
        btnTryDemo: 'Prueba Gratis',
        btnViewDemo: 'Ver Demo',
        btnViewPricing: 'Ver Precios',
        btnStartNow: 'Comenzar Ahora',
        stat1Number: '1,000+',
        stat1Label: 'Sitios Creados',
        stat2Number: '5 min',
        stat2Label: 'Tiempo Promedio',
        stat3Number: '98%',
        stat3Label: 'Satisfacción',
        howItWorksTitle: 'Completa en Solo 3 Pasos',
        howItWorksSubtitle: 'Proceso simple e intuitivo',
        step1Title: 'Describe tu Negocio',
        step1Desc: 'Simplemente describe tu negocio o propósito. La IA comprenderá el contenido.',
        step2Title: 'Elige un Estilo',
        step2Desc: 'Selecciona tu diseño preferido de múltiples temas profesionales.',
        step3Title: 'Genera Instantáneamente',
        step3Desc: 'La IA genera automáticamente un sitio web completo. Listo para publicar inmediatamente.',
        featuresTitle: 'Funciones Potentes',
        featuresSubtitle: 'Funciones para impulsar el éxito de tu negocio',
        feature1Title: 'Generación con IA',
        feature1Desc: 'Genera contenido y diseño automáticamente con tecnología de IA de vanguardia. Resultados profesionales garantizados.',
        feature2Title: 'Soporte Multiidioma',
        feature2Desc: 'Genera sitios web automáticamente en múltiples idiomas incluyendo japonés, inglés y español. Expansión global fácil.',
        feature3Title: 'Totalmente Responsive',
        feature3Desc: 'Visualización óptima en todos los dispositivos incluyendo smartphones, tablets y PCs.',
        feature4Title: 'Alto Rendimiento',
        feature4Desc: 'Código optimizado para velocidades de carga rápidas y fuerte rendimiento SEO.',
        feature5Title: 'Temas Diversos',
        feature5Desc: 'Elige entre más de 5 temas profesionales incluyendo Moderno, Minimalista y Elegante.',
        feature6Title: 'Seguro y Protegido',
        feature6Desc: 'Últimas medidas de seguridad implementadas. Tus datos están protegidos de forma segura.',
        ctaTitle: 'Comienza Hoy',
        ctaSubtitle: 'Experimenta el Generador de Sitios Web con IA gratis',
        footerText: '© 2025 MiWeb. Todos los derechos reservados.',
        
        // Demo
        demoTitle: 'Generador de Sitios Web con IA',
        demoSubtitle: 'Crea el sitio web perfecto para tu negocio en minutos',
        formTitle: 'Generar Sitio Web',
        businessDesc: 'Descripción del Negocio',
        businessPlaceholder: 'Describe tu negocio...',
        selectLanguages: 'Seleccionar Idiomas',
        uploadImages: 'Subir Imágenes',
        selectTheme: 'Seleccionar Tema',
        btnGenerate: 'Generar',
        resultTitle: 'Resultado',
        resultPlaceholder: 'Completa el formulario para generar un resultado',
        
        // Themes
        themeModern: 'Moderno',
        themeMinimalist: 'Minimalista',
        themeColorful: 'Colorido',
        themeElegant: 'Elegante',
        themeDark: 'Oscuro',
        
        // Pricing
        pricingTitle: 'Planes y Precios',
        pricingSubtitle: 'Elige el plan perfecto para ti',
        planBasic: 'Web Básica',
        planPro: 'Web Personalizada',
        planEnterprise: 'Premium',
        badgePopular: 'Popular',
        priceMonth: '/mes',
        priceBasic: '€60',
        pricePro: '€260',
        priceEnterprise: '€750',
        feature1: 'Creación web básica',
        feature2: 'Hosting incluido',
        feature3: 'Edición en creación y post-creación',
        feature4: 'Mantenimiento incluido',
        feature5: 'Creación web personalizada',
        feature6: 'Integración API, IA y MCP',
        feature7: 'Edición humana',
        feature8: 'Hosting y mantenimiento',
        feature9: 'Multi-creación ilimitada',
        feature10: 'Webs simples + personalizadas',
        feature11: 'Equipo de soporte dedicado',
        feature12: 'Soporte premium 24/7',
        btnStart: 'Empezar',
        btnContact: 'Contactar',
        
        // Contact
        contactTitle: 'Contáctanos',
        contactSubtitle: 'Estamos aquí para ayudarte',
        contactInfoTitle: 'Información de Contacto',
        contactEmail: '📧 Email',
        contactPhone: '📱 Teléfono',
        contactAddress: '📍 Dirección',
        contactAddressText: 'Calle Principal 123<br>28001 Madrid, España',
        contactHours: '🕐 Horario',
        contactHoursText: 'Lunes - Viernes: 9:00 - 18:00<br>Sábados: 10:00 - 14:00',
        contactFormTitle: 'Envíanos un Mensaje',
        formName: 'Nombre',
        formEmail: 'Email',
        formSubject: 'Asunto',
        formMessage: 'Mensaje',
        btnSend: 'Enviar Mensaje',
        
        // Login
        loginTitle: 'Iniciar Sesión',
        signupTitle: 'Crear Cuenta',
        loginEmail: 'Email',
        loginPassword: 'Contraseña',
        rememberMe: 'Recordarme',
        forgotPassword: '¿Olvidaste tu contraseña?',
        btnLogin: 'Iniciar Sesión',
        btnSignup: 'Crear Cuenta',
        noAccount: '¿No tienes cuenta?',
        hasAccount: '¿Ya tienes cuenta?',
        linkSignup: 'Regístrate',
        linkLogin: 'Inicia sesión',
        signupName: 'Nombre Completo',
        confirmPassword: 'Confirmar Contraseña',
        acceptTerms: 'Acepto los términos y condiciones',
        
        // Payment Modal
        paymentTitle: 'Pago',
        cardholderName: 'Nombre del Titular',
        cardNumber: 'Número de Tarjeta',
        expiryDate: 'Fecha de Vencimiento',
        email: 'Correo Electrónico',
        btnPayNow: 'Pagar Ahora',
        securePayment: 'Procesamiento de Pago Seguro',
        paymentSuccess: '¡Pago completado exitosamente!',
        paymentError: 'Ocurrió un error. Por favor, inténtalo de nuevo.'
    }
};

// Función para cambiar idioma
function changeLanguage(lang) {
    localStorage.setItem('selectedLanguage', lang);
    document.documentElement.lang = lang;
    updatePageContent(lang);
    
    // Update the flag button if it exists
    if (typeof updateLanguageFlag === 'function') {
        updateLanguageFlag(lang);
    }
}

// Función para actualizar contenido
function updatePageContent(lang) {
    const t = translations[lang];
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = t[key];
            } else {
                element.innerHTML = t[key];
            }
        }
    });
}

// Inicializar idioma al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('selectedLanguage') || 'ja';
    changeLanguage(savedLang);
    
    // Update old select if it exists (for backward compatibility)
    const langSelector = document.getElementById('languageSelector');
    if (langSelector) {
        langSelector.value = savedLang;
    }
    
    // Update new flag button if it exists
    if (typeof updateLanguageFlag === 'function') {
        updateLanguageFlag(savedLang);
    }
});
