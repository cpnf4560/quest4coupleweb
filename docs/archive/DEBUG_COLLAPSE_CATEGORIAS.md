# 🔍 DEBUG - Sistema Collapse/Expand nas Subcategorias

## 📋 Como Testar

### 1. **Abrir Aplicação**
```
http://localhost:8081/app.html
```

### 2. **Verificar Console**
Abre DevTools (F12) e vai para a aba **Console**

### 3. **Clicar num Pack**
Clica em qualquer pack (ex: "Romântico & Fantasias")

### 4. **Verificar Logs Esperados**
Deves ver algo como:
```
✅ Funções de collapse/expand exportadas para escopo global
   - toggleCategory: function
   - updateCategoryProgress: function
   - updateAllCategoriesProgress: function
   - restoreCategoryStates: function
```

### 5. **Clicar numa Categoria**
Clica no título de qualquer subcategoria (ex: "💝 Romântico Clássico")

### 6. **Verificar Logs do Click**
Deves ver:
```
🖱️ Click na categoria: romantico-cat-0
📊 wrapper element: [object HTMLDivElement]
📊 toggleCategory exists? function
✅ Chamando toggleCategory...
🔄 toggleCategory chamada para: romantico-cat-0
📦 Estado atual: EXPANDIDO
✅ Mudando para COLAPSADO
```

---

## 🐛 Problemas Comuns

### ❌ **"toggleCategory não encontrada!"**

**Causa:** O `rendering.js` não foi carregado ou as funções não foram exportadas.

**Solução:**
```javascript
// No console do navegador, verifica:
console.log(typeof window.toggleCategory);
// Deve retornar "function", não "undefined"
```

Se retornar `undefined`, verifica:
1. Se o ficheiro `js/rendering.js` está sendo carregado no `app.html`
2. Se há erros de JavaScript no console

---

### ❌ **Nada acontece ao clicar**

**Causa:** Event listener não foi adicionado.

**Solução:**
```javascript
// No console, testa manualmente:
const cat = document.querySelector('.category-wrapper');
console.log('Categoria encontrada:', cat);
console.log('Título:', cat.querySelector('.category-title'));
```

Se a categoria existe mas não tem evento, o problema é que o `onclick` não foi adicionado corretamente.

---

### ❌ **Categorias não aparecem**

**Causa:** As perguntas não foram renderizadas com a nova estrutura.

**Solução:**
```javascript
// No console, verifica:
console.log('Wrappers:', document.querySelectorAll('.category-wrapper').length);
// Deve retornar > 0
```

Se retornar 0, significa que as categorias não foram criadas. Verifica se a função `renderQuestions` no `rendering.js` está criando os `categoryWrapper`.

---

## 🧪 Testes Manuais no Console

### **Teste 1: Verificar se funções existem**
```javascript
console.log('toggleCategory:', typeof window.toggleCategory);
console.log('updateCategoryProgress:', typeof window.updateCategoryProgress);
console.log('updateAllCategoriesProgress:', typeof window.updateAllCategoriesProgress);
console.log('restoreCategoryStates:', typeof window.restoreCategoryStates);
```
**Esperado:** Todos devem retornar `"function"`

### **Teste 2: Verificar se categorias foram criadas**
```javascript
const wrappers = document.querySelectorAll('.category-wrapper');
console.log('Número de categorias:', wrappers.length);
console.log('Primeira categoria:', wrappers[0]);
```
**Esperado:** `wrappers.length > 0`

### **Teste 3: Toggle manual**
```javascript
const cat = document.querySelector('.category-wrapper');
window.toggleCategory(cat);
```
**Esperado:** Categoria deve colapsar/expandir

### **Teste 4: Verificar classes CSS**
```javascript
const cat = document.querySelector('.category-wrapper');
console.log('Classes:', cat.className);
console.log('É expandida?', cat.classList.contains('expanded'));
console.log('É colapsada?', cat.classList.contains('collapsed'));
```

### **Teste 5: Verificar display das perguntas**
```javascript
const cat = document.querySelector('.category-wrapper');
const questions = cat.querySelector('.category-questions');
console.log('Display:', window.getComputedStyle(questions).display);
```
**Esperado:** 
- `display: "block"` se expandida
- `display: "none"` se colapsada

---

## 📝 Checklist de Verificação

- [ ] Ficheiro `js/rendering.js` está sendo carregado no `app.html`
- [ ] Console mostra "Funções de collapse/expand exportadas"
- [ ] `window.toggleCategory` existe (`typeof window.toggleCategory === "function"`)
- [ ] Categorias foram criadas (`.category-wrapper` existe no DOM)
- [ ] Títulos das categorias têm `cursor: pointer`
- [ ] CSS para `.category-wrapper.collapsed` existe
- [ ] Ao clicar, aparecem logs no console
- [ ] Classes `expanded`/`collapsed` são alternadas
- [ ] Display das perguntas muda (`block`/`none`)
- [ ] Ícone roda (-90deg quando colapsado)

---

## 🔧 Fix Rápido (Se Nada Funcionar)

Se nada funcionar, tenta isto no console:

```javascript
// 1. Criar função manualmente
window.toggleCategory = function(wrapper) {
  const isExpanded = wrapper.classList.contains('expanded');
  if (isExpanded) {
    wrapper.classList.remove('expanded');
    wrapper.classList.add('collapsed');
  } else {
    wrapper.classList.add('expanded');
    wrapper.classList.remove('collapsed');
  }
  const icon = wrapper.querySelector('.category-toggle-icon');
  if (icon) {
    icon.style.transform = isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)';
  }
};

// 2. Adicionar eventos manualmente
document.querySelectorAll('.category-title').forEach(title => {
  title.onclick = function(e) {
    e.preventDefault();
    const wrapper = this.parentElement;
    window.toggleCategory(wrapper);
  };
});

console.log('✅ Fix manual aplicado!');
```

Agora testa clicar nas categorias!

---

## 📞 Feedback Necessário

Por favor, informa:

1. ✅ **Funciona?** Sim/Não
2. 📊 **Logs no console?** Copia e cola aqui
3. 🐛 **Erros?** Copia e cola aqui
4. 🎨 **Visual?** As categorias aparecem bonitas?
5. 🖱️ **Click?** O que acontece ao clicar?

Com essas informações, posso corrigir rapidamente! 🚀
