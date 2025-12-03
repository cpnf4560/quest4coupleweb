# 🧪 TESTE - Sistema Collapse/Expand

## ✅ ALTERAÇÕES IMPLEMENTADAS

### 1️⃣ **Ícone Discreto** ✅
- **Antes:** Botão grande "Expandir/Colapsar" com texto
- **Depois:** Ícone pequeno `▼` à esquerda do título
- **Estilo:** Discreto, opacidade 0.7, cresce ao hover

### 2️⃣ **Estrutura do Título** ✅
```html
<h2>
  <span class="pack-toggle-icon">▼</span>
  <span>💝 Romântico & Fantasias</span>
  <span class="pack-progress-badge">0/30</span>
</h2>
```

### 3️⃣ **Funcionalidades** ✅
- ✅ Click no ícone toggle
- ✅ Click em todo o h2 (exceto botão "Voltar")
- ✅ Animação suave do ícone (rotate -90deg quando colapsado)
- ✅ Badge de progresso com cores dinâmicas:
  - Cinza: 0% (nenhuma resposta)
  - Azul: 1-99% (em progresso)
  - Verde: 100% (completo)

### 4️⃣ **Logs de Debug** ✅
```javascript
console.log('🎨 Inicializando sistema de collapse/expand...')
console.log(`📦 Encontrados ${packs.length} packs`)
console.log(`📦 Processando pack: ${packId}`)
console.log(`🖱️ Click no h2 do pack ${packId}`)
console.log(`📦 Pack ${packId}: expandido -> colapsar`)
console.log(`💾 Estado salvo: ${packId} = false`)
```

---

## 🧪 CHECKLIST DE TESTES

### Teste 1: Verificar Inicialização
- [ ] Abrir console do browser (F12)
- [ ] Verificar logs: `🎨 Inicializando sistema de collapse/expand...`
- [ ] Verificar: `📦 Encontrados 5 packs`
- [ ] Verificar que todos os packs têm ícone `▼`

### Teste 2: Toggle Manual
- [ ] Clicar no ícone `▼` de um pack
- [ ] Verificar no console: `🖱️ Click no h2 do pack romantico`
- [ ] Verificar animação: ícone roda -90deg
- [ ] Verificar: conteúdo do pack desaparece
- [ ] Clicar novamente: ícone volta a 0deg, conteúdo aparece

### Teste 3: Badge de Progresso
- [ ] Responder 1 pergunta → Badge muda para azul
- [ ] Responder todas → Badge muda para verde `✓ 30/30`
- [ ] Refresh da página → Badge mantém valores corretos

### Teste 4: Persistência
- [ ] Colapsar um pack
- [ ] Fazer refresh (F5)
- [ ] Verificar que pack continua colapsado

### Teste 5: CSS
- [ ] Ícone discreto (não ocupa muito espaço)
- [ ] Hover no ícone: opacity aumenta + scale
- [ ] Badge alinhado à direita
- [ ] Título mantém aparência original

---

## 🐛 TROUBLESHOOTING

### Problema: Botão não funciona
**Causa:** Evento onClick não está a disparar
**Solução:** Verificar logs no console - deve aparecer `🖱️ Click no h2`

### Problema: Badge não atualiza
**Causa:** `updatePackProgress()` não está a ser chamado
**Solução:** Verificar `firestore-sync.js` - deve chamar `PackCollapse.updateProgress(packId)`

### Problema: Estado não persiste
**Causa:** localStorage não está a guardar
**Solução:** Verificar logs - deve aparecer `💾 Estado salvo: romantico = false`

---

## 📝 FICHEIROS ALTERADOS

1. **js/pack-collapse.js** - Sistema completo reescrito
   - Ícone discreto em vez de botão
   - Logs de debug detalhados
   - Tratamento de erros melhorado

2. **css/questions.css** - Estilos do ícone
   - `.pack-toggle-icon` - Ícone discreto
   - `.pack-progress-badge` - Badge com classes de cor
   - Removidos estilos do botão antigo

3. **app.html** - Script incluído ✅
   ```html
   <script src="js/pack-collapse.js"></script>
   ```

4. **js/app.js** - Inicialização ✅
   ```javascript
   if (typeof PackCollapse !== 'undefined') {
     PackCollapse.init();
   }
   ```

---

## ✅ RESULTADO ESPERADO

**Visual:**
- Ícone pequeno `▼` à esquerda de cada título
- Badge `0/30` à direita
- Tudo alinhado na mesma linha
- Discreto e limpo

**Comportamento:**
- Click no ícone ou título → toggle expand/collapse
- Ícone roda suavemente
- Badge atualiza cores automaticamente
- Estado persiste após refresh

**Console:**
```
🎨 Inicializando sistema de collapse/expand...
📦 Encontrados 5 packs
📦 Processando pack: romantico
📦 Processando pack: experiencia
...
✅ Sistema de collapse/expand inicializado com sucesso
```

