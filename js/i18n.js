/**
 * Sistema de Internacionalização (i18n) para Quest4Couple
 * Gere traduções em PT-PT, PT-BR, EN, ES, FR
 */

const I18n = {
    currentLang: 'pt-pt',
    translations: {},
    fallbackLang: 'pt-pt',    // Idiomas suportados com códigos de país para flag-icons
    supportedLanguages: {
        'pt-pt': { name: 'Português (PT)', flag: 'PT', countryCode: 'pt' },
        'pt-br': { name: 'Português (BR)', flag: 'BR', countryCode: 'br' },
        'en': { name: 'English', flag: 'EN', countryCode: 'gb' },
        'es': { name: 'Español', flag: 'ES', countryCode: 'es' },
        'fr': { name: 'Français', flag: 'FR', countryCode: 'fr' }
    },

    // Detectar idioma do browser
    detectLanguage() {
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('pt-br')) return 'pt-br';
        if (browserLang.startsWith('pt')) return 'pt-pt';
        if (browserLang.startsWith('es')) return 'es';
        if (browserLang.startsWith('en')) return 'en';
        if (browserLang.startsWith('fr')) return 'fr';
        return this.fallbackLang;
    },    // Inicializar sistema
    async init() {
        console.log('🚀 Iniciando sistema i18n...');
        
        // Verificar se já existe idioma guardado
        let savedLang = localStorage.getItem('quest4couple_lang');
        
        if (!savedLang) {
            // Detectar automaticamente
            savedLang = this.detectLanguage();
            console.log('🔍 Idioma detectado:', savedLang);
            
            // Mostrar modal de confirmação
            const confirmed = await this.showLanguageModal(savedLang);
            if (confirmed) {
                await this.setLanguage(confirmed);
            }        } else {
            console.log('💾 Idioma salvo:', savedLang);
            this.currentLang = savedLang;
            await this.loadTranslations(savedLang);
        }
        
        // Criar seletor imediatamente após carregar traduções
        this.createLanguageSelector();
          console.log('✅ Sistema i18n inicializado!');
    },

    // Determinar o caminho base correto baseado na localização atual
    getBasePath() {
        const path = window.location.pathname;
        // Se estamos numa subpasta (ex: pages/), volta para a raiz
        if (path.includes('/pages/') || path.includes('/tests/')) {
            return '../';
        }
        return './';
    },

    // Carregar ficheiro de traduções
    async loadTranslations(lang) {
        try {
            // Determinar o caminho base correto baseado na localização atual
            const basePath = this.getBasePath();
            const response = await fetch(`${basePath}i18n/translations.${lang}.json`);
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
        console.log('🔄 Applying translations for language:', this.currentLang);
        
        // Traduzir elementos com data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            console.log(`🔤 Translating ${key}:`, translation);
            
            if (translation && translation !== key) {
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
            
            if (translation && translation !== key) {
                element.innerHTML = translation;
            }
        });

        // Traduzir placeholders com data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            
            if (translation) {
                element.placeholder = translation;
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
                // Chave não encontrada - retornar a chave original
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
            const modal = document.createElement('div');
            modal.id = 'language-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(0, 0, 0, 0.7); z-index: 10000;
                display: flex; align-items: center; justify-content: center;
                animation: fadeIn 0.3s ease;
            `;

            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: white; padding: 40px 30px; border-radius: 16px;
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3); text-align: center;
                max-width: 400px; width: 90%; animation: slideIn 0.4s ease;
            `;

            const title = document.createElement('h2');
            title.style.cssText = 'color: #667eea; margin-bottom: 10px; font-size: 1.5em;';
            title.textContent = 'Choose your language';
            
            const subtitle = document.createElement('p');
            subtitle.style.cssText = 'color: #666; margin-bottom: 25px;';
            subtitle.textContent = 'Escolhe o idioma / Selecciona idioma';
              const icon = document.createElement('div');
            icon.style.cssText = 'font-size: 3em; margin-bottom: 15px;';
            icon.textContent = '🌐';
            
            const langOptions = document.createElement('div');
            langOptions.style.cssText = 'display: flex; flex-direction: column; gap: 12px;';
            
            Object.entries(this.supportedLanguages).forEach(([code, info]) => {
                const btn = document.createElement('button');
                btn.className = 'lang-option';
                btn.setAttribute('data-lang', code);
                btn.style.cssText = `
                    padding: 15px 20px;
                    border: 2px solid ${code === detectedLang ? '#667eea' : '#e0e0e0'};
                    background: ${code === detectedLang ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'white'};
                    color: ${code === detectedLang ? 'white' : '#333'};
                    border-radius: 10px; font-size: 1.1em; cursor: pointer;
                    transition: all 0.3s; font-weight: ${code === detectedLang ? '600' : '500'};
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                `;
                
                const flagSpan = document.createElement('span');
                flagSpan.style.cssText = `font-weight: 700; font-size: 1.2em;`;
                flagSpan.textContent = info.flag;
                
                const nameSpan = document.createElement('span');
                nameSpan.textContent = info.name;
                
                btn.appendChild(flagSpan);
                btn.appendChild(nameSpan);
                
                if (code === detectedLang) {
                    const check = document.createElement('span');
                    check.style.marginLeft = '8px';
                    check.textContent = '✓';
                    btn.appendChild(check);
                }
                
                btn.onmouseover = function() {
                    if (code !== detectedLang) {
                        this.style.transform = 'scale(1.02)';
                        this.style.borderColor = '#667eea';
                    }
                };
                btn.onmouseout = function() {
                    if (code !== detectedLang) {
                        this.style.transform = 'scale(1)';
                        this.style.borderColor = '#e0e0e0';
                    }
                };
                
                btn.onclick = () => {
                    modal.remove();
                    resolve(code);
                };
                
                langOptions.appendChild(btn);
            });
            
            modalContent.appendChild(icon);
            modalContent.appendChild(title);
            modalContent.appendChild(subtitle);
            modalContent.appendChild(langOptions);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { transform: translateY(-30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `;
            document.head.appendChild(style);
        });
    },    // Criar seletor de idioma no header - USANDO DOM
    createLanguageSelector() {
        console.log('🌍 Creating language selector...');
        console.log('📍 Current language:', this.currentLang);
        console.log('📍 Supported languages:', this.supportedLanguages);
        
        // Carregar CSS da biblioteca flag-icons (bandeiras bonitas)
        if (!document.getElementById('flag-icons-css')) {
            const flagIconsCSS = document.createElement('link');
            flagIconsCSS.id = 'flag-icons-css';
            flagIconsCSS.rel = 'stylesheet';
            flagIconsCSS.href = 'https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.0.0/css/flag-icons.min.css';
            document.head.appendChild(flagIconsCSS);
            console.log('🚩 Flag icons CSS loaded');
        }
        
        const selector = document.createElement('div');
        selector.id = 'language-selector';
        selector.style.cssText = 'position: relative; display: flex; align-items: center; margin-left: 10px;';        const currentLangInfo = this.supportedLanguages[this.currentLang];
        console.log('📍 Current lang info:', currentLangInfo);
        
        // Botão principal
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'lang-toggle';
        toggleBtn.title = currentLangInfo.name;
        toggleBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.95); border: 2px solid #d63384;
            padding: 8px 14px; border-radius: 10px; cursor: pointer; font-size: 1em;
            display: flex; align-items: center; gap: 8px; transition: all 0.3s;
            box-shadow: 0 2px 8px rgba(214, 51, 132, 0.15); font-weight: 600;
        `;
        toggleBtn.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(214, 51, 132, 0.25)';
        };
        toggleBtn.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 8px rgba(214, 51, 132, 0.15)';
        };
        
        // Criar bandeira usando flag-icons (imagem bonita arredondada)
        const flagSpan = document.createElement('span');
        flagSpan.className = `fi fi-${currentLangInfo.countryCode} fis`;
        flagSpan.style.cssText = 'width: 24px; height: 18px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);';
        
        const codeSpan = document.createElement('span');
        codeSpan.style.cssText = 'color: #d63384; font-weight: 700;';
        codeSpan.textContent = currentLangInfo.flag;
        console.log('🚩 Flag criada:', currentLangInfo.countryCode, currentLangInfo.flag);
        
        const arrowSpan = document.createElement('span');
        arrowSpan.style.cssText = 'font-size: 0.7em; color: #d63384; font-weight: bold;';
        arrowSpan.textContent = '▼';
        
        toggleBtn.appendChild(flagSpan);
        toggleBtn.appendChild(codeSpan);
        toggleBtn.appendChild(arrowSpan);
        console.log('📌 Botão criado com flag:', currentLangInfo.flag);
        
        // Dropdown
        const dropdown = document.createElement('div');
        dropdown.id = 'lang-dropdown';
        dropdown.style.cssText = `
            position: absolute; top: 100%; right: 0; margin-top: 10px;
            background: white; border: 2px solid #d63384; border-radius: 12px;
            box-shadow: 0 8px 25px rgba(214, 51, 132, 0.2); min-width: 200px;
            display: none; z-index: 1001; overflow: hidden;
        `;
          Object.entries(this.supportedLanguages).forEach(([code, info]) => {
            const item = document.createElement('button');
            item.className = 'lang-dropdown-item';
            item.setAttribute('data-lang', code);
            item.style.cssText = `
                width: 100%; padding: 14px 18px; border: none;
                background: ${code === this.currentLang ? 'linear-gradient(135deg, rgba(214, 51, 132, 0.1), rgba(111, 66, 193, 0.1))' : 'white'};
                text-align: left; cursor: pointer; font-size: 1em; transition: all 0.2s;
                display: flex; align-items: center; gap: 12px;
                font-weight: ${code === this.currentLang ? '700' : '500'};
                color: ${code === this.currentLang ? '#d63384' : '#333'};
                border-bottom: 1px solid rgba(214, 51, 132, 0.1);
            `;
            
            // Criar bandeira usando flag-icons (imagem bonita)
            const itemFlagImg = document.createElement('span');
            itemFlagImg.className = `fi fi-${info.countryCode} fis`;
            itemFlagImg.style.cssText = 'width: 24px; height: 18px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.15);';
            
            const itemFlag = document.createElement('span');
            itemFlag.style.cssText = 'font-weight: 700; color: #d63384; min-width: 30px;';
            itemFlag.textContent = info.flag;
            
            const itemName = document.createElement('span');
            itemName.textContent = info.name;
            
            item.appendChild(itemFlagImg);
            item.appendChild(itemFlag);
            item.appendChild(itemName);
            
            if (code === this.currentLang) {
                const check = document.createElement('span');
                check.style.cssText = 'margin-left: auto; color: #d63384; font-weight: bold;';
                check.textContent = '✓';
                item.appendChild(check);
            }
            
            item.onmouseover = function() {
                if (code !== I18n.currentLang) {
                    this.style.background = 'rgba(214, 51, 132, 0.05)';
                }
            };
            item.onmouseout = function() {
                if (code !== I18n.currentLang) {
                    this.style.background = 'white';
                }
            };
            
            item.onclick = async (e) => {
                e.stopPropagation();
                await this.setLanguage(code);
                dropdown.style.display = 'none';
            };
            
            dropdown.appendChild(item);
        });
        
        selector.appendChild(toggleBtn);
        selector.appendChild(dropdown);
        
        // Toggle dropdown
        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        };
        
        // Fechar ao clicar fora
        document.addEventListener('click', () => {
            dropdown.style.display = 'none';
        });
        
        // Adicionar CSS
        if (!document.getElementById('lang-selector-styles')) {
            const style = document.createElement('style');
            style.id = 'lang-selector-styles';
            style.textContent = `
                #language-selector { flex-shrink: 0; }
                @media (max-width: 768px) {
                    #lang-toggle { font-size: 1.5em !important; padding: 6px 10px !important; }
                    #lang-dropdown { min-width: 160px !important; right: -10px !important; }
                }
            `;
            document.head.appendChild(style);
        }
          // Adicionar ao header
        const header = document.querySelector('.header, header, .tutorial-header');
        if (header) {
            const authButtons = header.querySelector('.auth-buttons, .tutorial-header-right, .user-section-top');
            if (authButtons) {
                authButtons.appendChild(selector);
                console.log('✅ Language selector added to auth buttons');
            } else {
                header.appendChild(selector);
                console.log('✅ Language selector added to header');
            }
        } else {
            console.error('❌ Header not found!');
            document.body.appendChild(selector);
            selector.style.cssText += 'position: fixed; top: 20px; right: 20px; z-index: 10000;';
        }    },    // Atualizar seletor visual
    updateLanguageSelector() {
        console.log('🔄 Updating language selector to:', this.currentLang);
        
        const toggle = document.querySelector('#lang-toggle');
        if (toggle) {
            const currentLangInfo = this.supportedLanguages[this.currentLang];
            toggle.innerHTML = '';
            
            // Bandeira usando flag-icons (imagem bonita arredondada)
            const flagSpan = document.createElement('span');
            flagSpan.className = `fi fi-${currentLangInfo.countryCode} fis`;
            flagSpan.style.cssText = 'width: 24px; height: 18px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);';
            
            // Código ISO
            const codeSpan = document.createElement('span');
            codeSpan.style.cssText = 'color: #d63384; font-weight: 700;';
            codeSpan.textContent = currentLangInfo.flag;
            
            // Seta
            const arrowSpan = document.createElement('span');
            arrowSpan.style.cssText = 'font-size: 0.7em; color: #d63384; font-weight: bold;';
            arrowSpan.textContent = '▼';
            
            toggle.appendChild(flagSpan);
            toggle.appendChild(codeSpan);
            toggle.appendChild(arrowSpan);
            toggle.title = currentLangInfo.name;
        }

        // Atualizar estado ativo no dropdown
        document.querySelectorAll('.lang-dropdown-item').forEach(item => {
            const lang = item.getAttribute('data-lang');
            const hasCheck = item.querySelector('span:last-child');
            
            if (lang === this.currentLang) {
                item.style.background = 'linear-gradient(135deg, rgba(214, 51, 132, 0.1), rgba(111, 66, 193, 0.1))';
                item.style.fontWeight = '700';
                item.style.color = '#d63384';
                
                // Adicionar checkmark se não existir
                if (!hasCheck || hasCheck.textContent !== '✓') {
                    const check = document.createElement('span');
                    check.style.cssText = 'margin-left: auto; color: #d63384; font-weight: bold;';
                    check.textContent = '✓';
                    item.appendChild(check);
                }
            } else {
                item.style.background = 'white';
                item.style.fontWeight = '500';
                item.style.color = '#333';
                
                // Remover checkmark se existir
                if (hasCheck && hasCheck.textContent === '✓') {
                    hasCheck.remove();
                }
            }
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
