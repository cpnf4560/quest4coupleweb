/* ============================================
   QUEST4COUPLE - AUTH UI LOGIC
   ============================================ */

// ========================================
// DOM ELEMENTS
// ========================================
const loginTab = document.querySelector('[data-tab="login"]');
const signupTab = document.querySelector('[data-tab="signup"]');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loadingOverlay = document.getElementById('loadingOverlay');

// Buttons
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleSignupBtn = document.getElementById('googleSignupBtn');
const redditLoginBtn = document.getElementById('redditLoginBtn');
const redditSignupBtn = document.getElementById('redditSignupBtn');
const emailLoginForm = document.getElementById('emailLoginForm');
const emailSignupForm = document.getElementById('emailSignupForm');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const cancelResetBtn = document.getElementById('cancelResetBtn');
const resetPasswordFormElement = document.getElementById('resetPasswordFormElement');

// Messages
let currentMessageTimeout = null;

// ========================================
// TAB SWITCHING
// ========================================
loginTab.addEventListener('click', () => {
  switchTab('login');
});

signupTab.addEventListener('click', () => {
  switchTab('signup');
});

function switchTab(tab) {
  // Update tabs
  if (tab === 'login') {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
  } else {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
  }

  // Hide reset password form
  resetPasswordForm.classList.remove('active');
  clearMessages();
}

// ========================================
// GOOGLE AUTH
// ========================================
googleLoginBtn.addEventListener('click', async () => {
  console.log('🔵 Google Login clicked');
  showLoading();
  clearMessages();

  try {
    console.log('🔵 Calling signInWithGoogle...');
    const result = await signInWithGoogle();
    console.log('✅ Google login success:', result);
    console.log('✅ Aguardando onAuthStateChanged para redirecionar...');
    // onAuthStateChanged vai redirecionar automaticamente
    // Não escondemos o loading aqui - deixamos o redirect acontecer
  } catch (error) {
    console.error('❌ Google login error:', error);
    hideLoading();
    
    // Better error messages
    let errorMsg = error.message;
    if (error.code === 'auth/popup-closed-by-user') {
      errorMsg = 'Popup fechado. Tenta novamente.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMsg = 'Domínio não autorizado. Verifica as configurações do Firebase.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMsg = 'Popup cancelado. Tenta novamente.';
    }
    
    showMessage('error', errorMsg);
  }
});

googleSignupBtn.addEventListener('click', async () => {
  console.log('🔵 Google Signup clicked');
  showLoading();
  clearMessages();

  try {
    console.log('🔵 Calling signInWithGoogle...');
    const result = await signInWithGoogle();
    console.log('✅ Google signup success:', result);
    console.log('✅ Aguardando onAuthStateChanged para redirecionar...');
    // onAuthStateChanged vai redirecionar automaticamente
    // Não escondemos o loading aqui - deixamos o redirect acontecer
  } catch (error) {
    console.error('❌ Google signup error:', error);
    hideLoading();
    
    let errorMsg = error.message;
    if (error.code === 'auth/popup-closed-by-user') {
      errorMsg = 'Popup fechado. Tenta novamente.';
    }
    
    showMessage('error', errorMsg);
  }
});

// ========================================
// REDDIT AUTH (Informativo)
// ========================================
redditLoginBtn.addEventListener('click', () => {
  alert('🚀 Login com Reddit\n\n' +
        '❌ Esta funcionalidade requer um backend para funcionar.\n\n' +
        'O Reddit OAuth2 não suporta autenticação apenas no cliente (frontend).\n\n' +
        '📝 Para implementar:\n' +
        '1. Configure uma aplicação no Reddit (https://www.reddit.com/prefs/apps)\n' +
        '2. Implemente um servidor backend (Node.js, Python, etc.)\n' +
        '3. Use o fluxo OAuth2 para obter tokens\n\n' +
        '💡 Por agora, use login com Google ou Email/Password.');
});

redditSignupBtn.addEventListener('click', () => {
  alert('🚀 Registo com Reddit\n\n' +
        '❌ Esta funcionalidade requer um backend para funcionar.\n\n' +
        'O Reddit OAuth2 não suporta autenticação apenas no cliente (frontend).\n\n' +
        '📝 Para implementar:\n' +
        '1. Configure uma aplicação no Reddit (https://www.reddit.com/prefs/apps)\n' +
        '2. Implemente um servidor backend (Node.js, Python, etc.)\n' +
        '3. Use o fluxo OAuth2 para obter tokens\n\n' +
        '💡 Por agora, use registo com Google ou Email/Password.');
});

// ========================================
// EMAIL/PASSWORD AUTH
// ========================================
emailLoginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('📧 Email login submitted');
  showLoading();
  clearMessages();

  try {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    console.log('📧 Calling signInWithEmailPassword...');
    const result = await signInWithEmailPassword(email, password);
    console.log('✅ Email login success:', result);
    // onAuthStateChanged vai redirecionar automaticamente
  } catch (error) {
    console.error('❌ Email login error:', error);
    hideLoading();
    
    // Better error messages
    let errorMsg = error.message;
    if (error.code === 'auth/popup-closed-by-user') {
      errorMsg = 'Popup fechado. Tenta novamente.';
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMsg = 'Domínio não autorizado. Verifica as configurações do Firebase.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      errorMsg = 'Popup cancelado. Tenta novamente.';
    }
    
    showMessage('error', errorMsg);
  }
});

// ========================================
// EMAIL/PASSWORD LOGIN
// ========================================
emailLoginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  // Validation
  if (!email || !password) {
    showMessage('error', 'Por favor preenche todos os campos.');
    return;
  }

  showLoading();
  clearMessages();

  try {
    await signInWithEmail(email, password);
    // onAuthStateChanged vai redirecionar automaticamente
  } catch (error) {
    hideLoading();
    showMessage('error', error.message);
  }
});

// ========================================
// EMAIL/PASSWORD SIGNUP
// ========================================
emailSignupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    showMessage('error', 'Por favor preenche todos os campos.');
    return;
  }

  if (password.length < 6) {
    showMessage('error', 'A password deve ter pelo menos 6 caracteres.');
    return;
  }

  if (password !== confirmPassword) {
    showMessage('error', 'As passwords não coincidem.');
    return;
  }

  showLoading();
  clearMessages();

  try {
    await signUpWithEmail(email, password, name);
    // onAuthStateChanged vai redirecionar automaticamente
  } catch (error) {
    hideLoading();
    showMessage('error', error.message);
  }
});

// ========================================
// FORGOT PASSWORD
// ========================================
forgotPasswordLink.addEventListener('click', (e) => {
  e.preventDefault();
  resetPasswordForm.classList.add('active');
  clearMessages();
});

cancelResetBtn.addEventListener('click', () => {
  resetPasswordForm.classList.remove('active');
  document.getElementById('resetEmail').value = '';
  clearMessages();
});

resetPasswordFormElement.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('resetEmail').value.trim();

  if (!email) {
    showMessage('error', 'Por favor insere o teu email.');
    return;
  }

  showLoading();
  clearMessages();

  try {
    await resetPassword(email);
    hideLoading();
    showMessage('success', 'Email de recuperação enviado! Verifica a tua caixa de entrada.');
    
    // Reset form e esconder após 3 segundos
    setTimeout(() => {
      resetPasswordForm.classList.remove('active');
      document.getElementById('resetEmail').value = '';
    }, 3000);
  } catch (error) {
    hideLoading();
    showMessage('error', error.message);
  }
});

// ========================================
// UI HELPERS
// ========================================
function showLoading() {
  loadingOverlay.classList.add('active');
}

function hideLoading() {
  loadingOverlay.classList.remove('active');
}

function showMessage(type, text) {
  clearMessages();

  // Determinar qual form está ativo
  const activeForm = loginForm.classList.contains('active') ? loginForm : signupForm;
  
  // Criar mensagem
  const message = document.createElement('div');
  message.className = `message ${type} active`;
  message.textContent = text;
  
  // Inserir no início do form ativo
  activeForm.insertBefore(message, activeForm.firstChild);

  // Auto-hide após 5 segundos
  currentMessageTimeout = setTimeout(() => {
    message.classList.remove('active');
    setTimeout(() => message.remove(), 300);
  }, 5000);
}

function clearMessages() {
  if (currentMessageTimeout) {
    clearTimeout(currentMessageTimeout);
    currentMessageTimeout = null;
  }

  const messages = document.querySelectorAll('.message');
  messages.forEach(msg => {
    msg.classList.remove('active');
    setTimeout(() => msg.remove(), 300);
  });
}

// ========================================
// INPUT VALIDATION FEEDBACK
// ========================================
// Email validation
const emailInputs = [
  document.getElementById('loginEmail'),
  document.getElementById('signupEmail'),
  document.getElementById('resetEmail')
];

emailInputs.forEach(input => {
  if (input) {
    input.addEventListener('blur', () => {
      const email = input.value.trim();
      if (email && !isValidEmail(email)) {
        input.style.borderColor = '#ff6b6b';
      } else {
        input.style.borderColor = '';
      }
    });

    input.addEventListener('input', () => {
      input.style.borderColor = '';
    });
  }
});

// Password strength indicator (opcional)
const signupPassword = document.getElementById('signupPassword');
if (signupPassword) {
  signupPassword.addEventListener('input', () => {
    const password = signupPassword.value;
    const strength = getPasswordStrength(password);
    
    // Pode adicionar um indicador visual aqui se quiseres
    if (password.length > 0 && password.length < 6) {
      signupPassword.style.borderColor = '#ff6b6b';
    } else if (password.length >= 6) {
      signupPassword.style.borderColor = '#51cf66';
    } else {
      signupPassword.style.borderColor = '';
    }
  });
}

// Confirm password matching
const confirmPassword = document.getElementById('signupConfirmPassword');
if (confirmPassword) {
  confirmPassword.addEventListener('input', () => {
    const password = signupPassword.value;
    const confirm = confirmPassword.value;
    
    if (confirm.length > 0) {
      if (password === confirm) {
        confirmPassword.style.borderColor = '#51cf66';
      } else {
        confirmPassword.style.borderColor = '#ff6b6b';
      }
    } else {
      confirmPassword.style.borderColor = '';
    }
  });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function getPasswordStrength(password) {
  let strength = 0;
  if (password.length >= 6) strength++;
  if (password.length >= 10) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  return strength;
}

// ========================================
// ENTER KEY SUPPORT
// ========================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    const activeForm = document.activeElement.closest('form');
    if (activeForm) {
      const submitBtn = activeForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        e.preventDefault();
        submitBtn.click();
      }
    }
  }
});

console.log('✅ Auth UI inicializada');
