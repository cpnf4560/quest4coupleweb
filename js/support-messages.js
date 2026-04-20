/* ============================================
   QUEST4COUPLE - SUPPORT MESSAGES
   Sistema de mensagens especiais de suporte
   ============================================ */

// ========================================
// CONFIGURAÇÃO DE MENSAGENS PENDENTES
// ========================================
// Adicionar UIDs de utilizadores que devem receber mensagem especial
// Formato: { [userId]: { message: string, shown: boolean } }
const SUPPORT_MESSAGES = {
  // @jpn91 - Joao
  'mg1WdvvxfzbyPuQ3GITifop230u2': {
    title: '💬 Mensagem da Equipa',
    message: `Olá! 👋

Obrigado por reportarem o problema! 🙏

Já está resolvido - criámos a vossa conexão manualmente. 

Divirtam-se a explorar os packs juntos! 💕

Qualquer coisa, estamos cá!

<strong>Equipa Quest4Couple</strong>`,
    type: 'success' // success, info, warning
  },
  // @vnl94 - Vania
  'REGDg5k3swVUQFMalzPMBKcwAC12': {
    title: '💬 Mensagem da Equipa',
    message: `Olá! 👋

Obrigado por reportarem o problema! 🙏

Já está resolvido - criámos a vossa conexão manualmente. 

Divirtam-se a explorar os packs juntos! 💕

Qualquer coisa, estamos cá!

<strong>Equipa Quest4Couple</strong>`,
    type: 'success'
  }
};

// ========================================
// VERIFICAR E MOSTRAR MENSAGEM
// ========================================
async function checkAndShowSupportMessage(userId) {
  if (!userId) return;
  
  const messageConfig = SUPPORT_MESSAGES[userId];
  if (!messageConfig) return;
  
  // Verificar se já foi mostrada (localStorage)
  const storageKey = `support_msg_shown_${userId}`;
  const alreadyShown = localStorage.getItem(storageKey);
  
  if (alreadyShown) {
    console.log('ℹ️ Mensagem de suporte já foi mostrada para este utilizador');
    return;
  }
  
  console.log('💬 Mostrando mensagem de suporte para:', userId);
  
  // Mostrar popup
  showSupportMessagePopup(messageConfig);
  
  // Marcar como mostrada
  localStorage.setItem(storageKey, new Date().toISOString());
}

// ========================================
// POPUP UI
// ========================================
function showSupportMessagePopup(config) {
  // Criar overlay
  const overlay = document.createElement('div');
  overlay.id = 'supportMessageOverlay';
  overlay.className = 'support-message-overlay';
  
  // Definir cores baseado no tipo
  let iconColor, borderColor;
  switch(config.type) {
    case 'success':
      iconColor = '#28a745';
      borderColor = '#28a745';
      break;
    case 'warning':
      iconColor = '#ffc107';
      borderColor = '#ffc107';
      break;
    default:
      iconColor = '#667eea';
      borderColor = '#667eea';
  }
  
  overlay.innerHTML = `
    <div class="support-message-popup">
      <div class="support-message-header" style="border-bottom-color: ${borderColor}">
        <span class="support-message-icon" style="color: ${iconColor}">✉️</span>
        <h3>${config.title || 'Mensagem'}</h3>
      </div>
      <div class="support-message-body">
        <p>${config.message.replace(/\n/g, '<br>')}</p>
      </div>
      <div class="support-message-footer">
        <button class="support-message-btn" onclick="closeSupportMessagePopup()">
          ✓ Entendido
        </button>
      </div>
    </div>
  `;
  
  // Adicionar estilos se ainda não existirem
  if (!document.getElementById('supportMessageStyles')) {
    const styles = document.createElement('style');
    styles.id = 'supportMessageStyles';
    styles.textContent = `
      .support-message-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
        backdrop-filter: blur(4px);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideIn {
        from { 
          opacity: 0;
          transform: translateY(-30px) scale(0.95);
        }
        to { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .support-message-popup {
        background: white;
        border-radius: 20px;
        max-width: 420px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden;
        animation: slideIn 0.4s ease;
      }
      
      .support-message-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 25px;
        display: flex;
        align-items: center;
        gap: 12px;
        border-bottom: 4px solid #28a745;
      }
      
      .support-message-icon {
        font-size: 28px;
        background: white;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .support-message-header h3 {
        margin: 0;
        font-size: 1.3em;
        font-weight: 600;
      }
      
      .support-message-body {
        padding: 25px;
        font-size: 1.05em;
        line-height: 1.7;
        color: #333;
      }
      
      .support-message-body p {
        margin: 0;
      }
      
      .support-message-body strong {
        color: #667eea;
      }
      
      .support-message-footer {
        padding: 15px 25px 25px;
        text-align: center;
      }
      
      .support-message-btn {
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        border: none;
        padding: 14px 40px;
        border-radius: 30px;
        font-size: 1.1em;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
      }
      
      .support-message-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
      }
      
      @media (max-width: 480px) {
        .support-message-popup {
          width: 95%;
          margin: 10px;
        }
        
        .support-message-header {
          padding: 15px 20px;
        }
        
        .support-message-body {
          padding: 20px;
          font-size: 1em;
        }
      }
    `;
    document.head.appendChild(styles);
  }
  
  document.body.appendChild(overlay);
  
  // Fechar ao clicar fora
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeSupportMessagePopup();
    }
  });
}

function closeSupportMessagePopup() {
  const overlay = document.getElementById('supportMessageOverlay');
  if (overlay) {
    overlay.style.animation = 'fadeIn 0.2s ease reverse';
    setTimeout(() => {
      overlay.remove();
    }, 200);
  }
}

// ========================================
// PREVIEW (para testar no admin)
// ========================================
function previewSupportMessage() {
  // Remove marca de "já mostrado" temporariamente para preview
  showSupportMessagePopup({
    title: '💬 Mensagem da Equipa',
    message: `Olá! 👋

Obrigado por reportarem o problema! 🙏

Já está resolvido - criámos a vossa conexão manualmente. 

Divirtam-se a explorar os packs juntos! 💕

Qualquer coisa, estamos cá!

<strong>Equipa Quest4Couple</strong>`,
    type: 'success'
  });
}

// Expor funções globalmente
window.checkAndShowSupportMessage = checkAndShowSupportMessage;
window.previewSupportMessage = previewSupportMessage;
window.closeSupportMessagePopup = closeSupportMessagePopup;

console.log('💬 Support Messages loaded. Use previewSupportMessage() to test.');
