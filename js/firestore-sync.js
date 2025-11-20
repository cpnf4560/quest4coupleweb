/* ============================================
   QUEST4COUPLE - FIRESTORE SYNC
   Sincronização de respostas com Firebase
   ============================================ */

// ========================================
// SYNC STATUS INDICATOR
// ========================================
function updateSyncStatus(status, message) {
  const syncStatus = document.getElementById('syncStatus');
  if (!syncStatus) return;
  
  syncStatus.style.display = 'inline-flex';
  
  // Remover classes antigas
  syncStatus.classList.remove('saved', 'saving', 'offline', 'error');
  
  // Adicionar nova classe e atualizar conteúdo
  switch(status) {
    case 'saved':
      syncStatus.classList.add('saved');
      syncStatus.innerHTML = '<span class="sync-icon">✅</span><span class="sync-text">Guardado</span>';
      // Esconder após 3 segundos
      setTimeout(() => {
        if (syncStatus.classList.contains('saved')) {
          syncStatus.style.display = 'none';
        }
      }, 3000);
      break;
      
    case 'saving':
      syncStatus.classList.add('saving');
      syncStatus.innerHTML = '<span class="sync-icon">🔄</span><span class="sync-text">A guardar...</span>';
      break;
      
    case 'offline':
      syncStatus.classList.add('offline');
      syncStatus.innerHTML = '<span class="sync-icon">📱</span><span class="sync-text">Offline</span>';
      break;
      
    case 'error':
      syncStatus.classList.add('error');
      syncStatus.innerHTML = `<span class="sync-icon">❌</span><span class="sync-text">${message || 'Erro'}</span>`;
      break;
  }
}

// ========================================
// SAVE ANSWERS TO FIRESTORE
// ========================================
async function saveAnswerToFirestore(packId, questionId, answerData) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('User não autenticado - usando localStorage');
      updateSyncStatus('offline', 'Sem login');
      return false;
    }

    // Mostrar "A guardar..."
    updateSyncStatus('saving');

    // answerData pode ser {answer: "A", comment: "texto"} ou só "A"
    // Normalizar para sempre ter o formato correto
    let normalizedData;
    if (typeof answerData === 'object' && answerData !== null) {
      normalizedData = {
        answer: answerData.answer || null,
        comment: answerData.comment || '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
    } else {
      // Se receber string direta, criar objeto
      normalizedData = {
        answer: answerData,
        comment: '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
    }

    await db.collection('users')
      .doc(user.uid)
      .collection('answers')
      .doc('all')
      .set(
        {
          [packId]: {
            [questionId]: normalizedData
          }
        },
        { merge: true }
      );

    console.log(`✅ Resposta guardada no Firestore: ${packId}/${questionId}`, normalizedData);
    
    // Mostrar "Guardado" ✅
    updateSyncStatus('saved');    // Atualizar barra de progresso após guardar
    if (typeof updateThemeProgress === 'function') {
      updateThemeProgress();
      console.log('📊 Barra de progresso atualizada após guardar');
    }
    
    // Atualizar badge de progresso das categorias
    if (typeof updateAllCategoriesProgress === 'function') {
      updateAllCategoriesProgress();
      console.log('📊 Progresso das categorias atualizado');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao guardar resposta no Firestore:', error);
    updateSyncStatus('error', 'Erro ao guardar');
    return false;
  }
}

// ========================================
// LOAD ALL ANSWERS FROM FIRESTORE
// ========================================
async function loadAllAnswersFromFirestore() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('User não autenticado');
      return {};
    }

    const doc = await db.collection('users')
      .doc(user.uid)
      .collection('answers')
      .doc('all')
      .get();

    if (doc.exists) {
      const data = doc.data();
      console.log('✅ Respostas carregadas do Firestore');
      return data;
    }

    return {};
  } catch (error) {
    console.error('Erro ao carregar respostas do Firestore:', error);
    return {};
  }
}

// ========================================
// LOAD PACK ANSWERS FROM FIRESTORE
// ========================================
async function loadPackAnswersFromFirestore(packId) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('User não autenticado');
      return {};
    }

    const doc = await db.collection('users')
      .doc(user.uid)
      .collection('answers')
      .doc('all')
      .get();

    if (doc.exists) {
      const data = doc.data();
      return data[packId] || {};
    }

    return {};
  } catch (error) {
    console.error('Erro ao carregar respostas do pack do Firestore:', error);
    return {};
  }
}

// ========================================
// REAL-TIME SYNC: Listen to answer changes
// ========================================
let currentPackListener = null;

function setupRealtimeSync(packId) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('❌ REALTIME SYNC: User não autenticado');
      return;
    }

    // Remover listener anterior se existir
    if (currentPackListener) {
      console.log('🔄 REALTIME SYNC: Removendo listener anterior');
      currentPackListener();
      currentPackListener = null;
    }

    console.log(`🔄 REALTIME SYNC: Ativando para pack "${packId}"`);
    console.log(`   👤 User: ${user.email}`);
    console.log(`   🆔 UID: ${user.uid}`);

    // Criar listener para mudanças no documento
    currentPackListener = db.collection('users')
      .doc(user.uid)
      .collection('answers')
      .doc('all')
      .onSnapshot((doc) => {
        console.log('📡 REALTIME SYNC: onSnapshot triggered!');
        
        if (!doc.exists) {
          console.log('⚠️ REALTIME SYNC: Documento "all" não existe');
          return;
        }
        
        const data = doc.data();
        console.log('📦 REALTIME SYNC: Dados completos:', data);
        
        const packAnswers = data[packId] || {};
        console.log(`⚡ REALTIME SYNC: Respostas para "${packId}":`, packAnswers);
        
        if (Object.keys(packAnswers).length === 0) {
          console.log(`⚠️ REALTIME SYNC: Nenhuma resposta em "${packId}"`);
          return;
        }
        
        // Atualizar formulário com novas respostas
        Object.entries(packAnswers).forEach(([questionId, answerData]) => {
          console.log(`  🔍 REALTIME SYNC: Processando ${questionId}:`, answerData);
          const qNum = questionId.replace('q', '');
          
          // Atualizar radio
          if (answerData.answer) {
            const radioSelector = `input[name="${packId}_q${qNum}"][value="${answerData.answer}"]`;
            console.log(`    🎯 REALTIME SYNC: Selector: ${radioSelector}`);
            
            const radio = document.querySelector(radioSelector);
            if (radio) {
              console.log(`    ✅ REALTIME SYNC: Radio encontrado! Checked: ${radio.checked}`);
              if (!radio.checked) {
                radio.checked = true;
                console.log(`    ⚡ REALTIME SYNC: Radio ATUALIZADO para: ${answerData.answer}`);
                
                // Animação visual
                const questionElement = radio.closest('.question');
                if (questionElement) {
                  questionElement.style.animation = 'pulse 0.5s ease';
                  setTimeout(() => {
                    questionElement.style.animation = '';
                  }, 500);
                }
              } else {
                console.log(`    ⏭️ REALTIME SYNC: Radio já estava marcado`);
              }
            } else {
              console.error(`    ❌ REALTIME SYNC: Radio NÃO encontrado!`);
              console.error(`       Tentou: ${radioSelector}`);
            }
          }
          
          // Atualizar comentário
          if (answerData.comment) {
            const textarea = document.querySelector(`textarea[name="${packId}_q${qNum}_comment"]`);
            if (textarea && textarea !== document.activeElement) {
              if (textarea.value !== answerData.comment) {
                textarea.value = answerData.comment;
                console.log(`    ⚡ REALTIME SYNC: Comentário atualizado`);
                
                // Animação visual
                textarea.style.borderColor = '#667eea';
                setTimeout(() => {
                  textarea.style.borderColor = '';
                }, 1000);
              }
            }          }
        });
        
        // Atualizar barra de progresso após sincronização
        if (typeof updateThemeProgress === 'function') {
          updateThemeProgress();
          console.log('📊 REALTIME SYNC: Barra de progresso atualizada');
        }
      }, (error) => {
        console.error('❌ REALTIME SYNC: Erro no listener:', error);
      });

    console.log('✅ REALTIME SYNC: Listener configurado com sucesso!');
    
    return currentPackListener;
  } catch (error) {
    console.error('❌ REALTIME SYNC: Erro ao configurar:', error);
    return null;
  }
}

function stopRealtimeSync() {
  if (currentPackListener) {
    console.log('🛑 Parando sincronização em tempo real');
    currentPackListener();
    currentPackListener = null;
  }
}

// ========================================
// DELETE PACK ANSWERS FROM FIRESTORE
// ========================================
async function deletePackAnswersFromFirestore(packId) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('User não autenticado');
      return false;
    }

    await db.collection('users')
      .doc(user.uid)
      .collection('answers')
      .doc('all')
      .update({
        [packId]: firebase.firestore.FieldValue.delete()
      });

    console.log(`✅ Respostas do pack ${packId} apagadas do Firestore`);
    return true;
  } catch (error) {
    console.error('Erro ao apagar respostas do Firestore:', error);
    return false;
  }
}

// ========================================
// SAVE CUSTOM QUESTIONS TO FIRESTORE
// ========================================
async function saveCustomQuestionsToFirestore(packId, questions) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('User não autenticado');
      return false;
    }

    await db.collection('users')
      .doc(user.uid)
      .collection('customQuestions')
      .doc(packId)
      .set({
        questions: questions,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

    console.log(`✅ Perguntas custom guardadas no Firestore: ${packId}`);
    return true;
  } catch (error) {
    console.error('Erro ao guardar perguntas custom no Firestore:', error);
    return false;
  }
}

// ========================================
// LOAD CUSTOM QUESTIONS FROM FIRESTORE
// ========================================
async function loadCustomQuestionsFromFirestore(packId) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('User não autenticado');
      return [];
    }

    const doc = await db.collection('users')
      .doc(user.uid)
      .collection('customQuestions')
      .doc(packId)
      .get();

    if (doc.exists) {
      const data = doc.data();
      return data.questions || [];
    }

    return [];
  } catch (error) {
    console.error('Erro ao carregar perguntas custom do Firestore:', error);
    return [];
  }
}

// ========================================
// MIGRATE LOCALSTORAGE TO FIRESTORE
// ========================================
async function migrateLocalStorageToFirestore() {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('User não autenticado - não é possível migrar');
      return false;
    }

    console.log('🔄 Iniciando migração de localStorage para Firestore...');

    // Migrate answers
    const answersKey = 'quest4couple_answers';
    const localAnswers = localStorage.getItem(answersKey);
    
    if (localAnswers) {
      const parsedAnswers = JSON.parse(localAnswers);
      
      // Check if there are answers to migrate
      let hasAnswers = false;
      Object.keys(parsedAnswers).forEach(packId => {
        if (parsedAnswers[packId] && Object.keys(parsedAnswers[packId]).length > 0) {
          hasAnswers = true;
        }
      });

      if (hasAnswers) {
        // Save to Firestore
        await db.collection('users')
          .doc(user.uid)
          .collection('answers')
          .doc('all')
          .set(parsedAnswers);

        console.log('✅ Respostas migradas para Firestore');
        
        // Ask user if they want to delete localStorage
        const shouldDelete = confirm(
          '✅ Respostas migradas para a cloud com sucesso!\n\n' +
          'Queres apagar as respostas locais? (Recomendado)\n' +
          'As tuas respostas estarão sempre disponíveis na cloud.'
        );

        if (shouldDelete) {
          localStorage.removeItem(answersKey);
          console.log('✅ localStorage limpo');
        }
      }
    }

    // Migrate custom questions
    const customQuestionsKey = 'quest4couple_custom';
    const localCustom = localStorage.getItem(customQuestionsKey);
    
    if (localCustom) {
      const parsedCustom = JSON.parse(localCustom);
      
      for (const packId in parsedCustom) {
        if (parsedCustom[packId] && parsedCustom[packId].length > 0) {
          await db.collection('users')
            .doc(user.uid)
            .collection('customQuestions')
            .doc(packId)
            .set({
              questions: parsedCustom[packId],
              updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
      }

      console.log('✅ Perguntas custom migradas para Firestore');
      localStorage.removeItem(customQuestionsKey);
    }

    return true;
  } catch (error) {
    console.error('Erro ao migrar dados:', error);
    return false;
  }
}

// ========================================
// HYBRID STORAGE (FALLBACK)
// ========================================
// Se Firestore falhar, usa localStorage como backup

async function saveAnswer(packId, questionId, answer) {
  // Try Firestore first
  const firestoreSaved = await saveAnswerToFirestore(packId, questionId, answer);
  
  if (!firestoreSaved) {
    // Fallback to localStorage
    console.log('⚠️ Usando localStorage como backup');
    const key = 'quest4couple_answers';
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    
    if (!data[packId]) data[packId] = {};
    data[packId][questionId] = {
      answer: answer,
      timestamp: Date.now()
    };
    
    localStorage.setItem(key, JSON.stringify(data));
  }
  
  // Log analytics (não bloqueia se falhar)
  try {
    if (typeof logAnswer === 'function') {
      await logAnswer(packId, questionId, answer);
    }
  } catch (error) {
    console.log('Analytics error (ignorado):', error);
  }
}

async function loadPackAnswers(packId) {
  // Try Firestore first
  const firestoreAnswers = await loadPackAnswersFromFirestore(packId);
  
  if (firestoreAnswers && Object.keys(firestoreAnswers).length > 0) {
    return firestoreAnswers;
  }
  
  // Fallback to localStorage
  console.log('⚠️ Carregando de localStorage');
  const key = 'quest4couple_answers';
  const data = JSON.parse(localStorage.getItem(key) || '{}');
  return data[packId] || {};
}

// ========================================
// EXPORT FUNCTIONS
// ========================================
window.FirestoreSync = {
  saveAnswer: saveAnswerToFirestore,
  loadAllAnswers: loadAllAnswersFromFirestore,
  loadPackAnswers: loadPackAnswersFromFirestore,
  deletePackAnswers: deletePackAnswersFromFirestore,
  saveCustomQuestions: saveCustomQuestionsToFirestore,
  loadCustomQuestions: loadCustomQuestionsFromFirestore,
  migrate: migrateLocalStorageToFirestore,
  
  // Hybrid functions
  hybridSave: saveAnswer,
  hybridLoad: loadPackAnswers
};

console.log('✅ Firestore Sync inicializado');
