# 🌐 CONFIGURAR QUEST4COUPLE.COM (Domínio Secundário)

## 🎯 OBJETIVO:
Ter o site funcional em **quest4couple.com** enquanto aguardamos a propagação do .pt

---

## 📋 PASSO 1: Adicionar Domínio no Netlify

1. **Ir para Netlify Dashboard:**
   - https://app.netlify.com/sites/admirable-dragon-bf9108/

2. **Domains → Add domain:**
   ```
   quest4couple.com
   ```

3. **Netlify vai dar instruções DNS:**
   ```
   Opção A - CNAME (recomendado):
   www.quest4couple.com → admirable-dragon-bf9108.netlify.app

   Opção B - A Record:
   quest4couple.com → 75.2.60.5
   ```

---

## 📋 PASSO 2: Configurar DNS do .COM

### **Se o .COM está no mesmo painel (host-redirect.com):**

1. **Ir ao painel DNS de quest4couple.com**

2. **Adicionar registos:**
   ```
   Tipo: A
   Nome: @ (ou deixar vazio)
   Valor: 75.2.60.5
   TTL: 3600

   Tipo: CNAME
   Nome: www
   Valor: admirable-dragon-bf9108.netlify.app
   TTL: 3600
   ```

3. **Guardar e aguardar 5-15 minutos**

---

## 🎯 PASSO 3: Testar

Após 15-30 minutos:

```powershell
# Verificar DNS do .COM
nslookup quest4couple.com 8.8.8.8

# Deve retornar:
# Address: 75.2.60.5

# Testar website
# Abrir: https://quest4couple.com
```

---

## 🔄 PASSO 4: Configurar Redirecionamento (DEPOIS)

### **Cenário A: .COM → .PT (quando .pt funcionar)**

Adicionar ao ficheiro `_redirects`:

```
# Redirect .COM para .PT (permanente)
https://quest4couple.com/*  https://quest4couple.pt/:splat  301!
https://www.quest4couple.com/*  https://quest4couple.pt/:splat  301!
```

### **Cenário B: .PT → .COM (se preferir .com como principal)**

Adicionar ao ficheiro `_redirects`:

```
# Redirect .PT para .COM (permanente)
https://quest4couple.pt/*  https://quest4couple.com/:splat  301!
https://www.quest4couple.pt/*  https://quest4couple.com/:splat  301!
```

---

## 💡 RECOMENDAÇÃO:

### **Estratégia sugerida:**

1. ✅ **AGORA**: Configurar .COM para funcionar imediatamente
2. ✅ **Usar .COM** como principal durante 1-2 semanas
3. ✅ **Testar tudo** no .COM (funcionalidade, SEO, etc.)
4. ✅ **DEPOIS**: Quando .PT estiver estável, decidir:
   - **Opção A**: Manter .COM como principal (melhor para internacional)
   - **Opção B**: Redirecionar .COM → .PT (melhor para mercado português)

---

## 🌍 COMPARAÇÃO .COM vs .PT:

| Aspeto | .COM | .PT |
|--------|------|-----|
| **Reconhecimento Global** | ✅ Melhor | ❌ Limitado |
| **SEO Internacional** | ✅ Melhor | ❌ Limitado |
| **Mercado Português** | ⚠️ Aceite | ✅ Preferido |
| **Confiança PT** | ⚠️ Média | ✅ Alta |
| **Velocidade Propagação** | ✅ Rápida | ⏳ 24-48h |

### **Sugestão:**
- Se o público-alvo é **principalmente português**: .PT como principal
- Se o público-alvo é **internacional/global**: .COM como principal
- **Melhor solução**: Ter ambos e redirecionar um para o outro

---

## 📝 CONFIGURAÇÃO NETLIFY (netlify.toml)

Adicionar suporte para ambos os domínios:

```toml
[[redirects]]
  from = "https://quest4couple.com/*"
  to = "https://quest4couple.pt/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://www.quest4couple.com/*"
  to = "https://quest4couple.pt/:splat"
  status = 301
  force = true
```

**OU** (se preferir .COM como principal):

```toml
[[redirects]]
  from = "https://quest4couple.pt/*"
  to = "https://quest4couple.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://www.quest4couple.pt/*"
  to = "https://quest4couple.com/:splat"
  status = 301
  force = true
```

---

## ⏱️ TIMELINE:

```
AGORA:
├─ Configurar DNS .COM (5 min)
├─ Aguardar propagação (15-30 min)
└─ Testar https://quest4couple.com ✅

EM 1-2 HORAS:
├─ .PT propaga
├─ Decidir qual domínio principal
└─ Configurar redirect

FINAL:
├─ Ambos domínios funcionais
└─ Um redireciona para o outro (301)
```

---

## 🚀 PRÓXIMOS PASSOS:

1. [ ] Confirmar onde está registado o quest4couple.com
2. [ ] Configurar DNS do .COM (A: 75.2.60.5)
3. [ ] Adicionar .COM no Netlify
4. [ ] Aguardar 15-30 min
5. [ ] Testar https://quest4couple.com
6. [ ] Quando .PT funcionar, configurar redirect

