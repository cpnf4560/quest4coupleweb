/* ============================================
   QUEST4COUPLE - LOAD & IMPORT
   Carregar respostas e importar perguntas custom
   ============================================ */

// ========================================
// LOAD ANSWERS MODAL
// ========================================

function showLoadModal() {
  const modal = document.getElementById('loadAnswersModal');
  modal.classList.add('active');
  document.getElementById('loadAnswersFile').value = '';
  document.getElementById('loadAnswersCode').value = '';
}

function closeLoadModal() {
  const modal = document.getElementById('loadAnswersModal');
  modal.classList.remove('active');
}

async function loadAnswersFromFile() {
  const fileInput = document.getElementById('loadAnswersFile');
  const codeInput = document.getElementById('loadAnswersCode');
  
  if (!fileInput.files[0]) {
    alert('❌ Por favor, seleciona um ficheiro .q4c!');
    return;
  }
  
  if (!codeInput.value) {
    alert('❌ Por favor, introduz o código de segurança!');
    return;
  }
  
  try {
    const fileContent = await fileInput.files[0].text();
    
    // Desencriptar
    const decrypted = CryptoJS.AES.decrypt(fileContent, codeInput.value).toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Código de segurança incorreto');
    }
    
    const data = JSON.parse(decrypted);
    
    // Carregar nome
    if (data.userName) {
      document.getElementById('userName').value = data.userName;
    }
    
    // Carregar perguntas custom (se existirem)
    if (data.customQuestions) {
      const currentCustom = getCustomQuestions();
      
      // Merge das perguntas custom
      Object.keys(data.customQuestions).forEach(packId => {
        if (!currentCustom[packId]) {
          currentCustom[packId] = [];
        }
        
        // Adicionar apenas perguntas que ainda não existem
        data.customQuestions[packId].forEach(newQ => {
          const exists = currentCustom[packId].some(q => q.id === newQ.id);
          if (!exists) {
            currentCustom[packId].push(newQ);
          }
        });
      });
      
      saveCustomQuestions(currentCustom);
    }
    
    // Recarregar packs para mostrar custom questions
    loadAndRenderAllPacks();
    
    // Aguardar renderização
    setTimeout(() => {
      // Carregar respostas
      Object.keys(data.answers).forEach(packId => {
        const packAnswers = data.answers[packId];
        
        Object.keys(packAnswers).forEach(qKey => {
          const answer = packAnswers[qKey];
          
          // Selecionar radio button
          if (answer.answer) {
            const radio = document.querySelector(`input[name="${packId}_${qKey}"][value="${answer.answer}"]`);
            if (radio) {
              radio.checked = true;
            }
          }
          
          // Preencher comentário
          if (answer.comment) {
            const textarea = document.querySelector(`textarea[name="${packId}_${qKey}_comment"]`);
            if (textarea) {
              textarea.value = answer.comment;
            }
          }
        });
      });
      
      // Fechar modal
      closeLoadModal();
      
      // Feedback
      const totalAnswers = Object.values(data.answers).reduce((sum, pack) => sum + Object.keys(pack).length, 0);
      const customCount = data.customQuestions ? 
        Object.values(data.customQuestions).reduce((sum, pack) => sum + pack.length, 0) : 0;
      
      let message = `✅ Respostas carregadas com sucesso!\n\n`;
      message += `📊 ${totalAnswers} respostas restauradas\n`;
      if (customCount > 0) {
        message += `✨ ${customCount} perguntas personalizadas importadas\n`;
      }
      message += `\nPodes continuar de onde paraste! 🎉`;
      
      alert(message);
      
      // Atualizar progresso
      attachProgressListeners();
      
    }, 500);
    
  } catch (error) {
    console.error('Erro ao carregar:', error);
    alert('❌ Erro ao carregar ficheiro!\n\nVerifica:\n• Código de segurança correto\n• Ficheiro .q4c válido\n• Ficheiro não corrompido');
  }
}

// ========================================
// IMPORT PARTNER QUESTIONS MODAL
// ========================================

function showImportModal() {
  const modal = document.getElementById('importQuestionsModal');
  modal.classList.add('active');
  document.getElementById('importQuestionsFile').value = '';
  document.getElementById('importQuestionsCode').value = '';
}

function closeImportModal() {
  const modal = document.getElementById('importQuestionsModal');
  modal.classList.remove('active');
}

async function importPartnerQuestions() {
  const fileInput = document.getElementById('importQuestionsFile');
  const codeInput = document.getElementById('importQuestionsCode');
  
  if (!fileInput.files[0]) {
    alert('❌ Por favor, seleciona o ficheiro .q4c do parceiro!');
    return;
  }
  
  if (!codeInput.value) {
    alert('❌ Por favor, introduz o código de segurança dele/a!');
    return;
  }
  
  try {
    const fileContent = await fileInput.files[0].text();
    
    // Desencriptar
    const decrypted = CryptoJS.AES.decrypt(fileContent, codeInput.value).toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Código de segurança incorreto');
    }
    
    const partnerData = JSON.parse(decrypted);
    
    if (!partnerData.customQuestions || Object.keys(partnerData.customQuestions).length === 0) {
      alert('ℹ️ Este ficheiro não contém perguntas personalizadas.\n\nO teu parceiro/a não criou perguntas custom.');
      closeImportModal();
      return;
    }
    
    // Carregar perguntas custom atuais
    const currentCustom = getCustomQuestions();
    let newQuestionsCount = 0;
    
    // Merge das perguntas custom do parceiro
    Object.keys(partnerData.customQuestions).forEach(packId => {
      if (!currentCustom[packId]) {
        currentCustom[packId] = [];
      }
      
      // Adicionar apenas perguntas que ainda não existem
      partnerData.customQuestions[packId].forEach(partnerQ => {
        const exists = currentCustom[packId].some(q => q.id === partnerQ.id || q.text === partnerQ.text);
        if (!exists) {
          currentCustom[packId].push(partnerQ);
          newQuestionsCount++;
        }
      });
    });
    
    if (newQuestionsCount === 0) {
      alert('ℹ️ Nenhuma pergunta nova encontrada.\n\nTodas as perguntas do parceiro já estão no teu questionário.');
      closeImportModal();
      return;
    }
    
    // Guardar
    saveCustomQuestions(currentCustom);
    
    // Recarregar packs
    loadAndRenderAllPacks();
    
    // Fechar modal
    closeImportModal();
    
    // Feedback
    const packsList = Object.keys(partnerData.customQuestions)
      .map(id => {
        const names = {
          'romantico': 'Romântico',
          'experiencia': 'Experiência a 2',
          'pimentinha': 'Pimentinha',
          'poliamor': 'Poliamor',
          'kinks': 'Kinks & Fetiches'
        };
        const count = partnerData.customQuestions[id].filter(pq => 
          !currentCustom[id] || !currentCustom[id].some(q => q.id === pq.id)
        ).length;
        return count > 0 ? `• ${names[id]}: ${partnerData.customQuestions[id].length} perguntas` : null;
      })
      .filter(x => x)
      .join('\n');
    
    let message = `✅ Perguntas do parceiro importadas!\n\n`;
    message += `✨ ${newQuestionsCount} perguntas personalizadas adicionadas:\n\n`;
    message += packsList;
    message += `\n\nAgora podes responder às mesmas perguntas! 💕`;
    
    alert(message);
    
  } catch (error) {
    console.error('Erro ao importar:', error);
    alert('❌ Erro ao importar perguntas!\n\nVerifica:\n• Código de segurança correto\n• Ficheiro .q4c válido do parceiro');
  }
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // ESC para fechar modais
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const loadModal = document.getElementById('loadAnswersModal');
      const importModal = document.getElementById('importQuestionsModal');
      
      if (loadModal && loadModal.classList.contains('active')) {
        closeLoadModal();
      }
      if (importModal && importModal.classList.contains('active')) {
        closeImportModal();
      }
    }
  });
});
