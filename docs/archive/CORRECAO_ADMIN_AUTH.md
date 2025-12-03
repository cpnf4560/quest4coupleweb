# 🔧 CORREÇÃO URGENTE - Admin Login com Firebase Auth

## ❌ PROBLEMA IDENTIFICADO

O admin login em `pages/admin.html` **não usa Firebase Auth**:

```javascript
// ❌ CÓDIGO ATUAL (ERRADO):
if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
  sessionStorage.setItem('adminLoggedIn', 'true');
  showDashboard();
  loadAllData(); // ❌ Tenta acessar Firestore SEM autenticação!
}
```

**Resultado:** Erro "Missing or insufficient permissions" porque não há token de autenticação do Firebase.

---

## ✅ SOLUÇÃO RÁPIDA (2 opções)

### OPÇÃO 1: Admin Login com Firebase Auth ⭐ RECOMENDADO

Modificar o admin login para usar Firebase Auth:

**Passo 1:** Criar utilizador admin no Firebase Console:
```
1. Firebase Console → Authentication → Add User
2. Email: admin@quest4couple.com
3. Password: [PASSWORD_REMOVIDA]
4. Copiar UID do utilizador
```

**Passo 2:** Marcar como admin no Firestore:
```
1. Firebase Console → Firestore → Collection: users
2. Document ID: [UID copiado acima]
3. Campos:
   {
     uid: "[UID]",
     email: "admin@quest4couple.com",
     displayName: "Admin Quest4Couple",
     isAdmin: true,
     createdAt: [timestamp atual]
   }
```

**Passo 3:** Modificar código em `pages/admin.html`:

```javascript
// ✅ NOVO CÓDIGO (CORRETO):
adminLoginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  console.log('🔐 Tentativa de login admin...');
  
  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value;
  
  // Verificar se username é email (admin pode usar username ou email)
  const email = username.includes('@') ? username : `${username}@quest4couple.pt`;
  
  try {
    console.log('🔑 Autenticando com Firebase Auth...');
    
    // ✅ Login com Firebase Auth
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    
    console.log('✅ Utilizador autenticado:', user.email);
    console.log('🔍 Verificando se é admin...');
    
    // Verificar se é admin
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (userDoc.exists && userDoc.data().isAdmin === true) {
      console.log('✅ Admin confirmado!');
      sessionStorage.setItem('adminLoggedIn', 'true');
      sessionStorage.setItem('adminUsername', user.email);
      errorMessage.classList.remove('show');
      showDashboard();
    } else {
      console.error('❌ Utilizador não é administrador');
      errorMessage.textContent = 'Acesso negado. Não é administrador.';
      errorMessage.classList.add('show');
      await auth.signOut(); // Logout
      document.getElementById('adminPassword').value = '';
      setTimeout(() => errorMessage.classList.remove('show'), 3000);
    }
  } catch (error) {
    console.error('❌ Erro no login admin:', error);
    errorMessage.textContent = `Erro no login: ${error.message}`;
    errorMessage.classList.add('show');
    document.getElementById('adminPassword').value = '';
    setTimeout(() => errorMessage.classList.remove('show'), 3000);
  }
});
```

---

### OPÇÃO 2: Regras Firestore Permissivas (TEMPORÁRIO)

**⚠️ NÃO RECOMENDADO PARA PRODUÇÃO!**

Se precisar de uma solução rápida temporária, usar regras permissivas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ⚠️ TEMPORÁRIO - Permite leitura sem auth
    match /{document=**} {
      allow read: if true; // ⚠️ INSEGURO!
      allow create: if request.auth != null && request.auth.uid == resource.id;
      allow update, delete: if request.auth != null && request.auth.uid == resource.id;
    }
  }
}
```

**Usar apenas para testar se é problema de permissões!**

---

## 🚀 IMPLEMENTAÇÃO DA SOLUÇÃO 1 (Recomendada)

### Passo 1: Criar Admin no Firebase (2 min)

```bash
# Abrir Firebase Console
start https://console.firebase.google.com

# Ir para:
# 1. Authentication → Users → Add User
# 2. Email: admin@quest4couple.com
# 3. Password: [PASSWORD_REMOVIDA]
# 4. Copiar UID
```

### Passo 2: Criar Documento no Firestore (1 min)

```bash
# Firebase Console → Firestore Database → users collection

# Document ID: [UID copiado]
# Campos:
{
  uid: "[UID copiado]",
  email: "admin@quest4couple.com",
  displayName: "Admin Quest4Couple",
  isAdmin: true,
  createdAt: [Timestamp - usar FieldValue.serverTimestamp()]
}
```

### Passo 3: Atualizar admin.html (Já preparado abaixo)

---

## 📝 CÓDIGO COMPLETO PARA COPIAR

Vou aplicar a correção automaticamente. Ver ficheiro com as mudanças aplicadas.

---

## ✅ RESULTADO ESPERADO

Após implementação:

### Console logs:
```
🔐 Tentativa de login admin...
🔑 Autenticando com Firebase Auth...
✅ Utilizador autenticado: admin@quest4couple.com
🔍 Verificando se é admin...
✅ Admin confirmado!
📊 A mostrar dashboard...
✅ Firebase carregado
✅ Firestore disponível
🔄 A carregar dados do Firebase...
👥 A buscar utilizadores...
✅ Snapshot recebido: X utilizadores
```

### Comportamento:
1. ✅ Admin faz login com Firebase Auth
2. ✅ Sistema verifica se `isAdmin === true` no Firestore
3. ✅ Dashboard carrega com permissões corretas
4. ✅ Pode ler/escrever no Firestore sem erros

---

## 🔄 MIGRAÇÃO DE UTILIZADORES EXISTENTES

Se já tem utilizadores registados e quer tornar um deles admin:

```javascript
// Executar no console do browser (F12):
const userId = 'UID-DO-USUARIO';

db.collection('users').doc(userId).update({
  isAdmin: true
}).then(() => {
  console.log('✅ Utilizador promovido a admin!');
}).catch(error => {
  console.error('❌ Erro:', error);
});
```

---

**Data:** 27 de Novembro de 2025  
**Prioridade:** 🔴 URGENTE  
**Tempo de Implementação:** ~5 minutos

