/* ============================================
   QUEST4COUPLE - EMAIL NOTIFICATION SYSTEM
   Sistema de notificações por e-mail
   ============================================ */

// ========================================
// CONFIGURAÇÃO EMAILJS (Serviço Gratuito)
// ========================================

/* 
   INSTRUÇÕES DE CONFIGURAÇÃO:
   
   1. Criar conta gratuita em https://www.emailjs.com/
   2. Configurar um serviço de e-mail (Gmail, Outlook, etc.)
   3. Criar um template de e-mail com as seguintes variáveis:
      - {{to_email}} - E-mail do destinatário
      - {{partner_name}} - Nome do parceiro que enviou
      - {{report_count}} - Número de relatórios novos
      - {{link}} - Link direto para o relatório
      
   4. Substituir as constantes abaixo pelos seus valores:
*/

const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_quest4couple',  // Substituir pelo seu Service ID
  TEMPLATE_ID: 'template_new_report',  // Substituir pelo seu Template ID
  PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY' // Substituir pela sua Public Key
};

// Flag para ativar/desativar e-mails (útil para testes)
const EMAIL_ENABLED = true;

// ========================================
// CARREGAR EMAILJS SDK
// ========================================

function loadEmailJS() {
  return new Promise((resolve, reject) => {
    // Verificar se já está carregado
    if (window.emailjs) {
      resolve(window.emailjs);
      return;
    }

    // Carregar script do EmailJS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      if (window.emailjs) {
        window.emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('✅ EmailJS carregado com sucesso');
        resolve(window.emailjs);
      } else {
        reject(new Error('EmailJS não foi carregado'));
      }
    };
    script.onerror = () => reject(new Error('Erro ao carregar EmailJS'));
    document.head.appendChild(script);
  });
}

// ========================================
// ENVIAR NOTIFICAÇÃO POR E-MAIL
// ========================================

async function sendEmailNotification(recipientEmail, partnerName, reportCount = 1) {
  if (!EMAIL_ENABLED) {
    console.log('📧 E-mails desativados (modo teste)');
    return { success: false, reason: 'disabled' };
  }

  try {
    // Carregar EmailJS se necessário
    const emailjs = await loadEmailJS();

    // Preparar parâmetros do e-mail
    const templateParams = {
      to_email: recipientEmail,
      partner_name: partnerName,
      report_count: reportCount,
      link: `https://quest4couple.com/relatorio.html`,
      from_name: 'Quest4Couple',
      reply_to: 'info@quest4couple.com'
    };

    console.log('📧 Enviando e-mail para:', recipientEmail);

    // Enviar e-mail usando EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );

    console.log('✅ E-mail enviado com sucesso:', response);
    return { success: true, response };

  } catch (error) {
    console.error('❌ Erro ao enviar e-mail:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// NOTIFICAR PARCEIRO SOBRE NOVO RELATÓRIO
// ========================================

async function notifyPartnerByEmail(connectionId) {
  if (!auth || !db) {
    console.log('⚠️ Firebase não inicializado');
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    console.log('⚠️ Nenhum utilizador autenticado');
    return;
  }

  try {
    // Buscar dados da conexão
    const connectionDoc = await db.collection('connections').doc(connectionId).get();
    
    if (!connectionDoc.exists) {
      console.log('⚠️ Conexão não encontrada');
      return;
    }

    const connectionData = connectionDoc.data();
    const partnerId = connectionData.users.find(id => id !== user.uid);

    if (!partnerId) {
      console.log('⚠️ Parceiro não encontrado na conexão');
      return;
    }

    // Buscar perfil do parceiro para obter e-mail
    const partnerDoc = await db.collection('users').doc(partnerId).get();
    
    if (!partnerDoc.exists) {
      console.log('⚠️ Perfil do parceiro não encontrado');
      return;
    }

    const partnerData = partnerDoc.data();
    const partnerEmail = partnerData.email;
    const currentUserName = user.displayName || user.email.split('@')[0];

    if (!partnerEmail) {
      console.log('⚠️ E-mail do parceiro não encontrado');
      return;
    }

    // Verificar se o parceiro tem notificações de e-mail ativadas
    if (partnerData.emailNotifications === false) {
      console.log('📧 Parceiro desativou notificações por e-mail');
      return;
    }

    // Enviar e-mail de notificação
    console.log(`📧 Notificando ${partnerEmail} sobre novo relatório de ${currentUserName}`);
    
    const result = await sendEmailNotification(
      partnerEmail,
      currentUserName,
      1
    );

    if (result.success) {
      console.log('✅ Notificação por e-mail enviada com sucesso!');
      
      // Registrar notificação no Firestore (opcional)
      await db.collection('emailNotifications').add({
        from: user.uid,
        to: partnerId,
        connectionId: connectionId,
        sentAt: firebase.firestore.FieldValue.serverTimestamp(),
        type: 'new_report',
        status: 'sent'
      });
    } else {
      console.log('⚠️ Não foi possível enviar notificação por e-mail:', result.reason || result.error);
    }

  } catch (error) {
    console.error('❌ Erro ao notificar parceiro por e-mail:', error);
  }
}

// ========================================
// ALTERNATIVA: USAR API BACKEND PRÓPRIA
// ========================================

/* 
   Se preferir usar o seu próprio servidor de e-mail (recomendado para produção):
   
   1. Configurar um servidor Node.js com Express
   2. Usar Nodemailer para enviar e-mails via SMTP
   3. Configurar conta info@quest4couple.com no servidor de e-mail
   4. Usar a função abaixo:
*/

async function sendEmailViaBackend(recipientEmail, partnerName, reportCount = 1) {
  try {
    const response = await fetch('https://your-backend.quest4couple.com/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: recipientEmail,
        partnerName: partnerName,
        reportCount: reportCount,
        timestamp: new Date().toISOString()
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ E-mail enviado via backend com sucesso');
      return { success: true };
    } else {
      console.error('❌ Erro ao enviar e-mail via backend:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Erro na requisição para backend:', error);
    return { success: false, error: error.message };
  }
}

// ========================================
// TEMPLATE DE E-MAIL (HTML)
// ========================================

const EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💕 Quest4Couple</h1>
      <p>Novo Relatório Disponível!</p>
    </div>
    <div class="content">
      <p>Olá!</p>
      <p><strong>{{partner_name}}</strong> acabou de partilhar {{report_count}} novo{{#if_plural}} relatório{{else}} relatórios{{/if_plural}} de compatibilidade contigo!</p>
      <p>Descobre agora as vossas respostas e o nível de compatibilidade:</p>
      <a href="{{link}}" class="button">Ver Relatório Agora</a>
      <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
        Este e-mail foi enviado automaticamente pelo Quest4Couple. 
        Para desativar notificações por e-mail, acede às tuas configurações no Dashboard.
      </p>
    </div>
    <div class="footer">
      <p>© 2024 Quest4Couple - Descobre a vossa compatibilidade</p>
      <p>
        <a href="https://quest4couple.com">Website</a> | 
        <a href="mailto:info@quest4couple.com">Contacto</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

// ========================================
// EXPORTAR FUNÇÕES
// ========================================

window.sendEmailNotification = sendEmailNotification;
window.notifyPartnerByEmail = notifyPartnerByEmail;
window.sendEmailViaBackend = sendEmailViaBackend;
window.loadEmailJS = loadEmailJS;

console.log('✅ Sistema de notificações por e-mail carregado');
