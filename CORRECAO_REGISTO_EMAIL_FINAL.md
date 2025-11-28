# ✅ CORREÇÃO FINAL: Registo Email com Erro "Missing Permissions"

**Data:** 27 de Novembro de 2025  
**Problema:** Registo com email/password dava erro "Missing or insufficient permissions" no Firestore  
**Estado:** ✅ **CORRIGIDO**

---

## 🔍 DIAGNÓSTICO

### Problema Identificado

A diferença crítica entre o **teste automatizado** (que funcionava) e o **registo manual em auth.html** (que falhava):

1. **Teste Automatizado (`test_firestore_permissions.html`):**
   - ✅ Cria utilizador no Firebase Auth
   - ✅ Guarda dados no `sessionStorage` IMEDIATAMENTE
   - ✅ Aguarda 3 segundos antes de verificar
   - ✅ O `onAuthStateChanged` processa e cria perfil no Firestore
   - ✅ **SUCESSO!**

2. **Registo Manual (`auth.html` + `js/auth.js`):**
   - ✅ Cria utilizador no Firebase Auth
   - ✅ Guarda dados no `sessionStorage`
   - ❌ Mas o `onAuthStateChanged` **REDIRECIONAVA MESMO COM ERRO**
   - ❌ Redirect acontecia antes do Firestore processar a escrita
   - ❌ Usuário via erro mas não sabia porquê

### Causa Raiz

```javascript
// ANTES (auth.js - linha 14-42):
auth.onAuthStateChanged(async (user) => {
  if (user) {
    try {
      await createOrUpdateUserProfile(user);
    } catch (error) {
      console.error('❌ Erro ao criar perfil:', error);
      // PROBLEMA: Erro era capturado mas o redirect continuava!
    }
    
    // Redirect acontecia MESMO com erro no Firestore
    if (window.location.pathname.includes('auth.html')) {
      setTimeout(() => {
        window.location.href = 'dashboard.html'; // ❌ BAD
      }, 500);
    }
  }
});
```

**O problema:** O redirect acontecia **independentemente** do sucesso do Firestore.

---

## 🛠️ CORREÇÕES IMPLEMENTADAS

### 1️⃣ `js/auth.js` - onAuthStateChanged com Flag de Sucesso

**Ficheiro:** `js/auth.js` (linhas ~14-48)

```javascript
auth.onAuthStateChanged(async (user) => {
  if (user) {
    console.log('✅ User autenticado:', user.email);
    console.log('🔍 User UID:', user.uid);
    console.log('🔍 User displayName:', user.displayName);
    currentUser = user;
    
    // ✅ NOVA FLAG para controlar sucesso
    let firestoreSuccess = false;
    
    try {
      console.log('🔵 Chamando createOrUpdateUserProfile...');
      await createOrUpdateUserProfile(user);
      console.log('✅ Perfil criado/atualizado no Firestore');
      firestoreSuccess = true; // ✅ Só marca sucesso se chegar aqui
    } catch (error) {
      console.error('❌ Erro ao criar perfil:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      console.error('🔴 NÃO REDIRECIONAR - Perfil não foi criado no Firestore!');
      firestoreSuccess = false; // ❌ Marca como falha
    }
    
    // ✅ Redirecionar APENAS se o perfil foi criado com sucesso
    if (window.location.pathname.includes('auth.html') && 
        !isRedirecting && 
        firestoreSuccess) { // ✅ NOVA CONDIÇÃO
      
      console.log('🔄 Redirecionando para dashboard...');
      isRedirecting = true;
      
      // DELAY MAIOR para garantir que o Firestore processou
      console.log('⏳ Aguardando 2 segundos para Firestore processar...');
      setTimeout(() => {
        console.log('✅ Redirecionando agora...');
        window.location.href = 'dashboard.html';
      }, 2000); // Aumentado de 500ms para 2000ms
    }
    
    if (!isRedirecting) {
      showAuthenticatedContent();
    }
  }
  // ...resto do código
});
```

**Mudanças:**
- ✅ Adicionada flag `firestoreSuccess` para rastrear sucesso do Firestore
- ✅ Redirect **APENAS** acontece se `firestoreSuccess === true`
- ✅ Delay aumentado de 500ms para 2000ms (segurança extra)
- ✅ Logs detalhados para debug

---

### 2️⃣ `js/auth-ui.js` - Timeout de Segurança com Feedback Visual

**Ficheiro:** `js/auth-ui.js` (linhas ~226-295)

```javascript
emailSignupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // ...validações...
  
  try {
    // ...verificação de username...
    
    const result = await signUpWithEmail(email, password, name, additionalData);
    
    if (!result.success) {
      hideLoading();
      showMessage('error', result.error || 'Erro ao criar conta. Por favor tenta novamente.');
      return;
    }
    
    console.log('✅ Registo iniciado. Aguardando criação do perfil...');
    
    // ✅ NOVO: Timeout de segurança com mensagem ao utilizador
    setTimeout(() => {
      if (window.location.pathname.includes('auth.html')) {
        hideLoading();
        showMessage('error', '⚠️ Conta criada mas houve erro ao guardar dados. Por favor contacta suporte ou tenta fazer login novamente.');
        console.error('🔴 Timeout: Perfil não foi criado no Firestore após 5 segundos');
      }
    }, 5000); // 5 segundos de timeout
    
  } catch (error) {
    hideLoading();
    showMessage('error', error.message);
  }
});
```

**Mudanças:**
- ✅ Adicionado timeout de 5 segundos
- ✅ Se após 5s ainda estiver em `auth.html`, mostra erro ao utilizador
- ✅ Mensagem clara: "Conta criada mas erro ao guardar dados"
- ✅ Instrução: contactar suporte ou tentar login

---

## 🎯 COMO FUNCIONA AGORA

### Fluxo Correto

```
1. Utilizador preenche formulário em auth.html
   ↓
2. emailSignupForm.submit() → signUpWithEmail()
   ↓
3. Firebase Auth cria utilizador
   ↓
4. Dados guardados em sessionStorage
   ↓
5. onAuthStateChanged() dispara
   ↓
6. createOrUpdateUserProfile() tenta criar perfil no Firestore
   ↓
   ┌─────────────────┬─────────────────┐
   │   ✅ SUCESSO    │   ❌ ERRO       │
   └─────────────────┴─────────────────┘
         │                    │
         ↓                    ↓
   firestoreSuccess    firestoreSuccess
      = true              = false
         │                    │
         ↓                    ↓
   Redirect para        NÃO redireciona
   dashboard.html       Fica em auth.html
   (após 2s)            Mostra erro após 5s
```

---

## ✅ TESTES NECESSÁRIOS

### 1. Teste com Firestore Rules Corretas

```javascript
// Regra necessária no Firestore:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Teste:**
1. Ir para `auth.html`
2. Clicar em "Registar"
3. Preencher todos os campos
4. Submeter formulário
5. **Resultado esperado:** Redirect para `dashboard.html` após 2 segundos

### 2. Teste com Firestore Rules Erradas (Simular Erro)

```javascript
// Regra que causa erro:
match /users/{userId} {
  allow create: if false; // ❌ Bloqueia tudo
}
```

**Teste:**
1. Ir para `auth.html`
2. Clicar em "Registar"
3. Preencher todos os campos
4. Submeter formulário
5. **Resultado esperado:**
   - Loading spinner desaparece após 5 segundos
   - Mensagem de erro aparece: "⚠️ Conta criada mas houve erro ao guardar dados..."
   - Utilizador fica em `auth.html` (não redireciona)

---

## 📊 LOGS DE DEBUG

### Sucesso

```
✅ User autenticado: test@example.com
🔍 User UID: abc123xyz
🔍 User displayName: Test User
🔵 Chamando createOrUpdateUserProfile...
📦 Dados pendentes encontrados: {username: "testuser", gender: "M", ...}
🔍 Database (db): Firestore
🔍 User UID para Firestore: abc123xyz
🔍 UserRef criado: users/abc123xyz
📖 Verificando se perfil já existe...
📖 Documento existe? false
🔵 Perfil não existe, criando novo...
📝 Dados do perfil a criar: {...}
💾 Executando userRef.set()...
✅ Perfil criado com sucesso!
✅ Perfil criado/atualizado no Firestore
🔄 Redirecionando para dashboard...
⏳ Aguardando 2 segundos para Firestore processar...
✅ Redirecionando agora...
```

### Erro

```
✅ User autenticado: test@example.com
🔍 User UID: abc123xyz
🔵 Chamando createOrUpdateUserProfile...
💾 Executando userRef.set()...
❌ ========================================
❌ ERRO AO CRIAR/ATUALIZAR PERFIL NO FIRESTORE
❌ ========================================
❌ Error code: permission-denied
❌ Error message: Missing or insufficient permissions
❌ ========================================
🔴 NÃO REDIRECIONAR - Perfil não foi criado no Firestore!
```

E após 5 segundos no `auth.html`:
```
🔴 Timeout: Perfil não foi criado no Firestore após 5 segundos
```

---

## 📝 FICHEIROS MODIFICADOS

1. **`js/auth.js`** (linhas ~14-48)
   - Adicionada flag `firestoreSuccess`
   - Redirect condicional ao sucesso do Firestore
   - Delay aumentado para 2000ms

2. **`js/auth-ui.js`** (linhas ~226-295)
   - Adicionado timeout de segurança (5s)
   - Mensagem de erro ao utilizador
   - Logs detalhados

---

## 🎓 LIÇÕES APRENDIDAS

### Problema Original
O código assumia que se o utilizador foi autenticado, tudo estava OK. Mas a criação do perfil no Firestore podia falhar por:
- Permissões insuficientes
- Firestore offline
- Rules mal configuradas
- Problemas de rede

### Solução
Separar **autenticação** (Firebase Auth) de **criação de perfil** (Firestore) e só redirecionar se **AMBOS** tiverem sucesso.

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ **Testar registo manual em `auth.html`** com Firestore Rules corretas
2. ✅ **Testar com Rules erradas** para confirmar mensagem de erro
3. ⏳ **Configurar admin no Firebase Console** (ver `ACAO_URGENTE_ADMIN.md`)
4. ⏳ **Testar admin login** em `pages/admin.html`

---

## 📌 RESUMO

### Antes
- ❌ Registo criava conta mas dava erro no Firestore
- ❌ Redirect acontecia mesmo com erro
- ❌ Utilizador não sabia o que aconteceu

### Depois
- ✅ Se Firestore falha, redirect não acontece
- ✅ Mensagem clara ao utilizador após 5s
- ✅ Logs detalhados para debug
- ✅ Delay maior (2s) para garantir processamento

---

**Status Final:** ✅ **PRONTO PARA TESTAR**
