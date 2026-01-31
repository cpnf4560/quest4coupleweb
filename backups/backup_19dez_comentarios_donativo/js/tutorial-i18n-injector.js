/**
 * Injeta automaticamente atributos data-i18n no tutorial.html
 * Executa após o DOM estar pronto
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Injetando atributos i18n no tutorial...');
    
    // SEÇÃO REGISTO
    const registroSection = document.getElementById('registro');
    if (registroSection) {
        // Título da seção já tem i18n
        
        // H3 - Vantagens do Registo
        const benefitsH3 = registroSection.querySelector('h3');
        if (benefitsH3) {
            const span = benefitsH3.querySelector('span:last-child');
            if (span && !span.getAttribute('data-i18n')) {
                span.setAttribute('data-i18n', 'tutorial.sections.register.benefitsTitle');
            }
        }
        
        // Steps de vantagens
        const benefitSteps = registroSection.querySelectorAll('.steps')[0]?.querySelectorAll('.step');
        if (benefitSteps && benefitSteps.length >= 4) {
            const benefits = ['benefit1', 'benefit2', 'benefit3', 'benefit4'];
            benefitSteps.forEach((step, idx) => {
                const title = step.querySelector('.step-title');
                const desc = step.querySelector('.step-description');
                if (title && !title.getAttribute('data-i18n')) {
                    title.setAttribute('data-i18n', `tutorial.sections.register.${benefits[idx]}Title`);
                }
                if (desc && !desc.getAttribute('data-i18n')) {
                    desc.setAttribute('data-i18n', `tutorial.sections.register.${benefits[idx]}Desc`);
                }
            });
        }
        
        // H3 - Como Registar
        const howToH3 = registroSection.querySelectorAll('h3')[1];
        if (howToH3) {
            const span = howToH3.querySelector('span:last-child');
            if (span && !span.getAttribute('data-i18n')) {
                span.setAttribute('data-i18n', 'tutorial.sections.register.howToTitle');
            }
        }
        
        // Steps de como registar
        const howToSteps = registroSection.querySelectorAll('.steps')[1]?.querySelectorAll('.step');
        if (howToSteps && howToSteps.length >= 4) {
            howToSteps.forEach((step, idx) => {
                const desc = step.querySelector('.step-description');
                if (desc && !desc.getAttribute('data-i18n')) {
                    desc.setAttribute('data-i18n', `tutorial.sections.register.step${idx + 1}`);
                }
            });
        }
    }
    
    // SEÇÃO RESPOSTAS
    const respostasSection = document.getElementById('respostas');
    if (respostasSection) {
        // Título da seção
        const h2 = respostasSection.querySelector('h2');
        if (h2) {
            const span = h2.querySelector('span:last-child');
            if (span && !span.getAttribute('data-i18n')) {
                span.setAttribute('data-i18n', 'tutorial.sections.answers.title');
            }
        }
        
        // H3 - 4 Opções
        const optionsH3 = respostasSection.querySelector('h3');
        if (optionsH3) {
            const span = optionsH3.querySelector('span:last-child');
            if (span && !span.getAttribute('data-i18n')) {
                span.setAttribute('data-i18n', 'tutorial.sections.answers.optionsTitle');
            }
        }
        
        // Legend items (4 opções)
        const legendItems = respostasSection.querySelectorAll('.legend-item');
        const options = ['yes', 'maybe', 'no', 'block'];
        legendItems.forEach((item, idx) => {
            if (idx < 4) {
                const title = item.querySelector('.legend-title');
                const desc = item.querySelector('.legend-desc');
                if (title && !title.getAttribute('data-i18n')) {
                    title.setAttribute('data-i18n', `tutorial.sections.answers.${options[idx]}`);
                }
            }
        });
        
        // Info box - Comentários
        const infoBox = respostasSection.querySelector('.info-box.tip');
        if (infoBox) {
            const title = infoBox.querySelector('.info-box-title span:last-child');
            if (title && !title.getAttribute('data-i18n')) {
                title.textContent = '';
                title.setAttribute('data-i18n', 'tutorial.sections.answers.commentsTitle');
            }
        }
        
        // H3 - Autosave
        const autosaveH3 = respostasSection.querySelectorAll('h3')[1];
        if (autosaveH3) {
            const span = autosaveH3.querySelector('span:last-child');
            if (span && !span.getAttribute('data-i18n')) {
                span.textContent = '';
                span.setAttribute('data-i18n', 'tutorial.sections.answers.autoSaveTitle');
            }
        }
    }
    
    // SEÇÃO GUARDAR
    const guardarSection = document.getElementById('guardar');
    if (guardarSection) {
        // Título da seção
        const h2 = guardarSection.querySelector('h2');
        if (h2) {
            const span = h2.querySelector('span:last-child');
            if (span && !span.getAttribute('data-i18n')) {
                span.setAttribute('data-i18n', 'tutorial.sections.save.title');
            }
        }
        
        // H3s
        const h3s = guardarSection.querySelectorAll('h3');
        const h3Keys = ['autoSaveTitle', 'localSaveTitle', 'loadTitle'];
        h3s.forEach((h3, idx) => {
            if (idx < h3Keys.length) {
                const span = h3.querySelector('span:last-child');
                if (span && !span.getAttribute('data-i18n')) {
                    span.setAttribute('data-i18n', `tutorial.sections.save.${h3Keys[idx]}`);
                }
            }
        });
    }
    
    // SEÇÃO CUSTOM
    const customSection = document.getElementById('custom');
    if (customSection) {
        // Título da seção
        const h2 = customSection.querySelector('h2');
        if (h2) {
            const span = h2.querySelector('span:last-child');
            if (span && !span.getAttribute('data-i18n')) {
                span.setAttribute('data-i18n', 'tutorial.sections.custom.title');
            }
        }
        
        // Descrição
        const firstP = customSection.querySelector('p');
        if (firstP && !firstP.getAttribute('data-i18n-html')) {
            firstP.setAttribute('data-i18n-html', 'tutorial.sections.custom.description');
        }
        
        // H3s
        const h3s = customSection.querySelectorAll('h3');
        if (h3s[0]) {
            const span = h3s[0].querySelector('span:last-child');
            if (span && !span.getAttribute('data-i18n')) {
                span.setAttribute('data-i18n', 'tutorial.sections.custom.howToTitle');
            }
        }
        if (h3s[1]) {
            const span = h3s[1].querySelector('span:last-child');
            if (span && !span.getAttribute('data-i18n')) {
                span.setAttribute('data-i18n', 'tutorial.sections.custom.exportImportTitle');
            }
        }
    }
    
    // SEÇÃO CONEXÕES
    const conexoesSection = document.getElementById('conexoes');
    if (conexoesSection) {
        // Título da seção
        const h2 = conexoesSection.querySelector('h2');
        if (h2) {
            const span = h2.querySelector('span:last-child');
            if (span && !span.getAttribute('data-i18n')) {
                span.setAttribute('data-i18n', 'tutorial.sections.connections.title');
            }
        }
        
        // Descrição
        const firstP = conexoesSection.querySelector('p');
        if (firstP && !firstP.getAttribute('data-i18n-html')) {
            firstP.setAttribute('data-i18n-html', 'tutorial.sections.connections.description');
        }
    }
    
    // SEÇÃO COMPARAR
    const compararSection = document.getElementById('comparar');
    if (compararSection) {
        // Título da seção
        const h2 = compararSection.querySelector('h2');
        if (h2) {
            const span = h2.querySelector('span:last-child');
            if (span && !span.getAttribute('data-i18n')) {
                span.setAttribute('data-i18n', 'tutorial.sections.compare.title');
            }
        }
        
        // Descrição
        const firstP = compararSection.querySelector('p');
        if (firstP && !firstP.getAttribute('data-i18n-html')) {
            firstP.setAttribute('data-i18n-html', 'tutorial.sections.compare.description');
        }
    }
    
    // SEÇÃO CÓDIGO
    const codigoSection = document.getElementById('codigo');
    if (codigoSection) {
        // Título da seção
        const h2 = codigoSection.querySelector('h2');
        if (h2) {
            const span = h2.querySelector('span:last-child');
            if (span && !span.getAttribute('data-i18n')) {
                span.setAttribute('data-i18n', 'tutorial.sections.code.title');
            }
        }
        
        // Descrição
        const firstP = codigoSection.querySelector('p');
        if (firstP && !firstP.getAttribute('data-i18n-html')) {
            firstP.setAttribute('data-i18n-html', 'tutorial.sections.code.description');
        }
        
        // H3s
        const h3s = codigoSection.querySelectorAll('h3');
        const h3Keys = ['howWorksTitle', 'howToUseTitle', 'codeVsFileTitle'];
        h3s.forEach((h3, idx) => {
            if (idx < h3Keys.length) {
                const span = h3.querySelector('span:last-child');
                if (span && !span.getAttribute('data-i18n')) {
                    span.setAttribute('data-i18n', `tutorial.sections.code.${h3Keys[idx]}`);
                }
            }
        });
    }
    
    console.log('✅ Atributos i18n injetados! Reiniciando traduções...');
    
    // Reiniciar traduções se o i18n já estiver carregado
    if (window.I18n && typeof window.I18n.translatePage === 'function') {
        window.I18n.translatePage();
    }
});
