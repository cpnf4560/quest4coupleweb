# 📧 GUIA: Encontrar Registrar nos Emails (WHOIS Privado)

## 🎯 OBJETIVO:
Encontrar o fornecedor que gere o domínio quest4couple.pt, mesmo com WHOIS privado.

---

## 📬 PASSO 1: Abrir Gmail/Outlook

### No Gmail:
1. Ir para: https://mail.google.com
2. Na barra de pesquisa, copiar e colar:

```
quest4couple.pt OR "domain registration" OR "renovação dominio" OR "domain renewal" OR "nameserver" OR ".pt domain"
```

### No Outlook:
1. Ir para: https://outlook.com
2. Pesquisar por: `quest4couple.pt`

---

## 🔍 PASSO 2: Tipos de Emails a Procurar

### A) **Email de Confirmação de Registo** (quando comprou)
```
Assuntos possíveis:
- "Domain Registration Confirmation"
- "Confirmação de Registo do Domínio"
- "Welcome to [NOME DO FORNECEDOR]"
- "quest4couple.pt - Registration Successful"
- "Novo domínio registado"
```

### B) **Email de Renovação Automática**
```
Assuntos possíveis:
- "Domain Renewal Confirmation"
- "Domínio renovado automaticamente"
- "quest4couple.pt renewed"
- "Renovação automática - quest4couple.pt"
```

### C) **Lembrete de Renovação**
```
Assuntos possíveis:
- "Domain Renewal Reminder"
- "Lembrete: quest4couple.pt expira em breve"
- "Renovar quest4couple.pt"
- "Action Required: Renew quest4couple.pt"
```

### D) **Fatura/Recibo**
```
Assuntos possíveis:
- "Invoice for quest4couple.pt"
- "Fatura - quest4couple.pt"
- "Payment Receipt"
- "Recibo de Pagamento - Domínio"
```

### E) **Email sobre Nameservers**
```
Assuntos possíveis:
- "Nameserver Update Confirmation"
- "DNS alterado para quest4couple.pt"
- "Nameservers changed"
```

---

## 📋 PASSO 3: Identificar o Registrar

Quando encontrar um destes emails, procure por:

### **Remetente (From):**
- `suporte@ovh.pt` → **OVH Portugal**
- `info@ptisp.pt` → **PTisp**
- `suporte@claranet.pt` → **Claranet**
- `noreply@hoster.pt` → **Hoster**
- `info@aforamento.pt` → **Aforamento**
- `support@namecheap.com` → **Namecheap**
- `noreply@godaddy.com` → **GoDaddy**

### **Conteúdo do Email:**
Procure frases como:
- "Bem-vindo ao [NOME DO FORNECEDOR]"
- "Login: https://painel.[fornecedor].pt"
- "Gerir domínio: https://[fornecedor].pt/cliente"

---

## 🏦 PASSO 4: VERIFICAR EXTRATOS BANCÁRIOS

Se não encontrou emails, procure nos extratos bancários:

### **Onde procurar:**
1. **Banco Online**: Login no homebanking
2. **Período**: Últimos 12-24 meses (depende da data de renovação)
3. **Valores típicos**: 
   - Domínio .pt: €8-20/ano
   - Pode ser cobrado mensalmente ou anualmente

### **Descrições possíveis nos movimentos:**
```
- "OVH SAS"
- "PTISP"
- "CLARANET"
- "HOSTER.PT"
- "NAMECHEAP"
- "GODADDY"
- "PAYPAL *[nome do fornecedor]"
- "STRIPE *[nome do fornecedor]"
```

---

## 💳 PASSO 5: VERIFICAR PAYPAL/STRIPE

Se pagou via PayPal ou cartão de crédito:

### **PayPal:**
1. Login: https://www.paypal.com
2. Ir para: **Atividade** → **Todas as transações**
3. Filtrar últimos 2 anos
4. Procurar por: "quest4couple" ou "domain" ou "dominio"

### **Stripe:**
1. Verificar email de confirmações Stripe
2. Procurar: "Payment to [fornecedor]"

---

## 🎯 FORNECEDORES MAIS COMUNS EM PORTUGAL:

| Fornecedor | Site | Email Suporte |
|------------|------|---------------|
| **OVH Portugal** | https://www.ovhcloud.com/pt/ | suporte@ovh.pt |
| **PTisp** | https://www.ptisp.pt | info@ptisp.pt |
| **Claranet** | https://www.claranet.pt | suporte@claranet.pt |
| **Hoster.pt** | https://www.hoster.pt | suporte@hoster.pt |
| **Aforamento** | https://www.aforamento.pt | info@aforamento.pt |
| **Host-it** | https://www.host-it.pt | suporte@host-it.pt |
| **PTISP/Duplaweb** | https://www.duplaweb.pt | suporte@duplaweb.pt |
| **Amen** | https://www.amen.pt | suporte@amen.pt |

---

## ✅ DEPOIS DE IDENTIFICAR:

1. **Copiar nome do fornecedor**: Ex: "OVH Portugal"
2. **Copiar URL de login**: Ex: "https://www.ovh.pt/auth"
3. **Procurar credenciais**:
   - Username/Email usado no registo
   - Password (se esqueceu, use "Recuperar password")

---

## 🆘 SE NÃO ENCONTRAR NENHUM EMAIL:

### **Opção A: Verificar outras caixas de email**
- Email pessoal
- Email da empresa
- Email antigo que já não usa

### **Opção B: Verificar método de pagamento**
- Procurar no banco/cartão de crédito
- Pesquisar transações com:
  - "dominio", "domain", "DNS"
  - Valores ~10-20€ (preço típico .pt)
  - Data próxima ao registo do domínio

### **Opção C: Testar Login nos Principais Fornecedores**

Se tiver o email de registo (que usou para criar conta), tente:

1. **Teste de "Password Esquecida"** (método mais rápido):
   - Ir a cada site abaixo
   - Clicar "Esqueci a password"
   - Inserir o seu email
   - **SE O EMAIL EXISTIR**: Receberá email de reset ✅
   - **SE O EMAIL NÃO EXISTIR**: Receberá erro "Email não encontrado" ❌

2. **Sites para testar (Top 5 em Portugal):**

| Fornecedor | URL de Login | Testar "Password Esquecida" |
|------------|--------------|------------------------------|
| **OVH** | https://www.ovh.pt/auth | https://www.ovh.pt/auth/requestPassword |
| **PTisp** | https://www.ptisp.pt/client/ | https://www.ptisp.pt/client/password-reset |
| **Claranet** | https://cliente.claranet.pt | Clicar "Recuperar password" |
| **Hoster.pt** | https://hoster.pt/cliente/login | Clicar "Esqueceu?" |
| **Aforamento** | https://www.aforamento.pt/login | Clicar "Perdeu a password?" |

**Vantagem:** Em 5-10 minutos descobre qual é o registrar sem procurar emails!

### **Opção D: Contactar DNS.PT**
```
Para: suporte@dns.pt
Assunto: Recuperar informação de Registrar - quest4couple.pt

Olá,

Sou o titular do domínio quest4couple.pt mas perdi acesso 
ao painel de gestão e o WHOIS está em modo privado.

Dados do titular:
- Nome: [SEU NOME]
- Email: [SEU EMAIL]
- NIF/Contribuinte: [SEU NIF]

Podem ajudar-me a identificar qual o registrar/entidade 
gestora deste domínio para recuperar o acesso?

Obrigado
```

---

## 📱 DICA EXTRA: Verificar Apps de Email no Telemóvel

Se usa email no telemóvel, procure lá também:
- Gmail app → Pesquisar "quest4couple.pt"
- Outlook app → Pesquisar "quest4couple.pt"

---

## 🎯 MÉTODO RECOMENDADO (MAIS RÁPIDO):

### **PASSO 1: Testar "Password Esquecida"** ⏱️ 10 minutos
- Ir aos 5 sites principais (OVH, PTisp, Claranet, Hoster, Aforamento)
- Testar recuperação de password com o seu email
- O que responder → É esse o registrar! ✅

### **PASSO 2: Se não funcionar, procurar nos emails** ⏱️ 30 minutos
- Gmail/Outlook: pesquisar "quest4couple.pt"
- Procurar emails de renovação/confirmação

### **PASSO 3: Verificar extratos bancários** ⏱️ 20 minutos
- Homebanking: últimos 12-24 meses
- Procurar pagamentos ~10-20€ com nomes de registrars

### **PASSO 4: Contactar DNS.PT** ⏱️ 24-48h resposta
- Enviar email com dados do titular
- Aguardar confirmação de qual é o registrar

---

## ✅ DEPOIS DE DESCOBRIR O REGISTRAR:

1. ✅ **Fazer login no painel**
2. ✅ **Ir para "Gestão de Domínios"** ou "DNS"
3. ✅ **Procurar "Nameservers"** ou "Servidores de Nomes"
4. ✅ **Alterar de:**
   ```
   ns1.dnscpanel.com  ❌
   ```
   **Para:**
   ```
   dns1.host-redirect.com
   dns2.host-redirect.com
   dns3.host-redirect.com
   dns4.host-redirect.com
   ```
5. ✅ **Guardar alterações**
6. ✅ **Aguardar 24-48h propagação**
7. ✅ **Executar:** `VERIFICAR_NS_PROPAGACAO.bat`

---

## 📞 PRECISA DE AJUDA?

Se depois de seguir este guia ainda não conseguir:
1. Enviar email para: suporte@dns.pt
2. Mencionar que o WHOIS está privado
3. Fornecer dados de titular (Nome, NIF, Email)
- Apple Mail → Pesquisar "quest4couple.pt"

---

## 🎯 PRÓXIMO PASSO:

Quando descobrir o registrar, volte aqui e:
1. Diga-me qual é (ex: "É o OVH Portugal")
2. Posso dar-lhe instruções específicas para esse fornecedor
3. Ou usar o ficheiro CONTACTAR_REGISTRAR_NS.md para pedir alteração de NS

---

## ⚡ ATALHO RÁPIDO:

Se lembrar onde comprou o domínio (mesmo vagamente):
- "Comprei quando contratei hosting..."
- "Foi junto com o email..."
- "Acho que foi no site X..."

Diga-me e ajudo a confirmar!
