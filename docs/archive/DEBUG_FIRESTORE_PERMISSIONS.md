# 🔐 FIRESTORE RULES - Versão Simplificada para Debug

## ⚠️ PROBLEMA: "Missing or insufficient permissions"

Se você está recebendo este erro **mesmo após configurar as regras**, o problema pode ser:

1. **As regras não foram publicadas corretamente**
2. **As regras têm um erro de sintaxe**
3. **O código está tentando escrever antes da autenticação estar pronta**

---

## 🧪 PASSO 1: Testar com Regras Ultra-Permissivas

**⚠️ ATENÇÃO:** Estas regras são **APENAS PARA DEBUG**. NÃO usar em produção!

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ⚠️ REGRAS DE DEBUG - PERMITIR TUDO
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Como usar:
1. Copiar regras acima
2. Firebase Console → Firestore Database → Rules
3. Colar regras
4. Clicar **"Publish"**
5. **Aguardar 1-2 minutos** para propagação
6. Testar registo/login novamente

### Se funcionar:
✅ O problema é com as regras específicas → usar regras abaixo

### Se NÃO funcionar:
❌ O problema é com o código ou autenticação → ver secção "Debug do Código"

---

## ✅ PASSO 2: Regras Corretas (Produção)

Se as regras de debug funcionaram, usar estas regras para produção:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // ========================================
    // USERS COLLECTION
    // ========================================
    match /users/{userId} {
      // LEITURA: Qualquer utilizador autenticado
      allow read: if isAuthenticated();
      
      // CRIAÇÃO: Utilizador pode criar o próprio perfil
      // ✅ REGRA CRÍTICA para registo funcionar
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // ATUALIZAÇÃO: Apenas o próprio utilizador ou admin
      allow update: if isOwner(userId) || isAdmin();
      
      // ELIMINAÇÃO: Apenas o próprio utilizador ou admin
      allow delete: if isOwner(userId) || isAdmin();
    }
    
    // ========================================
    // COUPLES COLLECTION
    // ========================================
    match /couples/{coupleId} {
      // LEITURA: Membros do casal ou admin
      allow read: if isAuthenticated() && (
        resource.data.user1Id == request.auth.uid ||
        resource.data.user2Id == request.auth.uid ||
        isAdmin()
      );
      
      // CRIAÇÃO: Qualquer utilizador autenticado
      allow create: if isAuthenticated();
      
      // ATUALIZAÇÃO/ELIMINAÇÃO: Membros do casal ou admin
      allow update, delete: if isAuthenticated() && (
        resource.data.user1Id == request.auth.uid ||
        resource.data.user2Id == request.auth.uid ||
        isAdmin()
      );
    }
    
    // ========================================
    // ACTIVITIES COLLECTION
    // ========================================
    match /activities/{activityId} {
      // LEITURA: Todos os utilizadores autenticados
      allow read: if isAuthenticated();
      
      // ESCRITA: Apenas admin
      allow write: if isAdmin();
    }
    
    // ========================================
    // USER ANSWERS (subcollection)
    // ========================================
    match /users/{userId}/answers/{answerId} {
      // LEITURA/ESCRITA: Apenas o próprio utilizador ou admin
      allow read, write: if isOwner(userId) || isAdmin();
    }
    
    // ========================================
    // COMPLETED ACTIVITIES
    // ========================================
    match /completedActivities/{completionId} {
      // LEITURA: Quem completou ou admin
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        isAdmin()
      );
      
      // CRIAÇÃO: Quem está a criar
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      
      // ATUALIZAÇÃO/ELIMINAÇÃO: Quem criou ou admin
      allow update, delete: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        isAdmin()
      );
    }
  }
}
```

---

## 🔍 PASSO 3: Debug do Código

Se o problema persistir **mesmo com regras permissivas**, o problema é no código:

### Verificar Console do Browser:

```javascript
// Abrir DevTools (F12) e executar:
console.log('🔍 Firebase:', firebase);
console.log('🔍 Auth:', auth);
console.log('🔍 DB:', db);
console.log('🔍 Current User:', auth.currentUser);

// Se auth.currentUser é null:
// ❌ Utilizador não está autenticado quando tenta escrever no Firestore
```

### Problema Comum: Admin Login

O **admin login não usa Firebase Auth**! É um login "fake" no frontend.

Quando o admin tenta escrever no Firestore, **não tem token de autenticação**.

**Solução:**
1. Admin deve fazer login normal com Firebase Auth primeiro
2. Depois marcar como admin no Firestore:
   ```javascript
   {
     uid: "admin-uid",
     email: "admin@quest4couple.pt",
     isAdmin: true
   }
   ```
3. Usar Firebase Admin SDK para operações administrativas

---

## 🐛 DEBUG: Admin Login

### Problema Identificado:

O código em `pages/admin.html` faz:

```javascript
// ❌ PROBLEMA: Login sem Firebase Auth
if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
  showDashboard();
  loadAllData(); // ❌ Tenta ler Firestore SEM autenticação!
}
```

### Solução 1: Admin Login com Firebase Auth

Modificar admin login para usar Firebase Auth:

```javascript
async function handleAdminLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;
  
  // ✅ Login com Firebase Auth
  try {
    const userCredential = await auth.signInWithEmailAndPassword(username, password);
    const user = userCredential.user;
    
    // Verificar se é admin
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (userDoc.exists && userDoc.data().isAdmin === true) {
      console.log('✅ Admin autenticado:', user.email);
      showDashboard();
      loadAllData(); // ✅ Agora tem autenticação!
    } else {
      alert('❌ Acesso negado. Não é administrador.');
      await auth.signOut();
    }
  } catch (error) {
    console.error('❌ Erro no login admin:', error);
    alert('Erro no login: ' + error.message);
  }
}
```

### Solução 2: Regras Especiais para Admin (NÃO RECOMENDADO)

```javascript
// ⚠️ NÃO RECOMENDADO: Permite leitura sem auth
match /users/{userId} {
  allow read: if true; // ⚠️ INSEGURO!
  allow create: if request.auth != null && request.auth.uid == userId;
}
```

---

## 🧪 TESTE: Ferramenta de Debug

Criei um ficheiro de teste: **`test_firestore_permissions.html`**

### Como usar:
1. Abrir no browser: `test_firestore_permissions.html`
2. Fazer login (Email ou Google)
3. Clicar nos botões de teste
4. Ver resultados e logs no console

### Testes disponíveis:
- ✅ Testar Registo Email
- ✅ Testar Google Sign-In
- ✅ Testar Leitura (users)
- ✅ Testar Criação (users)
- ✅ Testar Atualização (users)
- ✅ Testar Leitura (activities)

---

## ✅ CHECKLIST DE RESOLUÇÃO

- [ ] **1. Publicar regras de debug** (permitir tudo)
- [ ] **2. Testar registo** - funciona?
  - ✅ Sim → Problema nas regras específicas
  - ❌ Não → Problema no código (passo 3)
- [ ] **3. Verificar console do browser** - `auth.currentUser` não é null?
  - ✅ Sim → Auth OK, problema nas regras
  - ❌ Não → Código tenta escrever antes de autenticar
- [ ] **4. Admin login** - Usa Firebase Auth?
  - ✅ Sim → Deve funcionar
  - ❌ Não → Modificar para usar Firebase Auth
- [ ] **5. Aguardar 1-2 minutos** após publicar regras
- [ ] **6. Testar com `test_firestore_permissions.html`**
- [ ] **7. Publicar regras de produção** (se tudo funcionar)

---

## 📞 PRÓXIMOS PASSOS

### AGORA:
1. ✅ Publicar **regras de debug** (permitir tudo)
2. ✅ Testar registo novamente
3. ✅ Verificar o que acontece

### Se funcionar:
- Publicar **regras de produção** (acima)

### Se NÃO funcionar:
- Abrir **`test_firestore_permissions.html`**
- Executar testes
- Enviar logs do console

---

**Data:** 27 de Novembro de 2025  
**Versão:** Quest4Couple v2 Free  
**Estado:** 🐛 Debugging permissões

