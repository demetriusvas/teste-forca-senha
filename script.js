// Configuração de Tradução
const resources = {
    en: {
        translation: {
            "navbar_title": "Password Strength Tester",
            "header_text": "Test the strength of your password securely. All testing is done locally in your browser - no passwords are stored or transmitted.",
            "test_password": "Test",
            "generate_password": "Generate",
            "why_matters": "Why Password Strength Matters",
            "length": "Length",
            "uppercase": "Uppercase",
            "lowercase": "Lowercase",
            "numbers": "Numbers",
            "symbols": "Symbols",
            "generate_btn": "Generate Strong Password",
            "copy_btn": "Copy",
            "time_to_crack": "Estimated time to crack",
            "footer_text": "This tool is for educational purposes only. All password testing is done locally in your browser. No passwords are stored or transmitted."
        }
    },
    pt: {
        translation: {
            "navbar_title": "Testador de Força de Senha",
            "header_text": "Teste a força da sua senha com segurança. Todo o teste é feito localmente no seu navegador - nenhuma senha é armazenada ou transmitida.",
            "test_password": "Testar",
            "generate_password": "Gerar",
            "why_matters": "Por Que a Força da Senha Importa",
            "length": "Comprimento",
            "uppercase": "Maiúsculas",
            "lowercase": "Minúsculas",
            "numbers": "Números",
            "symbols": "Símbolos",
            "generate_btn": "Gerar Senha Forte",
            "copy_btn": "Copiar",
            "time_to_crack": "Tempo estimado para quebrar",
            "footer_text": "Esta ferramenta é apenas para fins educacionais. Todo o teste de senha é feito localmente no seu navegador. Nenhuma senha é armazenada ou transmitida."
        }
    },
    es: {
        translation: {
            "navbar_title": "Probador de Fortaleza de Contraseña",
            "header_text": "Prueba la fortaleza de tu contraseña de forma segura. Todas las pruebas se realizan localmente en tu navegador - no se almacenan ni transmiten contraseñas.",
            "test_password": "Probar",
            "generate_password": "Generar",
            "why_matters": "Por Qué Importa la Fortaleza de la Contraseña",
            "length": "Longitud",
            "uppercase": "Mayúsculas",
            "lowercase": "Minúsculas",
            "numbers": "Números",
            "symbols": "Símbolos",
            "generate_btn": "Generar Contraseña Fuerte",
            "copy_btn": "Copiar",
            "time_to_crack": "Tiempo estimado para descifrar",
            "footer_text": "Esta herramienta es solo para fines educativos. Todas las pruebas de contraseña se realizan localmente en tu navegador. No se almacenan ni transmiten contraseñas."
        }
    }
};

i18next
    .use(i18nextBrowserLanguageDetector)
    .init({
        resources,
        fallbackLng: 'en',
        detection: { order: ['navigator', 'htmlTag', 'path', 'subdomain'] },
    }, (err, t) => {
        if (err) return console.error(err);
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
    });

// Script Principal
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password-input');
    const togglePassword = document.getElementById('toggle-password');
    const strengthMeterFill = document.getElementById('strength-meter-fill');
    const strengthText = document.getElementById('strength-text');
    const strengthIcon = document.getElementById('strength-icon');
    const feedbackList = document.getElementById('feedback-list');
    const timeToCrack = document.getElementById('time-to-crack');
    const generateBtn = document.getElementById('generate-btn');
    const generatedPassword = document.getElementById('generated-password');
    const generatedPasswordContainer = document.getElementById('generated-password-container');
    const copyBtn = document.getElementById('copy-btn');
    const copyNotification = document.getElementById('copy-notification');
    const themeToggle = document.getElementById('theme-toggle');
    const lengthInput = document.getElementById('length-input');
    const includeUppercase = document.getElementById('include-uppercase');
    const includeLowercase = document.getElementById('include-lowercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSymbols = document.getElementById('include-symbols');
    const criteriaLength = document.getElementById('criteria-length');
    const criteriaLowercase = document.getElementById('criteria-lowercase');
    const criteriaUppercase = document.getElementById('criteria-uppercase');
    const criteriaNumbers = document.getElementById('criteria-numbers');
    const criteriaSymbols = document.getElementById('criteria-symbols');

    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'welcome', 'letmein'];
    const sequentialPatterns = ['abcdef', '123456', 'qwerty', 'asdfgh', 'zxcvbn'];

    togglePassword.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePassword.textContent = '🔒';
        } else {
            passwordInput.type = 'password';
            togglePassword.textContent = '👁️';
        }
        passwordInput.focus();
    });

    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    lengthInput.addEventListener('input', function() {
        if (this.value < 8) this.value = 8;
        if (this.value > 64) this.value = 64;
    });

    generateBtn.addEventListener('click', function() {
        const length = parseInt(lengthInput.value) || 16;
        if (!includeUppercase.checked && !includeLowercase.checked && !includeNumbers.checked && !includeSymbols.checked) {
            includeLowercase.checked = true;
        }

        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()-_=+{}|;:,.<>?';

        let charset = '';
        if (includeLowercase.checked) charset += lowercaseChars;
        if (includeUppercase.checked) charset += uppercaseChars;
        if (includeNumbers.checked) charset += numberChars;
        if (includeSymbols.checked) charset += symbolChars;

        let password = '';
        if (includeLowercase.checked) password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
        if (includeUppercase.checked) password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
        if (includeNumbers.checked) password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
        if (includeSymbols.checked) password += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));

        while (password.length < length) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        password = shuffleString(password);
        generatedPassword.textContent = password;
        generatedPasswordContainer.style.display = 'flex';
        passwordInput.value = password;
        analyzeAndUpdateUI(password);
    });

    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(generatedPassword.textContent).then(() => {
            copyBtn.textContent = 'Copied!';
            copyNotification.style.opacity = 1;
            setTimeout(() => {
                copyBtn.textContent = i18next.t('copy_btn');
                copyNotification.style.opacity = 0;
            }, 2000);
        });
    });

    passwordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        if (!password) {
            resetStrengthIndicator();
            return;
        }
        analyzeAndUpdateUI(password);
    });

    function resetStrengthIndicator() {
        strengthMeterFill.style.width = '0%';
        strengthText.textContent = 'None';
        strengthText.style.color = '#333';
        strengthIcon.textContent = '❓';
        feedbackList.innerHTML = '<li>Enter a password to see strength analysis</li>';
        timeToCrack.textContent = 'N/A';
        setCriteriaStatus(criteriaLength, false);
        setCriteriaStatus(criteriaLowercase, false);
        setCriteriaStatus(criteriaUppercase, false);
        setCriteriaStatus(criteriaNumbers, false);
        setCriteriaStatus(criteriaSymbols, false);
    }

    function analyzeAndUpdateUI(password) {
        const result = analyzePassword(password);
        strengthMeterFill.style.width = `${result.score * 25}%`;
        if (result.score <= 1) {
            strengthMeterFill.style.background = 'var(--weak-color)';
            strengthText.textContent = 'Weak';
            strengthText.style.color = 'var(--weak-color)';
            strengthIcon.textContent = '❌';
        } else if (result.score === 2) {
            strengthMeterFill.style.background = 'var(--medium-color)';
            strengthText.textContent = 'Medium';
            strengthText.style.color = 'var(--medium-color)';
            strengthIcon.textContent = '⚠️';
        } else if (result.score === 3) {
            strengthMeterFill.style.background = 'var(--strong-color)';
            strengthText.textContent = 'Strong';
            strengthText.style.color = 'var(--strong-color)';
            strengthIcon.textContent = '✅';
        } else {
            strengthMeterFill.style.background = 'var(--very-strong-color)';
            strengthText.textContent = 'Very Strong';
            strengthText.style.color = 'var(--very-strong-color)';
            strengthIcon.textContent = '🔒';
        }

        feedbackList.innerHTML = result.feedback.length === 0 ? '<li>Excellent password!</li>' : result.feedback.map(item => `<li>${item}</li>`).join('');
        setCriteriaStatus(criteriaLength, password.length >= 12);
        setCriteriaStatus(criteriaLowercase, /[a-z]/.test(password));
        setCriteriaStatus(criteriaUppercase, /[A-Z]/.test(password));
        setCriteriaStatus(criteriaNumbers, /[0-9]/.test(password));
        setCriteriaStatus(criteriaSymbols, /[^A-Za-z0-9]/.test(password));
        timeToCrack.textContent = result.crackTime;
    }

    function analyzePassword(password) {
        const result = { score: 0, feedback: [], crackTime: '' };
        if (password.length < 8) result.feedback.push('Password is too short (minimum 8 characters)');
        else if (password.length < 12) { result.feedback.push('Consider using at least 12 characters'); result.score += 1; }
        else result.score += 1;

        const varietyCount = [/[a-z]/.test(password), /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
        if (varietyCount < 3) result.feedback.push('Add more variety (uppercase, lowercase, numbers, special characters)');
        else result.score += 1;

        if (/(.)\1{2,}/.test(password)) result.feedback.push('Avoid repeated characters');
        if (sequentialPatterns.some(pattern => password.toLowerCase().includes(pattern))) result.feedback.push('Avoid sequential patterns');
        else result.score += 1;

        if (commonPasswords.some(pwd => password.toLowerCase().includes(pwd))) result.feedback.push('Avoid common passwords');
        else result.score += 1;

        result.score = Math.min(result.score, 4);
        const entropy = calculateEntropy(password);
        result.crackTime = estimateCrackTime(entropy);
        return result;
    }

    function calculateEntropy(password) {
        const poolSize = [/[a-z]/.test(password) && 26, /[A-Z]/.test(password) && 26, /[0-9]/.test(password) && 10, /[^A-Za-z0-9]/.test(password) && 33].filter(Boolean).reduce((a, b) => a + b, 0);
        return poolSize ? Math.log2(Math.pow(poolSize, password.length)) : 0;
    }

    function estimateCrackTime(entropy) {
        const seconds = Math.pow(2, entropy - 1) / 10000000000;
        if (seconds < 60) return `${Math.round(seconds)} seconds`;
        if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
        if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
        if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
        return `${Math.round(seconds / 31536000)} years`;
    }

    function setCriteriaStatus(element, isMet) {
        element.textContent = isMet ? '✓' : '✗';
        element.classList.toggle('criteria-met', isMet);
        element.classList.toggle('criteria-unmet', !isMet);
    }

    function shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    resetStrengthIndicator();
});