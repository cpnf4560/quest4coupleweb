# 🔧 Correção - Problema de Login no Admin Dashboard

**Data:** 27 de Novembro de 2025  
**Problema:** Login pisca, limpa campos e nada acontece

---

## 🐛 Problema Reportado

Ao fazer login no admin dashboard:
1. ✅ Inserir credenciais
2. ✅ Clicar em "Entrar"
3. ❌ **Imagem pisca**
4. ❌ **Nada acontece**
5. ❌ **Campos são limpos**

---

## 🔍 Diagnóstico

### Possíveis Causas:

1. **Credenciais incorretas** → Campos limpos, mensagem de erro
2. **Firebase não carregado** → Dashboard tenta carregar mas falha
3. **Erro silencioso no `loadAllData()`** → Processo interrompido sem feedback
4. **Problema de rede/Firestore** → Timeout ou permissões

---

## 🔧 Correções Aplicadas

### 1. **Logs de Debug no Login**
```javascript
adminLoginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  console.log('🔐 Tentativa de login...');
  console.log('👤 Username inserido:', username);
  console.log('🔑 Username esperado:', ADMIN_USERNAME);
  console.log('✅ Username match:', username === ADMIN_USERNAME);
  console.log('✅ Password match:', password === ADMIN_PASSWORD);
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    console.log('✅ Login bem-sucedido!');
    // ...
  } else {
    console.log('❌ Login falhou!');
    // ...
  }
});
```

**Objetivo:** Ver exatamente o que está a ser comparado

---

### 2. **Verificação do Firebase no `showDashboard()`**
```javascript
function showDashboard() {
  console.log('📊 A mostrar dashboard...');
  
  // Verificar se Firebase está disponível
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase não está carregado!');
    alert('Erro: Firebase não está disponível. Por favor recarregue a página.');
    return;
  }
  
  if (typeof db === 'undefined') {
    console.error('❌ Firestore (db) não está disponível!');
    alert('Erro: Base de dados não está disponível. Por favor recarregue a página.');
    return;
  }
  
  console.log('✅ Firebase carregado:', firebase);
  console.log('✅ Firestore disponível:', db);
  
  // ...continua
}
```

**Objetivo:** Garantir que Firebase está disponível antes de continuar

---

### 3. **Logs Detalhados em `loadAllData()`**
```javascript
async function loadAllData() {
  try {
    console.log('🔄 A carregar dados do Firebase...');
    console.log('📦 Firestore instance:', db);
    
    console.log('👥 A buscar utilizadores...');
    const usersSnapshot = await db.collection('users').get();
    console.log('✅ Snapshot recebido:', usersSnapshot.size, 'utilizadores');
    
    // ...continua
  } catch (error) {
    // ...error handling
  }
}
```

**Objetivo:** Rastrear onde o carregamento falha

---

### 4. **Melhor Tratamento de Erros**
```javascript
} catch (error) {
  console.error('❌ ERRO CRÍTICO ao carregar dados:', error);
  console.error('📋 Stack trace:', error.stack);
  
  const errorDetails = `
❌ ERRO AO CARREGAR DADOS DO ADMIN

Tipo: ${error.name}
Mensagem: ${error.message}

Por favor:
1. Verifique a consola do browser (F12)
2. Verifique se o Firebase está configurado
3. Verifique a conexão à internet

Detalhes técnicos:
${error.stack || 'Sem stack trace'}
  `;
  
  alert(errorDetails);
  
  // Fazer logout para evitar problemas
  logout();
}
```

**Objetivo:** Mostrar erro detalhado ao utilizador

---

## 📋 Como Testar (PASSO A PASSO)

### 1. **Abrir a Consola do Browser**
```
Chrome/Edge: F12 ou Ctrl+Shift+I
Firefox: F12
Safari: Cmd+Option+I
```

### 2. **Ir para o Admin**
```
https://quest4couple.com/pages/admin.html
```

### 3. **Inserir Credenciais**
```
Username: carlos.sousacorreia
Password: [PASSWORD_REMOVIDA]
```

### 4. **Clicar "Entrar" e Verificar Logs**

#### ✅ **Se Login for Bem-Sucedido:**
```
Console:
🔐 Tentativa de login...
👤 Username inserido: carlos.sousacorreia
🔑 Username esperado: carlos.sousacorreia
✅ Username match: true
✅ Password match: true
✅ Login bem-sucedido!
📊 A mostrar dashboard...
✅ Firebase carregado: [Object]
✅ Firestore disponível: [Object]
🔄 A carregar dados do Firebase...
📦 Firestore instance: [Firestore Object]
👥 A buscar utilizadores...
✅ Snapshot recebido: X utilizadores
✅ Utilizadores carregados: X
```

#### ❌ **Se Login Falhar (Credenciais Erradas):**
```
Console:
🔐 Tentativa de login...
👤 Username inserido: [o que inseriu]
🔑 Username esperado: carlos.sousacorreia
✅ Username match: false (ou true)
✅ Password match: false
❌ Login falhou!

Browser:
- Mensagem vermelha: "❌ Credenciais inválidas!"
- Campo password é limpo
```

#### ❌ **Se Firebase Não Estiver Carregado:**
```
Console:
✅ Login bem-sucedido!
📊 A mostrar dashboard...
❌ Firebase não está carregado!

Browser:
- Alert: "Erro: Firebase não está disponível..."
```

#### ❌ **Se Firestore Falhar:**
```
Console:
✅ Firebase carregado: [Object]
✅ Firestore disponível: [Object]
🔄 A carregar dados do Firebase...
❌ ERRO CRÍTICO ao carregar dados: [Error]

Browser:
- Alert com detalhes do erro
- Logout automático
```

---

## 🎯 Cenários Possíveis

### **Cenário 1: Credenciais Incorretas**
**Sintomas:**
- Login falha
- Mensagem de erro vermelha
- Password limpa

**Solução:**
- Verificar username: `carlos.sousacorreia`
- Verificar password: `[PASSWORD_REMOVIDA]`
- Verificar se não há espaços extras

---

### **Cenário 2: Firebase Não Carregado**
**Sintomas:**
- Login parece funcionar
- Alert: "Firebase não está disponível"
- Console: `❌ Firebase não está carregado!`

**Solução:**
```html
<!-- Verificar se scripts estão carregados em admin.html -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
<script src="../js/firebase-config.js"></script>
```

**Verificar ordem de carregamento:**
1. Firebase SDK
2. Firebase Config
3. Admin Script

---

### **Cenário 3: Erro no Firestore**
**Sintomas:**
- Login funciona
- Dashboard aparece brevemente
- Alert com erro do Firestore
- Logout automático

**Causas Comuns:**
1. **Permissões do Firestore incorretas**
2. **Quota excedida**
3. **Conexão à internet**
4. **Collection 'users' não existe**

**Solução:**
```javascript
// Verificar permissões no Firebase Console
// Firestore Database → Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

### **Cenário 4: Problema de Rede**
**Sintomas:**
- Login funciona
- "A carregar dados..." indefinidamente
- Timeout

**Verificar:**
1. Conexão à internet
2. Firewall/VPN bloqueando Firebase
3. Status do Firebase: https://status.firebase.google.com/

---

## 🔍 Comandos de Debug Manual

### **Verificar Firebase na Consola:**
```javascript
// Copiar e colar na consola do browser
console.log('Firebase:', typeof firebase);
console.log('Firestore:', typeof db);
console.log('Firebase App:', firebase.app());
console.log('Firestore Settings:', db._settings);
```

### **Testar Acesso ao Firestore:**
```javascript
// Copiar e colar na consola do browser
db.collection('users').limit(1).get()
  .then(snapshot => {
    console.log('✅ Firestore acessível!');
    console.log('Documentos:', snapshot.size);
  })
  .catch(error => {
    console.error('❌ Erro ao aceder Firestore:', error);
  });
```

### **Verificar SessionStorage:**
```javascript
// Copiar e colar na consola do browser
console.log('Admin Logged In:', sessionStorage.getItem('adminLoggedIn'));
console.log('Admin Username:', sessionStorage.getItem('adminUsername'));
```

---

## 📝 Próximos Passos

1. ✅ **Testar login** com logs ativados
2. ✅ **Copiar logs da consola** se houver erro
3. ✅ **Verificar mensagem de erro** no alert
4. ✅ **Reportar logs** para análise adicional

---

## 🚀 Ficheiro Alterado

- ✅ `pages/admin.html`
  - Logs de debug no login
  - Verificação do Firebase
  - Logs detalhados no loadAllData()
  - Melhor tratamento de erros

---

**📊 Status:** Correções aplicadas, aguardando testes  
**🎯 Objetivo:** Identificar causa exata do problema de login

