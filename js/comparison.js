/* ============================================
   QUEST4COUPLE - COMPARISON
   Sistema de comparação de respostas
   ============================================ */

async function compareEncryptedAnswers() {
  console.log('🎯 compareEncryptedAnswers() chamada!');
  
  const myFileInput = document.getElementById('myFile');
  const partnerFileInput = document.getElementById('partnerFile');
  const securityCodeInput = document.getElementById('securityCode');
  const reportContainer = document.getElementById('compatibilityReport');

  console.log('📋 Elementos encontrados:', {
    myFileInput: !!myFileInput,
    partnerFileInput: !!partnerFileInput,
    securityCodeInput: !!securityCodeInput,
    reportContainer: !!reportContainer
  });

  console.log('📁 Ficheiros carregados:', {
    myFile: myFileInput?.files[0]?.name,
    partnerFile: partnerFileInput?.files[0]?.name,
    hasCode: !!securityCodeInput?.value
  });

  if (!myFileInput.files[0] || !partnerFileInput.files[0] || !securityCodeInput.value) {
    console.error('❌ Validação falhou!');
    alert("Por favor, carregue ambos os ficheiros e introduza o código de segurança.");
    return;
  }
  
  console.log('✅ Validação passou! A processar ficheiros...');
  
  try {
    const myFileContent = await myFileInput.files[0].text();
    const partnerFileContent = await partnerFileInput.files[0].text();

    // Limpar possíveis BOM ou whitespace
    const myClean = myFileContent.trim();
    const partnerClean = partnerFileContent.trim();

    // Desencriptar
    const myDecrypted = CryptoJS.AES.decrypt(myClean, securityCodeInput.value);
    const partnerDecrypted = CryptoJS.AES.decrypt(partnerClean, securityCodeInput.value);

    // Converter para string UTF-8 com validação
    let myDecryptedStr = '';
    let partnerDecryptedStr = '';
    
    try {
      myDecryptedStr = myDecrypted.toString(CryptoJS.enc.Utf8);
      partnerDecryptedStr = partnerDecrypted.toString(CryptoJS.enc.Utf8);
    } catch (utf8Error) {
      throw new Error("Erro ao desencriptar. Código de segurança incorreto ou ficheiro corrompido.");
    }

    if (!myDecryptedStr || !partnerDecryptedStr || myDecryptedStr.length === 0 || partnerDecryptedStr.length === 0) {
      throw new Error("Código de segurança incorreto. Por favor, verifique o código.");
    }

    const myData = JSON.parse(myDecryptedStr);
    const partnerData = JSON.parse(partnerDecryptedStr);

    generateCompatibilityReport(myData, partnerData);
  } catch (error) {
    console.error("Erro ao comparar:", error);
    
    let errorMessage = "Não foi possível comparar os ficheiros.";
    
    if (error.message.includes("Código de segurança") || error.message.includes("desencriptar")) {
      errorMessage = "❌ <strong>Código de segurança incorreto!</strong><br>Por favor, verifique o código que utilizou ao guardar os ficheiros.";
    } else if (error.message.includes("JSON")) {
      errorMessage = "❌ <strong>Ficheiro corrompido!</strong><br>O ficheiro .q4c parece estar danificado. Tente gerar um novo.";
    } else if (error.message.includes("UTF-8") || error.message.includes("Malformed")) {
      errorMessage = "❌ <strong>Erro de codificação!</strong><br>O ficheiro não está no formato correto. Certifique-se de que é um ficheiro .q4c válido.";
    }
    
    reportContainer.innerHTML = `
      <div style="max-width: 600px; margin: 40px auto; padding: 30px; background: #fff3cd; border-left: 5px solid #ffc107; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div style="font-size: 2.5em; text-align: center; margin-bottom: 15px;">⚠️</div>
        <div style="color: #856404; text-align: center; line-height: 1.6;">
          ${errorMessage}
        </div>
        <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 8px; font-size: 0.9em; color: #6c757d;">
          <strong style="color: #495057;">💡 Dicas:</strong>
          <ul style="margin: 10px 0 0 20px; line-height: 1.8;">
            <li>Ambos devem usar o <strong>mesmo código de segurança</strong></li>
            <li>Verifique se os ficheiros têm extensão <strong>.q4c</strong></li>
            <li>Não abra ou edite os ficheiros manualmente</li>
            <li>Se o erro persistir, gere novos ficheiros</li>
          </ul>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <button onclick="location.reload()" style="padding: 12px 25px; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1em;">
            🔄 Tentar Novamente
          </button>
        </div>
      </div>`;
    reportContainer.style.display = 'block';
  }
}

async function generateCompatibilityReport(myData, partnerData) {
  const reportContainer = document.getElementById('compatibilityReport');
  let html = `
    <h2 style="text-align: center; font-size: 2em; color: #495057; margin: 20px 0;">💖 Relatório de Compatibilidade entre ${myData.userName} e ${partnerData.userName}</h2>
    
    <!-- Explicação sobre Invert Matching -->
    <div style="background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); border-left: 5px solid #667eea; padding: 20px; border-radius: 12px; margin: 20px 0 30px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; align-items: flex-start; gap: 15px;">
        <div style="font-size: 2.5em; min-width: 50px; text-align: center;">🔄</div>
        <div style="flex: 1;">
          <h3 style="color: #667eea; margin: 0 0 10px 0; font-size: 1.3em;">💡 Como Interpretar o Relatório</h3>
          <p style="color: #495057; margin: 0 0 12px 0; line-height: 1.6;">
            Este relatório usa <strong>matching inteligente</strong> que reconhece perguntas complementares.
          </p>
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 12px;">
            <strong style="color: #667eea;">🔄 Matching Invertido</strong>
            <p style="margin: 8px 0 0 0; color: #6c757d; line-height: 1.6;">
              Algumas perguntas têm dinâmicas de <strong>dar ↔️ receber</strong> ou <strong>ativo ↔️ passivo</strong>:<br>
              • <em>"Dominar o/a parceiro/a"</em> combina com <em>"Ser dominado/a"</em><br>
              • <em>"Dar prazer anal"</em> combina com <em>"Receber prazer anal"</em><br>
              • <em>"Assistir o/a parceiro/a"</em> combina com <em>"Ser assistido/a"</em>
            </p>
          </div>
          <div style="display: flex; gap: 20px; font-size: 0.9em; color: #6c757d; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="background: #e8f5e9; color: #2e7d32; padding: 3px 8px; border-radius: 4px; font-weight: 600;">DAR</span>
              <span>↔️</span>
              <span style="background: #fff3e0; color: #e65100; padding: 3px 8px; border-radius: 4px; font-weight: 600;">RECEBER</span>
              <span>= Match perfeito!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const allPacksResponse = await fetch('data/packs_data_clean.json?v=' + Date.now());
  const allPacksData = await allPacksResponse.json();
  const packConfigs = [
    { id: 'romantico', name: 'Pack Romântico', color: '#f082a9' },
    { id: 'experiencia', name: 'Exploração e Aventura a Dois', color: '#006c80' },
    { id: 'pimentinha', name: 'Pimentinha', color: '#ff6b6b' },
    { id: 'poliamor', name: 'Poliamor', color: '#6f42c1' },
    { id: 'kinks', name: 'Fetiches', color: '#1a1a1a' }
  ];
  
  let totalMatches = 0;
  let totalQuestions = 0;
  packConfigs.forEach(config => {
    const packData = allPacksData.find(p => p.name === config.name);
    if (!packData || !packData.categories) return;

    // Achatar as perguntas
    let packQuestions = packData.categories.flatMap(cat => cat.questions);
    
    // Adicionar perguntas custom se existirem
    const myCustom = myData.customQuestions ? myData.customQuestions[config.id] : [];
    const partnerCustom = partnerData.customQuestions ? partnerData.customQuestions[config.id] : [];
    const allCustom = [...(myCustom || []), ...(partnerCustom || [])];
    
    // Remover duplicados de custom questions
    const uniqueCustom = allCustom.filter((q, index, self) => 
      index === self.findIndex(t => t.id === q.id)
    );
    
    // Adicionar custom questions ao array
    packQuestions = [...packQuestions, ...uniqueCustom.map(q => q.text)];

    const myAnswers = myData.answers[config.id] || {};
    const partnerAnswers = partnerData.answers[config.id] || {};
    const commonQuestions = { ...myAnswers, ...partnerAnswers };    if (Object.keys(commonQuestions).length > 0) {
      html += `
        <div class="pack ${config.id}" data-pack-color="${config.color}" style="display:block; margin: 15px 0;">
          <h2 style="font-size: 1.5em; color: #495057; padding: 12px 15px; background: linear-gradient(to right, #f8f9fa, white); border-left: 4px solid ${config.color}; border-radius: 8px; margin-bottom: 15px;">${config.name}</h2>
          <div class="pack-content">`;// Separar questões por categoria
      const superMatches = [];
      const matches = [];
      const reflectionNeeded = [];
      const maybeExplore = [];

      Object.keys(commonQuestions).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1))).forEach(qKey => {
        const qIndex = parseInt(qKey.replace('q', '')) - 1;
        const questionText = packQuestions[qIndex];
        if (questionText === undefined) return;

        const myAns = myAnswers[qKey];
        const partnerAns = partnerAnswers[qKey];

        // VERIFICAR SE É PERGUNTA COM INVERT MATCHING
        let partnerAnswerToCompare = partnerAns;
        let isInverted = false;
        let invertInfo = null;

        if (window.invertMatchingConfig && typeof getInvertPair === 'function') {
          invertInfo = getInvertPair(config.id, questionText);
          
          if (invertInfo) {
            isInverted = true;
            // Buscar resposta da pergunta PAR do parceiro
            const pairQIndex = packQuestions.findIndex(q => q === invertInfo.pairQuestion);
            if (pairQIndex !== -1) {
              const pairQKey = `q${pairQIndex + 1}`;
              partnerAnswerToCompare = partnerAnswers[pairQKey];
            }          }
        }
        
        // ============================================
        // MATRIZ DE COMPATIBILIDADE (baseada no tutorial.html)
        // ============================================
        
        const my = myAns?.answer;
        const partner = partnerAnswerToCompare?.answer;
        
        // REGRA 1: Ambos Meh = NÃO aparece E NÃO conta nas estatísticas
        if (my === 'meh' && partner === 'meh') {
          return; // Ignorar completamente
        }
        
        // REGRA 2: Yup + Meh OU Talvez + Meh = OCULTO (não aparece, mas não conta)
        if ((my === 'yup' && partner === 'meh') || (my === 'meh' && partner === 'yup') ||
            (my === 'talvez' && partner === 'meh') || (my === 'meh' && partner === 'talvez')) {
          return; // Não mostrar
        }
        
        // A partir daqui, TODAS as combinações contam para as estatísticas
        totalQuestions++;
        
        // ⭐ SUPER MATCH: Por favor! + Por favor!
        if (my === 'porfavor' && partner === 'porfavor') {
          superMatches.push({
            qIndex,
            questionText,
            myAns,
            partnerAns: partnerAnswerToCompare,
            resultText: '⭐ SUPER MATCH',
            compatibilityClass: 'super-match',
            isInverted,
            invertInfo
          });
          totalMatches++;
          return;
        }
        
        // ✨ EXCELENTE: Por favor! + Yup
        if ((my === 'porfavor' && partner === 'yup') || (my === 'yup' && partner === 'porfavor')) {
          matches.push({
            qIndex,
            questionText,
            myAns,
            partnerAns: partnerAnswerToCompare,
            resultText: '✨ EXCELENTE',
            compatibilityClass: 'excellent',
            isInverted,
            invertInfo
          });
          totalMatches++;
          return;
        }
        
        // 💚 BOM MATCH: Yup + Yup
        if (my === 'yup' && partner === 'yup') {
          matches.push({
            qIndex,
            questionText,
            myAns,
            partnerAns: partnerAnswerToCompare,
            resultText: '💚 BOM MATCH',
            compatibilityClass: 'good-match',
            isInverted,
            invertInfo
          });
          totalMatches++;
          return;
        }
        
        // 🤔 POSSÍVEL: Por favor!/Yup + Talvez OU Talvez + Talvez
        if ((my === 'porfavor' && partner === 'talvez') || (my === 'talvez' && partner === 'porfavor') ||
            (my === 'yup' && partner === 'talvez') || (my === 'talvez' && partner === 'yup') ||
            (my === 'talvez' && partner === 'talvez')) {
          maybeExplore.push({
            qIndex,
            questionText,
            myAns,
            partnerAns: partnerAnswerToCompare,
            resultText: '🤔 POSSÍVEL',
            compatibilityClass: 'possible',
            isInverted,
            invertInfo
          });
          totalMatches++;
          return;
        }
        
        // 😐 NEUTRO: Por favor! + Meh (aparece para reflexão)
        if ((my === 'porfavor' && partner === 'meh') || (my === 'meh' && partner === 'porfavor')) {
          reflectionNeeded.push({
            qIndex,
            questionText,
            myAns,
            partnerAns: partnerAnswerToCompare,
            resultText: '😐 NEUTRO - Vale conversar',
            compatibilityClass: 'neutral',
            isInverted,
            invertInfo
          });
          // NÃO incrementa totalMatches (neutro não é match positivo)
          return;
        }
      });      // Renderizar por categorias
      const renderCategory = (title, items, icon, categoryId) => {
        if (items.length === 0) return '';
        
        let categoryHtml = `<div class="compatibility-category" data-category="${categoryId}">
          <h3 onclick="toggleCategory('${categoryId}')" style="cursor: pointer; user-select: none;">
            <span class="category-toggle">▼</span>
            ${icon} ${title} (${items.length})
          </h3>
          <div class="category-content">`;
        
        items.forEach(item => {          if (item.isInverted && item.invertInfo) {
            // RENDERIZAÇÃO COM INVERT MATCHING - FORMATO DESTACADO
            const giverLabel = item.invertInfo.isGiver 
              ? `<span class="invert-label giver" style="background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.8em; display: inline-block;">✋ DAR</span>`
              : `<span class="invert-label receiver" style="background: #fff3e0; color: #e65100; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.8em; display: inline-block;">👐 RECEBER</span>`;

            const partnerLabel = item.invertInfo.isGiver
              ? `<span class="invert-label receiver" style="background: #fff3e0; color: #e65100; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.8em; display: inline-block;">👐 RECEBER</span>`
              : `<span class="invert-label giver" style="background: #e8f5e9; color: #2e7d32; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 0.8em; display: inline-block;">✋ DAR</span>`;

            categoryHtml += `
              <div class="compatibility-section ${item.compatibilityClass} inverted" style="background: linear-gradient(to right, #f9fbe7, #fff8e1); border-left: 5px solid #667eea !important; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);">
                <div style="grid-column: 1 / -1; padding: 15px;">
                  <!-- Badge de Matching Invertido -->
                  <div style="display: inline-flex; align-items: center; gap: 8px; background: #667eea; color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.85em; font-weight: 700; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);">
                    <span style="font-size: 1.2em;">🔄</span>
                    MATCHING INVERTIDO
                  </div>
                  
                  <!-- Pergunta -->
                  <p class="question-text" style="margin-bottom: 10px; font-size: 1.05em;">
                    <strong>${item.qIndex + 1}. ${item.questionText}</strong>
                  </p>
                  
                  <!-- Tipo de Match -->
                  <span class="match-type" style="font-size: 1em; padding: 6px 14px;">${item.resultText}</span>
                  
                  <!-- Container Invert com Setas -->
                  <div style="display: grid; grid-template-columns: auto 1fr auto 1fr auto; gap: 15px; align-items: center; margin-top: 15px; padding: 15px; background: white; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">
                    <!-- User 1 -->
                    ${giverLabel}
                    <div>
                      <span class="user-name" style="display: block; margin-bottom: 6px;">${myData.userName}</span>
                      <span class="answer-badge ${item.myAns.answer}" style="font-size: 0.95em;">${getAnswerText(item.myAns.answer)}</span>
                      ${item.myAns?.comment ? `<div><small style="color: #6c757d; font-style: italic; display: block; margin-top: 4px;">"${item.myAns.comment}"</small></div>` : ''}
                    </div>
                    
                    <!-- Seta -->
                    <div style="text-align: center; font-size: 1.8em; color: #667eea;">↔️</div>
                    
                    <!-- Parceiro -->
                    <div>
                      <span class="user-name" style="display: block; margin-bottom: 6px;">${partnerData.userName}</span>
                      <span class="answer-badge ${item.partnerAns.answer}" style="font-size: 0.95em;">${getAnswerText(item.partnerAns.answer)}</span>
                      ${item.partnerAns?.comment ? `<div><small style="color: #6c757d; font-style: italic; display: block; margin-top: 4px;">"${item.partnerAns.comment}"</small></div>` : ''}
                    </div>
                    ${partnerLabel}
                  </div>
                  
                  <!-- Descrição da Dinâmica -->
                  <div style="margin-top: 12px; padding: 10px 15px; background: #e3f2fd; border-left: 3px solid #2196f3; border-radius: 6px; color: #1565c0; font-size: 0.9em; line-height: 1.5;">
                    <strong>💡 Dinâmica:</strong> ${item.invertInfo.description}
                  </div>
                </div>
              </div>`;
          } else {
            // RENDERIZAÇÃO NORMAL - FORMATO TABELA COMPACTO
            categoryHtml += `
              <div class="compatibility-section ${item.compatibilityClass}">
                <!-- Coluna 1: Questão -->
                <p class="question-text">${item.qIndex + 1}. ${item.questionText}</p>
                
                <!-- Coluna 2: Tipo de Match -->
                <span class="match-type">${item.resultText}</span>
                
                <!-- Coluna 3: User 1 -->
                <div class="user-answer">
                  <span class="user-name">${myData.userName}</span>
                  <span class="answer-badge ${item.myAns?.answer}">${item.myAns ? getAnswerText(item.myAns.answer) : 'Não respondeu'}</span>
                  ${item.myAns?.comment ? `<small style="color: #6c757d; font-style: italic;">"${item.myAns.comment}"</small>` : ''}
                </div>
                
                <!-- Coluna 4: User 2 -->
                <div class="user-answer">
                  <span class="user-name">${partnerData.userName}</span>
                  <span class="answer-badge ${item.partnerAns?.answer}">${item.partnerAns ? getAnswerText(item.partnerAns.answer) : 'Não respondeu'}</span>
                  ${item.partnerAns?.comment ? `<small style="color: #6c757d; font-style: italic;">"${item.partnerAns.comment}"</small>` : ''}
                </div>
              </div>`;
          }
        });
        
        categoryHtml += `</div></div>`; // Fecha category-content e compatibility-category
        return categoryHtml;
      };      // Ordem de prioridade no relatório (baseada na matriz do tutorial)
      html += renderCategory('⭐ Super Matches', superMatches, '⭐', 'super-matches');
      html += renderCategory('💚 Excelentes & Bons Matches', matches, '💚', 'excellent-matches');
      html += renderCategory('🤔 Possíveis', maybeExplore, '🤔', 'possible-matches');
      html += renderCategory('💭 Para Conversar', reflectionNeeded, '💭', 'reflection-matches');
      
      html += `</div></div>`;
    }
  });
  // Calcular percentagem de compatibilidade
  // totalMatches inclui: Super Match, Excelente, Bom Match, Possível (não inclui Neutro)
  const percentage = totalQuestions > 0 ? ((totalMatches / totalQuestions) * 100).toFixed(1) : 0;
  
  // Determinar emoji e mensagem baseado na percentagem
  let emoji = '💕';
  let message = 'Vocês têm química!';
  
  if (percentage >= 80) {
    emoji = '🔥';
    message = 'Compatibilidade INCRÍVEL!';
  } else if (percentage >= 60) {
    emoji = '💖';
    message = 'Excelente compatibilidade!';
  } else if (percentage >= 40) {
    emoji = '💚';
    message = 'Boa compatibilidade!';
  } else if (percentage >= 20) {
    emoji = '💛';
    message = 'Há potencial para explorar!';
  }
    html = `
    <div style="max-width: 600px; margin: 0 auto 25px; padding: 25px; background: white; border-radius: 12px; box-shadow: 0 2px 15px rgba(0,0,0,0.1); border-top: 5px solid #667eea;">
      <div style="text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 15px;">
          <span style="font-size: 2em;">${emoji}</span>
          <div>
            <h2 style="font-size: 1.5em; color: #495057; margin: 0;">${myData.userName} ❤️ ${partnerData.userName}</h2>
            <p style="color: #6c757d; font-size: 0.9em; margin: 5px 0 0 0;">Relatório de Compatibilidade</p>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px; margin: 15px 0;">
          <div>
            <div style="font-size: 2.5em; font-weight: 700; color: #667eea; margin-bottom: 5px;">${percentage}%</div>
            <p style="font-size: 0.95em; color: #495057; font-weight: 600; margin: 0;">${message}</p>
          </div>
        </div>
        
        <p style="color: #6c757d; font-size: 0.9em; margin: 12px 0 0 0;">
          ${totalMatches} matches positivos em ${totalQuestions} questões
        </p>
          <div style="margin-top: 15px; padding: 12px; background: #e7f1ff; border-left: 3px solid #667eea; border-radius: 6px; font-size: 0.85em; color: #495057; text-align: left;">
          💡 Questões onde ambos responderam "Meh" não aparecem (privacidade)
        </div>
        
        <!-- Botão Expandir/Minimizar Tudo -->
        <button id="toggleAllBtn" onclick="toggleAllCategories()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.9em; transition: all 0.3s; width: 100%;">
          📂 Minimizar Tudo
        </button>
      </div>
    </div>
  ` + html;

  reportContainer.innerHTML = html;
  reportContainer.style.display = 'block';
  window.scrollTo({ top: reportContainer.offsetTop - 100, behavior: 'smooth' });
}

function getAnswerText(value) {
  const answers = {
    'porfavor': '💖 Por favor!',
    'yup': '👍 Yup',
    'meh': '😐 Meh...',
    'talvez': '🤷 Talvez'
  };
  return answers[value] || value;
}

/* ============================================
   EXPAND/COLLAPSE CATEGORIES
   ============================================ */

// Toggle individual category
function toggleCategory(categoryId) {
  const category = document.querySelector(`[data-category="${categoryId}"]`);
  if (!category) return;
  
  const content = category.querySelector('.category-content');
  const toggle = category.querySelector('.category-toggle');
  
  if (content.style.display === 'none') {
    // Expandir
    content.style.display = 'block';
    toggle.textContent = '▼';
  } else {
    // Minimizar
    content.style.display = 'none';
    toggle.textContent = '▶';
  }
}

// Toggle all categories
function toggleAllCategories() {
  const categories = document.querySelectorAll('.compatibility-category');
  const btn = document.getElementById('toggleAllBtn');
  
  if (!categories.length) return;
  
  // Verificar estado da primeira categoria
  const firstContent = categories[0].querySelector('.category-content');
  const isExpanded = firstContent.style.display !== 'none';
  
  categories.forEach(category => {
    const content = category.querySelector('.category-content');
    const toggle = category.querySelector('.category-toggle');
    
    if (isExpanded) {
      // Minimizar tudo
      content.style.display = 'none';
      toggle.textContent = '▶';
    } else {
      // Expandir tudo
      content.style.display = 'block';
      toggle.textContent = '▼';
    }
  });
  
  // Atualizar texto do botão
  if (isExpanded) {
    btn.innerHTML = '📂 Expandir Tudo';
  } else {
    btn.innerHTML = '📁 Minimizar Tudo';
  }
}

/* ============================================
   CLOUD REPORT - Opção C (Híbrido Suave)
   ============================================ */

// Verifica se o usuário está autenticado ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  checkCloudAuthentication();
});

/**
 * Verifica se o usuário está autenticado e mostra a seção apropriada
 */
async function checkCloudAuthentication() {
  // Verifica se o Firebase está configurado
  if (typeof firebase === 'undefined' || !firebase.apps.length) {
    // Firebase não inicializado - manter seção de login visível
    console.log('Firebase não inicializado. Usando método tradicional.');
    return;
  }

  // Ouvir mudanças no estado de autenticação
  firebase.auth().onAuthStateChanged(async (user) => {
    const cloudNotAuth = document.getElementById('cloudNotAuth');
    const cloudAuth = document.getElementById('cloudAuth');
    
    if (user) {
      // Usuário autenticado - mostrar seção cloud
      cloudNotAuth.style.display = 'none';
      cloudAuth.style.display = 'block';
      
      // Carregar parceiros conectados
      await loadConnectedPartners(user.uid);
    } else {
      // Não autenticado - mostrar botão de login
      cloudNotAuth.style.display = 'block';
      cloudAuth.style.display = 'none';
    }
  });
}

/**
 * Carrega lista de parceiros conectados do Firebase
 */
async function loadConnectedPartners(userId) {
  const partnerSelect = document.getElementById('partnerSelect');
  
  try {
    // Buscar parceiros conectados no Firebase
    const db = firebase.firestore();
    const connectionsRef = db.collection('connections').where('userId', '==', userId);
    const snapshot = await connectionsRef.get();
    
    if (snapshot.empty) {
      partnerSelect.innerHTML = '<option value="">Nenhum parceiro conectado ainda</option>';
      return;
    }
    
    // Limpar select e adicionar parceiros
    partnerSelect.innerHTML = '<option value="">Selecione um/a parceiro/a...</option>';
    
    snapshot.forEach(doc => {
      const connection = doc.data();
      const option = document.createElement('option');
      option.value = connection.partnerId;
      option.textContent = `${connection.partnerName} (${connection.partnerEmail})`;
      partnerSelect.appendChild(option);
    });
    
  } catch (error) {
    console.error('Erro ao carregar parceiros:', error);
    partnerSelect.innerHTML = '<option value="">Erro ao carregar parceiros</option>';
  }
}

/**
 * Gera relatório usando dados da cloud (Firebase)
 */
async function generateCloudReport() {
  const partnerSelect = document.getElementById('partnerSelect');
  const partnerId = partnerSelect.value;
  
  if (!partnerId) {
    alert('Por favor, selecione um/a parceiro/a.');
    return;
  }
  
  // Mostrar loading
  const reportContainer = document.getElementById('compatibilityReport');
  reportContainer.style.display = 'block';
  reportContainer.innerHTML = `
    <div style="text-align: center; padding: 60px 20px;">
      <div style="font-size: 4em; margin-bottom: 20px;">⏳</div>
      <h2 style="color: #667eea; margin-bottom: 10px;">Gerando Relatório...</h2>
      <p style="color: #6c757d;">Buscando respostas da cloud...</p>
    </div>
  `;
  
  try {
    const user = firebase.auth().currentUser;
    
    // Buscar respostas de ambos os usuários
    const myData = await loadAnswersFromFirebase(user.uid);
    const partnerData = await loadAnswersFromFirebase(partnerId);
    
    if (!myData || !partnerData) {
      throw new Error('Não foi possível carregar as respostas. Certifique-se de que ambos responderam aos questionários.');
    }
    
    // Gerar relatório com os dados
    await generateCompatibilityReport(myData, partnerData);
    
    // Mostrar botões de ação
    document.getElementById('actionButtons').style.display = 'flex';
    document.getElementById('uploadSection').style.display = 'none';
    
  } catch (error) {
    console.error('Erro ao gerar relatório cloud:', error);
    
    reportContainer.innerHTML = `
      <div style="max-width: 600px; margin: 40px auto; padding: 30px; background: #fff3cd; border-left: 5px solid #ffc107; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
        <div style="font-size: 2.5em; text-align: center; margin-bottom: 15px;">⚠️</div>
        <div style="color: #856404; text-align: center; line-height: 1.6;">
          <strong>Não foi possível gerar o relatório pela cloud.</strong><br><br>
          ${error.message}
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <button onclick="location.reload()" style="padding: 12px 25px; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1em;">
            🔄 Tentar Novamente
          </button>
        </div>
      </div>
    `;
  }
}

/**
 * Busca respostas de um usuário no Firebase
 */
async function loadAnswersFromFirebase(userId) {
  try {
    const db = firebase.firestore();
    const answersRef = db.collection('answers').doc(userId);
    const doc = await answersRef.get();
    
    if (!doc.exists) {
      return null;
    }
    
    return doc.data();
    
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    return null;
  }
}
