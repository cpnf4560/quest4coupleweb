/* ============================================
   QUEST4COUPLE - DASHBOARD LOGIC
   ============================================ */

// ========================================
// GLOBAL STATE
// ========================================
let userProfile = null;
let userAnswers = {};
let userConnections = [];
let packsData = [];
let currentResetPackId = null; // Pack selecionado para reset
// auth e db já são declarados em firebase-config.js

// ========================================
// DOM ELEMENTS (serão inicializados depois do DOM estar pronto)
// ========================================
let userName, userDisplayName, logoutBtn, packsGrid, connectionsList, loadingOverlay;

// Modals
let addConnectionModal, shareModal, resetPackModal, editProfileModal, addConnectionBtn, closeModalBtn, closeShareModalBtn, searchUserForm, searchResults;

// Stats
let totalAnswersEl, completedPacksEl, totalConnectionsEl, sharedReportsEl;

// ========================================
// INIT EVENT LISTENERS
// ========================================
function initEventListeners() {
  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      showLoading();
      try {
        await auth.signOut();
        window.location.href = 'auth.html';
      } catch (error) {
        console.error('Erro ao fazer logout:', error);
        hideLoading();
      }
    });
  }
  
  // Add connection modal
  if (addConnectionBtn) {
    addConnectionBtn.addEventListener('click', () => {
      if (addConnectionModal) {
        addConnectionModal.classList.add('active');
        if (searchResults) searchResults.innerHTML = '';
        const searchInput = document.getElementById('searchUsername');
        if (searchInput) searchInput.value = '';
        updateMyUsernameDisplay();
      }
    });
  }
  
  // Close modals
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (addConnectionModal) addConnectionModal.classList.remove('active');
    });
  }
  
  if (closeShareModalBtn) {
    closeShareModalBtn.addEventListener('click', () => {
      if (shareModal) shareModal.classList.remove('active');
    });
  }
  
  // Search user form
  if (searchUserForm) {
    searchUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const searchInput = document.getElementById('searchUsername');
      if (searchInput) {
        await searchUser(searchInput.value);
      }
    });
  }
  
  // Confirm share button
  const confirmShareBtn = document.getElementById('confirmShareBtn');
  if (confirmShareBtn) {
    confirmShareBtn.addEventListener('click', async () => {
      await confirmShare();
    });
  }
  
  // Edit profile button
  const editProfileBtn = document.getElementById('editProfileBtn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', openEditProfileModal);
  }
  
  // Close modals on outside click
  if (addConnectionModal) {
    addConnectionModal.addEventListener('click', (e) => {
      if (e.target === addConnectionModal) {
        addConnectionModal.classList.remove('active');
      }
    });
  }
  
  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) {
        shareModal.classList.remove('active');
      }
    });
  }
  
  console.log('✅ Event listeners inicializados');
}

// ========================================
// INIT
// ========================================
// Aguardar Firebase estar pronto
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar elementos DOM principais
  userName = document.getElementById('userName');
  userDisplayName = document.getElementById('userDisplayName');
  logoutBtn = document.getElementById('logoutBtn');
  packsGrid = document.getElementById('packsGrid');
  connectionsList = document.getElementById('connectionsList');
  loadingOverlay = document.getElementById('loadingOverlay');
  
  // Inicializar modais
  addConnectionModal = document.getElementById('addConnectionModal');
  shareModal = document.getElementById('shareModal');
  resetPackModal = document.getElementById('resetPackModal');
  editProfileModal = document.getElementById('editProfileModal');
  addConnectionBtn = document.getElementById('addConnectionBtn');
  closeModalBtn = document.getElementById('closeModalBtn');
  closeShareModalBtn = document.getElementById('closeShareModalBtn');
  searchUserForm = document.getElementById('searchUserForm');
  searchResults = document.getElementById('searchResults');
  
  // Inicializar stats
  totalAnswersEl = document.getElementById('totalAnswers');
  completedPacksEl = document.getElementById('completedPacks');
  totalConnectionsEl = document.getElementById('totalConnections');
  sharedReportsEl = document.getElementById('sharedReports');
  
  console.log('✅ Elementos DOM inicializados');
    // Verificar se Firebase já foi inicializado por firebase-config.js
  if (typeof firebase === 'undefined' || typeof auth === 'undefined' || typeof db === 'undefined') {
    console.error('❌ Firebase não carregado corretamente');
    alert('Erro ao carregar Firebase. Recarregue a página.');
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    return;
  }
  
  console.log('✅ Firebase já inicializado, usando instâncias globais');
  
  // Inicializar event listeners
  initEventListeners();

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log('✅ Utilizador autenticado:', user.email);
      await initDashboard(user);
    } else {
      console.log('❌ Nenhum utilizador autenticado, redirecionando...');
      window.location.href = 'auth.html';
    }
  });
});

async function initDashboard(user) {
  try {
    console.log('🔄 Inicializando dashboard para:', user.email);
    showLoading();
    
    // Load user profile
    console.log('📥 Carregando perfil...');
    userProfile = await loadUserProfile(user.uid);
    console.log('✅ Perfil carregado:', userProfile);
    
    // ⭐ VERIFICAR SE PERFIL ESTÁ COMPLETO
    if (window.profileCompletion && !window.profileCompletion.isProfileComplete(userProfile)) {
      console.log('⚠️ Perfil incompleto - solicitando dados em falta');
      hideLoading();
      
      await window.profileCompletion.checkAndRequestProfileCompletion(userProfile, async (updatedData) => {
        console.log('✅ Perfil completado:', updatedData);
        // Atualizar userProfile local com os novos dados
        userProfile = { ...userProfile, ...updatedData };
        // Continuar inicialização do dashboard
        showLoading();
        await continueInitDashboard(user);
      });
      return; // Esperar pelo callback
    }
    
    await continueInitDashboard(user);
  } catch (error) {
    console.error('❌ Erro ao inicializar dashboard:', error);
    alert('Erro ao carregar dashboard: ' + error.message);
    hideLoading();
  }
}

async function continueInitDashboard(user) {
  try {
    // Update UI with proper name fallback
    const displayName = userProfile?.name || user.displayName || user.email?.split('@')[0] || 'Utilizador';
    const userNameEl = document.getElementById('currentUserName');
    const userDisplayNameEl = document.getElementById('userDisplayName');
    
    if (userNameEl) userNameEl.textContent = displayName;
    if (userDisplayNameEl) userDisplayNameEl.textContent = displayName;

    // Load packs data
    console.log('📥 Carregando packs...');
    await loadPacksData();
    console.log('✅ Packs carregados:', packsData.length);

    // Load user answers
    console.log('📥 Carregando respostas...');
    userAnswers = await loadUserAnswers(user.uid);
    console.log('✅ Respostas carregadas:', Object.keys(userAnswers).length);

    // Load connections
    console.log('📥 Carregando conexões...');
    userConnections = await loadUserConnections(user.uid);
    console.log('✅ Conexões carregadas:', userConnections.length);
    
    // Load pending connection requests
    console.log('📥 Carregando pedidos de conexão...');
    await loadAndRenderConnectionRequests(user.uid);
    
    // Render everything
    console.log('🎨 Renderizando interface...');
    renderStats();
    renderPacks();
    renderConnections();
      // Update username display in modal (if it exists)
    updateMyUsernameDisplay();
    
    // 💬 Verificar mensagens de suporte pendentes
    if (typeof checkAndShowSupportMessage === 'function') {
      checkAndShowSupportMessage(user.uid);
    }

    console.log('✅ Dashboard inicializado com sucesso!');
    hideLoading();
  } catch (error) {
    console.error('❌ Erro ao inicializar dashboard:', error);
    alert('Erro ao carregar dashboard: ' + error.message);
    hideLoading();
  }
}

// ========================================
// FIRESTORE - LOAD DATA
// ========================================
async function loadUserProfile(userId) {
  try {
    const doc = await db.collection('users').doc(userId).get();
    if (doc.exists) {
      return doc.data();
    }
    return null;
  } catch (error) {
    console.error('Erro ao carregar perfil:', error);
    return null;
  }
}

async function loadUserAnswers(userId) {
  try {
    const doc = await db.collection('users').doc(userId).collection('answers').doc('all').get();
    if (doc.exists) {
      return doc.data();
    }
    return {};
  } catch (error) {
    console.error('Erro ao carregar respostas:', error);
    return {};
  }
}

async function loadUserConnections(userId) {
  try {
    const snapshot = await db.collection('connections')
      .where('users', 'array-contains', userId)
      .get();
    
    const connections = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const partnerId = data.users.find(id => id !== userId);
      const partnerProfile = await loadUserProfile(partnerId);
      
      connections.push({
        id: doc.id,
        partnerId: partnerId,
        partnerProfile: partnerProfile,
        sharedPacks: data.sharedPacks || [],
        report: data.report || null
      });
    }
    
    return connections;
  } catch (error) {
    console.error('Erro ao carregar conexões:', error);
    return [];
  }
}

async function loadPacksData() {
  try {
    // Determinar ficheiro baseado no idioma atual
    const currentLang = (typeof I18n !== 'undefined' && I18n.currentLang) 
      ? I18n.currentLang 
      : (localStorage.getItem('quest4couple_lang') || 'pt-pt');
    
    const langFileMap = {
      'pt-pt': 'packs_data_clean.json',
      'pt-br': 'packs_data_pt-br.json',
      'en': 'packs_data_en.json',
      'es': 'packs_data_es.json',
      'fr': 'packs_data_fr.json'
    };
    
    const jsonFile = langFileMap[currentLang] || 'packs_data_clean.json';
    console.log('🌍 Dashboard: Carregando ficheiro de idioma:', jsonFile);

    const response = await fetch(`data/${jsonFile}?v=` + Date.now());
    const data = await response.json();
    
    // O JSON é um array direto, não tem propriedade "packs"
    packsData = Array.isArray(data) ? data.map((pack, index) => {
      // Adicionar ID se não existir
      if (!pack.id) {
        pack.id = pack.color || `pack-${index}`;
      }
      
      // Calcular total de perguntas
      let totalQuestions = 0;
      if (pack.categories && Array.isArray(pack.categories)) {
        pack.categories.forEach(cat => {
          if (cat.questions) {
            totalQuestions += cat.questions.length;
          }
        });
      }
      pack.questions = { length: totalQuestions };
      
      // Mapear emoji para icon
      pack.icon = pack.emoji || '📝';
      
      return pack;
    }) : [];
    
    console.log('✅ Packs carregados:', packsData.length);
  } catch (error) {
    console.error('❌ Erro ao carregar packs:', error);
    packsData = [];
  }
}

// ========================================
// RENDER STATS
// ========================================
function renderStats() {
  // Total answers
  let totalAnswers = 0;
  Object.values(userAnswers).forEach(packAnswers => {
    if (packAnswers && typeof packAnswers === 'object') {
      totalAnswers += Object.keys(packAnswers).length;
    }
  });
  totalAnswersEl.textContent = totalAnswers;

  // Completed packs
  let completedPacks = 0;
  packsData.forEach(pack => {
    const packAnswers = userAnswers[pack.id] || {};
    const answeredCount = Object.keys(packAnswers).length;
    if (answeredCount >= pack.questions.length) {
      completedPacks++;
    }
  });
  completedPacksEl.textContent = completedPacks;

  // Total connections
  totalConnectionsEl.textContent = userConnections.length;

  // Shared reports
  const reportsCount = userConnections.filter(conn => conn.report !== null).length;
  sharedReportsEl.textContent = reportsCount;
}

// ========================================
// RENDER PACKS
// ========================================
function renderPacks() {
  // Obter traduções do i18n (se disponível)
  const t = (key, fallback) => {
    if (typeof I18n !== 'undefined' && I18n.t) {
      const result = I18n.t(key);
      return result !== key ? result : fallback;
    }
    return fallback;
  };

  // Mapeamento de nomes e descrições de packs para i18n
  const packTranslations = {
    'romantico': {
      name: t('dashboard.packs.romantic', 'Pack Romântico'),
      description: t('dashboard.packs.romanticDesc', 'Sensualidade, ambiente e conexão íntima')
    },
    'experiencia': {
      name: t('dashboard.packs.exploration', 'Exploração e Aventura a Dois'),
      description: t('dashboard.packs.explorationDesc', 'Cenários, ousadia e novas experiências')
    },
    'pimentinha': {
      name: t('dashboard.packs.spicy', 'Pimentinha'),
      description: t('dashboard.packs.spicyDesc', 'Adicione tempero, provocação e jogos sensuais')
    },
    'poliamor': {
      name: t('dashboard.packs.polyamory', 'Poliamor'),
      description: t('dashboard.packs.polyamoryDesc', 'Abertura, não-monogamia e exploração a múltiplos')
    },
    'kinks': {
      name: t('dashboard.packs.fetishes', 'Fetiches'),
      description: t('dashboard.packs.fetishesDesc', 'Fetiches específicos, práticas avançadas e kinks')
    }
  };

  packsGrid.innerHTML = '';

  if (packsData.length === 0) {
    packsGrid.innerHTML = `<p>${t('dashboard.packs.noPacks', 'Nenhum pack disponível')}</p>`;
    return;
  }

  const startText = t('dashboard.packs.start', 'Começar');
  const continueText = t('dashboard.packs.continue', 'Continuar');
  const viewAnswersText = t('dashboard.packs.viewAnswers', 'Ver Respostas');
  const resetText = t('dashboard.reset.button', 'Resetar');
  const ofText = t('common.of', 'de');

  packsData.forEach(pack => {
    const packAnswers = userAnswers[pack.id] || {};
    const answeredCount = Object.keys(packAnswers).length;
    const totalQuestions = pack.questions.length;
    const progress = Math.round((answeredCount / totalQuestions) * 100);

    // Usar traduções se disponíveis, senão usar os dados originais
    const packI18n = packTranslations[pack.id] || {};
    const packName = packI18n.name || pack.name;
    const packDescription = packI18n.description || pack.description || '';

    const card = document.createElement('div');
    card.className = 'pack-card';
    card.innerHTML = `
      <div class="pack-header" style="background: ${pack.color || '#667eea'}">
        <div class="pack-icon">${pack.icon || '📝'}</div>
        <div class="pack-name">${packName}</div>
        <div class="pack-description">${packDescription}</div>
      </div>
      <div class="pack-body">
        <div class="pack-progress">
          <div class="pack-progress-text">
            <span>${answeredCount} ${ofText} ${totalQuestions}</span>
            <span>${progress}%</span>
          </div>
          <div class="pack-progress-bar-container">
            <div class="pack-progress-bar" style="width: ${progress}%"></div>
          </div>
        </div>
        <div class="pack-actions">
          <div class="pack-actions-row">
            <button class="btn-pack btn-answer" onclick="goToQuiz('${pack.id}')">
              ${answeredCount === 0 ? startText : continueText}
            </button>
            ${answeredCount > 0 ? '<button class="btn-pack btn-view" onclick="viewAnswers(\'' + pack.id + '\')">' + viewAnswersText + '</button>' : ''}
          </div>
          ${answeredCount > 0 ? `<button class="btn-reset" onclick="openResetPackModal('${pack.id}', '${packName.replace(/'/g, "\\'")}')">🗑️ ${resetText}</button>` : ''}
        </div>
      </div>
    `;
    
    packsGrid.appendChild(card);
  });
}

// ========================================
// RENDER CONNECTIONS
// ========================================
function renderConnections() {
  // Obter traduções do i18n (se disponível)
  const t = (key, fallback) => {
    if (typeof I18n !== 'undefined' && I18n.t) {
      const result = I18n.t(key);
      return result !== key ? result : fallback;
    }
    return fallback;
  };

  if (userConnections.length === 0) {
    connectionsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💑</div>
        <h3>${t('dashboard.connections.noConnectionsTitle', 'Nenhuma conexão ainda')}</h3>
        <p>${t('dashboard.connections.noConnectionsDesc', 'Adiciona o teu parceiro para partilharem respostas e gerarem relatórios juntos!')}</p>
      </div>
    `;
    return;
  }
  connectionsList.innerHTML = '';

  const shareText = t('dashboard.share.shareWith', 'Partilhar');
  const viewReportText = t('dashboard.packs.viewReport', 'Ver Relatório');

  userConnections.forEach(connection => {
    const partner = connection.partnerProfile || {}; // Fallback para objeto vazio se null
    const partnerName = partner.name || t('common.user', 'Utilizador');
    const partnerUsername = partner.username || t('common.unknown', 'desconhecido');
    const initials = partnerName.substring(0, 2).toUpperCase();

    const card = document.createElement('div');
    card.className = 'connection-card';
    card.innerHTML = `
      <div class="connection-info">
        <div class="connection-avatar">${initials}</div>
        <div class="connection-details">
          <h3>${partnerName}</h3>
          <p>@${partnerUsername}</p>
        </div>
      </div>
      <div class="connection-actions">
        <button class="btn-secondary" onclick="shareWithPartner('${connection.id}', '${partnerName.replace(/'/g, "\\'")}')">
          ${shareText}
        </button>
        ${connection.report ? '<button class="btn-secondary" onclick="viewReport(\'' + connection.id + '\')">' + viewReportText + '</button>' : ''}
        <button class="btn-danger" onclick="deleteConnection('${connection.id}', '${partnerName.replace(/'/g, "\\'")}')" title="${t('dashboard.connections.remove', 'Remover conexão')}">
          🗑️
        </button>
      </div>
    `;

    connectionsList.appendChild(card);
  });
}

// ========================================
// ACTIONS
// ========================================
function goToQuiz(packId) {
  window.location.href = `app.html?pack=${packId}`;
}

function viewAnswers(packId) {
  window.location.href = `app.html?pack=${packId}&view=true`;
}

function viewReport(connectionId) {
  window.location.href = `report.html?connection=${connectionId}`;
}

// ========================================
// ADD CONNECTION MODAL
// ========================================
// Função para atualizar o username no modal
function updateMyUsernameDisplay() {
  const usernameDisplay = document.getElementById('myUsernameDisplay');
  console.log('🔍 updateMyUsernameDisplay', { 
    elementExists: !!usernameDisplay, 
    userProfileExists: !!userProfile,
    userProfile: userProfile 
  });
  
  if (usernameDisplay) {
    if (userProfile) {
      const username = userProfile.username || userProfile.email?.split('@')[0] || auth.currentUser?.email?.split('@')[0] || 'user';
      usernameDisplay.textContent = `@${username}`;
      console.log('✅ Username atualizado:', `@${username}`);
    } else {
      console.warn('⚠️ userProfile ainda não carregado, mantendo "@carregando..."');
    }
  } else {
    console.warn('⚠️ Elemento myUsernameDisplay não encontrado no DOM');
  }
}

// Função para copiar o username
function copyMyUsername() {
  const username = userProfile?.username || userProfile?.email?.split('@')[0] || 'user';
  const textToCopy = `@${username}`;
  
  // Usar a API moderna do clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('✅ Username copiado para a área de transferência!');
    }).catch(err => {
      console.error('Erro ao copiar:', err);
      fallbackCopyToClipboard(textToCopy);
    });
  } else {
    fallbackCopyToClipboard(textToCopy);
  }
}

// Fallback para browsers mais antigos
function fallbackCopyToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    alert('✅ Username copiado para a área de transferência!');
  } catch (err) {
    console.error('Erro ao copiar:', err);
    alert('❌ Não foi possível copiar. Por favor, copia manualmente: ' + text);
  }
  
  document.body.removeChild(textArea);
}

// Tornar a função global para o onclick
window.copyMyUsername = copyMyUsername;

// Função para procurar utilizador (chamada pelo event listener)
async function searchUser(searchText) {
  const username = searchText.trim().replace('@', '');
  
  if (!username) {
    return;
  }

  showLoading();

  try {
    // Search for user by username
    const snapshot = await db.collection('users')
      .where('username', '==', username)
      .limit(1)
      .get();

    if (searchResults) searchResults.innerHTML = '';

    if (snapshot.empty) {
      if (searchResults) {
        searchResults.innerHTML = '<p style="text-align: center; color: #999;">Utilizador não encontrado 😕</p>';
      }
    } else {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;      // Check if already connected
      const alreadyConnected = userConnections.some(conn => conn.partnerId === userId);

      // Check if it's the current user
      if (userId === auth.currentUser.uid) {
        if (searchResults) {
          searchResults.innerHTML = '<p style="text-align: center; color: #999;">Não podes conectar contigo próprio 😅</p>';
        }      } else if (alreadyConnected) {
        if (searchResults) {
          searchResults.innerHTML = '<p style="text-align: center; color: #999;">Já estás conectado com este utilizador ✅</p>';
        }
      } else {
        // Check if there's already a pending request FROM ME to this user
        // Query simplificada para cumprir regras do Firestore
        // (só filtramos por fromUserId, depois verificamos toUserId localmente)
        const myPendingRequests = await db.collection('connection_requests')
          .where('fromUserId', '==', auth.currentUser.uid)
          .where('status', '==', 'pending')
          .get();
        
        // Verificar localmente se já existe pedido para este utilizador
        const pendingToThisUser = myPendingRequests.docs.find(doc => doc.data().toUserId === userId);
        
        const initials = userData.name ? userData.name.substring(0, 2).toUpperCase() : '??';
        
        if (pendingToThisUser) {
          if (searchResults) {
            searchResults.innerHTML = `
              <div class="user-result">
                <div class="user-result-info">
                  <div class="user-result-avatar">${initials}</div>
                  <div>
                    <h4>${userData.name || 'Utilizador'}</h4>
                    <p style="color: #666; font-size: 14px;">@${userData.username}</p>
                  </div>
                </div>
                <span style="color: #f59e0b; font-weight: 600;">⏳ Pedido enviado</span>              </div>
            `;
          }
        } else {
          if (searchResults) {
            const safeName = (userData.name || 'Utilizador').replace(/'/g, "\\'");
            searchResults.innerHTML = `
              <div class="user-result">
                <div class="user-result-info">
                  <div class="user-result-avatar">${initials}</div>
                  <div>
                    <h4>${userData.name || 'Utilizador'}</h4>
                    <p style="color: #666; font-size: 14px;">@${userData.username}</p>
                  </div>
                </div>
                <button class="btn-connect" onclick="sendConnectionRequest('${userId}', '${safeName}', '${userData.username}')">
                  📨 Enviar Pedido
                </button>
              </div>
            `;
          }
        }
      }
    }

    hideLoading();
  } catch (error) {
    console.error('Erro ao procurar utilizador:', error);
    if (searchResults) {
      searchResults.innerHTML = '<p style="text-align: center; color: #c33;">Erro ao procurar. Tenta novamente.</p>';
    }
    hideLoading();
  }
}

// Enviar pedido de conexão (em vez de conectar diretamente)
async function sendConnectionRequest(partnerId, partnerName, partnerUsername) {
  showLoading();

  try {
    // Obter dados do utilizador atual
    const currentUserDoc = await db.collection('users').doc(auth.currentUser.uid).get();
    const currentUserData = currentUserDoc.data();
    
    // Criar pedido de conexão
    await db.collection('connection_requests').add({
      fromUserId: auth.currentUser.uid,
      fromUserName: currentUserData.name || 'Utilizador',
      fromUsername: currentUserData.username || '',
      toUserId: partnerId,
      toUserName: partnerName,
      toUsername: partnerUsername,
      status: 'pending', // pending, accepted, rejected
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    hideLoading();
    
    // Atualizar a UI
    if (searchResults) {
      const initials = partnerName ? partnerName.substring(0, 2).toUpperCase() : '??';
      searchResults.innerHTML = `
        <div class="user-result">
          <div class="user-result-info">
            <div class="user-result-avatar">${initials}</div>
            <div>
              <h4>${partnerName || 'Utilizador'}</h4>
              <p style="color: #666; font-size: 14px;">@${partnerUsername}</p>
            </div>
          </div>
          <span style="color: #10b981; font-weight: 600;">✅ Pedido enviado!</span>
        </div>
      `;
    }
    
    alert(`✅ Pedido de conexão enviado para ${partnerName}!\nEle(a) receberá uma notificação.`);
  } catch (error) {
    console.error('Erro ao enviar pedido:', error);
    hideLoading();
    alert('❌ Erro ao enviar pedido. Tenta novamente.');
  }
}

// Função legacy para manter compatibilidade (agora redireciona para sendConnectionRequest)
async function connectWithUser(partnerId, partnerName) {
  await sendConnectionRequest(partnerId, partnerName, '');
}

// Make functions global
window.connectWithUser = connectWithUser;
window.sendConnectionRequest = sendConnectionRequest;

// ========================================
// RESET PACK MODAL
// ========================================

function openResetPackModal(packId, packName) {
  currentResetPackId = packId;
  
  // Atualizar nome do pack no modal
  const packNameDisplay = document.getElementById('resetPackName');
  if (packNameDisplay) {
    packNameDisplay.textContent = packName;
  }
  
  // Mostrar modal
  if (resetPackModal) {
    resetPackModal.classList.add('active');
  }
  
  // Configurar botão de confirmação
  const confirmBtn = document.getElementById('confirmResetBtn');
  if (confirmBtn) {
    confirmBtn.onclick = confirmResetPack;
  }
}

function closeResetPackModal() {
  if (resetPackModal) {
    resetPackModal.classList.remove('active');
  }
  currentResetPackId = null;
}

async function confirmResetPack() {
  if (!currentResetPackId || !auth.currentUser) {
    console.error('❌ Pack ID ou utilizador não definido');
    return;
  }
  
  showLoading();
  
  try {
    const userId = auth.currentUser.uid;
    
    // Remover as respostas do pack do objeto local
    if (userAnswers[currentResetPackId]) {
      delete userAnswers[currentResetPackId];
    }
    
    // Atualizar no Firestore - remover o campo do pack
    await db.collection('users').doc(userId).collection('answers').doc('all').update({
      [currentResetPackId]: firebase.firestore.FieldValue.delete()
    });
      console.log('✅ Pack resetado com sucesso:', currentResetPackId);
    
    // Fechar modal
    closeResetPackModal();
    
    // Atualizar estatísticas e re-renderizar packs
    renderStats();
    renderPacks();
    
    hideLoading();
    
    // Mostrar mensagem de sucesso
    const t = (key, fallback) => {
      if (typeof I18n !== 'undefined' && I18n.t) {
        const result = I18n.t(key);
        return result !== key ? result : fallback;
      }
      return fallback;
    };
    
    alert(t('dashboard.reset.success', '✅ Pack resetado com sucesso! Podes começar de novo.'));
    
  } catch (error) {
    console.error('❌ Erro ao resetar pack:', error);
    hideLoading();
    alert('❌ Erro ao resetar pack. Tenta novamente.');
  }
}

// Make reset functions global
window.openResetPackModal = openResetPackModal;
window.closeResetPackModal = closeResetPackModal;
window.confirmResetPack = confirmResetPack;

// ========================================
// SHARE MODAL
// ========================================
let currentShareConnectionId = null;

function shareWithPartner(connectionId, partnerName) {
  currentShareConnectionId = connectionId;
  
  document.getElementById('sharePartnerName').textContent = partnerName;
  
  // Load packs checklist
  const sharePacksList = document.getElementById('sharePacksList');
  sharePacksList.innerHTML = '';

  packsData.forEach(pack => {
    const packAnswers = userAnswers[pack.id] || {};
    const answeredCount = Object.keys(packAnswers).length;
    const totalQuestions = pack.questions.length;
    
    // Only show packs with answers
    if (answeredCount > 0) {
      const item = document.createElement('div');
      item.className = 'share-pack-item';
      item.innerHTML = `
        <input type="checkbox" id="share_${pack.id}" value="${pack.id}">
        <label for="share_${pack.id}" style="cursor: pointer; flex: 1;">
          <strong>${pack.name}</strong><br>
          <small style="color: #666;">${answeredCount} de ${totalQuestions} respondidas</small>
        </label>
      `;
      sharePacksList.appendChild(item);
    }
  });

  if (sharePacksList.children.length === 0) {
    sharePacksList.innerHTML = '<p style="text-align: center; color: #999;">Responde a alguns questionários primeiro!</p>';
  }

  shareModal.classList.add('active');
}

window.shareWithPartner = shareWithPartner;

// Função para confirmar partilha (chamada pelo event listener)
async function confirmShare() {
  const checkboxes = document.querySelectorAll('#sharePacksList input[type="checkbox"]:checked');
  const selectedPacks = Array.from(checkboxes).map(cb => cb.value);

  if (selectedPacks.length === 0) {
    alert('Seleciona pelo menos um pack!');
    return;
  }

  showLoading();

  try {
    // Update connection with shared packs
    await db.collection('connections').doc(currentShareConnectionId).update({
      [`sharedPacks`]: firebase.firestore.FieldValue.arrayUnion(...selectedPacks)
    });

    // TODO: Generate report if both users shared

    // Reload connections
    userConnections = await loadUserConnections(auth.currentUser.uid);
    renderConnections();

    if (shareModal) shareModal.classList.remove('active');
    hideLoading();
    alert(`✅ Packs partilhados com sucesso!`);
  } catch (error) {
    console.error('Erro ao partilhar:', error);
    hideLoading();
    alert('❌ Erro ao partilhar. Tenta novamente.');
  }
}

// ========================================
// EDIT PROFILE
// ========================================
function openEditProfileModal() {
  console.log('🔍 openEditProfileModal chamada', { userProfile, currentUser: auth.currentUser });
  
  if (!editProfileModal) {
    console.error('❌ Modal editProfileModal não encontrado no DOM');
    alert('❌ Erro: Modal de edição não encontrado');
    return;
  }
  
  if (!userProfile || !auth.currentUser) {
    console.error('❌ Perfil não carregado', { userProfile, currentUser: auth.currentUser });
    alert('❌ Erro ao carregar perfil. Por favor, recarregue a página.');
    return;
  }
  
  // Preencher formulário com dados atuais - com verificação de elementos
  const nameField = document.getElementById('editProfileName');
  const emailField = document.getElementById('editProfileEmail');
  const genderField = document.getElementById('editProfileGender');
  const ageRangeField = document.getElementById('editProfileAgeRange');
  
  console.log('🔍 Elementos do formulário:', { nameField, emailField, genderField, ageRangeField });
  
  if (!nameField || !emailField || !genderField || !ageRangeField) {
    console.error('❌ Campos do formulário não encontrados:', {
      name: !!nameField,
      email: !!emailField,
      gender: !!genderField,
      ageRange: !!ageRangeField
    });
    alert('❌ Erro: Formulário incompleto. Por favor, recarregue a página.');
    return;
  }
  
  nameField.value = userProfile.name || '';
  emailField.value = auth.currentUser.email || '';
  genderField.value = userProfile.gender || '';
  ageRangeField.value = userProfile.ageRange || '';
    // Carregar países no select
  loadCountriesInEditModal();
  
  // Definir país e cidade após carregar países
  setTimeout(() => {
    const countryField = document.getElementById('editProfileCountry');
    const cityField = document.getElementById('editProfileCity');
    
    if (countryField && cityField) {
      countryField.value = userProfile.country || '';
      cityField.value = userProfile.city || '';
      console.log('✅ País e cidade definidos:', { country: userProfile.country, city: userProfile.city });
    } else {
      console.error('❌ Campos país/cidade não encontrados:', { 
        country: !!countryField, 
        city: !!cityField 
      });
    }
  }, 100);
  
  // Mostrar modal
  console.log('✅ Abrindo modal...');
  editProfileModal.classList.add('active');
}

// Função para carregar países no modal de edição
function loadCountriesInEditModal() {
  const COUNTRIES = [
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
  
  const select = document.getElementById('editProfileCountry');
  if (!select) return;
  
  // Limpar opções existentes (exceto a primeira)
  while (select.options.length > 1) {
    select.remove(1);
  }
  
  // Adicionar países
  COUNTRIES.forEach(country => {
    const option = document.createElement('option');
    option.value = country.code;
    option.textContent = country.name;
    select.appendChild(option);
  });
}

function closeEditProfileModal() {
  if (editProfileModal) {
    editProfileModal.classList.remove('active');
  }
}

async function saveProfileChanges(event) {
  event.preventDefault();
  
  const newName = document.getElementById('editProfileName').value.trim();
  const newGender = document.getElementById('editProfileGender').value;
  const newAgeRange = document.getElementById('editProfileAgeRange').value;
  const countrySelect = document.getElementById('editProfileCountry');
  const newCountry = countrySelect.value;
  const newCountryName = countrySelect.options[countrySelect.selectedIndex]?.text || '';
  const newCity = document.getElementById('editProfileCity').value.trim();
  
  if (!newName) {
    alert('❌ O nome não pode estar vazio!');
    return;
  }
  
  if (!newGender || !newAgeRange || !newCountry || !newCity) {
    alert('❌ Por favor, preenche todos os campos obrigatórios!');
    return;
  }
  
  try {
    showLoading();
    
    // Atualizar no Firestore
    await db.collection('users').doc(auth.currentUser.uid).update({
      displayName: newName,
      name: newName,
      gender: newGender,
      ageRange: newAgeRange,
      country: newCountry,
      countryName: newCountryName,
      city: newCity,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Atualizar display name no Firebase Auth
    await auth.currentUser.updateProfile({
      displayName: newName
    });
    
    // Atualizar variável local
    userProfile.name = newName;
    userProfile.displayName = newName;
    userProfile.gender = newGender;
    userProfile.ageRange = newAgeRange;
    userProfile.country = newCountry;
    userProfile.countryName = newCountryName;
    userProfile.city = newCity;
    
    // Atualizar UI
    userName.textContent = newName;
    userDisplayName.textContent = newName;
    
    hideLoading();
    closeEditProfileModal();
    
    alert('✅ Perfil atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    hideLoading();
    alert('❌ Erro ao atualizar perfil. Tente novamente.');
  }
}

// Make edit profile functions global
window.openEditProfileModal = openEditProfileModal;
window.closeEditProfileModal = closeEditProfileModal;
window.saveProfileChanges = saveProfileChanges;

// ========================================
// UI HELPERS
// ========================================
function showLoading() {
  if (loadingOverlay) {
    loadingOverlay.classList.add('active');
  }
}

function hideLoading() {
  if (loadingOverlay) {
    loadingOverlay.classList.remove('active');
  }
}

// ========================================
// CONNECTION REQUESTS (Pedidos de Conexão)
// ========================================

// Carregar e renderizar pedidos de conexão pendentes
async function loadAndRenderConnectionRequests(userId) {
  try {
    console.log('🔍 Buscando pedidos de conexão para:', userId);
    
    // Buscar pedidos recebidos (onde sou o destinatário)
    // Nota: removido orderBy para evitar problemas com índices
    const receivedSnapshot = await db.collection('connection_requests')
      .where('toUserId', '==', userId)
      .where('status', '==', 'pending')
      .get();
    
    const pendingRequests = [];
    receivedSnapshot.forEach(doc => {
      pendingRequests.push({ id: doc.id, ...doc.data() });
    });
    
    // Ordenar manualmente por data (mais recentes primeiro)
    pendingRequests.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
    
    console.log(`📬 ${pendingRequests.length} pedidos de conexão pendentes`);
    
    // Renderizar pedidos se houver
    renderConnectionRequests(pendingRequests);
    
    // Atualizar badge de notificação
    updateConnectionRequestsBadge(pendingRequests.length);
    
    return pendingRequests;
  } catch (error) {
    console.error('❌ Erro ao carregar pedidos de conexão:', error);
    console.error('Código do erro:', error.code);
    console.error('Mensagem:', error.message);
    return [];
  }
}

// Renderizar pedidos de conexão
function renderConnectionRequests(requests) {
  // Criar ou obter container para pedidos
  let requestsContainer = document.getElementById('connectionRequestsContainer');
  
  if (!requestsContainer) {
    // Criar container se não existir (inserir antes da lista de conexões)
    const connectionsSection = document.querySelector('.connections-section');
    if (connectionsSection) {
      requestsContainer = document.createElement('div');
      requestsContainer.id = 'connectionRequestsContainer';
      requestsContainer.className = 'connection-requests-section';
      connectionsSection.insertBefore(requestsContainer, connectionsSection.firstChild);
    }
  }
  
  if (!requestsContainer) return;
  
  if (requests.length === 0) {
    requestsContainer.innerHTML = '';
    requestsContainer.style.display = 'none';
    return;
  }
  
  requestsContainer.style.display = 'block';
  
  let html = `
    <div class="requests-header" style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
      <span style="font-size: 1.5em;">📬</span>
      <h3 style="margin: 0; color: #667eea;">Pedidos de Conexão</h3>
      <span class="badge" style="background: #667eea; color: white; padding: 4px 10px; border-radius: 12px; font-size: 0.85em;">${requests.length}</span>
    </div>
    <div class="requests-list">
  `;
  
  requests.forEach(request => {
    const initials = request.fromUserName ? request.fromUserName.substring(0, 2).toUpperCase() : '??';
    const timeAgo = request.createdAt ? getTimeAgo(request.createdAt.toDate()) : 'agora';
    
    html += `
      <div class="request-card" style="background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%); border: 2px solid #e0e7ff; border-radius: 12px; padding: 15px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1.1em;">${initials}</div>
          <div>
            <h4 style="margin: 0 0 4px 0; color: #333;">${request.fromUserName || 'Utilizador'}</h4>
            <p style="margin: 0; color: #666; font-size: 0.9em;">Quer conectar contigo • ${timeAgo}</p>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="acceptConnectionRequest('${request.id}', '${request.fromUserId}', '${(request.fromUserName || 'Utilizador').replace(/'/g, "\\'")}')" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;">
            ✅ Aceitar
          </button>
          <button onclick="rejectConnectionRequest('${request.id}', '${(request.fromUserName || 'Utilizador').replace(/'/g, "\\'")}')" style="padding: 10px 20px; background: white; color: #ef4444; border: 2px solid #ef4444; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s;">
            ❌ Recusar
          </button>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  requestsContainer.innerHTML = html;
}

// Aceitar pedido de conexão
async function acceptConnectionRequest(requestId, fromUserId, fromUserName) {
  showLoading();
  
  try {
    // Atualizar status do pedido
    await db.collection('connection_requests').doc(requestId).update({
      status: 'accepted',
      acceptedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Criar conexão com ID previsível (IDs ordenados unidos por underscore)
    // Isto permite verificar nas regras do Firestore se existe conexão
    const currentUserId = auth.currentUser.uid;
    const connectionId = [currentUserId, fromUserId].sort().join('_');
    
    await db.collection('connections').doc(connectionId).set({
      users: [currentUserId, fromUserId],
      sharedPacks: [],
      report: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Recarregar conexões e pedidos
    userConnections = await loadUserConnections(auth.currentUser.uid);
    await loadAndRenderConnectionRequests(auth.currentUser.uid);
    renderConnections();
    renderStats();
    
    hideLoading();
    alert(`✅ Conectado com ${fromUserName}!`);
  } catch (error) {
    console.error('Erro ao aceitar pedido:', error);
    hideLoading();
    alert('❌ Erro ao aceitar pedido. Tenta novamente.');
  }
}

// Recusar pedido de conexão
async function rejectConnectionRequest(requestId, fromUserName) {
  if (!confirm(`Tens a certeza que queres recusar o pedido de ${fromUserName}?`)) {
    return;
  }
  
  showLoading();
  
  try {
    // Atualizar status do pedido
    await db.collection('connection_requests').doc(requestId).update({
      status: 'rejected',
      rejectedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Recarregar pedidos
    await loadAndRenderConnectionRequests(auth.currentUser.uid);
    
    hideLoading();
    alert('Pedido recusado.');
  } catch (error) {
    console.error('Erro ao recusar pedido:', error);
    hideLoading();
    alert('❌ Erro ao recusar pedido. Tenta novamente.');
  }
}

// Atualizar badge de notificação para pedidos
function updateConnectionRequestsBadge(count) {
  // Atualizar badge no botão de adicionar conexão
  const addBtn = document.getElementById('addConnectionBtn');
  if (!addBtn) return;
  
  // Remover badge existente
  const existingBadge = addBtn.querySelector('.request-badge');
  if (existingBadge) existingBadge.remove();
  
  if (count > 0) {
    const badge = document.createElement('span');
    badge.className = 'request-badge';
    badge.textContent = count > 9 ? '9+' : count;
    badge.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      min-width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75em;
      font-weight: 700;
      padding: 2px;
    `;
    addBtn.style.position = 'relative';
    addBtn.appendChild(badge);
  }
}

// Helper: tempo relativo
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'agora';
  if (minutes < 60) return `há ${minutes}m`;
  if (hours < 24) return `há ${hours}h`;
  if (days < 7) return `há ${days}d`;
  return date.toLocaleDateString('pt-PT');
}

// ========================================
// ELIMINAR CONEXÃO COM PARCEIRO
// ========================================
async function deleteConnection(connectionId, partnerName) {
  // Primeiro aviso
  if (!confirm(`Tens a certeza que queres remover a conexão com ${partnerName}?`)) {
    return;
  }
  
  // Segundo aviso (dupla confirmação)
  if (!confirm(`⚠️ ATENÇÃO: Ao remover a conexão:\n\n• Vocês deixam de poder ver as respostas um do outro\n• Para se reconectarem, terão de enviar novo pedido\n\nTens a certeza ABSOLUTA que queres remover ${partnerName}?`)) {
    return;
  }
  
  showLoading();
  
  try {
    // Apagar o documento de conexão
    await db.collection('connections').doc(connectionId).delete();
    
    console.log(`✅ Conexão ${connectionId} eliminada com sucesso`);
    
    // Recarregar conexões
    userConnections = await loadUserConnections(auth.currentUser.uid);
    renderConnections();
    renderStats();
    
    hideLoading();
    alert(`✅ Conexão com ${partnerName} removida.`);
    
  } catch (error) {
    console.error('Erro ao eliminar conexão:', error);
    hideLoading();
    alert('❌ Erro ao remover conexão. Tenta novamente.');
  }
}

// Tornar funções globais
window.acceptConnectionRequest = acceptConnectionRequest;
window.rejectConnectionRequest = rejectConnectionRequest;
window.loadAndRenderConnectionRequests = loadAndRenderConnectionRequests;
window.deleteConnection = deleteConnection;
