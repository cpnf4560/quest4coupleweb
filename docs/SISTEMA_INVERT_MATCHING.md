# 🔄 Sistema de Invert Matching - Quest4Couple v2.0

## 📋 O que é o Invert Matching?

O **Invert Matching** é um sistema inteligente que reconhece perguntas complementares onde:
- Uma pessoa quer **DAR** algo
- A outra pessoa quer **RECEBER** esse algo

### Exemplo Clássico:
```
Pergunta A: "Dominar o/a parceiro/a de forma leve."
Pergunta B: "Ser dominado/a de forma leve."

❌ MATCHING NORMAL: Compara "dominar" com "dominar" (não faz sentido!)
✅ INVERT MATCHING: Compara "EU dominar" com "PARCEIRO ser dominado" (MATCH!)
```

---

## 🎯 Por que é Importante?

Sem invert matching, o sistema não conseguiria identificar compatibilidades em dinâmicas complementares:

### Sem Invert Matching:
- João: "Quero dominar" → ⭐ Por favor!
- Maria: "Quero ser dominada" → ⭐ Por favor!
- **Resultado:** Não aparece como match (estão respondendo perguntas diferentes)

### Com Invert Matching:
- João: "Quero dominar" → ⭐ Por favor!
- Maria: "Quero ser dominada" → ⭐ Por favor!
- **Resultado:** 🔥 SUPER MATCH! (João quer DAR ↔️ Maria quer RECEBER)

---

## 📂 Ficheiros do Sistema

### 1. `data/invert_matching_config.json`
Configuração de todos os pares invertidos organizados por pack:

```json
{
  "description": "Perguntas que requerem matching invertido",
  "invertPairs": [
    {
      "packId": "pimentinha",
      "pairs": [
        {
          "questionGiver": "Dominar o/a parceiro/a de forma leve.",
          "questionReceiver": "Ser dominado/a de forma leve.",
          "description": "Dinâmica de dominação/submissão"
        }
      ]
    }
  ]
}
```

### 2. `js/invertMatching.js`
Lógica principal do sistema:
- `loadInvertMatchingConfig()` - Carrega configuração
- `getInvertPair()` - Identifica se pergunta tem par invertido
- `calculateInvertMatch()` - Calcula compatibilidade invertida
- `processQuestionWithInvert()` - Processa pergunta com invert
- `generateInvertExplanation()` - Gera HTML explicativo

### 3. `js/comparison.js` (Modificado)
Integração com o sistema de comparação:
- Detecta perguntas com invert matching
- Busca resposta da pergunta PAR do parceiro
- Compara respostas invertidas
- Renderiza com visual especial

### 4. `css/main.css` (Adicionado)
Estilos visuais para perguntas invertidas:
- `.match-question.inverted` - Container principal
- `.invert-container` - Grid de 3 colunas
- `.invert-label.giver` / `.receiver` - Badges azul/verde
- `.invert-arrow` - Seta animada ↔️

---

## 🎨 Visual no Relatório

### Pergunta Normal:
```
┌────────────────────────────────────────┐
│ 1. Massagem sensual com óleos.        │
│ ✅ Match!                              │
│ João: ⭐ Por favor! (Adoro!)          │
│ Maria: ⭐ Por favor! (Me relaxa)      │
└────────────────────────────────────────┘
```

### Pergunta com Invert Matching:
```
┌─────────────────────────────────────────────────────────────┐
│ 🔥 Super Match!                                             │
│ ┌─────────────────────┐  ↔️  ┌────────────────────────┐  │
│ │ VOCÊ QUER DAR       │      │ PARCEIRO QUER RECEBER  │  │
│ │ Dominar parceiro    │      │ Ser dominado           │  │
│ │ ⭐ Por favor!       │      │ ⭐ Por favor!          │  │
│ └─────────────────────┘      └────────────────────────┘  │
│ 💡 Dinâmica de dominação/submissão                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Packs com Invert Matching

### 🌶️ Pimentinha (2 pares)
1. **Dominação/Submissão**
   - Dominar o/a parceiro/a ↔️ Ser dominado/a
   
2. **Estimulação Anal**
   - Estimular o anus do parceiro ↔️ Receber estimulação anal

### 💞 Poliamor (14 pares)
Todas as dinâmicas de voyeurismo/exibicionismo:
- Assistir parceiro beijar ↔️ Ser assistido beijando
- Assistir parceiro receber prazer ↔️ Receber prazer sendo assistido
- Partilhar vídeo ↔️ Que parceiro partilhe vídeo
- Cuckolding, fantasias, encontros com terceiros, etc.

### 🎭 Fetiches/Kinks (12 pares)
Todas as dinâmicas BDSM e D/S:
- Ser dominante ↔️ Ser submisso
- Vendar parceiro ↔️ Ser vendado
- Dar cera quente ↔️ Receber cera quente
- Atribuir tarefas ↔️ Realizar tarefas
- Espiar parceiro ↔️ Ser observado
- Pisar (trampling) ↔️ Ser pisado

---

## 🔧 Como Funciona Tecnicamente

### Fluxo de Comparação:

1. **Carregamento**
   ```javascript
   await loadInvertMatchingConfig();
   // Carrega invert_matching_config.json
   ```

2. **Detecção de Par**
   ```javascript
   const invertInfo = getInvertPair('pimentinha', 'Dominar o/a parceiro/a');
   // Retorna: { pairQuestion: "Ser dominado/a", isGiver: true, ... }
   ```

3. **Busca da Resposta PAR**
   ```javascript
   // Em vez de comparar:
   // João "Dominar" vs Maria "Dominar" ❌
   
   // Compara:
   // João "Dominar" vs Maria "Ser dominado" ✅
   const partnerPairAnswer = partnerAnswers[pairQuestionKey];
   ```

4. **Cálculo de Match**
   ```javascript
   // Ambos "Por favor!" = 🔥 Super Match
   // Um "Por favor" + Outro "Yup" = ✅ Match
   // Com "Talvez" = 🤔 Para Explorar
   // Um "Por favor" + Outro "Meh" = 💭 Reflexão
   ```

5. **Renderização Visual**
   ```javascript
   // HTML especial com:
   // - Badges GIVER/RECEIVER
   // - Seta animada ↔️
   // - Duas colunas lado a lado
   // - Descrição da dinâmica
   ```

---

## ✨ Benefícios

### 1. **Precisão Aumentada**
- Identifica matches reais em dinâmicas complementares
- Evita falsos negativos

### 2. **Comunicação Clara**
- Mostra visualmente quem quer DAR e quem quer RECEBER
- Explica a dinâmica de cada par

### 3. **Educação Sexual**
- Ensina sobre dinâmicas de poder e complementaridade
- Facilita conversas sobre preferências

### 4. **Relatórios Mais Ricos**
- Visual diferenciado para perguntas especiais
- Informação contextual adicional

---

## 🎯 Estatísticas

- **Total de pares invertidos:** 28
- **Packs afetados:** 3 (Pimentinha, Poliamor, Kinks)
- **Perguntas com invert matching:** 56 (28 pares × 2)
- **Percentagem do questionário:** ~15%

---

## 🔮 Futuras Expansões

### Possíveis Adições:
1. **Pack Romântico:** Adicionar pares como "Dar massagem" ↔️ "Receber massagem"
2. **Intensidades:** Matching com níveis (leve, moderado, intenso)
3. **Trios:** Perguntas com 3+ variações complementares
4. **Custom Questions:** Detectar automaticamente pares em perguntas personalizadas

---

## 🧪 Testes

### Como Testar:
1. Criar respostas onde João quer "Dominar" (⭐ Por favor!)
2. Criar respostas onde Maria quer "Ser dominada" (⭐ Por favor!)
3. Gerar relatório
4. Verificar se aparece como 🔥 Super Match com visual invertido

### Cenários de Teste:
- ✅ Ambos "Por favor!" → Super Match
- ✅ Um "Por favor" + Outro "Yup" → Match
- ✅ Um "Por favor" + Outro "Meh" → Reflexão
- ✅ Ambos "Meh" → Não aparece
- ✅ Com "Talvez" → Para Explorar

---

## 📝 Notas Técnicas

### Dependências:
- Carrega após DOM ready
- Requer `CryptoJS` para desencriptação
- Integrado com sistema de custom questions

### Performance:
- Config carregada uma vez no início
- Busca de pares otimizada (O(n) por pack)
- Cache em memória durante sessão

### Compatibilidade:
- Funciona com custom questions
- Compatível com sistema de carregar/importar respostas
- Responsivo mobile (grid adaptável)

---

**Data de Implementação:** 18 de Novembro de 2025  
**Versão:** Quest4Couple v2.0  
**Status:** ✅ Implementado e Testado

