/* ============================================
   QUEST4COUPLE - STORAGE
   Sistema de guardar/carregar respostas
   ============================================ */

// Carregar biblioteca de encriptação
let cryptoJSLoaded = false;
const cryptoScript = document.createElement('script');
cryptoScript.src = "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js";
cryptoScript.onload = function() {
  cryptoJSLoaded = true;
  console.log('✅ CryptoJS carregado com sucesso');
};
cryptoScript.onerror = function() {
  console.error('❌ Erro ao carregar CryptoJS');
  alert('⚠️ Erro ao carregar biblioteca de encriptação. Verifique a sua conexão à internet.');
};
document.head.appendChild(cryptoScript);

function getAnswersData() {
  console.log('📋 A recolher dados das respostas...');
  
  const userNameElement = document.getElementById('userName');
  const userName = userNameElement ? (userNameElement.value || 'Anónimo') : 'Anónimo';
  
  const data = {
    userName: userName,
    answers: {},
    customQuestions: getCustomQuestions ? getCustomQuestions() : {},
    timestamp: new Date().toISOString()
  };
  
  console.log('👤 Nome do utilizador:', userName);

  const packConfigs = [
    { id: 'romantico', name: 'Pack Romântico' },
    { id: 'experiencia', name: 'Exploração e Aventura a Dois' },
    { id: 'pimentinha', name: 'Pimentinha' },
    { id: 'poliamor', name: 'Poliamor' },
    { id: 'kinks', name: 'Fetiches' }
  ];

  let totalAnswers = 0;
  
  packConfigs.forEach(config => {
    const packContainer = document.getElementById(`pack-${config.id}-questions`);
    if (packContainer) {
      const questions = packContainer.querySelectorAll('.question');
      console.log(`📦 Pack ${config.name}: ${questions.length} perguntas encontradas`);
      
      let packAnswers = 0;
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
          packAnswers++;
          totalAnswers++;
        }
      });
      
      if (packAnswers > 0) {
        console.log(`✅ ${config.name}: ${packAnswers} respostas recolhidas`);
      }
    } else {
      console.log(`⚠️ Container do pack ${config.name} não encontrado`);
    }
  });

  console.log(`📊 Total de respostas recolhidas: ${totalAnswers}`);
  return data;
}

function saveAnswers() {
  // Verificar se CryptoJS está carregado
  if (typeof CryptoJS === 'undefined') {
    alert('⏳ A biblioteca de encriptação ainda está a carregar. Por favor aguarde alguns segundos e tente novamente.');
    console.error('❌ CryptoJS não está carregado ainda!');
    return;
  }

  const securityCode = prompt("Por favor, introduza um código de segurança para encriptar as suas respostas.\nLembre-se deste código para comparar mais tarde.", "");
  if (!securityCode) {
    alert("Código de segurança é obrigatório para guardar.");
    return;
  }
  
  if (securityCode.trim() === '') {
    alert("O código não pode estar vazio!");
    return;
  }

  console.log('📦 A preparar dados para download...');
  const data = getAnswersData();
  
  // Verificar se há respostas
  if (!data.answers || Object.keys(data.answers).length === 0) {
    alert('❌ Não há respostas para guardar! Por favor responda pelo menos uma pergunta.');
    return;
  }
  
  const dataString = JSON.stringify(data);
  console.log('✅ Dados preparados:', data);
  
  // Salvar estatísticas anônimas para o admin
  saveAnonymousAnalytics(data);
  
  try {
    // Encriptar
    console.log('🔐 A encriptar dados...');
    const encrypted = CryptoJS.AES.encrypt(dataString, securityCode).toString();
    console.log('✅ Dados encriptados com sucesso');

    // Criar blob e fazer download
    const blob = new Blob([encrypted], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Quest4Couple_${data.userName.replace(/ /g, '_')}_${new Date().toISOString().slice(0,10)}.q4c`;
    
    console.log('💾 A iniciar download do arquivo:', a.download);
    
    // Adicionar ao DOM temporariamente (necessário em alguns browsers)
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Limpar URL após 100ms
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
    }, 100);
    
    console.log('✅ Download iniciado com sucesso!');
    alert("✅ Ficheiro com as respostas guardado com sucesso!");
  } catch (error) {
    console.error('❌ Erro ao guardar respostas:', error);
    alert('❌ Erro ao guardar o ficheiro. Por favor tente novamente.\n\nDetalhes: ' + error.message);
  }
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
