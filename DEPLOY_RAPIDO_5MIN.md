# 🚀 GUIA RÁPIDO: Deploy em 5 Minutos

## Quest4Couple → quest4couple.pt

### 📋 Passo a Passo Simplificado

---

## 1. PREPARAR FICHEIROS (1 minuto)

```powershell
# Executar na pasta do projeto
.\PREPARE_DEPLOY.ps1
```

Responde `S` para criar ZIP.  
✅ Ficheiro `quest4couple_deploy.zip` criado!

---

## 2. FAZER UPLOAD NO NETLIFY (2 minutos)

1. **Abrir:** https://app.netlify.com/drop
2. **Login:** Usa GitHub ou Email
3. **Arrastar:** `quest4couple_deploy.zip` para a página
4. **Aguardar:** Upload + Deploy automático
5. **Copiar link:** Ex: `random-name-123.netlify.app`
6. **TESTAR:** Abre o link e testa o site

---

## 3. CONFIGURAR DOMÍNIO quest4couple.pt (2 minutos)

### No Netlify:

1. Clica no site recém-criado
2. **Domain settings** → **Add custom domain**
3. Digita: `quest4couple.pt`
4. Netlify mostra os DNS records necessários

### No teu fornecedor de domínio:

**Adicionar estes registos DNS:**

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | @ | 75.2.60.5 | 3600 |
| CNAME | www | [teu-site].netlify.app | 3600 |

**Aguardar:** 5 min a 2 horas (propagação DNS)

---

## 4. ATIVAR HTTPS (30 segundos)

No Netlify:
1. **HTTPS** tab
2. **Verify DNS configuration**
3. **Provision certificate**
4. Aguarda 1-2 minutos
5. ✅ HTTPS ativo!

---

## 5. CONFIGURAR FIREBASE (30 segundos)

1. **Firebase Console:** https://console.firebase.google.com/
2. **Authentication → Settings → Authorized domains**
3. **Adicionar:**
   - `quest4couple.pt`
   - `www.quest4couple.pt`

4. **Google Cloud Console:** https://console.cloud.google.com/apis/credentials
5. **OAuth Client ID → Authorized redirect URIs**
6. **Adicionar:**
   - `https://quest4couple.pt/__/auth/handler`
   - `https://www.quest4couple.pt/__/auth/handler`

---

## ✅ PRONTO!

🎉 **O site está ONLINE em https://quest4couple.pt** 🎉

---

## 🧪 CHECKLIST FINAL

- [ ] Site abre em https://quest4couple.pt
- [ ] HTTPS (cadeado verde) funciona
- [ ] Login com Google funciona
- [ ] Podes criar conta
- [ ] Podes responder questionários
- [ ] Admin funciona em /pages/admin.html

---

## 🔄 FAZER ATUALIZAÇÕES

### Método fácil:

1. Faz alterações localmente
2. Executa: `.\PREPARE_DEPLOY.ps1`
3. Cria novo ZIP
4. No Netlify: **Deploys → Drag and drop**
5. Arrasta novo ZIP
6. Deploy automático! ✨

### Método profissional (Git):

```powershell
git add .
git commit -m "Atualização"
git push
```

Netlify faz deploy automático!

---

## 🆘 PROBLEMAS?

**DNS não propaga:**
- Aguarda até 24h
- Testa: https://dnschecker.org/

**Login não funciona:**
- Verifica Firebase authorized domains
- Verifica OAuth redirect URIs

**CSS não carrega:**
- Limpa cache do browser (Ctrl+Shift+Del)
- Testa em aba anônima

---

## 📞 SUPORTE

- **Guia completo:** `docs/DEPLOY_QUEST4COUPLE_PT.md`
- **Netlify Docs:** https://docs.netlify.com/
- **Firebase Docs:** https://firebase.google.com/docs

---

**Boa sorte! 🚀💕**
