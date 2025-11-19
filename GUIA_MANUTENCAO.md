# 🔧 GUIA DE MANUTENÇÃO - QUEST4COUPLE V2

## 📋 Índice
1. [Atualizar Support Banner](#atualizar-support-banner)
2. [Modificar Cores e Estilos](#modificar-cores-e-estilos)
3. [Adicionar Novas Páginas](#adicionar-novas-páginas)
4. [Atualizar Ícones de Partilha](#atualizar-ícones-de-partilha)
5. [Criar Imagem Open Graph](#criar-imagem-open-graph)
6. [Troubleshooting](#troubleshooting)

---

## 1️⃣ ATUALIZAR SUPPORT BANNER

### 📍 Localização: `support-banner.js`

### Alterar URLs:

```javascript
config: {
    buyMeCoffeeUrl: 'https://buymeacoffee.com/quest4couple',  // ← Mudar aqui
    feedbackFormUrl: '/pages/apoiar.html#feedback-form',       // ← Mudar aqui
    shareUrls: {
        whatsapp: 'whatsapp://send?text=',
        facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
        instagram: 'https://www.instagram.com/'
    }
}
```

### Alterar Textos:

```javascript
render(elementId, compact = false) {
    const content = compact ? `
        // Versão COMPACTA
        <p class="support-message">
            Gostou? <a href="${this.config.buyMeCoffeeUrl}">☕ Apoie</a>
        </p>
    ` : `
        // Versão COMPLETA
        <h3 class="support-title">❤️ Apoie o Quest4Couple</h3>
        <p class="support-subtitle">
            Se gostou, ajude-nos a manter o projeto:  // ← Editar texto aqui
        </p>
    `;
}
```

### Alterar Cores dos Cards:

```javascript
const styles = `
    .support-donate {
        background: linear-gradient(135deg, #ff7043, #ff8a65);  // Laranja
    }
    .support-feedback {
        background: linear-gradient(135deg, #ab47bc, #ba68c8);  // Roxo
    }
    .support-share {
        background: linear-gradient(135deg, #66bb6a, #81c784);  // Verde
    }
`;
```

---

## 2️⃣ MODIFICAR CORES E ESTILOS

### 📍 Localização: `index.html` (dentro da tag `<style>`)

### Mudar Gradiente Principal:

```css
/* Procure por: */
background: linear-gradient(135deg, #d63384, #6f42c1);

/* Substitua pelas novas cores: */
background: linear-gradient(135deg, #NOVA_COR_1, #NOVA_COR_2);
```

### Mudar Cor do Header:

```css
.header {
    background: rgba(255, 255, 255, 0.98);  /* ← Mudar aqui */
    backdrop-filter: blur(15px);             /* ← Intensidade do blur */
}
```

### Mudar Tamanho do Logo:

```css
.hero-logo img {
    height: 160px;  /* ← Desktop: mudar aqui */
}

@media (max-width: 768px) {
    .hero-logo img {
        height: 120px;  /* ← Mobile: mudar aqui */
    }
}
```

---

## 3️⃣ ADICIONAR NOVAS PÁGINAS

### Passo 1: Criar o arquivo HTML

```html
<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Nova Página - Quest4Couple</title>
    <link rel="stylesheet" href="../css/main.css">
</head>
<body>
    <!-- Conteúdo aqui -->
    
    <!-- Support Banner -->
    <div id="supportBanner"></div>
    
    <script src="../support-banner.js"></script>
    <script>
        if (typeof SupportBanner !== 'undefined') {
            SupportBanner.render('supportBanner', false);  // false = versão completa
        }
    </script>
</body>
</html>
```

### Passo 2: Adicionar ao Footer

```html
<!-- Em index.html, app.html, etc. -->
<footer>
    <div>
        <a href="pages/sobre.html">Sobre</a>
        <a href="pages/nova-pagina.html">Nova Página</a>  ← Adicionar aqui
        <a href="pages/apoiar.html">Apoiar</a>
    </div>
</footer>
```

---

## 4️⃣ ATUALIZAR ÍCONES DE PARTILHA

### 📍 Localização: `support-banner.js` → método `share()`

### Adicionar Nova Rede Social:

```javascript
share(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Descubra o Quest4Couple! 💑');
    
    switch(platform) {
        // ...casos existentes...
        
        case 'twitter':  // ← NOVO
            window.open(
                `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
                '_blank',
                'width=600,height=400'
            );
            break;
    }
}
```

### Adicionar Botão de Partilha:

```javascript
// No método render(), adicione:
<button class="share-btn twitter-btn" onclick="SupportBanner.share('twitter')">
    <svg width="40" height="40">
        <!-- SVG do Twitter aqui -->
    </svg>
</button>
```

### Estilizar Novo Botão:

```css
.twitter-btn svg {
    fill: #1DA1F2;  /* Azul do Twitter */
}
```

---

## 5️⃣ CRIAR IMAGEM OPEN GRAPH

### Especificações:
- **Dimensões:** 1200x630px
- **Formato:** JPG ou PNG
- **Tamanho máximo:** <500KB
- **Localização:** `/assets/og-image.jpg`

### Design Recomendado:

```
┌─────────────────────────────────────────┐
│                                         │
│         [Logo Quest4Couple]             │
│              (grande)                   │
│                                         │
│   Quest4Couple - Descubram-se melhor    │
│                                         │
│  Explorem desejos, fantasias e          │
│  afinidades como casal 💑               │
│                                         │
│        100% Gratuito • Privado          │
│                                         │
└─────────────────────────────────────────┘
   Fundo: Gradiente rosa/roxo suave
```

### Ferramentas Recomendadas:
- **Canva:** canva.com (templates prontos)
- **Figma:** figma.com (design profissional)
- **Photopea:** photopea.com (alternativa gratuita ao Photoshop)

### Após Criar:
1. Salvar como `og-image.jpg` em `/assets/`
2. Otimizar com TinyPNG: tinypng.com
3. Testar com Facebook Debugger: developers.facebook.com/tools/debug/

---

## 6️⃣ TROUBLESHOOTING

### ❌ Support Banner não aparece

**Causa:** Script não carregado ou ID errado

**Solução:**
```html
<!-- Verificar se tem: -->
<div id="supportBanner"></div>  ← ID correto
<script src="support-banner.js"></script>  ← Caminho correto
<script>
    SupportBanner.render('supportBanner', false);  ← Chamada correta
</script>
```

---

### ❌ Logo não aparece

**Causa:** Caminho do arquivo incorreto

**Solução:**
```html
<!-- Verificar caminho relativo: -->
<img src="./assets/logo.png">          ← Raiz do projeto
<img src="../assets/logo.png">         ← Uma pasta acima
<img src="/assets/logo.png">           ← Caminho absoluto
```

---

### ❌ Partilha não funciona

**Causa 1:** Popup bloqueado pelo navegador
```javascript
// Usar target="_blank" em vez de window.open()
<a href="url" target="_blank">Partilhar</a>
```

**Causa 2:** URL não codificada
```javascript
// Sempre usar encodeURIComponent()
const url = encodeURIComponent(window.location.href);
```

---

### ❌ Animações não funcionam em mobile

**Causa:** Propriedade não suportada

**Solução:**
```css
/* Adicionar prefixos de vendors */
-webkit-animation: fadeIn 0.5s;
animation: fadeIn 0.5s;

-webkit-transform: translateY(-2px);
transform: translateY(-2px);
```

---

### ❌ Header desalinhado em mobile

**Causa:** Media query não aplicada

**Solução:**
```css
@media (max-width: 768px) {
    .header {
        padding: 10px 15px;  /* Reduzir padding */
        flex-wrap: wrap;     /* Permitir quebra de linha */
    }
}
```

---

## 🔄 ATUALIZAÇÕES FUTURAS

### Adicionar Analytics:

```html
<!-- No <head> de todas as páginas -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Adicionar Hotjar (heatmaps):

```html
<!-- No <head> -->
<script>
    (function(h,o,t,j,a,r){
        // Código do Hotjar
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

## 📊 MÉTRICAS PARA MONITORAR

### Google Analytics:
- ✅ Taxa de cliques no Support Banner
- ✅ Conversões para Buy Me a Coffee
- ✅ Submissões do formulário de feedback
- ✅ Cliques nos botões de partilha

### A/B Testing:
- Testar diferentes textos no banner
- Testar diferentes cores dos botões
- Testar posição do banner (topo vs rodapé)

---

## 🚨 CHECKLIST DE MANUTENÇÃO MENSAL

- [ ] Verificar links quebrados
- [ ] Testar formulários
- [ ] Verificar velocidade de carregamento
- [ ] Atualizar meta tags se necessário
- [ ] Revisar analytics
- [ ] Testar em diferentes navegadores
- [ ] Testar em dispositivos móveis
- [ ] Backup do código

---

## 📞 RECURSOS ÚTEIS

### Documentação:
- **MDN Web Docs:** developer.mozilla.org
- **CSS-Tricks:** css-tricks.com
- **Can I Use:** caniuse.com (compatibilidade)

### Ferramentas:
- **Lighthouse:** chrome.dev/docs/lighthouse (performance)
- **Wave:** wave.webaim.org (acessibilidade)
- **PageSpeed:** pagespeed.web.dev (velocidade)

### Validação:
- **HTML Validator:** validator.w3.org
- **CSS Validator:** jigsaw.w3.org/css-validator
- **Link Checker:** validator.w3.org/checklink

---

## 💡 DICAS DE BOAS PRÁTICAS

1. **Sempre testar em múltiplos navegadores**
   - Chrome, Firefox, Safari, Edge

2. **Manter código organizado**
   - Comentários claros
   - Indentação consistente
   - Nomes de variáveis descritivos

3. **Otimizar imagens**
   - Usar WebP quando possível
   - Comprimir com TinyPNG
   - Lazy loading para imagens abaixo da dobra

4. **Versionamento**
   - Usar Git para controle de versão
   - Commits descritivos
   - Branches para features

5. **Backup regular**
   - Backup semanal do código
   - Backup do banco de dados
   - Documentar mudanças importantes

---

**🎯 Mantenha o projeto sempre atualizado e funcionando perfeitamente!**

Este guia será seu aliado para qualquer manutenção futura no Quest4Couple. 💪
