/* ============================================
   QUEST4COUPLE - APP INITIALIZATION
   Inicialização da aplicação
   ============================================ */

// Global variables
let selectedCoupleType = null;

// ========================================
// AGE VERIFICATION
// ========================================
function checkAgeVerification() {
  const ageVerified = localStorage.getItem('quest4couple_age_verified');
  const verificationTime = localStorage.getItem('quest4couple_age_time');
  
  if (ageVerified === 'true' && verificationTime) {
    const hoursPassed = (Date.now() - parseInt(verificationTime)) / (1000 * 60 * 60);
    if (hoursPassed < 24) {
      document.getElementById('ageModal').classList.remove('active');
      return true;
    }
  }
  
  document.getElementById('ageModal').classList.add('active');
  return false;
}

function confirmAge(isAdult) {
  if (isAdult) {
    localStorage.setItem('quest4couple_age_verified', 'true');
    localStorage.setItem('quest4couple_age_time', Date.now().toString());
    
    const modal = document.getElementById('ageModal');
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.classList.remove('active');
      modal.style.opacity = '1';
    }, 300);
  } else {
    alert('😊 Lamentamos, mas deves ter 18+ anos para aceder a este conteúdo.\\n\\nSerás redirecionado para um site educativo.');
    window.location.href = 'https://www.educacao.gov.pt/';
  }
}

// ========================================
// COUPLE TYPE CONFIGURATION
// ========================================
function selectCoupleType(type) {
  selectedCoupleType = type;
  
  document.querySelectorAll('.couple-type-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  event.currentTarget.classList.add('selected');
  document.getElementById('continueBtn').disabled = false;
  localStorage.setItem('quest4couple_couple_type', type);
}

function continueToThemes() {
  if (!selectedCoupleType) {
    alert('Por favor, seleciona o tipo de casal primeiro!');
    return;
  }
  
  document.getElementById('coupleConfig').style.display = 'none';
  document.getElementById('themesView').style.display = 'grid';
  applyQuestionFilters(selectedCoupleType);
}

function skipConfig() {
  selectedCoupleType = 'other';
  localStorage.setItem('quest4couple_couple_type', 'other');
  document.getElementById('coupleConfig').style.display = 'none';
  document.getElementById('themesView').style.display = 'grid';
}

function applyQuestionFilters(type) {
  console.log('Couple type selected:', type);
  // Futuro: filtrar perguntas específicas por tipo de casal
}

// ========================================
// THEME NAVIGATION
// ========================================
async function showTheme(themeName) {
  // Carregar perguntas na primeira vez
  if (!window.questionsLoaded) {
    loadAndRenderAllPacks();
    window.questionsLoaded = true;
    
    // ✅ Collapse/expand agora é gerido automaticamente pelo rendering.js
    // Os event listeners são adicionados quando as categorias são criadas
    console.log('✅ Perguntas carregadas - event listeners de collapse/expand já adicionados');
  }
  
  document.getElementById('themesView').style.display = 'none';
  
  const mainControls = document.getElementById('mainControls');
  if (mainControls) {
    mainControls.style.display = 'none';
  }
  
  document.querySelectorAll('.pack').forEach(pack => {
    pack.classList.remove('active');
  });
    const selectedPack = document.querySelector('.pack.' + themeName);
  if (selectedPack) {
    selectedPack.classList.add('active');
  }
  
  // Carregar respostas salvas do Firestore para este pack
  if (typeof loadSavedAnswersForPack === 'function') {
    await loadSavedAnswersForPack(themeName);
  }
  
  // 🔥 ATIVAR SINCRONIZAÇÃO EM TEMPO REAL
  if (typeof setupRealtimeSync === 'function') {
    setupRealtimeSync(themeName);
    console.log('🔥 Sincronização em tempo real ativada para:', themeName);
  }
  
  // ✅ NOVO: Atualizar progresso do pack após carregar respostas
  if (typeof PackCollapse !== 'undefined' && typeof PackCollapse.updateProgress === 'function') {
    PackCollapse.updateProgress(themeName);
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToThemes() {
  // 🛑 PARAR SINCRONIZAÇÃO EM TEMPO REAL
  if (typeof stopRealtimeSync === 'function') {
    stopRealtimeSync();
    console.log('🛑 Sincronização em tempo real desativada');
  }
  
  document.querySelectorAll('.pack').forEach(pack => {
    pack.classList.remove('active');
  });
  
  document.getElementById('themesView').style.display = 'grid';
  
  const mainControls = document.getElementById('mainControls');
  if (mainControls) {
    mainControls.style.display = 'flex';
  }
  
  updateThemeProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateThemeProgress() {
  const themeClasses = ['romantico', 'experiencia', 'pimentinha', 'poliamor', 'kinks'];
  const themeQuestionCounts = {
    'romantico': 50,
    'experiencia': 50,
    'pimentinha': 50,
    'poliamor': 60,
    'kinks': 90
  };
  
  themeClasses.forEach(themeClass => {
    const pack = document.querySelector('.pack.' + themeClass);
    const totalQuestions = themeQuestionCounts[themeClass];
    let answered = 0;
    
    if (pack) {
      const questions = pack.querySelectorAll('.question');
      answered = Array.from(questions).filter(q => 
        q.querySelector('input[type="radio"]:checked')
      ).length;
    }
    
    const percentage = totalQuestions > 0 ? (answered / totalQuestions) * 100 : 0;
    
    // Atualizar card do tema
    const themeCard = Array.from(document.querySelectorAll('.theme-card')).find(card => {
      const onclick = card.getAttribute('onclick');
      return onclick && onclick.includes(themeClass);
    });
    
    if (themeCard) {
      const progressBar = themeCard.querySelector('.theme-progress-bar');
      const progressText = themeCard.querySelector('.theme-progress-text');
      
      if (progressBar) {
        progressBar.style.width = percentage + '%';
      }
      
      if (progressText) {
        progressText.textContent = `${answered} de ${totalQuestions} respondidas`;
      }
    }
  });
}

// Adicionar listener para atualizar progresso ao responder
function attachProgressListeners() {
  document.addEventListener('change', function(e) {
    if (e.target.type === 'radio') {
      updateThemeProgress();
      // Atualizar também o contador de perguntas por categoria
      if (typeof updateAllCategoriesProgress === 'function') {
        updateAllCategoriesProgress();
      }
    }
  });
  
  // ✅ NOVO: Listener para textareas de comentários
  document.addEventListener('input', function(e) {
    if (e.target.tagName === 'TEXTAREA' && e.target.closest('.question-comment')) {
      // Atualizar contador de comentários
      if (typeof updateAllCategoriesProgress === 'function') {
        updateAllCategoriesProgress();
      }
    }
  });
}

// ========================================
// PACK NAVIGATION
// ========================================
function togglePackNav() {
  const sidebar = document.getElementById('packNavSidebar');
  sidebar.classList.toggle('hidden');
}

// ========================================
// COMPARE UI
// ========================================
function showCompareSection() {
  const section = document.getElementById('compareSection');
  section.style.display = section.style.display === 'none' ? 'block' : 'none';
}

// ========================================
// PDF & EMAIL (Placeholders)
// ========================================
function generatePDF() {
  alert('📄 Funcionalidade de geração de PDF em desenvolvimento!');
}

function sendByEmail() {
  alert('📧 Funcionalidade de envio por e-mail em desenvolvimento!');
}

// ========================================
// AUTOSAVE TO FIRESTORE
// ========================================
function setupAutosave() {
  console.log('🔧 setupAutosave() chamado - Configurando event listeners');
  
  // Função auxiliar para salvar resposta de rádio
  async function saveRadioAnswer(target) {
    console.log('📝 saveRadioAnswer chamado:', target.type, target.name, target.value);
    
    if (target.type === 'radio' && target.name) {
      const name = target.name;
      const value = target.value;
      
      // Extrair packId e questionId do name (formato: packId_qNum)
      const match = name.match(/^(.+)_q(\d+)$/);
      if (match) {
        const packId = match[1];
        const questionId = `q${match[2]}`;
        
        console.log('🎯 Tentando salvar:', packId, questionId, value);
        
        // Verificar se função existe
        if (typeof saveAnswerToFirestore === 'function') {
          console.log('✅ saveAnswerToFirestore existe, chamando...');
          const saved = await saveAnswerToFirestore(packId, questionId, {
            answer: value,
            comment: ''
          });
          
          if (saved) {
            console.log(`💾 Autosave SUCESSO: ${packId}/${questionId} = ${value}`);
          } else {
            console.error(`❌ Autosave FALHOU: ${packId}/${questionId}`);
          }
        } else {
          console.error('❌ saveAnswerToFirestore NÃO existe!');
        }
      } else {
        console.warn('⚠️ Nome do input não corresponde ao padrão esperado:', name);
      }
    }
  }
  
  // ✅ Função auxiliar para salvar comentário
  async function saveComment(target) {
    if (target.tagName === 'TEXTAREA' && target.name) {
      const name = target.name;
      const value = target.value;
      
      // Extrair packId e questionId do name (formato: packId_qNum_comment)
      const match = name.match(/^(.+)_q(\d+)_comment$/);
      if (match) {
        const packId = match[1];
        const questionId = `q${match[2]}`;
        
        // Buscar resposta radio correspondente
        const radio = document.querySelector(`input[name="${packId}_q${match[2]}"]:checked`);
        
        // Salvar no Firestore
        if (typeof saveAnswerToFirestore === 'function') {
          const saved = await saveAnswerToFirestore(packId, questionId, {
            answer: radio ? radio.value : null,
            comment: value
          });
          
          if (saved) {
            console.log(`💾 Autosave comment: ${packId}/${questionId}`);
          }
        }
      }
    }
  }
    // Listener para desktop (change)
  console.log('📡 Registando listener: change');
  document.addEventListener('change', async function(e) {
    console.log('🔔 Event change disparado:', e.target.type, e.target.name);
    await saveRadioAnswer(e.target);
  });
  
  // ✅ NOVO: Listener adicional para mobile (click/touchend)
  console.log('📡 Registando listener: click');
  document.addEventListener('click', async function(e) {
    console.log('🔔 Event click disparado:', e.target.type, e.target.checked);
    if (e.target.type === 'radio' && e.target.checked) {
      console.log('📱 Mobile click detectado no radio:', e.target.name, '=', e.target.value);
      await saveRadioAnswer(e.target);
    }
  });
  
  // ✅ NOVO: Fallback para touchend (dispositivos touch)
  console.log('📡 Registando listener: touchend');
  document.addEventListener('touchend', async function(e) {
    console.log('🔔 Event touchend disparado');
    const target = e.target;
    if (target.type === 'radio') {
      // Aguardar um pouco para garantir que o checked foi aplicado
      setTimeout(async () => {
        if (target.checked) {
          console.log('📱 Mobile touch detectado no radio:', target.name, '=', target.value);
          await saveRadioAnswer(target);
        }
      }, 50);
    }
  });
  
  console.log('✅ Todos os event listeners registados com sucesso!');
  
  // Listener para comentários (com debounce)
  let commentTimeout = null;
  
  document.addEventListener('input', async function(e) {
    // Debounce para não salvar a cada tecla
    clearTimeout(commentTimeout);
    commentTimeout = setTimeout(async () => {
      await saveComment(e.target);
    }, 1000); // Espera 1 segundo após parar de digitar
  });
  
  // ✅ NOVO: Listener para blur (quando sai do textarea no mobile)
  document.addEventListener('blur', async function(e) {
    clearTimeout(commentTimeout);
    await saveComment(e.target);
  }, true); // useCapture = true para pegar todos os blurs
}

// ========================================
// LOAD SAVED ANSWERS ON PACK OPEN
// ========================================
async function loadSavedAnswersForPack(packId) {
  console.log(`🔄 Tentando carregar respostas para pack: ${packId}`);
  
  if (typeof loadPackAnswersFromFirestore === 'function') {
    const answers = await loadPackAnswersFromFirestore(packId);
    
    console.log(`📦 Respostas recebidas do Firestore:`, answers);
    console.log(`📊 Número de respostas: ${Object.keys(answers || {}).length}`);
    
    if (answers && Object.keys(answers).length > 0) {
      console.log(`📥 Carregando respostas salvas para ${packId}:`, answers);
      
      let loadedCount = 0;
      
      // Preencher formulário com respostas salvas
      Object.entries(answers).forEach(([questionId, data]) => {
        const qNum = questionId.replace('q', '');
        
        console.log(`  → Processando ${questionId}:`, data);
        
        // Marcar resposta radio
        if (data.answer) {
          const radioSelector = `input[name="${packId}_q${qNum}"][value="${data.answer}"]`;
          const radio = document.querySelector(radioSelector);
          console.log(`    Procurando radio: ${radioSelector}`, radio ? '✅ Encontrado' : '❌ Não encontrado');
          
          if (radio) {
            radio.checked = true;
            loadedCount++;
            console.log(`    ✅ Radio marcado: ${data.answer}`);
          }
        }
        
        // Preencher comentário
        if (data.comment) {
          const textareaSelector = `textarea[name="${packId}_q${qNum}_comment"]`;
          const textarea = document.querySelector(textareaSelector);
          console.log(`    Procurando textarea: ${textareaSelector}`, textarea ? '✅ Encontrado' : '❌ Não encontrado');
          
          if (textarea) {
            textarea.value = data.comment;
            console.log(`    ✅ Comentário preenchido`);
          }
        }      });
      
      console.log(`✅ Total de respostas carregadas: ${loadedCount}`);
      
      // Atualizar barra de progresso dos cards
      if (typeof updateThemeProgress === 'function') {
        updateThemeProgress();
        console.log('📊 Barra de progresso atualizada');
      }
    } else {
      console.log(`ℹ️ Nenhuma resposta salva encontrada para ${packId}`);
    }
  } else {
    console.warn(`⚠️ Função loadPackAnswersFromFirestore não está disponível`);
  }
}

// ========================================
// INITIALIZATION
// ========================================
window.addEventListener('DOMContentLoaded', async function() {
  checkAgeVerification();
  attachProgressListeners();
  
  const savedType = localStorage.getItem('quest4couple_couple_type');
  if (savedType) {
    selectedCoupleType = savedType;
    document.getElementById('coupleConfig').style.display = 'none';
    document.getElementById('themesView').style.display = 'grid';
  }
  
  // Setup autosave
  setupAutosave();
  console.log('✅ Autosave ativado');
  
  // ✅ NOVO: Carregar progresso ao inicializar
  // Aguardar autenticação antes de carregar progresso
  auth.onAuthStateChanged(async (user) => {
    if (user && document.getElementById('themesView').style.display === 'grid') {
      console.log('🔄 Carregando progresso inicial...');
      
      // Carregar perguntas se ainda não carregadas
      if (!window.questionsLoaded) {
        loadAndRenderAllPacks();
        window.questionsLoaded = true;
      }
      
      // Aguardar um pouco para perguntas renderizarem
      setTimeout(async () => {
        // Carregar respostas de todos os packs do Firestore
        if (typeof loadAllAnswersFromFirestore === 'function') {
          const allAnswers = await loadAllAnswersFromFirestore();
          
          if (allAnswers) {
            // Preencher respostas em todos os packs
            const themeClasses = ['romantico', 'experiencia', 'pimentinha', 'poliamor', 'kinks'];
            
            for (const packId of themeClasses) {
              if (allAnswers[packId]) {
                const packAnswers = allAnswers[packId];
                
                Object.entries(packAnswers).forEach(([questionId, data]) => {
                  const qNum = questionId.replace('q', '');
                  
                  // Marcar radio
                  if (data.answer) {
                    const radio = document.querySelector(`input[name="${packId}_q${qNum}"][value="${data.answer}"]`);
                    if (radio) {
                      radio.checked = true;
                    }
                  }
                  
                  // Preencher comentário
                  if (data.comment) {
                    const textarea = document.querySelector(`textarea[name="${packId}_q${qNum}_comment"]`);
                    if (textarea) {
                      textarea.value = data.comment;
                    }
                  }
                });
              }
            }
              // Atualizar progresso após carregar tudo
            if (typeof updateThemeProgress === 'function') {
              updateThemeProgress();
              console.log('✅ Progresso inicial carregado e atualizado');
            }
            
            // ✅ NOVO: Inicializar sistema de collapse/expand
            if (typeof initializePackCollapse === 'function') {
              initializePackCollapse();
            }
          }
        }
      }, 500); // Aguardar 500ms para perguntas renderizarem
    }
  });
});
