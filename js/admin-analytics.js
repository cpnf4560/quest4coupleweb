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
 * Busca TODAS as respostas individuais dos utilizadores
 * @param {string} packId - ID do pack (opcional)
 * @param {number} minResponses - Número mínimo de respostas (opcional)
 * @param {string} sortBy - Ordenação: 'total', 'porfavor', 'yup', 'talvez', 'meh'
 */

// Cache global para dados de questões
let questionAnalyticsCache = null;
let questionAnalyticsViewMode = 'table'; // 'table' ou 'cards'
let questionAnalyticsSortCol = 'total';
let questionAnalyticsSortDir = 'desc';

// Expor cache globalmente para poder ser limpo
window.questionAnalyticsCache = questionAnalyticsCache;

async function loadQuestionAnalytics(packId = '', minResponses = 0, sortBy = 'total', genderFilter = '', ageFilter = '') {
  console.log('📊 ========================================');
  console.log('📊 loadQuestionAnalytics() chamada com parâmetros:');
  console.log('📊 packId:', packId);
  console.log('📊 minResponses:', minResponses);
  console.log('📊 sortBy:', sortBy);
  console.log('📊 genderFilter:', genderFilter, '(tipo:', typeof genderFilter, ')');
  console.log('📊 ageFilter:', ageFilter, '(tipo:', typeof ageFilter, ')');
  console.log('📊 ========================================');
  
  // Sincronizar com cache global (pode ter sido limpo externamente)
  if (window.questionAnalyticsCache === null) {
    questionAnalyticsCache = null;
  }
  
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
      <p style="font-size: 0.85em; margin-top: 10px;" id="loadingProgress">A buscar respostas dos utilizadores...</p>
      <div style="width: 200px; height: 6px; background: #e9ecef; border-radius: 3px; margin: 15px auto 0;">
        <div id="loadingProgressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 3px; transition: width 0.3s;"></div>
      </div>
    </div>
  `;
  
  try {
    const db = firebase.firestore();
    
    // Carregar dados dos packs para ter os textos das questões
    let packsData = null;
    try {
      const response = await fetch('../data/packs_data_clean.json');
      packsData = await response.json();
    } catch (e) {
      console.warn('⚠️ Não foi possível carregar packs_data_clean.json');
    }  // VERSÃO DO CACHE - incrementar quando a estrutura mudar
    const CACHE_VERSION = 2; // v2: adicionou byAge
    
    // DEBUG: Mostrar estado do cache
    console.log('🔍 ========== DEBUG CACHE ==========');
    console.log('Cache existe?', !!questionAnalyticsCache);
    console.log('Cache length:', questionAnalyticsCache?.length);
    if (questionAnalyticsCache && questionAnalyticsCache.length > 0) {
      console.log('Primeira questão:', questionAnalyticsCache[0]);
      console.log('_cacheVersion:', questionAnalyticsCache[0]._cacheVersion);
      console.log('byAge:', questionAnalyticsCache[0].byAge);
    }
    console.log('================================');
    
    // Se não temos cache OU não tem versão OU versão errada, reconstruir
    const cacheIsValid = questionAnalyticsCache && 
                         questionAnalyticsCache.length > 0 && 
                         questionAnalyticsCache[0]._cacheVersion === CACHE_VERSION;
    
    console.log('🔍 Cache válido?', cacheIsValid);
    
    if (!cacheIsValid) {
      if (questionAnalyticsCache) {
        if (!questionAnalyticsCache[0]?.byAge) {
          console.log('⚠️ Cache desatualizado detectado (sem byAge) - Reconstruindo...');
        } else if (questionAnalyticsCache[0]._cacheVersion !== CACHE_VERSION) {
          console.log(`⚠️ Cache desatualizado detectado (versão ${questionAnalyticsCache[0]._cacheVersion || 1} -> ${CACHE_VERSION}) - Reconstruindo...`);
        }
      } else {
        console.log('📥 A construir cache de análise de questões...');
      }
      
      const progressEl = document.getElementById('loadingProgress');
      const progressBar = document.getElementById('loadingProgressBar');
        // Buscar todos os utilizadores
      const usersSnapshot = await db.collection('users').get();
      const totalUsers = usersSnapshot.size;
      let processedUsers = 0;
        // Estrutura para agregar respostas por questão
      const questionStats = {};
      
      // Contador de perguntas personalizadas encontradas
      let customQuestionsCount = 0;
      const customQuestionsMap = new Set();
      
      for (const userDoc of usersSnapshot.docs) {
        processedUsers++;
        
        // Atualizar progresso a cada utilizador
        if (progressEl) {
          progressEl.textContent = `A processar utilizador ${processedUsers} de ${totalUsers}...`;
        }
        if (progressBar) {
          progressBar.style.width = `${Math.round((processedUsers / totalUsers) * 100)}%`;
        }        try {
          // Obter género e faixa etária do utilizador
          const userData = userDoc.data();
          const userGender = userData.gender || null;
          const userAgeRange = userData.ageRange || null; // Usar ageRange em vez de age
          
          const answersDoc = await db.collection('users').doc(userDoc.id).collection('answers').doc('all').get();
          
          if (answersDoc.exists) {
            const answersData = answersDoc.data() || {};
            
            // Limites de perguntas por pack (perguntas oficiais)
            const packLimits = {
              'romantico': 50,
              'experiencia': 50,
              'pimentinha': 50,
              'poliamor': 60,
              'kinks': 90
            };
            
            // Iterar por cada pack
            Object.keys(answersData).forEach(packKey => {
              const packAnswers = answersData[packKey] || {};
              const maxQuestions = packLimits[packKey] || 50;
              
              // Iterar por cada resposta no pack
              Object.keys(packAnswers).forEach(qKey => {
                const answerData = packAnswers[qKey];
                if (!answerData || !answerData.answer) return;
                
                const questionIndex = parseInt(qKey.replace('q', '')) - 1;                // Ignorar perguntas personalizadas (índice >= máximo do pack)
                // Elas são identificáveis por terem índice maior que o limite
                if (questionIndex >= maxQuestions) {
                  // É uma pergunta personalizada - vamos ignorar na análise geral
                  // porque são específicas de cada utilizador
                  customQuestionsCount++;
                  customQuestionsMap.add(`${packKey}_q${questionIndex + 1}`);
                  return;
                }
                
                const key = `${packKey}_${questionIndex}`;
                
                if (!questionStats[key]) {
                  // Buscar texto da questão
                  let questionText = `Questão ${questionIndex + 1}`;
                  if (packsData) {
                    const packData = packsData.find(p => p.color === packKey);
                    if (packData && packData.categories) {
                      const allQuestions = packData.categories.flatMap(cat => cat.questions);
                      if (allQuestions[questionIndex]) {
                        questionText = allQuestions[questionIndex];
                      }
                    }
                  }                  questionStats[key] = {
                    packId: packKey,
                    questionIndex: questionIndex,
                    questionText: questionText,
                    total: 0,
                    porfavor: 0,
                    yup: 0,
                    talvez: 0,
                    meh: 0,
                    byGender: {}, // Guardar contadores por género
                    byAge: {} // Guardar contadores por faixa etária
                  };
                }
                
                // Contar no total geral
                questionStats[key].total++;
                const answer = answerData.answer;
                if (questionStats[key][answer] !== undefined) {
                  questionStats[key][answer]++;
                }
                  // Contar por género
                if (userGender) {
                  if (!questionStats[key].byGender[userGender]) {
                    questionStats[key].byGender[userGender] = {
                      total: 0,
                      porfavor: 0,
                      yup: 0,
                      talvez: 0,
                      meh: 0
                    };
                  }
                  questionStats[key].byGender[userGender].total++;
                  if (questionStats[key].byGender[userGender][answer] !== undefined) {
                    questionStats[key].byGender[userGender][answer]++;
                  }                }
                
                // Contar por faixa etária
                if (userAgeRange) {
                  // userAgeRange já vem no formato correto ("18-25", "26-35", etc.)
                  if (!questionStats[key].byAge[userAgeRange]) {
                    questionStats[key].byAge[userAgeRange] = {
                      total: 0,
                      porfavor: 0,
                      yup: 0,
                      talvez: 0,
                      meh: 0
                    };
                  }
                  questionStats[key].byAge[userAgeRange].total++;
                  if (questionStats[key].byAge[userAgeRange][answer] !== undefined) {
                    questionStats[key].byAge[userAgeRange][answer]++;
                  }
                }
              });
            });
          }
        } catch (e) {
          // Ignorar erros de permissão
        }      }
        questionAnalyticsCache = Object.values(questionStats);
      
      // Adicionar versão do cache a cada questão
      questionAnalyticsCache.forEach(q => {
        q._cacheVersion = CACHE_VERSION;
      });
      
      // DEBUG: Verificar se byAge foi populado
      console.log('🔍 ========== CACHE RECONSTRUÍDO ==========');
      console.log('Total de questões:', questionAnalyticsCache.length);
      if (questionAnalyticsCache.length > 0) {
        const firstQ = questionAnalyticsCache[0];
        console.log('Primeira questão:', firstQ.packId, firstQ.questionIndex);
        console.log('_cacheVersion:', firstQ._cacheVersion);
        console.log('byAge:', firstQ.byAge);
        console.log('byAge keys:', Object.keys(firstQ.byAge || {}));
        
        // Mostrar todas as faixas etárias encontradas
        const allAgeRanges = new Set();
        questionAnalyticsCache.forEach(q => {
          if (q.byAge) {
            Object.keys(q.byAge).forEach(range => allAgeRanges.add(range));
          }
        });
        console.log('Faixas etárias encontradas:', Array.from(allAgeRanges));
      }
      console.log('==========================================');
      
      // Sincronizar com variável global
      window.questionAnalyticsCache = questionAnalyticsCache;
      
      // Calcular openRate para cada questão (para permitir ordenação)
      questionAnalyticsCache.forEach(q => {
        const total = q.total || 1;
        const openScore = (q.porfavor * 3) + (q.yup * 2) + (q.talvez * 1) + (q.meh * 0);
        const maxScore = total * 3;
        q.openRate = Math.round((openScore / maxScore) * 100);
      });
      
      console.log(`✅ Cache construído: ${questionAnalyticsCache.length} questões, ${questionAnalyticsCache.reduce((sum, q) => sum + q.total, 0)} respostas`);
      
      // Log consolidado de perguntas personalizadas
      if (customQuestionsCount > 0) {
        console.log(`💡 ${customQuestionsCount} respostas a perguntas personalizadas encontradas (${customQuestionsMap.size} perguntas únicas)`);
        console.log(`📊 Perguntas personalizadas não são incluídas nas estatísticas gerais (são específicas de cada utilizador)`);
      }
    }// Aplicar filtros
    let filtered = [...questionAnalyticsCache];
    
    // Se há filtro de género, usar os dados específicos do género
    if (genderFilter) {
      console.log(`🔍 Aplicando filtro de género: "${genderFilter}"`);
      console.log(`📊 Total de questões antes do filtro: ${filtered.length}`);
      
      filtered = filtered.map(q => {
        const genderData = q.byGender && q.byGender[genderFilter];
        
        if (!genderData || genderData.total === 0) {
          return null; // Questão sem respostas deste género
        }
        
        // Criar nova questão com dados do género específico
        const filteredQ = {
          ...q,
          total: genderData.total,
          porfavor: genderData.porfavor,
          yup: genderData.yup,
          talvez: genderData.talvez,
          meh: genderData.meh
        };
        
        // Recalcular openRate para este género
        const total = filteredQ.total || 1;
        const openScore = (filteredQ.porfavor * 3) + (filteredQ.yup * 2) + (filteredQ.talvez * 1) + (filteredQ.meh * 0);
        const maxScore = total * 3;
        filteredQ.openRate = Math.round((openScore / maxScore) * 100);
        
        return filteredQ;
      }).filter(q => q !== null); // Remover questões sem dados
        console.log(`📊 Total de questões após filtro de género: ${filtered.length}`);
    }    // Se há filtro de faixa etária, usar os dados específicos da faixa
    if (ageFilter) {
      console.log(`🔍 Aplicando filtro de faixa etária: "${ageFilter}"`);
      console.log(`📊 Total de questões antes do filtro: ${filtered.length}`);
      
      // 🆕 SISTEMA DE MAPEAMENTO: Converte filtros do dropdown para faixas reais dos dados
      const ageRangeMapping = {
        '18-25': ['18-23', '18-24', '24-29'],
        '26-35': ['24-29', '25-34', '30-35'],
        '36-45': ['35-44', '36-40', '41-49'],
        '46-55': ['41-49', '50+'],
        '56+': ['50+']
      };
      
      const targetRanges = ageRangeMapping[ageFilter] || [ageFilter];
      console.log(`🗺️ Faixas reais a buscar para "${ageFilter}":`, targetRanges);
      
      filtered = filtered.map(q => {
        // Agregar dados de todas as faixas reais que correspondem ao filtro
        let aggregatedData = {
          total: 0,
          porfavor: 0,
          yup: 0,
          talvez: 0,
          meh: 0
        };
        
        targetRanges.forEach(range => {
          const rangeData = q.byAge && q.byAge[range];
          if (rangeData) {
            aggregatedData.total += rangeData.total || 0;
            aggregatedData.porfavor += rangeData.porfavor || 0;
            aggregatedData.yup += rangeData.yup || 0;
            aggregatedData.talvez += rangeData.talvez || 0;
            aggregatedData.meh += rangeData.meh || 0;
          }
        });
        
        // Debug: mostrar o que foi encontrado
        if (aggregatedData.total === 0) {
          console.log(`⚠️ Questão ${q.packId}_${q.questionIndex}: Nenhuma resposta encontrada para faixas ${targetRanges.join(', ')}`);
          return null; // Questão sem respostas desta faixa etária
        }
        
        // Criar nova questão com dados agregados da faixa etária
        const filteredQ = {
          ...q,
          total: aggregatedData.total,
          porfavor: aggregatedData.porfavor,
          yup: aggregatedData.yup,
          talvez: aggregatedData.talvez,
          meh: aggregatedData.meh
        };
        
        // Recalcular openRate para esta faixa etária
        const total = filteredQ.total || 1;
        const openScore = (filteredQ.porfavor * 3) + (filteredQ.yup * 2) + (filteredQ.talvez * 1) + (filteredQ.meh * 0);
        const maxScore = total * 3;
        filteredQ.openRate = Math.round((openScore / maxScore) * 100);
        
        return filteredQ;
      }).filter(q => q !== null); // Remover questões sem dados
      
      console.log(`📊 Total de questões após filtro de faixa etária: ${filtered.length}`);
    }
    
    if (packId) {
      filtered = filtered.filter(q => q.packId === packId);
    }
    
    if (minResponses > 0) {
      filtered = filtered.filter(q => q.total >= minResponses);
    }
    
    // Ordenar
    const sortCol = questionAnalyticsSortCol || sortBy || 'total';
    const sortDir = questionAnalyticsSortDir || 'desc';
    
    filtered.sort((a, b) => {
      const valA = a[sortCol] || 0;
      const valB = b[sortCol] || 0;
      return sortDir === 'desc' ? valB - valA : valA - valB;
    });
    
    // Calcular estatísticas globais
    const totalQuestions = filtered.length;
    const totalResponses = filtered.reduce((sum, q) => sum + q.total, 0);
    const avgPerQuestion = totalQuestions > 0 ? Math.round(totalResponses / totalQuestions) : 0;
    
    // Renderizar
    renderQuestionAnalytics(container, filtered, totalQuestions, totalResponses, avgPerQuestion);
    
  } catch (error) {
    console.error('❌ Erro ao carregar análise de questões:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #dc3545;">
        <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
        <p>Erro ao carregar análise de questões.</p>
        <p style="font-size: 0.85em; color: #6c757d;">${error.message}</p>
      </div>
    `;
  }
}

function renderQuestionAnalytics(container, data, totalQuestions, totalResponses, avgPerQuestion) {
  const packColors = {
    'romantico': { bg: '#fce4ec', border: '#e91e63', icon: '💕', name: 'Romântico' },
    'experiencia': { bg: '#fff3e0', border: '#ff9800', icon: '🌍', name: 'Exploração' },
    'pimentinha': { bg: '#ffebee', border: '#f44336', icon: '🌶️', name: 'Pimentinha' },
    'poliamor': { bg: '#f3e5f5', border: '#9c27b0', icon: '💜', name: 'Poliamor' },
    'kinks': { bg: '#ede7f6', border: '#673ab7', icon: '🔥', name: 'Fetiches' }
  };
  
  // Header com stats
  let html = `
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; text-align: center; color: white;">
        <div style="font-size: 2.2em; font-weight: 700;">${totalQuestions}</div>
        <div style="font-size: 0.9em; opacity: 0.9;">Questões</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="font-size: 2.2em; font-weight: 700; color: #28a745;">${totalResponses.toLocaleString('pt-PT')}</div>
        <div style="font-size: 0.9em; color: #6c757d;">Total Respostas</div>
      </div>
      <div style="background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="font-size: 2.2em; font-weight: 700; color: #17a2b8;">${avgPerQuestion}</div>
        <div style="font-size: 0.9em; color: #6c757d;">Média/Questão</div>
      </div>
    </div>
    
    <!-- Toggle Vista e Exportar -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <div style="display: flex; gap: 10px;">
        <button onclick="setQuestionViewMode('table')" id="btnViewTable" style="padding: 8px 16px; border: 2px solid #667eea; border-radius: 6px; background: ${questionAnalyticsViewMode === 'table' ? '#667eea' : 'white'}; color: ${questionAnalyticsViewMode === 'table' ? 'white' : '#667eea'}; cursor: pointer; font-weight: 600;">
          📋 Vista Tabela
        </button>
        <button onclick="setQuestionViewMode('cards')" id="btnViewCards" style="padding: 8px 16px; border: 2px solid #667eea; border-radius: 6px; background: ${questionAnalyticsViewMode === 'cards' ? '#667eea' : 'white'}; color: ${questionAnalyticsViewMode === 'cards' ? 'white' : '#667eea'}; cursor: pointer; font-weight: 600;">
          🃏 Vista Cards
        </button>
      </div>
      <div style="display: flex; align-items: center; gap: 15px;">
        <button onclick="exportQuestionAnalytics()" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
          📥 Exportar Todos
        </button>
        <span style="color: #6c757d; font-size: 0.85em;">👆 Clica nos cabeçalhos para ordenar</span>
      </div>
    </div>
  `;
  
  if (data.length === 0) {
    html += `
      <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
        <div style="font-size: 3em; margin-bottom: 15px;">🔍</div>
        <h3>Nenhuma questão encontrada</h3>
        <p>Tente ajustar os filtros.</p>
      </div>
    `;
    container.innerHTML = html;
    return;
  }
  
  // Vista Tabela
  if (questionAnalyticsViewMode === 'table') {
    const sortIcon = (col) => {
      if (questionAnalyticsSortCol === col) {
        return questionAnalyticsSortDir === 'desc' ? ' ▼' : ' ▲';
      }
      return ' ⇅';
    };
    
    html += `
      <div style="overflow-x: auto; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
          <thead>
            <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
              <th style="padding: 12px 10px; text-align: left; font-weight: 600;">#</th>
              <th style="padding: 12px 10px; text-align: left; font-weight: 600; cursor: pointer;" onclick="sortQuestionAnalytics('packId')">
                Pack${sortIcon('packId')}
              </th>
              <th style="padding: 12px 10px; text-align: left; font-weight: 600; max-width: 400px;">Questão</th>
              <th style="padding: 12px 10px; text-align: center; font-weight: 600; cursor: pointer; background: rgba(255,255,255,0.1);" onclick="sortQuestionAnalytics('total')">
                Total${sortIcon('total')}
              </th>
              <th style="padding: 12px 10px; text-align: center; font-weight: 600; cursor: pointer; background: rgba(255,255,255,0.15);" onclick="sortQuestionAnalytics('openRate')" title="Taxa de Abertura: Porfavor=3pts, Yup=2pts, Talvez=1pt, Meh=0pts">
                📈 Abertura${sortIcon('openRate')}
              </th>
              <th style="padding: 12px 10px; text-align: center; font-weight: 600; cursor: pointer; color: #d4edda;" onclick="sortQuestionAnalytics('porfavor')">
                🔥 Porfavor${sortIcon('porfavor')}
              </th>
              <th style="padding: 12px 10px; text-align: center; font-weight: 600; cursor: pointer; color: #d1ecf1;" onclick="sortQuestionAnalytics('yup')">
                ✅ Yup${sortIcon('yup')}
              </th>
              <th style="padding: 12px 10px; text-align: center; font-weight: 600; cursor: pointer; color: #fff3cd;" onclick="sortQuestionAnalytics('talvez')">
                🤔 Talvez${sortIcon('talvez')}
              </th>
              <th style="padding: 12px 10px; text-align: center; font-weight: 600; cursor: pointer; color: #f8d7da;" onclick="sortQuestionAnalytics('meh')">
                😐 Meh${sortIcon('meh')}
              </th>
            </tr>
          </thead>
          <tbody>
    `;
    
    data.forEach((q, idx) => {
      const pack = packColors[q.packId] || { icon: '📋', name: q.packId, border: '#6c757d' };
      const total = q.total || 1;
      const porfavorPct = Math.round((q.porfavor / total) * 100);
      const yupPct = Math.round((q.yup / total) * 100);
      const talvezPct = Math.round((q.talvez / total) * 100);
      const mehPct = Math.round((q.meh / total) * 100);
      
      // Calcular Taxa de Abertura: Porfavor=3pts, Yup=2pts, Talvez=1pt, Meh=0pts
      // Máximo teórico = total * 3 (se todos respondessem porfavor)
      const openScore = (q.porfavor * 3) + (q.yup * 2) + (q.talvez * 1) + (q.meh * 0);
      const maxScore = total * 3;
      const openRate = Math.round((openScore / maxScore) * 100);
      
      // Cor baseada na taxa de abertura
      let openRateColor = '#dc3545'; // vermelho para <30%
      let openRateBg = '#f8d7da';
      if (openRate >= 70) { openRateColor = '#28a745'; openRateBg = '#d4edda'; }
      else if (openRate >= 50) { openRateColor = '#17a2b8'; openRateBg = '#d1ecf1'; }
      else if (openRate >= 30) { openRateColor = '#ffc107'; openRateBg = '#fff3cd'; }
      
      html += `
        <tr style="border-bottom: 1px solid #eee; ${idx % 2 === 0 ? 'background: #fafafa;' : ''}">
          <td style="padding: 10px; color: #6c757d; font-weight: 600;">${idx + 1}</td>
          <td style="padding: 10px;">
            <span style="color: ${pack.border}; font-size: 1.1em;">${pack.icon}</span>
          </td>
          <td style="padding: 10px; max-width: 400px; line-height: 1.3;">
            ${q.questionText.length > 60 ? q.questionText.substring(0, 60) + '...' : q.questionText}
          </td>
          <td style="padding: 10px; text-align: center; font-weight: 700; color: #667eea; background: rgba(102,126,234,0.05);">${q.total}</td>
          <td style="padding: 10px; text-align: center;">
            <div style="background: ${openRateBg}; padding: 4px 8px; border-radius: 12px; display: inline-block;">
              <span style="color: ${openRateColor}; font-weight: 700;">${openRate}%</span>
            </div>
          </td>
          <td style="padding: 10px; text-align: center;">
            <span style="color: #28a745; font-weight: 600;">${porfavorPct}%</span>
          </td>
          <td style="padding: 10px; text-align: center;">
            <span style="color: #17a2b8; font-weight: 600;">${yupPct}%</span>
          </td>
          <td style="padding: 10px; text-align: center;">
            <span style="color: #ffc107; font-weight: 600;">${talvezPct}%</span>
          </td>
          <td style="padding: 10px; text-align: center;">
            <span style="color: #dc3545; font-weight: 600;">${mehPct}%</span>
          </td>
        </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
      </div>
    `;
  } else {
    // Vista Cards
    html += `<div style="display: grid; gap: 12px;">`;
    
    data.forEach((q, idx) => {
      const pack = packColors[q.packId] || { bg: '#f5f5f5', border: '#6c757d', icon: '📋', name: q.packId };
      const total = q.total || 1;
      const porfavorPct = Math.round((q.porfavor / total) * 100);
      const yupPct = Math.round((q.yup / total) * 100);
      const talvezPct = Math.round((q.talvez / total) * 100);
      const mehPct = Math.round((q.meh / total) * 100);
      
      // Taxa de Abertura
      const openRate = q.openRate || 0;
      let openRateColor = '#dc3545';
      let openRateBg = '#f8d7da';
      if (openRate >= 70) { openRateColor = '#28a745'; openRateBg = '#d4edda'; }
      else if (openRate >= 50) { openRateColor = '#17a2b8'; openRateBg = '#d1ecf1'; }
      else if (openRate >= 30) { openRateColor = '#ffc107'; openRateBg = '#fff3cd'; }
      
      html += `
        <div style="background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid ${pack.border};">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                <span style="background: ${pack.bg}; padding: 2px 8px; border-radius: 10px; font-size: 0.8em; color: ${pack.border};">${pack.icon} ${pack.name}</span>
                <span style="color: #adb5bd; font-size: 0.8em;">#${q.questionIndex + 1}</span>
              </div>
              <p style="margin: 0; color: #333; font-size: 0.95em;">${q.questionText}</p>
            </div>
            <div style="text-align: center; min-width: 80px;">
              <div style="font-size: 1.4em; font-weight: 700; color: #667eea;">${q.total}</div>
              <div style="font-size: 0.7em; color: #6c757d;">respostas</div>
              <div style="margin-top: 6px; background: ${openRateBg}; padding: 4px 8px; border-radius: 10px;">
                <span style="font-size: 0.85em; font-weight: 700; color: ${openRateColor};">📈 ${openRate}%</span>
              </div>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
            <div style="text-align: center; padding: 8px; background: #d4edda; border-radius: 6px;">
              <div style="font-weight: 600; color: #28a745;">🔥 ${porfavorPct}%</div>
            </div>
            <div style="text-align: center; padding: 8px; background: #d1ecf1; border-radius: 6px;">
              <div style="font-weight: 600; color: #17a2b8;">✅ ${yupPct}%</div>
            </div>
            <div style="text-align: center; padding: 8px; background: #fff3cd; border-radius: 6px;">
              <div style="font-weight: 600; color: #856404;">🤔 ${talvezPct}%</div>
            </div>
            <div style="text-align: center; padding: 8px; background: #f8d7da; border-radius: 6px;">
              <div style="font-weight: 600; color: #dc3545;">😐 ${mehPct}%</div>
            </div>
          </div>
        </div>
      `;
    });
    
    html += `</div>`;
  }
  
  container.innerHTML = html;
  console.log(`✅ ${data.length} questões renderizadas em modo ${questionAnalyticsViewMode}`);
}

function setQuestionViewMode(mode) {
  questionAnalyticsViewMode = mode;
  // Recarregar sem refazer cache
  const packId = document.getElementById('filterQuestionPack')?.value || '';
  const minResponses = parseInt(document.getElementById('filterMinResponses')?.value) || 0;
  loadQuestionAnalytics(packId, minResponses);
}

function sortQuestionAnalytics(column) {
  if (questionAnalyticsSortCol === column) {
    questionAnalyticsSortDir = questionAnalyticsSortDir === 'desc' ? 'asc' : 'desc';
  } else {
    questionAnalyticsSortCol = column;
    questionAnalyticsSortDir = 'desc';
  }
  // Recarregar sem refazer cache
  const packId = document.getElementById('filterQuestionPack')?.value || '';
  const minResponses = parseInt(document.getElementById('filterMinResponses')?.value) || 0;
  const genderFilter = document.getElementById('filterQuestionGender')?.value || '';
  loadQuestionAnalytics(packId, minResponses, column, genderFilter);
}

function exportQuestionAnalytics() {
  if (!questionAnalyticsCache || questionAnalyticsCache.length === 0) {
    alert('Não há dados para exportar.');
    return;
  }
  
  const packId = document.getElementById('filterQuestionPack')?.value || '';
  let data = [...questionAnalyticsCache];
  
  if (packId) {
    data = data.filter(q => q.packId === packId);
  }
  
  // Ordenar por total desc
  data.sort((a, b) => b.total - a.total);
  
  const csv = ['#,Pack,Questão,Total,Porfavor,Porfavor %,Yup,Yup %,Talvez,Talvez %,Meh,Meh %'];
  
  data.forEach((q, idx) => {
    const total = q.total || 1;
    const row = [
      idx + 1,
      q.packId,
      `"${q.questionText.replace(/"/g, '""')}"`,
      q.total,
      q.porfavor,
      Math.round((q.porfavor / total) * 100) + '%',
      q.yup,
      Math.round((q.yup / total) * 100) + '%',
      q.talvez,
      Math.round((q.talvez / total) * 100) + '%',
      q.meh,
      Math.round((q.meh / total) * 100) + '%'
    ];
    csv.push(row.join(','));
  });
  
  const blob = new Blob(['\ufeff' + csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `analise_questoes_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

// Limpar cache quando necessário
function clearQuestionAnalyticsCache() {
  questionAnalyticsCache = null;
  console.log('🗑️ Cache de análise de questões limpo');
}

// Forçar recarga dos dados (limpar cache e recarregar)
function forceReloadQuestionAnalytics() {
  clearQuestionAnalyticsCache();
  loadQuestionAnalyticsWithFilters();
  console.log('🔃 Análise de questões recarregada');
}

// Função chamada pelos filtros do HTML
function loadQuestionAnalyticsWithFilters() {
  const genderSelect = document.getElementById('filterQuestionGender');
  const ageSelect = document.getElementById('filterQuestionAge');
  const packId = document.getElementById('filterQuestionPack')?.value || '';
  const minResponses = parseInt(document.getElementById('filterMinResponses')?.value) || 0;
  const genderFilter = genderSelect?.value || '';
  const ageFilter = ageSelect?.value || '';
  
  console.log('🔍 ========================================');
  console.log('🔍 DEBUG: Filtros aplicados');
  console.log('🔍 Elemento select género:', genderSelect);
  console.log('🔍 Valor RAW do select género:', genderSelect?.value);
  console.log('🔍 Valor após || "":', genderFilter);
  console.log('🔍 Elemento select idade:', ageSelect);
  console.log('🔍 Valor RAW do select idade:', ageSelect?.value);
  console.log('🔍 Valor após || "":', ageFilter);
  console.log('🔍 Todas as options do select:');
  if (genderSelect) {
    Array.from(genderSelect.options).forEach((opt, i) => {
      console.log(`   ${i}: value="${opt.value}" text="${opt.text}" selected=${opt.selected}`);
    });
  }
  console.log('🔍 packId:', packId);
  console.log('🔍 minResponses:', minResponses);
  console.log('🔍 genderFilter:', genderFilter, '(length:', genderFilter.length, ')');
  console.log('🔍 ageFilter:', ageFilter, '(length:', ageFilter.length, ')');
  console.log('🔍 ========================================');
  
  loadQuestionAnalytics(packId, minResponses, 'total', genderFilter, ageFilter);
}

// Reset filtros de questões
function resetQuestionFilters() {
  const packEl = document.getElementById('filterQuestionPack');
  const minEl = document.getElementById('filterMinResponses');
  const genderEl = document.getElementById('filterQuestionGender');
  const ageEl = document.getElementById('filterQuestionAge');
  
  if (packEl) packEl.value = '';
  if (minEl) minEl.value = '0';
  if (genderEl) genderEl.value = '';
  if (ageEl) ageEl.value = '';
  
  // Reset sorting
  questionAnalyticsSortCol = 'total';
  questionAnalyticsSortDir = 'desc';
  
  loadQuestionAnalytics('', 0, 'total', '', '');
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

// ========================================
// PUBLISH PUBLIC STATISTICS
// Sistema de publicação para página pública
// Atualização agendada: 7h e 19h
// ========================================

/**
 * Publica as estatísticas para o cache público no Firestore
 * Esta função deve ser chamada manualmente ou via agendamento
 */
async function publishPublicStatistics() {
  console.log('📤 Publicando estatísticas públicas...');
  
  if (!questionAnalyticsCache || questionAnalyticsCache.length === 0) {
    console.log('⚠️ Cache de analytics vazio. A construir primeiro...');
    await loadQuestionAnalytics();
  }
  
  if (!questionAnalyticsCache || questionAnalyticsCache.length === 0) {
    console.error('❌ Não foi possível construir o cache de analytics');
    alert('❌ Erro: Não há dados para publicar');
    return;
  }
  
  try {
    const db = firebase.firestore();
    
    // Calcular total de respostas
    const totalResponses = questionAnalyticsCache.reduce((sum, q) => sum + (q.total || 0), 0);
    
    // Preparar dados para publicação (sem dados sensíveis)
    const publicData = {
      questions: questionAnalyticsCache.map(q => ({
        packId: q.packId,
        questionIndex: q.questionIndex,
        questionText: q.questionText,
        total: q.total,
        porfavor: q.porfavor,
        yup: q.yup,
        talvez: q.talvez,
        meh: q.meh,
        openRate: q.openRate,
        byGender: q.byGender || {},
        byAge: q.byAge || {}
      })),
      totalResponses: totalResponses,
      totalQuestions: questionAnalyticsCache.length,
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp(),
      version: 1
    };
    
    // Guardar no Firestore
    await db.collection('publicStatistics').doc('questionAnalytics').set(publicData);
    
    console.log(`✅ Estatísticas públicas publicadas com sucesso!`);
    console.log(`📊 ${questionAnalyticsCache.length} questões, ${totalResponses.toLocaleString('pt-PT')} respostas`);
    
    alert(`✅ Estatísticas publicadas com sucesso!\n\n📊 ${questionAnalyticsCache.length} questões\n📈 ${totalResponses.toLocaleString('pt-PT')} respostas\n\nOs dados estão agora disponíveis na página pública de estatísticas.`);
    
  } catch (error) {
    console.error('❌ Erro ao publicar estatísticas:', error);
    alert(`❌ Erro ao publicar: ${error.message}`);
  }
}

/**
 * Verifica se as estatísticas precisam ser atualizadas
 * Atualiza se: passou das 7h ou 19h desde a última atualização
 */
async function checkAndAutoPublishStatistics() {
  // ✅ Verificar autenticação PRIMEIRO, antes de qualquer chamada ao Firestore
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    console.log('📊 Auto-publicação ignorada: utilizador não autenticado');
    return;
  }
  
  const now = new Date();
  const hour = now.getHours();
  
  try {
    // Verificar última atualização no Firestore
    const db = firebase.firestore();
    const cacheDoc = await db.collection('publicStatistics').doc('questionAnalytics').get();
    
    let needsUpdate = false;
    let reason = '';
    
    if (!cacheDoc.exists) {
      needsUpdate = true;
      reason = 'Cache não existe';
    } else {
      const lastUpdate = cacheDoc.data().lastUpdate?.toDate();
      
      if (!lastUpdate) {
        needsUpdate = true;
        reason = 'Sem timestamp de última atualização';
      } else {
        // Calcular próxima atualização esperada (7h ou 19h)
        const lastUpdateHour = lastUpdate.getHours();
        const lastUpdateDate = lastUpdate.toDateString();
        const todayDate = now.toDateString();
        
        // Se é um dia diferente, precisa atualizar
        if (lastUpdateDate !== todayDate) {
          needsUpdate = true;
          reason = `Última atualização foi ontem (${lastUpdate.toLocaleString('pt-PT')})`;
        } 
        // Se passou das 7h e última foi antes das 7h de hoje
        else if (hour >= 7 && lastUpdateHour < 7) {
          needsUpdate = true;
          reason = `Passou das 7h, última às ${lastUpdateHour}h`;
        }
        // Se passou das 19h e última foi antes das 19h de hoje
        else if (hour >= 19 && lastUpdateHour < 19) {
          needsUpdate = true;
          reason = `Passou das 19h, última às ${lastUpdateHour}h`;
        }
        
        // Log informativo
        const nextUpdate = hour < 7 ? '7:00' : (hour < 19 ? '19:00' : 'amanhã às 7:00');
        console.log(`📊 Última atualização: ${lastUpdate.toLocaleString('pt-PT')} | Próxima: ${nextUpdate}`);
      }
    }
    
    if (needsUpdate) {
      console.log(`⏰ Auto-publicação necessária: ${reason}`);
      
      // Verificar se não foi publicado recentemente (evitar duplicados)
      const lastAutoKey = localStorage.getItem('lastAutoPublishStats');
      const currentKey = `${now.toDateString()}_${hour >= 19 ? 19 : (hour >= 7 ? 7 : 0)}`;
      
      if (lastAutoKey !== currentKey) {
        localStorage.setItem('lastAutoPublishStats', currentKey);
        await publishPublicStatistics();
      } else {
        console.log('⚠️ Já foi publicado recentemente nesta janela');
      }
    } else {
      console.log('✅ Estatísticas atualizadas');
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar auto-publicação:', error);
  }
}

// ✅ REMOVIDA A AUTO-VERIFICAÇÃO AO CARREGAR
// A verificação de auto-publicação agora só é feita quando chamada explicitamente
// pelo showDashboard() após confirmar que o utilizador é admin autenticado.
// Isto evita erros de permissão quando a página é acedida sem autenticação.

// Exportar funções para uso global
window.publishPublicStatistics = publishPublicStatistics;
window.checkAndAutoPublishStatistics = checkAndAutoPublishStatistics;
