# 🌐 CONFIGURAR quest4couple.pt no dominios.pt

## Informação do Teu Setup

- **Fornecedor:** dominios.pt
- **Domínio:** quest4couple.pt
- **Site Netlify:** https://stellular-meringue-d4671d.netlify.app/
- **Data:** 19 de novembro de 2025

---

## 📋 PASSO A PASSO COMPLETO

### PARTE 1: ADICIONAR DOMÍNIO NO NETLIFY (2 minutos)

1. **Aceder ao Netlify:**
   - Vai a: https://app.netlify.com/sites/stellular-meringue-d4671d/
   - (ou clica no teu site no dashboard do Netlify)

2. **Ir para Domain settings:**
   - Clica em **"Domain settings"** no menu lateral
   - OU vai a: **Site settings → Domain management**

3. **Adicionar domínio custom:**
   - Clica em **"Add custom domain"** ou **"Add domain"**
   - Digita: `quest4couple.pt`
   - Clica em **"Verify"**
   - Clica em **"Add domain"** para confirmar
   - Netlify vai mostrar que o domínio ainda não está configurado (normal!)

4. **Adicionar www (recomendado):**
   - Clica em **"Add domain alias"**
   - Digita: `www.quest4couple.pt`
   - Clica em **"Add domain"**

✅ **Netlify configurado!** Agora vamos ao dominios.pt

---

### PARTE 2: CONFIGURAR DNS NO DOMINIOS.PT (5 minutos)

#### Passo 1: Aceder à Gestão DNS

1. **Login no dominios.pt:**
   - Vai a: https://www.dominios.pt/
   - Faz login na tua conta

2. **Ir para o domínio:**
   - No painel, procura **"Os meus domínios"** ou **"Gerir domínios"**
   - Clica em `quest4couple.pt`

3. **Abrir Gestão DNS:**
   - Procura por **"Gestão de DNS"** ou **"DNS Management"**
   - Ou **"Zona DNS"** ou **"Editar registos DNS"**
   - Clica para entrar

#### Passo 2: Configurar Registos DNS

⚠️ **IMPORTANTE:** Vais adicionar 2 registos (A e CNAME)

**Registro 1 - Record A (para quest4couple.pt):**

```
Tipo: A
Nome/Host: @ (ou deixa vazio, ou "quest4couple.pt")
Destino/Valor/IP: 75.2.60.5
TTL: 3600 (ou deixa o padrão)
```

**Registro 2 - Record CNAME (para www.quest4couple.pt):**

```
Tipo: CNAME
Nome/Host: www
Destino/Valor: stellular-meringue-d4671d.netlify.app
TTL: 3600 (ou deixa o padrão)
```

⚠️ **ATENÇÃO:** 
- NO CNAME, **NÃO adiciones `https://`** - só o nome: `stellular-meringue-d4671d.netlify.app`
- Alguns sistemas adicionam automaticamente um ponto no final (`.`) - é normal!

#### Passo 3: Remover Registos Conflituantes

**MUITO IMPORTANTE!** Se já existirem registos A ou CNAME para `@` ou `www`, precisas de:

1. **Apagar** os registos antigos, OU
2. **Editar** os registos existentes com os novos valores

❌ **Não pode ter:**
- Dois registos A para `@`
- CNAME e A ao mesmo tempo para `@`
- Dois CNAME para `www`

#### Passo 4: Salvar Alterações

1. Clica em **"Guardar"** ou **"Salvar alterações"**
2. Confirma se necessário
3. ✅ DNS configurado!

---

### PARTE 3: AGUARDAR PROPAGAÇÃO DNS (30 min - 2 horas)

#### O que acontece agora?

Os servidores DNS em todo o mundo precisam de atualizar. Isto demora:
- **Mínimo:** 5-10 minutos (raro)
- **Normal:** 30 minutos a 2 horas ⭐
- **Máximo:** 24-48 horas (muito raro)

#### Como verificar se propagou?

**Método 1 - Online (Recomendado):**

1. Vai a: https://dnschecker.org/
2. Digita: `quest4couple.pt`
3. Seleciona tipo: `A`
4. Clica em **"Search"**
5. **Verifica:** Se aparecer `75.2.60.5` em várias localizações → ✅ Propagado!

**Método 2 - Terminal Windows:**

```powershell
# Limpar cache DNS local primeiro
ipconfig /flushdns

# Verificar DNS
nslookup quest4couple.pt
```

**Resultado esperado:**
```
Server:  ...
Address: ...

Name:    quest4couple.pt
Address: 75.2.60.5
```

Se aparecer `75.2.60.5` → ✅ DNS propagado!

#### Enquanto aguardas...

☕ Vai beber um café, o DNS está a propagar...

Podes:
- Testar o site em: https://stellular-meringue-d4671d.netlify.app/
- Preparar o Firebase (Parte 5)
- Ler documentação
- Esperar 30-60 minutos

---

### PARTE 4: ATIVAR HTTPS NO NETLIFY (1 minuto)

⚠️ **SÓ PODES FAZER ISTO DEPOIS DO DNS PROPAGAR!**

1. **Volta ao Netlify:**
   - https://app.netlify.com/sites/stellular-meringue-d4671d/settings/domain

2. **Vai para HTTPS:**
   - No menu lateral: **"Domain management"**
   - Scroll down até **"HTTPS"**

3. **Verificar DNS:**
   - Clica em **"Verify DNS configuration"**
   - Se aparecer erro → DNS ainda não propagou, aguarda mais
   - Se aparecer sucesso → Continua!

4. **Provisionar certificado:**
   - Clica em **"Provision certificate"**
   - Aguarda 1-2 minutos
   - Vai aparecer: "Your site has HTTPS enabled" ✅

5. **Ativar Force HTTPS:**
   - Ativa a opção **"Force HTTPS"**
   - Isto redireciona automaticamente http → https

🔒 **HTTPS ativado!**

---

### PARTE 5: CONFIGURAR FIREBASE (CRÍTICO!)

**SEM ISTO O LOGIN NÃO VAI FUNCIONAR!**

#### 5.1 - Firebase Console (Authorized Domains)

1. **Vai a:** https://console.firebase.google.com/
2. **Seleciona** o projeto "Quest4Couple"
3. **Menu lateral:** Authentication
4. **Tab:** Settings (ou "Configurações")
5. **Scroll down:** Authorized domains (Domínios autorizados)
6. **Clica:** "Add domain" (Adicionar domínio)

**Adiciona estes 3 domínios (um de cada vez):**

```
quest4couple.pt
www.quest4couple.pt
stellular-meringue-d4671d.netlify.app
```

7. **Salva** cada um

#### 5.2 - Google Cloud Console (OAuth Credentials)

1. **Vai a:** https://console.cloud.google.com/apis/credentials
2. **Seleciona** o projeto "Quest4Couple" (se pedido)
3. **Procura:** OAuth 2.0 Client IDs
4. **Clica** no teu **"Web client"** (OAuth client ID)

**Na secção "Authorized JavaScript origins":**

Clica em **"ADD URI"** e adiciona (um de cada vez):

```
https://quest4couple.pt
https://www.quest4couple.pt
https://stellular-meringue-d4671d.netlify.app
```

**Na secção "Authorized redirect URIs":**

Clica em **"ADD URI"** e adiciona (um de cada vez):

```
https://quest4couple.pt/__/auth/handler
https://www.quest4couple.pt/__/auth/handler
https://stellular-meringue-d4671d.netlify.app/__/auth/handler
```

⚠️ **IMPORTANTE:** O caminho `/__/auth/handler` tem 2 barras antes de `auth`!

5. **Clica em "SAVE"** no fundo da página

✅ **Firebase configurado!**

---

### PARTE 6: TESTAR TUDO! (5 minutos)

#### Checklist de Testes:

**1. Acesso básico:**
- [ ] Abre: https://quest4couple.pt
- [ ] Site carrega? ✅
- [ ] HTTPS ativo (cadeado verde)? ✅
- [ ] Abre: https://www.quest4couple.pt
- [ ] Redireciona para quest4couple.pt? ✅

**2. Páginas funcionam:**
- [ ] Homepage carrega
- [ ] CSS e imagens aparecem
- [ ] Botões funcionam
- [ ] Menu funciona

**3. Autenticação (MAIS IMPORTANTE):**
- [ ] Clica em "Entrar" ou "Login"
- [ ] Página de login carrega
- [ ] Botão "Continuar com Google" aparece
- [ ] Clica no botão Google
- [ ] Popup do Google abre? ✅
- [ ] Consegues fazer login? ✅
- [ ] Redireciona para o site? ✅

**4. Funcionalidades:**
- [ ] Consegues ver os packs
- [ ] Consegues responder perguntas
- [ ] Guardar funciona
- [ ] Carregar funciona

**5. Admin:**
- [ ] Vai a: https://quest4couple.pt/pages/admin.html
- [ ] Login funciona?
  - Username: `carlos.sousacorreia`
  - Password: `rzq7xgq8`
- [ ] Dashboard carrega?
- [ ] Analytics aparecem?

---

## ✅ RESUMO FINAL

### DNS Records no dominios.pt:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | @ | 75.2.60.5 | 3600 |
| CNAME | www | stellular-meringue-d4671d.netlify.app | 3600 |

### URLs do Teu Site:

- **Produção:** https://quest4couple.pt ⭐
- **www:** https://www.quest4couple.pt (redireciona)
- **Netlify:** https://stellular-meringue-d4671d.netlify.app/ (backup)

### Firebase Domains:

- quest4couple.pt ✅
- www.quest4couple.pt ✅
- stellular-meringue-d4671d.netlify.app ✅

---

## 🆘 TROUBLESHOOTING

### "DNS não propaga"

**Causas comuns:**
1. Aguarda mais tempo (pode demorar 2-4 horas)
2. Verifica se salvaste as alterações no dominios.pt
3. Verifica se os registos estão corretos

**Como resolver:**
```powershell
# Limpar cache DNS
ipconfig /flushdns

# Verificar
nslookup quest4couple.pt

# Testar online
# https://dnschecker.org/
```

### "Site não abre"

1. Testa o site Netlify: https://stellular-meringue-d4671d.netlify.app/
   - Funciona? → Problema é DNS
   - Não funciona? → Problema é deploy

2. Limpa cache do browser (Ctrl+Shift+Del)
3. Testa em navegação anónima
4. Testa noutro dispositivo/rede

### "Login Google não funciona"

**Erro comum:** "redirect_uri_mismatch"

**Solução:**
1. Verifica Firebase Authorized domains
2. Verifica Google Cloud OAuth redirect URIs
3. Certificados que adicionaste `/__/auth/handler` (com 2 barras!)
4. Aguarda 5-10 minutos após adicionar domínios
5. Limpa cache do browser

### "Certificado SSL inválido"

1. Aguarda até 24h (provisioning pode demorar)
2. Verifica se DNS está correto (75.2.60.5)
3. No Netlify: Force reprovision do certificado
4. Testa em: https://www.ssllabs.com/ssltest/

---

## 📱 COMANDOS ÚTEIS

```powershell
# Limpar cache DNS
ipconfig /flushdns

# Verificar DNS
nslookup quest4couple.pt
nslookup www.quest4couple.pt

# Verificar se responde
ping quest4couple.pt

# Trace route
tracert quest4couple.pt
```

---

## 🎉 PARABÉNS!

Se tudo funcionou, o **Quest4Couple** está oficialmente ONLINE em:

# 🌐 https://quest4couple.pt

---

## 📞 SUPORTE

**Se tiveres problemas:**

1. **Verifica:** https://dnschecker.org/
2. **Testa:** Site Netlify direto
3. **Espera:** 1-2 horas para DNS propagar
4. **Limpa:** Cache do browser e DNS local
5. **Contacta:** dominios.pt support se DNS não funciona

---

**Boa sorte! 🚀💕**

*Qualquer problema, avisa!*
