# 🔥 Quest4Couple v2.0 - Firebase Edition

> **Descubram-se juntos** - Plataforma de questionários para casais com sincronização na cloud

[![Status](https://img.shields.io/badge/Status-Ready%20for%20Setup-yellow)]()
[![Firebase](https://img.shields.io/badge/Firebase-Ready-orange)]()
[![Version](https://img.shields.io/badge/Version-2.0-blue)]()

---

## 🚀 Quick Start

### 1. Setup Firebase (15 min)
```bash
# Segue o guia:
COMECAR_AGORA.md
```

### 2. Configurar
```javascript
// js/firebase-config.js
const firebaseConfig = {
  apiKey: "COLA_AQUI",
  authDomain: "COLA_AQUI",
  projectId: "COLA_AQUI",
  // ...
};
```

### 3. Rodar
```bash
# Opção 1: Live Server (VS Code)
Right-click auth.html > Open with Live Server

# Opção 2: Python
python -m http.server 8000

# Opção 3: Node
npx http-server -p 8000
```

### 4. Testar
```
http://localhost:8000/auth.html
```

---

## ✨ Features

### 🔐 Autenticação
- ✅ Sign up com Email/Password
- ✅ Sign in com Google OAuth
- ✅ Reset password
- ✅ Auto-redirect & proteção de páginas

### 📊 Dashboard
- ✅ Estatísticas em tempo real
- ✅ 5 packs de questionários:
  - ❤️ Romântico (30 perguntas)
  - 🔥 Experiência (35 perguntas)
  - 🌶️ Pimentinha (40 perguntas)
  - 💕 Poliamor (20 perguntas)
  - 🔒 Fetiches (100 perguntas)
- ✅ Progresso visual por pack
- ✅ Gestão de respostas

### 👥 Conexões
- ✅ Procurar parceiro por username
- ✅ Conectar com múltiplos parceiros
- ✅ Partilhar packs selecionados
- ✅ Sistema de convites

### ☁️ Cloud Sync
- ✅ Respostas guardadas no Firestore
- ✅ Sincronização multi-device
- ✅ Histórico persistido
- ✅ Backup automático

---

## 📁 Estrutura

```
Quest4Couple_v2_free/
│
├── 🏠 Landing
│   └── index.html                    # Homepage
│
├── 🔐 Autenticação
│   ├── auth.html                     # Login/Signup
│   ├── css/auth.css
│   └── js/
│       ├── firebase-config.js        # Config Firebase
│       ├── auth.js                   # Auth logic
│       └── auth-ui.js                # UI logic
│
├── 📊 Dashboard
│   ├── dashboard.html                # User dashboard
│   ├── css/dashboard.css
│   └── js/dashboard.js               # Dashboard logic
│
├── 📝 Questionário
│   ├── app.html                      # Quiz interface
│   ├── css/
│   │   ├── main.css
│   │   ├── themes.css
│   │   └── questions.css
│   └── js/
│       ├── app.js
│       ├── storage.js
│       ├── rendering.js
│       ├── customQuestions.js
│       ├── invertMatching.js
│       └── firestore-sync.js         # Firestore sync
│
├── 📦 Data
│   ├── data/
│   │   ├── packs_data_clean.json    # Packs + perguntas
│   │   └── invert_matching_config.json
│
└── 📚 Docs
    ├── COMECAR_AGORA.md              # Quick start
    ├── SETUP_FIREBASE_RAPIDO.md      # Setup guide
    ├── IMPLEMENTACAO_FIREBASE_COMPLETA.md
    ├── CHECKLIST_TESTE_FIREBASE.md
    └── RESUMO_IMPLEMENTACAO_FIREBASE.md
```

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Grid, Flexbox, Animations
- **JavaScript (ES6+)** - Vanilla JS, async/await

### Backend
- **Firebase Authentication** - Email + Google OAuth
- **Cloud Firestore** - NoSQL database
- **Firebase Hosting** - Deploy (opcional)

### Design
- **Responsive** - Mobile-first design
- **Animations** - Smooth transitions
- **Gradients** - Modern color schemes

---

## 📊 Database Schema

```javascript
// Firestore structure
users/{userId}/
  ├── profile: {name, username, email, createdAt}
  ├── answers/all: {
  │     romantico: {q1: {answer, timestamp}, ...},
  │     experiencia: {...},
  │     ...
  │   }
  └── customQuestions/{packId}: {questions: [...]}

connections/{connectionId}/
  ├── users: [userId1, userId2]
  ├── sharedPacks: ["romantico", "experiencia"]
  ├── report: {...} | null
  └── createdAt: timestamp
```

---

## 🎨 Screenshots

### Landing Page
![Landing](./docs/screenshots/landing.png)
*Homepage moderna com gradientes*

### Auth
![Auth](./docs/screenshots/auth.png)
*Login/Signup com Google OAuth*

### Dashboard
![Dashboard](./docs/screenshots/dashboard.png)
*Overview de packs e progresso*

---

## 📖 Documentação

### Para Começar
- 📄 [`COMECAR_AGORA.md`](COMECAR_AGORA.md) - Começar em 3 passos
- 📄 [`SETUP_FIREBASE_RAPIDO.md`](SETUP_FIREBASE_RAPIDO.md) - Setup detalhado

### Para Developers
- 📄 [`IMPLEMENTACAO_FIREBASE_COMPLETA.md`](IMPLEMENTACAO_FIREBASE_COMPLETA.md) - Arquitetura
- 📄 [`CHECKLIST_TESTE_FIREBASE.md`](CHECKLIST_TESTE_FIREBASE.md) - QA checklist

### Resumos
- 📄 [`RESUMO_IMPLEMENTACAO_FIREBASE.md`](RESUMO_IMPLEMENTACAO_FIREBASE.md) - Overview

---

## 🧪 Testing

### Rodar Testes
```bash
# Seguir checklist
cat CHECKLIST_TESTE_FIREBASE.md
```

### Coverage
- ✅ 43 casos de teste
- ✅ Auth flow completo
- ✅ Dashboard + Conexões
- ✅ Firestore integration

---

## 🚀 Deploy

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

### Outras Opções
- **Vercel** - Deploy com Git
- **Netlify** - CI/CD automático
- **GitHub Pages** - Grátis (sem server-side)

---

## 🔒 Segurança

### Authentication
- ✅ Password mínimo 6 caracteres
- ✅ Email validation
- ✅ Firebase tokens
- ✅ HTTPS only

### Firestore Rules
```javascript
// Users só acedem aos próprios dados
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Conexões verificadas
match /connections/{connectionId} {
  allow read, write: if request.auth.uid in resource.data.users;
}
```

---

## 📈 Roadmap

### ✅ v2.0 - Firebase (Atual)
- [x] Sistema de autenticação
- [x] Dashboard
- [x] Conexões
- [x] Partilha de packs
- [x] Cloud sync

### 🔜 v2.1 - Relatórios
- [ ] Gerar relatório quando ambos partilham
- [ ] Visualização de compatibilidade
- [ ] Exportar PDF

### 🔜 v2.2 - Premium
- [ ] Stripe/PayPal integration
- [ ] Packs exclusivos premium
- [ ] Histórico ilimitado
- [ ] Sem ads

### 🔜 v3.0 - Mobile
- [ ] React Native app
- [ ] Push notifications
- [ ] Offline mode

---

## 🤝 Contribuir

### Setup Dev
```bash
git clone https://github.com/teu-user/quest4couple.git
cd quest4couple
# Seguir SETUP_FIREBASE_RAPIDO.md
```

### Workflow
1. Fork o repo
2. Cria branch (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Abre Pull Request

---

## 📝 Changelog

### v2.0.0 (18 Nov 2024)
- ✨ Sistema de autenticação completo
- ✨ Dashboard com estatísticas
- ✨ Sistema de conexões
- ✨ Partilha de packs
- ✨ Firestore integration
- 🎨 UI/UX moderno
- 📚 Documentação extensiva

### v1.0.0 (Anterior)
- ✅ 5 packs de questionários
- ✅ Sistema offline (localStorage)
- ✅ Relatório básico
- ✅ Perguntas custom

---

## 📄 Licença

Este projeto é **uso pessoal**. Código fornecido "as is".

---

## 🙏 Créditos

- **Desenvolvido por:** [Teu Nome]
- **Firebase:** Google Cloud Platform
- **Design:** Inspirado em apps modernos de relacionamento

---

## 📞 Suporte

### Problemas?
1. Verifica [CHECKLIST_TESTE_FIREBASE.md](CHECKLIST_TESTE_FIREBASE.md)
2. Abre issue no GitHub
3. Contacta: teu@email.com

### Links Úteis
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Auth](https://firebase.google.com/docs/auth)

---

## ⭐ Star History

Se gostaste do projeto, deixa uma ⭐!

---

<div align="center">

**[🏠 Homepage](index.html)** • **[🔐 Login](auth.html)** • **[📚 Docs](COMECAR_AGORA.md)**

Feito com ❤️ e ☕ por [Teu Nome]

</div>
