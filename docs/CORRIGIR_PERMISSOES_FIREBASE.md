# 🔐 CORRIGIR PERMISSÕES FIREBASE - Username Migration

## 🔴 ERRO ENCONTRADO:
```
Missing or insufficient permissions
```

## 📋 CAUSA:
As regras do Firestore não permitem que o admin atualize o campo `username` dos utilizadores.

---

## ✅ SOLUÇÃO: Atualizar Firestore Rules

### Passo 1: Abrir Firebase Console

```
https://console.firebase.google.com
```

1. Selecionar projeto: **quest4couple**
2. Ir para: **Firestore Database**
3. Clicar no tab: **Rules**

---

### Passo 2: Adicionar Regra para Username

**OPÇÃO A: Permitir Admin Atualizar Username (Temporário)**

Adicionar esta regra **temporariamente** para a migração:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Permitir ler próprio perfil
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Permitir criar próprio perfil
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Permitir atualizar próprio perfil OU admin
      allow update: if request.auth != null && (
        request.auth.uid == userId ||
        request.auth.token.email == 'carlos.sousacorreia@gmail.com'  // Admin
      );
      
      // ⚠️ TEMPORÁRIO: Permitir admin atualizar username durante migração
      allow update: if request.auth != null && 
        request.auth.token.email == 'carlos.sousacorreia@gmail.com' &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['username', 'updatedAt']);
    }
    
    // Outras regras...
  }
}
```

---

**OPÇÃO B: Permitir Atualizar Próprio Username (Permanente)**

Melhor opção: Permitir que cada utilizador atualize o próprio username:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Permitir ler próprio perfil
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Permitir criar próprio perfil
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Permitir atualizar próprio perfil (incluindo username)
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // ✅ Admin pode ler todos os utilizadores
      allow read: if request.auth != null && 
        request.auth.token.email == 'carlos.sousacorreia@gmail.com';
      
      // ✅ Admin pode atualizar qualquer utilizador
      allow update: if request.auth != null && 
        request.auth.token.email == 'carlos.sousacorreia@gmail.com';
    }
    
    // Connections collection
    match /connections/{connectionId} {
      allow read, write: if request.auth != null;
    }
    
    // Analytics collections
    match /analytics_full_reports/{reportId} {
      allow read: if request.auth != null && 
        request.auth.token.email == 'carlos.sousacorreia@gmail.com';
      allow write: if request.auth != null;
    }
    
    match /analytics_answers/{answerId} {
      allow read: if request.auth != null && 
        request.auth.token.email == 'carlos.sousacorreia@gmail.com';
      allow write: if request.auth != null;
    }
  }
}
```

---

### Passo 3: Publicar Regras

1. Clicar em **"Publish"** ou **"Publicar"**
2. Aguardar confirmação (alguns segundos)
3. ✅ Regras ativas!

---

## 🔄 ALTERNATIVA: Usar Firebase Admin SDK (Script Node.js)

Se preferires não alterar as regras, podes usar um script Node.js com Firebase Admin SDK:

### 1. Criar `migrate-usernames-admin.js`:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateUsernames() {
  console.log('🔄 Iniciando migração...');
  
  const usersSnapshot = await db.collection('users')
    .where('username', '==', null)
    .get();
  
  console.log(`📊 ${usersSnapshot.size} utilizadores sem username`);
  
  const batch = db.batch();
  
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    let username = (data.name || data.email.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 15);
    
    if (username.length < 3) username += '123';
    
    batch.update(doc.ref, {
      username: username,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  
  await batch.commit();
  console.log('✅ Migração concluída!');
}

migrateUsernames().catch(console.error);
```

### 2. Executar:

```bash
npm install firebase-admin
node migrate-usernames-admin.js
```

---

## 🎯 RECOMENDAÇÃO

### **Usar Opção B (Regras Permanentes)**

**Porquê?**
- ✅ Mais seguro
- ✅ Admin tem acesso total
- ✅ Utilizadores podem atualizar próprio username
- ✅ Não precisa reverter depois

**Passos:**
1. Copiar regras da Opção B
2. Colar em Firebase Console → Firestore → Rules
3. Publicar
4. Aguardar ~10 segundos
5. Executar migração novamente no Admin BackOffice

---

## 📊 VERIFICAR SE FUNCIONOU

Depois de atualizar as regras, testar:

```javascript
// Na consola do browser (F12)
// Enquanto estás logado como admin no BackOffice

db.collection('users').doc('USER_ID_AQUI').update({
  username: 'teste123',
  updatedAt: firebase.firestore.FieldValue.serverTimestamp()
})
.then(() => console.log('✅ Funcionou!'))
.catch(e => console.error('❌ Erro:', e.message));
```

---

## ⚠️ IMPORTANTE

### Depois da Migração:

Se usaste **Opção A (Temporário)**, reverter para regras mais restritivas:

```javascript
// Remover regra temporária de admin
// Manter apenas:
allow update: if request.auth != null && request.auth.uid == userId;
```

---

## 🔗 RECURSOS

- Firebase Rules: https://firebase.google.com/docs/firestore/security/rules-structure
- Admin SDK: https://firebase.google.com/docs/admin/setup

---

**Criado:** 20 Novembro 2025  
**Autor:** GitHub Copilot  
**Status:** Aguardando atualização de regras
