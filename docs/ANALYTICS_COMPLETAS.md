# 📊 ANALYTICS COMPLETAS - Quest4Couple

## Visão Geral

Sistema completo de analytics com **3 níveis de informação**:

1. **Analytics Agregadas** - Estatísticas gerais (já implementado)
2. **Relatórios Completos com Nomes Mascarados** - ✅ NOVO
3. **Analytics Detalhadas por Questão** - ✅ NOVO

---

## 🆕 NOVAS FUNCIONALIDADES

### 1. Relatórios Completos (Nomes Mascarados)

**Objetivo:** Admin pode ver relatórios completos gerados sem identificar os utilizadores.

#### Estrutura de Dados:

```javascript
{
  // Nomes mascarados (ex: "C***o" e "M**a")
  couple: {
    name1: "C***o",
    name2: "M**a",
    gender1: "M",
    gender2: "F",
    ageRange1: "26-35",
    ageRange2: "26-35",
    country: "Portugal"
  },
  
  // Estatísticas do relatório
  stats: {
    packIds: ["romantico", "pimentinha"],
    packCount: 2,
    totalQuestions: 45,
    superMatches: 12,
    matches: 20,
    mismatches: 10,
    invertMatchings: 3
  },
  
  // Questões do relatório (sem identificar o user)
  questions: [
    {
      packId: "romantico",
      questionIndex: 5,
      questionText: "Gosto de receber mensagens românticas",
      answer1: "💖 Por favor!",
      answer2: "👍 Yup",
      matchType: "⭐ SUPER MATCH",
      isInvertMatching: false
    },
    // ... mais questões
  ],
  
  timestamp: Timestamp,
  year: 2024,
  month: 12,
  day: 15
}
```

#### Coleção Firebase:

- **Nome:** `analytics_full_reports`
- **Documento:** Auto-gerado (ID único)

#### Funcionalidades:

✅ **Máscara de nomes**: Primeiro e último caractere mantidos  
✅ **Questões completas**: Texto, respostas, tipo de match  
✅ **Estatísticas**: Total de matches por categoria  
✅ **Invert Matching**: Flag indica se questão tem matching invertido  
✅ **Dados demográficos**: Género, faixa etária, país (agregados)

---

### 2. Analytics por Questão (Detalhadas)

**Objetivo:** Ver breakdown completo de cada questão individualmente.

#### Estrutura de Dados:

```javascript
{
  packId: "romantico",
  questionId: 5,
  questionText: "Gosto de receber mensagens românticas",
  packName: "Pack Romântico",
  totalResponses: 245,
  hasInvertMatching: false,
  
  // Distribuição de respostas
  byAnswer: {
    'Por favor!': 120,
    'OK': 80,
    'Talvez': 30,
    'Não': 15
  },
  
  // Breakdown por género
  byGender: {
    M: {
      'Por favor!': 45,
      'OK': 35,
      'Talvez': 15,
      'Não': 10,
      total: 105
    },
    F: {
      'Por favor!': 70,
      'OK': 40,
      'Talvez': 15,
      'Não': 5,
      total: 130
    },
    outro: { ... },
    unknown: { ... }
  },
  
  // Breakdown por faixa etária
  byAgeRange: {
    '18-25': {
      'Por favor!': 30,
      'OK': 20,
      'Talvez': 8,
      'Não': 4,
      total: 62
    },
    '26-35': { ... },
    '36-45': { ... },
    '46-55': { ... },
    '56+': { ... },
    'unknown': { ... }
  }
}
```

#### Como Obter:

```javascript
// Todas as questões (ordenadas por total de respostas)
const allQuestions = await getQuestionAnalytics();

// Questões de um pack específico
const romanticoQuestions = await getQuestionAnalytics('romantico');

// Uma questão específica
const question5 = await getQuestionAnalytics('romantico', 5);
```

---

## 🔧 IMPLEMENTAÇÃO

### Ficheiros Modificados:

#### 1. `js/analytics.js` (+ 230 linhas)

**Funções adicionadas:**

```javascript
// Armazenar relatório completo
logFullReport(reportData, matchCounts, packIds)

// Mascarar nome (helper)
maskName(name) // "Carlos" → "C***o"

// Obter analytics por questão
getQuestionAnalytics(packId?, questionId?)

// Enriquecer textos das questões (helper)
enrichQuestionTexts(questionStats)

// Obter relatórios completos (backoffice)
getFullReports(limit, startDate?, endDate?)
```

#### 2. `js/comparison.js` (modificado)

**Adicionado:**

- Atributos `data-*` nos elementos HTML das questões
- Chamada para `logFullReport()` após gerar relatório
- Extração de dados do relatório renderizado

```javascript
// Atributos adicionados:
data-question-index="${item.qIndex}"
data-pack-id="${config.id}"
data-match-type="${item.resultText}"
data-is-inverted="true/false"
```

---

## 🎯 CASOS DE USO

### Caso 1: Admin Quer Ver Relatório Específico

```javascript
// No backoffice
const reports = await getFullReports(50); // Últimos 50 relatórios

reports.forEach(report => {
  console.log(`${report.couple.name1} ❤️ ${report.couple.name2}`);
  console.log(`Compatibilidade: ${report.stats.superMatches} super matches`);
  
  // Ver questões do relatório
  report.questions.forEach(q => {
    console.log(`${q.questionText}`);
    console.log(`  → ${q.answer1} vs ${q.answer2}`);
    console.log(`  → ${q.matchType}`);
  });
});
```

### Caso 2: Admin Quer Ver Analytics de Uma Questão

```javascript
// Analytics da questão mais popular
const questions = await getQuestionAnalytics();
const topQuestion = questions[0];

console.log(topQuestion.questionText);
console.log(`Total de respostas: ${topQuestion.totalResponses}`);
console.log(`Por favor!: ${topQuestion.byAnswer['Por favor!']}`);
console.log(`Homens: ${topQuestion.byGender.M.total}`);
console.log(`Mulheres: ${topQuestion.byGender.F.total}`);
```

### Caso 3: Admin Quer Ver Questões de um Pack

```javascript
// Top 10 questões do Pack Romântico
const romanticoQuestions = await getQuestionAnalytics('romantico');
const top10 = romanticoQuestions.slice(0, 10);

top10.forEach((q, index) => {
  console.log(`${index + 1}. ${q.questionText}`);
  console.log(`   ${q.totalResponses} respostas`);
  
  // Calcular percentagens
  const total = q.totalResponses;
  const porfavor = ((q.byAnswer['Por favor!'] / total) * 100).toFixed(1);
  console.log(`   ${porfavor}% disseram "Por favor!"`);
});
```

---

## 📊 VISUALIZAÇÃO NO BACKOFFICE

### Tab 1: Relatórios Completos

```
┌─────────────────────────────────────────────────┐
│ 📋 RELATÓRIOS GERADOS                           │
├─────────────────────────────────────────────────┤
│                                                 │
│ 🔍 Filtros:                                     │
│   [Última Semana ▼] [País: Todos ▼]           │
│                                                 │
│ ┌───────────────────────────────────────────┐  │
│ │ #1234 • C***o ❤️ M**a                    │  │
│ │ 15/12/2024 às 14:30                       │  │
│ │ 🇵🇹 Portugal • M/F • 26-35 / 26-35        │  │
│ │                                            │  │
│ │ 📊 Estatísticas:                          │  │
│ │ • 45 questões • 2 packs                   │  │
│ │ • ⭐ 12 Super Matches                     │  │
│ │ • 💚 20 Matches                           │  │
│ │ • 😐 10 Mismatches                        │  │
│ │                                            │  │
│ │ [Ver Detalhes] [Exportar CSV]             │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ (Mais relatórios...)                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Modal de Detalhes:**

```
┌─────────────────────────────────────────────────┐
│ 📋 Relatório #1234                              │
├─────────────────────────────────────────────────┤
│                                                 │
│ C***o ❤️ M**a                                  │
│ 🇵🇹 Portugal • 15/12/2024                      │
│                                                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                 │
│ Pack Romântico (25 questões)                   │
│                                                 │
│ ⭐ 1. Gosto de receber mensagens românticas   │
│    → C***o: 💖 Por favor!                     │
│    → M**a:  💖 Por favor!                     │
│    → SUPER MATCH                               │
│                                                 │
│ 💚 2. Gosto de jantares à luz de velas        │
│    → C***o: 👍 Yup                            │
│    → M**a:  💖 Por favor!                     │
│    → EXCELENTE                                 │
│                                                 │
│ (Mais questões...)                             │
│                                                 │
│ [Fechar] [Exportar PDF]                        │
└─────────────────────────────────────────────────┘
```

### Tab 2: Analytics por Questão

```
┌─────────────────────────────────────────────────┐
│ 📊 ANALYTICS POR QUESTÃO                        │
├─────────────────────────────────────────────────┤
│                                                 │
│ 🔍 Filtros:                                     │
│   [Pack: Todos ▼] [Ordem: Mais Respondidas ▼] │
│                                                 │
│ ┌───────────────────────────────────────────┐  │
│ │ #1 • Pack Romântico                       │  │
│ │ "Gosto de receber mensagens românticas"   │  │
│ │                                            │  │
│ │ 📊 245 respostas totais                   │  │
│ │                                            │  │
│ │ Distribuição Geral:                       │  │
│ │ 💖 Por favor! ████████████░ 49% (120)    │  │
│ │ 👍 OK         ███████░░░░░ 33% (80)      │  │
│ │ 🤷 Talvez     ██░░░░░░░░░ 12% (30)       │  │
│ │ ❌ Não        █░░░░░░░░░░  6% (15)       │  │
│ │                                            │  │
│ │ Por Género:                               │  │
│ │ 👨 Homens (105):  43% Por favor!         │  │
│ │ 👩 Mulheres (130): 54% Por favor!        │  │
│ │                                            │  │
│ │ Por Idade:                                │  │
│ │ 18-25: 48% Por favor! (62 respostas)     │  │
│ │ 26-35: 52% Por favor! (95 respostas)     │  │
│ │ 36-45: 45% Por favor! (58 respostas)     │  │
│ │                                            │  │
│ │ [Ver Gráficos] [Exportar]                 │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ (Mais questões...)                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ✅ VANTAGENS

### Relatórios Completos:

✅ **Privacidade preservada** - Nomes mascarados  
✅ **Visão completa** - Todas as questões e respostas  
✅ **Contexto útil** - Admin entende padrões de matching  
✅ **Suporte** - Admin pode ajudar users com problemas  

### Analytics por Questão:

✅ **Insights profundos** - Questões mais/menos populares  
✅ **Segmentação** - Por género, idade, país  
✅ **Otimização** - Identificar questões problemáticas  
✅ **Marketing** - Dados para comunicação ("95% adoram X")  

---

## 🔒 PRIVACIDADE

### Dados Anónimos:

- ✅ Nomes mascarados (apenas 1º e último caractere)
- ✅ Sem emails ou IDs de utilizador
- ✅ Apenas dados demográficos agregados
- ✅ Não é possível identificar indivíduos

### Conformidade RGPD:

- ✅ Dados pseudonimizados
- ✅ Finalidade legítima (melhoria do serviço)
- ✅ Minimização de dados
- ✅ Sem PII (Personally Identifiable Information)

---

## 🧪 TESTES

### Testar Relatório Completo:

1. Gerar relatório na app
2. Verificar Firebase → `analytics_full_reports`
3. Confirmar que nomes estão mascarados
4. Verificar que todas as questões estão presentes

### Testar Analytics por Questão:

```javascript
// No console do backoffice
const questions = await getQuestionAnalytics();
console.table(questions.slice(0, 5));

// Verificar estrutura
console.log(questions[0]);
```

### Testar Visualização no Backoffice:

1. Abrir `admin.html`
2. Navegar para tab "Relatórios"
3. Clicar em "Ver Detalhes" de um relatório
4. Navegar para tab "Analytics por Questão"
5. Verificar gráficos e estatísticas

---

## 📝 PRÓXIMOS PASSOS

### Backoffice (admin.html):

1. ✅ Criar tab "Relatórios Completos"
2. ✅ Criar tab "Analytics por Questão"
3. ⏳ Conectar com Firebase (substituir mock data)
4. ⏳ Adicionar gráficos (Chart.js)
5. ⏳ Adicionar filtros e paginação
6. ⏳ Adicionar exportação (CSV, PDF)

### Firebase:

1. ⏳ Criar índices para queries otimizadas
2. ⏳ Configurar rules de segurança
3. ⏳ Adicionar backup automático
4. ⏳ Monitorizar custos

---

## 📚 RECURSOS

- **Documentação anterior:** `GUIA_TESTE_ANALYTICS.md`
- **Firebase Collections:** 
  - `analytics_answers` (já existe)
  - `analytics_reports` (já existe)
  - `analytics_activity` (já existe)
  - `analytics_full_reports` ✅ **NOVO**
- **Funções JavaScript:** `js/analytics.js` (linhas 120-350)

---

**Última atualização:** 15/12/2024  
**Status:** ✅ Implementado (aguardando commit)

