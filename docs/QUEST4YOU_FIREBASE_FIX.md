# 🔧 Correção Firebase - Quest4You BackOffice

**Data:** 4 de Abril de 2026  
**Problema:** BackOffice do Quest4You dá erros "Missing or insufficient permissions"  
**Causa:** Os dois projetos (Quest4Couple e Quest4You) partilham o mesmo projeto Firebase, mas as regras do Firestore não cobrem todas as coleções que o Quest4You precisa.

---

## 📋 PROMPT PARA USAR NO QUEST4YOU

Copia e cola este prompt quando abrires o projeto Quest4You:

```
O backoffice do Quest4You está a dar erros de "Missing or insufficient permissions" no Firebase.

Este projeto partilha o mesmo Firebase com o Quest4Couple. As regras do Firestore estão em:
C:\Users\carlo\Documents\Projetos\Quest4Couple_v3\firestore.rules

Os erros na consola são:
- getUsersCount: Missing or insufficient permissions
- getResponsesCount: Missing or insufficient permissions  
- getCompletedQuizzesCount: Missing or insufficient permissions
- getActiveMatchesCount: Missing or insufficient permissions
- loadRecentActivity: Missing or insufficient permissions
- loadQuizStatistics: Missing or insufficient permissions
- checkPendingValidations: Missing or insufficient permissions
- getRegistersToday: Missing or insufficient permissions
- getLoginsToday: Missing or insufficient permissions
- getMatchesToday: Missing or insufficient permissions

Preciso que:
1. Analises o ficheiro admin.js do Quest4You para identificar TODAS as coleções Firestore que usa
2. Me digas quais coleções precisam de regras novas
3. Cries as regras necessárias para adicionar ao firestore.rules do Quest4Couple

IMPORTANTE: O utilizador admin é verificado pelo campo isAdmin no documento do user em Firestore.
O email do admin é: carlos.sousacorreia@gmail.com

As regras atuais já têm estas coleções para Quest4You:
- quest4you_users
- quest4you_results  
- quest4you_public

Mas provavelmente faltam mais coleções que o backoffice precisa.
```

---

## 🔍 ERROS DETETADOS (Console Log)

```
admin.js:484 Error counting users: FirebaseError: Missing or insufficient permissions.
admin.js:507 Error counting responses: FirebaseError: Missing or insufficient permissions.
admin.js:529 Error counting completed quizzes: FirebaseError: Missing or insufficient permissions.
admin.js:542 Error counting active matches: FirebaseError: Missing or insufficient permissions.
admin.js:584 Error loading recent activity: FirebaseError: Missing or insufficient permissions.
admin.js:651 Error loading quiz statistics: FirebaseError: Missing or insufficient permissions.
admin.js:2303 Error checking pending validations: FirebaseError: Missing or insufficient permissions.
admin.js:421 Error counting registers today: FirebaseError: Missing or insufficient permissions.
admin.js:446 Error counting logins today: FirebaseError: Missing or insufficient permissions.
admin.js:473 Error counting matches today: FirebaseError: Missing or insufficient permissions.
```

---

## 📁 LOCALIZAÇÃO DOS FICHEIROS

| Ficheiro | Caminho |
|----------|---------|
| **Regras Firestore** | `C:\Users\carlo\Documents\Projetos\Quest4Couple_v3\firestore.rules` |
| **Admin.js Quest4You** | `C:\Users\carlo\Documents\Projetos\Quest4You_v1\js\admin.js` (ou similar) |
| **Firebase Config** | Partilhado entre os dois projetos |

---

## 📊 REGRAS ATUAIS PARA QUEST4YOU (no firestore.rules)

```javascript
// ========================================
// QUEST4YOU - USER PROFILES
// ========================================
match /quest4you_users/{userId} {
  // Utilizador pode ler/escrever o seu próprio perfil
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// ========================================
// QUEST4YOU - QUIZ RESULTS
// ========================================
match /quest4you_results/{resultId} {
  // Utilizador pode escrever os seus próprios resultados
  allow create: if request.auth != null;
  allow read, update, delete: if request.auth != null && 
                                 resource.data.userId == request.auth.uid;
}

// ========================================
// QUEST4YOU - PUBLIC PROFILES (Smart Match)
// ========================================
match /quest4you_public/{profileId} {
  // Qualquer utilizador autenticado pode ler perfis públicos
  allow read: if request.auth != null;
  // Utilizador só pode criar/editar o seu próprio perfil público
  allow create: if request.auth != null && request.auth.uid == profileId;
  allow update, delete: if request.auth != null && request.auth.uid == profileId;
}
```

---

## ⚠️ PROBLEMA PRINCIPAL

A regra final no `firestore.rules` bloqueia TUDO que não está explicitamente definido:

```javascript
// ========================================
// BLOQUEAR TUDO O RESTO
// ========================================
match /{document=**} {
  allow read, write: if false;
}
```

**Isto significa:** Qualquer coleção que o Quest4You use e que NÃO esteja listada nas regras será bloqueada!

---

## 🎯 COLEÇÕES QUE PROVAVELMENTE FALTAM

Baseado nos nomes das funções com erro, estas são as coleções prováveis que precisam de regras:

| Função | Coleção Provável | Operação |
|--------|------------------|----------|
| `getUsersCount` | `users` ou `quest4you_users` | read (query/count) |
| `getResponsesCount` | `responses` ou `quest4you_responses` | read (query/count) |
| `getCompletedQuizzesCount` | `quiz_completions` ou `quest4you_completions` | read (query/count) |
| `getActiveMatchesCount` | `matches` ou `quest4you_matches` | read (query/count) |
| `loadRecentActivity` | `activity` ou `quest4you_activity` | read (query) |
| `loadQuizStatistics` | `quiz_statistics` ou `quest4you_statistics` | read |
| `checkPendingValidations` | `validations` ou `pending_validations` | read (query) |
| `getRegistersToday` | `users` (filtro por data) | read (query) |
| `getLoginsToday` | `user_logins` ou `activity` | read (query) |
| `getMatchesToday` | `matches` (filtro por data) | read (query) |

---

## 🔧 TEMPLATE PARA NOVAS REGRAS

Depois de identificares as coleções no `admin.js`, adiciona regras como estas antes do `match /{document=**}`:

```javascript
// ========================================
// QUEST4YOU - [NOME DA COLEÇÃO]
// ========================================
match /quest4you_[colecao]/{docId} {
  // Admins podem ler tudo
  allow read: if request.auth != null && 
                 get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
  
  // Utilizadores podem ler/escrever os seus próprios documentos
  allow read, write: if request.auth != null && 
                        resource.data.userId == request.auth.uid;
}
```

---

## ✅ SOLUÇÃO ALTERNATIVA (Mais Limpa)

Se o Quest4You usar as mesmas coleções que o Quest4Couple (`users`, `responses`, `matches`, etc.), a solução é modificar as regras existentes para permitir que **admins** façam queries a essas coleções.

Exemplo para a coleção `users`:

```javascript
match /users/{userId} {
  // ... regras existentes ...
  
  // ADICIONAR: Admins podem ler QUALQUER user (para backoffice)
  allow read: if request.auth != null && 
                 get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
}
```

---

## 📝 NOTAS IMPORTANTES

1. **Verificar isAdmin:** O sistema já verifica `isAdmin` via Firestore field (linha do log: "✅ User is admin via Firestore field")

2. **O admin está autenticado:** O utilizador está a fazer login corretamente, o problema é apenas nas permissões de leitura das coleções

3. **Não separar projetos Firebase:** Se quiseres manter tudo num só projeto Firebase, tens de garantir que TODAS as coleções usadas por ambos os projetos têm regras adequadas

4. **Prefixo quest4you_:** Se o Quest4You usa coleções com prefixo `quest4you_`, adiciona regras específicas para elas

---

## 🚀 PASSOS A SEGUIR

1. Abre o projeto Quest4You no VS Code
2. Cola o prompt acima
3. Deixa o Copilot analisar o `admin.js` para identificar as coleções exatas
4. Adiciona as regras ao `firestore.rules` do Quest4Couple
5. Faz deploy das regras: `firebase deploy --only firestore:rules`
6. Testa o backoffice do Quest4You

---

*Ficheiro criado para transferir contexto entre sessões de chat*
