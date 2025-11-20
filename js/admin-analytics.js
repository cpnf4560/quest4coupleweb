/* ============================================
   QUEST4COUPLE - ADMIN BACKOFFICE
   Funções para visualizar analytics completas
   ============================================ */

// ========================================
// TAB: RELATÓRIOS COMPLETOS
// ========================================

/**
 * Carrega e exibe relatórios completos
 */
async function loadFullReports(filters = {}) {
  const container = document.getElementById('fullReportsContainer');
  
  if (!container) return;
  
  // Mostrar loading
  container.innerHTML = `
    <div style="text-align: center; padding: 40px; color: #6c757d;">
      <div style="font-size: 2em; margin-bottom: 10px;">⏳</div>
      <p>Carregando relatórios...</p>
    </div>
  `;
  
  try {
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
      // Buscar relatórios do Firebase
    let reports = await getFullReports(50, startDate, endDate);
    
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
    
    // Renderizar relatórios
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
      
      const compatibilityPercentage = calculateCompatibility(report.stats);
      const countryFlag = getCountryFlag(report.couple.country);
      
      html += `
        <div class="report-card" style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: all 0.3s; cursor: pointer;" onclick="showReportDetails('${report.id}')">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
            <div>
              <h3 style="margin: 0 0 8px 0; font-size: 1.2em; color: #495057;">
                #${index + 1} • ${report.couple.name1} ❤️ ${report.couple.name2}
              </h3>
              <p style="margin: 0; color: #6c757d; font-size: 0.9em;">
                ${dateStr}
              </p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 1.8em; font-weight: 700; color: #667eea; margin-bottom: 5px;">
                ${compatibilityPercentage}%
              </div>
              <span style="font-size: 0.85em; color: #6c757d;">Compatibilidade</span>
            </div>
          </div>
          
          <div style="display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap;">
            <span style="background: #f8f9fa; padding: 6px 12px; border-radius: 6px; font-size: 0.85em; color: #495057;">
              ${countryFlag} ${report.couple.country || 'País desconhecido'}
            </span>
            <span style="background: #f8f9fa; padding: 6px 12px; border-radius: 6px; font-size: 0.85em; color: #495057;">
              👤 ${report.couple.gender1 || '?'} / ${report.couple.gender2 || '?'}
            </span>
            <span style="background: #f8f9fa; padding: 6px 12px; border-radius: 6px; font-size: 0.85em; color: #495057;">
              🎂 ${report.couple.ageRange1 || '?'} / ${report.couple.ageRange2 || '?'}
            </span>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 15px;">
            <div style="text-align: center; padding: 10px; background: #f1f8f1; border-radius: 8px;">
              <div style="font-size: 1.5em;">⭐</div>
              <div style="font-weight: 600; color: #2e7d32;">${report.stats.superMatches}</div>
              <div style="font-size: 0.75em; color: #6c757d;">Super Matches</div>
            </div>
            <div style="text-align: center; padding: 10px; background: #f1f8f1; border-radius: 8px;">
              <div style="font-size: 1.5em;">💚</div>
              <div style="font-weight: 600; color: #2e7d32;">${report.stats.matches}</div>
              <div style="font-size: 0.75em; color: #6c757d;">Matches</div>
            </div>
            <div style="text-align: center; padding: 10px; background: #fff3e0; border-radius: 8px;">
              <div style="font-size: 1.5em;">😐</div>
              <div style="font-weight: 600; color: #e65100;">${report.stats.mismatches}</div>
              <div style="font-size: 0.75em; color: #6c757d;">Mismatches</div>
            </div>
            <div style="text-align: center; padding: 10px; background: #e3f2fd; border-radius: 8px;">
              <div style="font-size: 1.5em;">📋</div>
              <div style="font-weight: 600; color: #1565c0;">${report.stats.totalQuestions}</div>
              <div style="font-size: 0.75em; color: #6c757d;">Questões</div>
            </div>
          </div>
          
          <div style="display: flex; gap: 10px;">
            <button onclick="event.stopPropagation(); showReportDetails('${report.id}')" style="flex: 1; padding: 10px; background: #667eea; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.9em;">
              📋 Ver Detalhes
            </button>
            <button onclick="event.stopPropagation(); exportReportCSV('${report.id}')" style="padding: 10px 20px; background: white; color: #667eea; border: 2px solid #667eea; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.9em;">
              📊 CSV
            </button>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
  } catch (error) {
    console.error('Erro ao carregar relatórios:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #dc3545;">
        <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
        <p>Erro ao carregar relatórios.</p>
        <button onclick="loadFullReports()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
          🔄 Tentar Novamente
        </button>
      </div>
    `;
  }
}

/**
 * Mostra detalhes de um relatório específico (modal)
 */
async function showReportDetails(reportId) {
  // Criar modal
  const modal = document.createElement('div');
  modal.id = 'reportModal';
  modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px;';
  
  modal.innerHTML = `
    <div style="background: white; border-radius: 12px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
      <div style="text-align: center; padding: 40px; color: #6c757d;">
        <div style="font-size: 2em; margin-bottom: 10px;">⏳</div>
        <p>Carregando detalhes...</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Fechar modal ao clicar fora
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
  
  try {
    // Buscar relatório do Firebase
    const db = firebase.firestore();
    const doc = await db.collection('analytics_full_reports').doc(reportId).get();
    
    if (!doc.exists) {
      throw new Error('Relatório não encontrado');
    }
    
    const report = { id: doc.id, ...doc.data() };
    
    const date = report.timestamp?.toDate();
    const dateStr = date ? date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'Data desconhecida';
    
    const compatibilityPercentage = calculateCompatibility(report.stats);
    const countryFlag = getCountryFlag(report.couple.country);
    
    // Agrupar questões por pack
    const questionsByPack = {};
    report.questions.forEach(q => {
      if (!questionsByPack[q.packId]) {
        questionsByPack[q.packId] = [];
      }
      questionsByPack[q.packId].push(q);
    });
    
    // Renderizar questões por pack
    let questionsHtml = '';
    Object.entries(questionsByPack).forEach(([packId, questions]) => {
      const packNames = {
        'romantico': 'Pack Romântico',
        'experiencia': 'Exploração e Aventura',
        'pimentinha': 'Pimentinha',
        'poliamor': 'Poliamor',
        'kinks': 'Fetiches'
      };
      
      questionsHtml += `
        <div style="margin-bottom: 30px;">
          <h4 style="color: #667eea; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e0e0e0;">
            ${packNames[packId] || packId} (${questions.length} questões)
          </h4>
      `;
      
      questions.forEach((q, index) => {
        const matchColor = getMatchColor(q.matchType);
        const invertBadge = q.isInvertMatching ? '<span style="background: #667eea; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.75em; margin-left: 10px;">🔄 INVERT</span>' : '';
        
        questionsHtml += `
          <div style="background: #f8f9fa; border-left: 4px solid ${matchColor}; padding: 15px; margin-bottom: 12px; border-radius: 6px;">
            <p style="margin: 0 0 10px 0; font-weight: 600; color: #495057;">
              ${index + 1}. ${q.questionText}
              ${invertBadge}
            </p>
            <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 15px; align-items: center;">
              <div style="text-align: center; padding: 10px; background: white; border-radius: 6px;">
                <div style="font-size: 0.85em; color: #6c757d; margin-bottom: 5px;">${report.couple.name1}</div>
                <div style="font-weight: 600; color: #495057;">${q.answer1}</div>
              </div>
              <div style="font-size: 1.5em;">↔️</div>
              <div style="text-align: center; padding: 10px; background: white; border-radius: 6px;">
                <div style="font-size: 0.85em; color: #6c757d; margin-bottom: 5px;">${report.couple.name2}</div>
                <div style="font-weight: 600; color: #495057;">${q.answer2}</div>
              </div>
            </div>
            <div style="text-align: center; margin-top: 10px;">
              <span style="background: ${matchColor}; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.85em; font-weight: 600;">
                ${q.matchType}
              </span>
            </div>
          </div>
        `;
      });
      
      questionsHtml += `</div>`;
    });
    
    // Atualizar modal com conteúdo
    modal.innerHTML = `
      <div style="background: white; border-radius: 12px; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #e0e0e0;">
          <div>
            <h2 style="margin: 0 0 10px 0; color: #495057;">
              ${report.couple.name1} ❤️ ${report.couple.name2}
            </h2>
            <p style="margin: 0; color: #6c757d; font-size: 0.9em;">
              ${countryFlag} ${report.couple.country || 'País desconhecido'} • ${dateStr}
            </p>
          </div>
          <button onclick="document.body.removeChild(document.getElementById('reportModal'))" style="background: #dc3545; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; font-size: 1.2em; cursor: pointer; display: flex; align-items: center; justify-content: center;">
            ✕
          </button>
        </div>
        
        <!-- Stats -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 30px;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; box-shadow: 0 4px 15px rgba(102,126,234,0.3);">
            <div style="font-size: 2.5em; font-weight: 700; margin-bottom: 5px;">${compatibilityPercentage}%</div>
            <div style="font-size: 0.9em; opacity: 0.9;">Compatibilidade</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #f1f8f1; border-radius: 12px;">
            <div style="font-size: 2em; margin-bottom: 5px;">⭐</div>
            <div style="font-size: 1.5em; font-weight: 600; color: #2e7d32; margin-bottom: 5px;">${report.stats.superMatches}</div>
            <div style="font-size: 0.85em; color: #6c757d;">Super Matches</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #f1f8f1; border-radius: 12px;">
            <div style="font-size: 2em; margin-bottom: 5px;">💚</div>
            <div style="font-size: 1.5em; font-weight: 600; color: #2e7d32; margin-bottom: 5px;">${report.stats.matches}</div>
            <div style="font-size: 0.85em; color: #6c757d;">Matches</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #fff3e0; border-radius: 12px;">
            <div style="font-size: 2em; margin-bottom: 5px;">😐</div>
            <div style="font-size: 1.5em; font-weight: 600; color: #e65100; margin-bottom: 5px;">${report.stats.mismatches}</div>
            <div style="font-size: 0.85em; color: #6c757d;">Mismatches</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #e3f2fd; border-radius: 12px;">
            <div style="font-size: 2em; margin-bottom: 5px;">📋</div>
            <div style="font-size: 1.5em; font-weight: 600; color: #1565c0; margin-bottom: 5px;">${report.stats.totalQuestions}</div>
            <div style="font-size: 0.85em; color: #6c757d;">Questões</div>
          </div>
        </div>
        
        <!-- Questions -->
        <div>
          <h3 style="color: #495057; margin-bottom: 20px;">📋 Questões do Relatório</h3>
          ${questionsHtml}
        </div>
        
        <!-- Actions -->
        <div style="display: flex; gap: 10px; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0;">
          <button onclick="exportReportPDF('${report.id}')" style="flex: 1; padding: 12px; background: #667eea; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
            📄 Exportar PDF
          </button>
          <button onclick="exportReportCSV('${report.id}')" style="flex: 1; padding: 12px; background: white; color: #667eea; border: 2px solid #667eea; border-radius: 6px; font-weight: 600; cursor: pointer;">
            📊 Exportar CSV
          </button>
          <button onclick="document.body.removeChild(document.getElementById('reportModal'))" style="padding: 12px 25px; background: #6c757d; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
            Fechar
          </button>
        </div>
      </div>
    `;
    
  } catch (error) {
    console.error('Erro ao carregar detalhes:', error);
    modal.innerHTML = `
      <div style="background: white; border-radius: 12px; max-width: 500px; width: 100%; padding: 40px; text-align: center;">
        <div style="font-size: 3em; margin-bottom: 15px;">❌</div>
        <h3 style="color: #dc3545; margin-bottom: 15px;">Erro ao carregar detalhes</h3>
        <p style="color: #6c757d; margin-bottom: 20px;">${error.message}</p>
        <button onclick="document.body.removeChild(document.getElementById('reportModal'))" style="padding: 12px 25px; background: #667eea; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
          Fechar
        </button>
      </div>
    `;
  }
}

// ========================================
// TAB: ANALYTICS POR QUESTÃO
// ========================================

/**
 * Carrega e exibe analytics por questão
 */
async function loadQuestionAnalytics(packId = null, minResponses = 0) {
  const container = document.getElementById('questionAnalyticsContainer');
  
  if (!container) return;
  
  // Mostrar loading
  container.innerHTML = `
    <div style="text-align: center; padding: 40px; color: #6c757d;">
      <div style="font-size: 2em; margin-bottom: 10px;">⏳</div>
      <p>Analisando questões...</p>
    </div>
  `;
  
  try {
    // Buscar analytics do Firebase
    let questions = await getQuestionAnalytics(packId);
    
    // Aplicar filtro de mínimo de respostas
    if (minResponses > 0) {
      questions = questions.filter(q => q.totalResponses >= minResponses);
    }
    
    if (questions.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
          <div style="font-size: 3em; margin-bottom: 15px;">📊</div>
          <h3 style="margin-bottom: 10px;">Nenhuma questão com respostas</h3>
          <p>Ainda não há dados suficientes para exibir analytics.</p>
        </div>
      `;
      return;
    }
    
    // Renderizar questões
    let html = '';
    
    questions.forEach((q, index) => {
      const total = q.totalResponses;
      const porfavor = q.byAnswer['Por favor!'] || 0;
      const ok = q.byAnswer['OK'] || 0;
      const talvez = q.byAnswer['Talvez'] || 0;
      const nao = q.byAnswer['Não'] || 0;
      
      const pctPorfavor = total > 0 ? ((porfavor / total) * 100).toFixed(1) : 0;
      const pctOK = total > 0 ? ((ok / total) * 100).toFixed(1) : 0;
      const pctTalvez = total > 0 ? ((talvez / total) * 100).toFixed(1) : 0;
      const pctNao = total > 0 ? ((nao / total) * 100).toFixed(1) : 0;
      
      const invertBadge = q.hasInvertMatching ? '<span style="background: #667eea; color: white; padding: 2px 8px; border-radius: 4px; font-size: 0.7em; margin-left: 10px;">🔄 INVERT</span>' : '';
      
      html += `
        <div class="question-analytics-card" style="background: white; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="background: #667eea; color: white; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 0.85em;">
                  #${index + 1}
                </span>
                <span style="color: #6c757d; font-size: 0.9em;">
                  ${q.packName || q.packId}
                </span>
                ${invertBadge}
              </div>
              <h3 style="margin: 0; font-size: 1.1em; color: #495057;">
                ${q.questionText || 'Texto não disponível'}
              </h3>
            </div>
            <div style="text-align: right; min-width: 100px;">
              <div style="font-size: 1.8em; font-weight: 700; color: #667eea;">${total}</div>
              <div style="font-size: 0.75em; color: #6c757d;">respostas</div>
            </div>
          </div>
          
          <!-- Distribuição Geral -->
          <div style="margin-bottom: 20px;">
            <h4 style="color: #495057; font-size: 0.95em; margin-bottom: 12px;">📊 Distribuição Geral</h4>
            
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 0.9em; color: #495057;">💖 Por favor!</span>
                <span style="font-weight: 600; color: #2e7d32;">${pctPorfavor}% (${porfavor})</span>
              </div>
              <div style="background: #e0e0e0; border-radius: 10px; height: 8px; overflow: hidden;">
                <div style="background: #4caf50; height: 100%; width: ${pctPorfavor}%; transition: width 0.3s;"></div>
              </div>
            </div>
            
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 0.9em; color: #495057;">👍 OK</span>
                <span style="font-weight: 600; color: #2e7d32;">${pctOK}% (${ok})</span>
              </div>
              <div style="background: #e0e0e0; border-radius: 10px; height: 8px; overflow: hidden;">
                <div style="background: #8bc34a; height: 100%; width: ${pctOK}%; transition: width 0.3s;"></div>
              </div>
            </div>
            
            <div style="margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 0.9em; color: #495057;">🤷 Talvez</span>
                <span style="font-weight: 600; color: #fb8c00;">${pctTalvez}% (${talvez})</span>
              </div>
              <div style="background: #e0e0e0; border-radius: 10px; height: 8px; overflow: hidden;">
                <div style="background: #ffa726; height: 100%; width: ${pctTalvez}%; transition: width 0.3s;"></div>
              </div>
            </div>
            
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                <span style="font-size: 0.9em; color: #495057;">❌ Não</span>
                <span style="font-weight: 600; color: #d32f2f;">${pctNao}% (${nao})</span>
              </div>
              <div style="background: #e0e0e0; border-radius: 10px; height: 8px; overflow: hidden;">
                <div style="background: #f44336; height: 100%; width: ${pctNao}%; transition: width 0.3s;"></div>
              </div>
            </div>
          </div>
          
          <!-- Por Género -->
          <div style="margin-bottom: 20px;">
            <h4 style="color: #495057; font-size: 0.95em; margin-bottom: 12px;">👥 Por Género</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
              ${renderGenderStats(q.byGender.M, '👨 Homens')}
              ${renderGenderStats(q.byGender.F, '👩 Mulheres')}
              ${q.byGender.outro.total > 0 ? renderGenderStats(q.byGender.outro, '🧑 Outro') : ''}
            </div>
          </div>
          
          <!-- Por Idade -->
          <div>
            <h4 style="color: #495057; font-size: 0.95em; margin-bottom: 12px;">🎂 Por Faixa Etária</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
              ${renderAgeRangeStats(q.byAgeRange)}
            </div>
          </div>
          
          <!-- Action Button -->
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
            <button onclick="exportQuestionCSV('${q.packId}', '${q.questionId}')" style="width: 100%; padding: 10px; background: white; color: #667eea; border: 2px solid #667eea; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.9em;">
              📊 Exportar Dados
            </button>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
    
  } catch (error) {
    console.error('Erro ao carregar analytics de questões:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #dc3545;">
        <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
        <p>Erro ao carregar analytics.</p>
        <button onclick="loadQuestionAnalytics()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
          🔄 Tentar Novamente
        </button>
      </div>
    `;
  }
}

// ========================================
// HELPERS
// ========================================

function calculateCompatibility(stats) {
  const positiveMatches = (stats.superMatches || 0) + (stats.matches || 0);
  const total = stats.totalQuestions || 0;
  
  if (total === 0) return 0;
  
  return ((positiveMatches / total) * 100).toFixed(1);
}

function getCountryFlag(country) {
  const flags = {
    'Portugal': '🇵🇹',
    'Brasil': '🇧🇷',
    'Angola': '🇦🇴',
    'Moçambique': '🇲🇿',
    'Cabo Verde': '🇨🇻',
    'Espanha': '🇪🇸',
    'França': '🇫🇷',
    'Reino Unido': '🇬🇧',
    'EUA': '🇺🇸'
  };
  
  return flags[country] || '🌍';
}

function getMatchColor(matchType) {
  if (matchType.includes('SUPER')) return '#4caf50';
  if (matchType.includes('EXCELENTE')) return '#8bc34a';
  if (matchType.includes('BOM')) return '#cddc39';
  if (matchType.includes('POSSÍVEL')) return '#ffc107';
  if (matchType.includes('NEUTRO')) return '#ff9800';
  return '#9e9e9e';
}

function renderGenderStats(genderData, label) {
  const total = genderData.total || 0;
  
  if (total === 0) return '';
  
  const porfavor = genderData['Por favor!'] || 0;
  const pctPorfavor = total > 0 ? ((porfavor / total) * 100).toFixed(1) : 0;
  
  return `
    <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; text-align: center;">
      <div style="font-size: 0.85em; color: #6c757d; margin-bottom: 5px;">${label}</div>
      <div style="font-size: 1.3em; font-weight: 600; color: #2e7d32; margin-bottom: 3px;">${pctPorfavor}%</div>
      <div style="font-size: 0.75em; color: #6c757d;">${total} respostas</div>
    </div>
  `;
}

function renderAgeRangeStats(ageData) {
  const ranges = ['18-25', '26-35', '36-45', '46-55', '56+'];
  let html = '';
  
  ranges.forEach(range => {
    const rangeData = ageData[range];
    if (!rangeData || rangeData.total === 0) return;
    
    const total = rangeData.total;
    const porfavor = rangeData['Por favor!'] || 0;
    const pctPorfavor = total > 0 ? ((porfavor / total) * 100).toFixed(1) : 0;
    
    html += `
      <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; text-align: center;">
        <div style="font-size: 0.8em; color: #6c757d; margin-bottom: 3px;">${range}</div>
        <div style="font-size: 1.2em; font-weight: 600; color: #667eea;">${pctPorfavor}%</div>
        <div style="font-size: 0.7em; color: #6c757d;">${total}</div>
      </div>
    `;
  });
  
  return html;
}

// ========================================
// EXPORT FUNCTIONS
// ========================================

async function exportReportCSV(reportId) {
  try {
    const db = firebase.firestore();
    const doc = await db.collection('analytics_full_reports').doc(reportId).get();
    
    if (!doc.exists) {
      alert('Relatório não encontrado');
      return;
    }
    
    const report = { id: doc.id, ...doc.data() };
    
    // Criar CSV
    let csv = 'Pack,Questão,Nome 1,Resposta 1,Nome 2,Resposta 2,Tipo de Match,Invert Matching\n';
    
    report.questions.forEach(q => {
      csv += `"${q.packId}","${q.questionText}","${report.couple.name1}","${q.answer1}","${report.couple.name2}","${q.answer2}","${q.matchType}","${q.isInvertMatching ? 'Sim' : 'Não'}"\n`;
    });
    
    // Download
    downloadCSV(csv, `relatorio_${report.id}.csv`);
    
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    alert('Erro ao exportar CSV');
  }
}

async function exportQuestionCSV(packId, questionId) {
  try {
    const question = await getQuestionAnalytics(packId, questionId);
    
    if (!question || question.length === 0) {
      alert('Questão não encontrada');
      return;
    }
    
    const q = question[0];
    
    // Criar CSV
    let csv = 'Métrica,Valor\n';
    csv += `"Questão","${q.questionText}"\n`;
    csv += `"Pack","${q.packName}"\n`;
    csv += `"Total Respostas","${q.totalResponses}"\n`;
    csv += `"\n`;
    csv += `"Resposta","Quantidade","Percentagem"\n`;
    csv += `"Por favor!","${q.byAnswer['Por favor!']}","${((q.byAnswer['Por favor!'] / q.totalResponses) * 100).toFixed(1)}%"\n`;
    csv += `"OK","${q.byAnswer['OK']}","${((q.byAnswer['OK'] / q.totalResponses) * 100).toFixed(1)}%"\n`;
    csv += `"Talvez","${q.byAnswer['Talvez']}","${((q.byAnswer['Talvez'] / q.totalResponses) * 100).toFixed(1)}%"\n`;
    csv += `"Não","${q.byAnswer['Não']}","${((q.byAnswer['Não'] / q.totalResponses) * 100).toFixed(1)}%"\n`;
    
    // Download
    downloadCSV(csv, `questao_${packId}_${questionId}.csv`);
    
  } catch (error) {
    console.error('Erro ao exportar CSV:', error);
    alert('Erro ao exportar CSV');
  }
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}

async function exportReportPDF(reportId) {
  // TODO: Implementar exportação em PDF
  alert('Exportação em PDF será implementada em breve!');
}
