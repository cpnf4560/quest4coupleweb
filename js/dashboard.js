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

// ========================================
// DOM ELEMENTS
// ========================================
const userName = document.getElementById('userName');
const userDisplayName = document.getElementById('userDisplayName');
const logoutBtn = document.getElementById('logoutBtn');
const packsGrid = document.getElementById('packsGrid');
const connectionsList = document.getElementById('connectionsList');
const loadingOverlay = document.getElementById('loadingOverlay');

// Modals
const addConnectionModal = document.getElementById('addConnectionModal');
const shareModal = document.getElementById('shareModal');
const addConnectionBtn = document.getElementById('addConnectionBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const closeShareModalBtn = document.getElementById('closeShareModalBtn');
const searchUserForm = document.getElementById('searchUserForm');
const searchResults = document.getElementById('searchResults');

// Stats
const totalAnswersEl = document.getElementById('totalAnswers');
const completedPacksEl = document.getElementById('completedPacks');
const totalConnectionsEl = document.getElementById('totalConnections');
const sharedReportsEl = document.getElementById('sharedReports');

// ========================================
// INIT
// ========================================
auth.onAuthStateChanged(async (user) => {
  if (user) {
    await initDashboard(user);
  } else {
    window.location.href = 'auth.html';
  }
});

async function initDashboard(user) {
  try {
    showLoading();    // Load user profile
    userProfile = await loadUserProfile(user.uid);
    
    // Update UI with proper name fallback
    const displayName = userProfile?.name || user.displayName || user.email?.split('@')[0] || 'Utilizador';
    userName.textContent = displayName;
    userDisplayName.textContent = displayName;

    // Load packs data
    await loadPacksData();

    // Load user answers
    userAnswers = await loadUserAnswers(user.uid);

    // Load connections
    userConnections = await loadUserConnections(user.uid);

    // Render everything
    renderStats();
    renderPacks();
    renderConnections();

    hideLoading();
  } catch (error) {
    console.error('Erro ao inicializar dashboard:', error);
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
    const response = await fetch('data/packs_data_clean.json');
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
addConnectionBtn.addEventListener('click', () => {
  addConnectionModal.classList.add('active');
  searchResults.innerHTML = '';
  document.getElementById('searchUsername').value = '';
});

closeModalBtn.addEventListener('click', () => {
  addConnectionModal.classList.remove('active');
});

searchUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('searchUsername').value.trim().replace('@', '');
  
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

    searchResults.innerHTML = '';

    if (snapshot.empty) {
      searchResults.innerHTML = '<p style="text-align: center; color: #999;">Utilizador não encontrado 😕</p>';
    } else {
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      const userId = userDoc.id;

      // Check if already connected
      const alreadyConnected = userConnections.some(conn => conn.partnerId === userId);

      // Check if it's the current user
      if (userId === auth.currentUser.uid) {
        searchResults.innerHTML = '<p style="text-align: center; color: #999;">Não podes conectar contigo próprio 😅</p>';
      } else if (alreadyConnected) {
        searchResults.innerHTML = '<p style="text-align: center; color: #999;">Já estás conectado com este utilizador ✅</p>';
      } else {
        const initials = userData.name ? userData.name.substring(0, 2).toUpperCase() : '??';
        
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

    hideLoading();
  } catch (error) {
    console.error('Erro ao procurar utilizador:', error);
    searchResults.innerHTML = '<p style="text-align: center; color: #c33;">Erro ao procurar. Tenta novamente.</p>';
    hideLoading();
  }
});

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

closeShareModalBtn.addEventListener('click', () => {
  shareModal.classList.remove('active');
  currentShareConnectionId = null;
});

document.getElementById('confirmShareBtn').addEventListener('click', async () => {
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

    shareModal.classList.remove('active');
    hideLoading();
    alert(`✅ Packs partilhados com sucesso!`);
  } catch (error) {
    console.error('Erro ao partilhar:', error);
    hideLoading();
    alert('❌ Erro ao partilhar. Tenta novamente.');
  }
});

// ========================================
// EDIT PROFILE
// ========================================
const editProfileBtn = document.getElementById('editProfileBtn');
const editProfileModal = document.getElementById('editProfileModal');

if (editProfileBtn) {
  editProfileBtn.addEventListener('click', openEditProfileModal);
}

function openEditProfileModal() {
  if (!userProfile || !auth.currentUser) {
    alert('❌ Erro ao carregar perfil');
    return;
  }
  
  // Preencher formulário com dados atuais
  document.getElementById('editProfileName').value = userProfile.name || '';
  document.getElementById('editProfileEmail').value = auth.currentUser.email || '';
  document.getElementById('editProfileUserId').value = auth.currentUser.uid || '';
  document.getElementById('editProfileCountry').value = userProfile.country || '';
  document.getElementById('editProfileCity').value = userProfile.city || '';
  
  // Mostrar modal
  editProfileModal.classList.add('active');
}

function closeEditProfileModal() {
  editProfileModal.classList.remove('active');
}

async function saveProfileChanges(event) {
  event.preventDefault();
  
  const newName = document.getElementById('editProfileName').value.trim();
  const newCountry = document.getElementById('editProfileCountry').value.trim();
  const newCity = document.getElementById('editProfileCity').value.trim();
  
  if (!newName) {
    alert('❌ O nome não pode estar vazio!');
    return;
  }
  
  try {
    showLoading();
    
    // Atualizar no Firestore
    await db.collection('users').doc(auth.currentUser.uid).update({
      name: newName,
      country: newCountry || 'Não especificado',
      city: newCity || 'Não especificado',
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    // Atualizar display name no Firebase Auth
    await auth.currentUser.updateProfile({
      displayName: newName
    });
    
    // Atualizar variável local
    userProfile.name = newName;
    userProfile.country = newCountry || 'Não especificado';
    userProfile.city = newCity || 'Não especificado';
    
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
// LOGOUT
// ========================================
logoutBtn.addEventListener('click', async () => {
  showLoading();
  try {
    await signOut();
    window.location.href = 'auth.html';
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    hideLoading();
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

// Close modals on outside click
addConnectionModal.addEventListener('click', (e) => {
  if (e.target === addConnectionModal) {
    addConnectionModal.classList.remove('active');
  }
});

shareModal.addEventListener('click', (e) => {
  if (e.target === shareModal) {
    shareModal.classList.remove('active');
  }
});

console.log('✅ Dashboard inicializado');
