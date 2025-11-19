/* ============================================
   QUEST4COUPLE - STORAGE
   Sistema de guardar/carregar respostas
   ============================================ */

// Carregar biblioteca de encriptação
const cryptoScript = document.createElement('script');
cryptoScript.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
document.head.appendChild(cryptoScript);

function getAnswersData() {
  const data = {
    userName: document.getElementById('userName').value || 'Anónimo',
    answers: {},
    customQuestions: getCustomQuestions ? getCustomQuestions() : {},
    timestamp: new Date().toISOString()
  };

  const packConfigs = [
    { id: 'romantico', name: 'Pack Romântico' },
    { id: 'experiencia', name: 'Exploração e Aventura a Dois' },
    { id: 'pimentinha', name: 'Pimentinha' },
    { id: 'poliamor', name: 'Poliamor' },
    { id: 'kinks', name: 'Fetiches' }
  ];

  packConfigs.forEach(config => {
    const packContainer = document.getElementById(`pack-${config.id}-questions`);
    if (packContainer) {
      const questions = packContainer.querySelectorAll('.question');
      questions.forEach((q, index) => {
        const qNum = index + 1;
        const radio = q.querySelector(`input[name="${config.id}_q${qNum}"]:checked`);
        const comment = q.querySelector(`textarea[name="${config.id}_q${qNum}_comment"]`);
        
        if (radio || (comment && comment.value.trim() !== '')) {
          if (!data.answers[config.id]) {
            data.answers[config.id] = {};
          }
          data.answers[config.id][`q${qNum}`] = {
            answer: radio ? radio.value : null,
            comment: comment ? comment.value.trim() : ''
          };
        }
      });
    }
  });

  return data;
}

function saveAnswers() {
  const securityCode = prompt("Por favor, introduza um código de segurança para encriptar as suas respostas.\\nLembre-se deste código para comparar mais tarde.", "");
  if (!securityCode) {
    alert("Código de segurança é obrigatório para guardar.");
    return;
  }

  const data = getAnswersData();
  const dataString = JSON.stringify(data);
  
  // Salvar estatísticas anônimas para o admin
  saveAnonymousAnalytics(data);
  
  // Encriptar
  const encrypted = CryptoJS.AES.encrypt(dataString, securityCode).toString();

  const blob = new Blob([encrypted], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Quest4Couple_${data.userName.replace(/ /g, '_')}_${new Date().toISOString().slice(0,10)}.q4c`;
  a.click();
  URL.revokeObjectURL(a.href);
  
  alert("Ficheiro com as respostas guardado com sucesso!");
}

/* ============================================
   ANALYTICS ANÓNIMO
   Sistema de estatísticas sem identificação
   ============================================ */

function saveAnonymousAnalytics(data) {
  // Obter analytics existente
  const analytics = JSON.parse(localStorage.getItem('q4c_analytics') || '{}');
  
  // Processar cada pack respondido
  Object.keys(data.answers).forEach(packId => {
    // Inicializar pack se não existir
    if (!analytics[packId]) {
      analytics[packId] = {
        totalResponses: 0,
        questions: {}
      };
    }
    
    // Incrementar total de respostas
    analytics[packId].totalResponses++;
    
    // Processar cada questão
    const packAnswers = data.answers[packId];
    Object.keys(packAnswers).forEach(qKey => {
      const answer = packAnswers[qKey];
      
      // Inicializar questão se não existir
      if (!analytics[packId].questions[qKey]) {
        analytics[packId].questions[qKey] = {
          text: getQuestionText(packId, qKey),
          sim: 0,
          talvez: 0,
          nao: 0,
          comments: 0
        };
      }
      
      const q = analytics[packId].questions[qKey];
      
      // Contar resposta (SEM salvar a resposta em si)
      if (answer.answer === 'sim') q.sim++;
      else if (answer.answer === 'talvez') q.talvez++;
      else if (answer.answer === 'nao') q.nao++;
      
      // Contar se tem comentário (SEM salvar o comentário)
      if (answer.comment && answer.comment.trim() !== '') {
        q.comments++;
      }
    });
  });
  
  // Salvar analytics atualizados
  localStorage.setItem('q4c_analytics', JSON.stringify(analytics));
  
  console.log('📊 Estatísticas anônimas atualizadas');
}

function getQuestionText(packId, qKey) {
  // Tentar obter o texto da pergunta da página
  const qNum = qKey.replace('q', '');
  const packContainer = document.getElementById(`pack-${packId}-questions`);
  
  if (packContainer) {
    const questions = packContainer.querySelectorAll('.question');
    if (questions[qNum - 1]) {
      const questionText = questions[qNum - 1].querySelector('.question-text');
      if (questionText) {
        return questionText.textContent.trim();
      }
    }
  }
  
  return `Pergunta ${qNum}`;
}

// Salvar analytics também quando user faz autosave
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', function() {
    try {
      const data = getAnswersData();
      if (data.answers && Object.keys(data.answers).length > 0) {
        saveAnonymousAnalytics(data);
      }
    } catch (e) {
      // Silently fail
    }
  });
}
