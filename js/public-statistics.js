/* ============================================
   QUEST4COUPLE - PUBLIC STATISTICS
   Estatísticas públicas baseadas em analytics
   ============================================ */

console.log('✅ public-statistics.js carregado');

// ========================================
// GLOBAL VARIABLES
// ========================================

let questionAnalyticsCache = [];
let filteredData = [];
let totalResponses = 0;
let lastUpdate = null;
let currentView = 'table';

// Sorting
let sortColumn = 'openRate';
let sortDirection = 'desc';

// Pagination
let currentPage = 1;
const itemsPerPage = 50;

const packColors = {
  romantico: { icon: '💕', name: 'Romântico', border: '#ff6b9d', bg: '#ffe0ec' },
  experiencia: { icon: '🌍', name: 'Exploração', border: '#4ecdc4', bg: '#e0f7f6' },
  pimentinha: { icon: '🌶️', name: 'Pimentinha', border: '#ff6347', bg: '#ffe6e0' },
  poliamor: { icon: '💜', name: 'Poliamor', border: '#9b59b6', bg: '#f0e6f6' },
  kinks: { icon: '🔥', name: 'Fetiches', border: '#e74c3c', bg: '#fde8e6' }
};

// ========================================
// INIT
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Iniciando página de estatísticas...');
  loadStatistics();
});

// ========================================
// LOAD STATISTICS
// ========================================

async function loadStatistics() {
  if (questionAnalyticsCache.length === 0) {
    await loadFromPublicCache();
  }
  
  if (questionAnalyticsCache.length === 0) return;
  
  applyFilters();
}

// ========================================
// APPLY FILTERS
// ========================================

function applyFilters() {
  const packFilter = document.getElementById('filterPack')?.value || '';
  const genderFilter = document.getElementById('filterGender')?.value || '';
  const ageFilter = document.getElementById('filterAge')?.value || '';
  
  currentPage = 1;
  let filtered = [...questionAnalyticsCache];
  
  if (packFilter) {
    filtered = filtered.filter(q => q.packId === packFilter);
  }
    if (genderFilter) {
    filtered = filtered.map(q => {
      const genderData = q.byGender && q.byGender[genderFilter];
      if (!genderData || genderData.total === 0) return null;
      
      const filteredQ = { ...q, porfavor: genderData.porfavor, yup: genderData.yup, talvez: genderData.talvez, meh: genderData.meh };
      const total = genderData.total || 1;
      // Nova fórmula: porfavor + yup = aceite, talvez = meio aceite, meh = não aceite
      filteredQ.openRate = Math.round(((genderData.porfavor + genderData.yup + genderData.talvez * 0.5) / total) * 100);
      return filteredQ;
    }).filter(q => q !== null);
  }
  
  if (ageFilter) {
    const ageRangeMapping = {
      '18-25': ['18-23', '18-24', '18-25', '24-29'],
      '26-35': ['24-29', '25-34', '26-35', '30-35'],
      '36-45': ['35-44', '36-40', '36-45', '41-49'],
      '46-55': ['41-49', '46-55', '50+'],
      '56+': ['50+', '56+']
    };
    
    const targetRanges = ageRangeMapping[ageFilter] || [ageFilter];
    
    filtered = filtered.map(q => {
      let agg = { porfavor: 0, yup: 0, talvez: 0, meh: 0 };
      targetRanges.forEach(range => {
        const rd = q.byAge && q.byAge[range];
        if (rd) { agg.porfavor += rd.porfavor || 0; agg.yup += rd.yup || 0; agg.talvez += rd.talvez || 0; agg.meh += rd.meh || 0; }
      });      const total = agg.porfavor + agg.yup + agg.talvez + agg.meh;
      if (total === 0) return null;
      const filteredQ = { ...q, ...agg };
      // Nova fórmula: porfavor + yup = aceite, talvez = meio aceite, meh = não aceite
      filteredQ.openRate = Math.round(((agg.porfavor + agg.yup + agg.talvez * 0.5) / total) * 100);
      return filteredQ;
    }).filter(q => q !== null);
  }
    filteredData = filtered;
  sortData();
  updateTotalResponsesDisplay();
  renderStatistics();
  renderPagination();
}

// ========================================
// SORTING
// ========================================

function sortData() {
  filteredData.sort((a, b) => {
    let aVal, bVal;
    const ta = a.porfavor + a.yup + a.talvez + a.meh;
    const tb = b.porfavor + b.yup + b.talvez + b.meh;
    
    switch (sortColumn) {
      case 'openRate': aVal = a.openRate || 0; bVal = b.openRate || 0; break;
      case 'porfavor': aVal = ta > 0 ? (a.porfavor / ta) * 100 : 0; bVal = tb > 0 ? (b.porfavor / tb) * 100 : 0; break;
      case 'yup': aVal = ta > 0 ? (a.yup / ta) * 100 : 0; bVal = tb > 0 ? (b.yup / tb) * 100 : 0; break;
      case 'talvez': aVal = ta > 0 ? (a.talvez / ta) * 100 : 0; bVal = tb > 0 ? (b.talvez / tb) * 100 : 0; break;
      case 'meh': aVal = ta > 0 ? (a.meh / ta) * 100 : 0; bVal = tb > 0 ? (b.meh / tb) * 100 : 0; break;
      default: aVal = a.openRate || 0; bVal = b.openRate || 0;
    }
    return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
  });
}

function sortByColumn(column) {
  if (sortColumn === column) {
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
  } else {
    sortColumn = column;
    sortDirection = 'desc';
  }
  currentPage = 1;
  sortData();
  renderStatistics();
  renderPagination();
}

// ========================================
// LOAD FROM FIRESTORE
// ========================================

async function loadFromPublicCache() {
  const container = document.getElementById('statisticsContainer');
  
  container.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p>A carregar estatísticas...</p></div>';
  
  try {
    const db = firebase.firestore();
    const cacheDoc = await db.collection('publicStatistics').doc('questionAnalytics').get();
    
    if (cacheDoc.exists) {
      const data = cacheDoc.data();
      questionAnalyticsCache = data.questions || [];
      totalResponses = data.totalResponses || 0;
      lastUpdate = data.lastUpdate?.toDate() || null;
      console.log(`✅ Cache: ${questionAnalyticsCache.length} questões, ${totalResponses} respostas`);
    } else {
      questionAnalyticsCache = [];
      totalResponses = 0;
      container.innerHTML = '<div style="text-align:center;padding:40px;color:#6c757d;"><div style="font-size:3em;">⏳</div><p><strong>Estatísticas em preparação</strong></p><p>Atualizadas às 7h e 19h</p></div>';
    }
  } catch (error) {
    console.error('❌ Erro:', error);
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#dc3545;"><div style="font-size:3em;">⚠️</div><p>Erro ao carregar</p><button onclick="loadStatistics()" style="padding:10px 20px;background:#667eea;color:white;border:none;border-radius:8px;cursor:pointer;">🔄 Tentar</button></div>';
  }
}

// ========================================
// UPDATE DISPLAY
// ========================================

function updateTotalResponsesDisplay() {
  const totalEl = document.getElementById('totalResponsesCount');
  const lastUpdateEl = document.getElementById('lastUpdateTime');
  
  if (totalEl) totalEl.textContent = totalResponses.toLocaleString('pt-PT');
  if (lastUpdateEl && lastUpdate) {
    lastUpdateEl.textContent = lastUpdate.toLocaleString('pt-PT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }
}

// ========================================
// RENDER STATISTICS
// ========================================

function renderStatistics() {
  const container = document.getElementById('statisticsContainer');
  
  if (!filteredData || filteredData.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#6c757d;"><div style="font-size:3em;">📭</div><p><strong>Nenhuma estatística encontrada</strong></p></div>';
    return;
  }
  
  const totalItems = filteredData.length;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = Math.min(startIdx + itemsPerPage, totalItems);
  const pageData = filteredData.slice(startIdx, endIdx);
  
  const paginationInfo = document.getElementById('paginationInfo');
  if (paginationInfo) paginationInfo.textContent = `${startIdx + 1}-${endIdx} de ${totalItems}`;
  
  if (currentView === 'table') {
    renderTableView(pageData, startIdx);
  } else {
    renderCardsView(pageData, startIdx);
  }
}

function getSortIcon(col) {
  if (sortColumn !== col) return '⇅';
  return sortDirection === 'desc' ? '↓' : '↑';
}

function renderTableView(data, startIdx) {
  const container = document.getElementById('statisticsContainer');
  const genderFilter = document.getElementById('filterGender')?.value || '';
  const showGenderComparison = !genderFilter; // Só mostra comparação se não houver filtro de género
  
  let html = `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:0.9em;">
    <thead><tr style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;">
      <th style="padding:12px 8px;text-align:center;width:40px;">#</th>
      <th style="padding:12px 8px;text-align:center;width:40px;">Pack</th>
      <th style="padding:12px 8px;text-align:left;">Questão</th>
      <th class="sortable-header" onclick="sortByColumn('openRate')" style="padding:12px 8px;text-align:center;cursor:pointer;">📈 ${getSortIcon('openRate')}</th>
      ${showGenderComparison ? '<th style="padding:12px 8px;text-align:center;min-width:90px;" title="Aceitação por género">♂️ vs ♀️</th>' : ''}
      <th class="sortable-header" onclick="sortByColumn('porfavor')" style="padding:12px 8px;text-align:center;cursor:pointer;">🔥 ${getSortIcon('porfavor')}</th>
      <th class="sortable-header" onclick="sortByColumn('yup')" style="padding:12px 8px;text-align:center;cursor:pointer;">✅ ${getSortIcon('yup')}</th>
      <th class="sortable-header" onclick="sortByColumn('talvez')" style="padding:12px 8px;text-align:center;cursor:pointer;">🤔 ${getSortIcon('talvez')}</th>
      <th class="sortable-header" onclick="sortByColumn('meh')" style="padding:12px 8px;text-align:center;cursor:pointer;">😐 ${getSortIcon('meh')}</th>
    </tr></thead><tbody>`;
  
  data.forEach((q, idx) => {
    const pack = packColors[q.packId] || { icon: '📋', border: '#6c757d' };
    const total = q.porfavor + q.yup + q.talvez + q.meh;
    const pct = (v) => total > 0 ? Math.round((v / total) * 100) : 0;
    const openRate = q.openRate || 0;
    
    let color = '#dc3545', bg = '#f8d7da';
    if (openRate >= 70) { color = '#28a745'; bg = '#d4edda'; }
    else if (openRate >= 50) { color = '#17a2b8'; bg = '#d1ecf1'; }
    else if (openRate >= 30) { color = '#ffc107'; bg = '#fff3cd'; }
      // Calcular aceitação por género (usando nova fórmula)
    let genderHtml = '';
    if (showGenderComparison && q.byGender) {
      const mData = q.byGender.M;
      const fData = q.byGender.F;
      if (mData && fData && mData.total > 0 && fData.total > 0) {
        const mAccept = Math.round(((mData.porfavor + mData.yup + mData.talvez * 0.5) / mData.total) * 100);
        const fAccept = Math.round(((fData.porfavor + fData.yup + fData.talvez * 0.5) / fData.total) * 100);
        genderHtml = `<td style="padding:10px 4px;text-align:center;font-size:0.85em;">
          <span style="color:#0d6efd;font-weight:600;">${mAccept}%</span>
          <span style="color:#adb5bd;margin:0 3px;">/</span>
          <span style="color:#e83e8c;font-weight:600;">${fAccept}%</span>
        </td>`;
      } else {
        genderHtml = '<td style="padding:10px 4px;text-align:center;color:#adb5bd;font-size:0.8em;">--</td>';
      }
    }
    
    const text = q.questionText.length > 60 ? q.questionText.substring(0, 60) + '...' : q.questionText;
    
    html += `<tr style="border-bottom:1px solid #eee;${idx % 2 === 0 ? 'background:#fafafa;' : ''}">
      <td style="padding:10px 8px;text-align:center;color:#6c757d;font-weight:600;">${startIdx + idx + 1}</td>
      <td style="padding:10px 8px;text-align:center;"><span style="color:${pack.border};font-size:1.1em;">${pack.icon}</span></td>
      <td style="padding:10px 8px;line-height:1.3;" title="${q.questionText}">${text}</td>
      <td style="padding:10px 8px;text-align:center;"><div style="background:${bg};padding:4px 10px;border-radius:10px;display:inline-block;"><span style="color:${color};font-weight:700;">${openRate}%</span></div></td>
      ${genderHtml}
      <td style="padding:10px 8px;text-align:center;color:#28a745;font-weight:600;">${pct(q.porfavor)}%</td>
      <td style="padding:10px 8px;text-align:center;color:#17a2b8;font-weight:600;">${pct(q.yup)}%</td>
      <td style="padding:10px 8px;text-align:center;color:#ffc107;font-weight:600;">${pct(q.talvez)}%</td>
      <td style="padding:10px 8px;text-align:center;color:#dc3545;font-weight:600;">${pct(q.meh)}%</td>
    </tr>`;
  });
  
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

function renderCardsView(data, startIdx) {
  const container = document.getElementById('statisticsContainer');
  let html = '<div style="display:grid;gap:15px;">';
  
  data.forEach((q, idx) => {
    const pack = packColors[q.packId] || { bg: '#f5f5f5', border: '#6c757d', icon: '📋', name: q.packId };
    const total = q.porfavor + q.yup + q.talvez + q.meh;
    const pct = (v) => total > 0 ? Math.round((v / total) * 100) : 0;
    const openRate = q.openRate || 0;
    
    let color = '#dc3545', bg = '#f8d7da';
    if (openRate >= 70) { color = '#28a745'; bg = '#d4edda'; }
    else if (openRate >= 50) { color = '#17a2b8'; bg = '#d1ecf1'; }
    else if (openRate >= 30) { color = '#ffc107'; bg = '#fff3cd'; }
    
    html += `<div style="background:white;border-radius:12px;padding:20px;box-shadow:0 2px 8px rgba(0,0,0,0.08);border-left:4px solid ${pack.border};">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:15px;">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
            <span style="background:${pack.bg};padding:4px 12px;border-radius:12px;font-size:0.85em;color:${pack.border};font-weight:600;">${pack.icon} ${pack.name}</span>
            <span style="color:#adb5bd;font-size:0.8em;">#${startIdx + idx + 1}</span>
          </div>
          <p style="margin:0;color:#333;line-height:1.5;">${q.questionText}</p>
        </div>
        <div style="text-align:center;margin-left:20px;">
          <div style="background:${bg};padding:8px 16px;border-radius:15px;">
            <div style="font-size:0.7em;color:#6c757d;">ACEITAÇÃO</div>
            <div style="font-size:1.6em;font-weight:700;color:${color};">${openRate}%</div>
          </div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;">
        <div style="text-align:center;padding:10px;background:#d4edda;border-radius:8px;"><div style="font-size:0.7em;color:#155724;">🔥</div><div style="font-weight:700;color:#28a745;">${pct(q.porfavor)}%</div></div>
        <div style="text-align:center;padding:10px;background:#d1ecf1;border-radius:8px;"><div style="font-size:0.7em;color:#0c5460;">✅</div><div style="font-weight:700;color:#17a2b8;">${pct(q.yup)}%</div></div>
        <div style="text-align:center;padding:10px;background:#fff3cd;border-radius:8px;"><div style="font-size:0.7em;color:#856404;">🤔</div><div style="font-weight:700;color:#ffc107;">${pct(q.talvez)}%</div></div>
        <div style="text-align:center;padding:10px;background:#f8d7da;border-radius:8px;"><div style="font-size:0.7em;color:#721c24;">😐</div><div style="font-weight:700;color:#dc3545;">${pct(q.meh)}%</div></div>
      </div>
    </div>`;
  });
  
  html += '</div>';
  container.innerHTML = html;
}

// ========================================
// PAGINATION
// ========================================

function renderPagination() {
  const container = document.getElementById('paginationContainer');
  if (!container) return;
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (totalPages <= 1) { container.innerHTML = ''; return; }
  
  let html = `<button onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>← Ant</button>`;
  
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
  
  if (start > 1) { html += `<button onclick="goToPage(1)">1</button>`; if (start > 2) html += '<span style="color:#6c757d;">...</span>'; }
  for (let i = start; i <= end; i++) html += `<button onclick="goToPage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
  if (end < totalPages) { if (end < totalPages - 1) html += '<span style="color:#6c757d;">...</span>'; html += `<button onclick="goToPage(${totalPages})">${totalPages}</button>`; }
  
  html += `<button onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>Prox →</button>`;
  container.innerHTML = html;
}

function goToPage(page) {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderStatistics();
  renderPagination();
  document.querySelector('.table-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ========================================
// CONTROLS
// ========================================

function changeView(view) {
  currentView = view;
  document.getElementById('btnTableView')?.classList.remove('active');
  document.getElementById('btnCardsView')?.classList.remove('active');
  document.getElementById(view === 'table' ? 'btnTableView' : 'btnCardsView')?.classList.add('active');
  renderStatistics();
}

function resetFilters() {
  document.getElementById('filterPack').value = '';
  document.getElementById('filterGender').value = '';
  document.getElementById('filterAge').value = '';
  sortColumn = 'openRate';
  sortDirection = 'desc';
  applyFilters();
}
