# 🚨 GUIA RÁPIDO - CORRIGIR ERROS DE MIGRAÇÃO

## ❌ ERROS ENCONTRADOS:

1. ✅ **`loadData is not defined`** - **CORRIGIDO!**
2. ⚠️ **"Missing or insufficient permissions"** - **PRECISA CORREÇÃO**

---

## ✅ 1. Erro `loadData` - JÁ CORRIGIDO

O código foi atualizado para recarregar os utilizadores corretamente.

**Teste novamente** e este erro não deve aparecer.

---

## ⚠️ 2. Erro de Permissões - PRECISA CORREÇÃO

### 🎯 SOLUÇÃO RÁPIDA (5 minutos):

#### **Passo 1: Abrir Firebase Console**
```
https://console.firebase.google.com
```

1. Selecionar projeto: `quest4couple`
2. Menu lateral: **Firestore Database**
3. Tab: **Rules**

---

#### **Passo 2: Copiar e Colar Regras**

**Apagar tudo** e colar isto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Qualquer autenticado pode ler qualquer user (necessário para pesquisa)
      allow read: if request.auth != null;
      
      // Criar próprio perfil
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Atualizar próprio perfil
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // ✅ ADMIN: Pode fazer tudo
      allow read, write: if request.auth != null && 
        request.auth.token.email == 'carlos.sousacorreia@gmail.com';
    }
    
    // Connections collection
    match /connections/{connectionId} {
      allow read, write: if request.auth != null;
    }
    
    // Analytics collections (apenas admin)
    match /analytics_full_reports/{reportId} {
      allow read: if request.auth != null && 
        request.auth.token.email == 'carlos.sousacorreia@gmail.com';
      allow write: if request.auth != null;
    }
    
    match /analytics_answers/{answerId} {
      allow read: if request.auth != null && 
        request.auth.token.email == 'carlos.sousacorreia@gmail.com';
      allow write: if request.auth != null;
    }
    
    // Outras collections (permissivo para desenvolvimento)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

#### **Passo 3: Publicar**

1. Clicar botão **"Publish"** (canto superior direito)
2. Aguardar mensagem de sucesso (~5 segundos)
3. ✅ **Feito!**

---

#### **Passo 4: Testar Migração Novamente**

1. Voltar ao Live Server: `http://localhost:5500/pages/admin.html`
2. **Fazer logout e login** novamente (para renovar token)
3. Tab "👥 Utilizadores"
4. Clicar "🔧 Migrar Usernames"
5. ✅ **Deve funcionar agora!**

---

## 📊 RESULTADO ESPERADO:

```
Console:
🔄 Migrando 2 utilizadores...
✅ carlos.sousacorreia@gmail.com -> @carlossousacorreia
✅ anairiscandeiasreis@gmail.com -> @anairiscandeiasreis

📊 MIGRAÇÃO CONCLUÍDA
✅ Sucesso: 2 utilizadores
❌ Erros: 0 utilizadores
🎉 Todos os usernames foram adicionados com sucesso!
```

---

## 🔍 VERIFICAR SE FUNCIONOU:

### No Firebase Console:
```
Firestore Database → users collection
```

Verificar que TODOS os documentos têm o campo `username`:
```json
{
  "email": "carlos.sousacorreia@gmail.com",
  "name": "Carlos Correia",
  "username": "carlossousacorreia",  ← ✅ DEVE EXISTIR
  "updatedAt": "..."
}
```

---

## ❓ SE AINDA DER ERRO:

### Opção Alternativa: Atualizar Manualmente no Firebase

1. **Firebase Console** → **Firestore Database**
2. Coleção `users`
3. Para cada utilizador sem username:
   - Clicar no documento
   - Clicar "Add field"
   - Field: `username`
   - Value: `carlossousacorreia` (exemplo)
   - Type: `string`
   - Clicar "Add"

---

## 🎯 PRÓXIMOS PASSOS DEPOIS DA MIGRAÇÃO:

```
1. ✅ Verificar que todos têm username
2. ✅ Testar adicionar parceiro
3. ✅ Fazer commit do código
4. 🎉 DONE!
```

---

**Tempo Estimado:** 5 minutos  
**Dificuldade:** 🟢 Fácil  
**Documentação Completa:** `docs/CORRIGIR_PERMISSOES_FIREBASE.md`

