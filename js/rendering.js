/* ============================================
   QUEST4COUPLE - RENDERING
   Renderização dinâmica de perguntas
   ============================================ */

function loadAndRenderAllPacks() {
  console.log('🚀 loadAndRenderAllPacks() chamado');
  
  // Tentar múltiplos caminhos para o JSON
  const possiblePaths = [
    './data/packs_data_clean.json?v=' + Date.now(),
    'data/packs_data_clean.json?v=' + Date.now(),
    '../data/packs_data_clean.json?v=' + Date.now()
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
    })
    .then(packsData => {
      console.log('✅ JSON parseado com sucesso!');
      console.log('📦 Total de packs:', packsData.length);
      console.log('📦 Packs disponíveis:', packsData.map(p => p.name));
      
      const packConfigs = [
        { id: 'romantico', containerId: 'pack-romantico-questions', name: 'Pack Romântico' },
        { id: 'experiencia', containerId: 'pack-experiencia-questions', name: 'Exploração e Aventura a Dois' },
        { id: 'pimentinha', containerId: 'pack-pimentinha-questions', name: 'Pimentinha' },
        { id: 'poliamor', containerId: 'pack-poliamor-questions', name: 'Poliamor' },
        { id: 'kinks', containerId: 'pack-kinks-questions', name: 'Fetiches' }
      ];

      packConfigs.forEach(config => {
        console.log(`🔍 Procurando pack: "${config.name}"`);
        const packData = packsData.find(p => p.name === config.name);
        if (packData && packData.categories) {
          console.log(`✅ Pack encontrado: ${config.name} com ${packData.categories.length} categorias`);
          renderPackQuestions(config.containerId, config.id, packData.categories);
        } else {
          console.error(`❌ Categorias do pack "${config.name}" não encontradas no JSON.`);
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

        questionDiv.innerHTML = `
          <div class="question-row">
            <div class="question-content">
              <div class="question-text"><strong>${qNum}.</strong> ${questionText}</div>
            </div>
            <div class="question-options">
              <div class="option-item">
                <span class="option-label">Por favor!</span>
                <input type="radio" name="${packId}_q${qNum}" value="porfavor">
              </div>
              <div class="option-item">
                <span class="option-label">Yup</span>
                <input type="radio" name="${packId}_q${qNum}" value="yup">
              </div>
              <div class="option-item">
                <span class="option-label">Meh...</span>
                <input type="radio" name="${packId}_q${qNum}" value="meh">
              </div>
              <div class="option-item">
                <span class="option-label">Talvez</span>
                <input type="radio" name="${packId}_q${qNum}" value="talvez">
              </div>
            </div>
          </div>          <div class="question-comment">
            <textarea name="${packId}_q${qNum}_comment" placeholder="Comentários (opcional)"></textarea>
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
              <span class="option-label">Por favor!</span>
              <input type="radio" name="${packId}_q${qNum}" value="porfavor">
            </div>
            <div class="option-item">
              <span class="option-label">Yup</span>
              <input type="radio" name="${packId}_q${qNum}" value="yup">
            </div>
            <div class="option-item">
              <span class="option-label">Meh...</span>
              <input type="radio" name="${packId}_q${qNum}" value="meh">
            </div>
            <div class="option-item">
              <span class="option-label">Talvez</span>
              <input type="radio" name="${packId}_q${qNum}" value="talvez">
            </div>
          </div>
        </div>        <div class="question-comment">
          <textarea name="${packId}_q${qNum}_comment" placeholder="Comentários (opcional)"></textarea>
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
