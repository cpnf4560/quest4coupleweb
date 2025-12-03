# 🔧 CORRIGIR: Firebase Auth - Domínio IP não autorizado

## ❌ ERRO:
"Firebase Auth: domínio não autorizado"  
Não consegue fazer login no telemóvel via IP (ex: 192.168.1.100)

---

## ✅ SOLUÇÃO RÁPIDA (2 minutos):

### **Passo 1: Abrir Firebase Console**
```
https://console.firebase.google.com
```

### **Passo 2: Selecionar Projeto**
- Clicar em: **quest4couple**

### **Passo 3: Authentication → Settings**
```
Menu lateral: Authentication
Tab: Settings
Secção: Authorized domains
```

### **Passo 4: Adicionar IP**
1. Clicar: **"Add domain"**
2. Descobrir IP do PC:
   ```powershell
   ipconfig
   ```
   Copiar: `IPv4 Address` (ex: 192.168.1.100)

3. Adicionar domínio:
   ```
   192.168.1.100
   ```

4. Clicar: **"Add"**

5. ✅ **FEITO!**

---

## 📱 TESTAR NO TELEMÓVEL:

1. Abrir: `http://192.168.1.100:5500/auth.html`
2. Login deve funcionar agora
3. ✅ Sem erro de domínio

---

## 🌐 ALTERNATIVA: Usar Netlify (Recomendado)

Em vez de IP local, usar URL público:

### **Já tens deploy no Netlify:**
```
https://quest4couple.netlify.app
```

### **Vantagens:**
- ✅ Funciona em qualquer rede
- ✅ Não precisa configurar IP
- ✅ HTTPS (mais seguro)
- ✅ Já está autorizado no Firebase

### **Testar:**
```
PC: https://quest4couple.netlify.app/app.html
Tel: https://quest4couple.netlify.app/app.html
```

---

**Tempo:** 2 minutos  
**Recomendação:** Usar Netlify para testes multi-dispositivo
