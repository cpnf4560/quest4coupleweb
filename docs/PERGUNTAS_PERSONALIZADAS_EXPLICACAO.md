# 📝 Perguntas Personalizadas - Explicação

## ℹ️ O que são Perguntas Personalizadas?

As **perguntas personalizadas** são questões criadas pelos próprios utilizadores do Quest4Couple, além das perguntas oficiais dos packs.

### Características:

✅ **Específicas de cada utilizador** - Cada casal pode criar suas próprias perguntas  
✅ **Não fazem parte dos packs oficiais** - São adições personalizadas  
✅ **Identificáveis por índice** - Têm índice maior que o máximo do pack  
✅ **Não incluídas em estatísticas gerais** - Por serem únicas para cada casal  

---

## 🔍 Como o Sistema as Detecta?

### Limites de Perguntas Oficiais por Pack:

```javascript
const MAX_QUESTIONS = {
  'romantico': 50,    // Perguntas oficiais: 1-50
  'poliamor': 60,     // Perguntas oficiais: 1-60
  'kinks': 90,        // Perguntas oficiais: 1-90
  'casual': 40,       // Perguntas oficiais: 1-40
  'fetiches': 80,     // Perguntas oficiais: 1-80
  'experimental': 70  // Perguntas oficiais: 1-70
};
```

### Exemplo de Detecção:

```javascript
// Pack "romantico" tem 50 perguntas oficiais
// Se o sistema encontrar:

romantico_q51  // ❌ Personalizada (índice 51 > 50)
romantico_q30  // ✅ Oficial (índice 30 <= 50)
```

---

## 📊 Impacto nas Estatísticas

### ✅ O que é INCLUÍDO nas estatísticas gerais:

- Respostas a perguntas oficiais (dentro do limite do pack)
- Agregações por pack, género, faixa etária
- Cálculos de openRate, compatibilidade, etc.

### ❌ O que é EXCLUÍDO das estatísticas gerais:

- Perguntas personalizadas (índice > máximo do pack)
- Respostas a perguntas criadas por utilizadores específicos

### Motivo:

```
📌 Perguntas personalizadas são únicas para cada casal.
   Incluí-las nas estatísticas gerais não faria sentido,
   pois não são comparáveis entre diferentes utilizadores.
```

---

## 💡 Logs no Console

### ANTES (Versão Antiga):
```
⚠️ Pergunta personalizada ignorada: romantico q51
⚠️ Pergunta personalizada ignorada: poliamor q61
⚠️ Pergunta personalizada ignorada: poliamor q63
⚠️ Pergunta personalizada ignorada: poliamor q62
⚠️ Pergunta personalizada ignorada: kinks q91
```
**Problema:** Parece um erro ou algo errado ❌

---

### DEPOIS (Nova Versão):
```
✅ Cache construído: 350 questões, 15.234 respostas

💡 5 respostas a perguntas personalizadas encontradas (5 perguntas únicas)
📊 Perguntas personalizadas não são incluídas nas estatísticas gerais (são específicas de cada utilizador)
```
**Vantagens:**
- ✅ Log consolidado (não polui console)
- ✅ Mensagem informativa (não parece erro)
- ✅ Explica o comportamento esperado

---

## 🎯 Exemplo Prático

### Cenário:

Um casal no pack "romantico" responde:
- Perguntas oficiais: q1 a q50 ✅
- Pergunta personalizada: q51 (criada por eles) ✅

### Processamento no Sistema:

```javascript
// Perguntas oficiais (q1-q50)
romantico_q1: {
  total: 150,
  porfavor: 80,
  yup: 50,
  talvez: 15,
  meh: 5
  // ✅ Incluída nas estatísticas
}

// Pergunta personalizada (q51)
romantico_q51: {
  // ❌ Detectada como personalizada
  // ❌ Não incluída no questionStats
  // ✅ Contabilizada no customQuestionsCount
}
```

---

## 📈 Estatísticas de Perguntas Personalizadas

### No Admin Panel, você verá:

```
✅ Cache construído: 350 questões, 15.234 respostas

💡 127 respostas a perguntas personalizadas encontradas (43 perguntas únicas)
📊 Perguntas personalizadas não são incluídas nas estatísticas gerais
```

### Interpretação:

| Métrica | Significado |
|---------|------------|
| **127 respostas** | Número total de respostas a perguntas personalizadas |
| **43 perguntas únicas** | Número de perguntas personalizadas diferentes criadas |
| **Não incluídas** | Estas respostas não afetam as estatísticas gerais |

---

## 🔮 Possibilidade Futura

### Feature: Estatísticas de Perguntas Personalizadas

**Poderia ser implementado:**

```javascript
// Estatísticas separadas para perguntas personalizadas
const customQuestionStats = {
  totalCustomQuestions: 43,
  totalCustomResponses: 127,
  mostActiveUsers: [...],
  averageCustomQuestionsPerUser: 2.1
};
```

**Benefícios:**
- Ver quais utilizadores criam mais perguntas personalizadas
- Identificar padrões em perguntas customizadas
- Possibilidade de sugerir novas perguntas oficiais baseadas nas mais comuns

**Status:** 🔲 Não implementado (baixa prioridade)

---

## ✅ Checklist de Validação

Quando executar testes no admin, verifique:

- [ ] Log consolidado aparece após carregar dados
- [ ] Mostra número de perguntas personalizadas
- [ ] Mostra número de perguntas únicas
- [ ] Mensagem não parece um erro
- [ ] Console não está poluído com múltiplos avisos
- [ ] Estatísticas gerais não incluem perguntas personalizadas

---

## 🔧 Troubleshooting

### Problema: "Muitas perguntas personalizadas detectadas"

**Causa:** Utilizadores criaram muitas perguntas customizadas

**Solução:** 
- ✅ Isto é comportamento normal
- ✅ Não requer ação
- ✅ Sistema está funcionando corretamente

---

### Problema: "Perguntas oficiais sendo marcadas como personalizadas"

**Causa:** Limites de perguntas podem estar desatualizados

**Verificar:**
```javascript
// No código admin-analytics.js, linha ~926
const MAX_QUESTIONS = {
  'romantico': 50,
  'poliamor': 60,
  'kinks': 90,
  // ... etc
};
```

**Ação:** Atualizar limites se novos packs forem adicionados

---

## 📞 Suporte

Se tiver dúvidas sobre:
- ✅ Por que perguntas são marcadas como personalizadas
- ✅ Como o sistema identifica perguntas customizadas
- ✅ Impacto nas estatísticas

Consulte:
1. Este documento (`PERGUNTAS_PERSONALIZADAS_EXPLICACAO.md`)
2. Código fonte: `js/admin-analytics.js` (linha ~926-950)
3. Logs do console durante carregamento de analytics

---

**Data:** 16 Dezembro 2025  
**Versão:** 1.0  
**Status:** ✅ Sistema funcionando conforme esperado
