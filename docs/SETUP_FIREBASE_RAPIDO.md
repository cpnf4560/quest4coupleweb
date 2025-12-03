# 🔥 SETUP RÁPIDO FIREBASE - Quest4Couple

## ⚡ PASSOS RÁPIDOS (15 minutos)

### 1️⃣ Criar Projeto Firebase

1. Vai a [Firebase Console](https://console.firebase.google.com/)
2. Clica em **"Adicionar projeto"**
3. Nome: `quest4couple` (ou o que quiseres)
4. Google Analytics: **Opcional** (pode desativar para ser mais rápido)
5. Clica em **"Criar projeto"**

---

### 2️⃣ Ativar Authentication

1. No menu lateral: **Authentication** > **Get Started**
2. Ativar **Email/Password**:
   - Clica em "Email/Password"
   - Ativa o primeiro toggle (Email/Password)
   - Clica em "Guardar"
3. Ativar **Google**:
   - Clica em "Google"
   - Ativa o toggle
   - Define um email de suporte (o teu email)
   - Clica em "Guardar"

**✅ DONE!** Authentication configurada em 2 minutos

---

### 3️⃣ Criar Firestore Database

1. No menu lateral: **Firestore Database** > **Criar base de dados**
2. Escolhe: **Começar em modo de teste** (vamos configurar regras depois)
3. Localização: **europe-west1** (Europa - Bélgica) ou a mais perto de ti
4. Clica em **"Ativar"**

**✅ DONE!** Database criada

---

### 4️⃣ Obter Configuração Firebase

1. No menu lateral: **Definições do projeto** (ícone de engrenagem) > **Configurações do projeto**
2. Scroll down até **"As suas aplicações"**
3. Clica no ícone **</>** (Web)
4. Nome da app: `Quest4Couple Web`
5. **NÃO marques** Firebase Hosting (por agora)
6. Clica em **"Registar app"**
7. **COPIA** o código da configuração que aparece:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "quest4couple.firebaseapp.com",
  projectId: "quest4couple",
  storageBucket: "quest4couple.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

---

### 5️⃣ Colar Configuração no Projeto

1. Abre: **`js/firebase-config.js`**
2. **SUBSTITUI** as linhas 4-9 com a TUA configuração:

```javascript
const firebaseConfig = {
  apiKey: "COLA_AQUI_O_TEU_API_KEY",          // ← Substitui isto
  authDomain: "COLA_AQUI_O_TEU_AUTH_DOMAIN",  // ← Substitui isto
  projectId: "COLA_AQUI_O_TEU_PROJECT_ID",    // ← Substitui isto
  storageBucket: "COLA_AQUI_O_TEU_STORAGE_BUCKET", // ← Substitui isto
  messagingSenderId: "COLA_AQUI_O_TEU_MESSAGING_SENDER_ID", // ← Substitui isto
  appId: "COLE_AQUI_O_TEU_APP_ID"             // ← Substitui isto
};
```

3. **GUARDA** o ficheiro

**✅ DONE!** Configuração colada

---

### 6️⃣ Configurar Regras de Segurança (IMPORTANTE!)

#### **Firestore Rules:**

1. No Firebase Console: **Firestore Database** > **Regras**
2. **SUBSTITUI** tudo por isto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // User pode ler/escrever o seu próprio perfil
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Todos podem ler usernames (para procurar users)
      allow read: if request.auth != null;
      
      // Subcollections do user
      match /answers/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /customQuestions/{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Connections collection
    match /connections/{connectionId} {
      // Apenas users conectados podem ler/escrever
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.users;
      
      // Permitir criar nova conexão
      allow create: if request.auth != null &&
        request.auth.uid in request.resource.data.users;
    }
  }
}
```

3. Clica em **"Publicar"**

**✅ DONE!** Segurança configurada

---

### 7️⃣ Testar a Aplicação

1. Abre o projeto no teu browser:
   - **Método 1**: Duplo clique em `auth.html`
   - **Método 2**: Usa Live Server (recomendado)
     - Instala extensão "Live Server" no VS Code
     - Right-click em `auth.html` > "Open with Live Server"

2. Testa:
   - ✅ Cria uma conta com email/password
   - ✅ Faz login com Google
   - ✅ Verifica se redireciona para dashboard
   - ✅ Verifica se o dashboard carrega os packs

**✅ TUDO DONE!** Aplicação a funcionar 🎉

---

## 🚀 PRÓXIMOS PASSOS (Opcional por agora)

### Firebase Hosting (Deploy online)

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar projeto
firebase init hosting

# Deploy
firebase deploy
```

---

## 📱 ESTRUTURA FIRESTORE CRIADA AUTOMATICAMENTE

Quando o primeiro user se registar, vai criar:

```
users/{userId}/
  ├── profile: {name, username, email, createdAt}
  ├── answers/
  │   └── all: {romantico: {q1: {...}}, ...}
  └── customQuestions/
      └── romantico: [{...}]

connections/{connectionId}/
  ├── users: [userId1, userId2]
  ├── sharedPacks: [packId1, packId2]
  └── report: {...}
```

---

## ❓ TROUBLESHOOTING

### Erro: "Firebase not defined"
- Verifica se os scripts do Firebase estão ANTES dos teus scripts em `auth.html`

### Erro: "auth is not defined"
- Verifica se `firebase-config.js` está a ser carregado primeiro

### Erro: "Permission denied"
- Verifica se publicaste as regras do Firestore

### Login Google não funciona:
1. Firebase Console > Authentication > Sign-in method
2. Google > Configurar > Define email de suporte
3. Guarda e testa novamente

### Quero adicionar Reddit OAuth:
1. Cria app no Reddit: https://www.reddit.com/prefs/apps
2. Firebase Console > Authentication > Sign-in method > Reddit
3. Cola Client ID e Secret
4. Adiciona botão na UI

---

## 🎯 CHECKLIST FINAL

- [ ] Projeto Firebase criado
- [ ] Authentication ativada (Email + Google)
- [ ] Firestore Database criada
- [ ] Configuração colada em `firebase-config.js`
- [ ] Regras de segurança publicadas
- [ ] Aplicação testada no browser
- [ ] Registo/Login funcionam
- [ ] Dashboard carrega

**Tudo ✅?** ESTÁS PRONTO! 🔥🚀

---

## 💡 DICA PRO

Usa sempre **Live Server** no VS Code para testar:
- Auth funciona melhor (cookies, redirects)
- Firebase Auth exige origem válida
- Hot reload automático

---

**Precisas de ajuda?** Grita! 😄

