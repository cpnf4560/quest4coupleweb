/* ============================================
   QUEST4COUPLE - ADMIN BACKOFFICE
   Funções para visualizar analytics completas
   ============================================ */

console.log('✅ admin-analytics.js carregado');

// ========================================
// REGENERAR RELATÓRIOS A PARTIR DAS CONEXÕES
// ========================================

/**
 * Regenera relatórios para todos os casais conectados
 * Usa as respostas guardadas no Firestore
 */
async function regenerateAllReports() {
  if (!confirm('⚠️ Isto vai gerar relatórios para TODOS os casais conectados.\n\nOs relatórios existentes NÃO serão apagados.\n\nContinuar?')) {
    return;
  }
  
  const container = document.getElementById('fullReportsContainer');
  container.innerHTML = `
    <div style="text-align: center; padding: 40px; color: #6c757d;">
      <div style="font-size: 2em; margin-bottom: 10px;">⏳</div>
      <p>Regenerando relatórios...</p>
      <p id="regenerateProgress" style="margin-top: 10px; font-size: 0.9em;">Iniciando...</p>
    </div>
  `;
  
  const progressEl = document.getElementById('regenerateProgress');
  
  try {
    const db = firebase.firestore();
    
    // 1. Buscar todas as conexões (connections não têm status, só connection_requests)
    progressEl.textContent = 'Buscando conexões...';
    
    // Primeiro tentar buscar todas as conexões
    let connectionsSnapshot;
    try {
      connectionsSnapshot = await db.collection('connections').get();
      console.log(`📊 Encontradas ${connectionsSnapshot.size} conexões no total`);
    } catch (permError) {
      console.error('❌ Erro de permissão ao buscar conexões:', permError);
      throw new Error('Sem permissão para ler conexões. Verifique as regras do Firestore.');
    }
    
    if (connectionsSnapshot.empty) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #6c757d;">
          <div style="font-size: 2em; margin-bottom: 10px;">📋</div>
          <p>Nenhuma conexão encontrada.</p>
          <p style="font-size: 0.85em; margin-top: 10px;">Os casais precisam de se conectar primeiro no dashboard.</p>
        </div>
      `;
      return;
    }
    
    // 2. Carregar dados dos packs
    progressEl.textContent = 'Carregando dados dos packs...';
    const packsResponse = await fetch('../data/packs_data_clean.json');
    const allPacksData = await packsResponse.json();
    
    const packConfigs = [
      { id: 'romantico', colorKey: 'romantico' },
      { id: 'experiencia', colorKey: 'experiencia' },
      { id: 'pimentinha', colorKey: 'pimentinha' },
      { id: 'poliamor', colorKey: 'poliamor' },
      { id: 'kinks', colorKey: 'kinks' }
    ];
    
    let generated = 0;
    let skipped = 0;
    let errors = 0;
    
    // 3. Para cada conexão, gerar relatório
    for (const connDoc of connectionsSnapshot.docs) {
      const connection = connDoc.data();
      const users = connection.users || [];
      
      if (users.length !== 2) {
        skipped++;
        continue;
      }
      
      const [userId1, userId2] = users;
      progressEl.textContent = `Processando conexão ${generated + skipped + errors + 1}/${connectionsSnapshot.size}...`;
      
      try {
        // Buscar respostas de ambos os users
        const [user1Doc, user2Doc, answers1Doc, answers2Doc] = await Promise.all([
          db.collection('users').doc(userId1).get(),
          db.collection('users').doc(userId2).get(),
          db.collection('users').doc(userId1).collection('answers').doc('all').get(),
          db.collection('users').doc(userId2).collection('answers').doc('all').get()
        ]);
        
        if (!answers1Doc.exists || !answers2Doc.exists) {
          console.log(`⚠️ Sem respostas para conexão ${connDoc.id}`);
          skipped++;
          continue;
        }
        
        const user1Data = user1Doc.exists ? user1Doc.data() : {};
        const user2Data = user2Doc.exists ? user2Doc.data() : {};
        const answers1 = answers1Doc.data() || {};
        const answers2 = answers2Doc.data() || {};
        
        // Verificar se há packs em comum
        const packs1 = Object.keys(answers1);
        const packs2 = Object.keys(answers2);
        const commonPacks = packs1.filter(p => packs2.includes(p));
        
        if (commonPacks.length === 0) {
          console.log(`⚠️ Sem packs em comum para conexão ${connDoc.id}`);
          skipped++;
          continue;
        }
        
        // Gerar dados do relatório
        const allQuestionsForAnalytics = [];
        const packIdsUsed = [];
        
        for (const packId of commonPacks) {
          const config = packConfigs.find(c => c.id === packId);
          if (!config) continue;
          
          const packData = allPacksData.find(p => p.color === config.colorKey);
          if (!packData || !packData.categories) continue;
          
          const myAnswers = answers1[packId] || {};
          const partnerAnswers = answers2[packId] || {};
          
          if (Object.keys(myAnswers).length === 0 || Object.keys(partnerAnswers).length === 0) continue;
          
          packIdsUsed.push(packId);
          const packQuestions = packData.categories.flatMap(cat => cat.questions);
          
          Object.keys(myAnswers).forEach(qKey => {
            const qIndex = parseInt(qKey.replace('q', '')) - 1;
            const question = packQuestions[qIndex];
            const myAns = myAnswers[qKey];
            const partnerAns = partnerAnswers[qKey];
            
            if (myAns && partnerAns) {
              const my = myAns.answer;
              const partner = partnerAns.answer;
              let matchType = 'hidden';
              
              if (my === 'meh' && partner === 'meh') matchType = 'hidden';
              else if (my === 'porfavor' && partner === 'porfavor') matchType = 'SUPER MATCH';
              else if ((my === 'porfavor' && partner === 'yup') || (my === 'yup' && partner === 'porfavor')) matchType = 'EXCELENTE';
              else if (my === 'yup' && partner === 'yup') matchType = 'BOM MATCH';
              else if ((my === 'porfavor' && partner === 'talvez') || (my === 'talvez' && partner === 'porfavor') ||
                       (my === 'yup' && partner === 'talvez') || (my === 'talvez' && partner === 'yup') ||
                       (my === 'talvez' && partner === 'talvez')) matchType = 'POSSÍVEL';
              else if ((my === 'porfavor' && partner === 'meh') || (my === 'meh' && partner === 'porfavor')) matchType = 'NEUTRO';
              
              if (matchType !== 'hidden') {
                allQuestionsForAnalytics.push({
                  packId: packId,
                  questionIndex: qIndex,
                  questionText: question || `Questão ${qIndex + 1}`,
                  answer1: my,
                  answer2: partner,
                  matchType: matchType,
                  isInvertMatching: false
                });
              }
            }
          });
        }
        
        if (allQuestionsForAnalytics.length === 0) {
          skipped++;
          continue;
        }
        
        // Calcular estatísticas
        const matchCounts = {
          superMatch: allQuestionsForAnalytics.filter(q => q.matchType === 'SUPER MATCH').length,
          match: allQuestionsForAnalytics.filter(q => q.matchType === 'EXCELENTE' || q.matchType === 'BOM MATCH').length,
          mismatch: allQuestionsForAnalytics.filter(q => q.matchType === 'POSSÍVEL' || q.matchType === 'NEUTRO').length
        };
        
        // Mascarar nomes
        const maskName = (name) => {
          if (!name || name.length < 2) return '***';
          return name.charAt(0) + '*'.repeat(Math.min(name.length - 2, 3)) + name.charAt(name.length - 1);
        };
        
        const userName1 = user1Data.displayName || user1Data.name || user1Data.email?.split('@')[0] || 'User1';
        const userName2 = user2Data.displayName || user2Data.name || user2Data.email?.split('@')[0] || 'User2';
        
        // Criar documento do relatório
        const fullReportData = {
          couple: {
            name1: maskName(userName1),
            name2: maskName(userName2),
            gender1: user1Data.gender || null,
            gender2: user2Data.gender || null,
            ageRange1: user1Data.ageRange || null,
            ageRange2: user2Data.ageRange || null,
            country: user1Data.country || user2Data.country || null
          },
          stats: {
            packIds: packIdsUsed,
            packCount: packIdsUsed.length,
            totalQuestions: allQuestionsForAnalytics.length,
            superMatches: matchCounts.superMatch,
            matches: matchCounts.match,
            mismatches: matchCounts.mismatch,
            invertMatchings: 0
          },
          questions: allQuestionsForAnalytics,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate(),
          regenerated: true, // Marcar como regenerado
          connectionId: connDoc.id
        };
        
        // Guardar relatório
        await db.collection('analytics_full_reports').add(fullReportData);
        generated++;
        console.log(`✅ Relatório gerado para ${userName1} + ${userName2}`);
        
      } catch (err) {
        console.error(`❌ Erro ao processar conexão ${connDoc.id}:`, err);
        errors++;
      }
    }
    
    // Mostrar resultado
    container.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 3em; margin-bottom: 15px;">✅</div>
        <h3 style="color: #28a745;">Regeneração Concluída!</h3>
        <div style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 10px;">
          <p><strong>📊 Relatórios gerados:</strong> ${generated}</p>
          <p><strong>⏭️ Ignorados (sem dados):</strong> ${skipped}</p>
          <p><strong>❌ Erros:</strong> ${errors}</p>
        </div>
        <button onclick="loadFullReports()" class="btn-primary" style="margin-top: 15px;">
          🔄 Ver Relatórios
        </button>
      </div>
    `;
    
  } catch (error) {
    console.error('❌ Erro ao regenerar relatórios:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #dc3545;">
        <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
        <p>Erro ao regenerar relatórios: ${error.message}</p>
        <button onclick="loadFullReports()" class="btn-secondary" style="margin-top: 15px;">
          ← Voltar
        </button>
      </div>
    `;
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Calcula a percentagem de compatibilidade com base nas stats do relatório
 * @param {Object} stats - Objeto com superMatches, matches, mismatches, invertMatchings
 * @returns {number} Percentagem de compatibilidade (0-100)
 */
function calculateCompatibility(stats) {
  if (!stats) return 0;
  
  const total = (stats.superMatches || 0) + (stats.matches || 0) + (stats.mismatches || 0) + (stats.invertMatchings || 0);
  
  if (total === 0) return 0;
  
  // Pontuação: superMatch = 100%, match = 100%, invertMatching = 50%, mismatch = 0%
  const score = ((stats.superMatches || 0) * 100) + 
                ((stats.matches || 0) * 100) + 
                ((stats.invertMatchings || 0) * 50) + 
                ((stats.mismatches || 0) * 0);
  
  return Math.round(score / total);
}

/**
 * Retorna o emoji da bandeira com base no país
 * @param {string} country - Nome do país
 * @returns {string} Emoji da bandeira
 */
function getCountryFlag(country) {
  if (!country) return '🌍';
  
  const flags = {
    'Portugal': '🇵🇹',
    'Brasil': '🇧🇷',
    'Brazil': '🇧🇷',
    'Espanha': '🇪🇸',
    'Spain': '🇪🇸',
    'França': '🇫🇷',
    'France': '🇫🇷',
    'Alemanha': '🇩🇪',
    'Germany': '🇩🇪',
    'Reino Unido': '🇬🇧',
    'United Kingdom': '🇬🇧',
    'Estados Unidos': '🇺🇸',
    'United States': '🇺🇸',
    'USA': '🇺🇸',
    'Itália': '🇮🇹',
    'Italy': '🇮🇹',
    'Angola': '🇦🇴',
    'Moçambique': '🇲🇿',
    'Cabo Verde': '🇨🇻'
  };
  
  return flags[country] || '🌍';
}

// ========================================
// TAB: RELATÓRIOS COMPLETOS
// ========================================

/**
 * Carrega e exibe relatórios completos
 */
async function loadFullReports(filters = {}) {
  console.log('📊 loadFullReports() chamada com filtros:', filters);
  
  const container = document.getElementById('fullReportsContainer');
  
  if (!container) {
    console.error('❌ Container fullReportsContainer não encontrado');
    return;
  }
  
  // Mostrar loading
  container.innerHTML = `
    <div style="text-align: center; padding: 40px; color: #6c757d;">
      <div style="font-size: 2em; margin-bottom: 10px;">⏳</div>
      <p>Carregando relatórios...</p>
    </div>
  `;
  
  try {
    // Verificar se Firebase está disponível
    if (typeof firebase === 'undefined' || !firebase.firestore) {
      throw new Error('Firebase não está inicializado');
    }
    
    console.log('✅ Firebase disponível');
    
    // Verificar se user está autenticado
    const user = firebase.auth().currentUser;
    console.log('👤 User autenticado:', user ? user.email : 'NÃO');
    
    if (!user) {
      throw new Error('Utilizador não autenticado');
    }
    
    // Verificar se é admin
    const db = firebase.firestore();
    const userDoc = await db.collection('users').doc(user.uid).get();
    console.log('📄 User doc exists:', userDoc.exists);
    if (userDoc.exists) {
      console.log('📄 isAdmin:', userDoc.data().isAdmin);
    }
    
    // Aplicar filtros
    let startDate = null;
    let endDate = null;
    
    if (filters.period === 'today') {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (filters.period === 'week') {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (filters.period === 'month') {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    }
    
    // Buscar relatórios diretamente do Firebase
    console.log('📊 Buscando relatórios completos...');
    let reports = [];
    
    try {
      const snapshot = await db.collection('analytics_full_reports')
        .orderBy('timestamp', 'desc')
        .limit(50)
        .get();
      
      snapshot.forEach(doc => {
        const data = doc.data();
        // Filtrar por data se necessário
        if (startDate) {
          const timestamp = data.timestamp?.toDate();
          if (timestamp && timestamp < startDate) return;
        }
        reports.push({
          id: doc.id,
          ...data
        });
      });
      
      console.log(`✅ Encontrados ${reports.length} relatórios`);
    } catch (fbError) {
      console.error('❌ Erro Firebase:', fbError);
      throw new Error(`Erro ao acessar Firebase: ${fbError.message}`);
    }
    
    // Aplicar filtro de compatibilidade
    if (filters.compatibility) {
      reports = reports.filter(report => {
        const compat = calculateCompatibility(report.stats);
        if (filters.compatibility === 'high') return compat >= 80;
        if (filters.compatibility === 'medium') return compat >= 60 && compat < 80;
        if (filters.compatibility === 'low') return compat < 60;
        return true;
      });
    }
    
    if (reports.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
          <div style="font-size: 3em; margin-bottom: 15px;">📋</div>
          <h3 style="margin-bottom: 10px;">Nenhum relatório encontrado</h3>
          <p>Ainda não foram gerados relatórios ou não há dados para o filtro selecionado.</p>
        </div>
      `;
      return;
    }
    
    // Calcular estatísticas gerais
    const reportsCount = reports.length;
    let sumQuestions = 0;
    let sumSuperMatches = 0;
    let sumMatches = 0;
    let sumCompat = 0;
    
    reports.forEach(r => {
      sumQuestions += r.stats?.totalQuestions || 0;
      sumSuperMatches += r.stats?.superMatches || 0;
      sumMatches += r.stats?.matches || 0;
      sumCompat += calculateCompatibility(r.stats);
    });
    const avgCompat = Math.round(sumCompat / reportsCount);
    
    // Renderizar relatórios - versão compacta
    let html = `
      <!-- Resumo Estatístico -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px; border-radius: 10px; text-align: center; color: white;">
          <div style="font-size: 1.4em; font-weight: 700;">${reportsCount}</div>
          <div style="font-size: 0.7em; opacity: 0.9;">Relatórios</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 10px; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
          <div style="font-size: 1.4em; font-weight: 700; color: #28a745;">${avgCompat}%</div>
          <div style="font-size: 0.7em; color: #6c757d;">Compat. Média</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 10px; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
          <div style="font-size: 1.4em; font-weight: 700; color: #ffc107;">${sumSuperMatches}</div>
          <div style="font-size: 0.7em; color: #6c757d;">⭐ Super</div>
        </div>
        <div style="background: white; padding: 12px; border-radius: 10px; text-align: center; box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
          <div style="font-size: 1.4em; font-weight: 700; color: #17a2b8;">${sumQuestions.toLocaleString('pt-PT')}</div>
          <div style="font-size: 0.7em; color: #6c757d;">Questões</div>
        </div>
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 8px;">
    `;
    
    // Numeração invertida: o mais recente é #1
    const totalReports = reports.length;
    
    reports.forEach((report, index) => {
      const reportNumber = totalReports - index; // Inverter numeração
      const date = report.timestamp?.toDate();
      const dateStr = date ? date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }) : '--/--/--';
      const timeStr = date ? date.toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit'
      }) : '--:--';
      
      const compatibilityPercentage = calculateCompatibility(report.stats);
      const countryFlag = getCountryFlag(report.couple.country);
      
      // Determinar cor da compatibilidade
      let compatColor = '#28a745'; // Verde
      let compatBg = '#d4edda';
      if (compatibilityPercentage < 60) {
        compatColor = '#dc3545'; // Vermelho
        compatBg = '#f8d7da';
      } else if (compatibilityPercentage < 80) {
        compatColor = '#fd7e14'; // Laranja
        compatBg = '#fff3cd';
      }
      
      // Determinar ícones de género
      const gender1Icon = report.couple.gender1 === 'M' ? '♂️' : report.couple.gender1 === 'F' ? '♀️' : '⚧️';
      const gender2Icon = report.couple.gender2 === 'M' ? '♂️' : report.couple.gender2 === 'F' ? '♀️' : '⚧️';
      
      html += `
        <div class="report-card" style="background: white; border-radius: 10px; padding: 12px 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); transition: all 0.2s; cursor: pointer; display: flex; align-items: center; gap: 12px; border-left: 4px solid ${compatColor};"
             onclick="showReportDetails('${report.id}')"
             onmouseover="this.style.transform='translateX(3px)'; this.style.boxShadow='0 3px 10px rgba(0,0,0,0.12)';"
             onmouseout="this.style.transform='none'; this.style.boxShadow='0 1px 4px rgba(0,0,0,0.08)';">
          
          <!-- Número e Compatibilidade -->
          <div style="min-width: 55px; text-align: center;">
            <div style="font-size: 0.7em; color: #999; margin-bottom: 2px;">#${reportNumber}</div>
            <div style="background: ${compatBg}; color: ${compatColor}; padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 0.95em;">${compatibilityPercentage}%</div>
          </div>
          
          <!-- Casal -->
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; color: #333; font-size: 0.95em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${gender1Icon} ${report.couple.name1} <span style="color: #e91e63;">❤️</span> ${report.couple.name2} ${gender2Icon}
            </div>
            <div style="font-size: 0.8em; color: #6c757d; display: flex; gap: 10px; flex-wrap: wrap; margin-top: 2px;">
              <span>${countryFlag} ${report.couple.country || 'N/A'}</span>
              <span>📅 ${dateStr}</span>
            </div>
          </div>
          
          <!-- Stats Compactas -->
          <div style="display: flex; gap: 8px; align-items: center;">
            <div style="text-align: center; min-width: 40px;" title="Super Matches">
              <div style="font-size: 0.85em;">⭐</div>
              <div style="font-size: 0.85em; font-weight: 600; color: #2e7d32;">${report.stats.superMatches}</div>
            </div>
            <div style="text-align: center; min-width: 40px;" title="Matches">
              <div style="font-size: 0.85em;">💚</div>
              <div style="font-size: 0.85em; font-weight: 600; color: #28a745;">${report.stats.matches}</div>
            </div>
            <div style="text-align: center; min-width: 40px;" title="Mismatches">
              <div style="font-size: 0.85em;">😐</div>
              <div style="font-size: 0.85em; font-weight: 600; color: #fd7e14;">${report.stats.mismatches}</div>
            </div>
            <div style="text-align: center; min-width: 40px;" title="Total Questões">
              <div style="font-size: 0.85em;">📋</div>
              <div style="font-size: 0.85em; font-weight: 600; color: #667eea;">${report.stats.totalQuestions}</div>
            </div>
          </div>
          
          <!-- Seta -->
          <div style="color: #667eea; font-size: 1em;">▶</div>
        </div>
      `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
    
  } catch (error) {
    console.error('Erro ao carregar relatórios:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #dc3545;">
        <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
        <p>Erro ao carregar relatórios.</p>
        <p style="font-size: 0.85em; color: #6c757d; margin-top: 10px;">${error.message}</p>
        <p style="font-size: 0.75em; color: #999; margin-top: 5px;">Verifique se tem permissões de admin e se a collection existe.</p>
        <button onclick="loadFullReports()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
          🔄 Tentar Novamente
        </button>
      </div>
    `;
  }
}

// ========================================
// DETALHES DO RELATÓRIO
// ========================================

/**
 * Mostra os detalhes de um relatório específico
 * @param {string} reportId - ID do relatório no Firestore
 */
async function showReportDetails(reportId) {
  const container = document.getElementById('fullReportsContainer');
  
  container.innerHTML = `
    <div style="text-align: center; padding: 40px; color: #6c757d;">
      <div style="font-size: 2em; margin-bottom: 10px;">⏳</div>
      <p>Carregando detalhes do relatório...</p>
    </div>
  `;
  
  try {
    const db = firebase.firestore();
    const doc = await db.collection('analytics_full_reports').doc(reportId).get();
    
    if (!doc.exists) {
      throw new Error('Relatório não encontrado');
    }
    
    const report = doc.data();
    const date = report.timestamp?.toDate();
    const dateStr = date ? date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Data desconhecida';
    
    const compatibilityPercentage = calculateCompatibility(report.stats);
    const countryFlag = getCountryFlag(report.couple?.country);
    
    // Determinar cor da compatibilidade
    let compatColor = '#28a745';
    if (compatibilityPercentage < 60) compatColor = '#dc3545';
    else if (compatibilityPercentage < 80) compatColor = '#fd7e14';
    
    // Ícones de género
    const gender1Icon = report.couple?.gender1 === 'M' ? '♂️' : report.couple?.gender1 === 'F' ? '♀️' : '⚧️';
    const gender2Icon = report.couple?.gender2 === 'M' ? '♂️' : report.couple?.gender2 === 'F' ? '♀️' : '⚧️';
    
    // Agrupar questões por pack
    const questionsByPack = {};
    (report.questions || []).forEach(q => {
      const packId = q.packId || 'unknown';
      if (!questionsByPack[packId]) {
        questionsByPack[packId] = [];
      }
      questionsByPack[packId].push(q);
    });
    
    const packInfo = {
      'romantico': { icon: '💕', name: 'Romântico', color: '#e91e63' },
      'experiencia': { icon: '🌍', name: 'Exploração', color: '#ff9800' },
      'pimentinha': { icon: '🌶️', name: 'Pimentinha', color: '#f44336' },
      'poliamor': { icon: '💜', name: 'Poliamor', color: '#9c27b0' },
      'kinks': { icon: '🔥', name: 'Fetiches', color: '#673ab7' }
    };
    
    // Render questões - compacto em grid
    let questionsHtml = '';
    Object.keys(questionsByPack).forEach(packId => {
      const packQuestions = questionsByPack[packId];
      const pInfo = packInfo[packId] || { icon: '📦', name: packId, color: '#667eea' };
      
      questionsHtml += `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px; padding: 8px 12px; background: ${pInfo.color}15; border-radius: 8px; border-left: 3px solid ${pInfo.color};">
            <span style="font-size: 1.1em;">${pInfo.icon}</span>
            <span style="font-weight: 600; color: ${pInfo.color};">${pInfo.name}</span>
            <span style="color: #6c757d; font-size: 0.85em;">(${packQuestions.length} questões)</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
      `;
      
      packQuestions.forEach((q, idx) => {
        const matchStyles = {
          'SUPER MATCH': { bg: '#d4edda', border: '#28a745', color: '#155724', icon: '⭐' },
          'EXCELENTE': { bg: '#d4edda', border: '#28a745', color: '#155724', icon: '💚' },
          'BOM MATCH': { bg: '#d1ecf1', border: '#17a2b8', color: '#0c5460', icon: '✅' },
          'POSSÍVEL': { bg: '#fff3cd', border: '#ffc107', color: '#856404', icon: '🤔' },
          'NEUTRO': { bg: '#f8f9fa', border: '#6c757d', color: '#495057', icon: '😐' }
        };
        const style = matchStyles[q.matchType] || { bg: '#f8f9fa', border: '#6c757d', color: '#495057', icon: '❓' };
        
        // Labels das respostas
        const answerLabels = {
          'porfavor': '🤩',
          'yup': '😊',
          'talvez': '🤔',
          'meh': '😅'
        };
        const ans1Icon = answerLabels[q.answer1] || q.answer1;
        const ans2Icon = answerLabels[q.answer2] || q.answer2;
        
        questionsHtml += `
          <div style="background: ${style.bg}; border-left: 3px solid ${style.border}; padding: 10px 12px; border-radius: 6px; font-size: 0.85em;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 6px;">
              <span style="color: ${style.color}; font-weight: 600; font-size: 0.9em;">${style.icon} ${q.matchType}</span>
              <span style="color: #6c757d; font-size: 0.8em; white-space: nowrap;">${ans1Icon} / ${ans2Icon}</span>
            </div>
            <div style="color: #333; line-height: 1.3; font-size: 0.9em; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              ${q.questionText || `Questão ${q.questionIndex + 1}`}
            </div>
          </div>
        `;
      });
      
      questionsHtml += `
          </div>
        </div>
      `;
    });
    
    // Render completo - layout compacto
    container.innerHTML = `
      <div style="margin-bottom: 15px;">
        <button onclick="loadFullReports()" style="padding: 8px 16px; background: #f8f9fa; color: #495057; border: 1px solid #dee2e6; border-radius: 6px; cursor: pointer; font-size: 0.85em;">
          ← Voltar
        </button>
      </div>
      
      <!-- Header compacto -->
      <div style="background: white; border-radius: 10px; padding: 15px 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
          <div style="display: flex; align-items: center; gap: 15px;">
            <div style="background: linear-gradient(135deg, ${compatColor}22, ${compatColor}44); padding: 10px 15px; border-radius: 10px; text-align: center; min-width: 70px;">
              <div style="font-size: 1.5em; font-weight: 700; color: ${compatColor};">${compatibilityPercentage}%</div>
              <div style="font-size: 0.7em; color: #6c757d;">Compat.</div>
            </div>
            <div>
              <h2 style="margin: 0 0 5px 0; font-size: 1.2em; color: #333;">
                ${gender1Icon} ${report.couple?.name1 || '?'} <span style="color: #e91e63;">❤️</span> ${report.couple?.name2 || '?'} ${gender2Icon}
              </h2>
              <div style="font-size: 0.85em; color: #6c757d; display: flex; gap: 12px; flex-wrap: wrap;">
                <span>${countryFlag} ${report.couple?.country || 'N/A'}</span>
                <span>📅 ${dateStr}</span>
                <span>📦 ${report.stats?.packCount || 0} packs</span>
              </div>
            </div>
          </div>
          
          <!-- Stats compactas -->
          <div style="display: flex; gap: 10px;">
            <div style="text-align: center; padding: 8px 12px; background: #d4edda; border-radius: 8px; min-width: 50px;">
              <div style="font-size: 1.1em; font-weight: 700; color: #155724;">⭐ ${report.stats?.superMatches || 0}</div>
              <div style="font-size: 0.65em; color: #155724;">Super</div>
            </div>
            <div style="text-align: center; padding: 8px 12px; background: #d1ecf1; border-radius: 8px; min-width: 50px;">
              <div style="font-size: 1.1em; font-weight: 700; color: #0c5460;">💚 ${report.stats?.matches || 0}</div>
              <div style="font-size: 0.65em; color: #0c5460;">Match</div>
            </div>
            <div style="text-align: center; padding: 8px 12px; background: #fff3cd; border-radius: 8px; min-width: 50px;">
              <div style="font-size: 1.1em; font-weight: 700; color: #856404;">😐 ${report.stats?.mismatches || 0}</div>
              <div style="font-size: 0.65em; color: #856404;">Mismatch</div>
            </div>
            <div style="text-align: center; padding: 8px 12px; background: #e2e3e5; border-radius: 8px; min-width: 50px;">
              <div style="font-size: 1.1em; font-weight: 700; color: #383d41;">📋 ${report.stats?.totalQuestions || 0}</div>
              <div style="font-size: 0.65em; color: #383d41;">Total</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Questões em grid -->
      <div style="background: white; border-radius: 10px; padding: 15px 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="margin: 0; font-size: 1em; color: #495057;">📋 Detalhes das Questões</h3>
          <button onclick="exportReportCSV('${reportId}')" style="padding: 6px 12px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.8em; font-weight: 600;">
            📊 CSV
          </button>
        </div>
        ${questionsHtml || '<p style="color: #6c757d; text-align: center;">Nenhuma questão disponível.</p>'}
      </div>
    `;
    
  } catch (error) {
    console.error('Erro ao carregar detalhes:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #dc3545;">
        <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
        <p>Erro ao carregar detalhes do relatório.</p>
        <p style="font-size: 0.85em; color: #6c757d;">${error.message}</p>
        <button onclick="loadFullReports()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
          ← Voltar
        </button>
      </div>
    `;
  }
}

// ========================================
// EXPORTAR CSV
// ========================================

/**
 * Exporta um relatório para CSV
 * @param {string} reportId - ID do relatório no Firestore
 */
async function exportReportCSV(reportId) {
  try {
    const db = firebase.firestore();
    const doc = await db.collection('analytics_full_reports').doc(reportId).get();
    
    if (!doc.exists) {
      alert('Relatório não encontrado!');
      return;
    }
    
    const report = doc.data();
    const date = report.timestamp?.toDate();
    const dateStr = date ? date.toISOString().split('T')[0] : 'unknown';
    
    // Criar CSV
    let csv = 'Pack,Questão,Texto,Resposta P1,Resposta P2,Match Type\n';
    
    (report.questions || []).forEach(q => {
      const text = (q.questionText || '').replace(/"/g, '""').replace(/\n/g, ' ');
      csv += `"${q.packId || ''}","${q.questionIndex + 1}","${text}","${q.answer1 || ''}","${q.answer2 || ''}","${q.matchType || ''}"\n`;
    });
    
    // Download
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_${report.couple?.name1 || 'p1'}_${report.couple?.name2 || 'p2'}_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ CSV exportado com sucesso');
    
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    alert('Erro ao exportar CSV: ' + error.message);
  }
}

// ========================================
// ANÁLISE DE QUESTÕES
// ========================================

/**
 * Carrega e exibe análise de questões
 * @param {string} packId - ID do pack (opcional)
 * @param {number} minResponses - Número mínimo de respostas (opcional)
 * @param {string} sortBy - Ordenação: 'responses', 'supermatch', 'match'
 */
async function loadQuestionAnalytics(packId = '', minResponses = 0, sortBy = 'responses') {
  console.log('📊 loadQuestionAnalytics() chamada:', { packId, minResponses, sortBy });
  
  const container = document.getElementById('questionAnalyticsContainer');
  
  if (!container) {
    console.error('❌ Container questionAnalyticsContainer não encontrado');
    return;
  }
  
  // Mostrar loading
  container.innerHTML = `
    <div style="text-align: center; padding: 40px; color: #6c757d;">
      <div style="font-size: 2em; margin-bottom: 10px;">⏳</div>
      <p>Carregando análise de questões...</p>
    </div>
  `;
  
  try {
    const db = firebase.firestore();
    
    // Buscar relatórios para analisar questões
    const snapshot = await db.collection('analytics_full_reports')
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();
    
    if (snapshot.empty) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
          <div style="font-size: 3em; margin-bottom: 15px;">📋</div>
          <h3 style="margin-bottom: 10px;">Nenhum dado disponível</h3>
          <p>Ainda não há relatórios para analisar.</p>
        </div>
      `;
      return;
    }
    
    // Agregar estatísticas por questão
    const questionStats = {};
    
    snapshot.forEach(doc => {
      const report = doc.data();
      const questions = report.questions || [];
      
      questions.forEach(q => {
        // Filtrar por pack se especificado
        if (packId && q.packId !== packId) return;
        
        const key = `${q.packId}_${q.questionIndex}`;
        
        if (!questionStats[key]) {
          questionStats[key] = {
            packId: q.packId,
            questionIndex: q.questionIndex,
            questionText: q.questionText,
            totalResponses: 0,
            matchTypes: {
              'SUPER MATCH': 0,
              'EXCELENTE': 0,
              'BOM MATCH': 0,
              'POSSÍVEL': 0,
              'NEUTRO': 0
            },
            answers: {
              porfavor: 0,
              yup: 0,
              talvez: 0,
              meh: 0
            }
          };
        }
        
        questionStats[key].totalResponses++;
        
        if (q.matchType && questionStats[key].matchTypes[q.matchType] !== undefined) {
          questionStats[key].matchTypes[q.matchType]++;
        }
        
        // Contar respostas individuais
        if (q.answer1) questionStats[key].answers[q.answer1] = (questionStats[key].answers[q.answer1] || 0) + 1;
        if (q.answer2) questionStats[key].answers[q.answer2] = (questionStats[key].answers[q.answer2] || 0) + 1;
      });
    });
    
    // Converter para array e filtrar por mínimo de respostas
    let questionsArray = Object.values(questionStats);
    
    if (minResponses > 0) {
      questionsArray = questionsArray.filter(q => q.totalResponses >= minResponses);
    }
    
    // Calcular percentagens para ordenação
    questionsArray.forEach(q => {
      const total = q.totalResponses;
      q.superMatchPct = total > 0 ? (q.matchTypes['SUPER MATCH'] / total) * 100 : 0;
      q.matchPct = total > 0 ? ((q.matchTypes['EXCELENTE'] + q.matchTypes['BOM MATCH'] + q.matchTypes['SUPER MATCH']) / total) * 100 : 0;
    });
    
    // Ordenar conforme o filtro
    if (sortBy === 'supermatch') {
      questionsArray.sort((a, b) => b.superMatchPct - a.superMatchPct);
    } else if (sortBy === 'match') {
      questionsArray.sort((a, b) => b.matchPct - a.matchPct);
    } else {
      // Default: por número de respostas
      questionsArray.sort((a, b) => b.totalResponses - a.totalResponses);
    }
    
    if (questionsArray.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
          <div style="font-size: 3em; margin-bottom: 15px;">🔍</div>
          <h3 style="margin-bottom: 10px;">Nenhuma questão encontrada</h3>
          <p>Não há questões com os filtros selecionados.</p>
        </div>
      `;
      return;
    }
    
    // Renderizar estatísticas
    const packColors = {
      'romantico': { bg: '#fce4ec', border: '#e91e63', icon: '💕', name: 'Romântico' },
      'experiencia': { bg: '#fff3e0', border: '#ff9800', icon: '🌍', name: 'Exploração' },
      'pimentinha': { bg: '#ffebee', border: '#f44336', icon: '🌶️', name: 'Pimentinha' },
      'poliamor': { bg: '#f3e5f5', border: '#9c27b0', icon: '💜', name: 'Poliamor' },
      'kinks': { bg: '#ede7f6', border: '#673ab7', icon: '🔥', name: 'Fetiches' }
    };
    
    // Calcular estatísticas globais
    const totalResponses = questionsArray.reduce((sum, q) => sum + q.totalResponses, 0);
    const avgSuperMatch = questionsArray.length > 0 
      ? Math.round(questionsArray.reduce((sum, q) => sum + q.superMatchPct, 0) / questionsArray.length) 
      : 0;
    const avgMatch = questionsArray.length > 0 
      ? Math.round(questionsArray.reduce((sum, q) => sum + q.matchPct, 0) / questionsArray.length) 
      : 0;
    
    // Contar questões por pack
    const packCounts = {};
    questionsArray.forEach(q => {
      packCounts[q.packId] = (packCounts[q.packId] || 0) + 1;
    });
    
    let html = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px; border-radius: 12px; text-align: center; color: white;">
          <div style="font-size: 1.8em; font-weight: 700;">${questionsArray.length}</div>
          <div style="font-size: 0.8em; opacity: 0.9;">Questões</div>
        </div>
        <div style="background: white; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="font-size: 1.8em; font-weight: 700; color: #28a745;">${totalResponses.toLocaleString('pt-PT')}</div>
          <div style="font-size: 0.8em; color: #6c757d;">Respostas Total</div>
        </div>
        <div style="background: white; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-top: 3px solid #ffc107;">
          <div style="font-size: 1.8em; font-weight: 700; color: #856404;">⭐ ${avgSuperMatch}%</div>
          <div style="font-size: 0.8em; color: #6c757d;">Média Super Match</div>
        </div>
        <div style="background: white; padding: 15px; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-top: 3px solid #28a745;">
          <div style="font-size: 1.8em; font-weight: 700; color: #28a745;">💚 ${avgMatch}%</div>
          <div style="font-size: 0.8em; color: #6c757d;">Média Match Total</div>
        </div>
      </div>
      
      <div style="margin-bottom: 20px; padding: 12px 15px; background: #f8f9fa; border-radius: 10px; display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
        <span style="color: #6c757d; font-size: 0.9em;">📦 Por pack:</span>
        ${Object.keys(packCounts).map(pid => {
          const info = packColors[pid] || { icon: '📋', name: pid, border: '#6c757d' };
          return `<span style="background: white; padding: 4px 10px; border-radius: 15px; font-size: 0.85em; color: ${info.border}; border: 1px solid ${info.border};">${info.icon} ${info.name}: <strong>${packCounts[pid]}</strong></span>`;
        }).join('')}
      </div>
    `;
    
    questionsArray.forEach((q, index) => {
      const packStyle = packColors[q.packId] || { bg: '#f5f5f5', border: '#9e9e9e', icon: '📋', name: q.packId };
      
      // Usar percentagens já calculadas
      const total = q.totalResponses;
      const superMatchPct = Math.round(q.superMatchPct);
      const matchPct = Math.round(q.matchPct - q.superMatchPct); // Match sem super
      const possiblePct = total > 0 ? Math.round(((q.matchTypes['POSSÍVEL'] + q.matchTypes['NEUTRO']) / total) * 100) : 0;
      
      html += `
        <div class="question-analytics-card" style="background: white; border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid ${packStyle.border}; transition: all 0.2s;"
             onmouseover="this.style.transform='translateX(3px)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.12)';"
             onmouseout="this.style.transform='none'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)';">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
                <span style="background: ${packStyle.bg}; padding: 3px 8px; border-radius: 12px; font-size: 0.8em; color: ${packStyle.border}; font-weight: 600;">
                  ${packStyle.icon} ${packStyle.name}
                </span>
                <span style="color: #adb5bd; font-size: 0.8em;">#${q.questionIndex + 1}</span>
              </div>
              <p style="margin: 0; color: #333; font-size: 0.95em; line-height: 1.4;">
                ${q.questionText || `Questão ${q.questionIndex + 1}`}
              </p>
            </div>
            <div style="text-align: right; min-width: 80px;">
              <div style="font-size: 1.5em; font-weight: 700; color: #667eea;">${q.totalResponses}</div>
              <div style="font-size: 0.75em; color: #6c757d;">respostas</div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px; margin-bottom: 15px;">
            <div style="text-align: center; padding: 10px; background: #e8f5e9; border-radius: 8px;">
              <div style="font-size: 1.2em; font-weight: 600; color: #2e7d32;">⭐ ${superMatchPct}%</div>
              <div style="font-size: 0.7em; color: #6c757d;">Super Match</div>
            </div>
            <div style="text-align: center; padding: 10px; background: #f1f8e9; border-radius: 8px;">
              <div style="font-size: 1.2em; font-weight: 600; color: #558b2f;">💚 ${matchPct}%</div>
              <div style="font-size: 0.7em; color: #6c757d;">Match</div>
            </div>
            <div style="text-align: center; padding: 10px; background: #fff8e1; border-radius: 8px;">
              <div style="font-size: 1.2em; font-weight: 600; color: #f57f17;">🤔 ${possiblePct}%</div>
              <div style="font-size: 0.7em; color: #6c757d;">Possível/Neutro</div>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 10px 15px; border-radius: 8px;">
            <div style="font-size: 0.8em; color: #6c757d; margin-bottom: 8px;">Distribuição de respostas:</div>
            <div style="display: flex; gap: 15px; flex-wrap: wrap; font-size: 0.85em;">
              <span>🔥 Por favor: <strong>${q.answers.porfavor || 0}</strong></span>
              <span>✅ Yup: <strong>${q.answers.yup || 0}</strong></span>
              <span>🤷 Talvez: <strong>${q.answers.talvez || 0}</strong></span>
              <span>😐 Meh: <strong>${q.answers.meh || 0}</strong></span>
            </div>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    console.log(`✅ ${questionsArray.length} questões renderizadas`);
    
  } catch (error) {
    console.error('Erro ao carregar análise de questões:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #dc3545;">
        <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
        <p>Erro ao carregar análise de questões.</p>
        <p style="font-size: 0.85em; color: #6c757d;">${error.message}</p>
      </div>
    `;
  }
}

// ========================================
// RELATÓRIOS PARCIAIS
// ========================================

/**
 * Carrega relatórios parciais (casais que geraram relatórios)
 * @param {Object} filters - Filtros opcionais
 */
async function loadPartialReports(filters = {}) {
  console.log('📝 loadPartialReports() chamada com filtros:', filters);
  
  const container = document.getElementById('partialReportsContainer');
  const statsContainer = document.getElementById('partialReportsStats');
  
  if (!container) {
    console.error('❌ Container partialReportsContainer não encontrado');
    return;
  }
  
  // Mostrar loading
  container.innerHTML = `
    <div style="text-align: center; padding: 40px; color: #6c757d;">
      <div style="font-size: 2em; margin-bottom: 10px;">⏳</div>
      <p>Carregando relatórios...</p>
    </div>
  `;
  
  try {
    const db = firebase.firestore();
    
    // Buscar relatórios
    let query = db.collection('analytics_full_reports')
      .orderBy('timestamp', 'desc')
      .limit(50);
    
    const snapshot = await query.get();
    
    if (snapshot.empty) {
      if (statsContainer) statsContainer.innerHTML = '';
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
          <div style="font-size: 3em; margin-bottom: 15px;">📋</div>
          <h3 style="margin-bottom: 10px;">Nenhum relatório encontrado</h3>
          <p>Ainda não foram gerados relatórios.</p>
        </div>
      `;
      return;
    }
    
    // Processar relatórios
    let reports = [];
    let packStats = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Filtrar por pack se especificado
      if (filters.packId) {
        const hasPackId = data.stats?.packIds?.includes(filters.packId);
        if (!hasPackId) return;
      }
      
      // Filtrar por período
      if (filters.period) {
        const timestamp = data.timestamp?.toDate();
        if (!timestamp) return;
        
        const now = new Date();
        if (filters.period === 'today') {
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (timestamp < today) return;
        } else if (filters.period === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          if (timestamp < weekAgo) return;
        } else if (filters.period === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          if (timestamp < monthAgo) return;
        }
      }
      
      reports.push({ id: doc.id, ...data });
      
      // Contar packs usados
      (data.stats?.packIds || []).forEach(pid => {
        packStats[pid] = (packStats[pid] || 0) + 1;
      });
    });
    
    // Mostrar estatísticas
    if (statsContainer) {
      const packColors = {
        'romantico': { color: '#e91e63', icon: '💕', name: 'Romântico' },
        'experiencia': { color: '#ff9800', icon: '🌍', name: 'Exploração' },
        'pimentinha': { color: '#f44336', icon: '🌶️', name: 'Pimentinha' },
        'poliamor': { color: '#9c27b0', icon: '💜', name: 'Poliamor' },
        'kinks': { color: '#673ab7', icon: '🔥', name: 'Fetiches' }
      };
      
      let statsHtml = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
          <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center;">
            <div style="font-size: 2em; font-weight: 700; color: #667eea;">${reports.length}</div>
            <div style="font-size: 0.85em; color: #6c757d;">Total Relatórios</div>
          </div>
      `;
      
      Object.keys(packStats).forEach(pid => {
        const pack = packColors[pid] || { color: '#6c757d', icon: '📋', name: pid };
        statsHtml += `
          <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; border-top: 3px solid ${pack.color};">
            <div style="font-size: 2em; font-weight: 700; color: ${pack.color};">${packStats[pid]}</div>
            <div style="font-size: 0.85em; color: #6c757d;">${pack.icon} ${pack.name}</div>
          </div>
        `;
      });
      
      statsHtml += '</div>';
      statsContainer.innerHTML = statsHtml;
    }
    
    // Renderizar relatórios
    if (reports.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #6c757d;">
          <div style="font-size: 2em; margin-bottom: 10px;">🔍</div>
          <p>Nenhum relatório encontrado para os filtros selecionados.</p>
        </div>
      `;
      return;
    }
    
    let html = '';
    
    reports.forEach((report, index) => {
      const date = report.timestamp?.toDate();
      const dateStr = date ? date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Data desconhecida';
      
      const packIds = report.stats?.packIds || [];
      const packBadges = packIds.map(pid => {
        const packColors = {
          'romantico': { bg: '#fce4ec', color: '#e91e63', icon: '💕' },
          'experiencia': { bg: '#fff3e0', color: '#ff9800', icon: '🌍' },
          'pimentinha': { bg: '#ffebee', color: '#f44336', icon: '🌶️' },
          'poliamor': { bg: '#f3e5f5', color: '#9c27b0', icon: '💜' },
          'kinks': { bg: '#ede7f6', color: '#673ab7', icon: '🔥' }
        };
        const pack = packColors[pid] || { bg: '#f5f5f5', color: '#6c757d', icon: '📋' };
        return `<span style="background: ${pack.bg}; color: ${pack.color}; padding: 3px 8px; border-radius: 12px; font-size: 0.8em;">${pack.icon} ${pid}</span>`;
      }).join(' ');
      
      html += `
        <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
            <div>
              <h4 style="margin: 0 0 5px 0; color: #495057;">
                ${report.couple?.name1 || '?'} ❤️ ${report.couple?.name2 || '?'}
              </h4>
              <p style="margin: 0; color: #6c757d; font-size: 0.85em;">${dateStr}</p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.3em; font-weight: 600; color: #667eea;">
                ${report.stats?.totalQuestions || 0} questões
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${packBadges}
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    console.log(`✅ ${reports.length} relatórios parciais renderizados`);
    
  } catch (error) {
    console.error('Erro ao carregar relatórios parciais:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #dc3545;">
        <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
        <p>Erro ao carregar relatórios.</p>
        <p style="font-size: 0.85em; color: #6c757d;">${error.message}</p>
      </div>
    `;
  }
}
