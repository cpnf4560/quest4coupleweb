# 🔐 Firestore Security Rules - Quest4Couple

## ⚠️ IMPORTANTE
As Firestore Security Rules devem ser configuradas no **Firebase Console** em:
```
Firebase Console → Firestore Database → Rules
```

---

## ✅ REGRAS RECOMENDADAS

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    
    // Verificar se utilizador está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Verificar se é o próprio utilizador
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Verificar se é admin
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // ========================================
    // COLLECTION: users
    // ========================================
    match /users/{userId} {
      // Qualquer utilizador autenticado pode LER perfis
      allow read: if isAuthenticated();
      
      // Criar perfil: apenas quando o UID coincide com o auth.uid
      // Isto permite que o onAuthStateChanged crie o perfil
      allow create: if isAuthenticated() && request.auth.uid == userId;
      
      // Atualizar/Apagar: apenas o próprio utilizador ou admin
      allow update, delete: if isOwner(userId) || isAdmin();
    }
    
    // ========================================
    // COLLECTION: couples
    // ========================================
    match /couples/{coupleId} {
      // Ler: membros do casal ou admin
      allow read: if isAuthenticated() && (
        resource.data.user1Id == request.auth.uid ||
        resource.data.user2Id == request.auth.uid ||
        isAdmin()
      );
      
      // Criar: qualquer utilizador autenticado
      allow create: if isAuthenticated();
      
      // Atualizar/Apagar: membros do casal ou admin
      allow update, delete: if isAuthenticated() && (
        resource.data.user1Id == request.auth.uid ||
        resource.data.user2Id == request.auth.uid ||
        isAdmin()
      );
    }
    
    // ========================================
    // COLLECTION: activities
    // ========================================
    match /activities/{activityId} {
      // Ler: todos os utilizadores autenticados
      allow read: if isAuthenticated();
      
      // Criar/Atualizar/Apagar: apenas admin
      allow create, update, delete: if isAdmin();
    }
    
    // ========================================
    // COLLECTION: completedActivities
    // ========================================
    match /completedActivities/{completionId} {
      // Ler: utilizador que completou ou admin
      allow read: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        isAdmin()
      );
      
      // Criar: utilizador que está a criar
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      
      // Atualizar/Apagar: utilizador que criou ou admin
      allow update, delete: if isAuthenticated() && (
        resource.data.userId == request.auth.uid ||
        isAdmin()
      );
    }
    
    // ========================================
    // COLLECTION: adminLogs (Activity Log)
    // ========================================
    match /adminLogs/{logId} {
      // Ler: apenas admin
      allow read: if isAdmin();
      
      // Criar: qualquer ação autenticada (para logging automático)
      allow create: if isAuthenticated();
      
      // Atualizar/Apagar: apenas admin
      allow update, delete: if isAdmin();
    }
    
    // ========================================
    // DEFAULT: NEGAR TUDO O RESTO
    // ========================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🔍 EXPLICAÇÃO DAS REGRAS

### 1. **Helper Functions**

#### `isAuthenticated()`
- Verifica se o utilizador tem um token de autenticação válido
- Retorna `true` se `request.auth != null`

#### `isOwner(userId)`
- Verifica se o utilizador autenticado é o dono do documento
- Compara `request.auth.uid` com `userId` do documento

#### `isAdmin()`
- Verifica se o utilizador tem privilégios de admin
- Busca o campo `isAdmin` no documento do utilizador no Firestore

---

### 2. **Collection: users**

#### Leitura (Read):
```javascript
allow read: if isAuthenticated();
```
- ✅ Qualquer utilizador autenticado pode ver perfis de outros utilizadores
- ❌ Utilizadores não autenticados não podem ver nada

#### Criação (Create):
```javascript
allow create: if isAuthenticated() && request.auth.uid == userId;
```
- ✅ Utilizador pode criar **apenas o seu próprio perfil**
- ✅ UID do documento deve ser igual ao UID de autenticação
- ❌ Não pode criar perfis de outros utilizadores

**NOTA IMPORTANTE:** Esta regra resolve o problema de "Missing permissions" porque:
1. O `onAuthStateChanged` é acionado **após** o token de auth estar pronto
2. Quando `createOrUpdateUserProfile()` tenta escrever no Firestore, o `request.auth.uid` já existe
3. A condição `request.auth.uid == userId` é satisfeita

#### Atualização/Eliminação (Update/Delete):
```javascript
allow update, delete: if isOwner(userId) || isAdmin();
```
- ✅ Utilizador pode atualizar/apagar **apenas o seu próprio perfil**
- ✅ Admin pode atualizar/apagar qualquer perfil
- ❌ Não pode modificar perfis de outros utilizadores

---

### 3. **Collection: couples**

#### Leitura:
- Apenas membros do casal ou admin podem ver os dados

#### Criação:
- Qualquer utilizador autenticado pode criar um casal

#### Atualização/Eliminação:
- Apenas membros do casal ou admin podem modificar

---

### 4. **Collection: activities**

#### Leitura:
- Todos os utilizadores autenticados podem ver atividades

#### Criação/Atualização/Eliminação:
- **Apenas admin** pode modificar atividades

---

### 5. **Collection: completedActivities**

#### Leitura:
- Apenas o utilizador que completou a atividade ou admin

#### Criação:
- Utilizador pode registar apenas as suas próprias atividades completadas

#### Atualização/Eliminação:
- Apenas o utilizador que criou ou admin

---

### 6. **Collection: adminLogs**

#### Leitura:
- **Apenas admin** pode ver logs

#### Criação:
- Qualquer ação autenticada (para logging automático de ações)

#### Atualização/Eliminação:
- **Apenas admin** pode modificar logs

---

## 🚨 REGRAS DE SEGURANÇA CRÍTICAS

### ❌ **NUNCA USAR:**
```javascript
// NÃO FAZER ISTO! (Acesso público total)
allow read, write: if true;
```

### ❌ **EVITAR EM PRODUÇÃO:**
```javascript
// Apenas para desenvolvimento/testes
allow read, write: if request.auth != null;
```

### ✅ **USAR SEMPRE:**
```javascript
// Verificar permissões específicas
allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
allow write: if isAuthenticated() && isOwner(userId);
```

---

## 🧪 TESTAR REGRAS NO FIREBASE CONSOLE

### 1. **Aceder ao Simulador:**
```
Firebase Console → Firestore Database → Rules → Rules Playground
```

### 2. **Testar Criação de Perfil:**
```javascript
// Tipo: get
// Caminho: /databases/(default)/documents/users/USER_UID_AQUI
// Autenticação: Simulated (uid: USER_UID_AQUI)

// Resultado esperado: ✅ Allow
```

### 3. **Testar Leitura de Outro Perfil:**
```javascript
// Tipo: get
// Caminho: /databases/(default)/documents/users/OUTRO_UID
// Autenticação: Simulated (uid: MEU_UID)

// Resultado esperado: ✅ Allow (pode ler outros perfis)
```

### 4. **Testar Atualização de Outro Perfil:**
```javascript
// Tipo: update
// Caminho: /databases/(default)/documents/users/OUTRO_UID
// Autenticação: Simulated (uid: MEU_UID)

// Resultado esperado: ❌ Deny (não pode atualizar outros perfis)
```

---

## 📝 IMPLEMENTAR REGRAS

### 1. **Copiar código das regras acima**

### 2. **Ir para Firebase Console:**
```
https://console.firebase.google.com
```

### 3. **Navegar para:**
```
Projeto Quest4Couple → Firestore Database → Rules
```

### 4. **Colar as regras no editor**

### 5. **Clicar em "Publish"**

### 6. **Aguardar propagação (pode levar alguns segundos)**

---

## ⚠️ AVISO DE SEGURANÇA

### Dados Sensíveis:
- **NUNCA** armazenar passwords em texto puro no Firestore
- **NUNCA** expor tokens de API no frontend
- **SEMPRE** validar dados no backend (Cloud Functions)
- **SEMPRE** usar HTTPS

### Teste de Segurança:
```javascript
// Verificar se as regras estão ativas:
// 1. Tentar aceder ao Firestore sem auth
// 2. Tentar modificar documento de outro utilizador
// 3. Tentar criar documento com UID diferente do auth.uid

// Se algum destes testes passar, as regras estão MAL CONFIGURADAS!
```

---

## 📚 RECURSOS

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/rules)
- [Common Security Rules Patterns](https://firebase.google.com/docs/firestore/security/rules-structure)

---

**Data:** 2024
**Versão:** Quest4Couple v2 Free
**Estado:** ✅ Regras recomendadas documentadas

