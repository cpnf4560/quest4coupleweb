/* ============================================
   QUEST4COUPLE - COMPARISON
   Sistema de comparação de respostas
   ============================================ */

async function compareEncryptedAnswers() {
  const myFileInput = document.getElementById('myFile');
  const partnerFileInput = document.getElementById('partnerFile');
  const securityCodeInput = document.getElementById('securityCode');
  const reportContainer = document.getElementById('compatibilityReport');

  if (!myFileInput.files[0] || !partnerFileInput.files[0] || !securityCodeInput.value) {
    alert("Por favor, carregue ambos os ficheiros e introduza o código de segurança.");
    return;
  }

  try {
    const myFileContent = await myFileInput.files[0].text();
    const partnerFileContent = await partnerFileInput.files[0].text();

    // Desencriptar
    const myDecrypted = CryptoJS.AES.decrypt(myFileContent, securityCodeInput.value).toString(CryptoJS.enc.Utf8);
    const partnerDecrypted = CryptoJS.AES.decrypt(partnerFileContent, securityCodeInput.value).toString(CryptoJS.enc.Utf8);

    if (!myDecrypted || !partnerDecrypted) {
      throw new Error("Falha na desencriptação. Verifique o código de segurança.");
    }

    const myData = JSON.parse(myDecrypted);
    const partnerData = JSON.parse(partnerDecrypted);

    generateCompatibilityReport(myData, partnerData);

  } catch (error) {
    console.error("Erro ao comparar:", error);
    reportContainer.innerHTML = `
      <div class="special" style="padding: 15px; border-radius: 8px;">
        <strong>Erro!</strong> Não foi possível comparar os ficheiros. 
        Verifique se o código de segurança está correto e se os ficheiros não estão corrompidos.
      </div>`;
    reportContainer.style.display = 'block';
  }
}

async function generateCompatibilityReport(myData, partnerData) {
  const reportContainer = document.getElementById('compatibilityReport');
  let html = `<h2>💖 Relatório de Compatibilidade entre ${myData.userName} e ${partnerData.userName}</h2>`;

  const allPacksResponse = await fetch('data/packs_data_clean.json');
  const allPacksData = await allPacksResponse.json();

  const packConfigs = [
    { id: 'romantico', name: 'Pack Romântico' },
    { id: 'experiencia', name: 'Exploração e Aventura a Dois' },
    { id: 'pimentinha', name: 'Pimentinha' },
    { id: 'poliamor', name: 'Poliamor' },
    { id: 'kinks', name: 'Fetiches' }
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
    const commonQuestions = { ...myAnswers, ...partnerAnswers };

    if (Object.keys(commonQuestions).length > 0) {
      html += `
        <div class="pack ${config.id}" style="display:block; margin-top: 20px;">
          <div class="pack-header"><h2>${config.name}</h2></div>
          <div class="pack-content">`;      // Separar questões por categoria
      const superMatches = [];
      const matches = [];
      const reflectionNeeded = [];
      const maybeExplore = [];      Object.keys(commonQuestions).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1))).forEach(qKey => {
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
            }
          }
        }

        // NOVA LÓGICA: Se ambos responderam "meh", não mostrar
        if (myAns?.answer === 'meh' && partnerAnswerToCompare?.answer === 'meh') {
          return; // Pular esta questão completamente
        }

        totalQuestions++;

        // NOVA LÓGICA: Se um respondeu "meh" MAS o outro "porfavor" → Reflexão
        if ((myAns?.answer === 'meh' && partnerAnswerToCompare?.answer === 'porfavor') ||
            (myAns?.answer === 'porfavor' && partnerAnswerToCompare?.answer === 'meh')) {
          reflectionNeeded.push({
            qIndex,
            questionText,
            myAns,
            partnerAns: partnerAnswerToCompare,
            resultText: '💭 Reflexão Necessária',
            compatibilityClass: 'reflection',
            isInverted,
            invertInfo
          });
          return;
        }

        // Super Match: Ambos "Por favor!"
        if (myAns?.answer === 'porfavor' && partnerAnswerToCompare?.answer === 'porfavor') {
          superMatches.push({
            qIndex,
            questionText,
            myAns,
            partnerAns: partnerAnswerToCompare,
            resultText: '🔥 Super Match!',
            compatibilityClass: 'super-match',
            isInverted,
            invertInfo
          });
          totalMatches++;
          return;
        }

        // Match: Combinação de "porfavor" com "yup" ou "yup" com "yup"
        if ((myAns?.answer === 'yup' && partnerAnswerToCompare?.answer === 'yup') || 
            (myAns?.answer === 'porfavor' && partnerAnswerToCompare?.answer === 'yup') ||
            (myAns?.answer === 'yup' && partnerAnswerToCompare?.answer === 'porfavor')) {
          matches.push({
            qIndex,
            questionText,
            myAns,
            partnerAns: partnerAnswerToCompare,
            resultText: '✅ Match!',
            compatibilityClass: 'match',
            isInverted,
            invertInfo
          });
          return;
        }

        // Resto: Talvez / Indecisão
        maybeExplore.push({
          qIndex,
          questionText,
          myAns,
          partnerAns: partnerAnswerToCompare,
          resultText: '🤔 Para Explorar',
          compatibilityClass: 'maybe',
          isInverted,
          invertInfo
        });
      });      // Renderizar por categorias
      const renderCategory = (title, items, icon) => {
        if (items.length === 0) return '';
        
        let categoryHtml = `<div class="compatibility-category">
          <h3>${icon} ${title} (${items.length})</h3>`;
        
        items.forEach(item => {
          if (item.isInverted && item.invertInfo) {
            // RENDERIZAÇÃO COM INVERT MATCHING
            const giverLabel = item.invertInfo.isGiver 
              ? `<span class="invert-label giver">Você quer DAR</span>`
              : `<span class="invert-label receiver">Você quer RECEBER</span>`;

            const partnerLabel = item.invertInfo.isGiver
              ? `<span class="invert-label receiver">Parceiro quer RECEBER</span>`
              : `<span class="invert-label giver">Parceiro quer DAR</span>`;

            categoryHtml += `
              <div class="compatibility-section ${item.compatibilityClass} inverted">
                <p><em>${item.resultText}</em></p>
                <div class="invert-container">
                  <div class="invert-you">
                    ${giverLabel}
                    <div class="question-text"><strong>${item.qIndex + 1}. ${item.questionText}</strong></div>
                    <span class="answer-badge ${item.myAns.answer}">${getAnswerText(item.myAns.answer)}</span>
                    ${item.myAns?.comment ? `<p style="margin-top: 8px; font-style: italic; font-size: 0.9em;">${item.myAns.comment}</p>` : ''}
                  </div>
                  <div class="invert-arrow">↔️</div>
                  <div class="invert-partner">
                    ${partnerLabel}
                    <div class="question-text"><strong>${item.invertInfo.pairQuestion}</strong></div>
                    <span class="answer-badge ${item.partnerAns.answer}">${getAnswerText(item.partnerAns.answer)}</span>
                    ${item.partnerAns?.comment ? `<p style="margin-top: 8px; font-style: italic; font-size: 0.9em;">${item.partnerAns.comment}</p>` : ''}
                  </div>
                </div>
                <div class="invert-description">
                  <small>💡 ${item.invertInfo.description}</small>
                </div>
              </div>`;
          } else {
            // RENDERIZAÇÃO NORMAL
            categoryHtml += `
              <div class="compatibility-section ${item.compatibilityClass}">
                <p><strong>${item.qIndex + 1}. ${item.questionText}</strong></p>
                <p><em>${item.resultText}</em></p>
                <p><strong>${myData.userName}:</strong> ${item.myAns ? getAnswerText(item.myAns.answer) : 'Não respondeu'} ${item.myAns?.comment ? `<em>(${item.myAns.comment})</em>` : ''}</p>
                <p><strong>${partnerData.userName}:</strong> ${item.partnerAns ? getAnswerText(item.partnerAns.answer) : 'Não respondeu'} ${item.partnerAns?.comment ? `<em>(${item.partnerAns.comment})</em>` : ''}</p>
              </div>`;
          }
        });
        
        categoryHtml += `</div>`;
        return categoryHtml;
      };

      // Ordem de prioridade no relatório
      html += renderCategory('🔥 Super Matches - Façam já!', superMatches, '🔥');
      html += renderCategory('✅ Matches - Vocês combinam aqui', matches, '✅');
      html += renderCategory('💭 Para Reflexão - Um quer muito, o outro não', reflectionNeeded, '💭');
      html += renderCategory('🤔 Para Explorar - Conversem sobre', maybeExplore, '🤔');
      
      html += `</div></div>`;
    }
  });

  const percentage = totalQuestions > 0 ? ((totalMatches / totalQuestions) * 100).toFixed(1) : 0;
  
  html = `
    <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #d63384, #e83e8c); color: white; border-radius: 15px; margin-bottom: 30px;">
      <h1>💑 Relatório de Compatibilidade</h1>
      <h2>${myData.userName} ❤️ ${partnerData.userName}</h2>
      <div style="font-size: 3em; margin: 20px 0;">${percentage}%</div>
      <p style="font-size: 1.2em;">${totalMatches} Super Matches de ${totalQuestions} perguntas!</p>
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
