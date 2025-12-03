# 🚨 AÇÃO URGENTE - Corrigir Admin Login

## ❌ PROBLEMA

**Admin login dá erro "Missing or insufficient permissions"** porque não usa Firebase Authentication.

## ✅ SOLUÇÃO APLICADA

Modifiquei o código em `pages/admin.html` para usar Firebase Auth.

---

## 🔧 PASSOS OBRIGATÓRIOS (5 minutos)

### 1️⃣ Criar Utilizador Admin no Firebase (2 min)

```
1. Abrir: https://console.firebase.google.com
2. Selecionar projeto: quest4couple-v2
3. Ir para: Authentication → Users
4. Clicar: "Add user"
5. Preencher:
   - Email: admin@quest4couple.com
   - Password: [PASSWORD_REMOVIDA]
6. Clicar: "Add user"
7. ⚠️ COPIAR O UID DO UTILIZADOR (precisaremos no próximo passo)
```

**Exemplo de UID:** `xYz123AbC456DeF789`

---

### 2️⃣ Criar Perfil Admin no Firestore (2 min)

**📖 Ver guia visual detalhado:** `GUIA_VISUAL_FIRESTORE.md`

```
1. No Firebase Console, ir para: Firestore Database
2. Ir para collection: users
3. Clicar: "Add document"
4. Document ID: [COLAR O UID COPIADO]
5. Adicionar campos (ver instruções detalhadas abaixo):
```

**⚠️ INSTRUÇÕES DETALHADAS:**

Para adicionar cada campo no Firestore Console:

1. **uid** (string)
   - Clicar: "Add field"
   - Field name: `uid`
   - Field type: `string`
   - Field value: [COLAR O UID que copiou]

2. **email** (string)
   - Clicar: "Add field"
   - Field name: `email`
   - Field type: `string`
   - Field value: `admin@quest4couple.com`

3. **displayName** (string)
   - Clicar: "Add field"
   - Field name: `displayName`
   - Field type: `string`
   - Field value: `Admin Quest4Couple`

4. **isAdmin** (boolean) ← **CRÍTICO!**
   - Clicar: "Add field"
   - Field name: `isAdmin`
   - Field type: `boolean`
   - Field value: ✅ `true` (marcar checkbox ou toggle)

5. **createdAt** (timestamp)
   - Clicar: "Add field"
   - Field name: `createdAt`
   - Field type: `timestamp`
   - Field value: Clicar no ícone de calendário e selecionar data/hora atual
   - OU deixar vazio por agora (será preenchido automaticamente no primeiro login)

6. **authProvider** (string)
   - Clicar: "Add field"
   - Field name: `authProvider`
   - Field type: `string`
   - Field value: `password` ← (escrever a palavra "password", NÃO é a senha!)

```
7. Clicar: "Save"
```

**📝 NOTA:** 
- `authProvider` = `password` significa que o utilizador usa **email/password** para login (não Google, não Facebook, etc.)
- **NÃO** é para colocar a senha `[PASSWORD_REMOVIDA]` aqui!
- Se não conseguir adicionar `createdAt`, pode pular este campo (será adicionado automaticamente)

---

### 3️⃣ Testar Login Admin (1 min)

```
1. Abrir: /pages/admin.html
2. Inserir credenciais:
   - Username: admin@quest4couple.com
     OU
   - Username: admin
   (ambos funcionam!)
   
   - Password: [PASSWORD_REMOVIDA]
   
3. Clicar: "Login"
4. Abrir DevTools (F12) → Console
5. Verificar logs:
```

#### ✅ Logs Esperados:
```
🔐 Tentativa de login admin...
👤 Username/Email inserido: admin
📧 Email para autenticação: admin@quest4couple.com
🔑 Autenticando com Firebase Auth...
✅ Utilizador autenticado: admin@quest4couple.com
🔍 Verificando se é admin...
✅ Admin confirmado!
📊 A mostrar dashboard...
```

---

## 🔄 ALTERNATIVA: Promover Utilizador Existente

Se **já tem conta registada** e quer torná-la admin:

```javascript
// Executar no Console do Browser (F12):

// Obter UID (se não souber):
auth.currentUser.uid

// Promover a admin:
db.collection('users').doc('SEU_UID_AQUI').update({
  isAdmin: true
}).then(() => {
  console.log('✅ Promovido a admin!');
  alert('Agora é administrador! Faça logout e login novamente.');
}).catch(error => {
  console.error('❌ Erro:', error);
});
```

---

## 🎯 COMO FUNCIONA AGORA

### Antes (❌ ERRADO):
```javascript
// Verificava username/password no frontend
if (username === 'admin' && password === 'senha') {
  showDashboard(); // ❌ SEM autenticação Firebase!
}
```

### Agora (✅ CORRETO):
```javascript
// 1. Autentica com Firebase Auth
const user = await auth.signInWithEmailAndPassword(email, password);

// 2. Verifica se isAdmin === true no Firestore
const userDoc = await db.collection('users').doc(user.uid).get();

if (userDoc.data().isAdmin === true) {
  showDashboard(); // ✅ COM autenticação Firebase!
}
```

---

## ✅ VANTAGENS DA NOVA SOLUÇÃO

1. ✅ **Autenticação real** com Firebase Auth
2. ✅ **Token válido** para aceder Firestore
3. ✅ **Sem erros de permissões**
4. ✅ **Mais seguro** (hash de password no servidor)
5. ✅ **Suporta username ou email** no login
6. ✅ **Mensagens de erro claras**

---

## 🧪 TESTAR REGISTO EMAIL

Depois de configurar admin:

```
1. Abrir: /auth.html
2. Tab "Registar"
3. Preencher formulário com email novo
4. Verificar se cria perfil no Firestore sem erros
```

---

## 📊 CHECKLIST FINAL

- [ ] **Passo 1:** Criar utilizador admin no Firebase Auth
- [ ] **Passo 2:** Criar documento admin no Firestore (`isAdmin: true`)
- [ ] **Passo 3:** Testar admin login
- [ ] **Passo 4:** Verificar dashboard carrega
- [ ] **Passo 5:** Testar registo de novo utilizador
- [ ] **Logs corretos no console**

---

## 🐛 SE AINDA DER ERRO

### Erro: "auth/user-not-found"
- ❌ Utilizador não foi criado no Firebase Auth
- ✅ Repetir Passo 1

### Erro: "Não é administrador"
- ❌ Campo `isAdmin` não está `true` no Firestore
- ✅ Repetir Passo 2, verificar `isAdmin: true`

### Erro: "Missing permissions" (ainda)
- ❌ Firestore Rules não estão publicadas
- ✅ Ver ficheiro: `DEBUG_FIRESTORE_PERMISSIONS.md`

---

## 📞 PRÓXIMO PASSO

**👉 EXECUTAR PASSO 1 AGORA** (criar utilizador admin no Firebase Console)

Depois disso, admin login e registo email devem funcionar perfeitamente!

---

**Data:** 27 de Novembro de 2025  
**Prioridade:** 🔴 CRÍTICO  
**Tempo:** 5 minutos  
**Estado:** ✅ Código corrigido | ⏳ Aguardando configuração Firebase

