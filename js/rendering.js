/* ============================================
   QUEST4COUPLE - RENDERING (OPTIMIZED)
   Renderização dinâmica de perguntas
   Com lazy loading para melhor performance
   ============================================ */

// ✅ Cache para dados dos packs (evita múltiplos fetches)
let cachedPacksData = null;
let questionCounters = {};

// ✅ Flag para debug (desativar em produção)
const DEBUG_MODE = false;
const log = DEBUG_MODE ? console.log.bind(console) : () => {};

function loadAndRenderAllPacks() {
  log('🚀 loadAndRenderAllPacks() chamado');
  
  // Se já temos dados em cache, usar
  if (cachedPacksData) {
    log('📦 Usando dados em cache');
    processPacksData(cachedPacksData);
    return;
  }
  
  // Determinar ficheiro baseado no idioma atual
  const currentLang = (typeof I18n !== 'undefined' && I18n.currentLang) 
    ? I18n.currentLang 
    : (localStorage.getItem('quest4couple_lang') || 'pt-pt');
  
  const langFileMap = {
    'pt-pt': 'packs_data_clean.json',
    'pt-br': 'packs_data_pt-br.json',
    'en': 'packs_data_en.json',
    'es': 'packs_data_es.json',
    'fr': 'packs_data_fr.json'
  };
  
  const jsonFile = langFileMap[currentLang] || 'packs_data_clean.json';
  const fetchPath = `./data/${jsonFile}?v=${Date.now()}`;
  
  fetch(fetchPath)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.json();
    })
    .then(packsData => {
      cachedPacksData = packsData;
      processPacksData(packsData);
    })
    .catch(err => {
      console.error('❌ ERRO ao carregar os packs:', err);
      const mainView = document.getElementById('themesView');
      if (mainView) {
        mainView.innerHTML = `
          <div style="color: red; text-align: center; padding: 20px; background: #fff0f0; border: 1px solid red; border-radius: 8px; max-width: 600px; margin: 20px auto;">
            <h3>❌ Erro ao Carregar Perguntas</h3>
            <p>Não foi possível carregar os questionários.</p>
            <p style="font-size: 0.9em; color: #666;">${err.message}</p>
          </div>`;
        mainView.style.display = 'grid';
      }
    });
}

function processPacksData(packsData) {
  const packConfigs = [
    { id: 'romantico', containerId: 'pack-romantico-questions', color: 'romantico' },
    { id: 'experiencia', containerId: 'pack-experiencia-questions', color: 'experiencia' },
    { id: 'pimentinha', containerId: 'pack-pimentinha-questions', color: 'pimentinha' },
    { id: 'poliamor', containerId: 'pack-poliamor-questions', color: 'poliamor' },
    { id: 'kinks', containerId: 'pack-kinks-questions', color: 'kinks' }
  ];
  
  packConfigs.forEach(config => {
    const packData = packsData.find(p => p.color === config.color);
    if (packData && packData.categories) {
      renderPackQuestionsLazy(config.containerId, config.id, packData.categories);
    }
  });
}

// ✅ OTIMIZAÇÃO: Lazy loading - só renderiza categorias (não questões)
function renderPackQuestionsLazy(containerId, packId, categories) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Usar DocumentFragment para melhor performance
  const fragment = document.createDocumentFragment();
  
  // Reset question counter para este pack
  questionCounters[packId] = 0;
  
  // Carregar perguntas custom
  const customQuestions = typeof getCustomQuestions === 'function' ? getCustomQuestions() : {};
  const customPack = customQuestions[packId] || [];
  
  // ✅ LAZY: Só criar estrutura das categorias, não renderizar questões
  categories.forEach((category, catIndex) => {
    const categoryWrapper = createCategoryWrapper(packId, catIndex, category, categories);
    fragment.appendChild(categoryWrapper);
  });
  
  // Adicionar perguntas personalizadas (se existirem)
  if (customPack.length > 0) {
    const customWrapper = createCustomCategoryWrapper(packId, customPack, categories.length);
    fragment.appendChild(customWrapper);
  }
  
  // Uma única operação DOM
  container.innerHTML = '';
  container.appendChild(fragment);
  
  // Restaurar estados e progresso após renderização
  requestAnimationFrame(() => {
    restoreCategoryStates();
    updateAllCategoriesProgress();
  });
}

// ✅ OTIMIZAÇÃO: Criar wrapper da categoria sem renderizar questões
function createCategoryWrapper(packId, catIndex, category, allCategories) {
  const categoryWrapper = document.createElement('div');
  categoryWrapper.className = 'category-wrapper collapsed';
  categoryWrapper.id = `${packId}-cat-${catIndex}`;
  
  // Calcular question number base para esta categoria
  let baseQuestionNum = 0;
  for (let i = 0; i < catIndex; i++) {
    baseQuestionNum += allCategories[i].questions?.length || 0;
  }
  
  // Armazenar dados para lazy loading
  categoryWrapper.dataset.packId = packId;
  categoryWrapper.dataset.catIndex = catIndex;
  categoryWrapper.dataset.baseQuestion = baseQuestionNum;
  categoryWrapper.dataset.loaded = 'false';
  
  const questionCount = category.questions?.length || 0;
  
  // Título da categoria
  const categoryTitle = document.createElement('h3');
  categoryTitle.className = 'category-title';
  categoryTitle.innerHTML = `
    <span class="category-toggle-icon" style="transform: rotate(-90deg);">▼</span>
    <span class="category-name">${category.name}</span>
    <span class="category-progress-badge">0/${questionCount}</span>
  `;
  
  // Container placeholder para questões (vazio até expandir)
  const questionsContainer = document.createElement('div');
  questionsContainer.className = 'category-questions';
  questionsContainer.dataset.questions = JSON.stringify(category.questions || []);
  
  categoryWrapper.appendChild(categoryTitle);
  categoryWrapper.appendChild(questionsContainer);
  
  return categoryWrapper;
}

// ✅ OTIMIZAÇÃO: Criar wrapper custom sem renderizar questões
function createCustomCategoryWrapper(packId, customPack, totalCategories) {
  const categoryWrapper = document.createElement('div');
  categoryWrapper.className = 'category-wrapper collapsed';
  categoryWrapper.id = `${packId}-cat-custom`;
  categoryWrapper.dataset.packId = packId;
  categoryWrapper.dataset.isCustom = 'true';
  categoryWrapper.dataset.loaded = 'false';
  
  const categoryTitle = document.createElement('h3');
  categoryTitle.className = 'category-title custom-category-title';
  categoryTitle.innerHTML = `
    <span class="category-toggle-icon" style="transform: rotate(-90deg);">▼</span>
    <span class="category-name">✨ Perguntas Personalizadas</span>
    <span class="category-progress-badge">0/${customPack.length}</span>
  `;
  
  const questionsContainer = document.createElement('div');
  questionsContainer.className = 'category-questions';
  questionsContainer.dataset.customQuestions = JSON.stringify(customPack);
  
  categoryWrapper.appendChild(categoryTitle);
  categoryWrapper.appendChild(questionsContainer);
  
  return categoryWrapper;
}

// ✅ OTIMIZAÇÃO: Renderizar questões apenas quando categoria é expandida
function renderCategoryQuestionsIfNeeded(categoryWrapper) {
  if (categoryWrapper.dataset.loaded === 'true') return;
  
  const questionsContainer = categoryWrapper.querySelector('.category-questions');
  if (!questionsContainer) return;
  
  const packId = categoryWrapper.dataset.packId;
  const isCustom = categoryWrapper.dataset.isCustom === 'true';
  
  // Usar DocumentFragment
  const fragment = document.createDocumentFragment();
  
  // Obter traduções uma única vez
  const translations = getTranslations();
  
  if (isCustom) {
    // Renderizar questões custom
    const customQuestions = JSON.parse(questionsContainer.dataset.customQuestions || '[]');
    const baseNum = getBaseQuestionNumber(packId);
    
    customQuestions.forEach((customQ, idx) => {
      const qNum = baseNum + idx + 1;
      const questionDiv = createQuestionElement(packId, qNum, customQ.text, translations, true, customQ.id);
      fragment.appendChild(questionDiv);
    });
  } else {
    // Renderizar questões normais
    const questions = JSON.parse(questionsContainer.dataset.questions || '[]');
    const baseNum = parseInt(categoryWrapper.dataset.baseQuestion || '0');
    
    questions.forEach((questionText, idx) => {
      const qNum = baseNum + idx + 1;
      const questionDiv = createQuestionElement(packId, qNum, questionText, translations, false);
      fragment.appendChild(questionDiv);
    });
  }
  
  questionsContainer.innerHTML = '';
  questionsContainer.appendChild(fragment);
  categoryWrapper.dataset.loaded = 'true';
  
  // Limpar dados armazenados para liberar memória
  delete questionsContainer.dataset.questions;
  delete questionsContainer.dataset.customQuestions;
}

// ✅ OTIMIZAÇÃO: Obter traduções uma única vez
function getTranslations() {
  const t = (key, fallback) => {
    if (typeof I18n !== 'undefined' && I18n.t) {
      const result = I18n.t(key);
      return result !== key ? result : fallback;
    }
    return fallback;
  };
  
  return {
    porfavor: t('answers.porfavor', 'Por favor!'),
    yup: t('answers.yup', 'Yup'),
    meh: t('answers.meh', 'Meh...'),
    talvez: t('answers.talvez', 'Talvez'),
    placeholder: t('answers.commentPlaceholder', '💭 Conta ao teu par porquê... torna o relatório mais rico! (opcional)')
  };
}

// ✅ OTIMIZAÇÃO: Criar elemento de questão (reutilizável)
function createQuestionElement(packId, qNum, questionText, translations, isCustom, customId) {
  const questionDiv = document.createElement('div');
  questionDiv.className = isCustom ? 'question custom-question' : 'question';
  
  const customBadge = isCustom ? `<span class="custom-question-badge">CUSTOM</span>
    <button class="btn-delete-custom" data-pack="${packId}" data-id="${customId}" title="Remover pergunta">🗑️</button>` : '';
  
  questionDiv.innerHTML = `
    <div class="question-row">
      <div class="question-content">
        <div class="question-text"><strong>${qNum}.</strong> ${questionText}${customBadge}</div>
      </div>
      <div class="question-options">
        <div class="option-item">
          <span class="option-label">${translations.porfavor}</span>
          <input type="radio" name="${packId}_q${qNum}" value="porfavor">
        </div>
        <div class="option-item">
          <span class="option-label">${translations.yup}</span>
          <input type="radio" name="${packId}_q${qNum}" value="yup">
        </div>
        <div class="option-item">
          <span class="option-label">${translations.meh}</span>
          <input type="radio" name="${packId}_q${qNum}" value="meh">
        </div>
        <div class="option-item">
          <span class="option-label">${translations.talvez}</span>
          <input type="radio" name="${packId}_q${qNum}" value="talvez">
        </div>
      </div>
    </div>
    <div class="question-comment">
      <textarea name="${packId}_q${qNum}_comment" placeholder="${translations.placeholder}"></textarea>
    </div>
  `;
  
  return questionDiv;
}

// Calcular base question number para custom questions
function getBaseQuestionNumber(packId) {
  const container = document.getElementById(`pack-${packId}-questions`);
  if (!container) return 0;
  
  let total = 0;
  container.querySelectorAll('.category-wrapper:not([data-is-custom])').forEach(wrapper => {
    const questionsContainer = wrapper.querySelector('.category-questions');
    if (questionsContainer) {
      if (wrapper.dataset.loaded === 'true') {
        total += questionsContainer.querySelectorAll('.question').length;
      } else {
        try {
          const questions = JSON.parse(questionsContainer.dataset.questions || '[]');
          total += questions.length;
        } catch(e) {}
      }
    }
  });
  return total;
}

// Função auxiliar para recarregar pack
function loadPackQuestions(packId) {
  cachedPacksData = null;
  loadAndRenderAllPacks();
}

// ========================================
// RESTORE CATEGORY STATES
// ========================================
function restoreCategoryStates() {
  const savedStates = JSON.parse(localStorage.getItem('quest4couple_category_states') || '{}');
  
  Object.keys(savedStates).forEach(categoryId => {
    const isExpanded = savedStates[categoryId];
    const categoryWrapper = document.getElementById(categoryId);
    
    if (categoryWrapper) {
      if (isExpanded) {
        categoryWrapper.classList.add('expanded');
        categoryWrapper.classList.remove('collapsed');
        renderCategoryQuestionsIfNeeded(categoryWrapper);
      } else {
        categoryWrapper.classList.remove('expanded');
        categoryWrapper.classList.add('collapsed');
      }
      
      const icon = categoryWrapper.querySelector('.category-toggle-icon');
      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
      }
    }
  });
}

// ========================================
// TOGGLE PACK CATEGORY (Collapse/Expand)
// ========================================
function togglePackCategory(categoryWrapper) {
  const isExpanded = categoryWrapper.classList.contains('expanded');
  
  if (isExpanded) {
    categoryWrapper.classList.remove('expanded');
    categoryWrapper.classList.add('collapsed');
  } else {
    categoryWrapper.classList.add('expanded');
    categoryWrapper.classList.remove('collapsed');
    renderCategoryQuestionsIfNeeded(categoryWrapper);
  }
  
  const icon = categoryWrapper.querySelector('.category-toggle-icon');
  if (icon) {
    icon.style.transform = isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)';
  }
  
  const categoryId = categoryWrapper.id;
  const savedStates = JSON.parse(localStorage.getItem('quest4couple_category_states') || '{}');
  savedStates[categoryId] = !isExpanded;
  localStorage.setItem('quest4couple_category_states', JSON.stringify(savedStates));
  
  if (!isExpanded) {
    requestAnimationFrame(() => updateCategoryProgress(categoryWrapper));
  }
}

// ========================================
// UPDATE CATEGORY PROGRESS
// ========================================
function updateCategoryProgress(categoryWrapper) {
  const questions = categoryWrapper.querySelectorAll('.question');
  const answered = Array.from(questions).filter(q => 
    q.querySelector('input[type="radio"]:checked')
  ).length;
  
  const commented = Array.from(questions).filter(q => {
    const textarea = q.querySelector('textarea');
    return textarea && textarea.value.trim().length > 0;
  }).length;
  
  const badge = categoryWrapper.querySelector('.category-progress-badge');
  if (badge) {
    const total = questions.length || parseInt(badge.textContent.split('/')[1]) || 0;
    const commentInfo = commented > 0 ? ` 💬${commented}` : '';
    badge.textContent = `${answered}/${total}${commentInfo}`;
    
    const percentage = total > 0 ? (answered / total) * 100 : 0;
    if (percentage === 0) {
      badge.style.background = 'rgba(255, 255, 255, 0.3)';
      badge.style.color = '';
    } else if (percentage === 100) {
      badge.style.background = 'rgba(40, 167, 69, 0.9)';
      badge.style.color = 'white';
    } else {
      badge.style.background = 'rgba(0, 123, 255, 0.8)';
      badge.style.color = 'white';
    }
  }
  
  updateGlobalCommentCounter();
}

// ========================================
// CONTADOR GLOBAL DE COMENTÁRIOS (Debounced)
// ========================================
let commentCounterTimeout = null;
function updateGlobalCommentCounter() {
  if (commentCounterTimeout) clearTimeout(commentCounterTimeout);
  
  commentCounterTimeout = setTimeout(() => {
    const allTextareas = document.querySelectorAll('.question textarea');
    const totalComments = Array.from(allTextareas).filter(t => t.value.trim().length > 0).length;
    const totalQuestions = allTextareas.length;
    
    let globalBadge = document.getElementById('globalCommentBadge');
    
    if (!globalBadge && totalComments > 0) {
      const controlsBottom = document.querySelector('.controls-bottom');
      if (controlsBottom) {
        globalBadge = document.createElement('div');
        globalBadge.id = 'globalCommentBadge';
        globalBadge.style.cssText = `
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.9em;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-left: 10px;
        `;
        controlsBottom.appendChild(globalBadge);
      }
    }
    
    if (globalBadge) {
      if (totalComments === 0) {
        globalBadge.style.display = 'none';
      } else {
        globalBadge.style.display = 'inline-flex';
        const percentage = totalQuestions > 0 ? Math.round((totalComments / totalQuestions) * 100) : 0;
        globalBadge.innerHTML = `💬 ${totalComments} comentários (${percentage}%)`;
        
        if (totalComments >= 10) {
          globalBadge.title = '🌟 Incrível! O vosso relatório vai ser muito rico!';
        } else if (totalComments >= 5) {
          globalBadge.title = '👏 Ótimo! Continuem a partilhar os vossos pensamentos!';
        } else {
          globalBadge.title = '💡 Comentários tornam o relatório mais pessoal!';
        }
      }
    }
  }, 100);
}

// ========================================
// UPDATE ALL CATEGORIES PROGRESS
// ========================================
function updateAllCategoriesProgress() {
  document.querySelectorAll('.category-wrapper').forEach(wrapper => {
    updateCategoryProgress(wrapper);
  });
}

// ========================================
// EVENT DELEGATION para clicks nas categorias
// ========================================
document.addEventListener('click', function(e) {
  const categoryTitle = e.target.closest('.category-title');
  if (categoryTitle) {
    e.preventDefault();
    e.stopPropagation();
    const categoryWrapper = categoryTitle.closest('.category-wrapper');
    if (categoryWrapper && typeof togglePackCategory === 'function') {
      togglePackCategory(categoryWrapper);
    }
    return;
  }
  
  const deleteBtn = e.target.closest('.btn-delete-custom');
  if (deleteBtn) {
    e.preventDefault();
    const packId = deleteBtn.dataset.pack;
    const customId = deleteBtn.dataset.id;
    if (packId && customId && typeof deleteCustomQuestion === 'function') {
      deleteCustomQuestion(packId, customId);
    }
  }
}, { passive: false });

// ========================================
// EXPORTAR FUNÇÕES PARA ESCOPO GLOBAL
// ========================================
window.togglePackCategory = togglePackCategory;
window.updateCategoryProgress = updateCategoryProgress;
window.updateAllCategoriesProgress = updateAllCategoriesProgress;
window.updateGlobalCommentCounter = updateGlobalCommentCounter;
window.restoreCategoryStates = restoreCategoryStates;
window.loadAndRenderAllPacks = loadAndRenderAllPacks;
window.renderCategoryQuestionsIfNeeded = renderCategoryQuestionsIfNeeded;

// ========================================
// LISTENER PARA MUDANÇA DE IDIOMA
// ========================================
document.addEventListener('languageChanged', () => {
  cachedPacksData = null;
  loadAndRenderAllPacks();
});
