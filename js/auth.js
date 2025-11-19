/* ============================================
   QUEST4COUPLE - AUTHENTICATION
   Sistema de autenticação com Firebase
   ============================================ */

// Estado global do user
let currentUser = null;

// ========================================
// AUTH STATE OBSERVER
// ========================================
auth.onAuthStateChanged(async (user) => {
  if (user) {
    console.log('✅ User autenticado:', user.email);
    currentUser = user;
    
    // Criar/Atualizar perfil no Firestore
    await createOrUpdateUserProfile(user);
    
    // Redirecionar para dashboard se estiver em auth page
    if (window.location.pathname.includes('auth.html')) {
      window.location.href = 'dashboard.html';
    }
    
    // Mostrar conteúdo protegido
    showAuthenticatedContent();
  } else {
    console.log('❌ User não autenticado');
    currentUser = null;
    
    // Redirecionar para auth se estiver em página protegida
    const protectedPages = ['dashboard.html', 'app.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
      window.location.href = 'auth.html';
    }
    
    showUnauthenticatedContent();
  }
});

// ========================================
// SIGN UP COM EMAIL/PASSWORD
// ========================================
async function signUpWithEmail(email, password, displayName) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    // Update profile
    await user.updateProfile({ displayName });
    
    console.log('✅ Conta criada:', user.email);
    return { success: true, user };
  } catch (error) {
    console.error('❌ Erro ao criar conta:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// ========================================
// SIGN IN COM EMAIL/PASSWORD
// ========================================
async function signInWithEmail(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    console.log('✅ Login bem-sucedido:', userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error('❌ Erro no login:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// ========================================
// SIGN IN COM GOOGLE
// ========================================
async function signInWithGoogle() {
  try {
    console.log('🔵 Iniciando Google Sign In...');
    console.log('🔵 Google Provider:', googleProvider);
    console.log('🔵 Auth:', auth);
    
    const result = await auth.signInWithPopup(googleProvider);
    
    console.log('✅ Login Google bem-sucedido:', result.user.email);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('❌ Erro no login Google:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    
    // Re-throw the error so it can be caught in auth-ui.js
    throw error;
  }
}

// ========================================
// SIGN OUT
// ========================================
async function signOut() {
  try {
    await auth.signOut();
    console.log('✅ Logout bem-sucedido');
    window.location.href = 'index.html';
    return { success: true };
  } catch (error) {
    console.error('❌ Erro no logout:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// RESET PASSWORD
// ========================================
async function resetPassword(email) {
  try {
    await auth.sendPasswordResetEmail(email);
    console.log('✅ Email de recuperação enviado');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// ========================================
// CRIAR/ATUALIZAR PERFIL NO FIRESTORE
// ========================================
async function createOrUpdateUserProfile(user) {
  try {
    const userRef = db.collection('users').doc(user.uid);
    const doc = await userRef.get();
    
    if (!doc.exists) {
      // Criar novo perfil
      const username = await generateUniqueUsername(user.displayName || user.email);
      
      await userRef.set({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'User',
        username: username,
        photoURL: user.photoURL || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
        plan: 'free',
        answers: {},
        customQuestions: {},
        connections: []
      });
      
      console.log('✅ Perfil criado:', username);
    } else {
      // Atualizar last login
      await userRef.update({
        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('✅ Perfil atualizado');
    }
  } catch (error) {
    console.error('❌ Erro ao criar/atualizar perfil:', error);
  }
}

// ========================================
// GERAR USERNAME ÚNICO
// ========================================
async function generateUniqueUsername(name) {
  let baseUsername = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15);
  
  let username = baseUsername;
  let counter = 1;
  
  while (await usernameExists(username)) {
    username = `${baseUsername}${counter}`;
    counter++;
  }
  
  return username;
}

// ========================================
// VERIFICAR SE USERNAME EXISTE
// ========================================
async function usernameExists(username) {
  const snapshot = await db.collection('users')
    .where('username', '==', username)
    .limit(1)
    .get();
  
  return !snapshot.empty;
}

// ========================================
// GET USER PROFILE
// ========================================
async function getUserProfile(userId) {
  try {
    const doc = await db.collection('users').doc(userId).get();
    
    if (doc.exists) {
      return { success: true, profile: doc.data() };
    } else {
      return { success: false, error: 'Perfil não encontrado' };
    }
  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// UI HELPERS
// ========================================
function showAuthenticatedContent() {
  const authButtons = document.querySelectorAll('.auth-only');
  const guestButtons = document.querySelectorAll('.guest-only');
  
  authButtons.forEach(el => el.style.display = 'block');
  guestButtons.forEach(el => el.style.display = 'none');
}

function showUnauthenticatedContent() {
  const authButtons = document.querySelectorAll('.auth-only');
  const guestButtons = document.querySelectorAll('.guest-only');
  
  authButtons.forEach(el => el.style.display = 'none');
  guestButtons.forEach(el => el.style.display = 'block');
}

// ========================================
// ERROR MESSAGES (PT)
// ========================================
function getErrorMessage(errorCode) {
  const messages = {
    'auth/email-already-in-use': 'Este email já está registado.',
    'auth/invalid-email': 'Email inválido.',
    'auth/operation-not-allowed': 'Operação não permitida.',
    'auth/weak-password': 'Password muito fraca (mínimo 6 caracteres).',
    'auth/user-disabled': 'Conta desativada.',
    'auth/user-not-found': 'Email não encontrado.',
    'auth/wrong-password': 'Password incorreta.',
    'auth/too-many-requests': 'Muitas tentativas. Tenta novamente mais tarde.',
    'auth/popup-closed-by-user': 'Popup fechado. Tenta novamente.',
    'auth/cancelled-popup-request': 'Operação cancelada.',
    'auth/popup-blocked': 'Popup bloqueado pelo browser. Permite popups para este site.'
  };
  
  return messages[errorCode] || 'Erro desconhecido. Tenta novamente.';
}

// ========================================
// GET CURRENT USER
// ========================================
function getCurrentUser() {
  return currentUser;
}

function isUserAuthenticated() {
  return currentUser !== null;
}

// Export functions
window.authFunctions = {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  resetPassword,
  getUserProfile,
  getCurrentUser,
  isUserAuthenticated
};

console.log('🔐 Auth module carregado!');
