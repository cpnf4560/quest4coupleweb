# ✅ ATUALIZAÇÃO CREDENCIAIS ADMIN

**Data:** 19 de Novembro de 2025  
**Status:** ✅ CONCLUÍDO

---

## 🔐 CREDENCIAIS ATUALIZADAS

### Antes:
- **Email/Username:** `admin@quest4couple.com`
- **Password:** `admin123`
- **Hash SHA-256:** `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9`

### Depois:
- **Username:** `carlos.sousacorreia`
- **Password:** `rzq7xgq8`
- **Hash SHA-256:** `4effc02996e897cf24f0869b35d39ccff710cd90fcc9c0820ec52803b07aa382`

---

## 📝 FICHEIROS MODIFICADOS

### 1. `auth.js`

#### Alterações:
```javascript
// ANTES:
const ADMIN_EMAIL = 'admin@quest4couple.com';
// Password: admin123 (SHA-256 hash)
const ADMIN_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

function verifyAdminLoginSync(email, password) {
  if (email === ADMIN_EMAIL && password === 'admin123') {
    return true;
  }
  return false;
}

// DEPOIS:
const ADMIN_EMAIL = 'carlos.sousacorreia';
// Password: rzq7xgq8 (SHA-256 hash)
const ADMIN_PASSWORD_HASH = '4effc02996e897cf24f0869b35d39ccff710cd90fcc9c0820ec52803b07aa382';

function verifyAdminLoginSync(email, password) {
  if (email === ADMIN_EMAIL && password === 'rzq7xgq8') {
    return true;
  }
  return false;
}
```

### 2. `pages/admin.html`

#### Alterações:
```html
<!-- ANTES: -->
<label for="adminEmail">Email de Administrador</label>
<input type="email" id="adminEmail" placeholder="admin@quest4couple.com" required>

<!-- DEPOIS: -->
<label for="adminEmail">Username de Administrador</label>
<input type="text" id="adminEmail" placeholder="carlos.sousacorreia" required>
```

**Nota:** Campo alterado de `type="email"` para `type="text"` pois agora é um username, não email.

---

## 🔐 SEGURANÇA

### Hash SHA-256
A password é armazenada de forma segura usando hash SHA-256:

**Comando usado para gerar o hash:**
```powershell
$password = "rzq7xgq8"
$bytes = [System.Text.Encoding]::UTF8.GetBytes($password)
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$hash = $sha256.ComputeHash($bytes)
$hashString = [System.BitConverter]::ToString($hash).Replace("-","").ToLower()
```

**Resultado:** `4effc02996e897cf24f0869b35d39ccff710cd90fcc9c0820ec52803b07aa382`

### Funções de Verificação

#### Assíncrona (com hash):
```javascript
async function verifyAdminLogin(email, password) {
  if (email !== ADMIN_EMAIL) {
    return false;
  }
  
  const passwordHash = await sha256(password);
  return passwordHash === ADMIN_PASSWORD_HASH;
}
```

#### Síncrona (para admin.html):
```javascript
function verifyAdminLoginSync(email, password) {
  if (email === ADMIN_EMAIL && password === 'rzq7xgq8') {
    return true;
  }
  return false;
}
```

---

## 🧪 COMO TESTAR

### 1. Aceder à Página Admin:
```
http://localhost:8080/pages/admin.html
```

### 2. Fazer Login:
- **Username:** `carlos.sousacorreia`
- **Password:** `rzq7xgq8`

### 3. Verificar Acesso:
- ✅ Deve entrar no BackOffice
- ✅ Deve ver dashboard de administração
- ✅ Deve ter acesso a todas as funcionalidades admin

---

## ⚠️ NOTAS IMPORTANTES

### Segurança:
- ⚠️ A password está hardcoded no código (verifyAdminLoginSync)
- ⚠️ Para produção, considere usar apenas a versão async com hash
- ⚠️ Considere implementar autenticação Firebase Admin SDK
- ⚠️ Adicione rate limiting para prevenir brute force

### Recomendações para Produção:
1. **Remover verifyAdminLoginSync** - Usar apenas versão async
2. **Implementar Firebase Admin** - Autenticação mais robusta
3. **Adicionar 2FA** - Two-factor authentication
4. **Logs de acesso** - Registar todas as tentativas de login
5. **Rate limiting** - Limitar tentativas de login
6. **HTTPS obrigatório** - Nunca usar HTTP em produção

---

## 📊 LOCALIZAÇÕES DAS CREDENCIAIS

| Ficheiro | Linha | O quê |
|----------|-------|-------|
| `auth.js` | 29 | `ADMIN_EMAIL` constante |
| `auth.js` | 31 | `ADMIN_PASSWORD_HASH` constante |
| `auth.js` | 40-46 | `verifyAdminLogin()` async |
| `auth.js` | 49-54 | `verifyAdminLoginSync()` sync |
| `pages/admin.html` | 436 | Placeholder do input |

---

## ✅ VALIDAÇÃO

### Checklist:
- [x] Credenciais atualizadas em `auth.js`
- [x] Hash SHA-256 gerado corretamente
- [x] Função async atualizada
- [x] Função sync atualizada
- [x] Placeholder atualizado em `admin.html`
- [x] Campo alterado de email para text
- [x] Label atualizado para "Username"
- [x] Sem erros de sintaxe
- [x] Código testado

---

## 🚀 PRÓXIMOS PASSOS (OPCIONAL)

### Melhorias de Segurança:

1. **Implementar Firebase Admin SDK:**
```javascript
const admin = require('firebase-admin');
admin.initializeApp();

async function verifyAdmin(token) {
  const decodedToken = await admin.auth().verifyIdToken(token);
  const uid = decodedToken.uid;
  const userDoc = await admin.firestore().collection('users').doc(uid).get();
  return userDoc.data().isAdmin === true;
}
```

2. **Adicionar Rate Limiting:**
```javascript
const loginAttempts = new Map();

function checkRateLimit(email) {
  const attempts = loginAttempts.get(email) || 0;
  if (attempts >= 5) {
    throw new Error('Too many login attempts. Try again in 15 minutes.');
  }
  loginAttempts.set(email, attempts + 1);
}
```

3. **Adicionar Logs:**
```javascript
function logAdminAccess(email, success) {
  const log = {
    timestamp: new Date(),
    email: email,
    success: success,
    ip: getUserIP()
  };
  console.log('Admin login attempt:', log);
  // Save to database
}
```

---

## 📅 CHANGELOG

### 19/11/2025 - v2.0.1
- ✅ Credenciais admin atualizadas
- ✅ Username: `carlos.sousacorreia`
- ✅ Password: `rzq7xgq8`
- ✅ Hash SHA-256 gerado
- ✅ Placeholder atualizado
- ✅ Campo type alterado para text

---

## 🔗 ACESSO RÁPIDO

**URL Admin:** `http://localhost:8080/pages/admin.html`

**Credenciais:**
- Username: `carlos.sousacorreia`
- Password: `rzq7xgq8`

---

**Status:** ✅ **CREDENCIAIS ATUALIZADAS COM SUCESSO!**

Pode agora fazer login na página admin com as novas credenciais.

---

**Quest4Couple** - Admin Access Updated 🔐  
*19 de Novembro de 2025*
