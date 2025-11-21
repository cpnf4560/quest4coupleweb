/* ============================================
   QUEST4COUPLE - AUTH UI LOGIC
   ============================================ */

// ========================================
// GLOBAL VARIABLES
// ========================================
let pendingUserForLocation = null;

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
    
    // Verificar se o utilizador tem dados completos
    const userDoc = await db.collection('users').doc(result.user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    
    console.log('📋 User data:', userData);
    
    if (!userDoc.exists || !userData.country || !userData.gender || !userData.username) {
      // Utilizador precisa completar dados - mostrar modal
      console.log('🔵 Dados incompletos - mostrar modal');
      hideLoading();
      showLocationModal(result.user);
    } else {
      // Atualizar lastLogin no Firestore
      await db.collection('users').doc(result.user.uid).update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      });
      // Dados completos - redirecionar
      console.log('✅ Dados completos - redirecionando para dashboard...');
      hideLoading();
      window.location.href = 'dashboard.html';
    }
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
    
    // Verificar se é um novo utilizador
    const userDoc = await db.collection('users').doc(result.user.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};
    
    console.log('📋 User data:', userData);
    
    if (!userDoc.exists || !userData.country || !userData.gender || !userData.username) {
      // Novo utilizador ou dados incompletos - mostrar modal
      console.log('🔵 Novo utilizador ou dados incompletos - mostrar modal');
      hideLoading();
      showLocationModal(result.user);
    } else {
      // Atualizar lastLogin no Firestore
      await db.collection('users').doc(result.user.uid).update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      });
      // Utilizador já tem dados completos - redirecionar
      console.log('✅ Dados completos - redirecionando para dashboard...');
      hideLoading();
      window.location.href = 'dashboard.html';
    }
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
    // Atualizar lastLogin no Firestore
    await db.collection('users').doc(result.user.uid).update({
      lastLogin: firebase.firestore.FieldValue.serverTimestamp()
    });
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
  const username = document.getElementById('signupUsername').value.trim().toLowerCase();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const gender = document.getElementById('signupGender').value;
  const ageRange = document.getElementById('signupAgeRange').value;
  const countrySelect = document.getElementById('signupCountry');
  const country = countrySelect.value;
  const countryName = countrySelect.options[countrySelect.selectedIndex]?.text || '';
  const city = document.getElementById('signupCity').value.trim();

  // Validation
  if (!name || !username || !email || !password) {
    showMessage('error', 'Por favor preenche todos os campos obrigatórios.');
    return;
  }

  // Validate username format
  if (!/^[a-z0-9._]+$/.test(username)) {
    showMessage('error', 'Username inválido. Use apenas letras minúsculas, números, ponto (.) e underscore (_).');
    return;
  }

  if (username.length < 3) {
    showMessage('error', 'O username deve ter pelo menos 3 caracteres.');
    return;
  }

  if (!gender || !ageRange || !country || !city) {
    showMessage('error', 'Por favor preenche todos os campos obrigatórios (sexo, faixa etária, país e cidade).');
    return;
  }

  if (password.length < 6) {
    showMessage('error', 'A password deve ter pelo menos 6 caracteres.');
    return;
  }

  showLoading();
  clearMessages();

  try {
    // Verificar se o username já existe
    const usernameCheck = await db.collection('users').where('username', '==', username).limit(1).get();
    if (!usernameCheck.empty) {
      hideLoading();
      showMessage('error', `Username "@${username}" já está em uso. Por favor escolhe outro.`);
      return;
    }
    
    const additionalData = {
      username,
      gender,
      ageRange,
      country,
      countryName,
      city
    };
    
    await signUpWithEmail(email, password, name, additionalData);
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
// LOCATION MODAL (Google/Reddit Signup)
// ========================================
// pendingUserForLocation já está declarado no topo do arquivo como variável global

// Lista de países
const COUNTRIES_LIST = [
  { code: 'PT', name: 'Portugal' },
  { code: 'BR', name: 'Brasil' },
  { code: 'AO', name: 'Angola' },
  { code: 'MZ', name: 'Moçambique' },
  { code: 'CV', name: 'Cabo Verde' },
  { code: 'GW', name: 'Guiné-Bissau' },
  { code: 'ST', name: 'São Tomé e Príncipe' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'MO', name: 'Macau' },
  { code: 'ES', name: 'Espanha' },
  { code: 'FR', name: 'França' },
  { code: 'GB', name: 'Reino Unido' },
  { code: 'DE', name: 'Alemanha' },
  { code: 'IT', name: 'Itália' },
  { code: 'NL', name: 'Países Baixos' },
  { code: 'BE', name: 'Bélgica' },
  { code: 'CH', name: 'Suíça' },
  { code: 'LU', name: 'Luxemburgo' },
  { code: 'AT', name: 'Áustria' },
  { code: 'US', name: 'Estados Unidos' },
  { code: 'CA', name: 'Canadá' },
  { code: 'MX', name: 'México' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colômbia' },
  { code: 'PE', name: 'Peru' },
  { code: 'VE', name: 'Venezuela' }
].sort((a, b) => a.name.localeCompare(b.name));

// Função para carregar países em um select
function loadCountriesIntoSelect(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;
  
  // Limpar opções existentes (exceto a primeira)
  while (select.options.length > 1) {
    select.remove(1);
  }
  
  // Adicionar países
  COUNTRIES_LIST.forEach(country => {
    const option = document.createElement('option');
    option.value = country.code;
    option.textContent = country.name;
    select.appendChild(option);
  });
}

// Carregar países nos selects quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
  loadCountriesIntoSelect('signupCountry');
  loadCountriesIntoSelect('modalCountry');
});

// Handler do modal de localização
const locationModal = document.getElementById('locationModal');
const locationForm = document.getElementById('locationForm');

if (locationForm) {
  locationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!pendingUserForLocation) {
      console.error('❌ Nenhum utilizador pendente');
      return;
    }
    
    const username = document.getElementById('modalUsername').value.trim().toLowerCase();
    const gender = document.getElementById('modalGender').value;
    const ageRange = document.getElementById('modalAgeRange').value;
    const countrySelect = document.getElementById('modalCountry');
    const country = countrySelect.value;
    const countryName = countrySelect.options[countrySelect.selectedIndex]?.text || '';
    const city = document.getElementById('modalCity').value.trim();
    
    // Validação
    if (!username || !gender || !ageRange || !country || !city) {
      alert('Por favor preenche todos os campos obrigatórios.');
      return;
    }
    
    // Validate username format
    if (!/^[a-z0-9._]+$/.test(username)) {
      alert('Username inválido. Use apenas letras minúsculas, números, ponto (.) e underscore (_).');
      return;
    }

    if (username.length < 3) {
      alert('O username deve ter pelo menos 3 caracteres.');
      return;
    }
    
    showLoading();
    
    try {
      // Verificar se o username já existe
      const usernameCheck = await db.collection('users').where('username', '==', username).limit(1).get();
      if (!usernameCheck.empty) {
        hideLoading();
        alert(`Username "@${username}" já está em uso. Por favor escolhe outro.`);
        return;
      }
      
      // Atualizar dados do utilizador no Firestore
      await updateUserData(pendingUserForLocation.uid, {
        username,
        gender,
        ageRange,
        country,
        countryName,
        city
      });
      
      console.log('✅ Dados demográficos salvos');
      
      // Esconder modal
      hideLocationModal();
      
      // Redirecionar para dashboard
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 500);
    } catch (error) {
      console.error('❌ Erro ao salvar dados:', error);
      hideLoading();
      alert('Erro ao salvar dados. Por favor tenta novamente.');
    }
  });
}

function showLocationModal(user) {
  pendingUserForLocation = user;
  if (locationModal) {
    locationModal.classList.remove('hidden');
    
    // Carregar países no modal se ainda não foram carregados
    const modalCountrySelect = document.getElementById('modalCountry');
    if (modalCountrySelect && modalCountrySelect.options.length <= 1) {
      loadCountriesIntoSelect('modalCountry');
    }
  }
}

function hideLocationModal() {
  if (locationModal) {
    locationModal.classList.add('hidden');
  }
  pendingUserForLocation = null;
}

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
