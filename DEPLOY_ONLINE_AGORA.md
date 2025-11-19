# 🚀 DEPLOY ONLINE - QUEST4COUPLE

## 📅 Data: 19 de Novembro de 2025

---

## ✅ **PROJETO PRONTO PARA DEPLOY**

Todas as funcionalidades foram implementadas e testadas:
- ✅ Cabeçalhos limpos e bonitos
- ✅ Support Banner funcional
- ✅ Botões otimizados (6 em linha)
- ✅ Meta Tags Open Graph
- ✅ Ícones de partilha atualizados
- ✅ Responsivo mobile/tablet/desktop
- ✅ Firebase configurado

---

## 🌐 **OPÇÕES DE HOSPEDAGEM (GRATUITAS)**

### **1️⃣ NETLIFY (RECOMENDADO) ⭐**

**Vantagens:**
- ✅ Deploy automático via Git
- ✅ HTTPS gratuito
- ✅ CDN global
- ✅ Domínio gratuito (.netlify.app)
- ✅ Suporta SPAs
- ✅ 100GB/mês grátis

**Passos:**

#### **A. Via GitHub (Mais Fácil)**

1. **Criar repositório GitHub**
```powershell
cd "g:\O meu disco\Formação JAVA - Projetos\Quest4Couple_v2_free"
git init
git add .
git commit -m "Deploy Quest4Couple v2"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/quest4couple.git
git push -u origin main
```

2. **Deploy no Netlify**
   - Acesse: https://app.netlify.com/
   - Clique em "Add new site" → "Import an existing project"
   - Conecte seu GitHub
   - Selecione o repositório `quest4couple`
   - Configure:
     - **Build command:** (deixar vazio)
     - **Publish directory:** `.` (raiz)
   - Clique em "Deploy site"

3. **Configurar domínio personalizado (opcional)**
   - Em "Domain settings" → "Add custom domain"
   - Ex: `quest4couple.pt`

#### **B. Via Netlify Drop (Ultra Rápido)**

1. Acesse: https://app.netlify.com/drop
2. Arraste a pasta do projeto
3. Deploy instantâneo!

---

### **2️⃣ VERCEL**

**Vantagens:**
- ✅ Deploy super rápido
- ✅ HTTPS gratuito
- ✅ Otimizado para Next.js (mas aceita HTML)
- ✅ Domínio gratuito (.vercel.app)

**Passos:**

1. **Instalar Vercel CLI**
```powershell
npm install -g vercel
```

2. **Deploy**
```powershell
cd "g:\O meu disco\Formação JAVA - Projetos\Quest4Couple_v2_free"
vercel
```

3. **Seguir instruções no terminal**
   - Login com GitHub
   - Confirmar projeto
   - Deploy automático

---

### **3️⃣ GITHUB PAGES**

**Vantagens:**
- ✅ 100% gratuito
- ✅ Integrado com GitHub
- ✅ Domínio: `usuario.github.io/quest4couple`

**Limitações:**
- ⚠️ Apenas sites estáticos
- ⚠️ Sem backend (mas Firebase resolve)

**Passos:**

1. **Criar repositório `quest4couple`**
   - GitHub → New Repository
   - Nome: `quest4couple`
   - Public

2. **Push do código**
```powershell
cd "g:\O meu disco\Formação JAVA - Projetos\Quest4Couple_v2_free"
git init
git add .
git commit -m "Deploy Quest4Couple"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/quest4couple.git
git push -u origin main
```

3. **Ativar GitHub Pages**
   - Repositório → Settings → Pages
   - Source: `main` branch
   - Folder: `/ (root)`
   - Save

4. **Site disponível em:**
   - `https://SEU_USUARIO.github.io/quest4couple/`

---

### **4️⃣ FIREBASE HOSTING**

**Vantagens:**
- ✅ Integrado com Firebase (já usa)
- ✅ HTTPS gratuito
- ✅ CDN global do Google
- ✅ SSL automático

**Passos:**

1. **Instalar Firebase CLI**
```powershell
npm install -g firebase-tools
```

2. **Login no Firebase**
```powershell
firebase login
```

3. **Inicializar projeto**
```powershell
cd "g:\O meu disco\Formação JAVA - Projetos\Quest4Couple_v2_free"
firebase init hosting
```

Configurar:
- **Project:** Selecionar projeto Firebase existente
- **Public directory:** `.` (raiz)
- **Single-page app:** `Yes`
- **Overwrite index.html:** `No`

4. **Deploy**
```powershell
firebase deploy --only hosting
```

5. **Site disponível em:**
   - `https://SEU_PROJETO.web.app`
   - `https://SEU_PROJETO.firebaseapp.com`

---

## 🔧 **PRÉ-DEPLOY: CHECKLIST FINAL**

### **1. Atualizar URLs no código**

Procure e substitua URLs locais por URLs de produção:

```javascript
// support-banner.js
config: {
    buyMeCoffeeUrl: 'https://buymeacoffee.com/quest4couple',
    feedbackFormUrl: 'https://quest4couple.pt/pages/apoiar.html#feedback-form', // Atualizar domínio
}

// Meta tags Open Graph (index.html)
<meta property="og:url" content="https://quest4couple.pt/"> // Atualizar domínio
<meta property="og:image" content="https://quest4couple.pt/assets/og-image.jpg">
```

### **2. Verificar Firebase Config**

Arquivo: `js/firebase-config.js`

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  // ... resto da config
};
```

### **3. Criar .gitignore (se usar Git)**

Criar arquivo `.gitignore`:
```
node_modules/
.env
.DS_Store
*.log
.vscode/
.idea/
```

### **4. Testar localmente antes**

```powershell
# Instalar servidor HTTP simples
npm install -g http-server

# Rodar localmente
cd "g:\O meu disco\Formação JAVA - Projetos\Quest4Couple_v2_free"
http-server -p 8080
```

Acessar: http://localhost:8080

---

## 📝 **PASSOS RECOMENDADOS (NETLIFY)**

### **Opção Rápida: Netlify Drop**

1. ✅ Acesse: https://app.netlify.com/drop
2. ✅ Faça login (GitHub recomendado)
3. ✅ Arraste a pasta `Quest4Couple_v2_free`
4. ✅ Aguarde deploy (1-2 minutos)
5. ✅ Site online! 🎉

**Resultado:**
- URL: `https://random-name-123.netlify.app`
- Pode renomear em: Site settings → Change site name

---

## 🌍 **CONFIGURAR DOMÍNIO PERSONALIZADO**

### **quest4couple.pt (Se já tem o domínio)**

#### **1. Comprar domínio (se não tem)**
- **Recomendado:** Namecheap, GoDaddy, ou Cloudflare
- Preço: ~10€/ano

#### **2. Configurar DNS no Netlify**

1. Netlify → Domain settings → Add custom domain
2. Digite: `quest4couple.pt`
3. Netlify fornece DNS servers:
   ```
   dns1.p01.nsone.net
   dns2.p01.nsone.net
   dns3.p01.nsone.net
   dns4.p01.nsone.net
   ```

4. No seu registrador de domínios:
   - Vá em DNS settings
   - Substitua Name Servers pelos do Netlify
   - Aguarde propagação (até 48h, geralmente 1h)

5. SSL automático ativado! ✅

---

## 🔒 **SEGURANÇA E OTIMIZAÇÃO**

### **1. Configurar Headers de Segurança**

Criar arquivo `netlify.toml` na raiz:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

### **2. Configurar Redirects**

No mesmo `netlify.toml`:

```toml
[[redirects]]
  from = "/auth"
  to = "/auth.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 404
```

### **3. Otimizar Imagens**

Antes do deploy:
- Comprimir imagens: https://tinypng.com/
- Logo: PNG otimizado <100KB
- OG Image: JPG 1200x630px <300KB

---

## 📊 **ANALYTICS (APÓS DEPLOY)**

### **Google Analytics 4**

1. Criar propriedade em: https://analytics.google.com/
2. Copiar Measurement ID: `G-XXXXXXXXXX`
3. Adicionar no `<head>` de todas as páginas:

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

---

## 🧪 **TESTAR APÓS DEPLOY**

### **Checklist de Testes:**

- [ ] Homepage carrega corretamente
- [ ] Logo aparece
- [ ] Support Banner renderiza
- [ ] Botões de autenticação funcionam
- [ ] Modal de login/registro abre
- [ ] Firebase Auth funciona
- [ ] App.html carrega questionários
- [ ] Botões de save/load funcionam
- [ ] Partilha social funciona
- [ ] Meta tags OG funcionam (testar no Facebook Debugger)
- [ ] Responsivo mobile funciona
- [ ] HTTPS ativo (cadeado verde)

### **Ferramentas de Teste:**

1. **Facebook Debugger**
   - https://developers.facebook.com/tools/debug/
   - Cola URL do site
   - Verifica imagens Open Graph

2. **Google PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Testa performance

3. **W3C Validator**
   - https://validator.w3.org/
   - Valida HTML

---

## 🚀 **DEPLOY EM 5 MINUTOS - RESUMO**

### **Método Mais Rápido: Netlify Drop**

```bash
1. Acesse: https://app.netlify.com/drop
2. Login com GitHub
3. Arraste pasta Quest4Couple_v2_free
4. Aguarde 1-2 minutos
5. PRONTO! Site online 🎉
```

**URL gerada:**
- `https://quest4couple-v2.netlify.app`

**Pode customizar:**
- Site settings → Change site name → `quest4couple`
- Nova URL: `https://quest4couple.netlify.app`

---

## 📞 **SUPORTE PÓS-DEPLOY**

### **Problemas Comuns:**

#### **1. Firebase não conecta**
- Verificar `firebase-config.js`
- Adicionar domínio em Firebase Console → Authentication → Authorized domains

#### **2. 404 em páginas**
- Configurar redirects no `netlify.toml`
- Garantir que `index.html` está na raiz

#### **3. HTTPS não funciona**
- Aguardar certificado SSL (até 1h)
- Verificar DNS configurado corretamente

#### **4. Imagens não carregam**
- Verificar caminhos relativos (`./assets/logo.png`)
- Garantir que pasta `assets/` foi enviada

---

## 🎯 **PRÓXIMOS PASSOS APÓS DEPLOY**

1. **Monitorar Analytics**
   - Google Analytics
   - Firebase Analytics

2. **Divulgar**
   - Redes sociais
   - Fóruns de casais
   - Reddit (r/sex, r/relationships)

3. **Coletar Feedback**
   - Formulário funcionando
   - E-mail de suporte

4. **Iterar**
   - Melhorias baseadas em feedback
   - Novos packs de perguntas
   - Features premium (futuro)

---

## 💰 **MONETIZAÇÃO (FUTURO)**

### **Opções:**

1. **Buy Me a Coffee** (já implementado)
   - Link: https://buymeacoffee.com/quest4couple

2. **Packs Premium**
   - Stripe para pagamentos
   - Packs exclusivos

3. **Ads (Google AdSense)**
   - Se tráfego >1000 visitas/dia

---

**🎉 QUEST4COUPLE PRONTO PARA O MUNDO!**

Escolha uma opção de deploy acima e siga online em minutos! 🚀

---

**Desenvolvido com ❤️ para ajudar casais a se conectarem melhor.**
