# 🔥 SETUP FIREBASE - Quest4Couple

## 1️⃣ CRIAR PROJETO NO FIREBASE

1. **Ir para:** https://console.firebase.google.com/
2. **Clicar em:** "Adicionar projeto"
3. **Nome:** `Quest4Couple`
4. **Desativar Google Analytics** (por agora, podemos ativar depois)
5. **Criar Projeto**

---

## 2️⃣ CONFIGURAR AUTHENTICATION

### Ativar Google Sign-In:
1. No menu lateral → **Authentication**
2. Clicar em **"Get started"**
3. Tab **"Sign-in method"**
4. Ativar **"Google"**
   - Email do projeto: (usar o teu email)
   - Nome público: Quest4Couple
   - **Guardar**

### Ativar Email/Password (backup):
1. Mesma página → Ativar **"Email/Password"**
2. Deixar "Email link" desativado
3. **Guardar**

### Configurar Reddit OAuth (depois):
1. Ir para: https://www.reddit.com/prefs/apps
2. Criar app OAuth
3. Adicionar redirect URI: `https://quest4couple.firebaseapp.com/__/auth/handler`
4. Copiar Client ID e Secret
5. No Firebase → Authentication → Sign-in method → Add custom provider

---

## 3️⃣ CONFIGURAR FIRESTORE DATABASE

1. No menu lateral → **Firestore Database**
2. **"Criar banco de dados"**
3. Modo: **"Produção"** (vamos configurar regras depois)
4. Localização: **"europe-west1"** (mais próximo)
5. **Ativar**

---

## 4️⃣ CONFIGURAR HOSTING

1. No menu lateral → **Hosting**
2. **"Get started"**
3. Seguir passos (vamos fazer via CLI depois)

---

## 5️⃣ OBTER CONFIGURAÇÃO

1. No menu lateral → **Configurações do projeto** (ícone engrenagem)
2. Scroll down → **"Seus apps"**
3. Clicar no ícone **</>** (Web)
4. Nome do app: `Quest4Couple Web`
5. **NÃO** ativar Firebase Hosting ainda
6. **Registrar app**
7. **COPIAR** o código de configuração que aparece:

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

8. **Colar** esse código no ficheiro `firebase-config.js` que vou criar

---

## 6️⃣ INSTALAR FIREBASE CLI

No terminal (PowerShell):

```powershell
npm install -g firebase-tools
firebase login
```

---

## 7️⃣ REGRAS DE SEGURANÇA (Firestore)

No Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Connections podem ser lidas por ambos os users
    match /connections/{connectionId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.user1Id || 
         request.auth.uid == resource.data.user2Id);
      allow write: if request.auth != null;
    }
  }
}
```

**Publicar** as regras.

---

## ✅ CHECKLIST RÁPIDO

- [ ] Projeto Firebase criado
- [ ] Google Sign-In ativado
- [ ] Email/Password ativado
- [ ] Firestore criado
- [ ] Configuração copiada
- [ ] Firebase CLI instalado
- [ ] Regras de segurança configuradas

---

**Quando terminares, avisa que continuo com o código! 🚀**
