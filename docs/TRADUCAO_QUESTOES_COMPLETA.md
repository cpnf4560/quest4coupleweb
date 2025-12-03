# 🌍 Tradução Completa das Questões - Quest4Couple

## Data: 3 de Dezembro de 2025

## Resumo das Alterações

### 1. Ficheiros de Questões Criados

Foram criados ficheiros JSON com todas as questões traduzidas para cada idioma suportado:

| Ficheiro | Idioma | Questões |
|----------|--------|----------|
| `data/packs_data_clean.json` | Português (PT) | Original |
| `data/packs_data_pt-br.json` | Português (BR) | ~200 questões |
| `data/packs_data_en.json` | Inglês | ~200 questões |
| `data/packs_data_es.json` | Espanhol | ~200 questões |
| `data/packs_data_fr.json` | Francês | ~200 questões |

### 2. Alterações nos Ficheiros JavaScript

#### `js/rendering.js`
- Adicionada lógica para determinar o ficheiro JSON correto baseado no idioma atual
- O sistema agora usa `I18n.currentLang` ou `localStorage.getItem('quest4couple_lang')` para detectar o idioma
- Alterado o método de identificação de packs de `name` (variável) para `color` (invariável)
- Adicionado listener para o evento `languageChanged` que recarrega as questões quando o idioma muda

```javascript
// Mapeamento de idioma para ficheiro JSON
const langFileMap = {
  'pt-pt': 'packs_data_clean.json',
  'pt-br': 'packs_data_pt-br.json',
  'en': 'packs_data_en.json',
  'es': 'packs_data_es.json',
  'fr': 'packs_data_fr.json'
};
```

#### `js/comparison.js`
- Atualizado para carregar o ficheiro de questões correto baseado no idioma
- Alterado para usar `color` em vez de `name` para identificar packs

#### `js/dashboard.js`
- Atualizado para carregar o ficheiro de questões correto baseado no idioma

### 3. Estrutura dos Ficheiros JSON de Questões

Todos os ficheiros mantêm a mesma estrutura:

```json
[
  {
    "name": "Nome do Pack (traduzido)",
    "color": "romantico",  // Identificador invariável
    "description": "Descrição traduzida",
    "emoji": "❤️",
    "categories": [
      {
        "name": "Nome da Categoria (traduzido)",
        "questions": [
          "Questão 1 traduzida",
          "Questão 2 traduzida",
          ...
        ]
      }
    ]
  }
]
```

### 4. Packs Traduzidos

1. **Pack Romântico** / Romantic Pack / Pack Romántico / Pack Romantique
2. **Exploração e Aventura a Dois** / Exploration and Adventure / Exploración y Aventura / Exploration et Aventure
3. **Pimentinha** / Spicy / Picante / Pimenté
4. **Poliamor** / Polyamory / Poliamor / Polyamour
5. **Fetiches** / Fetishes / Fetiches / Fétiches

### 5. Comportamento Esperado

1. Quando o utilizador seleciona um idioma, o sistema:
   - Guarda a preferência em `localStorage`
   - Dispara o evento `languageChanged`
   - O `rendering.js` detecta o evento e recarrega as questões no novo idioma

2. Ao carregar a página:
   - O sistema verifica `I18n.currentLang` ou `localStorage` para o idioma atual
   - Carrega o ficheiro JSON correspondente

### 6. Notas Importantes

- O campo `color` dos packs é usado como identificador consistente entre idiomas
- Os dados guardados pelo utilizador usam IDs (`romantico`, `experiencia`, etc.) e não são afetados pela tradução
- O `admin-analytics.js` mantém-se em PT-PT (interface de administração)

### 7. Testes Recomendados

1. Abrir a aplicação em cada idioma e verificar se as questões aparecem traduzidas
2. Mudar de idioma e verificar se as questões são recarregadas
3. Responder a questões, mudar de idioma e verificar se as respostas são mantidas
4. Gerar relatório de comparação e verificar se os textos estão no idioma correto

