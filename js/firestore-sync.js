/* ============================================
   QUEST4COUPLE - FIRESTORE SYNC
   Sincronização de respostas com Firebase
   ============================================ */

// ========================================
// SAVE ANSWERS TO FIRESTORE
// ========================================
async function saveAnswerToFirestore(packId, questionId, answer) {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn('User não autenticado - usando localStorage');
      return false;
    }

    const answerData = {
      answer: answer,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('users')
      .doc(user.uid)
      .collection('answers')
      .doc('all')
      .set(
        {
          [packId]: {
            [questionId]: answerData
          }
        },
        { merge: true }
      );

    console.log(`✅ Resposta guardada no Firestore: ${packId}/${questionId}`);
    return true;
  } catch (error) {
    console.error('Erro ao guardar resposta no Firestore:', error);
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
