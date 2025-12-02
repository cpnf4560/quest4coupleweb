# Sistema Multilingua Quest4Couple (i18n)

## 📌 Visão Geral

O Quest4Couple agora suporta **4 idiomas**:
- 🇵🇹 **PT-PT** (Português de Portugal)
- 🇧🇷 **PT-BR** (Português do Brasil)
- 🇬🇧 **EN** (Inglês)
- 🇪🇸 **ES** (Espanhol)

## 🎯 Funcionalidades

✅ **Deteção automática** do idioma do browser  
✅ **Modal de seleção** ao entrar pela primeira vez  
✅ **Seletor de idioma** visível no header  
✅ **Armazenamento** da preferência do utilizador  
✅ **Tradução dinâmica** de todo o conteúdo (exceto perguntas dos questionários)

---

## 📂 Estrutura de Ficheiros

```
Quest4Couple_v2_free/
├── i18n/
│   ├── translations.pt-pt.json  ✅ (completo)
│   ├── translations.pt-br.json  ✅ (completo)
│   ├── translations.en.json     ✅ (completo)
│   └── translations.es.json     ✅ (completo)
├── js/
│   └── i18n.js                  ✅ (módulo principal)
└── [páginas HTML]               ⚠️ (aplicar atributos data-i18n)
```

---

## 🚀 Como Aplicar a Tradução às Páginas

### 1. Incluir o Script i18n

Adiciona antes dos scripts Firebase em **todas as páginas HTML**:

```html
<!-- i18n System -->
<script src="js/i18n.js"></script>
```

✅ **Já aplicado em:**
- `index.html`

⚠️ **Falta aplicar em:**
- `dashboard.html`
- `relatorio.html`
- `tutorial.html`
- `auth.html`
- `app.html`
- `pages/apoiar.html`
- `pages/sobre.html`
- `pages/faq.html`
- `pages/privacidade.html`
- `pages/termos.html`

---

### 2. Adicionar Atributos `data-i18n` aos Elementos

Para traduzir um elemento, adiciona o atributo `data-i18n` com a chave da tradução:

#### **Exemplo: Botão de Login**

❌ **Antes:**
```html
<button class="header-btn">Fazer Login</button>
```

✅ **Depois:**
```html
<button class="header-btn" data-i18n="header.login">Fazer Login</button>
```

#### **Exemplo: Título da Página**

❌ **Antes:**
```html
<h1>Descubram-se melhor 💑</h1>
```

✅ **Depois:**
```html
<h1 data-i18n="home.subtitle">Descubram-se melhor 💑</h1>
```

#### **Exemplo: Conteúdo com HTML**

Para elementos que contêm HTML (como `<strong>`, `<em>`, etc.), usa `data-i18n-html`:

```html
<p data-i18n-html="home.description">
    Uma ferramenta interativa e <strong>100% gratuita</strong>...
</p>
```

---

### 3. Estrutura das Chaves de Tradução

As chaves seguem uma estrutura hierárquica:

```json
{
  "header": {
    "login": "Fazer Login",
    "dashboard": "Dashboard",
    "logout": "Sair"
  },
  "home": {
    "title": "Quest4Couple",
    "subtitle": "Descubram-se melhor 💑"
  },
  "dashboard": {
    "welcome": "Olá, {name}!",
    "accessCode": "O teu código de acesso"
  }
}
```

**Uso:**
- `header.login` → "Fazer Login"
- `home.subtitle` → "Descubram-se melhor 💑"
- `dashboard.welcome` → "Olá, {name}!" (com parâmetro dinâmico)

---

## 🛠️ API do Sistema i18n

### **I18n.t(key, params)**

Obter tradução por chave:

```javascript
// Tradução simples
const text = I18n.t('header.login');
// → "Fazer Login"

// Tradução com parâmetros
const welcome = I18n.t('dashboard.welcome', { name: 'João' });
// → "Olá, João!"
```

### **I18n.setLanguage(lang)**

Alterar idioma manualmente:

```javascript
await I18n.setLanguage('en');
// Altera para inglês e recarrega traduções
```

### **Evento: languageChanged**

Escutar mudanças de idioma:

```javascript
document.addEventListener('languageChanged', (event) => {
    const { lang, translations } = event.detail;
    console.log(`Idioma alterado para: ${lang}`);
    
    // Atualizar componentes dinâmicos
    updateMyComponent(translations);
});
```

---

## 📝 Checklist de Implementação

### **Páginas Principais**

- [ ] `index.html` - ✅ Script adicionado, ⚠️ falta aplicar atributos
- [ ] `dashboard.html`
- [ ] `relatorio.html`
- [ ] `tutorial.html`
- [ ] `auth.html`
- [ ] `app.html` (apenas UI, não as perguntas)

### **Páginas Secundárias**

- [ ] `pages/apoiar.html` (página de apoio)
- [ ] `pages/sobre.html`
- [ ] `pages/faq.html`
- [ ] `pages/privacidade.html`
- [ ] `pages/termos.html`

### **Componentes Reutilizáveis**

- [ ] `support-banner.js` - Atualizar textos do banner
- [ ] `notifications.js` - Traduzir mensagens de notificação
- [ ] Modais e pop-ups

---

## 🎨 Exemplo Completo: index.html

### **Header**

```html
<div class="header">
    <div class="auth-buttons">
        <!-- Seletor de idioma é adicionado automaticamente aqui -->
        
        <a href="auth.html" class="header-btn" data-i18n="header.login">
            Fazer Login
        </a>
        <a href="dashboard.html" class="header-btn" data-i18n="header.dashboard">
            Dashboard
        </a>
    </div>
</div>
```

### **Hero Section**

```html
<div class="hero">
    <h1 data-i18n="home.title">Quest4Couple</h1>
    <h2 data-i18n="home.subtitle">Descubram-se melhor 💑</h2>
    <p data-i18n-html="home.description">
        Uma ferramenta interativa e <strong>100% gratuita</strong>...
    </p>
    
    <div class="cta-buttons">
        <a href="auth.html" class="cta-primary" data-i18n="home.cta.start">
            🚀 Começar Agora
        </a>
        <a href="auth.html" class="cta-secondary" data-i18n="home.cta.login">
            🔐 Já tenho conta
        </a>
    </div>
</div>
```

### **Features**

```html
<section class="features">
    <h3 data-i18n="home.features.title">Como Funciona?</h3>
    
    <div class="feature-card">
        <h4 data-i18n="home.features.private.title">Privacidade Total</h4>
        <p data-i18n="home.features.private.description">
            As tuas respostas são encriptadas...
        </p>
    </div>
</section>
```

---

## 🔧 Manutenção e Atualização

### **Adicionar Nova Tradução**

1. Edita os 4 ficheiros JSON em `i18n/`:
   - `translations.pt-pt.json`
   - `translations.pt-br.json`
   - `translations.en.json`
   - `translations.es.json`

2. Adiciona a nova chave:
```json
{
  "newSection": {
    "newKey": "Novo texto aqui"
  }
}
```

3. Usa no HTML:
```html
<p data-i18n="newSection.newKey">Novo texto aqui</p>
```

### **Adicionar Novo Idioma**

1. Cria novo ficheiro: `i18n/translations.fr.json` (exemplo: francês)
2. Adiciona ao `i18n.js`:
```javascript
supportedLanguages: {
    'pt-pt': { name: 'Português (PT)', flag: '🇵🇹' },
    'pt-br': { name: 'Português (BR)', flag: '🇧🇷' },
    'en': { name: 'English', flag: '🇬🇧' },
    'es': { name: 'Español', flag: '🇪🇸' },
    'fr': { name: 'Français', flag: '🇫🇷' }  // ← NOVO
}
```

---

## ⚠️ Notas Importantes

### **Questionários (app.html)**

🚨 **As perguntas dos questionários NÃO devem ser traduzidas ainda**, pois vão haver alterações.

**O que traduzir em app.html:**
- ✅ Botões (Guardar, Carregar, Exportar, etc.)
- ✅ Mensagens de UI
- ✅ Tooltips e avisos
- ❌ Perguntas dos packs (deixar para depois)

### **Meta Tags SEO**

Os meta tags devem ser dinâmicos para SEO multilingua. Adiciona no script:

```javascript
document.addEventListener('languageChanged', (event) => {
    const { translations } = event.detail;
    
    // Atualizar meta description
    document.querySelector('meta[name="description"]').content = 
        translations.meta.description;
    
    // Atualizar Open Graph
    document.querySelector('meta[property="og:title"]').content = 
        translations.meta.ogTitle;
});
```

---

## 📊 Progresso Atual

| Componente | Status |
|------------|--------|
| Sistema i18n (JS) | ✅ Completo |
| Traduções PT-PT | ✅ Completo |
| Traduções PT-BR | ✅ Completo |
| Traduções EN | ✅ Completo |
| Traduções ES | ✅ Completo |
| index.html | 🟡 Script adicionado, falta aplicar atributos |
| dashboard.html | ⚠️ Por aplicar |
| relatorio.html | ⚠️ Por aplicar |
| tutorial.html | ⚠️ Por aplicar |
| auth.html | ⚠️ Por aplicar |
| app.html (UI) | ⚠️ Por aplicar |
| Páginas secundárias | ⚠️ Por aplicar |

---

## 🎯 Próximos Passos

1. **Aplicar `data-i18n` a todas as páginas principais**
2. **Testar modal de seleção de idioma ao entrar**
3. **Validar traduções em todos os idiomas**
4. **Atualizar support-banner.js com traduções**
5. **Adicionar traduções aos questionários (após alterações)**

---

## 💡 Dicas

- **Usa prefixos descritivos** nas chaves: `header.`, `dashboard.`, `auth.`
- **Mantém consistência** entre idiomas na estrutura JSON
- **Testa sempre** em todos os 4 idiomas após alterações
- **Usa `data-i18n-html`** apenas quando necessário (com HTML interno)

---

## 🐛 Debug

### **Ver idioma atual:**
```javascript
console.log('Idioma atual:', I18n.currentLang);
```

### **Ver todas as traduções carregadas:**
```javascript
console.log('Traduções:', I18n.translations);
```

### **Forçar reload das traduções:**
```javascript
await I18n.loadTranslations(I18n.currentLang);
```

---

**Desenvolvido para Quest4Couple 💑**
