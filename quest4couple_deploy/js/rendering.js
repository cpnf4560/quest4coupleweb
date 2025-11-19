/* ============================================
   QUEST4COUPLE - RENDERING
   Renderização dinâmica de perguntas
   ============================================ */

function loadAndRenderAllPacks() {
  console.log('🚀 loadAndRenderAllPacks() chamado');
  
  // Tentar múltiplos caminhos para o JSON
  const possiblePaths = [
    './data/packs_data_clean.json',
    'data/packs_data_clean.json',
    '../data/packs_data_clean.json'
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
    
    // Título da categoria
    const categoryTitle = document.createElement('h3');
    categoryTitle.className = 'category-title';
    categoryTitle.textContent = category.name;
    container.appendChild(categoryTitle);

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
          </div>
          <div class="question-comment">
            <textarea name="${packId}_q${qNum}_comment" placeholder="Comentários (opcional)"></textarea>
          </div>        `;
          container.appendChild(questionDiv);
      });
    }
  });
  
  // Adicionar perguntas personalizadas
  if (customPack.length > 0) {
    const customCategoryTitle = document.createElement('h3');
    customCategoryTitle.className = 'category-title custom-category-title';
    customCategoryTitle.innerHTML = '✨ Perguntas Personalizadas';
    container.appendChild(customCategoryTitle);
    
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
        </div>
        <div class="question-comment">
          <textarea name="${packId}_q${qNum}_comment" placeholder="Comentários (opcional)"></textarea>
        </div>`;
      
      container.appendChild(questionDiv);
    });
  }
  
  console.log(`✅ ${questionCounter} perguntas renderizadas no contentor ${containerId} (incluindo ${customPack.length} custom)`);
  console.log(`📏 HTML length: ${container.innerHTML.length} characters`);
}

// Função auxiliar para recarregar pack
function loadPackQuestions(packId) {
  loadAndRenderAllPacks();
}
