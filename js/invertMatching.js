/* ============================================
   QUEST4COUPLE - INVERT MATCHING SYSTEM
   Sistema de matching invertido para perguntas
   complementares (dar vs receber)
   ============================================ */

/**
 * COMO FUNCIONA O INVERT MATCHING:
 * 
 * Algumas perguntas têm uma dinâmica de complementaridade:
 * - Pessoa A quer DOMINAR → Pessoa B quer SER DOMINADA = MATCH!
 * - Pessoa A quer DAR prazer anal → Pessoa B quer RECEBER prazer anal = MATCH!
 * 
 * Nestes casos, o matching é invertido:
 * - A resposta de A para "dar" combina com a resposta de B para "receber"
 * - Não faz sentido comparar diretamente "dar" com "dar"
 */

let invertMatchingConfig = null;

// Carregar configuração
async function loadInvertMatchingConfig() {
    try {
        const response = await fetch('./data/invert_matching_config.json');
        invertMatchingConfig = await response.json();
        console.log('✅ Configuração de Invert Matching carregada:', invertMatchingConfig);
    } catch (error) {
        console.error('❌ Erro ao carregar invert matching config:', error);
        invertMatchingConfig = { invertPairs: [] };
    }
}

/**
 * Verifica se uma pergunta faz parte de um par invertido
 * @param {string} packId - ID do pack (ex: "pimentinha")
 * @param {string} questionText - Texto da pergunta
 * @returns {Object|null} - {pairQuestion, isGiver} ou null se não for par invertido
 */
function getInvertPair(packId, questionText) {
    if (!invertMatchingConfig) return null;

    const packPairs = invertMatchingConfig.invertPairs.find(p => p.packId === packId);
    if (!packPairs) return null;    for (const pair of packPairs.pairs) {
        // Se é a pergunta "giver", retorna a "receiver"
        if (pair.questionGiver === questionText) {
            return {
                pairQuestion: pair.questionReceiver,
                isGiver: true,
                description: pair.description,
                labelGiver: pair.labelGiver || 'DAR',
                labelReceiver: pair.labelReceiver || 'RECEBER'
            };
        }
        // Se é a pergunta "receiver", retorna a "giver"
        if (pair.questionReceiver === questionText) {
            return {
                pairQuestion: pair.questionGiver,
                isGiver: false,
                description: pair.description,
                labelGiver: pair.labelGiver || 'DAR',
                labelReceiver: pair.labelReceiver || 'RECEBER'
            };
        }
    }

    return null;
}

/**
 * Calcula compatibilidade com invert matching
 * @param {string} myAnswer - Minha resposta
 * @param {string} partnerAnswer - Resposta do parceiro
 * @param {boolean} useInvert - Se deve usar matching invertido
 * @returns {string} - Tipo de match
 */
function calculateInvertMatch(myAnswer, partnerAnswer, useInvert = false) {
    // Se não é para usar invert, usa lógica normal
    if (!useInvert) {
        return calculateNormalMatch(myAnswer, partnerAnswer);
    }

    // LÓGICA INVERTIDA:
    // Quando EU respondo "porfavor" para DAR, combina com PARCEIRO "porfavor" para RECEBER
    
    // Ambos "meh" = não aparece (filtrado antes)
    if (myAnswer === 'meh' && partnerAnswer === 'meh') {
        return 'filtered';
    }

    // Um quer muito, outro não quer = Reflexão
    if ((myAnswer === 'porfavor' && partnerAnswer === 'meh') ||
        (myAnswer === 'meh' && partnerAnswer === 'porfavor')) {
        return 'reflection';
    }

    // Ambos "porfavor" = Super Match
    if (myAnswer === 'porfavor' && partnerAnswer === 'porfavor') {
        return 'superMatch';
    }

    // Combinações positivas (yup + porfavor ou yup + yup) = Match
    if ((myAnswer === 'porfavor' || myAnswer === 'yup') && 
        (partnerAnswer === 'porfavor' || partnerAnswer === 'yup')) {
        return 'match';
    }

    // Com "talvez" = Para Explorar
    if (myAnswer === 'talvez' || partnerAnswer === 'talvez') {
        return 'explore';
    }

    // Resto = Para Explorar
    return 'explore';
}

/**
 * Lógica normal de matching (sem invert)
 */
function calculateNormalMatch(myAnswer, partnerAnswer) {
    // Ambos "meh" = não aparece
    if (myAnswer === 'meh' && partnerAnswer === 'meh') {
        return 'filtered';
    }

    // Um quer muito, outro não quer = Reflexão
    if ((myAnswer === 'porfavor' && partnerAnswer === 'meh') ||
        (myAnswer === 'meh' && partnerAnswer === 'porfavor')) {
        return 'reflection';
    }

    // Ambos "porfavor" = Super Match
    if (myAnswer === 'porfavor' && partnerAnswer === 'porfavor') {
        return 'superMatch';
    }

    // Combinações positivas = Match
    if ((myAnswer === 'porfavor' || myAnswer === 'yup') && 
        (partnerAnswer === 'porfavor' || partnerAnswer === 'yup')) {
        return 'match';
    }

    // Com "talvez" = Para Explorar
    if (myAnswer === 'talvez' || partnerAnswer === 'talvez') {
        return 'explore';
    }

    return 'explore';
}

/**
 * Processa uma pergunta com possível invert matching
 * @param {string} packId - ID do pack
 * @param {string} questionText - Texto da pergunta
 * @param {Object} myAnswer - Minha resposta completa
 * @param {Object} allPartnerAnswers - Todas as respostas do parceiro
 * @returns {Object} - Resultado do matching
 */
function processQuestionWithInvert(packId, questionText, myAnswer, allPartnerAnswers) {
    // Verifica se é pergunta com par invertido
    const invertPair = getInvertPair(packId, questionText);

    if (!invertPair) {
        // Não é par invertido - usa lógica normal
        const partnerAnswer = allPartnerAnswers[questionText];
        if (!partnerAnswer) return null;

        const matchType = calculateNormalMatch(myAnswer.answer, partnerAnswer.answer);
        
        return {
            questionText,
            myAnswer: myAnswer.answer,
            partnerAnswer: partnerAnswer.answer,
            matchType,
            isInverted: false
        };
    }

    // É par invertido - busca resposta da pergunta complementar do parceiro
    const partnerPairAnswer = allPartnerAnswers[invertPair.pairQuestion];
    
    if (!partnerPairAnswer) {
        console.warn(`⚠️ Resposta do parceiro não encontrada para par invertido: ${invertPair.pairQuestion}`);
        return null;
    }

    const matchType = calculateInvertMatch(myAnswer.answer, partnerPairAnswer.answer, true);

    return {
        questionText,
        pairQuestion: invertPair.pairQuestion,
        myAnswer: myAnswer.answer,
        partnerAnswer: partnerPairAnswer.answer,
        matchType,
        isInverted: true,
        invertDescription: invertPair.description,
        isGiver: invertPair.isGiver
    };
}

/**
 * Gera texto explicativo para o relatório com invert matching
 * @param {Object} result - Resultado do processamento
 * @returns {string} - HTML formatado
 */
function generateInvertExplanation(result) {
    if (!result.isInverted) {
        return `<div class="match-question">${result.questionText}</div>`;
    }

    const giverReceiver = result.isGiver 
        ? `<span class="invert-label giver">Você quer DAR</span>`
        : `<span class="invert-label receiver">Você quer RECEBER</span>`;

    const partnerLabel = result.isGiver
        ? `<span class="invert-label receiver">Parceiro quer RECEBER</span>`
        : `<span class="invert-label giver">Parceiro quer DAR</span>`;

    return `
        <div class="match-question inverted">
            <div class="invert-container">
                <div class="invert-you">
                    ${giverReceiver}
                    <div class="question-text">${result.questionText}</div>
                    <span class="answer-badge ${result.myAnswer}">${getAnswerEmoji(result.myAnswer)} ${result.myAnswer}</span>
                </div>
                <div class="invert-arrow">↔️</div>
                <div class="invert-partner">
                    ${partnerLabel}
                    <div class="question-text">${result.pairQuestion}</div>
                    <span class="answer-badge ${result.partnerAnswer}">${getAnswerEmoji(result.partnerAnswer)} ${result.partnerAnswer}</span>
                </div>
            </div>
            <div class="invert-description">
                <small>💡 ${result.invertDescription}</small>
            </div>
        </div>
    `;
}

/**
 * Retorna emoji para cada resposta
 */
function getAnswerEmoji(answer) {
    const emojis = {
        'porfavor': '⭐',
        'yup': '✓',
        'meh': '✕',
        'talvez': '❓'
    };
    return emojis[answer] || '';
}

// Inicializar ao carregar página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadInvertMatchingConfig);
} else {
    loadInvertMatchingConfig();
}
