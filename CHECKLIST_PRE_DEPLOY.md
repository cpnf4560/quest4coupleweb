# ✅ CHECKLIST PRÉ-DEPLOY - QUEST4COUPLE

## 📋 Verificações Obrigatórias Antes do Deploy

---

## 🔍 **1. ARQUIVOS ESSENCIAIS**

- [x] `index.html` - Página principal
- [x] `app.html` - Aplicação de questionários
- [x] `auth.html` - Sistema de autenticação
- [x] `dashboard.html` - Dashboard do usuário
- [x] `tutorial.html` - Tutorial
- [x] `support-banner.js` - Banner de apoio
- [x] `auth.js` - Autenticação local
- [x] `netlify.toml` - Config Netlify
- [x] `css/main.css` - Estilos principais
- [x] `css/themes.css` - Temas dos packs
- [x] `css/questions.css` - Estilos das questões
- [x] `js/firebase-config.js` - Config Firebase
- [x] `assets/logo.png` - Logo principal

---

## 🔧 **2. CONFIGURAÇÕES**

### Firebase (`js/firebase-config.js`)
```javascript
const firebaseConfig = {
  apiKey: "...",           // ✅ Verificar
  authDomain: "...",       // ✅ Verificar
  projectId: "...",        // ✅ Verificar
  storageBucket: "...",    // ✅ Verificar
  messagingSenderId: "...",// ✅ Verificar
  appId: "..."             // ✅ Verificar
};
```

**Ações:**
- [ ] Config Firebase está correta
- [ ] Domínio adicionado em Firebase Console → Authentication → Authorized domains
- [ ] Firestore configurado com regras corretas

### Support Banner (`support-banner.js`)
```javascript
config: {
    buyMeCoffeeUrl: 'https://buymeacoffee.com/quest4couple',
    feedbackFormUrl: '/pages/apoiar.html#feedback-form',
}
```

**Ações:**
- [x] URL Buy Me a Coffee está correta
- [x] URL feedback está correta
- [ ] Testar links após deploy

### Meta Tags Open Graph (`index.html`)
```html
<meta property="og:url" content="https://quest4couple.pt/">
<meta property="og:image" content="https://quest4couple.pt/assets/og-image.jpg">
```

**Ações:**
- [ ] Atualizar `og:url` com domínio real
- [ ] Atualizar `og:image` com domínio real
- [ ] Criar imagem `og-image.jpg` (1200x630px) OU usar logo
- [ ] Testar no Facebook Debugger após deploy

---

## 📁 **3. ESTRUTURA DE ARQUIVOS**

```
Quest4Couple_v2_free/
├── index.html              ✅
├── app.html                ✅
├── auth.html               ✅
├── dashboard.html          ✅
├── tutorial.html           ✅
├── support-banner.js       ✅
├── auth.js                 ✅
├── netlify.toml            ✅
├── assets/
│   ├── logo.png            ✅
│   └── og-image.jpg        ⚠️ (opcional)
├── css/
│   ├── main.css            ✅
│   ├── themes.css          ✅
│   └── questions.css       ✅
├── js/
│   └── firebase-config.js  ✅
└── pages/
    ├── apoiar.html         ✅
    ├── sobre.html          ✅
    ├── faq.html            ✅
    ├── privacidade.html    ✅
    └── termos.html         ✅
```

**Verificar:**
- [x] Todos os arquivos HTML existem
- [x] Todos os CSS existem
- [x] Logo existe
- [ ] OG image existe (criar se necessário)
- [x] Firebase config existe

---

## 🧪 **4. TESTES LOCAIS**

### Teste 1: Servidor Local
```powershell
http-server -p 8080
```
- [ ] Homepage carrega (http://localhost:8080)
- [ ] Logo aparece
- [ ] Support Banner renderiza
- [ ] Botões funcionam
- [ ] Console sem erros

### Teste 2: Autenticação
- [ ] Modal de login abre
- [ ] Modal de registro abre
- [ ] Firebase Auth conecta (ou fallback local funciona)

### Teste 3: App
- [ ] `app.html` carrega
- [ ] Questionários aparecem
- [ ] Botões Guardar/Carregar funcionam
- [ ] 6 botões aparecem em linha
- [ ] Fundo da barra é transparente

### Teste 4: Responsivo
- [ ] Mobile (360px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)

### Teste 5: Links
- [ ] Buy Me a Coffee abre
- [ ] Formulário feedback funciona
- [ ] Partilha WhatsApp funciona
- [ ] Partilha Facebook funciona
- [ ] Instagram mostra instruções

---

## 🌐 **5. OTIMIZAÇÕES**

### Imagens
- [ ] Logo comprimido (<100KB)
- [ ] OG image otimizada (<300KB)
- [ ] Usar TinyPNG: https://tinypng.com/

### Performance
- [ ] Remover console.logs desnecessários
- [ ] Minificar CSS (opcional)
- [ ] Minificar JS (opcional)

### SEO
- [x] Meta description em `index.html`
- [x] Meta keywords
- [x] Title otimizado
- [x] Alt text nas imagens

---

## 🔒 **6. SEGURANÇA**

### Headers (netlify.toml)
```toml
[headers.values]
  X-Frame-Options = "DENY"               ✅
  X-XSS-Protection = "1; mode=block"     ✅
  X-Content-Type-Options = "nosniff"     ✅
```

### Firebase Rules
```javascript
// Firestore Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Ações:**
- [ ] Verificar regras Firestore
- [ ] Apenas usuários autenticados podem escrever
- [ ] Leitura pública permitida (se necessário)

---

## 📤 **7. DEPLOY**

### Opção 1: Netlify Drop (Mais Rápido)
1. [ ] Acesse: https://app.netlify.com/drop
2. [ ] Faça login
3. [ ] Arraste pasta do projeto
4. [ ] Aguarde deploy (1-2 min)
5. [ ] Site online! 🎉

### Opção 2: Netlify via Git
1. [ ] Git init e commit
2. [ ] Push para GitHub
3. [ ] Conecte GitHub ao Netlify
4. [ ] Deploy automático

### Opção 3: Firebase Hosting
```powershell
firebase login
firebase deploy --only hosting
```

### Opção 4: Script Automatizado
```powershell
.\DEPLOY_SCRIPT.ps1
```

---

## ✅ **8. PÓS-DEPLOY**

### Testes no Site Online
- [ ] Homepage carrega
- [ ] HTTPS funcionando (cadeado verde)
- [ ] Logo aparece
- [ ] Firebase conecta
- [ ] Autenticação funciona
- [ ] Support Banner funciona
- [ ] Botões de partilha funcionam
- [ ] Mobile funciona

### Facebook Debugger
- [ ] Testar em: https://developers.facebook.com/tools/debug/
- [ ] Cola URL do site
- [ ] Verifica imagens Open Graph
- [ ] Clica em "Scrape Again" se necessário

### Google Search Console
1. [ ] Adicionar propriedade: https://search.google.com/search-console
2. [ ] Verificar propriedade
3. [ ] Submeter sitemap

### Analytics
- [ ] Google Analytics configurado
- [ ] Firebase Analytics ativo
- [ ] Eventos sendo rastreados

---

## 🎯 **9. DOMÍNIO PERSONALIZADO (OPCIONAL)**

### Se já tem `quest4couple.pt`:
1. [ ] Netlify → Domain settings → Add domain
2. [ ] Copiar Name Servers do Netlify
3. [ ] Atualizar DNS no registrador
4. [ ] Aguardar propagação (até 48h)
5. [ ] SSL automático ativo

### Se NÃO tem domínio:
- [ ] Usar subdomínio Netlify: `quest4couple.netlify.app`
- [ ] Ou comprar domínio (Namecheap, GoDaddy, etc.)

---

## 📊 **10. MONITORAMENTO**

### Ferramentas a Configurar:
- [ ] Google Analytics 4
- [ ] Firebase Analytics
- [ ] Hotjar (heatmaps - opcional)
- [ ] Sentry (erros - opcional)

### KPIs a Monitorar:
- [ ] Visitas/dia
- [ ] Taxa de conversão (cadastros)
- [ ] Questionários respondidos
- [ ] Cliques no Support Banner
- [ ] Doações Buy Me a Coffee

---

## 🚨 **ATENÇÃO FINAL**

### Antes de Publicar:
- [ ] Testar TUDO localmente primeiro
- [ ] Backup do código (Git)
- [ ] Firebase config correto
- [ ] URLs atualizadas
- [ ] Imagens otimizadas
- [ ] Console sem erros críticos

### Após Publicar:
- [ ] Testar site completo
- [ ] Verificar HTTPS
- [ ] Testar em mobile real
- [ ] Divulgar nas redes sociais

---

## 📞 **SUPORTE**

### Se algo der errado:
1. Verificar console do navegador (F12)
2. Verificar logs do Netlify/Firebase
3. Consultar documentação:
   - `DEPLOY_ONLINE_AGORA.md`
   - `GUIA_MANUTENCAO.md`

---

## ✅ **CHECKLIST RESUMIDO**

**Essencial antes de deploy:**
- [x] Todos os arquivos principais existem
- [x] CSS e JS carregam
- [x] Logo existe
- [ ] Firebase config correto
- [ ] Domínio autorizado no Firebase
- [ ] Testado localmente
- [x] Support Banner funciona
- [x] Botões otimizados
- [x] Responsivo mobile

**Bom ter:**
- [ ] OG image criada
- [ ] Imagens otimizadas
- [ ] Analytics configurado
- [ ] Domínio personalizado

**Após deploy:**
- [ ] Site testado online
- [ ] HTTPS ativo
- [ ] Facebook Debugger testado
- [ ] Mobile testado
- [ ] Divulgado!

---

**🎉 QUANDO TODOS OS ITENS ESTIVEREM ✅, VOCÊ ESTÁ PRONTO PARA DEPLOY!**

---

**Última atualização:** 19 de Novembro de 2025
