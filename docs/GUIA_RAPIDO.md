# 🚀 GUIA RÁPIDO - QUEST4COUPLE v2.0 REFACTORED

## ✨ O QUE MUDOU?

### ANTES ❌
```
Quest4couple1.2.html (1588 linhas - TUDO misturado)
├─ HTML
├─ CSS (inline)
├─ JavaScript (inline)
└─ Código duplicado
```

### AGORA ✅
```
app.html (262 linhas - só estrutura)
├─ /css/
│   ├─ main.css (390 linhas)
│   ├─ themes.css (174 linhas)
│   └─ questions.css (198 linhas)
├─ /js/
│   ├─ app.js (186 linhas)
│   ├─ rendering.js (96 linhas)
│   ├─ storage.js (64 linhas)
│   └─ comparison.js (120 linhas)
├─ /data/
│   └─ packs_data_clean.json
└─ /assets/
    └─ logo.png
```

---

## 🎯 FICHEIROS PRINCIPAIS

### **app.html** - Aplicação Principal
- ✅ HTML limpo e semântico
- ✅ Links para módulos CSS/JS
- ✅ Sem código inline
- ✅ **USAR ESTE FICHEIRO AGORA!**

### **Quest4couple1.2.html** - Original (em old_files/)
- ⚠️ Preservado como backup
- ⚠️ NÃO usar mais
- ⚠️ Só para referência

---

## 📂 ESTRUTURA DE PASTAS

```
Quest4Couple_v2_free/
│
├── 🌐 PÁGINAS
│   ├── app.html           ← PÁGINA PRINCIPAL (usar esta!)
│   └── index.html         ← Landing page
│
├── 🎨 ESTILOS (CSS)
│   ├── main.css          ← Base, header, botões, modais
│   ├── themes.css        ← Cards dos temas/packs
│   └── questions.css     ← Perguntas e respostas
│
├── ⚙️ LÓGICA (JavaScript)
│   ├── app.js            ← Inicialização & navegação
│   ├── rendering.js      ← Renderização de perguntas
│   ├── storage.js        ← Guardar respostas (.q4c)
│   └── comparison.js     ← Comparar respostas
│
├── 📊 DADOS
│   └── packs_data_clean.json  ← Todas as perguntas
│
├── 🖼️ IMAGENS
│   └── logo.png, etc.
│
├── 📄 PÁGINAS SECUNDÁRIAS
│   ├── faq.html
│   ├── sobre.html
│   ├── termos.html
│   └── privacidade.html
│
└── 🗄️ ARQUIVOS ANTIGOS
    └── old_files/         ← Lixo arquivado
```

---

## 🔧 O QUE CADA MÓDULO FAZ?

### **CSS**

#### `main.css` - Estilos Globais
- Background do body
- Header e logo
- Botões (Guardar, Comparar, PDF)
- Modal de verificação de idade (+18)
- Configuração de tipo de casal
- Seção de comparação
- Relatório de compatibilidade
- Responsividade mobile

#### `themes.css` - Cards dos Packs
- Grid de cards
- Animações hover
- Progress bars
- Cores dos packs (romântico, experiência, etc.)
- Efeitos visuais

#### `questions.css` - Questionários
- Layout das perguntas
- Títulos de categorias
- Opções de resposta (Por favor!, Yup, Meh, Talvez)
- Caixa de comentários transparente
- Estados ativo/inativo

### **JavaScript**

#### `app.js` - Inicialização
```javascript
// Funções principais:
checkAgeVerification()      // Verificar idade +18
confirmAge(isAdult)         // Confirmar idade
selectCoupleType(type)      // Selecionar tipo de casal
continueToThemes()          // Ir para temas
showTheme(themeName)        // Abrir questionário
backToThemes()              // Voltar aos cards
updateThemeProgress()       // Atualizar progresso
```

#### `rendering.js` - Renderização
```javascript
// Funções principais:
loadAndRenderAllPacks()              // Carregar JSON
renderPackQuestions(id, categories)  // Criar perguntas
```

#### `storage.js` - Guardar
```javascript
// Funções principais:
getAnswersData()     // Recolher respostas
saveAnswers()        // Encriptar e guardar .q4c
```

#### `comparison.js` - Comparar
```javascript
// Funções principais:
compareEncryptedAnswers()        // Desencriptar ficheiros
generateCompatibilityReport()    // Criar relatório
getAnswerText(value)            // Formatar resposta
```

---

## 📊 MÉTRICAS

| Aspecto | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **Ficheiros HTML** | 1 (1588 linhas) | 1 (262 linhas) | -83% |
| **Módulos CSS** | 0 | 3 (762 linhas) | Organizado |
| **Módulos JS** | 0 | 4 (466 linhas) | Modular |
| **Código total** | 1588 linhas | 1490 linhas | Distribuído |
| **Lixo removido** | 0 | 690 KB | -100% |
| **Manutenibilidade** | 2/10 | 9/10 | +350% |

---

## 🚀 COMO USAR

### **1. Abrir Aplicação**
```
Duplo clique em: app.html
ou
Abrir no browser: file:///g:/O meu disco/.../app.html
```

### **2. Desenvolvimento**
```powershell
# Editar estilos
code css/questions.css

# Editar lógica
code js/rendering.js

# Ver erros
F12 no browser → Console
```

### **3. Adicionar Nova Pergunta**
```json
// Editar: data/packs_data_clean.json
{
  "name": "Pack Romântico",
  "categories": [
    {
      "name": "Categoria Nova",
      "questions": [
        "Nova pergunta aqui?"
      ]
    }
  ]
}
```
- Salvar JSON
- Recarregar app.html
- Pronto! ✅

### **4. Mudar Estilos**
```css
/* Editar: css/questions.css */
.question-row {
  background-color: rgba(255,255,255,0.2); /* Mudar aqui */
}
```
- Salvar CSS
- F5 no browser
- Pronto! ✅

---

## 🐛 TROUBLESHOOTING

### **Problema: Perguntas não aparecem**
```
Solução:
1. Abrir F12 → Console
2. Verificar erro no carregamento de data/packs_data_clean.json
3. Verificar se path está correto
```

### **Problema: Estilos não aplicados**
```
Solução:
1. Verificar se css/*.css existe
2. Limpar cache: Ctrl+Shift+R
3. Verificar path no <link> do app.html
```

### **Problema: Guardar não funciona**
```
Solução:
1. Verificar se CryptoJS carregou (Console)
2. Verificar se introduziu código de segurança
3. Ver erro no Console
```

---

## 📝 MODIFICAR CÓDIGO

### **Adicionar Nova Funcionalidade**
```javascript
// 1. Escolher o módulo certo:
// - app.js → navegação, UI
// - rendering.js → renderização
// - storage.js → guardar/carregar
// - comparison.js → comparação

// 2. Adicionar função
// js/app.js
function minhaNovaFuncao() {
  console.log('Nova funcionalidade!');
}

// 3. Chamar no HTML
// app.html
<button onclick="minhaNovaFuncao()">Clica aqui</button>
```

### **Mudar Cores dos Packs**
```css
/* css/themes.css */
.romantico { background: linear-gradient(135deg, #ff6b9d, #e83e8c); }
.experiencia { background: linear-gradient(135deg, #a17fe0, #6f42c1); }
/* Mudar os valores RGB aqui ↑ */
```

### **Adicionar Novo Pack**
```json
// 1. data/packs_data_clean.json
{
  "name": "Novo Pack",
  "categories": [...]
}

// 2. js/rendering.js
const packConfigs = [
  ...
  { id: 'novopack', containerId: 'pack-novopack-questions', name: 'Novo Pack' }
];

// 3. app.html
<div class="pack novopack" id="pack-novopack">
  <div class="pack-header">
    <h2>🆕 Novo Pack</h2>
    <button class="back-btn" onclick="backToThemes()">← Voltar</button>
  </div>
  <div class="pack-content" id="pack-novopack-questions"></div>
</div>
```

---

## ✅ CHECKLIST DE USO DIÁRIO

### **Antes de Editar:**
- [ ] Fazer backup (Ctrl+C, Ctrl+V do ficheiro)
- [ ] Verificar que app.html funciona
- [ ] Abrir F12 → Console para ver erros

### **Ao Editar:**
- [ ] Editar apenas 1 ficheiro de cada vez
- [ ] Salvar e testar imediatamente
- [ ] Ver Console para erros
- [ ] Testar em mobile (F12 → Toggle device)

### **Depois de Editar:**
- [ ] Limpar cache (Ctrl+Shift+R)
- [ ] Testar todas as funcionalidades
- [ ] Verificar responsividade
- [ ] Fazer commit no Git (se usares)

---

## 🎓 BOAS PRÁTICAS

### **CSS:**
- ✅ Usar classes reutilizáveis
- ✅ Evitar `!important`
- ✅ Usar variáveis CSS para cores
- ✅ Mobile-first design

### **JavaScript:**
- ✅ Uma função = uma responsabilidade
- ✅ Comentar código complexo
- ✅ Usar `const` e `let`, não `var`
- ✅ Tratar erros com try/catch

### **HTML:**
- ✅ Semântico (`<section>`, `<header>`, etc.)
- ✅ IDs únicos
- ✅ Classes descritivas
- ✅ Acessibilidade (alt em imagens)

---

## 🆘 ROLLBACK (DESFAZER TUDO)

Se algo correr mal:

```powershell
# Restaurar backup completo
cd "g:\O meu disco\Formação JAVA - Projetos\"
Expand-Archive -Path "Quest4Couple_BACKUP_20251118_171316.zip" -DestinationPath "Quest4Couple_v2_free" -Force
```

Ou usar o original:
```powershell
# Copiar original de old_files
Copy-Item "old_files\Quest4couple1.2.html" -Destination "." -Force
```

---

## 📞 SUPORTE

Se encontrares problemas:
1. Verificar Console (F12)
2. Verificar se paths estão corretos
3. Limpar cache do browser
4. Restaurar backup se necessário

---

## 🎉 APROVEITA O CÓDIGO LIMPO!

**Projeto está agora:**
- ✅ Organizado
- ✅ Modular
- ✅ Fácil de manter
- ✅ Performante
- ✅ Escalável

**Boa codificação! 🚀**

---

*Quest4Couple v2.0 - Refactored Edition*  
*Última atualização: 18 Nov 2025*
