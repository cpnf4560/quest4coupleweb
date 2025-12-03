# 🚀 CONFIGURAR DNS DO .COM - GUIA RÁPIDO

## 📋 ESTADO ATUAL:

✅ Netlify configurado (ambos domínios adicionados)
❌ DNS do .COM ainda não está configurado (timeout)
⏳ DNS do .PT em propagação

---

## ✅ PASSO A PASSO:

### **1. Ir ao Painel de Gestão do .COM**

Provavelmente está no mesmo lugar que o .PT:
- **dominios.pt** ou
- **host-redirect.com**

---

### **2. Procurar quest4couple.com**

Na lista de domínios, clicar em **quest4couple.com**

---

### **3. Configurar Nameservers**

#### **Tab: NAMESERVERS**

```
☑️ Usar nameservers padrão

Nameserver 1: dns1.host-redirect.com
Nameserver 2: dns2.host-redirect.com
Nameserver 3: dns3.host-redirect.com
Nameserver 4: dns4.host-redirect.com
```

**Clicar:** "Alterar Nameservers" (botão azul)

---

### **4. Configurar Registos DNS**

#### **Tab: DNS / RECORDS**

Adicionar estes registos:

| Tipo | Nome | Valor | TTL |
|------|------|-------|-----|
| **A** | @ | 75.2.60.5 | 3600 |
| **CNAME** | www | admirable-dragon-bf9108.netlify.app | 3600 |

**Opcional (se quiseres manter email separado):**
| Tipo | Nome | Valor | Priority | TTL |
|------|------|-------|----------|-----|
| **A** | mail | 94.126.169.39 | - | 3600 |
| **MX** | @ | mail.quest4couple.com | 10 | 3600 |

---

### **5. Guardar e Aguardar**

- ✅ Guardar todas as alterações
- ⏰ Aguardar 15-30 minutos
- 📊 Monitorizar com: `MONITORIZAR_AMBOS_DOMINIOS.bat`

---

## 🔍 VERIFICAR CONFIGURAÇÃO:

### **Imediatamente:**
```powershell
# Ver se DNS foi aplicado
nslookup quest4couple.com 8.8.8.8
```

**Esperado após 15-30 min:**
```
Name:    quest4couple.com
Address:  75.2.60.5
```

---

### **Testar Website:**
```
Abrir: https://quest4couple.com
Abrir: https://www.quest4couple.com
```

**Esperado:**
- ✅ Site carrega sem erro SSL
- ✅ Certificado HTTPS válido (Netlify gera automaticamente)

---

## 📊 MONITORIZAÇÃO AUTOMÁTICA:

Execute este script para acompanhar ambos os domínios:

```powershell
.\MONITORIZAR_AMBOS_DOMINIOS.bat
```

O script vai mostrar:
- ✅ Estado do .PT (nameservers e IP)
- ✅ Estado do .COM (nameservers e IP)
- ⏰ Atualização a cada 5 minutos

---

## ⏱️ TIMELINE ESPERADA:

```
AGORA (configurar):
├─ Definir NS do .COM
├─ Adicionar registos A e CNAME
└─ Clicar "Guardar" / "Alterar Nameservers"

+15-30 MIN:
├─ NS do .COM propagam
└─ Registos DNS começam a responder

+30-60 MIN:
├─ .COM totalmente funcional ✅
└─ .PT também deve estar funcional ✅

+1-2 HORAS:
└─ Ambos domínios 100% operacionais globalmente 🌍
```

---

## ✅ CHECKLIST:

### **Quest4couple.COM:**
- [ ] Nameservers configurados (dns1.host-redirect.com)
- [ ] Registo A: @ → 75.2.60.5
- [ ] Registo CNAME: www → admirable-dragon-bf9108.netlify.app
- [ ] Guardar alterações
- [ ] Aguardar 15-30 min

### **Verificação:**
- [ ] `nslookup quest4couple.com` retorna 75.2.60.5
- [ ] https://quest4couple.com carrega sem erro
- [ ] Netlify mostra "Active" (não "Pending DNS verification")

---

## 🎯 RESULTADO FINAL:

Após configuração completa, terás:

```
✅ quest4couple.pt  → Netlify (75.2.60.5)
✅ quest4couple.com → Netlify (75.2.60.5)
✅ www.quest4couple.pt  → Netlify
✅ www.quest4couple.com → Netlify (primary)
✅ Email continua a funcionar (mail.quest4couple.pt)
```

---

## 🚨 SE TIVERES DÚVIDAS:

1. **Partilha screenshot** do painel DNS do .COM
2. **Executa:** `.\MONITORIZAR_AMBOS_DOMINIOS.bat`
3. **Aguarda** 30 minutos após guardar alterações
4. **Testa:** https://quest4couple.com

---

## 💡 NOTA IMPORTANTE:

O .COM **não precisa de esperar** o .PT propagar!
Podes configurar ambos em paralelo - são independentes! 🚀
