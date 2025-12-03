# 🔍 VERIFICAÇÃO DE BACKUP FIREBASE - RECUPERAÇÃO URGENTE

**Objetivo:** Tentar recuperar as respostas perdidas do utilizador

---

## 📋 PASSO 1: Identificar o Utilizador

### Informações Necessárias:
- [ ] Email do utilizador
- [ ] UID do Firebase
- [ ] Data/hora aproximada que completou questionário
- [ ] Data/hora que respostas desapareceram

---

## 🔥 PASSO 2: Verificar Firebase Console

### A. Firestore - Histórico de Documentos

1. Aceder: https://console.firebase.google.com
2. Selecionar projeto: **Quest4Couple**
3. Ir para: **Firestore Database**
4. Navegar para: `/users/{uid}/answers/all`
5. **Verificar se documento existe:**
   - ✅ **Existe** → Respostas ESTÃO LÁ (problema é no frontend)
   - ❌ **Não existe** → Foi apagado (tentar backup)

### B. Verificar Activity Log

```
Firebase Console > Firestore > Activity
- Filtrar por: Delete operations
- Filtrar por: Data de hoje
- Procurar: UID do utilizador
```

**Se encontrar DELETE:**
- Verificar timestamp (hora exata)
- Verificar origem (IP, user agent)
- Confirmar se foi o utilizador

---

## 💾 PASSO 3: Verificar Backups

### A. Backup Automático Firebase (SE ATIVADO)

1. **Firebase Console > Settings > Backups**
2. Ver snapshots disponíveis
3. Procurar snapshot de ANTES da perda
4. Restaurar documento específico:

```bash
# Via Firebase CLI
firebase firestore:export gs://[BUCKET]/backup-[DATE]

# Depois importar documento específico
firebase firestore:import gs://[BUCKET]/backup-[DATE] \
  --collection-ids=users
```

### B. Backup Local (Browser do Utilizador)

**Pedir ao utilizador para:**

1. **NÃO FECHAR o browser**
2. Abrir DevTools (F12)
3. Ir para **Application > Local Storage**
4. Procurar por:
   ```
   quest4couple_answers
   quest4couple_custom
   q4c_answers_backup
   ```
5. Copiar TODO o conteúdo
6. Enviar-nos

### C. IndexedDB (Cache do Browser)

**Pedir ao utilizador para:**

1. DevTools (F12)
2. **Application > IndexedDB**
3. Procurar por: `firebaseLocalStorage`
4. Exportar dados
5. Enviar-nos

### D. Service Worker Cache

```javascript
// Correr no Console do browser (F12)
caches.keys().then(keys => {
  keys.forEach(key => {
    caches.open(key).then(cache => {
      cache.keys().then(requests => {
        console.log(`Cache: ${key}`, requests);
      });
    });
  });
});
```

---

## 🔍 PASSO 4: Verificar Cloud Functions Logs

Se tiver Cloud Functions para sync:

```
Firebase Console > Functions > Logs
- Filtrar por: UID do utilizador
- Filtrar por: Data de hoje
- Procurar: Operações de escrita/delete
```

---

## 🛠️ PASSO 5: Recuperação Manual

### Se encontrou dados no localStorage:

```javascript
// Correr no Console do browser
const backup = localStorage.getItem('quest4couple_answers');
if (backup) {
  console.log('✅ BACKUP ENCONTRADO!');
  console.log(JSON.parse(backup));
  
  // Download para ficheiro
  const blob = new Blob([backup], {type: 'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `recovery_${Date.now()}.json`;
  a.click();
}
```

### Restaurar para Firebase:

```javascript
// Script de restauração (correr no Console com auth)
const recoveryData = { /* dados recuperados */ };
const user = auth.currentUser;

await db.collection('users')
  .doc(user.uid)
  .collection('answers')
  .doc('all')
  .set(recoveryData);

console.log('✅ Dados restaurados!');
```

---

## 📊 PASSO 6: Análise de Logs

### Verificar logs do servidor web (Netlify/Cloudflare)

1. Aceder ao dashboard do hosting
2. Verificar **Access Logs** de hoje
3. Procurar por acessos a:
   ```
   /reset_my_answers.html
   ```
4. Se encontrar:
   - Timestamp → hora exata
   - IP → confirmar se é o utilizador
   - User-Agent → device/browser usado

---

## 🚨 PASSO 7: Contactar Utilizador

### Email/Mensagem Template:

```
Assunto: 🚨 URGENTE: Tentativa de Recuperação de Dados - Quest4Couple

Olá [NOME],

Lamentamos imenso o sucedido. Estamos a fazer tudo para recuperar as suas respostas.

🔍 INVESTIGAÇÃO INICIAL:
Identificámos que pode ter acedido acidentalmente à página de "Reset" do sistema.

⚡ AÇÃO URGENTE - POR FAVOR FAÇA AGORA:

1. **NÃO FECHE O BROWSER** onde preencheu o questionário
2. Envie-nos PRINTS das seguintes informações:

📱 No browser onde respondeu:
   a) Pressione F12 (abre Developer Tools)
   b) Vá para aba "Application"
   c) Clique em "Local Storage" → quest4couple.com
   d) Faça print de TUDO que aparecer
   e) Clique em "IndexedDB" → firebaseLocalStorage
   f) Faça print de TUDO

📋 Informações adicionais:
   - Que horas completou o questionário? (aproximadamente)
   - Que horas notou que desapareceu?
   - Acedeu a alguma página de "Reset" ou "Apagar"?
   - Confirma que clicou em algum botão de "Apagar Tudo"?

📂 Verificar Downloads:
   - Procure na pasta Downloads por ficheiros .q4c
   - Nome: Quest4Couple_[SEU_NOME]_2024-11-27.q4c

⏰ Por favor responda o mais rápido possível!
Quanto mais rápido, maior a chance de recuperação.

Muito obrigado,
Equipa Quest4Couple
```

---

## 📞 PASSO 8: Plano B - Re-fazer Questionário

Se recuperação falhar:

### Oferecer compensação:

1. **Guia rápido** para responder novamente
2. **Desconto/Vantagem** em funcionalidade futura
3. **Apoio direto** durante novo preenchimento
4. **Garantia** de que problema foi corrigido

### Implementar melhorias URGENTES:

- [ ] Auto-save a cada resposta ✅ (já existe)
- [ ] Backup local automático a cada 5 respostas
- [ ] Aviso antes de sair da página
- [ ] Confirmação extra para ações destrutivas

---

## ✅ CHECKLIST DE RECUPERAÇÃO

- [ ] Identificar UID do utilizador
- [ ] Verificar Firestore diretamente
- [ ] Ver Activity Logs do Firebase
- [ ] Verificar se existem backups automáticos
- [ ] Pedir ao utilizador para verificar localStorage
- [ ] Pedir ao utilizador para verificar IndexedDB
- [ ] Verificar logs do servidor web
- [ ] Verificar se ficheiro .q4c existe em Downloads
- [ ] Tentar recuperar de cache do browser
- [ ] Se tudo falhar: oferecer re-fazer + compensação

---

## 🎯 PROBABILIDADES DE RECUPERAÇÃO

### Alta (70-90%):
- ✅ Se localStorage tem backup
- ✅ Se IndexedDB tem cache
- ✅ Se Firebase tem backup automático
- ✅ Se ficheiro .q4c foi feito download

### Média (30-70%):
- ⚠️ Se Service Worker tem cache
- ⚠️ Se logs mostram que não foi delete completo

### Baixa (10-30%):
- ❌ Se passou muito tempo (cache limpo)
- ❌ Se localStorage foi limpo manualmente
- ❌ Se não há backups Firebase

### Nula (0%):
- 💀 Se utilizador confirmou delete E limpou cache E não há backups

---

## 📝 NOTAS IMPORTANTES

1. **Tempo é crítico**: Cache pode ser limpo automaticamente
2. **Não fechar browser**: Pode ter dados em memória
3. **Não limpar cache**: Pode destruir última chance de recuperação
4. **Agir rápido**: Cada minuto conta

---

**📅 Criado:** 27 Nov 2024  
**🎯 Objetivo:** Recuperar respostas perdidas  
**⏰ Urgência:** 🔴 MÁXIMA
