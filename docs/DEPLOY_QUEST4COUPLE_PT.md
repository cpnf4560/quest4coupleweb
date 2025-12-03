# 🚀 Deploy do Quest4Couple no quest4couple.pt

## 📋 Checklist Completo para Colocar o Site Online

Data: 19 de novembro de 2025  
Domínio: **quest4couple.pt**

---

## 1️⃣ ESCOLHER SERVIÇO DE HOSTING

### Opção A: **Netlify** (RECOMENDADO - Grátis e Fácil) ⭐

**Vantagens:**
- ✅ **100% GRATUITO** para projetos estáticos
- ✅ Deploy automático via Git
- ✅ HTTPS grátis
- ✅ CDN global
- ✅ Configuração de domínio super fácil
- ✅ Suporta Firebase (já tens configurado)

**Passos:**

1. **Criar conta no Netlify**
   - Vai a: https://www.netlify.com/
   - Clica em "Sign up" → Usa GitHub/GitLab ou Email

2. **Fazer Deploy**
   - Opção 1: **Arrastar e Largar** (Mais Rápido)
     - Compacta a pasta do projeto em ZIP (EXCLUINDO `node_modules`, `docs/`, `tests/`)
     - Vai a https://app.netlify.com/drop
     - Arrasta o ZIP para a página
     - DONE! ✅

   - Opção 2: **Via GitHub** (Mais Profissional)
     - Cria repositório no GitHub
     - Faz push do código
     - No Netlify: "New site from Git" → Conecta GitHub
     - Seleciona o repositório
     - Deploy settings:
       ```
       Build command: (deixa vazio)
       Publish directory: .
       ```
     - Clica em "Deploy site"

3. **Configurar Domínio quest4couple.pt**
   - No Netlify, vai a: **Site settings → Domain management**
   - Clica em "Add custom domain"
   - Digita: `quest4couple.pt`
   - Netlify vai dar-te DNS records para configurar

4. **Configurar DNS (onde compraste o domínio)**
   
   No teu fornecedor de domínio (ex: GoDaddy, Namecheap, etc):
   
   **A Records:**
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   TTL: 3600
   ```
   
   **CNAME Record (para www):**
   ```
   Type: CNAME
   Name: www
   Value: <teu-site>.netlify.app
   TTL: 3600
   ```
   
   **Aguardar propagação DNS:** 5 minutos a 24 horas (normalmente 1-2 horas)

5. **Ativar HTTPS**
   - No Netlify: **Domain settings → HTTPS**
   - Clica em "Verify DNS configuration"
   - Clica em "Provision certificate"
   - Aguarda 1-2 minutos
   - HTTPS ativado! 🔒

---

### Opção B: **Vercel** (Alternativa Excelente)

**Vantagens:**
- ✅ Grátis
- ✅ Muito rápido
- ✅ Integração Git
- ✅ Edge Network

**Passos:**
1. Vai a: https://vercel.com/
2. "Sign up" com GitHub
3. "New Project" → Importa repositório
4. Deploy automático
5. Configurar domínio custom nos settings

---

### Opção C: **GitHub Pages** (Mais Simples, mas Limitado)

**Vantagens:**
- ✅ Grátis
- ✅ Integrado com GitHub

**Limitações:**
- ⚠️ Configuração de domínio custom mais complexa
- ⚠️ Menos features que Netlify/Vercel

**Passos:**
1. Cria repositório GitHub
2. Vai a: **Settings → Pages**
3. Source: "Deploy from branch"
4. Branch: `main` / Folder: `/ (root)`
5. Configurar custom domain: `quest4couple.pt`

---

## 2️⃣ PREPARAR O PROJETO PARA DEPLOY

### Ficheiros a Incluir:
```
✅ index.html
✅ app.html
✅ auth.html
✅ dashboard.html
✅ tutorial.html
✅ css/ (toda a pasta)
✅ js/ (toda a pasta)
✅ assets/ (toda a pasta)
✅ data/ (toda a pasta)
✅ pages/ (toda a pasta)
✅ favicon.ico, favicon-*.png, apple-touch-icon.png
```

### Ficheiros a EXCLUIR:
```
❌ docs/ (documentação - não é necessária online)
❌ tests/ (testes - não é necessária online)
❌ node_modules/ (se existir)
❌ .git/ (será criado automaticamente no deploy)
❌ old_files/
❌ *.md (ficheiros markdown)
❌ START_SERVER.bat
```

---

## 3️⃣ CONFIGURAÇÃO FIREBASE

### Atualizar domínio autorizado no Firebase:

1. Vai a: https://console.firebase.google.com/
2. Seleciona o projeto **Quest4Couple**
3. Vai a: **Authentication → Settings → Authorized domains**
4. Adiciona:
   - `quest4couple.pt`
   - `www.quest4couple.pt`
   - `<teu-site>.netlify.app` (temporário para testes)

5. **OAuth Redirect URIs (Google Sign-In):**
   - Vai a: https://console.cloud.google.com/apis/credentials
   - Seleciona teu OAuth Client ID
   - Adiciona aos "Authorized redirect URIs":
     ```
     https://quest4couple.pt/__/auth/handler
     https://www.quest4couple.pt/__/auth/handler
     ```

---

## 4️⃣ CRIAR FICHEIRO netlify.toml (RECOMENDADO)

Cria este ficheiro na raiz do projeto:

```toml
# netlify.toml
[build]
  publish = "."
  
[[redirects]]
  from = "/pages/*"
  to = "/pages/:splat"
  status = 200
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 5️⃣ TESTAR ANTES DO DEPLOY

### Checklist de Verificação:

- [ ] Todos os links funcionam (páginas, CSS, JS)
- [ ] Imagens aparecem corretamente
- [ ] Firebase está configurado
- [ ] Login com Google funciona
- [ ] Sistema de respostas funciona
- [ ] Guardar/Carregar respostas funciona
- [ ] Comparação funciona
- [ ] Admin login funciona (`pages/admin.html`)
- [ ] Verificação de idade funciona
- [ ] Mobile responsivo

### Testar localmente antes do deploy:
```powershell
# Na pasta do projeto
python -m http.server 8080
# OU
php -S localhost:8080
```

Abre: `http://localhost:8080`

---

## 6️⃣ DEPLOY PASSO A PASSO (NETLIFY)

### Método 1: Drag & Drop (5 minutos)

1. **Preparar ficheiros:**
   ```powershell
   # Criar pasta temporária limpa
   New-Item -ItemType Directory -Force -Path "deploy_temp"
   
   # Copiar ficheiros essenciais
   Copy-Item -Path "*.html" -Destination "deploy_temp\"
   Copy-Item -Path "css" -Destination "deploy_temp\" -Recurse
   Copy-Item -Path "js" -Destination "deploy_temp\" -Recurse
   Copy-Item -Path "assets" -Destination "deploy_temp\" -Recurse
   Copy-Item -Path "data" -Destination "deploy_temp\" -Recurse
   Copy-Item -Path "pages" -Destination "deploy_temp\" -Recurse
   Copy-Item -Path "favicon*" -Destination "deploy_temp\"
   Copy-Item -Path "apple-touch-icon.png" -Destination "deploy_temp\"
   
   # Compactar
   Compress-Archive -Path "deploy_temp\*" -DestinationPath "quest4couple_deploy.zip"
   ```

2. **Upload:**
   - Vai a: https://app.netlify.com/drop
   - Arrasta `quest4couple_deploy.zip`
   - Aguarda upload e deploy
   - Copia o link gerado (ex: `random-name-123.netlify.app`)

3. **Testar:**
   - Abre o link no navegador
   - Testa todas as funcionalidades
   - Se tudo OK → Configurar domínio custom

4. **Configurar domínio:**
   - No site no Netlify: **Domain settings**
   - "Add custom domain" → `quest4couple.pt`
   - Segue instruções DNS
   - Aguarda propagação

5. **Ativar HTTPS:**
   - "HTTPS" → "Verify DNS" → "Provision certificate"
   - PRONTO! 🎉

---

## 7️⃣ CONFIGURAÇÃO DNS DETALHADA

### No teu fornecedor de domínio (onde compraste quest4couple.pt):

**Registros DNS necessários:**

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | @ | 75.2.60.5 | 3600 |
| CNAME | www | <teu-site>.netlify.app | 3600 |

**Netlify Name Servers (alternativa):**

Se quiseres usar os name servers do Netlify:
```
dns1.p01.nsone.net
dns2.p01.nsone.net
dns3.p01.nsone.net
dns4.p01.nsone.net
```

---

## 8️⃣ PÓS-DEPLOY

### Verificações Finais:

1. **Testar URLs:**
   - https://quest4couple.pt ✅
   - https://www.quest4couple.pt ✅
   - https://quest4couple.pt/auth.html ✅
   - https://quest4couple.pt/app.html ✅
   - https://quest4couple.pt/pages/admin.html ✅

2. **Testar Funcionalidades:**
   - [ ] Login com Google
   - [ ] Registo de utilizador
   - [ ] Responder questionários
   - [ ] Guardar respostas
   - [ ] Carregar respostas
   - [ ] Comparar com parceiro
   - [ ] Gerar PDF
   - [ ] Admin login
   - [ ] Analytics anónimo

3. **Performance:**
   - Testa velocidade em: https://pagespeed.web.dev/
   - Testa mobile em: https://search.google.com/test/mobile-friendly

4. **SEO:**
   - Adiciona Google Search Console
   - Adiciona Google Analytics (opcional)
   - Cria sitemap.xml

---

## 9️⃣ MANUTENÇÃO E ATUALIZAÇÕES

### Fazer atualizações:

**Com Netlify Drag & Drop:**
1. Faz alterações localmente
2. Testa localmente
3. Cria novo ZIP
4. Arrasta para Netlify (substitui automaticamente)

**Com Git + Netlify:**
1. Faz alterações localmente
2. Commit e push para GitHub
3. Deploy automático no Netlify! ✨

---

## 🔟 BACKUP E SEGURANÇA

### Backups Automáticos:

- ✅ Netlify guarda histórico de deploys (rollback fácil)
- ✅ Git/GitHub guarda todo o código
- ✅ Firebase guarda dados de users automaticamente

### Segurança:

- ✅ HTTPS obrigatório (Netlify force HTTPS)
- ✅ Headers de segurança (via netlify.toml)
- ✅ Firebase rules configuradas
- ✅ Admin password hasheado (SHA-256)

---

## 📊 MONITORIZAÇÃO

### Analytics gratuitos:

1. **Google Analytics 4:**
   - Cria propriedade em: https://analytics.google.com/
   - Adiciona código ao `index.html`:
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

2. **Netlify Analytics:**
   - Pago ($9/mês) mas mais preciso
   - Não usa cookies

---

## ✅ RESUMO RÁPIDO

### Deploy em 10 minutos:

1. ✅ Regista-te no Netlify
2. ✅ Compacta projeto (exclui docs/tests)
3. ✅ Arrasta ZIP para app.netlify.com/drop
4. ✅ Testa o site gerado
5. ✅ Adiciona domínio custom: quest4couple.pt
6. ✅ Configura DNS no teu fornecedor
7. ✅ Aguarda propagação (1-2h)
8. ✅ Ativa HTTPS no Netlify
9. ✅ Adiciona domínio ao Firebase
10. ✅ ONLINE! 🚀

---

## 🆘 TROUBLESHOOTING

### Problemas comuns:

**1. "Site não abre após configurar DNS"**
- Aguarda propagação DNS (até 24h)
- Testa: https://dnschecker.org/
- Limpa cache DNS: `ipconfig /flushdns`

**2. "Login Google não funciona"**
- Verifica domínio em Firebase Authorized domains
- Verifica OAuth redirect URIs no Google Cloud Console

**3. "CSS/JS não carregam"**
- Verifica paths relativos nos HTML
- Verifica se ficheiros foram incluídos no deploy

**4. "Certificado HTTPS erro"**
- Aguarda provisioning no Netlify (pode demorar até 24h)
- Verifica se DNS está correto

**5. "Admin page 404"**
- Verifica se `pages/admin.html` foi incluído
- Verifica redirect rules no netlify.toml

---

## 📞 SUPORTE

### Recursos úteis:

- **Netlify Docs:** https://docs.netlify.com/
- **Netlify Community:** https://answers.netlify.com/
- **Firebase Docs:** https://firebase.google.com/docs
- **DNS Checker:** https://dnschecker.org/

---

## 🎉 PARABÉNS!

Se chegaste aqui e seguiste todos os passos, o **Quest4Couple** está ONLINE em **quest4couple.pt**! 🚀

**Próximos passos:**
- Partilha com amigos para testar
- Recolhe feedback
- Faz melhorias incrementais
- Adiciona mais features
- Promove o site! 💕

---

**Desenvolvido com ❤️ por Carlos Sousa Correia**  
**Data:** 19 de novembro de 2025  
**Versão:** Quest4Couple v2.0 Free

