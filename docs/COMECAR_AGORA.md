# 🚀 COMEÇAR AGORA - Quest4Couple Firebase

## ⚡ 3 PASSOS PARA TER ISTO A FUNCIONAR

---

## 1️⃣ SETUP FIREBASE (15 minutos)

### Abrir Guia de Setup:
```
📄 SETUP_FIREBASE_RAPIDO.md
```

### Resumo Ultra-Rápido:
1. Vai a [console.firebase.google.com](https://console.firebase.google.com)
2. Cria projeto "quest4couple"
3. Ativa Authentication (Email + Google)
4. Cria Firestore Database (modo teste)
5. Copia configuração
6. Cola em `js/firebase-config.js` (linhas 4-9)
7. Publica regras de segurança

**✅ FEITO? Próximo passo!**

---

## 2️⃣ TESTAR APLICAÇÃO (5 minutos)

### Opção A: Live Server (Recomendado)
```
1. VS Code → Instala extensão "Live Server"
2. Right-click em auth.html → "Open with Live Server"
3. Browser abre automaticamente
```

### Opção B: Python
```powershell
cd "g:\O meu disco\Formação JAVA - Projetos\Quest4Couple_v2_free"
python -m http.server 8000
```
Abre: http://localhost:8000/auth.html

### Opção C: Node
```powershell
npx http-server -p 8000
```
Abre: http://localhost:8000/auth.html

**✅ ABRIU? Próximo passo!**

---

## 3️⃣ TESTAR FUNCIONALIDADES (10 minutos)

### Quick Test:
1. [ ] Cria conta (Email + Password)
2. [ ] Vê dashboard carregar
3. [ ] Clica "Começar" num pack
4. [ ] Responde 3-5 perguntas
5. [ ] Volta ao dashboard
6. [ ] Vê progresso atualizado

**✅ FUNCIONOU?**

🎉 **PARABÉNS! APLICAÇÃO A FUNCIONAR!** 🎉

---

## 📚 PRÓXIMOS PASSOS

### Para Usar:
- Convida parceiro para criar conta
- Partilha username
- Conecta e partilha packs

### Para Desenvolver:
- [ ] Integrar `app.html` com Firebase (ver `IMPLEMENTACAO_FIREBASE_COMPLETA.md`)
- [ ] Implementar relatórios compartilhados
- [ ] Deploy online (Firebase Hosting, Vercel, etc.)

---

## 🆘 PROBLEMAS?

### Erro "Firebase not defined"
```
✅ Solução: Verifica ordem dos scripts em auth.html
Firebase SDK deve estar ANTES dos teus scripts
```

### Erro "Permission denied"
```
✅ Solução: Publica regras de segurança no Firebase Console
```

### Página em branco
```
✅ Solução: Abre Console do Browser (F12)
Verifica erros
```

### Login Google não funciona
```
✅ Solução: Firebase Console > Authentication > Google
Define email de suporte
```

---

## 📖 DOCUMENTAÇÃO COMPLETA

Tudo explicado em detalhe:
- `SETUP_FIREBASE_RAPIDO.md` - Setup passo-a-passo
- `IMPLEMENTACAO_FIREBASE_COMPLETA.md` - O que foi feito
- `CHECKLIST_TESTE_FIREBASE.md` - Testar tudo
- `firebase-setup.md` - Setup original detalhado

---

## 💡 DICAS PRO

### Use Live Server
- Auth funciona melhor
- Hot reload automático
- Sem problemas de CORS

### Testa com 2 Browsers
```
Browser 1: User João
Browser 2: User Maria (incognito)
Conecta os dois
Partilha packs
```

### Verifica Firestore
```
Firebase Console > Firestore
Vê dados a serem guardados em tempo real
Fixes problemas rapidamente
```

---

## 🎯 ESTRUTURA RÁPIDA

```
index.html          → Landing page (DONE)
    ↓ Clica "Começar"
auth.html           → Login/Signup (DONE)
    ↓ Autentica
dashboard.html      → Overview (DONE)
    ↓ Clica pack
app.html            → Questionário (TO INTEGRATE)
    ↓ Responde
dashboard.html      → Vê progresso (DONE)
    ↓ Adiciona parceiro
dashboard.html      → Conecta + Partilha (DONE)
    ↓ [FUTURE]
report.html         → Relatório compartilhado (TODO)
```

---

## ⏱️ TEMPO ESTIMADO

- Setup Firebase: **15 min**
- Testar Auth: **5 min**
- Testar Dashboard: **5 min**
- Conectar 2 users: **5 min**
- **TOTAL: ~30 min**

---

## 🎉 ESTÁ PRONTO!

Depois destes 3 passos, terás:
- ✅ Sistema de login completo
- ✅ Dashboard funcional
- ✅ Conexões entre users
- ✅ Dados na cloud
- ✅ Multi-device sync
- ✅ Base para versão premium

**AGORA VAI E PÕE ISTO A BOMBAR! 🚀🔥**

---

**Precisas de ajuda?** Volta aqui! 😊

