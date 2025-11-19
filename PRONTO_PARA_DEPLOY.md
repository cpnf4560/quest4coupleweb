# 🎉 QUEST4COUPLE PRONTO PARA DEPLOY!

## ✅ O QUE FOI PREPARADO

### 📦 Ficheiro de Deploy Criado:
- **quest4couple_deploy.zip** (~1-2 MB)
- Contém todos os ficheiros necessários
- Pronto para upload no Netlify

### 📁 Conteúdo incluído:
✅ Todas as páginas HTML (index, app, auth, dashboard, tutorial)
✅ CSS completo (main, themes, questions, auth, dashboard)
✅ JavaScript completo (app, auth, rendering, storage, etc)
✅ Assets (logo, imagens dos packs)
✅ Data (packs_data_clean.json, invert_matching_config.json)
✅ Pages (sobre, faq, apoiar, termos, privacidade, admin)
✅ Favicons (favicon.ico, PNG variants)
✅ netlify.toml (configuração optimizada)

---

## 🚀 PRÓXIMOS PASSOS (5 MINUTOS)

### 1. FAZER UPLOAD (2 min)

1. **Abrir:** https://app.netlify.com/drop
2. **Login:** 
   - Criar conta com GitHub (recomendado)
   - OU usar email
3. **Arrastar:** O ficheiro `quest4couple_deploy.zip`
4. **Aguardar:** Upload e deploy automático (30 seg)
5. **Copiar URL:** Ex: `happy-tesla-123456.netlify.app`
6. **TESTAR:** Abrir URL e verificar se funciona

### 2. CONFIGURAR DOMÍNIO (2 min)

**No Netlify:**
1. Clicar no site
2. **Site settings** → **Domain management**
3. **Add custom domain** → `quest4couple.pt`
4. Netlify mostra DNS records

**No fornecedor do domínio (onde compraste quest4couple.pt):**

Adicionar estes registos DNS:

| Tipo | Nome/Host | Valor | TTL |
|------|-----------|-------|-----|
| A | @ | 75.2.60.5 | 3600 |
| CNAME | www | [teu-site].netlify.app | 3600 |

**Exemplo:**
```
A Record:
  Host: @
  Points to: 75.2.60.5
  TTL: 1 hour

CNAME Record:
  Host: www
  Points to: happy-tesla-123456.netlify.app
  TTL: 1 hour
```

**Aguardar:** 5 min a 2 horas (propagação DNS)

### 3. ATIVAR HTTPS (1 min)

**No Netlify:**
1. **Domain settings** → **HTTPS**
2. Clicar **"Verify DNS configuration"**
3. Clicar **"Provision certificate"**
4. Aguardar 1-2 minutos
5. ✅ HTTPS ativo!

### 4. CONFIGURAR FIREBASE (30 seg)

**Firebase Console:** https://console.firebase.google.com/

1. Selecionar projeto **Quest4Couple**
2. **Authentication** → **Settings** → **Authorized domains**
3. **Add domain:**
   - `quest4couple.pt`
   - `www.quest4couple.pt`

**Google Cloud Console:** https://console.cloud.google.com/apis/credentials

1. Selecionar OAuth Client ID
2. **Authorized redirect URIs** → **Add URI:**
   - `https://quest4couple.pt/__/auth/handler`
   - `https://www.quest4couple.pt/__/auth/handler`

---

## 🧪 CHECKLIST DE TESTE

Depois do deploy, testa:

### Páginas Principais:
- [ ] Homepage (`https://quest4couple.pt`)
- [ ] Login (`/auth.html`)
- [ ] Dashboard (`/dashboard.html`)
- [ ] App (`/app.html`)
- [ ] Tutorial (`/tutorial.html`)
- [ ] Admin (`/pages/admin.html`)

### Funcionalidades:
- [ ] Login com Google funciona
- [ ] Criar conta funciona
- [ ] Responder questionários
- [ ] Guardar respostas (.q4c)
- [ ] Carregar respostas
- [ ] Comparar com parceiro
- [ ] Gerar PDF
- [ ] Enviar email
- [ ] Admin login (`carlos.sousacorreia` / `rzq7xgq8`)
- [ ] Analytics anónimo no admin

### Visual:
- [ ] Logo aparece
- [ ] CSS carrega corretamente
- [ ] Imagens dos packs aparecem
- [ ] Responsivo mobile
- [ ] Sem erros na consola (F12)

---

## 📊 ANALYTICS (OPCIONAL)

### Google Analytics 4:

1. Criar propriedade em: https://analytics.google.com/
2. Copiar Measurement ID (ex: `G-XXXXXXXXXX`)
3. Adicionar ao `index.html` (antes do `</head>`):

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

4. Fazer novo deploy com analytics

---

## 🔄 FAZER ATUALIZAÇÕES NO FUTURO

### Método Simples:

1. Fazer alterações localmente
2. Executar: `.\PREPARE_DEPLOY.ps1`
3. Criar novo ZIP
4. No Netlify: **Deploys** → Arrastar novo ZIP
5. Deploy automático!

### Método Profissional (Git):

1. Criar repositório GitHub
2. Push do código
3. Conectar Netlify ao GitHub
4. Deploy automático a cada commit!

```powershell
# Comandos Git
git init
git add .
git commit -m "Deploy inicial"
git remote add origin https://github.com/teu-user/quest4couple.git
git push -u origin main
```

---

## 🆘 TROUBLESHOOTING

### "Site não abre"
- **Solução:** Aguarda propagação DNS (até 24h)
- **Testa:** https://dnschecker.org/

### "Login Google não funciona"
- **Solução:** Verifica Firebase authorized domains
- **Verifica:** OAuth redirect URIs

### "CSS não carrega"
- **Solução:** Limpa cache (Ctrl+Shift+Del)
- **Testa:** Aba anônima/privada

### "tutorial.html vazio"
- **Solução:** Usa `tutorial_new.html` em vez de `tutorial.html`
- **OU:** Copia conteúdo de `tutorial_new.html` para `tutorial.html`

### "Páginas 404"
- **Solução:** Verifica se `netlify.toml` foi incluído
- **Verifica:** Redirect rules

---

## 📱 PARTILHAR

Quando estiver online, partilha:

🔗 **Link principal:** https://quest4couple.pt

📢 **Tagline:** "Quest4Couple - Descubram-se juntos 💕"

✨ **Features:**
- ✅ 100% Gratuito
- ✅ 5 packs completos de questionários
- ✅ Privacidade garantida
- ✅ Comparação de respostas do casal
- ✅ Gerar relatório PDF
- ✅ Sistema de matching inteligente

---

## 📖 DOCUMENTAÇÃO COMPLETA

- **Guia Completo:** `docs/DEPLOY_QUEST4COUPLE_PT.md`
- **Guia Rápido:** `DEPLOY_RAPIDO_5MIN.md`
- **Netlify Docs:** https://docs.netlify.com/
- **Firebase Docs:** https://firebase.google.com/docs

---

## 🎯 RESUMO DO QUE FAZER AGORA

```
1. [ ] Abrir https://app.netlify.com/drop
2. [ ] Arrastar quest4couple_deploy.zip
3. [ ] Testar site gerado
4. [ ] Configurar DNS no fornecedor de domínio
5. [ ] Aguardar propagação (1-2h)
6. [ ] Ativar HTTPS no Netlify
7. [ ] Adicionar domínio ao Firebase
8. [ ] Testar tudo
9. [ ] CELEBRAR! 🎉
```

---

## 💡 DICAS FINAIS

- **Backup:** Netlify guarda histórico (rollback fácil)
- **Monitora:** Netlify Analytics ($9/mês opcional)
- **SEO:** Adiciona Google Search Console
- **Performance:** Site já optimizado com cache headers
- **Segurança:** HTTPS + Security headers já configurados

---

## 🌟 BOA SORTE!

O **Quest4Couple** está pronto para bombar em **quest4couple.pt**! 🚀

Se precisares de ajuda, consulta a documentação ou contacta suporte do Netlify.

**Desenvolvido com ❤️ por Carlos Sousa Correia**  
**Data:** 19 de novembro de 2025  
**Versão:** Quest4Couple v2.0 Free

---

**💕 Que o site ajude muitos casais a descobrirem-se! 💕**
