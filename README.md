# 💑 Quest4Couple

> **Descubram-se juntos através de perguntas personalizadas e criem experiências inesquecíveis!**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Active-success)](https://quest4couple.pt)
[![Firebase](https://img.shields.io/badge/Firebase-v8.10.0-orange)](https://firebase.google.com/)
[![i18n](https://img.shields.io/badge/i18n-5%20Languages-blue)](i18n/)

---

## 📋 Sobre o Projeto

**Quest4Couple** é uma plataforma interativa multilingue que ajuda casais a conhecerem-se melhor através de:

- 🎯 **Questionários Personalizados** - Perguntas adaptadas aos interesses do casal
- 💝 **Compatibilidade** - Análise de respostas e matching
- 🎨 **Relatórios Visuais** - Gráficos e estatísticas detalhadas
- 📊 **Dashboard Personalizado** - Acompanhamento de progresso
- 🔐 **Admin Dashboard** - Gestão completa de utilizadores
- 🌍 **Suporte Multilingue** - PT-PT, PT-BR, EN, ES, FR

---

## ✨ Funcionalidades

### 👥 Para Utilizadores:
- ✅ Registo com Email/Password ou Google
- ✅ Questionário interativo com 200+ perguntas
- ✅ Sistema de matching com parceiro
- ✅ Relatórios visuais de compatibilidade
- ✅ Download de respostas (ficheiro .q4c)
- ✅ Sincronização automática com Firebase
- ✅ Interface responsiva (mobile-friendly)

### 🔧 Para Admins:
- ✅ Dashboard administrativo completo
- ✅ Gestão de utilizadores
- ✅ Analytics e estatísticas
- ✅ Activity logs

---

## 📁 Estrutura do Projeto

```
Quest4Couple/
│
├── 📄 index.html              # Página principal
├── 📄 app.html                # Aplicação de questionário
├── 📄 auth.html               # Autenticação
├── 📄 dashboard.html          # Dashboard do utilizador
├── 📄 tutorial.html           # Tutorial
├── 📄 relatorio.html          # Relatório de compatibilidade
├── 📄 estatisticas.html       # Estatísticas públicas
│
├── 📂 css/                    # Estilos CSS
├── 📂 js/                     # Scripts JavaScript
├── 📂 data/                   # Dados de perguntas JSON
├── 📂 assets/                 # Imagens e recursos
├── 📂 pages/                  # Páginas adicionais (admin, etc)
│
├── 📂 i18n/                   # Traduções (5 idiomas)
│   ├── translations.pt-pt.json
│   ├── translations.pt-br.json
│   ├── translations.en.json
│   ├── translations.es.json
│   └── translations.fr.json
│
├── 📂 docs/                   # Documentação
└── 📂 .github/workflows/      # GitHub Actions (deploy)
```

---

## 🚀 Deploy com GitHub Pages

### 1. Fazer Fork ou Clone:
```bash
git clone https://github.com/seu-usuario/quest4couple.git
cd quest4couple
```

### 2. Configurar GitHub Pages:
1. Ir a **Settings** → **Pages**
2. Em **Source**, selecionar **GitHub Actions**
3. O workflow automático fará o deploy em cada push

### 3. Configurar Domínio Personalizado (opcional):
1. Em **Settings** → **Pages** → **Custom domain**
2. Adicionar o seu domínio (ex: `quest4couple.pt`)
3. Criar ficheiro `CNAME` na raiz com o domínio

---

## 🔧 Configuração Firebase

### 1. Criar Projeto no Firebase Console:
- Ir a [console.firebase.google.com](https://console.firebase.google.com)
- Criar novo projeto
- Ativar Authentication (Email/Password e Google)
- Criar base de dados Firestore

### 2. Configurar `js/firebase-config.js`:
```javascript
const firebaseConfig = {
    apiKey: "sua-api-key",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

### 3. Configurar Firestore Rules:
Ver: `firestore.rules`

---

## 🔧 Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Firebase (Auth, Firestore)
- **Hosting:** GitHub Pages
- **Analytics:** Microsoft Clarity
- **Charts:** Chart.js

---

## 🌍 Idiomas Suportados

| Idioma | Código | Ficheiro |
|--------|--------|----------|
| 🇵🇹 Português (PT) | `pt-pt` | `translations.pt-pt.json` |
| 🇧🇷 Português (BR) | `pt-br` | `translations.pt-br.json` |
| 🇬🇧 English | `en` | `translations.en.json` |
| 🇪🇸 Español | `es` | `translations.es.json` |
| 🇫🇷 Français | `fr` | `translations.fr.json` |

---

## 📞 Suporte

- 🌐 Website: https://quest4couple.pt
- 📧 Email: suporte@quest4couple.pt

---

## 📄 Licença

**100% Gratuito** - Uso pessoal e educacional permitido.

---

**Feito com ❤️ para casais que querem conhecer-se melhor**
