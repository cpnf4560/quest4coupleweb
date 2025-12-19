# 📊 Página de Estatísticas Públicas - Plano de Implementação

**Data:** 16 de Dezembro de 2025  
**Status:** 📋 Em Planejamento  
**Prioridade:** ⭐⭐⭐ Alta

---

## 🎯 Objetivo

Criar uma **página de estatísticas públicas** acessível sem login, mostrando dados agregados e anonimizados sobre:
- Questões mais populares
- Diferenças por género
- Diferenças por faixa etária
- Tendências gerais dos utilizadores

---

## 🚀 Pré-Requisitos

### ✅ Já Implementado:
- [x] Sistema de cache no admin
- [x] Agregação de dados por género (`byGender`)
- [x] Agregação de dados por faixa etária (`byAge`)
- [x] Análise completa de questões

### 🔲 Precisa Funcionar Perfeitamente:
- [ ] **Sistema de carregamento automático 7h00 e 19h00**
  - Carregar dados do Firebase automaticamente
  - Atualizar cache sem sobrecarga
  - Garantir dados sempre atualizados

- [ ] **Geração de JSON estático com estatísticas**
  - Exportar dados agregados para arquivo JSON
  - Dados anonimizados (sem info pessoal)
  - Atualizado automaticamente às 7h/19h

---

## 📐 Arquitetura Proposta

### **Opção 1: JSON Estático (Recomendado)** ⭐
```
Admin Panel (7h/19h)
  ↓
Carrega dados do Firebase
  ↓
Gera arquivo: /data/public_stats.json
  ↓
Página pública lê JSON e renderiza
  ↓
Zero calls ao Firebase = Rápido e Gratuito
```

**Vantagens:**
- ✅ Sem custo Firebase (não faz queries)
- ✅ Super rápido (JSON estático)
- ✅ Escalável (milhares de visitas/dia)
- ✅ Fácil de implementar

**Desvantagens:**
- ❌ Dados atualizados 2x/dia apenas
- ❌ Precisa de trigger automático

---

### **Opção 2: API Firebase Functions**
```
Página pública
  ↓
Chama Cloud Function: /api/stats
  ↓
Function busca dados agregados do Firestore
  ↓
Retorna JSON com estatísticas
```

**Vantagens:**
- ✅ Dados sempre atualizados
- ✅ Controle fino de permissões

**Desvantagens:**
- ❌ Custo Firebase (queries + functions)
- ❌ Mais complexo de implementar
- ❌ Pode ser lento com muitos acessos

---

### **Opção 3: Híbrido (JSON + Cache)**
```
JSON estático (atualizado 2x/dia)
  +
Cache no browser (24h)
  +
Fallback para dados anteriores se falhar
```

**Vantagens:**
- ✅ Melhor dos dois mundos
- ✅ Resiliente a falhas

---

## 📄 Estrutura do JSON Público

### **Arquivo:** `/data/public_stats.json`

```json
{
  "meta": {
    "lastUpdate": "2025-12-16T07:00:00Z",
    "totalUsers": 1234,
    "totalResponses": 45678,
    "totalQuestions": 300
  },
  "topQuestions": {
    "mostOpen": [
      {
        "pack": "romantico",
        "packName": "Pack Romântico",
        "question": "Gostarias de fazer uma viagem romântica juntos?",
        "openRate": 95,
        "totalResponses": 890,
        "responses": {
          "porfavor": 720,
          "yup": 150,
          "talvez": 15,
          "meh": 5
        }
      }
      // ... top 10
    ],
    "mostClosed": [
      {
        "pack": "kinks",
        "packName": "Pack Fetiches",
        "question": "Gostarias de experimentar...",
        "openRate": 15,
        "totalResponses": 450,
        "responses": {
          "porfavor": 20,
          "yup": 30,
          "talvez": 100,
          "meh": 300
        }
      }
      // ... top 10
    ]
  },
  "byGender": {
    "romantico": {
      "M": {
        "avgOpenRate": 78,
        "totalResponses": 12000,
        "topQuestion": "Questão X"
      },
      "F": {
        "avgOpenRate": 82,
        "totalResponses": 15000,
        "topQuestion": "Questão Y"
      }
    }
    // ... outros packs
  },
  "byAge": {
    "18-25": {
      "avgOpenRate": 85,
      "totalResponses": 8000,
      "mostPopularPack": "pimentinha"
    },
    "26-35": {
      "avgOpenRate": 78,
      "totalResponses": 20000,
      "mostPopularPack": "experiencia"
    }
    // ... outras faixas
  },
  "comparisons": {
    "genderGap": {
      "romantico": 4,  // Mulheres 4% mais abertas
      "pimentinha": -2,  // Homens 2% mais abertos
      "kinks": -8
    },
    "ageGap": {
      "romantico": {
        "18-25": 85,
        "26-35": 78,
        "36-45": 72
      }
    }
  },
  "insights": [
    "🔥 Mulheres são 15% mais abertas no Pack Romântico",
    "🎂 Pessoas entre 18-25 são as mais aventureiras",
    "💕 A questão mais popular tem 95% de aceitação"
  ]
}
```

---

## 🎨 Design da Página Pública

### **URL:** `https://quest4couple.pt/estatisticas.html`

### **Seções:**

#### **1. Hero Section**
```html
<section class="hero">
  <h1>📊 Estatísticas Quest4Couple</h1>
  <p>Descubra como milhares de pessoas responderam aos nossos questionários</p>
  <div class="stats-summary">
    <div class="stat-card">
      <span class="stat-number">1,234</span>
      <span class="stat-label">Utilizadores</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">45,678</span>
      <span class="stat-label">Respostas</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">300</span>
      <span class="stat-label">Questões</span>
    </div>
  </div>
  <p class="last-update">Última atualização: 16 Dez 2025, 07:00</p>
</section>
```

#### **2. Top 10 Questões Mais Abertas** 🔥
```html
<section class="top-questions">
  <h2>🔥 Top 10: Questões Mais Abertas</h2>
  <p>As questões onde o público é mais receptivo</p>
  
  <div class="questions-list">
    <div class="question-card">
      <div class="rank">#1</div>
      <div class="pack-badge romantico">💕 Romântico</div>
      <p class="question-text">Gostarias de fazer uma viagem romântica juntos?</p>
      <div class="stats-bar">
        <div class="bar-segment porfavor" style="width: 80%">Por Favor! 80%</div>
        <div class="bar-segment yup" style="width: 15%">Yup! 15%</div>
        <div class="bar-segment talvez" style="width: 3%">Talvez 3%</div>
        <div class="bar-segment meh" style="width: 2%">Meh 2%</div>
      </div>
      <p class="open-rate">✨ Taxa de Abertura: <strong>95%</strong></p>
      <p class="responses">890 respostas</p>
    </div>
    <!-- Repetir para top 10 -->
  </div>
</section>
```

#### **3. Top 10 Questões Mais Fechadas** ❄️
```html
<section class="bottom-questions">
  <h2>❄️ Top 10: Questões Mais Conservadoras</h2>
  <p>As questões onde o público é mais reservado</p>
  
  <!-- Similar ao acima, mas invertido -->
</section>
```

#### **4. Diferenças por Género** ⚧️
```html
<section class="gender-comparison">
  <h2>⚧️ Homens vs Mulheres: Como Diferem?</h2>
  
  <div class="comparison-cards">
    <div class="pack-comparison">
      <h3>💕 Pack Romântico</h3>
      <div class="gender-bars">
        <div class="gender-bar">
          <span>♀️ Mulheres</span>
          <div class="bar" style="width: 82%">82%</div>
        </div>
        <div class="gender-bar">
          <span>♂️ Homens</span>
          <div class="bar" style="width: 78%">78%</div>
        </div>
      </div>
      <p class="insight">💡 Mulheres são 4% mais abertas</p>
    </div>
    <!-- Repetir para cada pack -->
  </div>
</section>
```

#### **5. Diferenças por Faixa Etária** 🎂
```html
<section class="age-comparison">
  <h2>🎂 Como a Idade Influencia as Respostas?</h2>
  
  <div class="age-chart">
    <!-- Gráfico de linha mostrando openRate por faixa etária -->
    <canvas id="ageChart"></canvas>
  </div>
  
  <div class="age-insights">
    <div class="insight-card">
      <span class="emoji">🔥</span>
      <h3>18-25 anos</h3>
      <p>As mais aventureiras</p>
      <p class="stat">85% taxa de abertura</p>
    </div>
    <div class="insight-card">
      <span class="emoji">💼</span>
      <h3>26-35 anos</h3>
      <p>Equilibradas e exploradoras</p>
      <p class="stat">78% taxa de abertura</p>
    </div>
    <!-- Outras faixas -->
  </div>
</section>
```

#### **6. Insights e Curiosidades** 💡
```html
<section class="insights">
  <h2>💡 Insights Interessantes</h2>
  
  <div class="insights-grid">
    <div class="insight-box">
      <span class="emoji">🔥</span>
      <p>Mulheres são <strong>15%</strong> mais abertas no Pack Romântico</p>
    </div>
    <div class="insight-box">
      <span class="emoji">🎂</span>
      <p>Pessoas entre <strong>18-25</strong> são as mais aventureiras</p>
    </div>
    <div class="insight-box">
      <span class="emoji">💕</span>
      <p>A questão mais popular tem <strong>95%</strong> de aceitação</p>
    </div>
    <!-- Mais insights -->
  </div>
</section>
```

#### **7. CTA (Call to Action)**
```html
<section class="cta">
  <h2>✨ Quer Descobrir a Vossa Compatibilidade?</h2>
  <p>Responda aos questionários e veja o vosso relatório personalizado</p>
  <a href="app.html" class="btn-primary">📝 Começar Agora</a>
  <p class="cta-note">100% Gratuito • Privado • Sem login necessário para ver</p>
</section>
```

---

## 🛠️ Implementação Técnica

### **Fase 1: Sistema de Geração de JSON** ⚙️

#### **1.1. Criar função no admin.html**
```javascript
async function generatePublicStats() {
  console.log('📊 Gerando estatísticas públicas...');
  
  // Buscar dados do cache ou Firebase
  const stats = await calculatePublicStats();
  
  // Criar JSON
  const publicJSON = {
    meta: {
      lastUpdate: new Date().toISOString(),
      totalUsers: allUsers.length,
      totalResponses: calculateTotalResponses(),
      totalQuestions: 300
    },
    topQuestions: {
      mostOpen: getTopQuestions('open', 10),
      mostClosed: getTopQuestions('closed', 10)
    },
    byGender: aggregateByGender(),
    byAge: aggregateByAge(),
    comparisons: calculateComparisons(),
    insights: generateInsights()
  };
  
  // Salvar localmente (para teste)
  downloadJSON(publicJSON, 'public_stats.json');
  
  // Em produção: Upload para Firebase Storage ou Netlify
  // await uploadToStorage(publicJSON);
  
  console.log('✅ Estatísticas públicas geradas!');
}
```

#### **1.2. Funções auxiliares**
```javascript
function getTopQuestions(type, limit) {
  // Usar questionAnalyticsCache
  let sorted = [...questionAnalyticsCache];
  
  if (type === 'open') {
    sorted.sort((a, b) => b.openRate - a.openRate);
  } else {
    sorted.sort((a, b) => a.openRate - b.openRate);
  }
  
  return sorted.slice(0, limit).map(q => ({
    pack: q.packId,
    packName: getPackName(q.packId),
    question: q.questionText,
    openRate: q.openRate,
    totalResponses: q.total,
    responses: {
      porfavor: q.porfavor,
      yup: q.yup,
      talvez: q.talvez,
      meh: q.meh
    }
  }));
}

function aggregateByGender() {
  // Calcular médias por pack e género
  const result = {};
  
  ['romantico', 'experiencia', 'pimentinha', 'poliamor', 'kinks'].forEach(pack => {
    result[pack] = {
      M: calculateGenderStats(pack, 'M'),
      F: calculateGenderStats(pack, 'F')
    };
  });
  
  return result;
}

function aggregateByAge() {
  // Calcular médias por faixa etária
  const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56+'];
  const result = {};
  
  ageRanges.forEach(range => {
    result[range] = calculateAgeStats(range);
  });
  
  return result;
}
```

---

### **Fase 2: Automação 7h/19h** ⏰

#### **2.1. Integrar com sistema de agendamento**
```javascript
function initScheduledDataLoading() {
  console.log('⏰ Inicializando carregamento agendado...');
  
  // ... código existente ...
  
  scheduledLoadInterval = setInterval(() => {
    const now = new Date();
    
    if (nextScheduledLoad && now >= nextScheduledLoad) {
      console.log('⏰ Hora de carregar dados!');
      
      // Carregar dados
      manualReloadAllData();
      
      // ✨ NOVO: Gerar estatísticas públicas
      generatePublicStats();
      
      updateNextScheduledLoad();
    }
    
    updateNextLoadTimeDisplay();
  }, 60000); // Verificar a cada minuto
}
```

#### **2.2. Botão manual no admin**
```html
<button onclick="generatePublicStats()" class="btn-export">
  📊 Gerar Stats Públicas
</button>
```

---

### **Fase 3: Página HTML** 🎨

#### **3.1. Criar estatisticas.html**
```html
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <title>📊 Estatísticas Quest4Couple</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/stats.css">
</head>
<body>
  <!-- Header igual ao site -->
  
  <!-- Hero Section -->
  
  <!-- Top Questions -->
  
  <!-- Gender Comparison -->
  
  <!-- Age Comparison -->
  
  <!-- Insights -->
  
  <!-- CTA -->
  
  <!-- Footer -->
  
  <script src="js/stats.js"></script>
</body>
</html>
```

#### **3.2. Criar css/stats.css**
```css
/* Estilos específicos para página de estatísticas */
.stats-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 40px 0;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-number {
  font-size: 3em;
  font-weight: 900;
  background: linear-gradient(135deg, #d63384, #6f42c1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.question-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.stats-bar {
  display: flex;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  margin: 15px 0;
}

.bar-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9em;
}

.bar-segment.porfavor {
  background: linear-gradient(135deg, #28a745, #20c997);
}

.bar-segment.yup {
  background: linear-gradient(135deg, #17a2b8, #138496);
}

.bar-segment.talvez {
  background: linear-gradient(135deg, #ffc107, #ff9800);
}

.bar-segment.meh {
  background: linear-gradient(135deg, #dc3545, #c82333);
}
```

#### **3.3. Criar js/stats.js**
```javascript
async function loadPublicStats() {
  try {
    console.log('📊 Carregando estatísticas públicas...');
    
    // Buscar JSON
    const response = await fetch('data/public_stats.json');
    const stats = await response.json();
    
    // Renderizar
    renderHeroStats(stats.meta);
    renderTopQuestions(stats.topQuestions.mostOpen, 'mostOpen');
    renderTopQuestions(stats.topQuestions.mostClosed, 'mostClosed');
    renderGenderComparison(stats.byGender);
    renderAgeComparison(stats.byAge);
    renderInsights(stats.insights);
    
    console.log('✅ Estatísticas carregadas!');
    
  } catch (error) {
    console.error('❌ Erro ao carregar estatísticas:', error);
    showError('Não foi possível carregar as estatísticas. Tente novamente mais tarde.');
  }
}

function renderHeroStats(meta) {
  document.getElementById('totalUsers').textContent = meta.totalUsers.toLocaleString('pt-PT');
  document.getElementById('totalResponses').textContent = meta.totalResponses.toLocaleString('pt-PT');
  document.getElementById('totalQuestions').textContent = meta.totalQuestions;
  document.getElementById('lastUpdate').textContent = new Date(meta.lastUpdate).toLocaleString('pt-PT');
}

function renderTopQuestions(questions, containerId) {
  const container = document.getElementById(containerId);
  
  questions.forEach((q, index) => {
    const card = createQuestionCard(q, index + 1);
    container.appendChild(card);
  });
}

function createQuestionCard(q, rank) {
  const total = q.totalResponses || 1;
  
  const card = document.createElement('div');
  card.className = 'question-card';
  
  card.innerHTML = `
    <div class="rank">#${rank}</div>
    <div class="pack-badge ${q.pack}">${getPackEmoji(q.pack)} ${q.packName}</div>
    <p class="question-text">${q.question}</p>
    <div class="stats-bar">
      <div class="bar-segment porfavor" style="width: ${(q.responses.porfavor/total)*100}%">
        Por Favor! ${Math.round((q.responses.porfavor/total)*100)}%
      </div>
      <div class="bar-segment yup" style="width: ${(q.responses.yup/total)*100}%">
        Yup! ${Math.round((q.responses.yup/total)*100)}%
      </div>
      <div class="bar-segment talvez" style="width: ${(q.responses.talvez/total)*100}%">
        Talvez ${Math.round((q.responses.talvez/total)*100)}%
      </div>
      <div class="bar-segment meh" style="width: ${(q.responses.meh/total)*100}%">
        Meh ${Math.round((q.responses.meh/total)*100)}%
      </div>
    </div>
    <p class="open-rate">✨ Taxa de Abertura: <strong>${q.openRate}%</strong></p>
    <p class="responses">${q.totalResponses} respostas</p>
  `;
  
  return card;
}

// Carregar ao abrir página
document.addEventListener('DOMContentLoaded', loadPublicStats);
```

---

## 📅 Cronograma de Implementação

### **Semana 1: Geração de JSON**
- [ ] Criar função `generatePublicStats()` no admin
- [ ] Implementar funções auxiliares
- [ ] Testar geração manual
- [ ] Validar estrutura do JSON

### **Semana 2: Automação**
- [ ] Integrar com sistema 7h/19h
- [ ] Testar carregamento automático
- [ ] Upload para Firebase Storage ou Netlify
- [ ] Verificar robustez

### **Semana 3: Página HTML**
- [ ] Criar `estatisticas.html`
- [ ] Implementar CSS responsivo
- [ ] JavaScript de carregamento
- [ ] Gráficos (Chart.js)

### **Semana 4: Polimento**
- [ ] Testes em mobile
- [ ] Otimização de performance
- [ ] SEO e meta tags
- [ ] Lançamento! 🚀

---

## 🎯 Métricas de Sucesso

- [ ] Página carrega em < 2 segundos
- [ ] Responsiva em todos os dispositivos
- [ ] Zero queries ao Firebase (custo = 0)
- [ ] Dados sempre atualizados (2x/dia)
- [ ] Aumento de 20% em novos registos
- [ ] Conteúdo viral (partilhas sociais)

---

## 📝 Conclusão

Esta página de estatísticas públicas será:
- ✅ **Atrativa:** Dados interessantes e visuais bonitos
- ✅ **Viral:** Conteúdo para partilhar ("Veja como as pessoas responderam!")
- ✅ **Educativa:** Insights sobre relacionamentos
- ✅ **Marketing:** Atrai novos utilizadores para o site
- ✅ **Gratuita:** Zero custo Firebase (JSON estático)

**Próximo Passo:** Implementar sistema de agendamento 7h/19h perfeitamente funcional! ⏰

---

**Status:** 📋 Aguardando implementação  
**Dependência:** Sistema 7h/19h funcionando 100%
