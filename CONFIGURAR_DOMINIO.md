# 🌐 CONFIGURAR DOMÍNIO quest4couple.pt

## Guia Completo - Passo a Passo

Data: 19 de novembro de 2025

---

## PARTE 1: DEPLOY NO NETLIFY (5 minutos)

### Opção A: Deploy via GitHub (Automático) ⭐ RECOMENDADO

1. **Aceder ao Netlify:**
   - Vai a: https://app.netlify.com/
   - Faz login com GitHub

2. **Criar novo site:**
   - Clica em **"Add new site"** → **"Import an existing project"**
   - Seleciona **"Deploy with GitHub"**
   - Autoriza o Netlify a aceder ao GitHub (se pedido)

3. **Selecionar repositório:**
   - Procura: `cpnf4560/quest4coupleweb`
   - Clica no repositório

4. **Configurar deploy:**
   ```
   Branch to deploy: main
   Build command: (deixa vazio)
   Publish directory: .
   ```
   - Clica em **"Deploy quest4coupleweb"**

5. **Aguardar deploy:**
   - O Netlify vai fazer build automático
   - Aguarda 2-3 minutos
   - Quando aparecer "Published", copia o URL gerado
   - Exemplo: `https://random-name-123.netlify.app`

6. **TESTAR o site:**
   - Abre o URL no navegador
   - Testa as páginas principais
   - Testa login (pode não funcionar ainda - normal!)

---

### Opção B: Deploy Manual (Drag & Drop)

Se preferires deploy manual:

1. **Vai a:** https://app.netlify.com/drop
2. **Arrasta** o ficheiro `quest4couple_deploy.zip`
3. **Aguarda** upload e deploy
4. **Copia** o URL gerado

---

## PARTE 2: CONFIGURAR DOMÍNIO NO NETLIFY (2 minutos)

### Passo 1: Adicionar domínio custom

1. **No site no Netlify:**
   - Clica no site que acabaste de criar
   - Vai a: **"Domain settings"** (ou "Set up a custom domain")
   - Clica em **"Add custom domain"** ou **"Add domain"**

2. **Adicionar domínio:**
   - Digita: `quest4couple.pt`
   - Clica em **"Verify"**
   - Netlify vai verificar se já tens o domínio
   - Clica em **"Add domain"** para confirmar

3. **Adicionar www (opcional mas recomendado):**
   - Ainda em "Domain settings"
   - Clica em **"Add domain alias"**
   - Digita: `www.quest4couple.pt`
   - Clica em **"Add domain"**

---

## PARTE 3: CONFIGURAR DNS (10 minutos + propagação)

### ⚠️ IMPORTANTE: Onde compraste o domínio?

O processo varia conforme o fornecedor. Opções comuns:
- GoDaddy
- Namecheap  
- Google Domains
- Hostinger
- OVH
- Outros

### Configuração DNS - OPÇÃO 1: Records A e CNAME

**No painel de controlo do teu fornecedor de domínio:**

1. **Vai para DNS Management / Gestão DNS**

2. **Adiciona Record A:**
   ```
   Type: A
   Name: @ (ou deixa vazio, ou quest4couple.pt)
   Value/Target: 75.2.60.5
   TTL: 3600 (ou Auto)
   ```

3. **Adiciona Record CNAME para www:**
   ```
   Type: CNAME
   Name: www
   Value/Target: [teu-site].netlify.app
   TTL: 3600 (ou Auto)
   ```
   
   ⚠️ **IMPORTANTE:** Substitui `[teu-site]` pelo nome do teu site no Netlify!  
   Exemplo: `random-name-123.netlify.app`

4. **Remove registos conflituantes:**
   - Se já existir um registro A para @ ou www, REMOVE ou EDITA
   - Se existir um registro CNAME para @, REMOVE (não pode ter A e CNAME ao mesmo tempo)

5. **Salva as alterações**

---

### Configuração DNS - OPÇÃO 2: Netlify Name Servers (Mais Simples)

Esta opção delega TODO o DNS ao Netlify:

**No Netlify:**
1. Domain settings → **"Use Netlify DNS"**
2. Copia os 4 name servers:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

**No teu fornecedor de domínio:**
1. Vai para **Name Servers / Servidores DNS**
2. Seleciona **"Custom Name Servers"**
3. Adiciona os 4 name servers do Netlify
4. **Salva**

⚠️ **ATENÇÃO:** Esta opção desativa TODOS os outros serviços DNS (email, subdomínios, etc.)

---

## PARTE 4: AGUARDAR PROPAGAÇÃO DNS (30 min - 24h)

### O que acontece agora?

- Os DNS servers precisam atualizar em todo o mundo
- Tempo normal: **1-2 horas**
- Tempo máximo: **24-48 horas**

### Como verificar a propagação?

**Ferramenta online:**
1. Vai a: https://dnschecker.org/
2. Digita: `quest4couple.pt`
3. Seleciona tipo: `A`
4. Clica em "Search"
5. Verifica se mostra o IP: `75.2.60.5` em várias localizações

**No terminal (Windows):**
```powershell
# Limpar cache DNS local
ipconfig /flushdns

# Verificar DNS
nslookup quest4couple.pt
```

Se mostrar `75.2.60.5` → DNS propagado! ✅

---

## PARTE 5: ATIVAR HTTPS (1 minuto)

**Depois do DNS propagar:**

1. **No Netlify → Domain settings → HTTPS**
2. Clica em **"Verify DNS configuration"**
   - Se aparecer erro, aguarda mais tempo (DNS ainda não propagou)
3. Clica em **"Provision certificate"**
4. Aguarda 1-2 minutos
5. Certificado SSL ativado! 🔒

**Configurações recomendadas:**
- ✅ Force HTTPS (redireciona http → https automaticamente)
- ✅ HSTS (segurança extra)

---

## PARTE 6: CONFIGURAR FIREBASE (MUITO IMPORTANTE!)

**Sem isto, o login NÃO vai funcionar!**

### 6.1 - Firebase Console

1. **Vai a:** https://console.firebase.google.com/
2. **Seleciona** o projeto Quest4Couple
3. **Authentication → Settings → Authorized domains**
4. **Clica** em "Add domain"
5. **Adiciona** os seguintes domínios (um de cada vez):
   ```
   quest4couple.pt
   www.quest4couple.pt
   [teu-site].netlify.app
   ```
6. **Salva**

### 6.2 - Google Cloud Console (OAuth)

1. **Vai a:** https://console.cloud.google.com/apis/credentials
2. **Seleciona** o projeto Quest4Couple
3. **Clica** no OAuth Client ID (Web client)
4. **Em "Authorized JavaScript origins"**, adiciona:
   ```
   https://quest4couple.pt
   https://www.quest4couple.pt
   https://[teu-site].netlify.app
   ```
5. **Em "Authorized redirect URIs"**, adiciona:
   ```
   https://quest4couple.pt/__/auth/handler
   https://www.quest4couple.pt/__/auth/handler
   https://[teu-site].netlify.app/__/auth/handler
   ```
6. **Salva**

---

## ✅ CHECKLIST FINAL

Depois de tudo configurado, testa:

- [ ] Site abre em `https://quest4couple.pt`
- [ ] Site abre em `https://www.quest4couple.pt`
- [ ] HTTPS ativo (cadeado verde no navegador)
- [ ] `www` redireciona para domínio principal (ou vice-versa)
- [ ] Todas as páginas funcionam
- [ ] CSS e imagens carregam
- [ ] Login com Google funciona ⭐
- [ ] Registo de utilizador funciona
- [ ] Podes responder questionários
- [ ] Admin funciona em `/pages/admin.html`

---

## 🆘 PROBLEMAS COMUNS

### "Site não abre após configurar DNS"
- **Solução:** Aguarda mais tempo (DNS pode demorar até 24h)
- Testa em: https://dnschecker.org/
- Limpa cache: `ipconfig /flushdns`
- Testa em navegação anónima

### "Certificado SSL inválido"
- **Solução:** Aguarda provisioning (pode demorar até 24h)
- Verifica se DNS está correto
- Force reprovision no Netlify

### "Login Google não funciona"
- **Solução:** Verifica Firebase Authorized domains
- Verifica OAuth redirect URIs no Google Cloud Console
- Aguarda 5-10 minutos após adicionar domínios

### "CSS/JS não carregam"
- **Solução:** Verifica paths relativos nos HTML
- Limpa cache do browser (Ctrl+Shift+Del)
- Verifica se ficheiros foram incluídos no deploy

### "404 nas páginas"
- **Solução:** Verifica `netlify.toml` na raiz do projeto
- Faz redeploy no Netlify

---

## 📞 ONDE COMPRASTE O DOMÍNIO?

**Diz-me onde compraste `quest4couple.pt` e posso dar instruções específicas para esse fornecedor!**

Exemplos:
- GoDaddy
- Namecheap
- Google Domains
- Hostinger
- OVH
- Outro?

---

## 🎉 PARABÉNS!

Quando tudo estiver configurado, o **Quest4Couple** estará online em:

### 🌐 https://quest4couple.pt

---

**Boa sorte! 🚀💕**

*Se precisares de ajuda específica para o teu fornecedor de domínio, diz-me qual é!*
