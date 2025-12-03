/* ============================================
   QUEST4COUPLE - RENDERING
   Renderização dinâmica de perguntas
   ============================================ */

function loadAndRenderAllPacks() {
  console.log('🚀 loadAndRenderAllPacks() chamado');
  
  // Determinar ficheiro baseado no idioma atual
  const currentLang = (typeof I18n !== 'undefined' && I18n.currentLang) 
    ? I18n.currentLang 
    : (localStorage.getItem('quest4couple_lang') || 'pt-pt');
  
  console.log('🌍 Idioma atual:', currentLang);
  
  // Mapeamento de idioma para ficheiro JSON
  const langFileMap = {
    'pt-pt': 'packs_data_clean.json',
    'pt-br': 'packs_data_pt-br.json',
    'en': 'packs_data_en.json',
    'es': 'packs_data_es.json',
    'fr': 'packs_data_fr.json'
  };
  
  const jsonFile = langFileMap[currentLang] || 'packs_data_clean.json';
  
  // Tentar múltiplos caminhos para o JSON
  const possiblePaths = [
    `./data/${jsonFile}?v=` + Date.now(),
    `data/${jsonFile}?v=` + Date.now(),
    `../data/${jsonFile}?v=` + Date.now()
  ];
  
  let fetchPath = possiblePaths[0];
  console.log('📂 Tentando carregar:', fetchPath);
  
  fetch(fetchPath)
    .then(response => {
      console.log('📥 Response recebida:', response.status, response.statusText);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })    .then(packsData => {
      console.log('✅ JSON parseado com sucesso!');
      console.log('📦 Total de packs:', packsData.length);
      console.log('📦 Packs disponíveis:', packsData.map(p => p.name));
      
      // Usar 'color' para identificar packs (não varia por idioma)
      const packConfigs = [
        { id: 'romantico', containerId: 'pack-romantico-questions', color: 'romantico' },
        { id: 'experiencia', containerId: 'pack-experiencia-questions', color: 'experiencia' },
        { id: 'pimentinha', containerId: 'pack-pimentinha-questions', color: 'pimentinha' },
        { id: 'poliamor', containerId: 'pack-poliamor-questions', color: 'poliamor' },
        { id: 'kinks', containerId: 'pack-kinks-questions', color: 'kinks' }
      ];      packConfigs.forEach(config => {
        console.log(`🔍 Procurando pack com color: "${config.color}"`);
        const packData = packsData.find(p => p.color === config.color);
        if (packData && packData.categories) {
          console.log(`✅ Pack encontrado: ${packData.name} com ${packData.categories.length} categorias`);
          renderPackQuestions(config.containerId, config.id, packData.categories);
        } else {
          console.error(`❌ Pack com color "${config.color}" não encontrado no JSON.`);
        }
      });
      
      console.log('✅ Renderização de todos os packs concluída!');
    })
    .catch(err => {
      console.error('❌ ERRO ao carregar os packs:', err);
      console.error('Stack:', err.stack);
      
      // Tentar mostrar mensagem na UI
      const mainView = document.getElementById('themesView');
      if (mainView) {
        mainView.innerHTML = `
          <div style="color: red; text-align: center; padding: 20px; background: #fff0f0; border: 1px solid red; border-radius: 8px; max-width: 600px; margin: 20px auto;">
            <h3>❌ Erro ao Carregar Perguntas</h3>
            <p>Não foi possível carregar os questionários.</p>
            <p style="font-size: 0.9em; color: #666;">${err.message}</p>
            <p style="font-size: 0.8em; margin-top: 15px;">Verifique se o ficheiro <code>data/packs_data_clean.json</code> existe.</p>
          </div>`;
        mainView.style.display = 'grid';
      }
    });
}

function renderPackQuestions(containerId, packId, categories) {
  console.log(`🎨 renderPackQuestions(${containerId}, ${packId})`);
  
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`❌ Contentor com ID "${containerId}" NÃO foi encontrado!`);
    return;
  }
  
  console.log(`✅ Contentor encontrado:`, container);

  container.innerHTML = '';
  let questionCounter = 0;
  
  console.log(`📂 Total de categorias: ${categories.length}`);
  
  // Carregar perguntas custom
  const customQuestions = getCustomQuestions ? getCustomQuestions() : {};
  const customPack = customQuestions[packId] || [];
  categories.forEach((category, catIndex) => {
    console.log(`  📁 Categoria ${catIndex + 1}: "${category.name}" com ${category.questions ? category.questions.length : 0} perguntas`);
      // Criar wrapper para categoria (para collapse/expand)
    const categoryWrapper = document.createElement('div');
    categoryWrapper.className = 'category-wrapper collapsed'; // ✅ Inicia COLAPSADA
    categoryWrapper.id = `${packId}-cat-${catIndex}`;
      // Título da categoria (clicável)
    const categoryTitle = document.createElement('h3');
    categoryTitle.className = 'category-title';
    categoryTitle.style.cursor = 'pointer';
    categoryTitle.innerHTML = `
      <span class="category-toggle-icon" style="transform: rotate(-90deg);">▼</span>
      <span class="category-name">${category.name}</span>
      <span class="category-progress-badge">0/${category.questions ? category.questions.length : 0}</span>
    `;    // Evento de click no título para toggle
    categoryTitle.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof window.togglePackCategory === 'function') {
        window.togglePackCategory(categoryWrapper);
      } else {
        console.error('❌ togglePackCategory não encontrada!');
      }
    };
      categoryWrapper.appendChild(categoryTitle);
    
    // Container para as perguntas
    const questionsContainer = document.createElement('div');
    questionsContainer.className = 'category-questions';

    if (category.questions && Array.isArray(category.questions)) {
      category.questions.forEach((questionText) => {
        questionCounter++;
        const qNum = questionCounter;
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';

        // Obter traduções das opções de resposta
        const t = (key, fallback) => {
          if (typeof I18n !== 'undefined' && I18n.t) {
            const result = I18n.t(key);
            return result !== key ? result : fallback;
          }
          return fallback;
        };

        const optPorfavor = t('answers.porfavor', 'Por favor!');
        const optYup = t('answers.yup', 'Yup');
        const optMeh = t('answers.meh', 'Meh...');
        const optTalvez = t('answers.talvez', 'Talvez');
        const commentPlaceholder = t('answers.commentPlaceholder', 'Comentários (opcional)');

        questionDiv.innerHTML = `
          <div class="question-row">
            <div class="question-content">
              <div class="question-text"><strong>${qNum}.</strong> ${questionText}</div>
            </div>
            <div class="question-options">
              <div class="option-item">
                <span class="option-label">${optPorfavor}</span>
                <input type="radio" name="${packId}_q${qNum}" value="porfavor">
              </div>
              <div class="option-item">
                <span class="option-label">${optYup}</span>
                <input type="radio" name="${packId}_q${qNum}" value="yup">
              </div>
              <div class="option-item">
                <span class="option-label">${optMeh}</span>
                <input type="radio" name="${packId}_q${qNum}" value="meh">
              </div>
              <div class="option-item">
                <span class="option-label">${optTalvez}</span>
                <input type="radio" name="${packId}_q${qNum}" value="talvez">
              </div>
            </div>
          </div>          <div class="question-comment">
            <textarea name="${packId}_q${qNum}_comment" placeholder="${commentPlaceholder}"></textarea>
          </div>        `;
          questionsContainer.appendChild(questionDiv);
      });
    }
      // Adicionar container de perguntas ao wrapper
    categoryWrapper.appendChild(questionsContainer);
      // Adicionar wrapper ao container principal
    container.appendChild(categoryWrapper);
  });
    // Adicionar perguntas personalizadas
  if (customPack.length > 0) {    // Criar wrapper para categoria custom
    const customCategoryWrapper = document.createElement('div');
    customCategoryWrapper.className = 'category-wrapper collapsed'; // ✅ Inicia COLAPSADA
    customCategoryWrapper.id = `${packId}-cat-custom`;
    
    const customCategoryTitle = document.createElement('h3');
    customCategoryTitle.className = 'category-title custom-category-title';
    customCategoryTitle.style.cursor = 'pointer';
    customCategoryTitle.innerHTML = `
      <span class="category-toggle-icon" style="transform: rotate(-90deg);">▼</span>
      <span class="category-name">✨ Perguntas Personalizadas</span>
      <span class="category-progress-badge">0/${customPack.length}</span>
    `;    // Evento de click no título para toggle
    customCategoryTitle.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof window.togglePackCategory === 'function') {
        window.togglePackCategory(customCategoryWrapper);
      }
    };
    
    customCategoryWrapper.appendChild(customCategoryTitle);
    
    // Container para as perguntas custom
    const customQuestionsContainer = document.createElement('div');
    customQuestionsContainer.className = 'category-questions';
    
    customPack.forEach((customQ) => {
      questionCounter++;
      const qNum = questionCounter;
      const questionDiv = document.createElement('div');
      questionDiv.className = 'question custom-question';

      // Obter traduções das opções de resposta
      const t = (key, fallback) => {
        if (typeof I18n !== 'undefined' && I18n.t) {
          const result = I18n.t(key);
          return result !== key ? result : fallback;
        }
        return fallback;
      };

      const optPorfavor = t('answers.porfavor', 'Por favor!');
      const optYup = t('answers.yup', 'Yup');
      const optMeh = t('answers.meh', 'Meh...');
      const optTalvez = t('answers.talvez', 'Talvez');
      const commentPlaceholder = t('answers.commentPlaceholder', 'Comentários (opcional)');
      
      questionDiv.innerHTML = `
        <div class="question-row">
          <div class="question-content">
            <div class="question-text">
              <strong>${qNum}.</strong> ${customQ.text}
              <span class="custom-question-badge">CUSTOM</span>
              <button class="btn-delete-custom" onclick="deleteCustomQuestion('${packId}', '${customQ.id}')" title="Remover pergunta">🗑️</button>
            </div>
          </div>
          <div class="question-options">
            <div class="option-item">
              <span class="option-label">${optPorfavor}</span>
              <input type="radio" name="${packId}_q${qNum}" value="porfavor">
            </div>
            <div class="option-item">
              <span class="option-label">${optYup}</span>
              <input type="radio" name="${packId}_q${qNum}" value="yup">
            </div>
            <div class="option-item">
              <span class="option-label">${optMeh}</span>
              <input type="radio" name="${packId}_q${qNum}" value="meh">
            </div>
            <div class="option-item">
              <span class="option-label">${optTalvez}</span>
              <input type="radio" name="${packId}_q${qNum}" value="talvez">
            </div>
          </div>
        </div>        <div class="question-comment">
          <textarea name="${packId}_q${qNum}_comment" placeholder="${commentPlaceholder}"></textarea>
        </div>`;
      
      customQuestionsContainer.appendChild(questionDiv);
    });
    
    // Adicionar container de perguntas ao wrapper
    customCategoryWrapper.appendChild(customQuestionsContainer);
    
    // Adicionar wrapper ao container principal
    container.appendChild(customCategoryWrapper);
  }
    console.log(`✅ ${questionCounter} perguntas renderizadas no contentor ${containerId} (incluindo ${customPack.length} custom)`);
  console.log(`📏 HTML length: ${container.innerHTML.length} characters`);
  
  // Restaurar estados salvos das categorias (expandido/colapsado)
  setTimeout(() => {
    restoreCategoryStates();
    updateAllCategoriesProgress();
  }, 100);
}

// Função auxiliar para recarregar pack
function loadPackQuestions(packId) {
  loadAndRenderAllPacks();
}

// ========================================
// RESTORE CATEGORY STATES (ao carregar página)
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
      } else {
        categoryWrapper.classList.remove('expanded');
        categoryWrapper.classList.add('collapsed');
      }
      
      // Atualizar ícone
      const icon = categoryWrapper.querySelector('.category-toggle-icon');
      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
      }
    }
  });
  
  console.log('✅ Estados das categorias restaurados');
}

// ========================================
// TOGGLE PACK CATEGORY (Collapse/Expand Subcategorias nos Questionários)
// ========================================
function togglePackCategory(categoryWrapper) {
  const isExpanded = categoryWrapper.classList.contains('expanded');
    if (isExpanded) {
    categoryWrapper.classList.remove('expanded');
    categoryWrapper.classList.add('collapsed');
  } else {
    categoryWrapper.classList.add('expanded');
    categoryWrapper.classList.remove('collapsed');
  }
  
  // Atualizar ícone
  const icon = categoryWrapper.querySelector('.category-toggle-icon');
  if (icon) {
    icon.style.transform = isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)';
  }
  
  // Salvar estado no localStorage
  const categoryId = categoryWrapper.id;
  const savedStates = JSON.parse(localStorage.getItem('quest4couple_category_states') || '{}');
  savedStates[categoryId] = !isExpanded;
  localStorage.setItem('quest4couple_category_states', JSON.stringify(savedStates));
}

// ========================================
// UPDATE CATEGORY PROGRESS
// ========================================
function updateCategoryProgress(categoryWrapper) {
  const questions = categoryWrapper.querySelectorAll('.question');
  const answered = Array.from(questions).filter(q => 
    q.querySelector('input[type="radio"]:checked')
  ).length;
  
  const badge = categoryWrapper.querySelector('.category-progress-badge');
  if (badge) {
    badge.textContent = `${answered}/${questions.length}`;
    
    // Mudar cor baseado no progresso
    const percentage = questions.length > 0 ? (answered / questions.length) * 100 : 0;
    if (percentage === 0) {
      badge.style.background = 'rgba(255, 255, 255, 0.3)';
    } else if (percentage === 100) {
      badge.style.background = 'rgba(40, 167, 69, 0.9)';
      badge.style.color = 'white';
    } else {
      badge.style.background = 'rgba(0, 123, 255, 0.8)';
      badge.style.color = 'white';
    }
  }
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
// EXPORTAR FUNÇÕES PARA ESCOPO GLOBAL
// ========================================
window.togglePackCategory = togglePackCategory;
window.updateCategoryProgress = updateCategoryProgress;
window.updateAllCategoriesProgress = updateAllCategoriesProgress;
window.restoreCategoryStates = restoreCategoryStates;

console.log('✅ Funções de collapse/expand exportadas para escopo global');
console.log('   - togglePackCategory:', typeof window.togglePackCategory);
console.log('   - updateCategoryProgress:', typeof window.updateCategoryProgress);
console.log('   - updateAllCategoriesProgress:', typeof window.updateAllCategoriesProgress);
console.log('   - restoreCategoryStates:', typeof window.restoreCategoryStates);

// ========================================
// LISTENER PARA MUDANÇA DE IDIOMA
// ========================================
document.addEventListener('languageChanged', (event) => {
  console.log('🌍 Idioma alterado para:', event.detail.lang);
  console.log('🔄 Recarregando questões no novo idioma...');
  
  // Recarregar questões com o novo idioma
  loadAndRenderAllPacks();
});

console.log('✅ Listener de mudança de idioma configurado');
