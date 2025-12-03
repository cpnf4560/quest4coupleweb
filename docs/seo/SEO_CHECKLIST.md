# ✅ SEO CHECKLIST - Verificação Rápida

## Antes de Fazer Deploy

### 1. Verificar Imagem OG
- [ ] Criar/verificar arquivo `assets/og-image.jpg`
- [ ] Dimensões: 1200 x 630 pixels
- [ ] Formato: JPEG ou PNG
- [ ] Conteúdo: Logo + texto "Quest4Couple - Descubram-se juntos"

### 2. Testar Localmente
```bash
# Verificar se arquivos existem
ls robots.txt
ls sitemap.xml
ls assets/og-image.jpg
```

### 3. Validar HTML
- [ ] Abrir index.html no browser
- [ ] View Source (Ctrl+U)
- [ ] Verificar que meta tags aparecem no <head>
- [ ] Verificar JSON-LD (deve aparecer como script)

## Após Deploy no Netlify

### 1. Verificar Arquivos Públicos
```
✓ https://quest4couple.pt/robots.txt
✓ https://quest4couple.pt/sitemap.xml
✓ https://quest4couple.pt/assets/og-image.jpg
```

### 2. Testar Meta Tags
**Facebook Debugger:**
- https://developers.facebook.com/tools/debug/
- Inserir: https://quest4couple.pt/
- Clicar "Scrape Again" se necessário

**Twitter Card Validator:**
- https://cards-dev.twitter.com/validator
- Inserir: https://quest4couple.pt/

**Google Rich Results Test:**
- https://search.google.com/test/rich-results
- Inserir: https://quest4couple.pt/

### 3. Google Search Console
1. Ir para: https://search.google.com/search-console
2. Adicionar propriedade (quest4couple.pt)
3. Verificar propriedade (método HTML tag ou DNS)
4. Submeter sitemap:
   - Sitemaps > Add new sitemap
   - URL: https://quest4couple.pt/sitemap.xml
5. Solicitar indexação da homepage:
   - URL Inspection > https://quest4couple.pt/
   - Request Indexing

### 4. Bing Webmaster Tools
1. Ir para: https://www.bing.com/webmasters
2. Adicionar site
3. Submeter sitemap: https://quest4couple.pt/sitemap.xml

## Validações Técnicas

### JSON-LD Schema
```bash
# Copiar JSON-LD do index.html e colar em:
https://validator.schema.org/
```

### Sitemap XML
```bash
# Validar em:
https://www.xml-sitemaps.com/validate-xml-sitemap.html
```

### Page Speed
```bash
# Testar velocidade em:
https://pagespeed.web.dev/
# Inserir: https://quest4couple.pt/
```

## Métricas para Monitorizar

### Google Search Console (após 7-14 dias)
- [ ] Páginas indexadas (target: 9-10 páginas)
- [ ] Impressões de pesquisa
- [ ] Clicks
- [ ] CTR (Click-Through Rate)
- [ ] Posição média

### Keywords a Acompanhar
1. "quest4couple"
2. "questionários para casais"
3. "teste compatibilidade casal"
4. "intimidade casal"

## Troubleshooting

### Se robots.txt não aparecer:
```
# Verificar _headers do Netlify
# Deve ter:
/robots.txt
  Content-Type: text/plain; charset=utf-8
```

### Se sitemap.xml não aparecer:
```
# Verificar _headers do Netlify
# Deve ter:
/sitemap.xml
  Content-Type: application/xml; charset=utf-8
```

### Se og:image não aparecer:
1. Verificar que arquivo existe em /assets/og-image.jpg
2. Testar URL diretamente: https://quest4couple.pt/assets/og-image.jpg
3. Verificar dimensões (deve ser 1200x630)
4. Usar Facebook Debugger para "Scrape Again"

### Se JSON-LD não aparecer no Google:
1. Esperar 7-14 dias (indexação demora)
2. Verificar em Rich Results Test
3. Solicitar re-indexação no Search Console

## Timeline Esperado

| Ação | Tempo |
|------|-------|
| Deploy para produção | Imediato |
| Robots.txt acessível | Imediato |
| Sitemap.xml acessível | Imediato |
| Facebook preview atualizado | 1-2 horas |
| Google indexar sitemap | 1-3 dias |
| Rich snippets aparecerem | 7-14 dias |
| Ranking melhorar | 30-90 dias |

---

**NOTA IMPORTANTE**: SEO é um processo gradual. Não espere resultados imediatos. Continue criando conteúdo de qualidade e melhorando a experiência do utilizador.
