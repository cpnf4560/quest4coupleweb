# 🌐 Configurar DNS para quest4couple.pt - Netlify

## 📊 **DIAGNÓSTICO ATUAL**

### ✅ **O que está a funcionar:**
- Certificado SSL Let's Encrypt **ATIVO** desde 19 Nov 2024
- Netlify site funcional: `admirable-dragon-bf9108.netlify.app`
- Domínio registado: `quest4couple.pt`

### 🔴 **O que precisa de correção:**
- DNS a apontar para IP errado: `94.126.169.39` (servidor antigo)
- Status no Netlify: **"Pending DNS verification"**
- Site não carrega em `https://quest4couple.pt`

### 🎯 **Objetivo:**
Apontar DNS para Netlify: `75.2.60.5`

---

## 🔧 **SOLUÇÃO 1: Atualizar Registos DNS (Método Direto)**

### **Passo 1: Aceder ao Painel de Controlo DNS**

O vosso domínio usa nameservers **dnscpanel.com**:
- `ns1.dnscpanel.com`
- `ns2.dnscpanel.com`
- `ns3.dnscpanel.com`

**Onde fazer login?**
- Se compraram o domínio com hosting incluído: painel do hosting
- Se compraram domínio separado: painel do registrar (ex: GoDaddy)
- URL típica: `https://painel.seufornecedor.com` ou `https://cpanel.seufornecedor.com`

### **Passo 2: Localizar Zona DNS**

No painel, procurar por:
- "Zona DNS" / "DNS Zone"
- "Gestão de DNS" / "DNS Management"
- "Editor DNS" / "DNS Editor"
- "Registos DNS" / "DNS Records"

### **Passo 3: Configurar Registos**

#### **A) Apex Domain (quest4couple.pt)**

**APAGAR/EDITAR:**
```
Tipo: A
Nome: @ ou quest4couple.pt
Valor: 94.126.169.39  ❌ APAGAR ESTE
```

**ADICIONAR/ATUALIZAR:**
```
Tipo: A
Nome: @ (ou deixar vazio, ou "quest4couple.pt")
Valor: 75.2.60.5  ✅ NOVO IP NETLIFY
TTL: 3600 (ou 1 hora)
```

#### **B) Subdomínio WWW**

**APAGAR registos A antigos do www (se existirem)**

**ADICIONAR:**
```
Tipo: CNAME
Nome: www
Valor: admirable-dragon-bf9108.netlify.app
TTL: 3600
```

### **Passo 4: Guardar e Aguardar Propagação**

- Guardar alterações
- Propagação DNS: **15 min - 48 horas** (geralmente 1-2h)
- Verificar em: https://www.whatsmydns.net/#A/quest4couple.pt

---

## 🚀 **SOLUÇÃO 2: Usar Netlify DNS (Mais Simples)**

### **Vantagens:**
- Configuração automática
- SSL provisioning instantâneo
- Não precisa de gerir registos manualmente

### **Passo a Passo:**

#### **1. No Painel Netlify:**

1. Ir para: `Site Settings → Domain management`
2. Scroll até encontrar **"Use Netlify DNS"** ou **"Set up Netlify DNS"**
3. Clicar no botão (pode estar na secção inferior)

#### **2. Seguir Wizard:**

O Netlify vai mostrar os **nameservers** a usar:
```
dns1.p03.nsone.net
dns2.p03.nsone.net
dns3.p03.nsone.net
dns4.p03.nsone.net
```

*(Os números podem variar - usar os que o Netlify mostrar)*

#### **3. Atualizar Nameservers no Fornecedor:**

1. Login no painel do fornecedor do domínio
2. Procurar "Nameservers" ou "DNS Management"
3. Mudar de:
   ```
   ns1.dnscpanel.com  ❌
   ns2.dnscpanel.com  ❌
   ns3.dnscpanel.com  ❌
   ```
   
   Para:
   ```
   dns1.p03.nsone.net  ✅
   dns2.p03.nsone.net  ✅
   dns3.p03.nsone.net  ✅
   dns4.p03.nsone.net  ✅
   ```

4. Guardar alterações

#### **4. Voltar ao Netlify:**

- Clicar "Verify" ou "Continue"
- Aguardar verificação (pode demorar 24-48h)
- Netlify configura tudo automaticamente

---

## 🔍 **VERIFICAR CONFIGURAÇÃO**

### **1. Verificar DNS (Terminal):**

```powershell
# Verificar IP do domínio
nslookup quest4couple.pt

# Deve retornar:
# Address: 75.2.60.5  ✅
```

### **2. Verificar SSL (Browser):**

1. Ir para: `https://quest4couple.pt`
2. Clicar no cadeado 🔒 na barra de endereço
3. Verificar certificado:
   - Emitido por: **Let's Encrypt**
   - Válido até: **Fevereiro 2026**

### **3. Ferramentas Online:**

**DNS Propagation:**
- https://www.whatsmydns.net/#A/quest4couple.pt
- Deve mostrar `75.2.60.5` em todos os servidores

**SSL Check:**
- https://www.ssllabs.com/ssltest/analyze.html?d=quest4couple.pt
- Rating deve ser **A** ou **A+**

**Netlify Status:**
- No painel Netlify → Domain management
- Status deve mudar de **"Pending DNS verification"** para **"Netlify DNS"** ou sem warnings

---

## ⏱️ **TEMPO DE PROPAGAÇÃO**

| Ação | Tempo Típico |
|------|-------------|
| Atualizar registos A/CNAME | 15 min - 2 horas |
| Mudar nameservers | 24 - 48 horas |
| Provisioning SSL | Automático após DNS |
| Cache do navegador | Limpar manualmente |

---

## 🚨 **TROUBLESHOOTING**

### **1. Erro: "DNS verification pending" após 48h**

**Causa:** Registos DNS não propagaram ou estão incorretos

**Solução:**
```powershell
# Verificar DNS atual
nslookup quest4couple.pt

# Se mostrar IP errado (94.126.169.39), repetir configuração DNS
```

### **2. Erro: "Certificate not provisioning"**

**Causa:** DNS não aponta para Netlify

**Solução:**
1. Confirmar que `nslookup` retorna `75.2.60.5`
2. No Netlify → HTTPS settings → Click "Renew certificate"
3. Aguardar 5-10 minutos

### **3. Erro: "Site not loading" mesmo com DNS correto**

**Causa:** Cache do navegador ou CDN

**Solução:**
```powershell
# Limpar cache DNS local (Windows)
ipconfig /flushdns

# Testar em janela anónima
# Ctrl+Shift+N (Chrome/Edge)
```

### **4. Não consigo encontrar painel DNS**

**Possíveis localizações:**
- cPanel → "Zone Editor"
- Plesk → "DNS Settings"
- GoDaddy → "Manage DNS"
- Namecheap → "Advanced DNS"
- OVH → "DNS Zone"

**Se não encontrar:**
- Contactar suporte do fornecedor
- Pedir para "configurar registos A para apontar para Netlify"

---

## 📧 **CONTACTAR SUPORTE**

### **Suporte Netlify:**
- Forum: https://answers.netlify.com
- Email: support@netlify.com

**Template de mensagem:**
```
Subject: DNS verification pending for quest4couple.pt

Hello,

My domain quest4couple.pt shows "Pending DNS verification" in Netlify.

- Site: admirable-dragon-bf9108.netlify.app
- Domain: quest4couple.pt
- Current DNS: 94.126.169.39 (old server)
- Target DNS: 75.2.60.5 (Netlify)
- SSL Certificate: Active (Let's Encrypt)

I've updated the DNS records, but verification is still pending after [X hours].
Can you help verify what's wrong?

Thank you!
```

### **Suporte Fornecedor de Domínio:**

**Template:**
```
Assunto: Atualizar registos DNS para Netlify

Olá,

Preciso de configurar os seguintes registos DNS para o domínio quest4couple.pt:

Apex Domain:
- Tipo: A
- Nome: @
- Valor: 75.2.60.5

Subdomínio WWW:
- Tipo: CNAME
- Nome: www
- Valor: admirable-dragon-bf9108.netlify.app

Podem ajudar-me a configurar estes registos?

Obrigado!
```

---

## ✅ **CHECKLIST FINAL**

- [ ] Identificar fornecedor de domínio/hosting
- [ ] Login no painel de controlo
- [ ] Atualizar registo A: `@ → 75.2.60.5`
- [ ] Atualizar registo CNAME: `www → admirable-dragon-bf9108.netlify.app`
- [ ] Guardar alterações
- [ ] Aguardar 1-2 horas (propagação)
- [ ] Limpar cache DNS: `ipconfig /flushdns`
- [ ] Testar: `nslookup quest4couple.pt` deve retornar `75.2.60.5`
- [ ] Verificar no Netlify: status deve mudar para OK
- [ ] Testar site: `https://quest4couple.pt` deve carregar
- [ ] Verificar SSL: cadeado verde no navegador

---

## 📞 **PRÓXIMO PASSO IMEDIATO**

1. **Descobrir fornecedor:**
   - Verificar emails de registo do domínio
   - Procurar faturas/recibos
   - Verificar onde fez o pagamento

2. **Login no painel:**
   - URL típica: `https://painel.seufornecedor.com`
   - Credenciais de quando registou o domínio

3. **Seguir "SOLUÇÃO 1"** (mais rápido) ou **"SOLUÇÃO 2"** (mais simples)

4. **Aguardar propagação** (1-2 horas geralmente)

5. **Verificar sucesso:**
   ```powershell
   nslookup quest4couple.pt
   # Deve mostrar: 75.2.60.5
   ```

---

**⚠️ IMPORTANTE:** Não apagar registos MX (email) se existirem! Só alterar registos A e CNAME mencionados.
