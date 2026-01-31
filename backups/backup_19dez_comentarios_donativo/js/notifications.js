/* ============================================
   QUEST4COUPLE - NOTIFICATION SYSTEM
   Sistema de notificações para novos relatórios do parceiro
   ============================================ */

// ========================================
// VERIFICAR NOVAS RESPOSTAS DO PARCEIRO
// ========================================

async function checkPartnerSubmissions() {
  if (!auth || !db) {
    console.log('⚠️ Firebase não inicializado ainda');
    return { hasNewReports: false, count: 0 };
  }

  const user = auth.currentUser;
  if (!user) {
    console.log('⚠️ Nenhum utilizador autenticado');
    return { hasNewReports: false, count: 0 };
  }

  try {
    // Buscar conexões do utilizador
    const connectionsSnapshot = await db.collection('connections')
      .where('users', 'array-contains', user.uid)
      .get();

    if (connectionsSnapshot.empty) {
      console.log('ℹ️ Nenhuma conexão encontrada');
      return { hasNewReports: false, count: 0 };
    }

    let newUpdatesCount = 0;
    const newUpdates = [];

    // Para cada conexão, verificar se há novas atualizações do parceiro
    for (const doc of connectionsSnapshot.docs) {
      const connectionData = doc.data();
      const partnerId = connectionData.users.find(id => id !== user.uid);
      
      if (!partnerId) continue;
      
      // Verificar lastAnswerUpdate do parceiro
      const partnerUpdateField = `lastAnswerUpdate_${partnerId}`;
      const lastUpdate = connectionData[partnerUpdateField];
      
      if (lastUpdate) {
        // Verificar se já vimos esta atualização
        const viewedKey = `partner_update_${doc.id}_${partnerId}`;
        const lastViewed = localStorage.getItem(viewedKey);
        
        const updateTime = lastUpdate.toDate ? lastUpdate.toDate().getTime() : lastUpdate;
        
        if (!lastViewed || parseInt(lastViewed) < updateTime) {
          newUpdatesCount++;
          
          // Buscar nome do parceiro
          let partnerName = 'Parceiro';
          try {
            const partnerDoc = await db.collection('users').doc(partnerId).get();
            if (partnerDoc.exists) {
              partnerName = partnerDoc.data().name || 'Parceiro';
            }
          } catch (e) {}
          
          newUpdates.push({
            connectionId: doc.id,
            partnerId,
            partnerName,
            updateTime
          });
        }
      }
    }

    console.log(`✅ Encontradas ${newUpdatesCount} novas atualizações de parceiros`);
    return {
      hasNewReports: newUpdatesCount > 0,
      count: newUpdatesCount,
      reports: newUpdates
    };
  } catch (error) {
    console.error('❌ Erro ao verificar atualizações do parceiro:', error);
    return { hasNewReports: false, count: 0 };
  }
}

// ========================================
// ATUALIZAR BADGE DE NOTIFICAÇÃO
// ========================================

function updateNotificationBadge(count) {
  // Adicionar animação se não existir
  if (!document.getElementById('badge-animation')) {
    const style = document.createElement('style');
    style.id = 'badge-animation';
    style.textContent = `
      @keyframes pulse-badge {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `;
    document.head.appendChild(style);
  }

  // Atualizar badge no botão de relatório do header
  updateButtonBadge('[href="relatorio.html"]', count, '#dc3545');
  
  // Atualizar badge no botão de questionário (indicar que há algo novo)
  updateButtonBadge('[href="app.html"]', count, '#28a745');
  
  // Também buscar por onclick com esses destinos
  updateButtonBadge('[onclick*="relatorio.html"]', count, '#dc3545');
  updateButtonBadge('[onclick*="app.html"]', count, '#28a745');
}

function updateButtonBadge(selector, count, color) {
  const btn = document.querySelector(selector);
  if (!btn) return;

  // Remover badge existente
  const existingBadge = btn.querySelector('.notification-badge');
  if (existingBadge) {
    existingBadge.remove();
  }

  // Adicionar novo badge se houver notificações
  if (count > 0) {
    const badge = document.createElement('span');
    badge.className = 'notification-badge';
    badge.textContent = count > 9 ? '9+' : count;
    badge.style.cssText = `
      position: absolute;
      top: -5px;
      right: -5px;
      background: ${color};
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 11px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      animation: pulse-badge 2s infinite;
    `;
    
    // Fazer o botão position relative
    btn.style.position = 'relative';
    btn.appendChild(badge);
      console.log(`✅ Badge atualizado em ${selector}: ${count}`);
  }
}

// ========================================
// MOSTRAR NOTIFICAÇÕES NA PÁGINA DO RELATÓRIO
// ========================================

async function showReportNotifications() {
  const notificationResult = await checkPartnerSubmissions();
  
  if (!notificationResult.hasNewReports) {
    console.log('ℹ️ Sem notificações para mostrar');
    return;
  }

  // Criar container de notificações
  const notificationContainer = document.createElement('div');
  notificationContainer.className = 'report-notifications';
  notificationContainer.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    margin: 20px 0;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    animation: slideDown 0.5s ease-out;
  `;

  const notificationHTML = `
    <div style="display: flex; align-items: center; gap: 15px;">
      <div style="font-size: 2.5em;">🎉</div>
      <div style="flex: 1;">
        <h3 style="margin: 0 0 8px 0; font-size: 1.3em;">
          Novas Respostas do Parceiro!
        </h3>
        <p style="margin: 0; opacity: 0.95; font-size: 0.95em;">
          ${notificationResult.count} parceiro${notificationResult.count > 1 ? 's' : ''} 
          respondeu a novos questionários. Podes gerar um relatório atualizado!
        </p>
        <div style="margin-top: 15px;">
          ${notificationResult.reports.map(update => `
            <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px; margin-top: 8px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <span><strong>${update.partnerName}</strong> tem novas respostas!</span>
              <button onclick="markAsViewed('${update.connectionId}', '${update.partnerId}', ${update.updateTime})" style="
                background: white;
                color: #667eea;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.9em;
              ">
                ✓ Marcar como visto
              </button>
            </div>
          `).join('')}
        </div>
      </div>
      <button onclick="dismissNotifications()" style="
        background: rgba(255,255,255,0.3);
        border: none;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2em;
        display: flex;
        align-items: center;
        justify-content: center;
      ">✕</button>
    </div>
  `;

  notificationContainer.innerHTML = notificationHTML;

  // Inserir no início da página de relatório
  const reportContainer = document.querySelector('.report-container') || document.querySelector('.container') || document.body;
  if (reportContainer) {
    reportContainer.insertBefore(notificationContainer, reportContainer.firstChild);
  }
}

// ========================================
// MARCAR ATUALIZAÇÃO COMO VISUALIZADA
// ========================================

function markAsViewed(connectionId, partnerId, updateTime) {
  const viewedKey = `partner_update_${connectionId}_${partnerId}`;
  localStorage.setItem(viewedKey, updateTime.toString());
  console.log(`✅ Atualização de ${partnerId} marcada como vista`);
  
  // Atualizar badge
  checkPartnerSubmissions().then(result => {
    updateNotificationBadge(result.count);
  });
  
  // Remover notificação da página
  const notifications = document.querySelector('.report-notifications');
  if (notifications) {
    // Remover apenas o item específico ou todo o container
    const items = notifications.querySelectorAll('[style*="rgba(255,255,255,0.2)"]');
    if (items.length <= 1) {
      dismissNotifications();
    } else {
      // Recarregar notificações
      dismissNotifications();
      setTimeout(showReportNotifications, 300);
    }
  }
}

// ========================================
// DISPENSAR NOTIFICAÇÕES
// ========================================

function dismissNotifications() {
  const notificationContainer = document.querySelector('.report-notifications');
  if (notificationContainer) {
    notificationContainer.style.animation = 'slideUp 0.3s ease-out';
    setTimeout(() => {
      notificationContainer.remove();
    }, 300);
  }
}

// ========================================
// INICIALIZAR SISTEMA DE NOTIFICAÇÕES
// ========================================

function initNotificationSystem() {
  // Verificar se estamos numa página que precisa de notificações
  if (typeof auth === 'undefined' || typeof db === 'undefined') {
    console.log('⚠️ Firebase não está disponível, aguardando...');
    setTimeout(initNotificationSystem, 500);
    return;
  }

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      console.log('✅ Inicializando sistema de notificações para:', user.email);
      
      // Verificar notificações de respostas
      const partnerResult = await checkPartnerSubmissions();
      
      // Verificar pedidos de conexão pendentes
      const connectionResult = await checkConnectionRequests();
      
      // Atualizar badge no header para respostas
      updateNotificationBadge(partnerResult.count);
      
      // Atualizar badge para pedidos de conexão
      updateConnectionRequestBadge(connectionResult.count);
      
      // Mostrar notificações na página apropriada
      if (window.location.pathname.includes('relatorio.html')) {
        await showReportNotifications();
      } else if (window.location.pathname.includes('dashboard.html')) {
        await showDashboardNotifications();
      }
    }
  });
}

// ========================================
// MOSTRAR NOTIFICAÇÕES NO DASHBOARD
// ========================================

async function showDashboardNotifications() {
  const notificationResult = await checkPartnerSubmissions();
  const container = document.getElementById('partnerNotifications');
  
  if (!container) return;
  
  if (!notificationResult.hasNewReports) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  container.innerHTML = `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
      <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
        <div style="font-size: 2.5em;">🎉</div>
        <div style="flex: 1; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 1.3em;">
            Novas Respostas!
          </h3>
          <p style="margin: 0; opacity: 0.95; font-size: 0.95em;">
            ${notificationResult.count} parceiro${notificationResult.count > 1 ? 's' : ''} 
            respondeu a novos questionários.
          </p>
        </div>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button onclick="window.location.href='relatorio.html'" style="
            background: white;
            color: #667eea;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 0.95em;
            display: flex;
            align-items: center;
            gap: 6px;
          ">
            📊 Ver Relatório
          </button>
          <button onclick="dismissDashboardNotifications()" style="
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9em;
          ">
            ✕ Dispensar
          </button>
        </div>
      </div>
    </div>
  `;
}

function dismissDashboardNotifications() {
  const container = document.getElementById('partnerNotifications');
  if (container) {
    container.style.display = 'none';
  }
}

// Auto-inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNotificationSystem);
} else {
  initNotificationSystem();
}

// ========================================
// VERIFICAR PEDIDOS DE CONEXÃO PENDENTES
// ========================================

async function checkConnectionRequests() {
  if (!auth || !db) {
    console.log('⚠️ Firebase não inicializado ainda');
    return { hasPendingRequests: false, count: 0 };
  }

  const user = auth.currentUser;
  if (!user) {
    console.log('⚠️ Nenhum utilizador autenticado');
    return { hasPendingRequests: false, count: 0 };
  }

  try {
    console.log('🔍 Verificando pedidos de conexão para:', user.uid);
    
    // Buscar pedidos pendentes onde sou o destinatário
    const snapshot = await db.collection('connection_requests')
      .where('toUserId', '==', user.uid)
      .where('status', '==', 'pending')
      .get();

    const requests = [];
    snapshot.forEach(doc => {
      requests.push({ id: doc.id, ...doc.data() });
    });

    console.log(`📬 ${requests.length} pedidos de conexão pendentes encontrados`);
    
    return {
      hasPendingRequests: requests.length > 0,
      count: requests.length,
      requests: requests
    };
  } catch (error) {
    console.error('❌ Erro ao verificar pedidos de conexão:', error);
    return { hasPendingRequests: false, count: 0 };
  }
}

// ========================================
// ATUALIZAR BADGE DE PEDIDOS DE CONEXÃO
// ========================================

function updateConnectionRequestBadge(count) {
  // Adicionar animação se não existir
  if (!document.getElementById('connection-badge-animation')) {
    const style = document.createElement('style');
    style.id = 'connection-badge-animation';
    style.textContent = `
      @keyframes pulse-connection {
        0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
        50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
      }
    `;
    document.head.appendChild(style);
  }

  // Atualizar badge no botão Dashboard
  updateButtonBadge('[href="dashboard.html"]', count, '#667eea');
  updateButtonBadge('[onclick*="dashboard.html"]', count, '#667eea');
  
  // Atualizar badge no botão de adicionar conexão (se existir)
  const addBtn = document.getElementById('addConnectionBtn');
  if (addBtn && count > 0) {
    addBtn.style.position = 'relative';
    
    // Remover badge existente
    const existingBadge = addBtn.querySelector('.connection-request-badge');
    if (existingBadge) existingBadge.remove();
    
    const badge = document.createElement('span');
    badge.className = 'connection-request-badge';
    badge.textContent = count > 9 ? '9+' : count;
    badge.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(102, 126, 234, 0.5);
      animation: pulse-connection 2s infinite;
    `;
    addBtn.appendChild(badge);
  }
  
  console.log(`✅ Badge de pedidos de conexão atualizado: ${count}`);
}

// Exportar funções globalmente
window.checkPartnerSubmissions = checkPartnerSubmissions;
window.updateNotificationBadge = updateNotificationBadge;
window.showReportNotifications = showReportNotifications;
window.showDashboardNotifications = showDashboardNotifications;
window.dismissDashboardNotifications = dismissDashboardNotifications;
window.markAsViewed = markAsViewed;
window.dismissNotifications = dismissNotifications;
window.checkConnectionRequests = checkConnectionRequests;
window.updateConnectionRequestBadge = updateConnectionRequestBadge;
