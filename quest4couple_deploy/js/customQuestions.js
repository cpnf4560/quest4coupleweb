/* ============================================
   QUEST4COUPLE - CUSTOM QUESTIONS
   Sistema de perguntas personalizadas
   ============================================ */

let currentPackId = null;

// ========================================
// CUSTOM QUESTIONS MANAGEMENT
// ========================================

/**
 * Abre o modal para adicionar pergunta personalizada
 */
function openCustomQuestionModal(packId) {
  currentPackId = packId;
  const modal = document.getElementById('customQuestionModal');
  const textarea = document.getElementById('customQuestionText');
  
  // Limpar textarea
  textarea.value = '';
  
  // Mostrar modal
  modal.classList.add('active');
  textarea.focus();
}

/**
 * Fecha o modal
 */
function closeCustomQuestionModal() {
  const modal = document.getElementById('customQuestionModal');
  modal.classList.remove('active');
  currentPackId = null;
}

/**
 * Adiciona uma pergunta personalizada
 */
function addCustomQuestion() {
  const textarea = document.getElementById('customQuestionText');
  const questionText = textarea.value.trim();
  
  // Validação
  if (!questionText) {
    alert('❌ Por favor, escreve uma pergunta!');
    return;
  }
  
  if (questionText.length < 10) {
    alert('❌ A pergunta deve ter pelo menos 10 caracteres!');
    return;
  }
  
  if (!currentPackId) {
    alert('❌ Erro: Pack não identificado!');
    return;
  }
  
  // Obter perguntas custom existentes
  const customQuestions = getCustomQuestions();
  
  // Adicionar nova pergunta
  if (!customQuestions[currentPackId]) {
    customQuestions[currentPackId] = [];
  }
  
  customQuestions[currentPackId].push({
    text: questionText,
    id: `custom_${Date.now()}`,
    timestamp: new Date().toISOString()
  });
  
  // Guardar no localStorage
  saveCustomQuestions(customQuestions);
  
  // Fechar modal
  closeCustomQuestionModal();
  
  // Recarregar perguntas do pack
  loadPackQuestions(currentPackId);
  
  // Feedback
  alert('✅ Pergunta adicionada com sucesso!');
  
  // Scroll para a nova pergunta
  setTimeout(() => {
    const packContent = document.getElementById(`pack-${currentPackId}-questions`);
    if (packContent) {
      const questions = packContent.querySelectorAll('.question');
      const lastQuestion = questions[questions.length - 1];
      if (lastQuestion) {
        lastQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
        lastQuestion.style.animation = 'pulse 1s ease-in-out';
      }
    }
  }, 300);
}

/**
 * Obtém perguntas personalizadas do localStorage
 */
function getCustomQuestions() {
  try {
    const data = localStorage.getItem('quest4couple_custom_questions');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Erro ao carregar perguntas custom:', error);
    return {};
  }
}

/**
 * Guarda perguntas personalizadas no localStorage
 */
function saveCustomQuestions(customQuestions) {
  try {
    localStorage.setItem('quest4couple_custom_questions', JSON.stringify(customQuestions));
  } catch (error) {
    console.error('Erro ao guardar perguntas custom:', error);
    alert('❌ Erro ao guardar pergunta. Tenta novamente.');
  }
}

/**
 * Remove uma pergunta personalizada
 */
function deleteCustomQuestion(packId, questionId) {
  if (!confirm('❓ Tens a certeza que queres remover esta pergunta personalizada?')) {
    return;
  }
  
  const customQuestions = getCustomQuestions();
  
  if (customQuestions[packId]) {
    customQuestions[packId] = customQuestions[packId].filter(q => q.id !== questionId);
    
    // Se não houver mais perguntas custom no pack, remover o pack
    if (customQuestions[packId].length === 0) {
      delete customQuestions[packId];
    }
    
    saveCustomQuestions(customQuestions);
    loadPackQuestions(packId);
    alert('✅ Pergunta removida!');
  }
}

/**
 * Conta total de perguntas (padrão + custom)
 */
function getTotalQuestionsCount(packId, standardCount) {
  const customQuestions = getCustomQuestions();
  const customCount = customQuestions[packId] ? customQuestions[packId].length : 0;
  return standardCount + customCount;
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  // ESC para fechar modal
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('customQuestionModal');
      if (modal && modal.classList.contains('active')) {
        closeCustomQuestionModal();
      }
    }
  });
  
  // CTRL + ENTER para adicionar pergunta
  const textarea = document.getElementById('customQuestionText');
  if (textarea) {
    textarea.addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.key === 'Enter') {
        addCustomQuestion();
      }
    });
  }
});

// ========================================
// ANIMATION
// ========================================

const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(40, 167, 69, 0.5); }
  }
`;
document.head.appendChild(style);
