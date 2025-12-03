# 🔐 FIRESTORE RULES COMPLETAS - Firebase Console

**Como configurar as regras de segurança do Firestore**

---

## 📋 CÓDIGO COMPLETO PARA COPIAR

### Aceder às Rules
1. Firebase Console → https://console.firebase.google.com
2. Selecionar projeto: **Quest4Couple**
3. Menu lateral → **Firestore Database**
4. Tab superior → **Rules** (Regras)

---

## 📝 CÓDIGO DAS RULES

Copie e cole este código **COMPLETO** no editor de rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================
    // USERS COLLECTION
    // ========================================
    match /users/{userId} {
      // Permitir criação apenas se:
      // 1. Utilizador está autenticado (request.auth != null)
      // 2. O UID do documento coincide com o UID do utilizador autenticado
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Permitir leitura e atualização apenas do próprio perfil
      allow read, update: if request.auth != null && request.auth.uid == userId;
      
      // Prevenir deleção acidental
      allow delete: if false;
    }
    
    // ========================================
    // ACTIVITIES COLLECTION (Opcional)
    // ========================================
    match /activities/{activityId} {
      // Qualquer utilizador autenticado pode ler activities
      allow read: if request.auth != null;
      
      // Apenas admins podem escrever (se tiver campo isAdmin)
      allow write: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // ========================================
    // RESPONSES COLLECTION (Se existir)
    // ========================================
    match /responses/{responseId} {
      // Utilizador pode criar as suas próprias respostas
      allow create: if request.auth != null;
      
      // Utilizador pode ler/atualizar apenas as suas respostas
      allow read, update: if request.auth != null && 
                             resource.data.userId == request.auth.uid;
      
      // Prevenir deleção
      allow delete: if false;
    }
    
    // ========================================
    // MATCHES COLLECTION (Se existir)
    // ========================================
    match /matches/{matchId} {
      // Utilizador pode ver matches onde participa
      allow read: if request.auth != null && 
                     (resource.data.user1Id == request.auth.uid || 
                      resource.data.user2Id == request.auth.uid);
      
      // Sistema cria matches automaticamente
      allow create: if request.auth != null;
      
      // Apenas utilizadores envolvidos podem atualizar
      allow update: if request.auth != null && 
                       (resource.data.user1Id == request.auth.uid || 
                        resource.data.user2Id == request.auth.uid);
      
      // Prevenir deleção
      allow delete: if false;
    }
    
    // ========================================
    // BLOQUEAR TUDO O RESTO
    // ========================================
    // Qualquer outra coleção não especificada acima é bloqueada
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🎯 VERSÃO MÍNIMA (Apenas Users)

Se quiser começar apenas com a coleção `users`, use esta versão simplificada:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read, update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    
    // Bloquear todo o resto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 📖 EXPLICAÇÃO LINHA A LINHA

### Header
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
```
- `rules_version = '2'` → Versão das rules (obrigatório)
- `service cloud.firestore` → Serviço Firestore
- `match /databases/{database}/documents` → Raiz de todos os documentos

---

### Regra de Users
```javascript
match /users/{userId} {
```
- `match /users/{userId}` → Para documentos na coleção `users`
- `{userId}` → Variável que captura o ID do documento

```javascript
allow create: if request.auth != null && request.auth.uid == userId;
```
- `request.auth != null` → Utilizador está autenticado
- `request.auth.uid == userId` → UID do Auth coincide com ID do documento
- **Exemplo:** User com UID `abc123` só pode criar documento `users/abc123`

```javascript
allow read, update: if request.auth != null && request.auth.uid == userId;
```
- `request.auth.uid == userId` → Só pode ler/atualizar o próprio perfil
- **Exemplo:** User `abc123` não pode ler perfil de `xyz789`

```javascript
allow delete: if false;
```
- `if false` → **NINGUÉM** pode apagar (nem o próprio user)
- Segurança extra para prevenir deleção acidental

---

## ✅ PUBLICAR AS RULES

### Passos
1. Copiar código completo acima
2. Firebase Console → Firestore Database → **Rules**
3. Apagar código antigo
4. Colar código novo
5. Clicar **"Publish"** (Publicar)
6. ⏳ Aguardar 1-2 minutos (propagação)

### Confirmação
Aparecerá mensagem:
```
✅ Rules publicadas com sucesso
```

---

## 🧪 TESTAR AS RULES

### No Simulator (Firebase Console)
1. Firestore Database → Rules
2. Clicar em **"Simulator"** (Simulador) no topo
3. Testar operação:
   - **Location:** `/users/abc123`
   - **Operation:** `create`
   - **Authenticated:** ✅ Yes
   - **Auth UID:** `abc123`
4. Clicar **"Run"**

**Resultado esperado:** ✅ **Allowed** (Permitido)

### Testar Acesso Negado
- **Location:** `/users/xyz789`
- **Auth UID:** `abc123` (diferente!)
- Clicar **"Run"**

**Resultado esperado:** ❌ **Denied** (Negado)

---

## 🔍 REGRAS AVANÇADAS (Opcional)

### Admin Access (Acesso Total para Admins)
```javascript
match /users/{userId} {
  // Admin tem acesso total
  allow read, write: if request.auth != null && 
                        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
  
  // User normal só pode ler/atualizar próprio perfil
  allow create: if request.auth != null && request.auth.uid == userId;
  allow read, update: if request.auth != null && request.auth.uid == userId;
}
```

### Validação de Dados
```javascript
match /users/{userId} {
  allow create: if request.auth != null && 
                   request.auth.uid == userId &&
                   request.resource.data.email is string &&
                   request.resource.data.displayName is string &&
                   request.resource.data.username is string &&
                   request.resource.data.username.size() >= 3;
}
```

---

## 🚨 ERROS COMUNS

### 1. Rules não funcionam imediatamente
**Causa:** Propagação leva 1-2 minutos  
**Solução:** Aguardar e testar novamente

### 2. "Permission denied" mesmo com rules corretas
**Causa:** Cache do browser  
**Solução:** 
- Limpar cache (Ctrl+Shift+Delete)
- Testar em modo incógnito

### 3. Syntax error ao publicar
**Causa:** Erro de sintaxe no código  
**Solução:**
- Verificar `;` no final das linhas
- Verificar `{}` estão fechados
- Usar simulador para validar

---

## 📊 VISUALIZAÇÃO DAS RULES

```
Firebase Firestore
│
├── Collection: users
│   │
│   ├── Document: {userId} (ex: abc123)
│   │   ├── ✅ CREATE: Se auth.uid == abc123
│   │   ├── ✅ READ: Se auth.uid == abc123
│   │   ├── ✅ UPDATE: Se auth.uid == abc123
│   │   └── ❌ DELETE: Bloqueado
│   │
│   └── Document: {userId} (ex: xyz789)
│       ├── ✅ CREATE: Se auth.uid == xyz789
│       ├── ❌ READ: Negado (auth.uid é abc123)
│       ├── ❌ UPDATE: Negado
│       └── ❌ DELETE: Bloqueado
│
└── Outras coleções
    └── ❌ Bloqueadas (match /{document=**})
```

---

## 📝 RESUMO

### Para Quest4Couple funcionar, precisa de:

1. **Rules publicadas** (código acima)
2. **Authentication habilitado** (Email/Password)
3. **User autenticado** antes de escrever no Firestore
4. **UID coincidente** entre Auth e Firestore

### Fluxo Correto:
```
1. User faz registo em auth.html
   ↓
2. Firebase Auth cria utilizador (UID: abc123)
   ↓
3. onAuthStateChanged() dispara
   ↓
4. createOrUpdateUserProfile() cria documento users/abc123
   ↓
5. Firestore Rules verificam:
   - request.auth != null? ✅ Sim
   - request.auth.uid == abc123? ✅ Sim
   - Document ID == abc123? ✅ Sim
   ↓
6. ✅ PERMITIDO - Documento criado!
```

---

## 🎯 PRÓXIMOS PASSOS

Após publicar as rules:
1. ✅ Aguardar 1-2 minutos
2. ✅ Testar registo em `auth.html`
3. ✅ Verificar console DevTools
4. ✅ Confirmar documento criado no Firestore Console

**Documentação de teste:** `TESTAR_REGISTO_EMAIL.md`

---

**Rules prontas para copiar e colar!** 🚀
