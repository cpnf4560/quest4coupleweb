# 📧 Mensagem para Suporte do Registrar (Alterar Nameservers)

## Para: Suporte do Registrar do Domínio quest4couple.pt

**Assunto:** Alterar Nameservers para quest4couple.pt - URGENTE

---

**Corpo da Mensagem:**

Olá,

Preciso de alterar os **nameservers** do domínio **quest4couple.pt**.

**Nameservers atuais (a remover):**
- ns1.dnscpanel.com
- ns2.dnscpanel.com
- ns3.dnscpanel.com

**Novos nameservers (a adicionar):**
- dns1.host-redirect.com
- dns2.host-redirect.com
- dns3.host-redirect.com
- dns4.host-redirect.com

**Motivo:** Estou a migrar a gestão DNS para outro painel onde já tenho os registos configurados corretamente (website no Netlify + email no servidor atual).

**Urgência:** O website está atualmente inacessível devido a problemas de SSL/DNS.

Podem confirmar quando a alteração estiver aplicada e o tempo estimado de propagação?

Obrigado,
[Seu Nome]
[Seu Email/Telefone]
[Dados de verificação do domínio, se necessário]

---

## 🔍 Como Encontrar o Registrar:

**⚠️ IMPORTANTE: Para domínios .PT, use o WHOIS oficial português!**

1. **Pesquisar WHOIS no DNS.PT:**
   - Ir para: https://www.dns.pt/whois_en.php?domain=quest4couple.pt
   - Procurar por "Registrar" ou "Entidade Gestora"
   - Copiar nome e contacto do fornecedor

2. **Verificar emails de registo:**
   - Procurar por emails com assunto "domain registration" ou "quest4couple.pt"
   - O remetente é o registrar
   - Procurar por: OVH, PTisp, Claranet, Hoster, etc.

3. **Verificar faturas:**
   - Procurar recibos de pagamento do domínio
   - O fornecedor que cobrou é o registrar

4. **Fornecedores comuns em Portugal:**
   - OVH Portugal (ovh.pt)
   - PTisp (ptisp.pt)
   - Claranet (claranet.pt)
   - Hoster.pt
   - Aforamento.pt

---

## ⏱️ Após Mudança de NS:

Aguardar 24-48 horas e verificar:

```powershell
# Verificar NS ativos
nslookup -type=NS quest4couple.pt 8.8.8.8

# Deve retornar:
# dns1.host-redirect.com
# dns2.host-redirect.com
# dns3.host-redirect.com
# dns4.host-redirect.com

# Depois verificar website
nslookup quest4couple.pt 8.8.8.8
# Deve retornar: 75.2.60.5 ✅
```

---

## 📋 Checklist Pós-Mudança:

- [ ] NS propagaram para host-redirect.com
- [ ] Website carrega em https://quest4couple.pt (SSL válido)
- [ ] Email continua funcional (enviar/receber teste)
- [ ] Netlify mostra status "Active" (não "Pending DNS")

