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
let auth = null;
let db = null;

// ========================================
// DOM ELEMENTS (serão inicializados depois do DOM estar pronto)
// ========================================
let userName, userDisplayName, logoutBtn, packsGrid, connectionsList, loadingOverlay;

// Modals
let addConnectionModal, shareModal, addConnectionBtn, closeModalBtn, closeShareModalBtn, searchUserForm, searchResults;

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
  
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase não carregado');
    alert('Erro ao carregar Firebase. Recarregue a página.');
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    return;
  }

  // Inicializar Firebase
  auth = firebase.auth();
  db = firebase.firestore();
  
  console.log('✅ Firebase Auth e Firestore inicializados');
  
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
    
    // Render everything
    console.log('🎨 Renderizando interface...');
    renderStats();
    renderPacks();
    renderConnections();
    
    // Update username display in modal (if it exists)
    updateMyUsernameDisplay();

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
    const response = await fetch('data/packs_data_clean.json?v=' + Date.now());
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
  packsGrid.innerHTML = '';

  if (packsData.length === 0) {
    packsGrid.innerHTML = '<p>Nenhum pack disponível</p>';
    return;
  }

  packsData.forEach(pack => {
    const packAnswers = userAnswers[pack.id] || {};
    const answeredCount = Object.keys(packAnswers).length;
    const totalQuestions = pack.questions.length;
    const progress = Math.round((answeredCount / totalQuestions) * 100);

    const card = document.createElement('div');
    card.className = 'pack-card';
    card.innerHTML = `
      <div class="pack-header" style="background: ${pack.color || '#667eea'}">
        <div class="pack-icon">${pack.icon || '📝'}</div>
        <div class="pack-name">${pack.name}</div>
        <div class="pack-description">${pack.description || ''}</div>
      </div>
      <div class="pack-body">
        <div class="pack-progress">
          <div class="pack-progress-text">
            <span>${answeredCount} de ${totalQuestions}</span>
            <span>${progress}%</span>
          </div>
          <div class="pack-progress-bar-container">
            <div class="pack-progress-bar" style="width: ${progress}%"></div>
          </div>
        </div>
        <div class="pack-actions">
          <button class="btn-pack btn-answer" onclick="goToQuiz('${pack.id}')">
            ${answeredCount === 0 ? 'Começar' : 'Continuar'}
          </button>
          ${answeredCount > 0 ? '<button class="btn-pack btn-view" onclick="viewAnswers(\'' + pack.id + '\')">Ver Respostas</button>' : ''}
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
  if (userConnections.length === 0) {
    connectionsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💑</div>
        <h3>Nenhuma conexão ainda</h3>
        <p>Adiciona o teu parceiro para partilharem respostas e gerarem relatórios juntos!</p>
      </div>
    `;
    return;
  }

  connectionsList.innerHTML = '';

  userConnections.forEach(connection => {
    const partner = connection.partnerProfile;
    const initials = partner.name ? partner.name.substring(0, 2).toUpperCase() : '??';

    const card = document.createElement('div');
    card.className = 'connection-card';
    card.innerHTML = `
      <div class="connection-info">
        <div class="connection-avatar">${initials}</div>
        <div class="connection-details">
          <h3>${partner.name || 'Utilizador'}</h3>
          <p>@${partner.username}</p>
        </div>
      </div>
      <div class="connection-actions">
        <button class="btn-secondary" onclick="shareWithPartner('${connection.id}', '${partner.name}')">
          Partilhar
        </button>
        ${connection.report ? '<button class="btn-secondary" onclick="viewReport(\'' + connection.id + '\')">Ver Relatório</button>' : ''}
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
        }
      } else if (alreadyConnected) {
        if (searchResults) {
          searchResults.innerHTML = '<p style="text-align: center; color: #999;">Já estás conectado com este utilizador ✅</p>';
        }
      } else {
        const initials = userData.name ? userData.name.substring(0, 2).toUpperCase() : '??';
        
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
              <button class="btn-connect" onclick="connectWithUser('${userId}', '${userData.name}')">
                Conectar
              </button>
            </div>
          `;
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

async function connectWithUser(partnerId, partnerName) {
  showLoading();

  try {
    // Create connection
    await db.collection('connections').add({
      users: [auth.currentUser.uid, partnerId],
      sharedPacks: [],
      report: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Reload connections
    userConnections = await loadUserConnections(auth.currentUser.uid);
    renderConnections();
    renderStats();

    // Close modal
    addConnectionModal.classList.remove('active');

    hideLoading();
    alert(`✅ Conectado com ${partnerName}!`);
  } catch (error) {
    console.error('Erro ao criar conexão:', error);
    hideLoading();
    alert('❌ Erro ao conectar. Tenta novamente.');
  }
}

// Make function global
window.connectWithUser = connectWithUser;

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
  editProfileModal.classList.remove('active');
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
