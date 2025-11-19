# 🚀 GUIA RÁPIDO: Configurar URLs de Apoio

## ⚡ 3 Passos em 10 Minutos

---

## 1️⃣ Buy Me a Coffee (3 min)

### **Criar Conta:**
1. Aceder: https://www.buymeacoffee.com/
2. Clicar "Start my page"
3. Escolher username: `quest4couple`
4. Configurar perfil:
   - **Nome:** Quest4Couple
   - **Descrição:** "Ajude a manter o Quest4Couple gratuito! 💑"
   - **Avatar:** Logo do projeto
   - **URL final:** https://www.buymeacoffee.com/quest4couple

### **Configurar Página:**
- ✅ Adicionar descrição do projeto
- ✅ Explicar custos (hosting, desenvolvimento)
- ✅ Definir goals (ex: €50/mês para hosting)
- ✅ Adicionar imagem de capa

### **Atualizar Código:**
```javascript
// Em support-banner.js linha 9
buyMeCoffeeUrl: 'https://www.buymeacoffee.com/quest4couple'
```

---

## 2️⃣ Formulário Google Forms (5 min)

### **Criar Formulário:**
1. Aceder: https://forms.google.com/
2. Criar novo formulário
3. Título: "Feedback - Quest4Couple"

### **Perguntas Sugeridas:**

#### **Pergunta 1 - Avaliação Geral**
- Tipo: Escala linear (1-5 estrelas)
- Texto: "Como avalia a sua experiência com o Quest4Couple?"

#### **Pergunta 2 - O que mais gostou?**
- Tipo: Resposta curta
- Texto: "O que mais gostou na plataforma?"

#### **Pergunta 3 - Melhorias**
- Tipo: Parágrafo
- Texto: "O que poderia ser melhorado?"

#### **Pergunta 4 - Recomendação**
- Tipo: Múltipla escolha
- Texto: "Recomendaria o Quest4Couple a amigos?"
- Opções: Sim / Não / Talvez

#### **Pergunta 5 - Sugestões**
- Tipo: Parágrafo
- Texto: "Tem alguma sugestão de nova funcionalidade?"
- Opcional: Sim

#### **Pergunta 6 - Email (Opcional)**
- Tipo: Resposta curta
- Texto: "Email (opcional - para respondermos ao feedback)"

### **Obter URL Curto:**
1. Clicar "Enviar"
2. Clicar ícone de link
3. Marcar "Encurtar URL"
4. Copiar URL (ex: https://forms.gle/ABC123)

### **Atualizar Código:**
```javascript
// Em support-banner.js linha 10
feedbackFormUrl: 'https://forms.gle/ABC123'  // Substituir pelo real
```

---

## 3️⃣ Meta Tags Open Graph (2 min)

### **Criar Imagem OG:**
- Tamanho: 1200x630px
- Conteúdo: Logo + texto "Quest4Couple - Descubram-se melhor"
- Guardar em: `/assets/og-image.jpg`

### **Adicionar em `<head>`:**

```html
<!-- Adicionar em index.html, tutorial.html, app.html -->

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://quest4couple.pt/">
<meta property="og:title" content="Quest4Couple - Descubram-se melhor 💑">
<meta property="og:description" content="Ferramenta gratuita e privada para casais explorarem desejos e compatibilidades. 5 packs temáticos, 250+ perguntas.">
<meta property="og:image" content="https://quest4couple.pt/assets/og-image.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://quest4couple.pt/">
<meta property="twitter:title" content="Quest4Couple - Descubram-se melhor 💑">
<meta property="twitter:description" content="Ferramenta gratuita para casais explorarem desejos e compatibilidades.">
<meta property="twitter:image" content="https://quest4couple.pt/assets/og-image.jpg">
```

---

## ✅ CHECKLIST FINAL

### **Antes de Deploy:**
- [ ] Conta Buy Me a Coffee criada
- [ ] URL atualizada em `support-banner.js`
- [ ] Formulário Google Forms criado
- [ ] URL do formulário atualizada
- [ ] Imagem OG criada (1200x630px)
- [ ] Meta tags adicionadas nas páginas principais
- [ ] Testado partilhas em WhatsApp
- [ ] Testado partilhas em Facebook
- [ ] Banner visível em index.html
- [ ] Banner visível em tutorial.html
- [ ] Banner visível em pages/apoiar.html

---

## 🧪 TESTES RÁPIDOS

### **Teste 1 - Buy Me a Coffee:**
```bash
# Abrir no browser
https://www.buymeacoffee.com/quest4couple
```
✅ Página deve abrir sem erro 404

### **Teste 2 - Formulário:**
```bash
# Abrir no browser
https://forms.gle/ABC123
```
✅ Formulário deve aparecer corretamente

### **Teste 3 - Partilha WhatsApp:**
1. Abrir index.html
2. Scroll até Support Banner
3. Clicar no botão WhatsApp 💬
4. Verificar se abre com texto correto

### **Teste 4 - Meta Tags:**
```bash
# Usar Facebook Debugger
https://developers.facebook.com/tools/debug/
```
✅ Inserir URL e verificar preview

---

## 🎯 PRÓXIMOS 30 DIAS

### **Semana 1:**
- [ ] Monitorizar cliques no banner
- [ ] Verificar taxa de conversão
- [ ] Ler primeiros feedbacks

### **Semana 2:**
- [ ] Ajustar copy do banner se necessário
- [ ] A/B test de posicionamento
- [ ] Adicionar modal de agradecimento

### **Semana 3:**
- [ ] Implementar banner no app.html
- [ ] Banner após completar 50% do pack
- [ ] Banner após gerar relatório

### **Semana 4:**
- [ ] Analisar métricas
- [ ] Otimizar conversão
- [ ] Planejar próximas features

---

## 📊 MÉTRICAS A ACOMPANHAR

### **Google Analytics (se disponível):**
- Pageviews em `/pages/apoiar.html`
- Eventos de clique no banner
- Taxa de saída após ver banner

### **Buy Me a Coffee Dashboard:**
- Número de doações
- Valor médio de doação
- Origem (referrer)

### **Google Forms:**
- Número de respostas
- Média de avaliação
- Principais sugestões

---

## 💡 DICAS PRO

1. **Copy Atraente:**
   - Use emojis estrategicamente
   - Seja genuíno e transparente
   - Mostre impacto da contribuição

2. **Timing Perfeito:**
   - Após experiência positiva
   - Nunca no primeiro acesso
   - Quando há valor percebido

3. **Social Proof:**
   - "Junte-se a X apoiadores"
   - "€Y arrecadado este mês"
   - Depoimentos de doadores

4. **Transparência:**
   - Mostrar onde o dinheiro vai
   - Atualizar sobre melhorias
   - Agradecer publicamente

---

## 🆘 PROBLEMAS COMUNS

### **Banner não aparece:**
```javascript
// Verificar console do browser
// Se houver erro, verificar se support-banner.js está carregado
console.log(typeof SupportBanner);  // Deve retornar "object"
```

### **Partilha não funciona:**
- Verificar se URL está encodada corretamente
- Testar em mobile (WhatsApp só funciona em mobile)
- Verificar pop-up blocker

### **Buy Me a Coffee 404:**
- Username pode estar indisponível
- Tentar variação: quest4couple, quest-4-couple, q4c

---

**Tempo Total Estimado:** 10-15 minutos  
**Dificuldade:** ⭐ Fácil  
**Prioridade:** 🔥 Alta - Fazer AGORA!
