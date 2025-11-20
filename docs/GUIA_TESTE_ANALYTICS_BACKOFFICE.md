# 🧪 Guia de Teste Rápido - Analytics BackOffice

**Data:** 20 de Novembro de 2025

---

## ⚡ Teste Rápido (5 minutos)

### 1. Aceder ao BackOffice
```
1. Abrir browser
2. Navegar para: file:///G:/O%20meu%20disco/Formação%20JAVA%20-%20Projetos/Quest4Couple_v2_free/pages/admin.html
3. Fazer login:
   Username: carlos.sousacorreia
   Password: rzq7xgq8
```

### 2. Verificar Novos Tabs
```
✅ Confirmar que aparecem 6 tabs:
   1. 📊 Dashboard
   2. 👥 Utilizadores
   3. 📈 Relatórios
   4. 📋 Relatórios Completos    ← NOVO
   5. 📊 Análise de Questões     ← NOVO
   6. 📝 Log de Atividade
```

### 3. Testar "Relatórios Completos"
```
1. Clicar em "📋 Relatórios Completos"
2. Verificar:
   ✅ Aparecem filtros (Período + Compatibilidade)
   ✅ Aparecem relatórios OU mensagem "Nenhum relatório encontrado"
3. Se existirem relatórios:
   ✅ Nomes estão anonimizados (ex: "C***o ❤️ M**a")
   ✅ Aparecem estatísticas (%, país, género, idade)
   ✅ Botões "Ver Detalhes" e "CSV" funcionam
4. Clicar num relatório:
   ✅ Modal abre com detalhes completos
   ✅ Fechar modal funciona (X, ESC, clicar fora)
```

### 4. Testar "Análise de Questões"
```
1. Clicar em "📊 Análise de Questões"
2. Verificar:
   ✅ Aparecem filtros (Pacote + Mínimo Respostas)
   ✅ Aparecem questões OU mensagem "Nenhuma questão"
3. Se existirem questões:
   ✅ Aparecem estatísticas por resposta
   ✅ Aparecem gráficos de barras
   ✅ Aparecem distribuições (género + idade)
   ✅ Botão "Exportar CSV" funciona
```

---

## 🔥 Teste Completo (15 minutos)

### Pré-requisito: Gerar Dados de Teste

#### Opção A: Gerar Relatório Real
```
1. Abrir app.html
2. Fazer login com 2 utilizadores diferentes
3. Responder a algumas questões
4. Gerar relatório de compatibilidade
5. Voltar ao BackOffice
```

#### Opção B: Dados Mock (Desenvolvimento)
```javascript
// Executar no console do browser (admin.html)
// ATENÇÃO: Apenas para testes!

// Simular relatório completo
const mockReport = {
  couple: {
    name1: "Carlos",
    name2: "Maria",
    gender1: "M",
    gender2: "F",
    ageRange1: "25-34",
    ageRange2: "25-34",
    country: "Portugal"
  },
  stats: {
    superMatches: 15,
    matches: 28,
    mismatches: 12,
    invertMatching: 3,
    totalQuestions: 58
  },
  questions: [
    {
      packId: "pimentinha",
      packName: "Pimentinha",
      questionIndex: 0,
      questionText: "Fazer amor ao ar livre",
      answer1: "Por favor!",
      answer2: "OK",
      matchType: "match",
      isInverted: false
    }
  ],
  timestamp: firebase.firestore.Timestamp.now()
};

// Adicionar ao Firebase
db.collection('analytics_full_reports').add(mockReport)
  .then(() => console.log('✅ Relatório mock adicionado'))
  .catch(err => console.error('❌ Erro:', err));
```

---

### Testes Detalhados

#### 📋 Relatórios Completos - Testes

##### Teste 1: Visualização Básica
- [ ] Tab abre sem erros
- [ ] Loading aparece e desaparece
- [ ] Cards aparecem formatados corretamente
- [ ] Nomes estão anonimizados
- [ ] Percentagem de compatibilidade está correta
- [ ] Bandeira do país aparece
- [ ] Estatísticas (Super Matches, etc.) aparecem

##### Teste 2: Filtros
```
Filtro por Período:
- [ ] "Todos" - mostra todos os relatórios
- [ ] "Hoje" - mostra apenas de hoje
- [ ] "Última Semana" - mostra dos últimos 7 dias
- [ ] "Último Mês" - mostra dos últimos 30 dias

Filtro por Compatibilidade:
- [ ] "Todas" - mostra todos
- [ ] "Alta (≥80%)" - mostra apenas ≥80%
- [ ] "Média (60-79%)" - mostra entre 60-79%
- [ ] "Baixa (<60%)" - mostra <60%

Botão Limpar:
- [ ] Reseta filtros para default
```

##### Teste 3: Modal de Detalhes
- [ ] Clicar em card abre modal
- [ ] Clicar em "Ver Detalhes" abre modal
- [ ] Modal mostra todas as questões
- [ ] Respostas aparecem corretamente
- [ ] Match types têm cores corretas (verde/laranja/vermelho)
- [ ] Scroll funciona se conteúdo é longo
- [ ] Fechar modal:
  - [ ] Botão X funciona
  - [ ] Tecla ESC funciona
  - [ ] Clicar fora funciona

##### Teste 4: Export CSV
- [ ] Clicar em "CSV" inicia download
- [ ] Ficheiro tem nome correto
- [ ] CSV contém dados completos
- [ ] Acentos aparecem corretamente (UTF-8)

---

#### 📊 Análise de Questões - Testes

##### Teste 1: Visualização Básica
- [ ] Tab abre sem erros
- [ ] Loading aparece e desaparece
- [ ] Cards de questões aparecem
- [ ] Texto da questão aparece corretamente
- [ ] Total de respostas está correto
- [ ] Badge "INVERT" aparece quando aplicável

##### Teste 2: Distribuição Geral
- [ ] Percentagens somam ~100%
- [ ] Números absolutos estão corretos
- [ ] Barras de progresso têm tamanho proporcional
- [ ] Cores estão corretas:
  - 💖 Por favor! - Verde
  - 👍 OK - Verde
  - 🤔 Talvez - Laranja
  - ❌ Não - Vermelho

##### Teste 3: Distribuição por Género
- [ ] Mostra ♂️ Masculino
- [ ] Mostra ♀️ Feminino
- [ ] Mostra ⚧️ Outro
- [ ] Números estão corretos
- [ ] Barras têm tamanho proporcional

##### Teste 4: Distribuição por Idade
- [ ] Mostra todas as faixas etárias
- [ ] Números estão corretos
- [ ] Percentagens estão corretas

##### Teste 5: Filtros
```
Filtro por Pacote:
- [ ] "Todos os Pacotes" - mostra todas
- [ ] Selecionar pacote específico - filtra corretamente

Filtro por Mínimo Respostas:
- [ ] 0 - mostra todas
- [ ] 5 - mostra apenas com ≥5 respostas
- [ ] 10 - mostra apenas com ≥10 respostas

Botão Limpar:
- [ ] Reseta filtros para default
```

##### Teste 6: Export CSV
- [ ] Clicar em "Exportar CSV" inicia download
- [ ] CSV contém estatísticas completas
- [ ] Formatação está correta

---

## 🐛 Checklist de Bugs Comuns

### Verificar se NÃO acontece:

#### Erros JavaScript
- [ ] Sem erros no console do browser (F12)
- [ ] Sem avisos de funções undefined
- [ ] Sem erros de Firebase permissions

#### Problemas de UI
- [ ] Cards não sobrepõem
- [ ] Texto não fica cortado
- [ ] Botões todos clicáveis
- [ ] Modal não desaparece atrás de outros elementos
- [ ] Scroll funciona em todos os containers

#### Problemas de Dados
- [ ] Nomes não aparecem completos (devem estar anonimizados)
- [ ] Percentagens não ultrapassam 100%
- [ ] Números não são negativos
- [ ] Datas estão formatadas corretamente

---

## 📊 Resultados Esperados

### Relatórios Completos
```
Exemplo de Card:
┌─────────────────────────────────────┐
│ #1 • C***o ❤️ M**a           82%  │
│ 20/11/2025, 14:30                   │
│                                     │
│ 🇵🇹 Portugal  👤 M/F  🎂 25-34/25-34│
│                                     │
│ ⭐ 15  💚 28  😐 12  📋 58        │
│                                     │
│ [📋 Ver Detalhes]  [📊 CSV]       │
└─────────────────────────────────────┘
```

### Análise de Questões
```
Exemplo de Card:
┌─────────────────────────────────────┐
│ #1  Pimentinha  🔄 INVERT      45  │
│ Fazer amor ao ar livre              │
│                                     │
│ 📊 Distribuição Geral               │
│ 💖 Por favor! ████████ 40% (18)    │
│ 👍 OK        ██████░░ 30% (13)     │
│ 🤔 Talvez    ████░░░░ 20% (9)      │
│ ❌ Não       ██░░░░░░ 10% (5)      │
│                                     │
│ 👥 Por Género  🎂 Por Idade        │
│ [Estatísticas detalhadas]           │
│                                     │
│ [📊 Exportar CSV]                  │
└─────────────────────────────────────┘
```

---

## ✅ Critérios de Sucesso

### Teste Aprovado Se:
1. ✅ Todos os tabs abrem sem erros
2. ✅ Relatórios aparecem com nomes anonimizados
3. ✅ Filtros funcionam corretamente
4. ✅ Modal abre e fecha corretamente
5. ✅ Estatísticas de questões aparecem completas
6. ✅ Exports CSV funcionam
7. ✅ Nenhum erro no console
8. ✅ Interface responsiva em diferentes tamanhos de tela

---

## 🚨 Problemas Conhecidos

### Se acontecer algum destes:

#### "Nenhum relatório encontrado"
**Possíveis causas:**
1. Ainda não foram gerados relatórios
2. Firebase permissions bloqueando
3. Collection name incorreto

**Solução:**
- Gerar um relatório através da app
- Verificar Firebase Console
- Verificar console do browser

#### "Erro ao carregar relatórios"
**Possíveis causas:**
1. Firebase não conectado
2. Credenciais inválidas
3. Timeout de rede

**Solução:**
- Verificar conexão internet
- Verificar firebase-config.js
- Recarregar página

#### Modal não fecha
**Solução:**
- Recarregar página
- Verificar se há erros JavaScript

---

## 📞 Suporte

### Logs Úteis
```javascript
// Verificar se analytics.js está carregado
typeof getFullReports

// Verificar se admin-analytics.js está carregado
typeof loadFullReports

// Verificar Firebase
firebase.apps.length

// Testar query manualmente
db.collection('analytics_full_reports')
  .limit(1)
  .get()
  .then(snap => console.log('Docs:', snap.size))
```

---

**Última atualização:** 20 de Novembro de 2025  
**Versão:** 1.0.0
