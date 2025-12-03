# 🔧 DEBUG - Registo Email (Com Logs Detalhados)

## ✅ CÓDIGO ATUALIZADO

Adicionei **logs de debug detalhados** em `js/auth.js` para descobrir exatamente onde está falhando.

---

## 🧪 TESTAR AGORA

### 1. Recarregar Página
```
1. Fechar test_firestore_permissions.html
2. Abrir novamente (ou dar F5 para recarregar)
3. Isso vai carregar o código atualizado
```

### 2. Testar Registo
```
1. Clicar: "📝 Testar Registo Email"
2. Aguardar 3-5 segundos
3. Verificar TODOS os logs no console
```

---

## 📊 LOGS ESPERADOS

### ✅ SE FUNCIONAR (BOM):
```
📝 Iniciando teste de registo com email...
📧 Criando utilizador: test_XXX@quest4couple.test
✅ Utilizador criado no Firebase Auth: U6Z4pp3AHhOQfGwDc3OqyloTPrt2
✅ Utilizador autenticado: test_XXX@quest4couple.test
✅ DisplayName atualizado
💾 Dados adicionais guardados no sessionStorage
⏳ Aguardando criação do perfil no Firestore...

[onAuthStateChanged disparado]
✅ User autenticado: test_XXX@quest4couple.test
🔍 User UID: U6Z4pp3AHhOQfGwDc3OqyloTPrt2
🔍 User displayName: Test User
🔵 Chamando createOrUpdateUserProfile...
🔵 Criando/atualizando perfil para: test_XXX@quest4couple.test
📦 Dados pendentes encontrados: {gender: "male", ageRange: "25-34", ...}
🔍 Database (db): [object Object]
🔍 User UID para Firestore: U6Z4pp3AHhOQfGwDc3OqyloTPrt2
🔍 UserRef criado: users/U6Z4pp3AHhOQfGwDc3OqyloTPrt2
📖 Verificando se perfil já existe...
📖 Documento existe? false
🔵 Perfil não existe, criando novo...
📝 Dados do perfil a criar: {uid: "U6Z4pp3AHhOQfGwDc3OqyloTPrt2", email: "test@...", ...}
🔐 Auth UID: U6Z4pp3AHhOQfGwDc3OqyloTPrt2
🔐 Document ID: U6Z4pp3AHhOQfGwDc3OqyloTPrt2
✅ UIDs coincidem? true
💾 Executando userRef.set()...
✅ Perfil criado com sucesso!
✅ Perfil criado/atualizado no Firestore
```

### ❌ SE FALHAR (VAI MOSTRAR ERRO):
```
[... logs iniciais iguais ...]
💾 Executando userRef.set()...
❌ ========================================
❌ ERRO AO CRIAR/ATUALIZAR PERFIL NO FIRESTORE
❌ ========================================
❌ Error object: FirebaseError {...}
❌ Error code: permission-denied
❌ Error message: Missing or insufficient permissions.
❌ Error name: FirebaseError
❌ Error stack: [stack trace completo]
❌ ========================================
❌ User UID: U6Z4pp3AHhOQfGwDc3OqyloTPrt2
❌ User email: test_XXX@quest4couple.test
❌ Auth state: Authenticated
❌ ========================================
```

---

## 🔍 ANÁLISE DOS LOGS

### Se aparecer: `❌ Error code: permission-denied`
**PROBLEMA:** Firestore Rules estão a bloquear

**SOLUÇÃO:**
1. Abrir Firebase Console → Firestore Database → Rules
2. Verificar se tem esta regra:
   ```javascript
   match /users/{userId} {
     allow create: if request.auth != null && request.auth.uid == userId;
   }
   ```
3. Se não tiver, adicionar e clicar "Publish"
4. **AGUARDAR 2 MINUTOS**
5. Testar novamente

### Se aparecer: `❌ Database (db): undefined`
**PROBLEMA:** Firestore não está carregado

**SOLUÇÃO:**
1. Verificar se `firebase-config.js` está carregado
2. Verificar ordem dos scripts no HTML

### Se aparecer: `❌ Auth state: NOT authenticated`
**PROBLEMA:** Utilizador não está autenticado quando tenta escrever

**SOLUÇÃO:** (já implementado no código atual)

### Se aparecer: `📖 Documento existe? true`
**PROBLEMA:** Perfil já existe (teste anterior)

**SOLUÇÃO:**
1. Eliminar utilizador no Firebase Console → Authentication
2. Eliminar documento no Firestore Database → users
3. Testar novamente

---

## 📞 PRÓXIMO PASSO

**👉 TESTAR AGORA** e **COPIAR TODOS OS LOGS** que aparecerem no console!

Os logs vão revelar exatamente onde está o problema.

---

## 🎯 CENÁRIOS POSSÍVEIS

### Cenário A: "permission-denied"
→ Firestore Rules (ver ficheiro `RESOLVER_REGISTO_EMAIL.md`)

### Cenário B: "db is undefined"
→ Firebase não carregou (verificar scripts)

### Cenário C: Nenhum log de erro, mas perfil não criado
→ onAuthStateChanged não está sendo chamado (verificar código)

### Cenário D: Perfil criado com sucesso
→ 🎉 Problema resolvido!

---

**Data:** 27 de Novembro de 2025 22:30  
**Prioridade:** 🔴 URGENTE  
**Tempo:** 2 minutos  
**Action:** Recarregar página e testar novamente
