/* ============================================
   QUEST4COUPLE - AUTHENTICATION
   Sistema de autenticação com Firebase
   ============================================ */

// Estado global do user
let currentUser = null;
let isRedirecting = false; // Flag para evitar múltiplos redirects

// ========================================
// AUTH STATE OBSERVER
// ========================================
auth.onAuthStateChanged(async (user) => {
  if (user) {
    console.log('✅ User autenticado:', user.email);
    console.log('🔍 User UID:', user.uid);
    console.log('🔍 User displayName:', user.displayName);
    currentUser = user;
    
    // Criar/Atualizar perfil no Firestore
    let firestoreSuccess = false;
    try {
      console.log('🔵 Chamando createOrUpdateUserProfile...');
      await createOrUpdateUserProfile(user);
      console.log('✅ Perfil criado/atualizado no Firestore');
      firestoreSuccess = true;
    } catch (error) {
      console.error('❌ Erro ao criar perfil:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      console.error('🔴 NÃO REDIRECIONAR - Perfil não foi criado no Firestore!');
      firestoreSuccess = false;
    }
      // Redirecionar para dashboard APENAS se o perfil foi criado com sucesso
    if (window.location.pathname.includes('auth.html') && !isRedirecting && firestoreSuccess) {
      console.log('🔄 Redirecionando para dashboard...');
      isRedirecting = true;
      
      // Delay para garantir que tudo foi processado
      // Não precisa ser grande porque retry logic já garantiu sucesso
      console.log('⏳ Aguardando 1 segundo para finalizar...');
      setTimeout(() => {
        console.log('✅ Redirecionando agora...');
        window.location.href = 'dashboard.html';
      }, 1000); // 1s é suficiente após retry logic ter sucesso
    }
    
    // Mostrar conteúdo protegido
    if (!isRedirecting) {
      showAuthenticatedContent();
    }
  } else {
    console.log('❌ User não autenticado');
    currentUser = null;
    isRedirecting = false; // Reset flag
    
    // Redirecionar para auth se estiver em página protegida
    const protectedPages = ['dashboard.html', 'app.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isRedirecting) {
      console.log('🔄 Redirecionando para auth...');
      isRedirecting = true;
      window.location.href = 'auth.html';
    }
    
    if (!isRedirecting) {
      showUnauthenticatedContent();
    }
  }
});

// ========================================
// SIGN UP COM EMAIL/PASSWORD
// ========================================
async function signUpWithEmail(email, password, displayName, additionalData = {}) {
  try {
    console.log('📝 Criando conta com email/password...');
    
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    console.log('✅ Utilizador criado no Firebase Auth:', user.email);
    
    // Update profile name
    await user.updateProfile({ displayName });
    console.log('✅ DisplayName atualizado:', displayName);
    
    // Store additional data temporarily for use in onAuthStateChanged
    // This will be picked up by createOrUpdateUserProfile
    if (Object.keys(additionalData).length > 0) {
      sessionStorage.setItem('pendingUserData', JSON.stringify({
        ...additionalData,
        displayName: displayName,
        name: displayName
      }));
      console.log('💾 Dados adicionais guardados temporariamente');
    }
    
    console.log('✅ Conta criada com sucesso:', user.email);
    console.log('⏳ Perfil será criado no Firestore pelo onAuthStateChanged...');
    
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
async function createOrUpdateUserProfile(user, additionalData = {}) {
  try {
    console.log('🔵 Criando/atualizando perfil para:', user.email);
    
    // ⭐ CRITICAL: Aguardar token de autenticação estar pronto
    console.log('⏳ Aguardando token de autenticação...');
    const token = await user.getIdToken(true); // Force refresh
    console.log('✅ Token obtido:', token ? 'OK' : 'FALHOU');
    
    // Aguardar mais 500ms para garantir propagação
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('✅ Aguardou 500ms para propagação do token');
    
    // Check for pending user data from registration
    const pendingDataStr = sessionStorage.getItem('pendingUserData');
    let pendingData = {};
    
    if (pendingDataStr) {
      try {
        pendingData = JSON.parse(pendingDataStr);
        console.log('📦 Dados pendentes encontrados:', pendingData);
        sessionStorage.removeItem('pendingUserData'); // Clean up
      } catch (e) {
        console.warn('⚠️ Erro ao parse de dados pendentes:', e);
      }
    }
    
    // Merge all data sources (priority: additionalData > pendingData > defaults)
    const mergedData = {
      ...pendingData,
      ...additionalData
    };
      
    console.log('🔍 Database (db):', db);
    console.log('🔍 User UID para Firestore:', user.uid);
    
    const userRef = db.collection('users').doc(user.uid);
    console.log('🔍 UserRef criado:', userRef.path);
    
    console.log('📖 Verificando se perfil já existe...');
    const doc = await userRef.get();
    console.log('📖 Documento existe?', doc.exists);
      if (!doc.exists) {
      // Criar novo perfil
      console.log('🔵 Perfil não existe, criando novo...');
      
      // ⭐ GERAR USERNAME ÚNICO AUTOMATICAMENTE
      let username = mergedData.username || null;
      if (!username) {
        const displayName = user.displayName || mergedData.displayName || mergedData.name || 'User';
        console.log('🔄 Gerando username único para:', displayName);
        username = await generateUniqueUsername(displayName);
        console.log('✅ Username gerado:', username);
      }
      
      const profileData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || mergedData.displayName || 'User',
        name: user.displayName || mergedData.name || 'User',
        username: username,
        photoURL: user.photoURL || null,
        gender: mergedData.gender || null,
        age: mergedData.age || null,
        ageRange: mergedData.ageRange || null,
        country: mergedData.country || null,
        countryName: mergedData.countryName || null,
        city: mergedData.city || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
        authProvider: user.providerData[0]?.providerId || 'password',
        isAdmin: false,
        profileComplete: !!(mergedData.age && mergedData.country && mergedData.city)
      };
      
      console.log('📝 Dados do perfil a criar:', profileData);
      console.log('🔐 Auth UID:', user.uid);
      console.log('🔐 Document ID:', user.uid);
      console.log('✅ UIDs coincidem?', user.uid === user.uid);
      
      console.log('💾 Executando userRef.set() com RETRY...');
      
      // ⭐ RETRY LOGIC: Tentar até 3 vezes com delays crescentes
      let attempts = 0;
      let success = false;
      let lastError = null;
      
      while (attempts < 3 && !success) {
        attempts++;
        console.log(`🔄 Tentativa ${attempts}/3 de criar perfil...`);
        
        try {
          await userRef.set(profileData);
          success = true;
          console.log('✅ Perfil criado com sucesso!');
        } catch (err) {
          lastError = err;
          console.warn(`⚠️ Tentativa ${attempts} falhou:`, err.message);
          
          if (attempts < 3) {
            const delay = attempts * 1000; // 1s, 2s, 3s
            console.log(`⏳ Aguardando ${delay}ms antes de retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
        if (!success) {
        throw lastError || new Error('Failed to create profile after 3 attempts');
      }
      
      // 📧 ENVIAR NOTIFICAÇÃO DE NOVO REGISTO POR EMAIL
      if (typeof sendNewUserNotification === 'function') {
        console.log('📧 Enviando notificação de novo registo...');
        sendNewUserNotification(profileData)
          .then(result => {
            if (result.success) {
              console.log('✅ Notificação de email enviada com sucesso');
            } else {
              console.log('⚠️ Notificação de email não enviada:', result.reason || result.error);
            }
          })
          .catch(err => {
            console.warn('⚠️ Erro ao enviar notificação (não bloqueante):', err);
          });
      }
      
    } else {
      // Atualizar last login
      console.log('🔵 Perfil existe, atualizando last login...');
      await userRef.update({
        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      console.log('✅ Perfil atualizado');
    }
      return true; // Retorna sucesso
  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ ERRO AO CRIAR/ATUALIZAR PERFIL NO FIRESTORE');
    console.error('❌ ========================================');
    console.error('❌ Error object:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ ========================================');
    console.error('❌ User UID:', user.uid);
    console.error('❌ User email:', user.email);
    console.error('❌ Auth state:', auth.currentUser ? 'Authenticated' : 'NOT authenticated');
    console.error('❌ ========================================');
    
    // NÃO bloquear o redirect mesmo se houver erro no Firestore
    // Mas vamos fazer throw para ver o erro no console
    throw error;
  }
}

// ========================================
// ATUALIZAR DADOS DO UTILIZADOR
// ========================================
async function updateUserData(userId, data) {
  try {
    const userRef = db.collection('users').doc(userId);
    await userRef.update(data);
    console.log('✅ Dados do utilizador atualizados');
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao atualizar dados:', error);
    return { success: false, error: error.message };
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
  isUserAuthenticated,
  updateUserData
};

console.log('🔐 Auth module carregado!');
