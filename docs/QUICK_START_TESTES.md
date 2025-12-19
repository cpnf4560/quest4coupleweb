# ⚡ QUICK START - Testes do Sistema

## 🚀 Execução Rápida dos Testes

### **1. Abrir Admin Panel**
```
URL: http://localhost:8080/pages/admin.html
```

### **2. Fazer Login**
- Email: `admin@quest4couple.com`
- Password: [sua password]

### **3. Abrir Console (F12)**
Pressionar F12 no browser para abrir Developer Tools

### **4. Verificar Funções Disponíveis**
```javascript
listTestFunctions()
```
**Esperado:** Lista com todas as funções marcadas com ✅

---

## 🧪 Executar Testes (Copiar e Colar no Console)

### **Teste 0: Verificar Funções (Primeiro!)**
```javascript
listTestFunctions()
```
**Esperado:** Todas as funções com ✅

---

### **Teste 1: Cache Funcionando?**
```javascript
testCacheIntegrity()
```
**Esperado:** ✅ Todos os testes passaram!

---

### **Teste 2: Simulação de Auto-Load**
```javascript
testAutoLoad()
```
**Esperado:** Cache ANTES e DEPOIS com timestamps diferentes

---

### **Teste 3: Agendar em 1 Minuto**
```javascript
testScheduledLoadIn1Minute()
```
**Esperado:** Após 1 min, reload automático acontece

---

### **Teste 4: Limpar Cache (Opcional)**
```javascript
clearDataCache()
```
**Esperado:** Cache limpo, próximo acesso recarrega do Firebase

---

## 📊 Verificações Visuais

### ✅ Painel de Status Visível?
- [ ] "⚙️ Carregamento de Dados" está visível
- [ ] "Último carregamento" mostra timestamp real
- [ ] "Próximo: 7:00 ou 19:00" está correto

### ✅ Barra de Progresso?
- [ ] Aparece ao carregar dados
- [ ] Mostra etapas: 10%, 50%, 70%, 100%
- [ ] Desaparece após 2 segundos

### ✅ Mudança de Tabs Rápida?
- [ ] Clicar em "Dashboard" → instantâneo
- [ ] Clicar em "Utilizadores" → instantâneo
- [ ] Console mostra "📦 Dados carregados do cache"

---

## 🔥 Firebase - Verificar Uso

1. Abrir: https://console.firebase.google.com/
2. Ir para: Firestore → Uso
3. **Antes dos testes:** Anotar número de leituras
4. **Mudar tabs 10x** no admin
5. **Depois:** Verificar se número aumentou

**Resultado esperado:** Número NÃO deve aumentar (cache funcionando!)

---

## ✅ Checklist Final

| Item | Status | Observação |
|------|--------|------------|
| Cache guarda dados | 🔲 | `testCacheIntegrity()` |
| Tabs sem reload | 🔲 | Console sem logs Firebase |
| Painel de status OK | 🔲 | Timestamps corretos |
| Simulação funciona | 🔲 | `testAutoLoad()` |
| Agendamento 1min OK | 🔲 | `testScheduledLoadIn1Minute()` |
| Firebase não sobrecarregado | 🔲 | Verificar console Firebase |

---

## 🎯 Se Todos Passarem:

### ✅ Sistema Aprovado! Próximos Passos:

1. **Implementar geração de JSON público**
   - Adicionar função `generatePublicStats()` no admin
   - Exportar para `/data/public_stats.json`
   - Integrar com sistema 7h/19h

2. **Criar página de estatísticas**
   - HTML: `estatisticas.html`
   - CSS: `css/stats.css`
   - JS: `js/stats.js`

---

## 🐛 Se Falhar:

### ❌ Erro: "testCacheIntegrity is not a function"

**Solução Rápida:**
1. Recarregar página: `Ctrl + Shift + R` (Windows) ou `Cmd + Shift + R` (Mac)
2. Executar: `listTestFunctions()`
3. Se ainda não funcionar, ver: `docs/TROUBLESHOOTING_TESTES.md`

---

### ❌ Cache não guarda dados
```javascript
// Verificar se saveDataToCache é chamada
console.log('dataCache:', dataCache)
```

### ❌ Tabs recarregam do Firebase
```javascript
// Verificar função showTab()
// Deve usar loadDataFromCache(), não loadAllData()
```

### ❌ Agendamento não funciona
```javascript
// Verificar nextScheduledLoad
console.log('Próximo reload:', nextScheduledLoad)
console.log('Agora:', new Date())
```

---

## 📞 Suporte

Se encontrar problemas:
1. Copiar TODOS os logs do console
2. Screenshot do painel de status
3. Descrever o comportamento esperado vs obtido

---

**Data:** 16 Dezembro 2025  
**Quick Start:** Teste em 5 minutos! ⚡
