# 📧 Mensagem para Suporte DNS

## Para: Suporte do Provedor de Email/DNS (dnscpanel.com)

**Assunto:** Atualizar registos DNS para quest4couple.pt - Apontar website para Netlify (manter email)

---

**Corpo da Mensagem:**

Olá,

Preciso de atualizar os registos DNS do domínio **quest4couple.pt** que atualmente usa os nameservers:
- ns1.dnscpanel.com
- ns2.dnscpanel.com
- ns3.dnscpanel.com

**Contexto:** O website está alojado no Netlify, mas o email deve continuar a funcionar no servidor atual (94.126.169.39).

**Alterações necessárias:**

### 1. Apex Domain (quest4couple.pt)
- **REMOVER:** Registo A que aponta para `94.126.169.39`
- **ADICIONAR:** Registo A apontando para `75.2.60.5` (Netlify)
- TTL: 3600 segundos

**OU (preferencial se suportado):**
- **ADICIONAR:** Registo ALIAS ou ANAME apontando para `apex-loadbalancer.netlify.com`

### 2. Subdomínio WWW
- **REMOVER:** CNAME atual que aponta para `quest4couple.pt`
- **ADICIONAR:** CNAME `www` apontando para `admirable-dragon-bf9108.netlify.app`
- TTL: 3600 segundos

### 3. Email (MANTER FUNCIONAMENTO)
- **ADICIONAR:** Registo A: `mail.quest4couple.pt` apontando para `94.126.169.39`
- **ALTERAR MX:** Prioridade 0 para `mail.quest4couple.pt` (em vez de quest4couple.pt)
- **MANTER:** TXT SPF: `v=spf1 +mx +a +ip4:94.126.169.39 ~all`
- **MANTER:** Outros registos TXT (DKIM, DMARC) se existirem

### 4. Resumo da Configuração Final:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| A | @ (apex) | 75.2.60.5 | 3600 |
| CNAME | www | admirable-dragon-bf9108.netlify.app | 3600 |
| A | mail | 94.126.169.39 | 3600 |
| MX | @ | mail.quest4couple.pt (prioridade 0) | 3600 |
| TXT | @ | v=spf1 +mx +a +ip4:94.126.169.39 ~all | 3600 |

**Motivo:** O site está alojado no Netlify e precisa apontar para o IP/CNAME correto para funcionar e ter certificado SSL válido.

**Urgência:** O site está atualmente inacessível devido ao IP incorreto.

Podem confirmar quando as alterações estiverem aplicadas?

Obrigado,
[Seu Nome]
[Seu Email/Telefone]

---

## 📋 Checklist Antes de Enviar:

- [ ] Confirmar que tem acesso ao email associado ao domínio
- [ ] Anexar screenshot do erro ERR_CERT_AUTHORITY_INVALID (se possível)
- [ ] Mencionar que o site Netlify funciona em `admirable-dragon-bf9108.netlify.app`
- [ ] Referir que aguarda confirmação de propagação DNS

---

## 🔍 Após Envio:

Aguarde resposta do suporte (geralmente 24-48h) e depois verifique:

```powershell
# Limpar cache DNS local
ipconfig /flushdns

# Verificar DNS
nslookup quest4couple.pt 8.8.8.8

# Deve retornar: 75.2.60.5 ✅
```

Se retornar o IP correto, aceda a `https://quest4couple.pt` e confirme que:
- Site carrega sem erros SSL ✅
- Certificado é emitido por Let's Encrypt ✅
- Conteúdo é do Netlify ✅

