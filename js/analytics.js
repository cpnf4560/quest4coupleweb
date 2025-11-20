/* ============================================
   QUEST4COUPLE - ANALYTICS SYSTEM
   Sistema de analytics anónimo para backoffice
   ============================================ */

// ========================================
// LOG ANSWER (ANÔNIMO)
// ========================================
async function logAnswer(packId, questionId, answer, invertInfo = null) {
  try {
    const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
    
    // Dados anónimos da resposta
    const analyticsData = {
      packId: packId,
      questionId: questionId,
      answer: answer,
      hasInvertMatching: !!invertInfo,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      // Dados agregados (não identificam o user)
      userGender: null, // Será preenchido se user logado
      userAgeRange: null,
      userCountry: null,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      hour: new Date().getHours()
    };
    
    // Se user está logado, adicionar dados demográficos (não identificam pessoalmente)
    if (auth.currentUser) {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        analyticsData.userGender = userData.gender || null;
        analyticsData.userAgeRange = userData.ageRange || null;
        analyticsData.userCountry = userData.country || null;
      }
    }
    
    // Salvar no Firestore
    await db.collection('analytics_answers').add(analyticsData);
    
    console.log('📊 Analytics: Resposta registada');
    
  } catch (error) {
    console.error('❌ Erro ao registar analytics de resposta:', error);
    // Não bloquear a app se analytics falhar
  }
}

// ========================================
// LOG REPORT GENERATION (ANÔNIMO)
// ========================================
async function logReportGeneration(packIds, matchCounts) {
  try {
    const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
    
    const analyticsData = {
      packIds: packIds,
      packCount: packIds.length,
      superMatches: matchCounts.superMatch || 0,
      matches: matchCounts.match || 0,
      mismatches: matchCounts.mismatch || 0,
      totalQuestions: (matchCounts.superMatch || 0) + (matchCounts.match || 0) + (matchCounts.mismatch || 0),
      hasInvertMatching: matchCounts.invertMatching || 0,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      // Dados demográficos agregados
      couple: {
        gender1: null,
        gender2: null,
        ageRange1: null,
        ageRange2: null,
        country: null
      },
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    
    // Se user está logado, adicionar dados demográficos do casal
    if (auth.currentUser) {
      try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          analyticsData.couple.gender1 = userData.gender || null;
          analyticsData.couple.ageRange1 = userData.ageRange || null;
          analyticsData.couple.country = userData.country || null;
          
          // Tentar obter dados do parceiro (se conectado)
          if (userData.connectedTo) {
            const partnerDoc = await db.collection('users').doc(userData.connectedTo).get();
            if (partnerDoc.exists) {
              const partnerData = partnerDoc.data();
              analyticsData.couple.gender2 = partnerData.gender || null;
              analyticsData.couple.ageRange2 = partnerData.ageRange || null;
            }
          }
        }
      } catch (error) {
        console.error('Erro ao obter dados do casal:', error);
      }
    }
    
    // Salvar no Firestore
    await db.collection('analytics_reports').add(analyticsData);
    
    console.log('📊 Analytics: Relatório registado');
    
  } catch (error) {
    console.error('❌ Erro ao registar analytics de relatório:', error);
    // Não bloquear a app se analytics falhar
  }
}

// ========================================
// LOG FULL REPORT (COM NOMES MASCARADOS)
// ========================================
async function logFullReport(reportData, matchCounts, packIds) {
  try {
    const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
    
    // Máscara os nomes para anonimizar
    const maskedName1 = maskName(reportData.userName1);
    const maskedName2 = maskName(reportData.userName2);
    
    // Estrutura do relatório completo anonimizado
    const fullReportData = {
      // Nomes mascarados (ex: "C***o" e "M**a")
      couple: {
        name1: maskedName1,
        name2: maskedName2,
        gender1: null,
        gender2: null,
        ageRange1: null,
        ageRange2: null,
        country: null
      },
      
      // Estatísticas do relatório
      stats: {
        packIds: packIds,
        packCount: packIds.length,
        totalQuestions: 0,
        superMatches: matchCounts.superMatch || 0,
        matches: matchCounts.match || 0,
        mismatches: matchCounts.mismatch || 0,
        invertMatchings: matchCounts.invertMatching || 0
      },
      
      // Detalhes de cada questão (sem identificar o user)
      questions: reportData.questions || [],
      
      // Metadata
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    
    // Calcular total de questões
    fullReportData.stats.totalQuestions = 
      fullReportData.stats.superMatches + 
      fullReportData.stats.matches + 
      fullReportData.stats.mismatches;
    
    // Se user está logado, adicionar dados demográficos do casal
    if (auth.currentUser) {
      try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          fullReportData.couple.gender1 = userData.gender || null;
          fullReportData.couple.ageRange1 = userData.ageRange || null;
          fullReportData.couple.country = userData.country || null;
          
          // Tentar obter dados do parceiro
          if (userData.connectedTo) {
            const partnerDoc = await db.collection('users').doc(userData.connectedTo).get();
            if (partnerDoc.exists) {
              const partnerData = partnerDoc.data();
              fullReportData.couple.gender2 = partnerData.gender || null;
              fullReportData.couple.ageRange2 = partnerData.ageRange || null;
            }
          }
        }
      } catch (error) {
        console.error('Erro ao obter dados do casal:', error);
      }
    }
    
    // Salvar no Firestore
    await db.collection('analytics_full_reports').add(fullReportData);
    
    console.log('📊 Analytics: Relatório completo registado com nomes mascarados');
    
  } catch (error) {
    console.error('❌ Erro ao registar relatório completo:', error);
    // Não bloquear a app se analytics falhar
  }
}

// Helper: Mascarar nome (ex: "Carlos" -> "C***o")
function maskName(name) {
  if (!name || name.length < 2) return '***';
  
  const first = name.charAt(0);
  const last = name.charAt(name.length - 1);
  const middle = '*'.repeat(Math.min(name.length - 2, 3));
  
  return first + middle + last;
}

// ========================================
// LOG ACTIVITY (GENÉRICO)
// ========================================
async function logActivity(type, details = {}) {
  try {
    const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous';
    
    const activityData = {
      type: type, // 'register', 'login', 'connection', 'profile_update', etc
      details: details,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
      hour: new Date().getHours()
    };
    
    // Se user está logado, adicionar dados demográficos básicos
    if (auth.currentUser && type !== 'register') {
      try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          activityData.userGender = userData.gender || null;
          activityData.userCountry = userData.country || null;
        }
      } catch (error) {
        console.error('Erro ao obter dados do user:', error);
      }
    }
    
    // Salvar no Firestore
    await db.collection('analytics_activity').add(activityData);
    
    console.log('📊 Analytics: Atividade registada -', type);
    
  } catch (error) {
    console.error('❌ Erro ao registar analytics de atividade:', error);
    // Não bloquear a app se analytics falhar
  }
}

// ========================================
// HELPER: GET STATS (PARA BACKOFFICE)
// ========================================
async function getAnalyticsStats(startDate = null, endDate = null) {
  try {
    let query = db.collection('analytics_answers');
    
    if (startDate) {
      query = query.where('timestamp', '>=', startDate);
    }
    if (endDate) {
      query = query.where('timestamp', '<=', endDate);
    }
    
    const snapshot = await query.get();
    
    const stats = {
      totalAnswers: snapshot.size,
      byPack: {},
      byGender: { M: 0, F: 0, outro: 0, null: 0 },
      byCountry: {},
      byAnswer: {
        'Por favor!': 0,
        'OK': 0,
        'Talvez': 0,
        'Não': 0
      },
      byAgeRange: {}
    };
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // By pack
      stats.byPack[data.packId] = (stats.byPack[data.packId] || 0) + 1;
      
      // By gender
      const gender = data.userGender || 'null';
      stats.byGender[gender] = (stats.byGender[gender] || 0) + 1;
      
      // By country
      if (data.userCountry) {
        stats.byCountry[data.userCountry] = (stats.byCountry[data.userCountry] || 0) + 1;
      }
      
      // By answer
      if (stats.byAnswer[data.answer] !== undefined) {
        stats.byAnswer[data.answer]++;
      }
      
      // By age range
      if (data.userAgeRange) {
        stats.byAgeRange[data.userAgeRange] = (stats.byAgeRange[data.userAgeRange] || 0) + 1;
      }
    });
    
    return stats;
    
  } catch (error) {
    console.error('❌ Erro ao obter stats:', error);
    throw error;
  }
}

async function getReportsStats(startDate = null, endDate = null) {
  try {
    let query = db.collection('analytics_reports');
    
    if (startDate) {
      query = query.where('timestamp', '>=', startDate);
    }
    if (endDate) {
      query = query.where('timestamp', '<=', endDate);
    }
    
    const snapshot = await query.get();
    
    const stats = {
      totalReports: snapshot.size,
      totalSuperMatches: 0,
      totalMatches: 0,
      totalMismatches: 0,
      avgPacksPerReport: 0,
      byGenderCombination: {},
      byCountry: {},
      byDay: {}
    };
    
    let totalPacks = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      stats.totalSuperMatches += data.superMatches || 0;
      stats.totalMatches += data.matches || 0;
      stats.totalMismatches += data.mismatches || 0;
      totalPacks += data.packCount || 0;
      
      // Gender combination
      if (data.couple.gender1 && data.couple.gender2) {
        const combo = `${data.couple.gender1}-${data.couple.gender2}`;
        stats.byGenderCombination[combo] = (stats.byGenderCombination[combo] || 0) + 1;
      }
      
      // By country
      if (data.couple.country) {
        stats.byCountry[data.couple.country] = (stats.byCountry[data.couple.country] || 0) + 1;
      }
      
      // By day
      const date = data.timestamp?.toDate();
      if (date) {
        const dateStr = date.toLocaleDateString('pt-PT');
        stats.byDay[dateStr] = (stats.byDay[dateStr] || 0) + 1;
      }
    });
    
    stats.avgPacksPerReport = snapshot.size > 0 ? (totalPacks / snapshot.size).toFixed(1) : 0;
    
    return stats;
    
  } catch (error) {
    console.error('❌ Erro ao obter stats de relatórios:', error);
    throw error;
  }
}

// ========================================
// GET QUESTION ANALYTICS (DETALHES POR QUESTÃO)
// ========================================
async function getQuestionAnalytics(packId = null, questionId = null) {
  try {
    let query = db.collection('analytics_answers');
    
    // Filtrar por pack se especificado
    if (packId) {
      query = query.where('packId', '==', packId);
    }
    
    // Filtrar por questão se especificado
    if (questionId) {
      query = query.where('questionId', '==', questionId);
    }
    
    const snapshot = await query.get();
    
    // Estrutura para armazenar analytics por questão
    const questionStats = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const qId = `${data.packId}_${data.questionId}`;
      
      // Inicializar estrutura se não existir
      if (!questionStats[qId]) {
        questionStats[qId] = {
          packId: data.packId,
          questionId: data.questionId,
          questionText: null, // Será preenchido depois
          totalResponses: 0,
          byAnswer: {
            'Por favor!': 0,
            'OK': 0,
            'Talvez': 0,
            'Não': 0
          },
          byGender: {
            M: { 'Por favor!': 0, 'OK': 0, 'Talvez': 0, 'Não': 0, total: 0 },
            F: { 'Por favor!': 0, 'OK': 0, 'Talvez': 0, 'Não': 0, total: 0 },
            outro: { 'Por favor!': 0, 'OK': 0, 'Talvez': 0, 'Não': 0, total: 0 },
            unknown: { 'Por favor!': 0, 'OK': 0, 'Talvez': 0, 'Não': 0, total: 0 }
          },
          byAgeRange: {
            '18-25': { 'Por favor!': 0, 'OK': 0, 'Talvez': 0, 'Não': 0, total: 0 },
            '26-35': { 'Por favor!': 0, 'OK': 0, 'Talvez': 0, 'Não': 0, total: 0 },
            '36-45': { 'Por favor!': 0, 'OK': 0, 'Talvez': 0, 'Não': 0, total: 0 },
            '46-55': { 'Por favor!': 0, 'OK': 0, 'Talvez': 0, 'Não': 0, total: 0 },
            '56+': { 'Por favor!': 0, 'OK': 0, 'Talvez': 0, 'Não': 0, total: 0 },
            'unknown': { 'Por favor!': 0, 'OK': 0, 'Talvez': 0, 'Não': 0, total: 0 }
          },
          hasInvertMatching: data.hasInvertMatching || false
        };
      }
      
      const stats = questionStats[qId];
      const answer = data.answer;
      const gender = data.userGender || 'unknown';
      const ageRange = data.userAgeRange || 'unknown';
      
      // Incrementar contadores
      stats.totalResponses++;
      
      // Por resposta
      if (stats.byAnswer[answer] !== undefined) {
        stats.byAnswer[answer]++;
      }
      
      // Por género
      if (stats.byGender[gender]) {
        stats.byGender[gender][answer]++;
        stats.byGender[gender].total++;
      } else {
        stats.byGender.unknown[answer]++;
        stats.byGender.unknown.total++;
      }
      
      // Por faixa etária
      if (stats.byAgeRange[ageRange]) {
        stats.byAgeRange[ageRange][answer]++;
        stats.byAgeRange[ageRange].total++;
      } else {
        stats.byAgeRange.unknown[answer]++;
        stats.byAgeRange.unknown.total++;
      }
    });
    
    // Carregar textos das questões dos packs
    await enrichQuestionTexts(questionStats);
    
    // Converter objeto para array e ordenar por total de respostas
    const questionsArray = Object.values(questionStats).sort((a, b) => b.totalResponses - a.totalResponses);
    
    return questionsArray;
    
  } catch (error) {
    console.error('❌ Erro ao obter analytics de questões:', error);
    throw error;
  }
}

// Helper: Adicionar texto das questões
async function enrichQuestionTexts(questionStats) {
  try {
    // Obter todos os packs únicos
    const packIds = [...new Set(Object.values(questionStats).map(q => q.packId))];
    
    // Carregar packs do Firebase
    for (const packId of packIds) {
      try {
        const packDoc = await db.collection('question_packs').doc(packId).get();
        if (packDoc.exists) {
          const packData = packDoc.data();
          const questions = packData.questions || [];
          
          // Associar textos às questões
          questions.forEach((question, index) => {
            const qId = `${packId}_${index}`;
            if (questionStats[qId]) {
              questionStats[qId].questionText = question.text || question;
              questionStats[qId].packName = packData.name || 'Pack Desconhecido';
            }
          });
        }
      } catch (error) {
        console.error(`Erro ao carregar pack ${packId}:`, error);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao enriquecer textos:', error);
  }
}

// ========================================
// GET FULL REPORTS (PARA BACKOFFICE)
// ========================================
async function getFullReports(limit = 50, startDate = null, endDate = null) {
  try {
    let query = db.collection('analytics_full_reports')
      .orderBy('timestamp', 'desc')
      .limit(limit);
    
    if (startDate) {
      query = query.where('timestamp', '>=', startDate);
    }
    if (endDate) {
      query = query.where('timestamp', '<=', endDate);
    }
    
    const snapshot = await query.get();
    const reports = [];
    
    snapshot.forEach(doc => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return reports;
    
  } catch (error) {
    console.error('❌ Erro ao obter relatórios completos:', error);
    throw error;
  }
}

// ========================================
// EXPORT
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    logAnswer,
    logReportGeneration,
    logActivity,
    getAnalyticsStats,
    getReportsStats,
    logFullReport,
    getQuestionAnalytics,
    getFullReports,
    maskName
  };
}
