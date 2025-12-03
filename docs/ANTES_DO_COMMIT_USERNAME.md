# ⚠️ ATENÇÃO - LEIA ANTES DE FAZER COMMIT

## 🔴 AÇÃO OBRIGATÓRIA PARA UTILIZADORES EXISTENTES

### Problema Identificado
Os utilizadores já registados na plataforma **não têm o campo `username`** no Firestore, pois essa funcionalidade acabou de ser adicionada.

### Utilizadores Afetados
- **@carloscorreia** (tu)
- **@anairiscandeiasreis** (tua parceira)
- Todos os outros utilizadores já registados

---

## 🎯 OPÇÕES PARA RESOLVER

### **Opção 1: Usar o Admin BackOffice (RECOMENDADO - Mais Rápido)**

1. **Fazer login como Admin:**
   - Ir para: `https://quest4couple.pt/pages/admin.html`
   - Fazer login com credenciais de admin

2. **Executar a migração automática:**
   - Clicar no tab **"👥 Utilizadores"**
   - Verás um alerta amarelo: **"⚠️ Utilizadores sem username: X"**
   - Clicar no botão **"🔧 Migrar Usernames"**
   - Confirmar a operação
   - Aguardar conclusão (mostra progresso na consola)

3. **Resultado:**
   - Todos os utilizadores terão usernames gerados automaticamente
   - Baseados no nome ou email (ex: `carloscorreia`, `anairiscandeiasreis`)
   - Se já existir, adiciona número (ex: `carloscorreia1`)

**Vantagens:**
- ✅ Rápido (1 clique)
- ✅ Processa todos os utilizadores de uma vez
- ✅ Mostra relatório de sucesso/erros
- ✅ Não precisa contactar cada utilizador

---

### **Opção 2: Página Individual de Migração**

Cada utilizador acede e adiciona o próprio username:

1. **Enviar link aos utilizadores:**
   ```
   https://quest4couple.pt/pages/adicionar-username.html
   ```

2. **Utilizador:**
   - Faz login automaticamente
   - Escolhe um username único
   - Sistema valida e guarda
   - Redirecionamento automático para dashboard

**Vantagens:**
- ✅ Utilizador escolhe o próprio username
- ✅ Mais controlo individual

**Desvantagens:**
- ❌ Depende de cada utilizador aceder
- ❌ Mais demorado

---

### **Opção 3: Script na Firebase Console**

Para quem prefere executar manualmente:

1. **Abrir Firebase Console:**
   ```
   https://console.firebase.google.com
   ```

2. **Ir para Firestore Database**

3. **Abrir consola JavaScript do browser (F12)**

4. **Copiar e executar o script:**
   ```javascript
   // O script está em: scripts/migrate-usernames.js
   
   // Verificar estado atual:
   checkUsernameStatus()
   
   // Executar migração:
   migrateUsernames()
   ```

**Vantagens:**
- ✅ Controlo total do processo
- ✅ Pode ver logs detalhados

**Desvantagens:**
- ❌ Mais técnico
- ❌ Requer acesso Firebase Console

---

## 📋 CHECKLIST ANTES DO COMMIT

- [ ] **Escolher uma opção acima e executar**
- [ ] **Verificar no Firebase Console que todos os utilizadores têm `username`:**
  ```
  Firestore → Collection 'users' → Verificar campo 'username'
  ```
- [ ] **Testar adicionar parceiro:**
  - Login como @carloscorreia
  - Ir para relatorio.html
  - Clicar "➕ Adicionar"
  - Procurar: "anairiscandeiasreis"
  - Deve encontrar! ✅

- [ ] **Fazer commit apenas depois de confirmar que funciona**

---

## 🚀 APÓS A MIGRAÇÃO

### O que acontece com novos utilizadores?

**Automaticamente incluído no registo:**
- ✅ Formulário de registo com email → Pede username
- ✅ Registo via Google → Modal pede username
- ✅ Validação de username único
- ✅ Formato correto (minúsculas, números, . e _)

### Fluxo completo:
```
Novo Utilizador
    ↓
Registo (Email ou Google)
    ↓
Preenche campo "Username" ✨ NOVO
    ↓
Sistema valida:
  - Formato correto?
  - Username único?
    ↓
Guarda no Firestore com campo 'username'
    ↓
Pode adicionar parceiros imediatamente! 🎉
```

---

## 📊 VERIFICAÇÃO FINAL

### Como saber se está tudo OK?

1. **No Admin BackOffice:**
   - Tab "Utilizadores"
   - Coluna "Username" deve mostrar `@username` para todos
   - Sem alertas amarelos de "utilizadores sem username"

2. **No Firebase Console:**
   ```javascript
   // Contar utilizadores sem username
   db.collection('users')
     .where('username', '==', null)
     .get()
     .then(snap => console.log('Sem username:', snap.size))
   ```
   - Resultado esperado: **0**

3. **Teste funcional:**
   - Login utilizador A
   - Tentar adicionar utilizador B pelo username
   - Deve funcionar! ✅

---

## ⚠️ IMPORTANTE

### NÃO fazer commit antes de:
1. ✅ Migrar os utilizadores existentes
2. ✅ Testar que a pesquisa por username funciona
3. ✅ Confirmar no Firebase que todos têm username

### Porque?
Se fizeres commit SEM migrar os utilizadores existentes:
- ❌ @carloscorreia não conseguirá adicionar @anairiscandeiasreis
- ❌ @anairiscandeiasreis não conseguirá adicionar @carloscorreia
- ❌ Todos os utilizadores existentes terão que:
  - Aceder à página de migração manual
  - OU esperar que admin execute a migração

---

## 🎯 RECOMENDAÇÃO FINAL

### **Melhor Opção: Opção 1 (Admin BackOffice)**

1. **Antes do commit:**
   ```bash
   # 1. Fazer login no admin
   # 2. Clicar em "🔧 Migrar Usernames"
   # 3. Aguardar conclusão
   # 4. Verificar que funcionou
   ```

2. **Depois do commit:**
   ```bash
   git add .
   git commit -m "fix: Adicionar campo username obrigatório no registo"
   git push origin main
   ```

3. **Resultado:**
   - ✅ Todos os utilizadores têm username
   - ✅ Sistema de adicionar parceiros funcional
   - ✅ Novos registos incluem username automaticamente
   - ✅ Zero problemas para utilizadores existentes

---

## 📞 DÚVIDAS?

Se encontrares algum problema:
1. Verificar consola do browser (F12) para erros
2. Verificar Firebase Console → Firestore
3. Testar com conta de teste primeiro
4. Executar `checkUsernameStatus()` na consola Firebase

---

**Status:** ⚠️ **AGUARDANDO MIGRAÇÃO DOS UTILIZADORES EXISTENTES**  
**Próximo Passo:** Executar Opção 1 (Admin BackOffice) ou Opção 3 (Script Firebase)  
**Depois:** Fazer commit e push

---

**Criado:** 20 Novembro 2025  
**Autor:** GitHub Copilot

