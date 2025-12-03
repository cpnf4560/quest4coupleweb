# 🚨 PROBLEMA CRÍTICO IDENTIFICADO!

## ❌ **OS NAMESERVERS VOLTARAM PARA DNSCPANEL.COM!**

**Data:** 25 Nov 2025, 11:44 AM

---

## 🔍 **DIAGNÓSTICO:**

```powershell
$ nslookup -type=NS quest4couple.pt

quest4couple.pt nameserver = ns1.dnscpanel.com  ❌
quest4couple.pt nameserver = ns2.dnscpanel.com  ❌
quest4couple.pt nameserver = ns3.dnscpanel.com  ❌
```

**PROBLEMA:** Os nameservers voltaram ao servidor ANTIGO!

**EXPLICAÇÃO:** Quando clicaste "Alterar Nameservers" no painel dominios.pt, algo falhou ou a mudança não foi guardada corretamente.

---

## ✅ **SOLUÇÃO (FAZER AGORA):**

### **PASSO 1: Ir ao Painel do Domínio**

URL provável:
- https://dominios.pt
- ou https://host-redirect.com

Login com as tuas credenciais.

---

### **PASSO 2: Procurar quest4couple.pt**

Na lista de domínios, clicar em **quest4couple.pt**

---

### **PASSO 3: Tab NAMESERVERS**

Clicar no tab **"NAMESERVERS"** ou **"Servidores de Nomes"**

---

### **PASSO 4: Verificar Configuração**

**Deve estar assim:**

```
○ Usar nameservers personalizados  ← Se estiver aqui, ESTÁ ERRADO!

● Usar nameservers padrão  ← MUDAR PARA AQUI!

Nameserver 1: dns1.host-redirect.com
Nameserver 2: dns2.host-redirect.com
Nameserver 3: dns3.host-redirect.com
Nameserver 4: dns4.host-redirect.com
```

---

### **PASSO 5: IMPORTANTE - Guardar Corretamente**

1. ✅ Selecionar **"Usar nameservers padrão"** (radio button)
2. ✅ Verificar que os 4 campos estão preenchidos com dns1/2/3/4.host-redirect.com
3. ✅ Clicar botão **"Alterar Nameservers"** (azul)
4. ✅ **AGUARDAR** mensagem de confirmação aparecer
5. ✅ **TIRAR SCREENSHOT** da confirmação (para garantir)
6. ✅ **NÃO FECHAR** o painel imediatamente após clicar

---

### **PASSO 6: Monitorizar Mudança**

Executar este script:

```powershell
.\URGENTE_VERIFICAR_NS.bat
```

O script vai verificar **a cada 2 minutos** se os NS mudaram.

---

## ⏱️ **TIMELINE APÓS CORREÇÃO:**

```
AGORA (11:45):     Corrigir NS no painel
11:47-12:00:       NS começam a propagar
12:00-12:30:       NS totalmente propagados ✅
12:30-13:00:       Netlify deteta mudança
13:00-13:30:       SSL provisionado ✅
13:30:              Site funcional! ✅
```

**Tempo total: 1h30-2h após correção dos NS**

---

## 🤔 **POR QUE ISTO ACONTECEU?**

Possíveis causas:

1. **Timeout na página:** Fechaste a página antes de guardar completamente
2. **Erro do painel:** Bug temporário no sistema dominios.pt
3. **Cache do browser:** Painel mostrou confirmação mas não guardou
4. **Sessão expirada:** Login expirou durante a operação

---

## ✅ **COMO GARANTIR QUE FUNCIONA DESTA VEZ:**

### **Checklist ao Alterar NS:**

- [ ] Fazer login no painel
- [ ] Ir para quest4couple.pt → NAMESERVERS
- [ ] Selecionar "Usar nameservers padrão"
- [ ] Verificar 4 campos preenchidos (dns1/2/3/4.host-redirect.com)
- [ ] Clicar "Alterar Nameservers"
- [ ] **AGUARDAR** aparecer mensagem tipo:
  - "Nameservers atualizados com sucesso" ✅
  - "As alterações podem demorar 24-48h" ✅
  - Qualquer confirmação visual ✅
- [ ] **TIRAR SCREENSHOT** da confirmação
- [ ] **AGUARDAR 30 segundos** antes de fechar
- [ ] Executar `URGENTE_VERIFICAR_NS.bat`

---

## 📊 **SCRIPT DE MONITORIZAÇÃO:**

O script `URGENTE_VERIFICAR_NS.bat` vai mostrar:

```
✅ Quando NS mudarem para host-redirect.com
❌ Enquanto estiverem em dnscpanel.com
⏳ Tempo decorrido
📋 Instruções do que fazer
```

Deixa-o a correr enquanto fazes a mudança!

---

## 🆘 **SE CONTINUAR A FALHAR:**

Se depois de 3 tentativas os NS não mudarem:

### **Opção 1: Contactar Suporte**

Abrir ticket no suporte do painel:

```
Assunto: Impossível alterar nameservers de quest4couple.pt

Olá,

Estou a tentar alterar os nameservers do domínio quest4couple.pt de:
ns1.dnscpanel.com

Para:
dns1.host-redirect.com
dns2.host-redirect.com
dns3.host-redirect.com
dns4.host-redirect.com

Mas após clicar "Alterar Nameservers", as alterações não são 
guardadas e o domínio continua com os nameservers antigos.

Podem verificar e corrigir manualmente?

Obrigado
```

---

### **Opção 2: Usar Netlify DNS**

Se o painel tiver bug persistente, podes usar DNS do Netlify:

1. Mudar NS para:
   ```
   dns1.p09.nsone.net
   dns2.p09.nsone.net
   dns3.p09.nsone.net
   dns4.p09.nsone.net
   ```

2. Configurar TODOS os registos no Netlify:
   - A: quest4couple.pt → 75.2.60.5
   - CNAME: www → admirable-dragon-bf9108.netlify.app
   - A: mail → 94.126.169.39
   - MX: @ → mail.quest4couple.pt (priority 10)
   - TXT: SPF, DMARC

**Desvantagem:** Mais trabalho, mas garante que funciona.

---

## 💡 **DICA IMPORTANTE:**

### **Verificar se há outro local de gestão:**

Pode ser que o domínio seja gerido em **DOIS painéis**:

1. **Painel A (dominios.pt):** Onde COMPRAS/RENOVAS
2. **Painel B (outro):** Onde GERE DNS

Se for este o caso:
- Procurar nos emails de renovação qual é o painel de gestão
- Pode ser diferente do painel de compra!

---

## 📋 **PRÓXIMOS PASSOS:**

1. ✅ **AGORA:** Voltar ao painel e corrigir NS
2. ✅ **Executar:** `URGENTE_VERIFICAR_NS.bat`
3. ✅ **Aguardar:** 15-30 min até NS propagarem
4. ✅ **Quando NS OK:** Executar `MONITORIZAR_SSL.bat`
5. ✅ **Após SSL OK:** Testar https://quest4couple.pt

---

## 🎯 **FOCO:**

**O problema NÃO é o SSL!**
**O problema é que os nameservers voltaram ao servidor antigo!**

Assim que os NS mudarem para host-redirect.com, o resto vai funcionar automaticamente! 🚀

---

**AÇÃO IMEDIATA:** Ir ao painel e alterar NS novamente, **COM ATENÇÃO aos passos acima!**

