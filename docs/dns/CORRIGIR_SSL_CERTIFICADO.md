# 🔒 Corrigir Erro SSL - ERR_CERT_AUTHORITY_INVALID

## 📌 **Problema Identificado**

O site `quest4couple.pt` está a mostrar o erro:
```
A sua ligação não é privada
net::ERR_CERT_AUTHORITY_INVALID
```

**Causa:** Certificado SSL/TLS inválido, ausente ou mal configurado.

---

## ✅ **Solução - Netlify (Recomendado)**

### **1. Verificar Configuração de Domínio**

1. **Aceder ao Painel Netlify:**
   - Login em https://app.netlify.com
   - Selecionar o site Quest4Couple

2. **Ir para Domain Management:**
   ```
   Site Settings → Domain management
   ```

3. **Verificar Domínio Principal:**
   - Confirmar que `quest4couple.pt` está listado como **Primary domain**
   - Se não estiver, adicionar:
     - Click "Add custom domain"
     - Inserir `quest4couple.pt`

### **2. Configurar DNS Corretamente**

**No Fornecedor de Domínio (ex: GoDaddy, Namecheap, etc.):**

Adicionar os seguintes registos DNS:

```dns
# Apex Domain (quest4couple.pt)
Tipo: A
Nome: @
Valor: 75.2.60.5

# WWW Subdomain
Tipo: CNAME
Nome: www
Valor: quest4couple.netlify.app
```

**OU** usar Netlify DNS (mais simples):
1. No painel Netlify → Domain settings
2. Click "Set up Netlify DNS"
3. Seguir instruções para transferir nameservers

### **3. Ativar HTTPS no Netlify**

1. **Ir para HTTPS Settings:**
   ```
   Site Settings → Domain management → HTTPS
   ```

2. **Verificar DNS Configuration:**
   - Click no botão "Verify DNS configuration"
   - Aguardar validação (pode demorar até 24h)

3. **Provisionar Certificado:**
   - Netlify vai provisionar automaticamente um certificado Let's Encrypt
   - Status deve mudar para: ✅ "Certificate active"

4. **Ativar Force HTTPS:**
   - Toggle "Force HTTPS" para **ON**
   - Isto redireciona automaticamente HTTP → HTTPS

### **4. Deploy das Alterações**

Após configurar o `netlify.toml` (já feito), fazer deploy:

```bash
git add netlify.toml
git commit -m "Config: SSL/HTTPS configuration for quest4couple.pt"
git push origin main
```

---

## 🔍 **Verificar Configuração**

### **Ferramentas Online:**

1. **SSL Labs Test:**
   - https://www.ssllabs.com/ssltest/analyze.html?d=quest4couple.pt
   - Rating deve ser **A** ou **A+**

2. **WhatsMyDNS:**
   - https://www.whatsmydns.net/#A/quest4couple.pt
   - Verificar propagação DNS global

3. **SSL Checker:**
   - https://www.sslshopper.com/ssl-checker.html#hostname=quest4couple.pt

### **Comando Terminal:**

```bash
# Verificar certificado SSL
curl -vI https://quest4couple.pt 2>&1 | grep -i ssl

# Verificar DNS
nslookup quest4couple.pt

# Teste completo
curl -I https://quest4couple.pt
```

---

## ⏱️ **Tempo de Propagação**

- **DNS:** 15 minutos a 48 horas (geralmente 1-2h)
- **Certificado SSL:** 5 minutos a 24 horas
- **Cache do Navegador:** Limpar cache (Ctrl+Shift+Delete)

---

## 🚨 **Troubleshooting**

### **Erro: "DNS verification failed"**

**Solução:**
1. Verificar registos DNS no fornecedor
2. Aguardar propagação (usar whatsmydns.net)
3. Tentar novamente "Verify DNS configuration"

### **Erro: "Certificate not provisioning"**

**Solução:**
1. Remover domínio do Netlify
2. Aguardar 1 hora
3. Re-adicionar domínio
4. Provisionar certificado novamente

### **Erro: "Mixed content" (HTTP/HTTPS)**

**Solução:**
1. Verificar que todos os recursos (CSS, JS, imagens) usam HTTPS
2. Atualizar URLs hardcoded para usar protocolo relativo (`//`)
3. Ativar "Force HTTPS" no Netlify

### **Navegador continua a mostrar erro**

**Solução:**
1. **Limpar Cache do Navegador:**
   - Chrome: `Ctrl+Shift+Delete` → Selecionar "Cached images and files"
   
2. **Limpar DNS Cache:**
   ```bash
   # Windows
   ipconfig /flushdns
   
   # Mac/Linux
   sudo dscacheutil -flushcache
   ```

3. **Testar em Janela Anónima:**
   - `Ctrl+Shift+N` (Chrome/Edge)

---

## 📝 **Alterações Realizadas**

### **netlify.toml**

Adicionado:
```toml
# SSL/TLS Configuration
[context.production]
  force_ssl = true

# Forçar HTTPS - Redirect HTTP para HTTPS
[[redirects]]
  from = "http://quest4couple.pt/*"
  to = "https://quest4couple.pt/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://www.quest4couple.pt/*"
  to = "https://quest4couple.pt/:splat"
  status = 301
  force = true
```

---

## 📧 **Contactar Suporte Netlify**

Se o problema persistir após 48h:

1. **Netlify Support:**
   - https://answers.netlify.com
   - support@netlify.com

2. **Informação a Fornecer:**
   - Site: quest4couple.pt
   - Erro: ERR_CERT_AUTHORITY_INVALID
   - DNS configurado: [Sim/Não]
   - Domínio verificado: [Sim/Não]

---

## ✅ **Checklist Final**

- [ ] DNS configurado corretamente
- [ ] Domínio verificado no Netlify
- [ ] Certificado SSL provisionado
- [ ] Force HTTPS ativado
- [ ] Deploy realizado com `netlify.toml` atualizado
- [ ] Cache do navegador limpo
- [ ] Teste em https://quest4couple.pt bem-sucedido
- [ ] SSL Labs rating A/A+

---

**Próximo Passo:** Seguir as instruções acima no painel do Netlify para provisionar o certificado SSL.
