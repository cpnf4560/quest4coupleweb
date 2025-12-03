# 🔍 TESTE DIAGNÓSTICO - REAL-TIME SYNC

## ❌ PROBLEMA REPORTADO:
"Testei usar PC e telemóvel ao mesmo tempo... as respostas não aparecem"

## 🎯 VERIFICAÇÕES NECESSÁRIAS:

### **1. VERIFICAR SE DADOS CHEGAM AO FIRESTORE**

#### No PC:
1. Abrir `app.html`
2. Abrir DevTools (F12)
3. Tab **Console**
4. Abrir um pack (ex: Romântico)
5. Responder uma pergunta
6. **Verificar log:** Deve aparecer `✅ Resposta guardada no Firestore: romantico/q1`

#### No Firebase Console:
```
https://console.firebase.google.com
→ quest4couple
→ Firestore Database
→ users/{uid}/answers/all
```
**Verificar:** A resposta apareceu em tempo real?

---

### **2. VERIFICAR SE LISTENER ESTÁ ATIVO**

#### No Telemóvel:
1. Abrir `app.html`
2. Abrir DevTools remoto (Chrome: chrome://inspect)
3. Tab **Console**
4. Abrir o MESMO pack (ex: Romântico)
5. **Verificar log:** Deve aparecer `🔄 Ativando sincronização em tempo real para: romantico`

#### Alterar resposta no PC:
1. No PC: Mudar resposta da pergunta 1
2. **No Telemóvel - Console:** Deve aparecer `⚡ Atualização em tempo real detectada para romantico`

---

### **3. VERIFICAR AUTENTICAÇÃO**

**Ambos os dispositivos devem estar com O MESMO utilizador logado!**

#### No PC:
```javascript
// Console do browser:
auth.currentUser.email
```

#### No Telemóvel:
```javascript
// Console do browser:
auth.currentUser.email
```

**Resultado esperado:** MESMO email em ambos

---

## 🐛 POSSÍVEIS CAUSAS DO BUG:

### **A) Dispositivos com utilizadores diferentes**
❌ **PROBLEMA:** Listener só detecta mudanças do PRÓPRIO utilizador
```javascript
db.collection('users')
  .doc(user.uid)  ← ❌ Cada dispositivo tem UID diferente se forem users diferentes
```

**SOLUÇÃO:** Fazer login com MESMO email/senha em ambos dispositivos

---

### **B) Listener não está a ser ativado**
❌ **PROBLEMA:** `setupRealtimeSync()` não é chamada

**VERIFICAR em `js/app.js` linha 114-117:**
```javascript
if (typeof setupRealtimeSync === 'function') {
  setupRealtimeSync(themeName);
  console.log('🔥 Sincronização em tempo real ativada para:', themeName);
}
```

**TESTE:** 
- Abrir pack
- Console deve mostrar: `🔥 Sincronização em tempo real ativada para: romantico`
- **SE NÃO APARECER:** `firestore-sync.js` não carregou

---

### **C) Firebase Firestore Rules bloqueando leitura**

**VERIFICAR regras:**
```
https://console.firebase.google.com
→ quest4couple  
→ Firestore Database
→ Rules
```

**Deve ter:**
```javascript
match /users/{userId}/answers/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

**TESTE:**
- No Console: Tab **"Playground"**
- Fazer query: `users/{uid}/answers/all`
- Deve retornar dados

---

### **D) Rede/Cache do Browser**

❌ **PROBLEMA:** Cache impedindo atualizações

**SOLUÇÃO:**
1. PC: Limpar cache (Ctrl+Shift+Del)
2. Telemóvel: Limpar cache do Chrome
3. Ambos: Hard refresh (Ctrl+Shift+R)
4. Reabrir `app.html`

---

## 🔧 SCRIPT DE DIAGNÓSTICO COMPLETO

**Copiar e colar no Console (F12) de AMBOS os dispositivos:**

```javascript
// 🔍 DIAGNÓSTICO REAL-TIME SYNC
console.log('\n🔍 === DIAGNÓSTICO REAL-TIME SYNC ===\n');

// 1. Verificar autenticação
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('✅ AUTENTICADO:');
    console.log('   Email:', user.email);
    console.log('   UID:', user.uid);
  } else {
    console.log('❌ NÃO AUTENTICADO');
  }
});

// 2. Verificar se firestore-sync.js carregou
if (typeof setupRealtimeSync === 'function') {
  console.log('✅ setupRealtimeSync() EXISTE');
} else {
  console.log('❌ setupRealtimeSync() NÃO ENCONTRADA');
}

// 3. Verificar se listener está ativo
if (currentPackListener) {
  console.log('✅ LISTENER ATIVO');
} else {
  console.log('⚠️ LISTENER INATIVO (normal se não tiver pack aberto)');
}

// 4. Testar leitura do Firestore
setTimeout(async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      const doc = await db.collection('users')
        .doc(user.uid)
        .collection('answers')
        .doc('all')
        .get();
      
      if (doc.exists) {
        console.log('✅ FIRESTORE LEITURA OK:');
        console.log('   Dados:', doc.data());
      } else {
        console.log('⚠️ Documento "all" não existe (normal se nunca respondeu)');
      }
    }
  } catch (error) {
    console.log('❌ ERRO FIRESTORE:', error.message);
  }
}, 2000);

console.log('\n=== FIM DIAGNÓSTICO ===\n');
```

---

## 📊 RESULTADOS ESPERADOS:

### **AMBOS os dispositivos (PC + Telemóvel):**
```
✅ AUTENTICADO:
   Email: exemplo@gmail.com  ← DEVE SER IGUAL
   UID: abc123...            ← DEVE SER IGUAL
✅ setupRealtimeSync() EXISTE
✅ FIRESTORE LEITURA OK:
   Dados: {romantico: {q1: {answer: "A", comment: ""}}}
```

---

## 🎯 TESTE FINAL (Passo a Passo):

### **1. PC:**
```
1. Abrir: http://localhost:5500/app.html
2. Login: exemplo@gmail.com
3. Console: Executar script diagnóstico
4. Abrir pack: Romântico
5. Responder pergunta 1: Opção A
6. Console deve mostrar: ✅ Resposta guardada no Firestore: romantico/q1
```

### **2. Telemóvel (MESMO utilizador!):**
```
1. Abrir: http://SEU_IP:5500/app.html (ex: http://192.168.1.100:5500/app.html)
2. Login: MESMO email (exemplo@gmail.com)
3. Console remoto: Executar script diagnóstico
4. Abrir pack: Romântico
5. AGUARDAR 1-2 segundos
6. ✅ Pergunta 1 deve estar com Opção A selecionada
7. Console deve mostrar: ⚡ Atualização em tempo real detectada
```

### **3. Testar bidirecional:**
```
1. Telemóvel: Mudar resposta pergunta 1 para Opção B
2. PC: Deve atualizar automaticamente para Opção B
3. PC: Mudar para Opção C
4. Telemóvel: Deve atualizar automaticamente para Opção C
```

---

## ❓ SE AINDA NÃO FUNCIONAR:

### **Verificar IP do servidor no telemóvel:**

**No PC:**
```powershell
ipconfig
```
Procurar: `IPv4 Address........: 192.168.X.X`

**No Telemóvel:**
- Abrir: `http://192.168.X.X:5500/app.html`
- **AMBOS devem estar na MESMA rede WiFi!**

---

## 🚨 ERRO COMUM:

**"Missing or insufficient permissions"**

**CAUSA:** Firestore Rules bloqueando acesso

**SOLUÇÃO:** Ver ficheiro `CORRIGIR_ERROS_MIGRACAO.md` (linhas 31-82)

---

**APÓS TESTAR, REPORTAR:**
1. ✅ ou ❌ Diagnóstico PC
2. ✅ ou ❌ Diagnóstico Telemóvel  
3. ✅ ou ❌ Dados aparecem no Firebase Console
4. ✅ ou ❌ Sincronização funciona PC → Telemóvel
5. ✅ ou ❌ Sincronização funciona Telemóvel → PC

