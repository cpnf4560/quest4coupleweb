# 🐛 DEBUG ESPECÍFICO - Pack "Exploração e Aventura"

## ❌ PROBLEMA:
"Abri em ambos os dispositivos o pack exploração e aventura. não dá o live sync"

---

## 🔍 TESTES IMEDIATOS:

### **TESTE 1: Verificar PackID**

**O pack "Exploração e Aventura a Dois" tem PackID: `experiencia`**

#### No Console (ambos dispositivos):
```javascript
// 1. Abrir pack "Exploração e Aventura"
// 2. Colar no Console:

// Verificar qual pack está ativo
const activePack = document.querySelector('.pack.active');
if (activePack) {
  const classes = activePack.className.split(' ');
  const packId = classes.find(c => c !== 'pack' && c !== 'active');
  console.log('📦 PackID detectado:', packId);
  
  if (packId === 'experiencia') {
    console.log('✅ PackID CORRETO: experiencia');
  } else {
    console.error('❌ PackID ERRADO! Esperado: experiencia, Recebido:', packId);
  }
} else {
  console.error('❌ Nenhum pack ativo!');
}
```

**Resultado esperado em AMBOS:**
```
📦 PackID detectado: experiencia
✅ PackID CORRETO: experiencia
```

---

### **TESTE 2: Verificar Listener Ativo**

```javascript
// Verificar se listener está ativo
if (currentPackListener) {
  console.log('✅ LISTENER ATIVO');
  console.log('   Tipo:', typeof currentPackListener);
} else {
  console.error('❌ LISTENER NÃO ATIVO!');
  console.log('   Verificar se setupRealtimeSync foi chamado');
}

// Verificar função existe
if (typeof setupRealtimeSync === 'function') {
  console.log('✅ setupRealtimeSync() EXISTE');
} else {
  console.error('❌ setupRealtimeSync() NÃO EXISTE!');
}
```

**Resultado esperado em AMBOS:**
```
✅ LISTENER ATIVO
   Tipo: function
✅ setupRealtimeSync() EXISTE
```

---

### **TESTE 3: Verificar Dados no Firestore**

```javascript
// Verificar se dados existem no Firestore
setTimeout(async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error('❌ Não autenticado!');
      return;
    }
    
    console.log('👤 User:', user.email);
    console.log('🆔 UID:', user.uid);
    
    const doc = await db.collection('users')
      .doc(user.uid)
      .collection('answers')
      .doc('all')
      .get();
    
    if (!doc.exists) {
      console.warn('⚠️ Documento "all" não existe');
      return;
    }
    
    const data = doc.data();
    console.log('📦 Dados completos:', data);
    
    if (data.experiencia) {
      console.log('✅ Pack "experiencia" TEM dados:');
      console.log('   Perguntas:', Object.keys(data.experiencia));
      console.log('   Dados:', data.experiencia);
    } else {
      console.warn('⚠️ Pack "experiencia" SEM dados ainda');
      console.log('   Packs com dados:', Object.keys(data));
    }
    
  } catch (error) {
    console.error('❌ ERRO:', error);
  }
}, 1000);
```

**Resultado esperado:**
```
👤 User: carlos.sousacorreia@gmail.com  ← DEVE SER IGUAL em ambos
🆔 UID: abc123...                      ← DEVE SER IGUAL em ambos
📦 Dados completos: {romantico: {...}, experiencia: {...}}
✅ Pack "experiencia" TEM dados:
   Perguntas: ['q1', 'q2', ...]
```

---

### **TESTE 4: Forçar Atualização Manual**

Se o listener não disparar automaticamente, vamos testar manualmente:

#### No PC:
```javascript
// 1. Responder uma pergunta do pack "Exploração e Aventura"
// 2. Verificar no Console:

// Deve aparecer:
// ✅ Resposta guardada no Firestore: experiencia/q1
```

#### No Telemóvel (IMEDIATAMENTE após PC responder):
```javascript
// 3. Colar isto no Console:

// Forçar leitura manual
setTimeout(async () => {
  const user = auth.currentUser;
  const doc = await db.collection('users')
    .doc(user.uid)
    .collection('answers')
    .doc('all')
    .get();
  
  const data = doc.data();
  console.log('🔄 Leitura manual - experiencia:', data.experiencia);
}, 2000);
```

**Se aparecer a resposta na leitura manual mas NÃO no listener:**
→ Problema é no `onSnapshot()` - Firestore não está disparando eventos

---

## 🎯 DIAGNÓSTICO POR SINTOMA:

### **Sintoma A: Listener não ativa**
```
Console mostra:
❌ LISTENER NÃO ATIVO!
```

**CAUSA:** `setupRealtimeSync()` não foi chamada  
**SOLUÇÃO:** Verificar se `firestore-sync.js` carregou

---

### **Sintoma B: Listener ativo mas não recebe eventos**
```
Console mostra:
✅ LISTENER ATIVO
MAS não aparece:
📡 REALTIME SYNC: onSnapshot triggered!
```

**CAUSA:** Firestore `onSnapshot()` não está disparando  
**POSSÍVEIS RAZÕES:**
1. ❌ Firestore Rules bloqueando
2. ❌ Rede instável
3. ❌ UID diferente em cada dispositivo (users diferentes)

**SOLUÇÃO:**
```javascript
// Verificar UIDs são iguais:
// PC Console:
auth.currentUser.uid

// Telemóvel Console:
auth.currentUser.uid

// DEVEM SER IDÊNTICOS!
```

---

### **Sintoma C: onSnapshot dispara mas não atualiza UI**
```
Console mostra:
📡 REALTIME SYNC: onSnapshot triggered!
⚡ REALTIME SYNC: Respostas para "experiencia": {q1: {...}}
MAS também mostra:
❌ REALTIME SYNC: Radio NÃO encontrado!
```

**CAUSA:** HTML não tem radio buttons com nome correto  
**SOLUÇÃO:** Verificar selector no Console

```javascript
// Ver se radio existe:
const radio = document.querySelector('input[name="experiencia_q1"][value="A"]');
console.log('Radio existe?', radio ? 'SIM' : 'NÃO');

// Se NÃO existir, ver quais existem:
const allInputs = document.querySelectorAll('.pack.experiencia.active input[type="radio"]');
console.log('Total radios:', allInputs.length);
console.log('Primeiro radio name:', allInputs[0]?.name);
```

---

## 🧪 TESTE COMPLETO (Passo a Passo):

### **1. PC:**
```
1. Abrir: http://localhost:5500/app.html
2. Login: carlos.sousacorreia@gmail.com
3. F12 → Console
4. Abrir pack: "Exploração e Aventura a Dois"
5. Console deve mostrar:
   🔄 REALTIME SYNC: Ativando para pack "experiencia"
   👤 User: carlos.sousacorreia@gmail.com
   🆔 UID: (copiar este valor)
   ✅ REALTIME SYNC: Listener configurado com sucesso!
```

### **2. Telemóvel:**
```
1. Descobrir IP do PC: ipconfig
2. Abrir: http://192.168.X.X:5500/app.html
3. Login: MESMO email (carlos.sousacorreia@gmail.com)
4. Chrome Remote Debug: chrome://inspect (no PC)
5. Abrir pack: "Exploração e Aventura a Dois"
6. Console deve mostrar:
   🔄 REALTIME SYNC: Ativando para pack "experiencia"
   👤 User: carlos.sousacorreia@gmail.com
   🆔 UID: (DEVE SER IGUAL ao PC!)
   ✅ REALTIME SYNC: Listener configurado com sucesso!
```

### **3. Testar Sync:**
```
PC:
1. Responder Pergunta 1: Opção A
2. Console: ✅ Resposta guardada no Firestore: experiencia/q1

Telemóvel (aguardar 1-3 segundos):
3. Console DEVE mostrar:
   📡 REALTIME SYNC: onSnapshot triggered!
   📦 REALTIME SYNC: Dados completos: {experiencia: {...}}
   ⚡ REALTIME SYNC: Respostas para "experiencia": {q1: {...}}
   🔍 REALTIME SYNC: Processando q1: {answer: "A"}
   ✅ REALTIME SYNC: Radio encontrado!
   ⚡ REALTIME SYNC: Radio ATUALIZADO para: A
   
4. Pergunta 1 deve estar marcada com Opção A
```

---

## 🚨 SE NÃO FUNCIONAR:

### **Capturar logs completos:**

#### PC Console (copiar TUDO):
```
1. Abrir pack
2. Ctrl+A no Console → Copiar
3. Colar num ficheiro de texto
```

#### Telemóvel Console (copiar TUDO):
```
1. Chrome Remote Debug (chrome://inspect)
2. Selecionar device
3. Copiar todos os logs
4. Colar num ficheiro de texto
```

### **Informação adicional:**
```
✅ Mesmo utilizador? (email)
✅ Mesmo UID? (copiar ambos)
✅ Mesmo pack? (experiencia)
✅ Mesma rede WiFi?
✅ Firestore Console mostra dados? (verificar manualmente)
```

---

## 💡 TESTE ALTERNATIVO - Mesmo Dispositivo:

Se não conseguires debug remoto do telemóvel:

```
1. PC: Abrir 2 tabs do Chrome
2. Tab 1: Login → Abrir "Exploração e Aventura" → Responder Q1
3. Tab 2: Login → Abrir "Exploração e Aventura"
4. Tab 2 deve mostrar Q1 já respondida
```

---

**IMPORTANTE:** Executar TODOS os testes acima e reportar resultados! 🎯
