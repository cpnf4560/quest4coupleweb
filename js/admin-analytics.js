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
// TAB: RELATÓRIOS PARCIAIS (1 Pack Only)
// ========================================

/**
 * Carrega e exibe relatórios parciais (casais que completaram apenas 1 pack)
 */
async function loadPartialReports(filters = {}) {
  const container = document.getElementById('partialReportsContainer');
  const statsContainer = document.getElementById('partialReportsStats');
  
  if (!container) return;
  
  // Mostrar loading
  container.innerHTML = `
    <div style="text-align: center; padding: 40px; color: #6c757d;">
      <div style="font-size: 2em; margin-bottom: 10px;">⏳</div>
      <p>Carregando relatórios parciais...</p>
    </div>
  `;
  
  try {
    // Buscar relatórios com apenas 1 pack
    let reports = await getPartialReports(100, filters);
    
    // Estatísticas
    const stats = {
      total: reports.length,
      byPack: {}
    };
    
    reports.forEach(r => {
      const packId = r.stats?.packIds?.[0] || 'unknown';
      stats.byPack[packId] = (stats.byPack[packId] || 0) + 1;
    });
    
    // Render stats
    if (statsContainer) {
      const packNames = {
        'romantico': 'Pack Romântico',
        'experiencia': 'Exploração e Aventura',
        'pimentinha': 'Pimentinha',
        'poliamor': 'Poliamor',
        'kinks': 'Fetiches'
      };
      
      let statsHtml = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; text-align: center; color: white;">
            <div style="font-size: 2em; font-weight: 700;">${stats.total}</div>
            <div style="font-size: 0.85em; opacity: 0.9;">Total Parciais</div>
          </div>
      `;
      
      Object.entries(stats.byPack).forEach(([packId, count]) => {
        statsHtml += `
          <div style="background: #f8f9fa; padding: 15px; border-radius: 12px; text-align: center; border-left: 4px solid #667eea;">
            <div style="font-size: 1.5em; font-weight: 600; color: #495057;">${count}</div>
            <div style="font-size: 0.8em; color: #6c757d;">${packNames[packId] || packId}</div>
          </div>
        `;
      });
      
      statsHtml += '</div>';
      statsContainer.innerHTML = statsHtml;
    }
    
    if (reports.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #6c757d;">
          <div style="font-size: 3em; margin-bottom: 15px;">📝</div>
          <h3 style="margin-bottom: 10px;">Nenhum relatório parcial encontrado</h3>
          <p>Não há casais que tenham completado apenas 1 pack.</p>
        </div>
      `;
      return;
    }
    
    // Renderizar relatórios
    let html = `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9em;">
          <thead style="background: #f8f9fa;">
            <tr>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">#</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Casal</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Pack</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Questões</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">⭐ Super</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">💚 Match</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">😐 Mismatch</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Compat.</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Data</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    const packNames = {
      'romantico': '💕 Romântico',
      'experiencia': '🌍 Exploração',
      'pimentinha': '🌶️ Pimentinha',
      'poliamor': '💜 Poliamor',
      'kinks': '🔥 Fetiches'
    };
    
    reports.forEach((report, index) => {
      const date = report.timestamp?.toDate();
      const dateStr = date ? date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }) : '-';
      
      const packId = report.stats?.packIds?.[0] || 'unknown';
      const compatibility = calculateCompatibility(report.stats);
      const compatColor = compatibility >= 80 ? '#2e7d32' : compatibility >= 60 ? '#fb8c00' : '#d32f2f';
      
      html += `
        <tr style="border-bottom: 1px solid #f1f3f5;">
          <td style="padding: 12px; color: #6c757d;">${index + 1}</td>
          <td style="padding: 12px; font-weight: 500;">${report.couple?.name1 || '?'} ❤️ ${report.couple?.name2 || '?'}</td>
          <td style="padding: 12px;">${packNames[packId] || packId}</td>
          <td style="padding: 12px; text-align: center;">${report.stats?.totalQuestions || 0}</td>
          <td style="padding: 12px; text-align: center; color: #4caf50; font-weight: 600;">${report.stats?.superMatches || 0}</td>
          <td style="padding: 12px; text-align: center; color: #8bc34a; font-weight: 600;">${report.stats?.matches || 0}</td>
          <td style="padding: 12px; text-align: center; color: #ff9800; font-weight: 600;">${report.stats?.mismatches || 0}</td>
          <td style="padding: 12px; text-align: center; font-weight: 700; color: ${compatColor};">${compatibility}%</td>
          <td style="padding: 12px; color: #6c757d; font-size: 0.85em;">${dateStr}</td>
        </tr>
      `;
    });
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
    
  } catch (error) {
    console.error('Erro ao carregar relatórios parciais:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #dc3545;">
        <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
        <p>Erro ao carregar relatórios parciais.</p>
        <p style="font-size: 0.85em; color: #6c757d; margin-top: 10px;">${error.message}</p>
        <button onclick="loadPartialReports()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
          🔄 Tentar Novamente
        </button>
      </div>
    `;
  }
}

/**
 * Busca relatórios parciais (apenas 1 pack) do Firebase
 */
async function getPartialReports(limit = 100, filters = {}) {
  try {
    const db = firebase.firestore();
    
    // Buscar relatórios com packCount === 1
    let query = db.collection('analytics_full_reports')
      .where('stats.packCount', '==', 1)
      .orderBy('timestamp', 'desc')
      .limit(limit);
    
    const snapshot = await query.get();
    let reports = [];
    
    snapshot.forEach(doc => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Aplicar filtros adicionais em memória
    if (filters.packId) {
      reports = reports.filter(r => r.stats?.packIds?.includes(filters.packId));
    }
    
    if (filters.period) {
      const now = new Date();
      let startDate = null;
      
      if (filters.period === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (filters.period === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (filters.period === 'month') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      if (startDate) {
        reports = reports.filter(r => {
          const timestamp = r.timestamp?.toDate();
          return timestamp && timestamp >= startDate;
        });
      }
    }
    
    return reports;
    
  } catch (error) {
    console.error('❌ Erro ao obter relatórios parciais:', error);
    
    // Se der erro de índice, tentar busca sem filtro
    if (error.code === 'failed-precondition') {
      console.warn('⚠️ Índice não existe, buscando todos os relatórios...');
      return await getPartialReportsFallback(limit, filters);
    }
    
    throw error;
  }
}

/**
 * Fallback para buscar relatórios parciais (sem índice composto)
 */
async function getPartialReportsFallback(limit = 100, filters = {}) {
  try {
    const db = firebase.firestore();
    
    // Buscar todos os relatórios e filtrar em memória
    const snapshot = await db.collection('analytics_full_reports')
      .orderBy('timestamp', 'desc')
      .limit(500)
      .get();
    
    let reports = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      // Filtrar apenas relatórios com 1 pack
      if (data.stats?.packCount === 1) {
        reports.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    // Aplicar filtros
    if (filters.packId) {
      reports = reports.filter(r => r.stats?.packIds?.includes(filters.packId));
    }
    
    if (filters.period) {
      const now = new Date();
      let startDate = null;
      
      if (filters.period === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (filters.period === 'week') {
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (filters.period === 'month') {
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      
      if (startDate) {
        reports = reports.filter(r => {
          const timestamp = r.timestamp?.toDate();
          return timestamp && timestamp >= startDate;
        });
      }
    }
    
    return reports.slice(0, limit);
    
  } catch (error) {
    console.error('❌ Erro no fallback de relatórios parciais:', error);
    throw error;
  }
}

// ========================================
// TAB: ANALYTICS POR QUESTÃO
// ========================================

/**
 * Busca analytics de questões do Firebase
 */
async function getQuestionAnalytics(packId = null) {
  console.log('📊 Buscando analytics de questões...', packId ? `Pack: ${packId}` : 'Todos os packs');
  
  try {
    // 1. Buscar todas as respostas dos utilizadores
    const answersSnapshot = await db.collection('userAnswers').get();
    console.log('📝 Documentos de respostas encontrados:', answersSnapshot.size);
    
    // 2. Agregar respostas por questão
    const questionStats = {};
    
    answersSnapshot.forEach(doc => {
      const userData = doc.data();
      
      // Iterar pelos packs do utilizador
      Object.keys(userData).forEach(pack => {
        // Filtrar por packId se especificado
        if (packId && pack !== packId) return;
        
        const packAnswers = userData[pack];
        if (typeof packAnswers !== 'object' || !packAnswers) return;
        
        // Iterar pelas respostas
        Object.keys(packAnswers).forEach(questionKey => {
          const answer = packAnswers[questionKey];
          if (!answer || !answer.answer) return;
          
          // Criar chave única: pack_questionKey
          const uniqueKey = `${pack}_${questionKey}`;
          
          if (!questionStats[uniqueKey]) {
            questionStats[uniqueKey] = {
              packId: pack,
              questionKey: questionKey,
              totalResponses: 0,
              byAnswer: {
                'porfavor': 0,
                'yup': 0,
                'talvez': 0,
                'meh': 0
              }
            };
          }
          
          questionStats[uniqueKey].totalResponses++;
          
          // Contar por tipo de resposta (normalizar para minúsculas)
          const answerType = answer.answer.toLowerCase();
          if (questionStats[uniqueKey].byAnswer.hasOwnProperty(answerType)) {
            questionStats[uniqueKey].byAnswer[answerType]++;
          }
        });
      });
    });
    
    console.log('📊 Questões agregadas:', Object.keys(questionStats).length);
    
    // 3. Carregar textos das perguntas do packs_data_clean.json
    const packsResponse = await fetch('../data/packs_data_clean.json');
    const packsData = await packsResponse.json();
    
    // Mapear pack names
    const packNames = {
      'romantico': 'Pack Romântico',
      'experiencia': 'Exploração e Aventura a Dois',
      'pimentinha': 'Pimentinha',
      'poliamor': 'Poliamor',
      'kinks': 'Fetiches'
    };
    
    // 4. Enriquecer com textos das perguntas
    const enrichedQuestions = [];
    
    Object.keys(questionStats).forEach(key => {
      const stat = questionStats[key];
      const pack = packsData.find(p => p.name === packNames[stat.packId]);
      
      if (pack && pack.categories) {
        // Achatar todas as perguntas do pack
        const allQuestions = pack.categories.flatMap(cat => cat.questions || []);
        
        // Extrair número da questão (ex: q1 -> 1)
        const questionNumber = parseInt(stat.questionKey.replace('q', ''));
        const questionText = allQuestions[questionNumber - 1];
        
        enrichedQuestions.push({
          packId: stat.packId,
          packName: packNames[stat.packId],
          questionKey: stat.questionKey,
          questionNumber: questionNumber,
          questionText: questionText || `Questão ${questionNumber}`,
          totalResponses: stat.totalResponses,
          byAnswer: stat.byAnswer,
          hasInvertMatching: false // TODO: Detectar se tem invert matching
        });
      }
    });
    
    // 5. Ordenar por número de respostas (desc)
    enrichedQuestions.sort((a, b) => b.totalResponses - a.totalResponses);
    
    console.log('✅ Analytics de questões carregadas:', enrichedQuestions.length);
    
    return enrichedQuestions;
    
  } catch (error) {
    console.error('❌ Erro ao buscar analytics de questões:', error);
    return [];
  }
}

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
    
    // Estatísticas gerais
    const totalResponses = questions.reduce((sum, q) => sum + q.totalResponses, 0);
    const avgResponses = questions.length > 0 ? Math.round(totalResponses / questions.length) : 0;
    
    // Agrupar por pack
    const byPack = {};
    questions.forEach(q => {
      if (!byPack[q.packId]) {
        byPack[q.packId] = { count: 0, totalResponses: 0 };
      }
      byPack[q.packId].count++;
      byPack[q.packId].totalResponses += q.totalResponses;
    });
    
    const packNames = {
      'romantico': '💕 Pack Romântico',
      'experiencia': '🌍 Exploração',
      'pimentinha': '🌶️ Pimentinha',
      'poliamor': '💜 Poliamor',
      'kinks': '🔥 Fetiches'
    };
    
    // Header com estatísticas
    let html = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; text-align: center; color: white;">
          <div style="font-size: 2em; font-weight: 700;">${questions.length}</div>
          <div style="font-size: 0.85em; opacity: 0.9;">Questões</div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid #4caf50;">
          <div style="font-size: 2em; font-weight: 700; color: #4caf50;">${totalResponses}</div>
          <div style="font-size: 0.85em; color: #6c757d;">Total Respostas</div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; text-align: center; border-left: 4px solid #2196f3;">
          <div style="font-size: 2em; font-weight: 700; color: #2196f3;">${avgResponses}</div>
          <div style="font-size: 0.85em; color: #6c757d;">Média/Questão</div>
        </div>
      </div>
      
      <!-- Toggle View -->
      <div style="margin-bottom: 20px; display: flex; gap: 10px;">
        <button onclick="setQuestionView('table')" id="btnTableView" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
          📋 Vista Tabela
        </button>
        <button onclick="setQuestionView('cards')" id="btnCardsView" style="padding: 8px 16px; background: #f8f9fa; color: #495057; border: 2px solid #e0e0e0; border-radius: 6px; cursor: pointer; font-weight: 600;">
          🃏 Vista Cards
        </button>
        <button onclick="exportAllQuestionsCSV()" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-left: auto;">
          📊 Exportar Todos
        </button>
      </div>
      
      <!-- Table View -->
      <div id="questionTableView" style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9em; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <thead style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <tr>
              <th style="padding: 15px 12px; text-align: left; font-weight: 600;">#</th>
              <th style="padding: 15px 12px; text-align: left; font-weight: 600;">Pack</th>
              <th style="padding: 15px 12px; text-align: left; font-weight: 600; min-width: 250px;">Questão</th>
              <th style="padding: 15px 12px; text-align: center; font-weight: 600;">Total</th>
              <th style="padding: 15px 12px; text-align: center; font-weight: 600;">😍 Porfavor</th>
              <th style="padding: 15px 12px; text-align: center; font-weight: 600;">👍 Yup</th>
              <th style="padding: 15px 12px; text-align: center; font-weight: 600;">🤷 Talvez</th>
              <th style="padding: 15px 12px; text-align: center; font-weight: 600;">😑 Meh</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    questions.forEach((q, index) => {
      const total = q.totalResponses;
      const porfavor = q.byAnswer['porfavor'] || 0;
      const yup = q.byAnswer['yup'] || 0;
      const talvez = q.byAnswer['talvez'] || 0;
      const meh = q.byAnswer['meh'] || 0;
      
      const pctPorfavor = total > 0 ? ((porfavor / total) * 100).toFixed(0) : 0;
      const pctYup = total > 0 ? ((yup / total) * 100).toFixed(0) : 0;
      const pctTalvez = total > 0 ? ((talvez / total) * 100).toFixed(0) : 0;
      const pctMeh = total > 0 ? ((meh / total) * 100).toFixed(0) : 0;
      
      const packIcon = packNames[q.packId]?.split(' ')[0] || '📦';
      const questionShort = q.questionText?.length > 60 ? q.questionText.substring(0, 60) + '...' : q.questionText;
      
      // Color row based on predominant response
      const maxPct = Math.max(pctPorfavor, pctYup, pctTalvez, pctMeh);
      let rowBg = '#fff';
      if (maxPct == pctPorfavor && pctPorfavor > 40) rowBg = '#f1f8f1';
      else if (maxPct == pctMeh && pctMeh > 40) rowBg = '#fff5f5';
      
      html += `
        <tr style="border-bottom: 1px solid #f1f3f5; background: ${rowBg};" title="${q.questionText}">
          <td style="padding: 12px; color: #6c757d; font-weight: 500;">${q.questionNumber || index + 1}</td>
          <td style="padding: 12px; font-size: 1.2em;">${packIcon}</td>
          <td style="padding: 12px; color: #495057;">${questionShort || 'N/A'}</td>
          <td style="padding: 12px; text-align: center; font-weight: 700; color: #667eea;">${total}</td>
          <td style="padding: 12px; text-align: center;">
            <span style="background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 0.85em;">
              ${pctPorfavor}%
            </span>
          </td>
          <td style="padding: 12px; text-align: center;">
            <span style="background: #f1f8e9; color: #558b2f; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 0.85em;">
              ${pctYup}%
            </span>
          </td>
          <td style="padding: 12px; text-align: center;">
            <span style="background: #fff3e0; color: #ef6c00; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 0.85em;">
              ${pctTalvez}%
            </span>
          </td>
          <td style="padding: 12px; text-align: center;">
            <span style="background: #ffebee; color: #c62828; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 0.85em;">
              ${pctMeh}%
            </span>
          </td>
        </tr>
      `;
    });
    
    html += '</tbody></table></div>';
    
    // Cards View (hidden by default)
    html += '<div id="questionCardsView" style="display: none;">';
    
    questions.forEach((q, index) => {
      const total = q.totalResponses;
      const porfavor = q.byAnswer['porfavor'] || 0;
      const yup = q.byAnswer['yup'] || 0;
      const talvez = q.byAnswer['talvez'] || 0;
      const meh = q.byAnswer['meh'] || 0;
      
      const pctPorfavor = total > 0 ? ((porfavor / total) * 100).toFixed(1) : 0;
      const pctYup = total > 0 ? ((yup / total) * 100).toFixed(1) : 0;
      const pctTalvez = total > 0 ? ((talvez / total) * 100).toFixed(1) : 0;
      const pctMeh = total > 0 ? ((meh / total) * 100).toFixed(1) : 0;
      
      html += `
        <div class="question-analytics-card" style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="background: #667eea; color: white; padding: 3px 10px; border-radius: 6px; font-weight: 600; font-size: 0.8em;">
                  Q${q.questionNumber || index + 1}
                </span>
                <span style="color: #6c757d; font-size: 0.85em;">${q.packName || q.packId}</span>
              </div>
              <p style="margin: 0; font-size: 0.95em; color: #495057; line-height: 1.4;">
                ${q.questionText || 'Texto não disponível'}
              </p>
            </div>
            <div style="text-align: right; min-width: 80px;">
              <div style="font-size: 1.5em; font-weight: 700; color: #667eea;">${total}</div>
              <div style="font-size: 0.7em; color: #6c757d;">respostas</div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
            <div style="text-align: center; padding: 10px; background: #e8f5e9; border-radius: 8px;">
              <div style="font-size: 1.2em;">😍</div>
              <div style="font-weight: 700; color: #2e7d32;">${pctPorfavor}%</div>
              <div style="font-size: 0.7em; color: #6c757d;">${porfavor}</div>
            </div>
            <div style="text-align: center; padding: 10px; background: #f1f8e9; border-radius: 8px;">
              <div style="font-size: 1.2em;">👍</div>
              <div style="font-weight: 700; color: #558b2f;">${pctYup}%</div>
              <div style="font-size: 0.7em; color: #6c757d;">${yup}</div>
            </div>
            <div style="text-align: center; padding: 10px; background: #fff3e0; border-radius: 8px;">
              <div style="font-size: 1.2em;">🤷</div>
              <div style="font-weight: 700; color: #ef6c00;">${pctTalvez}%</div>
              <div style="font-size: 0.7em; color: #6c757d;">${talvez}</div>
            </div>
            <div style="text-align: center; padding: 10px; background: #ffebee; border-radius: 8px;">
              <div style="font-size: 1.2em;">😑</div>
              <div style="font-weight: 700; color: #c62828;">${pctMeh}%</div>
              <div style="font-size: 0.7em; color: #6c757d;">${meh}</div>
            </div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
    
    container.innerHTML = html;
    
    // Store questions data globally for export
    window.questionsData = questions;
    
  } catch (error) {
    console.error('Erro ao carregar analytics de questões:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #dc3545;">
        <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
        <p>Erro ao carregar analytics.</p>
        <p style="font-size: 0.85em; color: #6c757d; margin-top: 10px;">${error.message}</p>
        <button onclick="loadQuestionAnalytics()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer;">
          🔄 Tentar Novamente
        </button>
      </div>
    `;
  }
}

/**
 * Alterna entre vista tabela e cards
 */
function setQuestionView(view) {
  const tableView = document.getElementById('questionTableView');
  const cardsView = document.getElementById('questionCardsView');
  const btnTable = document.getElementById('btnTableView');
  const btnCards = document.getElementById('btnCardsView');
  
  if (view === 'table') {
    tableView.style.display = 'block';
    cardsView.style.display = 'none';
    btnTable.style.background = '#667eea';
    btnTable.style.color = 'white';
    btnTable.style.border = 'none';
    btnCards.style.background = '#f8f9fa';
    btnCards.style.color = '#495057';
    btnCards.style.border = '2px solid #e0e0e0';
  } else {
    tableView.style.display = 'none';
    cardsView.style.display = 'block';
    btnCards.style.background = '#667eea';
    btnCards.style.color = 'white';
    btnCards.style.border = 'none';
    btnTable.style.background = '#f8f9fa';
    btnTable.style.color = '#495057';
    btnTable.style.border = '2px solid #e0e0e0';
  }
}

/**
 * Exporta todas as questões para CSV
 */
function exportAllQuestionsCSV() {
  if (!window.questionsData || window.questionsData.length === 0) {
    alert('Não há dados para exportar');
    return;
  }
  
  let csv = 'Pack,Questão Nº,Texto,Total Respostas,PorFavor (%),PorFavor (n),Yup (%),Yup (n),Talvez (%),Talvez (n),Meh (%),Meh (n)\n';
  
  window.questionsData.forEach(q => {
    const total = q.totalResponses;
    const porfavor = q.byAnswer['porfavor'] || 0;
    const yup = q.byAnswer['yup'] || 0;
    const talvez = q.byAnswer['talvez'] || 0;
    const meh = q.byAnswer['meh'] || 0;
    
    const pctPorfavor = total > 0 ? ((porfavor / total) * 100).toFixed(1) : 0;
    const pctYup = total > 0 ? ((yup / total) * 100).toFixed(1) : 0;
    const pctTalvez = total > 0 ? ((talvez / total) * 100).toFixed(1) : 0;
    const pctMeh = total > 0 ? ((meh / total) * 100).toFixed(1) : 0;
    
    const questionText = (q.questionText || '').replace(/"/g, '""');
    
    csv += `"${q.packId}",${q.questionNumber},"${questionText}",${total},${pctPorfavor},${porfavor},${pctYup},${yup},${pctTalvez},${talvez},${pctMeh},${meh}\n`;
  });
    downloadCSV(csv, `questoes_analytics_${new Date().toISOString().split('T')[0]}.csv`);
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
  
  const porfavor = genderData['porfavor'] || 0;
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
    const porfavor = rangeData['porfavor'] || 0;
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
    csv += `"Por favor!","${q.byAnswer['porfavor']}","${((q.byAnswer['porfavor'] / q.totalResponses) * 100).toFixed(1)}%"\n`;
    csv += `"Yup","${q.byAnswer['yup']}","${((q.byAnswer['yup'] / q.totalResponses) * 100).toFixed(1)}%"\n`;
    csv += `"Talvez","${q.byAnswer['talvez']}","${((q.byAnswer['talvez'] / q.totalResponses) * 100).toFixed(1)}%"\n`;
    csv += `"Meh","${q.byAnswer['meh']}","${((q.byAnswer['meh'] / q.totalResponses) * 100).toFixed(1)}%"\n`;
    
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
