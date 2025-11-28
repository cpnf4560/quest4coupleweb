# 💑 Quest4Couple v2 - Free Version

> **Descubram-se juntos através de perguntas personalizadas e criem experiências inesquecíveis!**

[![Firebase](https://img.shields.io/badge/Firebase-v8.10.0-orange)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Free-green)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success)](https://quest4couple.pt)

---

## 📋 Sobre o Projeto

**Quest4Couple** é uma plataforma interativa que ajuda casais a conhecerem-se melhor através de:

- 🎯 **Questionários Personalizados** - Perguntas adaptadas aos interesses do casal
- 💝 **Compatibilidade** - Análise de respostas e matching
- 🎨 **Relatórios Visuais** - Gráficos e estatísticas detalhadas
- 📊 **Dashboard Personalizado** - Acompanhamento de progresso
- 🔐 **Admin Dashboard** - Gestão completa de utilizadores e atividades

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
- ✅ Gestão de atividades/perguntas
- ✅ Analytics e estatísticas
- ✅ Activity logs
- ✅ Sistema de monitorização

---

## 🚀 Início Rápido (5 minutos)

### 1. Clone o Repositório:
```bash
git clone https://github.com/seu-usuario/quest4couple-v2.git
cd quest4couple-v2
```

### 2. Configure Firebase:
Ver: **`GUIA_RAPIDO_IMPLEMENTACAO.md`**

### 3. Configure Firestore Rules:
Ver: **`FIRESTORE_RULES_RECOMENDADAS.md`**

### 4. Teste:
Ver: **`TESTE_CORRECOES.md`**

---

## 📚 Documentação Completa

| Ficheiro | Descrição |
|----------|-----------|
| **`RESUMO_EXECUTIVO.md`** | Resumo conciso (1 página) |
| **`RESUMO_CORRECOES.md`** | Correções detalhadas |
| **`FIRESTORE_RULES_RECOMENDADAS.md`** | Regras de segurança |
| **`TESTE_CORRECOES.md`** | Guia de testes completo |
| **`GUIA_RAPIDO_IMPLEMENTACAO.md`** | Setup em 5 minutos |

---

## 🐛 Correções Recentes (27/Nov/2025)

### ✅ Bug #1: Admin Login (Erro de Sintaxe)
- **Problema:** Login piscava e não funcionava
- **Causa:** Comentário colado na declaração da função
- **Status:** ✅ CORRIGIDO

### ✅ Bug #2: Registo Email/Password (Missing Permissions)
- **Problema:** Erro "Missing or insufficient permissions"
- **Causa:** Escrita prematura no Firestore
- **Solução:** SessionStorage + onAuthStateChanged
- **Status:** ✅ CORRIGIDO

**Ver detalhes em:** `RESUMO_CORRECOES.md`

---

## 🔧 Tecnologias

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Hosting:** Netlify
- **Analytics:** Microsoft Clarity
- **Charts:** Chart.js

---

## 🧪 Testes

```bash
# 1. Testar Admin Login
Abrir: /pages/admin.html

# 2. Testar Registo
Abrir: /auth.html → Tab "Registar"

# 3. Testar Login
Abrir: /auth.html → Tab "Login"
```

**Guia completo:** `TESTE_CORRECOES.md`

---

## 📞 Suporte

### Encontrou um bug?
1. Verificar console (F12)
2. Consultar documentação (`.md` files)
3. Abrir issue no GitHub

### Documentação:
- 📧 Email: suporte@quest4couple.pt
- 🌐 Website: https://quest4couple.pt

---

## 📄 Licença

**100% Gratuito** - Uso pessoal e educacional permitido.

---

## 🙏 Créditos

- [Firebase](https://firebase.google.com/)
- [Netlify](https://www.netlify.com/)
- [Chart.js](https://www.chartjs.org/)
- [Microsoft Clarity](https://clarity.microsoft.com/)

---

**Feito com ❤️ para casais que querem conhecer-se melhor**

---

**Versão:** 2.0.0 | **Data:** 27/Nov/2025 | **Status:** ✅ Produção