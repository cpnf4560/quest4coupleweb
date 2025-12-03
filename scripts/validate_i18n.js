/**
 * 🧪 Script de Validação i18n - Quest4Couple
 * 
 * Valida se todas as traduções estão completas nos 5 idiomas.
 * Identifica chaves faltantes e inconsistências.
 * 
 * USO:
 *   node scripts/validate_i18n.js
 * 
 * SAÍDA:
 *   - Lista de chaves faltantes por idioma
 *   - Comparação de estruturas
 *   - Relatório de completude
 */

const fs = require('fs');
const path = require('path');

// Cores para terminal
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

// Idiomas suportados
const LANGUAGES = ['pt-pt', 'pt-br', 'en', 'es', 'fr'];

console.log(`${colors.bold}${colors.cyan}
╔═══════════════════════════════════════════════════════╗
║  🧪 Validador de Traduções i18n - Quest4Couple       ║
╚═══════════════════════════════════════════════════════╝
${colors.reset}\n`);

/**
 * Carrega um ficheiro JSON de tradução
 */
function loadTranslations(lang) {
    const filePath = path.join(__dirname, '..', 'i18n', `translations.${lang}.json`);
    
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`${colors.red}❌ Erro ao carregar ${lang}: ${error.message}${colors.reset}`);
        return null;
    }
}

/**
 * Extrai todas as chaves de um objeto recursivamente
 */
function extractKeys(obj, prefix = '') {
    const keys = [];
    
    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            keys.push(...extractKeys(value, fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    
    return keys;
}

/**
 * Compara traduções entre idiomas
 */
function compareTranslations(translations) {
    console.log(`${colors.bold}📊 Análise de Completude:${colors.reset}\n`);
    
    // Idioma de referência (PT-PT)
    const referenceKeys = extractKeys(translations['pt-pt']);
    const totalKeys = referenceKeys.length;
    
    console.log(`📝 Total de chaves (referência PT-PT): ${colors.bold}${totalKeys}${colors.reset}\n`);
    
    // Análise por idioma
    const results = {};
    
    for (const lang of LANGUAGES) {
        if (!translations[lang]) {
            console.log(`${colors.red}❌ ${lang.toUpperCase()}: Ficheiro não encontrado${colors.reset}\n`);
            continue;
        }
        
        const langKeys = extractKeys(translations[lang]);
        const missingKeys = referenceKeys.filter(key => !langKeys.includes(key));
        const extraKeys = langKeys.filter(key => !referenceKeys.includes(key));
        const completeness = ((langKeys.length / totalKeys) * 100).toFixed(1);
        
        results[lang] = {
            total: langKeys.length,
            missing: missingKeys,
            extra: extraKeys,
            completeness
        };
        
        // Emoji de status
        const statusEmoji = completeness == 100 ? '✅' : completeness >= 90 ? '⚠️' : '❌';
        const color = completeness == 100 ? colors.green : completeness >= 90 ? colors.yellow : colors.red;
        
        console.log(`${statusEmoji} ${colors.bold}${lang.toUpperCase()}${colors.reset}: ${color}${completeness}%${colors.reset} (${langKeys.length}/${totalKeys} chaves)`);
        
        if (missingKeys.length > 0) {
            console.log(`   ${colors.red}Faltam ${missingKeys.length} chaves:${colors.reset}`);
            missingKeys.slice(0, 5).forEach(key => {
                console.log(`   ${colors.red}   - ${key}${colors.reset}`);
            });
            if (missingKeys.length > 5) {
                console.log(`   ${colors.red}   ... e mais ${missingKeys.length - 5}${colors.reset}`);
            }
        }
        
        if (extraKeys.length > 0) {
            console.log(`   ${colors.yellow}⚠️  ${extraKeys.length} chaves extras (não em PT-PT):${colors.reset}`);
            extraKeys.slice(0, 3).forEach(key => {
                console.log(`   ${colors.yellow}   + ${key}${colors.reset}`);
            });
            if (extraKeys.length > 3) {
                console.log(`   ${colors.yellow}   ... e mais ${extraKeys.length - 3}${colors.reset}`);
            }
        }
        
        console.log();
    }
    
    return results;
}

/**
 * Valida estruturas específicas importantes
 */
function validateCriticalSections(translations) {
    console.log(`${colors.bold}🔍 Validação de Seções Críticas:${colors.reset}\n`);
    
    const criticalSections = [
        'header.login',
        'header.tutorial',
        'header.questionnaire',
        'home.heroTitle',
        'home.heroSubtitle',
        'home.cta.viewQuestions',
        'home.badge.free',
        'home.links.howItWorks',
        'home.links.viewReport'
    ];
    
    for (const section of criticalSections) {
        process.stdout.write(`   ${section.padEnd(30)}`);
        
        let allPresent = true;
        const statuses = [];
        
        for (const lang of LANGUAGES) {
            if (!translations[lang]) continue;
            
            const keys = section.split('.');
            let current = translations[lang];
            let exists = true;
            
            for (const key of keys) {
                if (current && typeof current === 'object' && key in current) {
                    current = current[key];
                } else {
                    exists = false;
                    break;
                }
            }
            
            if (exists) {
                statuses.push(`${colors.green}✓${colors.reset}`);
            } else {
                statuses.push(`${colors.red}✗${colors.reset}`);
                allPresent = false;
            }
        }
        
        console.log(` [${statuses.join(' ')}] ${allPresent ? colors.green + '✅' : colors.red + '❌'}${colors.reset}`);
    }
    
    console.log();
}

/**
 * Gera relatório de compatibilidade
 */
function generateReport(results) {
    console.log(`${colors.bold}📄 Relatório Final:${colors.reset}\n`);
    
    const allComplete = Object.values(results).every(r => r.completeness == 100);
    
    if (allComplete) {
        console.log(`${colors.green}${colors.bold}✅ SUCESSO! Todas as traduções estão completas!${colors.reset}\n`);
    } else {
        console.log(`${colors.yellow}${colors.bold}⚠️  ATENÇÃO! Algumas traduções estão incompletas.${colors.reset}\n`);
    }
    
    // Estatísticas gerais
    const totalMissing = Object.values(results).reduce((sum, r) => sum + r.missing.length, 0);
    const avgCompleteness = (Object.values(results).reduce((sum, r) => sum + parseFloat(r.completeness), 0) / LANGUAGES.length).toFixed(1);
    
    console.log(`📊 Estatísticas Gerais:`);
    console.log(`   - Idiomas analisados: ${LANGUAGES.length}`);
    console.log(`   - Completude média: ${avgCompleteness}%`);
    console.log(`   - Total de chaves faltantes: ${totalMissing}`);
    console.log();
    
    // Recomendações
    if (totalMissing > 0) {
        console.log(`${colors.yellow}💡 Recomendações:${colors.reset}`);
        for (const [lang, result] of Object.entries(results)) {
            if (result.missing.length > 0) {
                console.log(`   - Adicionar ${result.missing.length} traduções em ${lang.toUpperCase()}`);
            }
        }
        console.log();
    }
    
    return allComplete;
}

/**
 * Main
 */
function main() {
    // Carregar todas as traduções
    const translations = {};
    for (const lang of LANGUAGES) {
        console.log(`📥 Carregando ${lang.toUpperCase()}...`);
        translations[lang] = loadTranslations(lang);
    }
    console.log();
    
    // Verificar se algum ficheiro falhou
    const loadedLangs = Object.keys(translations).filter(lang => translations[lang] !== null);
    if (loadedLangs.length === 0) {
        console.error(`${colors.red}❌ Nenhum ficheiro de tradução foi carregado!${colors.reset}`);
        process.exit(1);
    }
    
    // Comparar traduções
    const results = compareTranslations(translations);
    
    // Validar seções críticas
    validateCriticalSections(translations);
    
    // Gerar relatório
    const allComplete = generateReport(results);
    
    // Exit code
    process.exit(allComplete ? 0 : 1);
}

// Executar
main();
