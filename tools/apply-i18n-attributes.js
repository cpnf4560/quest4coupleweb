/**
 * Script para aplicar automaticamente atributos data-i18n aos elementos HTML
 * Executa no browser console ou como bookmarklet
 */

const applyI18nAttributes = () => {
    const translations = {
        // Header
        'Tutorial': 'header.tutorial',
        'Questionários': 'header.questionnaire', 
        'Relatório': 'header.report',
        'Dashboard': 'header.dashboard',
        'Login': 'header.login',
        'Sair': 'header.logout',
        
        // Home
        'Descubram-se juntos': 'home.subtitle',
        '100% Privado': 'home.features.private.title',
        '5 Packs Temáticos': 'home.packs.title',
        'Compatibilidade Instantânea': 'home.features.compare.title',
        
        // Auth
        'Entrar': 'auth.login.title',
        'Criar Conta': 'auth.register.title',
        'Email': 'auth.login.email',
        'Password': 'auth.login.password',
        
        // Common
        'Guardar': 'common.save',
        'Cancelar': 'common.cancel',
        'Confirmar': 'common.confirm'
    };
    
    // Encontrar e aplicar atributos
    document.querySelectorAll('button, a, h1, h2, h3, p, span, label').forEach(el => {
        const text = el.textContent.trim();
        
        Object.keys(translations).forEach(key => {
            if (text.includes(key) && !el.hasAttribute('data-i18n')) {
                console.log(`✅ Aplicando data-i18n="${translations[key]}" em:`, el);
                el.setAttribute('data-i18n', translations[key]);
            }
        });
    });
    
    console.log('✅ Atributos data-i18n aplicados!');
};

// Executar
applyI18nAttributes();
