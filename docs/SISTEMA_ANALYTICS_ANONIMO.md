# 📊 Sistema de Analytics Anónimo - Quest4Couple

## 📋 Visão Geral

Implementado sistema completo de analytics **100% anónimo** para o BackOffice admin, permitindo acesso às estatísticas das respostas dos questionários **sem identificar utilizadores**.

---

## ✅ Problema Resolvido

### Antes:
1. ❌ Admin.html mostrava **7 packs** (incorreto - são 5)
2. ❌ **Contagem de utilizadores errada** (mostrava 0 quando havia users)
3. ❌ **Sem acesso às respostas** dos questionários
4. ❌ Admin era contado como utilizador normal

### Depois:
1. ✅ Admin.html mostra **5 packs** corretamente
2. ✅ **Contagem correta de utilizadores** (excluindo admin)
3. ✅ **Sistema de analytics anónimo** implementado
4. ✅ Admin filtrado da lista de utilizadores

---

## 🔒 Privacidade Garantida

### O que É Salvo (Anónimo):
```javascript
{
  "romantico": {
    "totalResponses": 15,
    "questions": {
      "q1": {
        "text": "Massagem sensual com óleos.",
        "sim": 10,      // ✅ Apenas contadores
        "talvez": 3,    // ✅ Apenas contadores
        "nao": 2,       // ✅ Apenas contadores
        "comments": 5   // ✅ Apenas quantidade (sem texto)
      }
    }
  }
}
```

### O que NÃO É Salvo:
- ❌ Nome ou email do utilizador
- ❌ Timestamp específico da resposta
- ❌ Texto dos comentários
- ❌ Associação entre resposta e utilizador
- ❌ IP ou dados de sessão

---

## 🎯 Funcionalidades Implementadas

### 1. Nova Seção "Analytics Anónimo" no Admin
- **Menu lateral:** 📊 Analytics Anónimo
- **Filtro por pack:** Dropdown para selecionar pack específico
- **Visualização em tabela** com:
  - Número da questão
  - Texto da pergunta
  - Contadores: ✅ Sim, ⭐ Talvez, ❌ Não
  - Percentagens calculadas automaticamente
  - Quantidade de comentários (sem revelar conteúdo)

### 2. Exportação de Dados (CSV)
```csv
Questão,Pergunta,Total Respostas,Sim,Sim %,Talvez,Talvez %,Não,Não %,Comentários
1,"Massagem sensual com óleos.",15,10,67%,3,20%,2,13%,5
```

### 3. Atualização Automática
- Analytics salvos quando user clica "Guardar"
- Analytics salvos quando user fecha a página (beforeunload)
- Sem necessidade de sincronização manual

---

## 📂 Estrutura de Dados

### LocalStorage Keys:
```javascript
// Utilizadores (existente)
'q4c_users' → [{email, name, createdAt, reports}, ...]

// Analytics Anónimo (NOVO)
'q4c_analytics' → {
  romantico: { totalResponses, questions },
  experiencia: { totalResponses, questions },
  pimentinha: { totalResponses, questions },
  poliamor: { totalResponses, questions },
  kinks: { totalResponses, questions }
}
```

---

## 🛠️ Arquivos Modificados

### 1. `pages/admin.html`
**Mudanças:**
- ✅ Corrigido número de packs: `7` → `5`
- ✅ Adicionado menu "Analytics Anónimo"
- ✅ Filtrado admin da contagem de users
- ✅ Nova seção `analyticsSection` com visualização de dados
- ✅ Funções `loadAnalytics()` e `exportAnalytics()`

**Código Chave:**
```javascript
// Filtrar admin dos utilizadores
const allUsers = JSON.parse(localStorage.getItem('q4c_users') || '[]');
const users = allUsers.filter(u => u.email !== 'carlos.sousacorreia');

// Carregar analytics
function loadAnalytics() {
  const analytics = JSON.parse(localStorage.getItem('q4c_analytics') || '{}');
  // ...processar e exibir
}
```

### 2. `js/storage.js`
**Mudanças:**
- ✅ Função `saveAnonymousAnalytics(data)` adicionada
- ✅ Chamada em `saveAnswers()` para salvar stats
- ✅ EventListener `beforeunload` para auto-save
- ✅ Função `getQuestionText()` para extrair texto das perguntas

**Código Chave:**
```javascript
function saveAnonymousAnalytics(data) {
  const analytics = JSON.parse(localStorage.getItem('q4c_analytics') || '{}');
  
  Object.keys(data.answers).forEach(packId => {
    if (!analytics[packId]) {
      analytics[packId] = { totalResponses: 0, questions: {} };
    }
    
    analytics[packId].totalResponses++;
    
    // Processar cada resposta (SEM identificar user)
    Object.keys(data.answers[packId]).forEach(qKey => {
      const answer = data.answers[packId][qKey];
      
      if (answer.answer === 'sim') q.sim++;
      else if (answer.answer === 'talvez') q.talvez++;
      else if (answer.answer === 'nao') q.nao++;
      
      if (answer.comment) q.comments++;  // Apenas contador
    });
  });
  
  localStorage.setItem('q4c_analytics', JSON.stringify(analytics));
}
```

---

## 📊 Como Usar (Admin)

### Passo 1: Aceder ao BackOffice
1. Navegar para `/pages/admin.html`
2. Login: `carlos.sousacorreia` / `rzq7xgq8`

### Passo 2: Ver Analytics
1. Clicar em **"📊 Analytics Anónimo"** no menu lateral
2. Selecionar pack no dropdown
3. Ver estatísticas em tempo real

### Passo 3: Exportar Dados
1. Clicar em **"📥 Exportar CSV"**
2. Ficheiro baixado automaticamente
3. Abrir em Excel/Google Sheets

---

## 🎨 Interface do Analytics

### Visualização em Tabela:
```
┌──────┬─────────────────────────────┬──────┬─────────┬──────┬────────────┐
│  #   │         Pergunta            │  ✅  │   ⭐    │  ❌  │ 📝 Coment. │
├──────┼─────────────────────────────┼──────┼─────────┼──────┼────────────┤
│  1   │ Massagem sensual com óleos  │  10  │    3    │   2  │     5      │
│      │ Total de respostas: 15      │ 67%  │   20%   │ 13%  │            │
├──────┼─────────────────────────────┼──────┼─────────┼──────┼────────────┤
│  2   │ Fazer amor com óleos        │   8  │    4    │   3  │     2      │
│      │ Total de respostas: 15      │ 53%  │   27%   │ 20%  │            │
└──────┴─────────────────────────────┴──────┴─────────┴──────┴────────────┘
```

### Aviso de Privacidade:
```
🔒 Privacidade Garantida:
• Todas as respostas são completamente anónimas
• Nenhuma resposta é associada a utilizadores específicos
• Apenas estatísticas agregadas são armazenadas
• Comentários não são salvos para proteger a privacidade
```

---

## 🧪 Teste Rápido

### Simular Dados de Teste:
```javascript
// Abrir console do browser (F12) em app.html
// Após responder algumas questões, executar:

const testData = {
  answers: {
    romantico: {
      q1: { answer: 'sim', comment: 'Teste' },
      q2: { answer: 'talvez', comment: '' },
      q3: { answer: 'nao', comment: 'Teste 2' }
    }
  }
};

saveAnonymousAnalytics(testData);
console.log('✅ Analytics de teste salvos!');

// Depois, ir para admin.html e verificar
```

---

## 📈 Casos de Uso

### 1. Análise de Tendências
- Identificar perguntas mais populares
- Ver quais práticas são mais aceites
- Entender padrões de resposta

### 2. Melhoria de Conteúdo
- Perguntas com muitos "talvez" podem precisar clarificação
- Perguntas com muitos comentários indicam necessidade de mais opções
- Ajustar packs baseado em feedback agregado

### 3. Relatórios para Apresentações
- Exportar CSV para criar gráficos
- Análise estatística sem comprometer privacidade
- Demonstrar uso da plataforma

---

## 🔧 Manutenção

### Limpar Analytics Antigos:
```javascript
// No admin.html, adicionar botão "Limpar Analytics"
function clearAnalytics() {
  if (confirm('⚠️ Tem certeza? Isto apaga todas as estatísticas!')) {
    localStorage.removeItem('q4c_analytics');
    alert('✅ Analytics limpos!');
    loadAnalytics();
  }
}
```

### Backup Manual:
```javascript
// Exportar tudo
const analytics = localStorage.getItem('q4c_analytics');
console.log(analytics);  // Copiar e salvar
```

---

## 🚀 Melhorias Futuras (Opcionais)

### 1. Gráficos Visuais
- Adicionar Chart.js para visualização
- Pizza charts para percentagens
- Barras para comparação

### 2. Filtros Avançados
- Filtrar por data
- Comparar packs
- Tendências temporais

### 3. Dashboard Executivo
- KPIs principais
- Resumo geral de todos os packs
- Métricas de engajamento

---

## ✅ Checklist Final

- [x] Admin.html mostra 5 packs (não 7)
- [x] Contagem de utilizadores correta (excluindo admin)
- [x] Sistema de analytics anónimo implementado
- [x] Função saveAnonymousAnalytics() em storage.js
- [x] Interface de visualização no admin
- [x] Exportação para CSV
- [x] Aviso de privacidade visível
- [x] Documentação completa

---

## 📞 Suporte

Para dúvidas sobre o sistema de analytics:
1. Verificar este documento
2. Conferir console do browser (F12) para logs
3. Testar com dados fictícios primeiro

---

**Desenvolvido por:** Carlos Sousa Correia  
**Data:** 19 de novembro de 2025  
**Versão:** Quest4Couple v2.0 Free  
**Status:** ✅ Implementado e Funcional
