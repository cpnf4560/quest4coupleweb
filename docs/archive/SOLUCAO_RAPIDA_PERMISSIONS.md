# 🚨 SOLUÇÃO RÁPIDA: Missing or insufficient permissions

**Erro:** `Missing or insufficient permissions`  
**Causa:** Firestore Rules não configuradas ou incorretas  
**Solução:** ⏱️ 2 minutos

---

## ✅ SOLUÇÃO PASSO-A-PASSO

### 1️⃣ Abrir Firebase Console
1. Ir para: https://console.firebase.google.com
2. Selecionar projeto: **Quest4Couple**
3. Menu lateral → **Firestore Database**
4. Tab superior → **Rules** (Regras)

---

### 2️⃣ Copiar e Colar o Código Correto

**APAGAR TODO** o código existente e colar este:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========================================
    // USERS COLLECTION - PERMISSÕES CORRETAS
    // ========================================
    match /users/{userId} {
      // Permitir CRIAÇÃO se:
      // - Utilizador está autenticado
      // - UID do documento = UID do utilizador autenticado
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Permitir LEITURA e ATUALIZAÇÃO apenas do próprio perfil
      allow read, update: if request.auth != null && request.auth.uid == userId;
      
      // BLOQUEAR deleção (segurança)
      allow delete: if false;
    }
    
    // ========================================
    // BLOQUEAR TODO O RESTO
    // ========================================
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

### 3️⃣ Publicar as Rules

1. Clicar botão **"Publish"** (ou "Publicar") no topo direito
2. Aguardar confirmação: ✅ "Rules publicadas com sucesso"
3. **IMPORTANTE:** Aguardar **1-2 minutos** para propagação

---

### 4️⃣ Verificar Authentication Habilitado

1. Firebase Console → **Authentication**
2. Tab **"Sign-in method"**
3. Verificar que **"Email/Password"** está **Enabled** (Ativado)
4. Se não estiver:
   - Clicar em "Email/Password"
   - Toggle para **"Enable"**
   - Clicar "Save"

---

### 5️⃣ Testar Novamente

1. **IMPORTANTE:** Limpar cache do browser:
   - Chrome/Edge: `Ctrl+Shift+Delete` → Limpar cache
   - Ou abrir em **modo incógnito** (Ctrl+Shift+N)

2. Ir para `auth.html`

3. Registar novamente com **email DIFERENTE**:
   - Nome: `Teste User`
   - Username: `testeuser2` (diferente!)
   - Email: `teste2@example.com` (diferente!)
   - Password: `Test123456`
   - (resto dos campos...)

4. Clicar **"Criar Conta"**

5. **Resultado esperado:**
   ```
   Console:
   ✅ User autenticado: teste2@example.com
   🔍 User UID: [UID]
   🔵 Chamando createOrUpdateUserProfile...
   💾 Executando userRef.set()...
   ✅ Perfil criado com sucesso!
   🔄 Redirecionando para dashboard...
   ```

6. Após 2 segundos → **Redirect para dashboard.html** ✅

---

## 🔍 SE AINDA DER ERRO

### Verificar Rules no Simulator

1. Firestore Database → Rules
2. Clicar **"Simulator"** no topo
3. Configurar teste:
   - **Location:** `/users/abc123`
   - **Operation:** `create`
   - **Authenticated:** ✅ **Yes**
   - **Auth UID:** `abc123`
4. Clicar **"Run"**

**Resultado esperado:** ✅ **Allowed** (verde)

Se aparecer ❌ **Denied** (vermelho), as rules não estão corretas!

---

## 🎯 CHECKLIST RÁPIDO

- [ ] Firebase Console aberto
- [ ] Firestore Database → Rules
- [ ] Código copiado e colado (APAGAR código antigo)
- [ ] Botão "Publish" clicado
- [ ] Aguardado 1-2 minutos
- [ ] Authentication → Email/Password habilitado
- [ ] Cache do browser limpo (ou modo incógnito)
- [ ] Testar com EMAIL DIFERENTE (não usar email já existente)

---

## ❓ TROUBLESHOOTING

### 1. "Rules não salvam" ou "Syntax error"
**Solução:** Copiar código EXATAMENTE como está acima (incluindo espaços)

### 2. "Erro persiste após publicar rules"
**Solução:** 
- Aguardar mais 2 minutos (propagação demora)
- Limpar cache: `Ctrl+Shift+Delete`
- Testar em modo incógnito

### 3. "Email already in use"
**Solução:** Usar email DIFERENTE (`teste2@example.com`, `teste3@example.com`, etc.)

### 4. Console mostra "permission-denied"
**Solução:** 
- Verificar que rules foram PUBLICADAS (não apenas salvas)
- Verificar Simulator (passo acima)

---

## 📸 COMO DEVE FICAR

### Firebase Console → Firestore → Rules
```
┌─────────────────────────────────────────────────┐
│ Firestore Database > Rules                      │
├─────────────────────────────────────────────────┤
│                                                  │
│ rules_version = '2';                            │
│                                                  │
│ service cloud.firestore {                       │
│   match /databases/{database}/documents {       │
│                                                  │
│     match /users/{userId} {                     │
│       allow create: if request.auth != null ... │
│       allow read, update: if request.auth ...   │
│       allow delete: if false;                   │
│     }                                            │
│                                                  │
│     match /{document=**} {                      │
│       allow read, write: if false;              │
│     }                                            │
│   }                                              │
│ }                                                │
│                                                  │
│ [Publish]  [Simulator]                          │
└─────────────────────────────────────────────────┘
```

---

## ✅ DEPOIS DE PUBLICAR

Aguardar 1-2 minutos, depois:

1. Abrir `auth.html` em **modo incógnito**
2. Tab "Registar"
3. Preencher com **DADOS NOVOS** (email diferente!)
4. Submeter
5. **Deve funcionar!** 🎉

---

## 📞 SE CONTINUAR COM PROBLEMA

Envie screenshot de:
1. Firebase Console → Firestore → Rules (código completo)
2. Browser Console (F12) com o erro
3. Firebase Console → Firestore Database → Data (coleção `users`)

---

**Siga estes passos e vai funcionar!** 🚀

**Tempo estimado:** 2 minutos + 2 minutos de propagação = **4 minutos total**

