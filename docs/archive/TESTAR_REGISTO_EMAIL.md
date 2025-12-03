# 🧪 TESTAR REGISTO EMAIL - GUIA RÁPIDO

**Data:** 27 de Novembro de 2025  
**Correção:** Registo email/password com erro "Missing permissions"  
**Status:** ✅ Código corrigido - Pronto para testar

---

## 🎯 O QUE FOI CORRIGIDO

### Problema
- Registo criava conta no Firebase Auth ✅
- **MAS** falhava ao criar perfil no Firestore ❌
- Redirect acontecia **MESMO COM ERRO** ❌
- Utilizador ficava confuso 😕

### Solução
- ✅ Redirect **APENAS** se perfil Firestore foi criado
- ✅ Timeout de 5s com mensagem clara ao utilizador
- ✅ Logs detalhados para debug
- ✅ Delay maior (2s) para processamento

---

## 🧪 TESTE 1: Cenário Normal (DEVE FUNCIONAR)

### Pré-requisitos
1. **Firestore Rules** corretas no Firebase Console:
   ```javascript
   match /users/{userId} {
     allow create: if request.auth != null && request.auth.uid == userId;
     allow read, update: if request.auth != null && request.auth.uid == userId;
   }
   ```

2. **Firebase Authentication** habilitado para Email/Password

### Passos
1. Abrir `auth.html` no browser
2. Clicar em tab **"Registar"**
3. Preencher formulário:
   - Nome: `Teste User`
   - Username: `testeuser` (minúsculas)
   - Email: `teste@example.com`
   - Password: `Test123456` (mín. 6 caracteres)
   - Sexo: `Masculino`
   - Faixa Etária: `25-34`
   - País: `Portugal`
   - Cidade: `Lisboa`
   - ✅ Aceitar termos

4. Clicar **"Criar Conta"**

### ✅ Resultado Esperado
```
1. Loading spinner aparece
2. Console mostra:
   ✅ User autenticado: teste@example.com
   🔍 User UID: [UID]
   🔵 Chamando createOrUpdateUserProfile...
   💾 Executando userRef.set()...
   ✅ Perfil criado com sucesso!
   ✅ Perfil criado/atualizado no Firestore
   🔄 Redirecionando para dashboard...
   ⏳ Aguardando 2 segundos para Firestore processar...
   ✅ Redirecionando agora...

3. Após 2 segundos → Redirect para dashboard.html
4. Verificar Firestore Console:
   - Coleção: users
   - Documento: [UID do utilizador]
   - Campos: uid, email, displayName, username, gender, etc.
```

---

## 🧪 TESTE 2: Cenário de Erro (DEVE MOSTRAR MENSAGEM)

### Simular Erro
Temporariamente modificar **Firestore Rules** para bloquear criação:

```javascript
match /users/{userId} {
  allow create: if false; // ❌ BLOQUEIA TUDO (apenas para teste)
  allow read, update: if request.auth != null && request.auth.uid == userId;
}
```

⚠️ **Publicar rules no Firebase Console!**

### Passos
1. Abrir `auth.html`
2. Registar com dados diferentes:
   - Email: `teste2@example.com`
   - (resto dos campos...)

3. Clicar **"Criar Conta"**

### ✅ Resultado Esperado
```
1. Loading spinner aparece
2. Console mostra:
   ✅ User autenticado: teste2@example.com
   🔵 Chamando createOrUpdateUserProfile...
   💾 Executando userRef.set()...
   ❌ ========================================
   ❌ ERRO AO CRIAR/ATUALIZAR PERFIL NO FIRESTORE
   ❌ Error code: permission-denied
   ❌ Error message: Missing or insufficient permissions
   🔴 NÃO REDIRECIONAR - Perfil não foi criado!

3. Após 5 segundos:
   - Loading desaparece
   - Mensagem VERMELHA aparece:
     "⚠️ Conta criada mas houve erro ao guardar dados. 
      Por favor contacta suporte ou tenta fazer login novamente."

4. Utilizador FICA em auth.html (não redireciona)
5. Firestore Console:
   - Documento NÃO foi criado (como esperado)
```

⚠️ **NÃO ESQUECER:** Reverter Firestore Rules para o normal depois!

---

## 🔍 LOGS DE DEBUG NO CONSOLE

### Abrir DevTools
- **Chrome/Edge:** F12 ou Ctrl+Shift+I
- **Firefox:** F12 ou Ctrl+Shift+K

### Filtrar Logs
Digite no console filter: `User autenticado` ou `Firestore`

---

## 📊 CHECKLIST DE TESTES

### ✅ Teste 1: Registo Normal
- [ ] Formulário preenchido corretamente
- [ ] Loading spinner aparece
- [ ] Console mostra "✅ Perfil criado com sucesso!"
- [ ] Redirect para dashboard após 2s
- [ ] Perfil criado no Firestore (verificar console)
- [ ] Todos os campos presentes (uid, email, username, gender, etc.)

### ✅ Teste 2: Registo com Erro
- [ ] Firestore Rules modificadas (allow create: false)
- [ ] Loading spinner aparece
- [ ] Console mostra "❌ ERRO AO CRIAR/ATUALIZAR PERFIL"
- [ ] Mensagem de erro aparece após 5s
- [ ] Utilizador FICA em auth.html (não redireciona)
- [ ] Firestore Rules revertidas para o normal

### ✅ Teste 3: Login Após Registo
- [ ] Fazer logout
- [ ] Tentar login com email registado
- [ ] Login deve funcionar
- [ ] Redirect para dashboard

---

## 🚨 PROBLEMAS COMUNS

### 1. "Email already in use"
**Solução:** Usar email diferente ou apagar utilizador no Firebase Console

### 2. Nenhum log aparece no console
**Solução:** 
- Limpar cache do browser (Ctrl+Shift+Delete)
- Fazer hard reload (Ctrl+F5)

### 3. Redirect não acontece mesmo com sucesso
**Solução:**
- Verificar que está em `auth.html` (não `index.html`)
- Verificar console por erros JavaScript

### 4. "Username já em uso"
**Solução:** 
- Usar username diferente
- Ou apagar documento no Firestore Console

---

## 📁 FICHEIROS MODIFICADOS

1. **`js/auth.js`** (linhas ~14-48)
   - onAuthStateChanged com flag `firestoreSuccess`
   - Redirect condicional

2. **`js/auth-ui.js`** (linhas ~226-295)
   - Timeout de segurança (5s)
   - Mensagem de erro ao utilizador

---

## 🎓 APÓS OS TESTES

### Se Teste 1 ✅ (Sucesso)
→ **Código está OK!** 🎉
→ Pode usar em produção
→ Próximo passo: Configurar admin (ver `ACAO_URGENTE_ADMIN.md`)

### Se Teste 1 ❌ (Falha)
→ Verificar:
1. Firestore Rules (copiar do `FIRESTORE_RULES_RECOMENDADAS.md`)
2. Firebase Authentication habilitado
3. Logs no console para ver erro específico

### Se Teste 2 ✅ (Mostra erro corretamente)
→ **Tratamento de erro OK!** 🎉
→ Utilizador será informado se algo correr mal

### Se Teste 2 ❌ (Não mostra erro)
→ Verificar:
1. Console para ver se timeout foi acionado
2. Se mensagem de erro aparece na UI
3. Se loading desaparece

---

## 📞 SUPORTE

Se encontrares problemas, procura por:
- **`CORRECAO_REGISTO_EMAIL_FINAL.md`** - Documentação completa
- **`DEBUG_FIRESTORE_PERMISSIONS.md`** - Debug de permissões
- **Logs no console** - Sempre têm pistas do problema

---

**Boa sorte com os testes!** 🚀
