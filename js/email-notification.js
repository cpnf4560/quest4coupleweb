/* ============================================
   QUEST4COUPLE - EMAIL NOTIFICATIONS
   Notificações por email usando EmailJS
   ============================================ */

// ⚠️ CONFIGURAÇÃO EMAILJS
// Para configurar:
// 1. Vai a https://www.emailjs.com/ e cria conta gratuita
// 2. Cria um "Email Service" (Gmail, Outlook, etc.)
// 3. Cria um "Email Template" com as variáveis: {{user_email}}, {{user_name}}, {{registration_date}}
// 4. Copia os IDs abaixo

const EMAILJS_CONFIG = {
    publicKey: '4nK4BoFUI1oru0xFL',
    serviceId: 'service_lxlqj3d',
    templateId: 'template_9sprvoq'
};

// Flag para verificar se EmailJS está configurado
const isEmailJSConfigured = () => {
    return EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' &&
           EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID' &&
           EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID';
};

// Inicializar EmailJS
function initEmailJS() {
    if (!isEmailJSConfigured()) {
        console.warn('⚠️ EmailJS não configurado. Notificações de email desativadas.');
        console.warn('📝 Configura as credenciais em js/email-notification.js');
        return false;
    }
    
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        console.log('✅ EmailJS inicializado');
        return true;
    } else {
        console.warn('⚠️ EmailJS SDK não carregado');
        return false;
    }
}

// Enviar notificação de novo registo
async function sendNewUserNotification(userData) {
    if (!isEmailJSConfigured()) {
        console.log('📧 EmailJS não configurado - notificação ignorada');
        return { success: false, reason: 'not_configured' };
    }
    
    if (typeof emailjs === 'undefined') {
        console.warn('⚠️ EmailJS SDK não disponível');
        return { success: false, reason: 'sdk_not_loaded' };
    }
    
    try {
        const templateParams = {
            user_email: userData.email || 'N/A',
            user_name: userData.displayName || userData.name || 'Novo utilizador',
            user_gender: userData.gender || 'Não especificado',
            user_age: userData.age || 'N/A',
            user_country: userData.countryName || userData.country || 'N/A',
            user_city: userData.city || 'N/A',
            auth_provider: userData.authProvider || 'password',
            registration_date: new Date().toLocaleString('pt-PT', {
                dateStyle: 'full',
                timeStyle: 'medium'
            }),
            // Admin email - onde vais receber a notificação
            admin_email: 'carlos.sousacorreia@gmail.com'
        };
        
        console.log('📧 Enviando notificação de novo registo...', templateParams);
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );
        
        console.log('✅ Email de notificação enviado!', response);
        return { success: true, response };
        
    } catch (error) {
        console.error('❌ Erro ao enviar notificação por email:', error);
        return { success: false, error };
    }
}

// Função para teste - podes chamar na consola do browser
window.testEmailNotification = async function() {
    const testData = {
        email: 'teste@exemplo.com',
        displayName: 'Utilizador Teste',
        gender: 'M',
        age: 30,
        countryName: 'Portugal',
        city: 'Lisboa',
        authProvider: 'password'
    };
    
    console.log('🧪 Testando notificação de email...');
    const result = await sendNewUserNotification(testData);
    console.log('🧪 Resultado do teste:', result);
    return result;
};

// Exportar para uso global
window.sendNewUserNotification = sendNewUserNotification;
window.initEmailJS = initEmailJS;

console.log('📧 Email notification module carregado');
