# 💑 Quest4Couple v2 - Free Version

> **Descubram-se juntos através de perguntas personalizadas e criem experiências inesquecíveis!**

[![Firebase](https://img.shields.io/badge/Firebase-v8.10.0-orange)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Free-green)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success)](https://quest4couple.pt)
[![i18n](https://img.shields.io/badge/i18n-5%20Languages-blue)](i18n/)

---

## 📋 Sobre o Projeto

**Quest4Couple** é uma plataforma interativa multilingue que ajuda casais a conhecerem-se melhor através de:

- 🎯 **Questionários Personalizados** - Perguntas adaptadas aos interesses do casal
- 💝 **Compatibilidade** - Análise de respostas e matching
- 🎨 **Relatórios Visuais** - Gráficos e estatísticas detalhadas
- 📊 **Dashboard Personalizado** - Acompanhamento de progresso
- 🔐 **Admin Dashboard** - Gestão completa de utilizadores e atividades
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

## 📁 Estrutura do Projeto

```
Quest4Couple_v2_free/
│
├── 📄 index.html              # Página principal
├── 📄 app.html                # Aplicação de questionário
├── 📄 auth.html               # Autenticação
├── 📄 dashboard.html          # Dashboard do utilizador
├── 📄 tutorial.html           # Tutorial
├── 📄 relatorio.html          # Relatório de compatibilidade
│
├── 📂 css/                    # Estilos CSS
├── 📂 js/                     # Scripts JavaScript
│   └── i18n.js               # Sistema de traduções
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
├── 📂 docs/                   # 📚 Documentação organizada
│   ├── archive/              # Documentação de correções antigas
│   ├── project/              # Resumos executivos e estado do projeto
│   ├── i18n/                 # Documentação sistema multilingue
│   ├── seo/                  # Documentação SEO e conteúdo
│   └── dns/                  # Documentação configuração domínio
│
├── 📂 tests/                  # 🧪 Testes e debug
│   ├── debug/                # Ficheiros HTML de teste
│   └── test_results/         # Resultados de testes
│
├── 📂 scripts/                # 🔧 Scripts utilitários
│   ├── diagnostics/          # Scripts BAT de diagnóstico
│   ├── create_favicons.py    # Gerador de favicons
│   └── generate_*.js         # Geradores de ficheiros .q4c
│
└── 📂 .firebase/              # Configuração Firebase
```

---

## 📚 Documentação Completa

### Documentação Principal (docs/project/):
| Ficheiro | Descrição |
|----------|-----------|
| **`RESUMO_EXECUTIVO.md`** | Resumo conciso (1 página) |
| **`ESTADO_PROJETO_ATUAL.md`** | Estado atual do projeto |
| **`RESUMO_FINAL_27NOV.md`** | Últimas alterações |

### Sistema i18n (docs/i18n/):
| Ficheiro | Descrição |
|----------|-----------|
| **`SISTEMA_MULTILINGUA_COMPLETO.md`** | Guia completo i18n |
| **`CORRECAO_FINAL_BANDEIRAS_E_HEADERS.md`** | Troubleshooting bandeiras |

### SEO & DNS (docs/seo/ e docs/dns/):
| Ficheiro | Descrição |
|----------|-----------|
| **`SEO_IMPLEMENTATION.md`** | Implementação SEO |
| **`STATUS_FINAL_QUEST4COUPLE.md`** | Estado DNS e SSL |

### Correções Antigas (docs/archive/):
Histórico de correções e investigações de bugs.

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