/* ============================================
   QUEST4COUPLE - NOTIFICATION SYSTEM
   Sistema de notificações para novos relatórios do parceiro
   ============================================ */

// ========================================
// VERIFICAR NOVOS RELATÓRIOS DO PARCEIRO
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

    let newReportsCount = 0;
    const newReports = [];

    // Para cada conexão, verificar se há novos relatórios
    for (const doc of connectionsSnapshot.docs) {
      const connectionData = doc.data();
      const partnerId = connectionData.users.find(id => id !== user.uid);
      
      // Buscar relatórios partilhados
      if (connectionData.sharedReports && Array.isArray(connectionData.sharedReports)) {
        for (const reportId of connectionData.sharedReports) {
          // Verificar se já foi visualizado
          const viewedKey = `report_viewed_${reportId}`;
          const hasViewed = localStorage.getItem(viewedKey);
          
          if (!hasViewed) {
            newReportsCount++;
            newReports.push({
              reportId,
              partnerId,
              partnerName: connectionData.partnerProfile?.name || 'Parceiro',
              connectionId: doc.id
            });
          }
        }
      }
    }

    console.log(`✅ Encontrados ${newReportsCount} novos relatórios`);
    return {
      hasNewReports: newReportsCount > 0,
      count: newReportsCount,
      reports: newReports
    };
  } catch (error) {
    console.error('❌ Erro ao verificar relatórios do parceiro:', error);
    return { hasNewReports: false, count: 0 };
  }
}

// ========================================
// ATUALIZAR BADGE DE NOTIFICAÇÃO
// ========================================

function updateNotificationBadge(count) {
  // Atualizar badge no botão de relatório do header
  const reportBtn = document.querySelector('[href="relatorio.html"]');
  if (!reportBtn) return;

  // Remover badge existente
  const existingBadge = reportBtn.querySelector('.notification-badge');
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
      background: #dc3545;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 11px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 4px rgba(220, 53, 69, 0.3);
      animation: pulse-badge 2s infinite;
    `;
    
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
    
    // Fazer o botão position relative
    reportBtn.style.position = 'relative';
    reportBtn.appendChild(badge);
    
    console.log(`✅ Badge atualizado: ${count} notificações`);
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
          Novos Relatórios Disponíveis!
        </h3>
        <p style="margin: 0; opacity: 0.95; font-size: 0.95em;">
          ${notificationResult.count} novo${notificationResult.count > 1 ? 's' : ''} relatório${notificationResult.count > 1 ? 's' : ''} 
          do teu parceiro ${notificationResult.count > 1 ? 'estão' : 'está'} disponível${notificationResult.count > 1 ? 'es' : ''} para visualizar!
        </p>
        <div style="margin-top: 15px;">
          ${notificationResult.reports.map(report => `
            <div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 8px; margin-top: 8px;">
              <strong>${report.partnerName}</strong> partilhou um relatório
              <button onclick="markAsViewed('${report.reportId}')" style="
                background: white;
                color: #667eea;
                border: none;
                padding: 6px 12px;
                border-radius: 6px;
                margin-left: 10px;
                cursor: pointer;
                font-weight: 600;
                font-size: 0.9em;
              ">
                Ver Agora
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
  const reportContainer = document.querySelector('.report-container');
  if (reportContainer) {
    reportContainer.insertBefore(notificationContainer, reportContainer.firstChild);
  }
}

// ========================================
// MARCAR RELATÓRIO COMO VISUALIZADO
// ========================================

function markAsViewed(reportId) {
  localStorage.setItem(`report_viewed_${reportId}`, 'true');
  console.log(`✅ Relatório ${reportId} marcado como visualizado`);
  
  // Atualizar badge
  checkPartnerSubmissions().then(result => {
    updateNotificationBadge(result.count);
  });
  
  // Remover notificação da página
  dismissNotifications();
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
      
      // Verificar notificações
      const result = await checkPartnerSubmissions();
      
      // Atualizar badge no header
      updateNotificationBadge(result.count);
      
      // Se estamos na página de relatório, mostrar notificações
      if (window.location.pathname.includes('relatorio.html')) {
        await showReportNotifications();
      }
    }
  });
}

// Auto-inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNotificationSystem);
} else {
  initNotificationSystem();
}

// Exportar funções globalmente
window.checkPartnerSubmissions = checkPartnerSubmissions;
window.updateNotificationBadge = updateNotificationBadge;
window.showReportNotifications = showReportNotifications;
window.markAsViewed = markAsViewed;
window.dismissNotifications = dismissNotifications;
