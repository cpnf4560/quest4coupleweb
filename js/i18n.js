/**
 * Sistema de Internacionalização (i18n) para Quest4Couple
 * Gere traduções em PT-PT, PT-BR, EN, ES
 */

const I18n = {
    currentLang: 'pt-pt',
    translations: {},
    fallbackLang: 'pt-pt',

    // Idiomas suportados
    supportedLanguages: {
        'pt-pt': { name: 'Português (PT)', flag: '🇵🇹' },
        'pt-br': { name: 'Português (BR)', flag: '🇧🇷' },
        'en': { name: 'English', flag: '🇬🇧' },
        'es': { name: 'Español', flag: '🇪🇸' }
    },

    // Detectar idioma do browser
    detectLanguage() {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('pt-br')) return 'pt-br';
        if (browserLang.startsWith('pt')) return 'pt-pt';
        if (browserLang.startsWith('es')) return 'es';
        if (browserLang.startsWith('en')) return 'en';
        return this.fallbackLang;
    },

    // Inicializar sistema
    async init() {
        // Verificar se já existe idioma guardado
        let savedLang = localStorage.getItem('quest4couple_lang');
        
        if (!savedLang) {
            // Detectar automaticamente
            savedLang = this.detectLanguage();
            
            // Mostrar modal de confirmação
            const confirmed = await this.showLanguageModal(savedLang);
            if (confirmed) {
                this.setLanguage(savedLang);
            }
        } else {
            this.currentLang = savedLang;
            await this.loadTranslations(savedLang);
        }
        
        // Criar seletor de idioma no header
        this.createLanguageSelector();
    },

    // Carregar ficheiro de traduções
    async loadTranslations(lang) {
        try {
            const response = await fetch(`/i18n/translations.${lang}.json`);
            if (!response.ok) throw new Error('Translation file not found');
            
            this.translations = await response.json();
            this.applyTranslations();
            
            // Atualizar atributo lang do HTML
            document.documentElement.lang = lang;
            
            return true;
        } catch (error) {
            console.error(`Failed to load translations for ${lang}:`, error);
            
            // Tentar fallback
            if (lang !== this.fallbackLang) {
                console.log(`Trying fallback language: ${this.fallbackLang}`);
                return this.loadTranslations(this.fallbackLang);
            }
            return false;
        }
    },

    // Aplicar traduções à página
    applyTranslations() {
        // Traduzir elementos com data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (translation) {
                // Verificar se é placeholder, title ou conteúdo
                if (element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else if (element.hasAttribute('title')) {
                    element.title = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Traduzir elementos com data-i18n-html (permite HTML)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.t(key);
            
            if (translation) {
                element.innerHTML = translation;
            }
        });

        // Atualizar title da página
        if (this.translations.pageTitle) {
            document.title = this.translations.pageTitle;
        }

        // Disparar evento custom para componentes que precisam atualizar
        document.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { lang: this.currentLang, translations: this.translations }
        }));
    },

    // Obter tradução por chave (com suporte a nested keys)
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }
        
        // Substituir parâmetros {name} no texto
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            return value.replace(/\{(\w+)\}/g, (match, param) => {
                return params[param] !== undefined ? params[param] : match;
            });
        }
        
        return value;
    },

    // Alterar idioma
    async setLanguage(lang) {
        if (!this.supportedLanguages[lang]) {
            console.error(`Language ${lang} is not supported`);
            return false;
        }
        
        this.currentLang = lang;
        localStorage.setItem('quest4couple_lang', lang);
        
        const success = await this.loadTranslations(lang);
        
        if (success) {
            // Atualizar seletor visual
            this.updateLanguageSelector();
        }
        
        return success;
    },

    // Mostrar modal de seleção de idioma
    showLanguageModal(detectedLang = 'pt-pt') {
        return new Promise((resolve) => {
            // Criar modal
            const modal = document.createElement('div');
            modal.id = 'language-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: white;
                padding: 40px 30px;
                border-radius: 16px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 400px;
                width: 90%;
                animation: slideIn 0.4s ease;
            `;

            modalContent.innerHTML = `
                <div style="font-size: 3em; margin-bottom: 15px;">🌍</div>
                <h2 style="color: #667eea; margin-bottom: 10px; font-size: 1.5em;">Choose your language</h2>
                <p style="color: #666; margin-bottom: 25px;">Escolhe o idioma / Selecciona idioma</p>
                
                <div id="lang-options" style="display: flex; flex-direction: column; gap: 12px;">
                    ${Object.entries(this.supportedLanguages).map(([code, info]) => `
                        <button 
                            class="lang-option" 
                            data-lang="${code}"
                            style="
                                padding: 15px 20px;
                                border: 2px solid ${code === detectedLang ? '#667eea' : '#e0e0e0'};
                                background: ${code === detectedLang ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white'};
                                color: ${code === detectedLang ? 'white' : '#333'};
                                border-radius: 10px;
                                font-size: 1.1em;
                                cursor: pointer;
                                transition: all 0.3s;
                                font-weight: ${code === detectedLang ? '600' : '500'};
                            "
                            onmouseover="this.style.transform='translateX(5px)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.3)';"
                            onmouseout="this.style.transform='translateX(0)'; this.style.boxShadow='none';"
                        >
                            <span style="font-size: 1.3em;">${info.flag}</span> ${info.name}
                            ${code === detectedLang ? '<span style="margin-left: 8px;">✓</span>' : ''}
                        </button>
                    `).join('')}
                </div>
            `;

            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            // Adicionar animações CSS
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);

            // Event listeners
            modalContent.querySelectorAll('.lang-option').forEach(button => {
                button.addEventListener('click', async () => {
                    const selectedLang = button.getAttribute('data-lang');
                    modal.style.animation = 'fadeOut 0.3s ease';
                    
                    setTimeout(() => {
                        document.body.removeChild(modal);
                        resolve(selectedLang);
                    }, 300);
                });
            });
        });
    },

    // Criar seletor de idioma no header
    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.id = 'language-selector';
        selector.style.cssText = `
            position: relative;
            display: flex;
            align-items: center;
        `;

        const currentLangInfo = this.supportedLanguages[this.currentLang];
        
        selector.innerHTML = `
            <button id="lang-toggle" style="
                background: rgba(255, 255, 255, 0.9);
                border: 2px solid #e0e0e0;
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 0.95em;
                font-weight: 600;
                color: #333;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s;
            ">
                <span style="font-size: 1.3em;">${currentLangInfo.flag}</span>
                <span>${this.currentLang.toUpperCase()}</span>
                <span style="font-size: 0.8em;">▼</span>
            </button>
            
            <div id="lang-dropdown" style="
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 8px;
                background: white;
                border: 2px solid #e0e0e0;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                min-width: 180px;
                display: none;
                z-index: 1001;
            ">
                ${Object.entries(this.supportedLanguages).map(([code, info]) => `
                    <button 
                        class="lang-dropdown-item" 
                        data-lang="${code}"
                        style="
                            width: 100%;
                            padding: 12px 16px;
                            border: none;
                            background: ${code === this.currentLang ? '#f0f0f0' : 'white'};
                            text-align: left;
                            cursor: pointer;
                            font-size: 0.95em;
                            transition: background 0.2s;
                            display: flex;
                            align-items: center;
                            gap: 10px;
                            font-weight: ${code === this.currentLang ? '600' : '400'};
                        "
                        onmouseover="this.style.background='#f8f8f8'"
                        onmouseout="this.style.background='${code === this.currentLang ? '#f0f0f0' : 'white'}'"
                    >
                        <span style="font-size: 1.2em;">${info.flag}</span>
                        <span>${info.name}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // Adicionar ao header (se existir)
        const header = document.querySelector('.header, header');
        if (header) {
            const authButtons = header.querySelector('.auth-buttons');
            if (authButtons) {
                authButtons.insertBefore(selector, authButtons.firstChild);
            } else {
                header.appendChild(selector);
            }
        }

        // Toggle dropdown
        const toggle = selector.querySelector('#lang-toggle');
        const dropdown = selector.querySelector('#lang-dropdown');
        
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        // Fechar ao clicar fora
        document.addEventListener('click', () => {
            dropdown.style.display = 'none';
        });

        // Trocar idioma
        selector.querySelectorAll('.lang-dropdown-item').forEach(item => {
            item.addEventListener('click', async (e) => {
                e.stopPropagation();
                const lang = item.getAttribute('data-lang');
                await this.setLanguage(lang);
                dropdown.style.display = 'none';
            });
        });
    },

    // Atualizar seletor visual
    updateLanguageSelector() {
        const toggle = document.querySelector('#lang-toggle');
        if (toggle) {
            const currentLangInfo = this.supportedLanguages[this.currentLang];
            toggle.innerHTML = `
                <span style="font-size: 1.3em;">${currentLangInfo.flag}</span>
                <span>${this.currentLang.toUpperCase()}</span>
                <span style="font-size: 0.8em;">▼</span>
            `;
        }

        // Atualizar estado ativo no dropdown
        document.querySelectorAll('.lang-dropdown-item').forEach(item => {
            const lang = item.getAttribute('data-lang');
            item.style.background = lang === this.currentLang ? '#f0f0f0' : 'white';
            item.style.fontWeight = lang === this.currentLang ? '600' : '400';
        });
    }
};

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => I18n.init());
} else {
    I18n.init();
}

// Exportar para uso global
window.I18n = I18n;
