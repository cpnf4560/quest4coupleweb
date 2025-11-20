# 🎯 GUIA: Adicionar Analytics ao BackOffice

## Objetivo

Adicionar 2 novos tabs ao **admin.html** para visualizar:
1. **Relatórios Completos** (com nomes mascarados)
2. **Analytics por Questão** (breakdown detalhado)

---

## ✅ PASSO 1: Incluir Script no HTML

No `admin.html`, adicionar antes do `</body>`:

```html
<!-- Analytics Functions -->
<script src="../js/analytics.js"></script>
<script src="../js/admin-analytics.js"></script>
```

---

## ✅ PASSO 2: Adicionar Tabs na Navegação

Localizar a `.tab-nav` e adicionar:

```html
<div class="tab-nav" style="...">
  <button class="tab-btn active" onclick="switchTab('dashboard')">📊 Dashboard</button>
  <button class="tab-btn" onclick="switchTab('users')">👥 Utilizadores</button>
  <button class="tab-btn" onclick="switchTab('reports')">📋 Relatórios</button> <!-- ✅ NOVO -->
  <button class="tab-btn" onclick="switchTab('questions')">📊 Questões</button> <!-- ✅ NOVO -->
  <button class="tab-btn" onclick="switchTab('activity')">📝 Atividade</button>
</div>
```

---

## ✅ PASSO 3: Criar Conteúdo dos Tabs

Adicionar após o último `.tab-content`:

```html
<!-- TAB: Relatórios Completos -->
<div id="reportsTab" class="tab-content" style="display: none;">
  <div class="stat-cards">
    <h2 style="margin: 0 0 20px 0; color: #495057;">📋 Relatórios Gerados</h2>
    
    <!-- Filtros -->
    <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; gap: 15px; flex-wrap: wrap;">
        <div>
          <label style="display: block; margin-bottom: 5px; font-size: 0.9em; color: #6c757d;">Período:</label>
          <select id="reportsPeriodFilter" onchange="filterReports()" style="padding: 8px 12px; border: 1px solid #ced4da; border-radius: 6px; font-size: 0.9em;">
            <option value="all">Todos</option>
            <option value="today">Hoje</option>
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
          </select>
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 5px; font-size: 0.9em; color: #6c757d;">País:</label>
          <select id="reportsCountryFilter" onchange="filterReports()" style="padding: 8px 12px; border: 1px solid #ced4da; border-radius: 6px; font-size: 0.9em;">
            <option value="all">Todos</option>
            <option value="Portugal">🇵🇹 Portugal</option>
            <option value="Brasil">🇧🇷 Brasil</option>
            <option value="Angola">🇦🇴 Angola</option>
          </select>
        </div>
        
        <div style="margin-left: auto; display: flex; align-items: flex-end;">
          <button onclick="exportAllReportsCSV()" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.9em;">
            📊 Exportar Tudo (CSV)
          </button>
        </div>
      </div>
    </div>
    
    <!-- Container dos Relatórios -->
    <div id="fullReportsContainer">
      <!-- Preenchido por loadFullReports() -->
    </div>
  </div>
</div>

<!-- TAB: Analytics por Questão -->
<div id="questionsTab" class="tab-content" style="display: none;">
  <div class="stat-cards">
    <h2 style="margin: 0 0 20px 0; color: #495057;">📊 Analytics por Questão</h2>
    
    <!-- Filtros -->
    <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="display: flex; gap: 15px; flex-wrap: wrap;">
        <div>
          <label style="display: block; margin-bottom: 5px; font-size: 0.9em; color: #6c757d;">Pack:</label>
          <select id="questionsPackFilter" onchange="filterQuestions()" style="padding: 8px 12px; border: 1px solid #ced4da; border-radius: 6px; font-size: 0.9em;">
            <option value="">Todos os Packs</option>
            <option value="romantico">Pack Romântico</option>
            <option value="experiencia">Exploração e Aventura</option>
            <option value="pimentinha">Pimentinha</option>
            <option value="poliamor">Poliamor</option>
            <option value="kinks">Fetiches</option>
          </select>
        </div>
        
        <div>
          <label style="display: block; margin-bottom: 5px; font-size: 0.9em; color: #6c757d;">Ordenar por:</label>
          <select id="questionsOrderFilter" onchange="filterQuestions()" style="padding: 8px 12px; border: 1px solid #ced4da; border-radius: 6px; font-size: 0.9em;">
            <option value="responses">Mais Respondidas</option>
            <option value="popularity">Mais Populares ("Por favor!")</option>
            <option value="controversial">Mais Controversas</option>
          </select>
        </div>
        
        <div style="margin-left: auto; display: flex; align-items: flex-end;">
          <button onclick="exportAllQuestionsCSV()" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 0.9em;">
            📊 Exportar Tudo (CSV)
          </button>
        </div>
      </div>
    </div>
    
    <!-- Container das Questões -->
    <div id="questionAnalyticsContainer">
      <!-- Preenchido por loadQuestionAnalytics() -->
    </div>
  </div>
</div>
```

---

## ✅ PASSO 4: Atualizar Função `switchTab()`

Modificar a função existente para incluir os novos tabs:

```javascript
function switchTab(tabName) {
  // Ocultar todos os tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  
  // Remover classe active de todos os botões
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Mostrar tab selecionado
  let tabElement;
  switch(tabName) {
    case 'dashboard':
      tabElement = document.getElementById('dashboardTab');
      break;
    case 'users':
      tabElement = document.getElementById('usersTab');
      break;
    case 'reports': // ✅ NOVO
      tabElement = document.getElementById('reportsTab');
      loadFullReports(); // Carregar dados
      break;
    case 'questions': // ✅ NOVO
      tabElement = document.getElementById('questionsTab');
      loadQuestionAnalytics(); // Carregar dados
      break;
    case 'activity':
      tabElement = document.getElementById('activityTab');
      break;
  }
  
  if (tabElement) {
    tabElement.style.display = 'block';
  }
  
  // Adicionar classe active ao botão clicado
  event.target.classList.add('active');
}
```

---

## ✅ PASSO 5: Adicionar Funções de Filtro

No final do `<script>` do admin.html:

```javascript
// Filtrar relatórios
function filterReports() {
  const period = document.getElementById('reportsPeriodFilter').value;
  const country = document.getElementById('reportsCountryFilter').value;
  
  const filters = {
    period: period !== 'all' ? period : null,
    country: country !== 'all' ? country : null
  };
  
  loadFullReports(filters);
}

// Filtrar questões
function filterQuestions() {
  const packId = document.getElementById('questionsPackFilter').value;
  const order = document.getElementById('questionsOrderFilter').value;
  
  loadQuestionAnalytics(packId || null);
  
  // TODO: Implementar ordenação customizada
  if (order === 'popularity') {
    // Ordenar por % de "Por favor!"
  } else if (order === 'controversial') {
    // Ordenar por distribuição equilibrada
  }
}

// Exportar todos os relatórios
async function exportAllReportsCSV() {
  alert('Exportação em massa será implementada em breve!');
}

// Exportar todas as questões
async function exportAllQuestionsCSV() {
  const questions = await getQuestionAnalytics();
  
  // Criar CSV
  let csv = 'Pack,Questão,Total Respostas,Por favor!,OK,Talvez,Não,% Por favor!\n';
  
  questions.forEach(q => {
    const pctPorfavor = q.totalResponses > 0 ? ((q.byAnswer['Por favor!'] / q.totalResponses) * 100).toFixed(1) : 0;
    csv += `"${q.packName}","${q.questionText}","${q.totalResponses}","${q.byAnswer['Por favor!']}","${q.byAnswer['OK']}","${q.byAnswer['Talvez']}","${q.byAnswer['Não']}","${pctPorfavor}%"\n`;
  });
  
  // Download
  downloadCSV(csv, 'todas_questoes.csv');
}
```

---

## ✅ PASSO 6: Testar

### 1. Testar Tab de Relatórios:

```
1. Abrir admin.html
2. Fazer login (carlos.sousacorreia / rzq7xgq8)
3. Clicar no tab "📋 Relatórios"
4. Verificar se os relatórios aparecem
5. Clicar em "Ver Detalhes" de um relatório
6. Verificar modal com todas as questões
7. Testar exportação CSV
```

### 2. Testar Tab de Questões:

```
1. Clicar no tab "📊 Questões"
2. Verificar lista de questões ordenadas
3. Testar filtro por Pack
4. Verificar breakdown por género e idade
5. Testar exportação de dados individuais
6. Testar "Exportar Tudo"
```

---

## 🎨 CUSTOMIZAÇÃO

### Cores dos Packs:

```javascript
const packColors = {
  'romantico': '#f082a9',
  'experiencia': '#006c80',
  'pimentinha': '#ff6b6b',
  'poliamor': '#6f42c1',
  'kinks': '#1a1a1a'
};
```

### Ícones dos Tabs:

```
📋 Relatórios
📊 Questões
👥 Utilizadores
📝 Atividade
📈 Dashboard
```

---

## 🔧 TROUBLESHOOTING

### Problema: "getFullReports is not defined"

**Solução:** Verificar se `analytics.js` foi incluído antes de `admin-analytics.js`

### Problema: "Nenhum relatório encontrado"

**Solução:** Gerar alguns relatórios na app primeiro (relatorio.html)

### Problema: Modal não abre

**Solução:** Verificar console para erros. Pode ser problema com Firebase permissions.

### Problema: Exportação não funciona

**Solução:** Verificar se função `downloadCSV()` existe no admin-analytics.js

---

## 📚 RECURSOS

- **Documentação:** `docs/ANALYTICS_COMPLETAS.md`
- **Funções JavaScript:** `js/admin-analytics.js`
- **Analytics Core:** `js/analytics.js`
- **Firebase Collections:** 
  - `analytics_full_reports`
  - `analytics_answers`

---

## ✅ CHECKLIST FINAL

- [ ] Scripts incluídos no HTML
- [ ] Tabs adicionados na navegação
- [ ] Conteúdo dos tabs criado
- [ ] Função `switchTab()` atualizada
- [ ] Funções de filtro adicionadas
- [ ] Testado tab de Relatórios
- [ ] Testado tab de Questões
- [ ] Testado exportações CSV
- [ ] Testado filtros e ordenação
- [ ] Verificado no mobile (responsive)

---

**Última atualização:** 15/12/2024  
**Status:** ✅ Pronto para implementar
