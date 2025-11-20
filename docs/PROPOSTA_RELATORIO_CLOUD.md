# 💑 Proposta: Relatório Direto pela Cloud (Sem Ficheiros .q4c)

**Data:** 20 de Novembro de 2025  
**Objetivo:** Eliminar necessidade de ficheiros .q4c para utilizadores autenticados

---

## 🎯 PROBLEMA ATUAL

### Fluxo Atual (com Ficheiros):
```
1. User A responde questionários
2. User A: Guardar → ficheiro .q4c (encriptado)
3. User A: Enviar ficheiro para User B (WhatsApp, email, etc.)
4. User B: Guardar → ficheiro .q4c
5. User B: Enviar ficheiro para User A
6. Ambos: Carregar 2 ficheiros + código no relatorio.html
7. Gerar relatório
```

**Problemas:**
- ❌ Demasiados passos
- ❌ Utilizadores perdem ficheiros
- ❌ Código de segurança esquecido
- ❌ Fricção na experiência
- ❌ Não aproveita autenticação Firebase

---

## ✅ SOLUÇÃO PROPOSTA

### Novo Fluxo (Cloud-First):
```
1. User A: Login + Responde questionários
   → Respostas guardadas automaticamente no Firebase
   
2. User A: Adiciona User B como parceiro (email/username)
   → Connection criada no Firebase
   
3. User B: Aceita conexão
   → Ambos conectados

4. Qualquer um: Dashboard → "Ver Relatório"
   → Busca respostas de ambos no Firebase
   → Gera relatório automaticamente
```

**Vantagens:**
- ✅ Apenas 3 cliques para relatório
- ✅ Sem ficheiros para gerir
- ✅ Sem código de segurança para lembrar
- ✅ Respostas sempre acessíveis
- ✅ Relatórios históricos (se responderem de novo)
- ✅ Sincronização automática

---

## 🏗️ ARQUITETURA

### Firebase Firestore Collections:

#### 1. **users** (já existe)
```javascript
{
  uid: "user123",
  email: "user@example.com",
  displayName: "João",
  photoURL: "...",
  createdAt: Timestamp,
  
  // NOVO: Respostas guardadas aqui
  answers: {
    romantico: {
      q1: { answer: "porfavor", comment: "Adorava!" },
      q2: { answer: "yup", comment: "" }
    },
    experiencia: { ... },
    pimentinha: { ... },
    poliamor: { ... },
    kinks: { ... }
  },
  
  customQuestions: {
    romantico: [...]
  },
  
  lastAnswersUpdate: Timestamp
}
```

#### 2. **connections** (já existe - melhorar)
```javascript
{
  id: "conn123",
  users: ["uid1", "uid2"],
  
  // Estado da conexão
  status: "accepted", // pending, accepted, declined
  
  // Quem iniciou
  initiatedBy: "uid1",
  
  // Quando foi aceite
  acceptedAt: Timestamp,
  
  // Packs partilhados (futuro)
  sharedPacks: ["romantico", "experiencia"],
  
  // Relatórios gerados
  reports: [
    {
      id: "rep1",
      generatedAt: Timestamp,
      compatibility: 85.5,
      url: "reports/conn123_rep1.html" // opcional
    }
  ],
  
  createdAt: Timestamp
}
```

#### 3. **reports** (novo - opcional)
```javascript
{
  id: "rep123",
  connectionId: "conn123",
  user1: "uid1",
  user2: "uid2",
  
  // Snapshot das respostas no momento
  user1Answers: { ... },
  user2Answers: { ... },
  
  // Estatísticas
  compatibility: 85.5,
  totalMatches: 25,
  totalQuestions: 30,
  
  generatedAt: Timestamp,
  
  // Cache do HTML (opcional)
  htmlCache: "..." 
}
```

---

## 🔧 IMPLEMENTAÇÃO

### FASE 1: Guardar Respostas no Firebase

#### 1.1. Nova Função: `saveAnswersToFirebase()`

**Ficheiro:** `js/firestore-sync.js` (novo ou adicionar a `storage.js`)

```javascript
/* ============================================
   GUARDAR RESPOSTAS NO FIREBASE
   ============================================ */

async function saveAnswersToFirebase() {
  if (!auth.currentUser) {
    console.log('User não autenticado - usando localStorage');
    return false;
  }

  try {
    showLoading('💾 A guardar respostas...');
    
    // Obter dados das respostas (função já existe em storage.js)
    const answersData = getAnswersData();
    
    // Guardar no Firestore
    await db.collection('users').doc(auth.currentUser.uid).update({
      answers: answersData.answers,
      customQuestions: answersData.customQuestions,
      lastAnswersUpdate: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    hideLoading();
    
    // Também guardar em localStorage como backup
    localStorage.setItem('q4c_answers_backup', JSON.stringify(answersData));
    
    console.log('✅ Respostas guardadas no Firebase');
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao guardar no Firebase:', error);
    hideLoading();
    
    // Fallback: guardar só em localStorage
    const answersData = getAnswersData();
    localStorage.setItem('q4c_answers_backup', JSON.stringify(answersData));
    
    return false;
  }
}

// Auto-save a cada X segundos (opcional)
let autoSaveInterval = null;

function enableAutoSave(intervalSeconds = 60) {
  if (autoSaveInterval) clearInterval(autoSaveInterval);
  
  autoSaveInterval = setInterval(async () => {
    if (auth.currentUser) {
      await saveAnswersToFirebase();
      console.log('🔄 Auto-save executado');
    }
  }, intervalSeconds * 1000);
}

// Desabilitar auto-save
function disableAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
}
```

#### 1.2. Modificar `app.js` - Guardar ao responder

```javascript
// Quando user responde uma pergunta
document.addEventListener('change', async (e) => {
  if (e.target.matches('input[type="radio"]') || 
      e.target.matches('textarea')) {
    
    // Guardar automaticamente se autenticado
    if (auth?.currentUser && typeof saveAnswersToFirebase === 'function') {
      debounce(saveAnswersToFirebase, 2000)(); // Debounce de 2s
    }
  }
});

// Função debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
```

---

### FASE 2: Carregar Respostas do Firebase

#### 2.1. Nova Função: `loadAnswersFromFirebase()`

```javascript
async function loadAnswersFromFirebase(userId = null) {
  const uid = userId || auth.currentUser?.uid;
  
  if (!uid) {
    console.log('Sem user ID para carregar');
    return null;
  }

  try {
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      console.log('User não encontrado');
      return null;
    }
    
    const userData = userDoc.data();
    
    return {
      userName: userData.displayName || 'Anónimo',
      answers: userData.answers || {},
      customQuestions: userData.customQuestions || {},
      timestamp: userData.lastAnswersUpdate?.toDate().toISOString() || new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Erro ao carregar do Firebase:', error);
    return null;
  }
}
```

---

### FASE 3: Gerar Relatório pela Cloud

#### 3.1. Nova Página: `relatorio-cloud.html`

**Diferença do `relatorio.html`:**
- ❌ Sem upload de ficheiros
- ✅ Dropdown para selecionar parceiro conectado
- ✅ Botão "Gerar Relatório"

```html
<!-- NOVO: Selector de Parceiro -->
<div style="max-width: 700px; margin: 0 auto; padding: 40px;">
  <h2>💑 Gerar Relatório com Parceiro</h2>
  
  <div style="margin: 25px 0;">
    <label>Seleciona o teu parceiro:</label>
    <select id="partnerSelector" style="width: 100%; padding: 15px;">
      <option value="">-- Seleciona --</option>
      <!-- Preenchido dinamicamente com connections -->
    </select>
  </div>
  
  <button onclick="generateCloudReport()" 
          style="width: 100%; padding: 18px; background: #667eea; color: white;">
    🎯 Gerar Relatório
  </button>
</div>

<div id="compatibilityReport" style="display: none;"></div>
```

#### 3.2. JavaScript: `relatorio-cloud.js`

```javascript
/* ============================================
   RELATÓRIO PELA CLOUD
   ============================================ */

// Carregar parceiros conectados
async function loadConnectedPartners() {
  if (!auth.currentUser) {
    window.location.href = 'auth.html';
    return;
  }

  try {
    // Buscar connections do user
    const connectionsSnap = await db.collection('connections')
      .where('users', 'array-contains', auth.currentUser.uid)
      .where('status', '==', 'accepted')
      .get();
    
    const selector = document.getElementById('partnerSelector');
    selector.innerHTML = '<option value="">-- Seleciona --</option>';
    
    for (const doc of connectionsSnap.docs) {
      const conn = doc.data();
      const partnerId = conn.users.find(id => id !== auth.currentUser.uid);
      
      // Buscar info do parceiro
      const partnerDoc = await db.collection('users').doc(partnerId).get();
      const partner = partnerDoc.data();
      
      const option = document.createElement('option');
      option.value = partnerId;
      option.textContent = partner.displayName || partner.email;
      selector.appendChild(option);
    }
    
  } catch (error) {
    console.error('Erro ao carregar parceiros:', error);
    alert('❌ Erro ao carregar parceiros');
  }
}

// Gerar relatório
async function generateCloudReport() {
  const partnerId = document.getElementById('partnerSelector').value;
  
  if (!partnerId) {
    alert('❌ Seleciona um parceiro primeiro!');
    return;
  }

  try {
    showLoading('🔄 A gerar relatório...');
    
    // Carregar respostas do user atual
    const myAnswers = await loadAnswersFromFirebase();
    
    // Carregar respostas do parceiro
    const partnerAnswers = await loadAnswersFromFirebase(partnerId);
    
    if (!myAnswers || !partnerAnswers) {
      throw new Error('Respostas não encontradas');
    }
    
    // Verificar se ambos responderam
    if (Object.keys(myAnswers.answers).length === 0) {
      throw new Error('Ainda não respondeste aos questionários!');
    }
    
    if (Object.keys(partnerAnswers.answers).length === 0) {
      throw new Error('O teu parceiro ainda não respondeu!');
    }
    
    // Gerar relatório (usa função existente em comparison.js)
    await generateCompatibilityReport(myAnswers, partnerAnswers);
    
    hideLoading();
    
    // Guardar relatório na connection (opcional)
    await saveReportToConnection(partnerId, myAnswers, partnerAnswers);
    
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    hideLoading();
    alert(`❌ ${error.message}`);
  }
}

// Guardar relatório gerado (opcional - para histórico)
async function saveReportToConnection(partnerId, myAnswers, partnerAnswers) {
  try {
    // Buscar connection
    const connectionsSnap = await db.collection('connections')
      .where('users', 'array-contains', auth.currentUser.uid)
      .where('status', '==', 'accepted')
      .get();
    
    for (const doc of connectionsSnap.docs) {
      const conn = doc.data();
      if (conn.users.includes(partnerId)) {
        // Adicionar relatório ao histórico
        await doc.ref.update({
          'reports': firebase.firestore.FieldValue.arrayUnion({
            generatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            generatedBy: auth.currentUser.uid
          })
        });
        break;
      }
    }
  } catch (error) {
    console.error('Erro ao salvar relatório:', error);
    // Não crítico, pode falhar silenciosamente
  }
}

// Inicializar ao carregar página
document.addEventListener('DOMContentLoaded', () => {
  auth.onAuthStateChanged(user => {
    if (user) {
      loadConnectedPartners();
    } else {
      window.location.href = 'auth.html';
    }
  });
});
```

---

### FASE 4: Integração no Dashboard

#### 4.1. Adicionar Botão no Dashboard

**Ficheiro:** `dashboard.html`

```html
<!-- Na secção de connections -->
<div class="connection-card">
  <div class="connection-info">
    <img src="..." class="connection-avatar">
    <div>
      <div class="connection-name">Maria</div>
      <div class="connection-email">maria@example.com</div>
    </div>
  </div>
  
  <div class="connection-actions">
    <!-- NOVO BOTÃO -->
    <button class="btn-report" onclick="goToCloudReport('${conn.partnerId}')">
      📊 Ver Relatório
    </button>
    
    <button class="btn-share" onclick="shareWithPartner('${doc.id}', '${partnerProfile.displayName}')">
      📤 Partilhar Packs
    </button>
  </div>
</div>
```

#### 4.2. JavaScript do Dashboard

```javascript
function goToCloudReport(partnerId) {
  // Redirecionar para relatório cloud com partnerId
  window.location.href = `relatorio-cloud.html?partner=${partnerId}`;
}
```

---

## 🎨 UI/UX MELHORIAS

### 1. **Indicador de Progresso**
```
📊 Respostas:
You: 45/50 questões ✅
Partner: 30/50 questões ⏳
```

### 2. **Notificação Push**
```
"Maria acabou de responder aos questionários! 
 Clica aqui para gerar o relatório 💑"
```

### 3. **Histórico de Relatórios**
```
Relatórios Anteriores:
- 20 Nov 2025 - 85.5% compatibilidade
- 15 Nov 2025 - 82.3% compatibilidade
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Backend (Firebase)
- [ ] Adicionar campo `answers` ao schema de `users`
- [ ] Adicionar campo `status` em `connections`
- [ ] Criar função `saveAnswersToFirebase()`
- [ ] Criar função `loadAnswersFromFirebase()`
- [ ] Testar sincronização

### Fase 2: Auto-Save
- [ ] Implementar auto-save a cada mudança
- [ ] Debounce de 2s para evitar spam
- [ ] Indicador visual "💾 Guardando..."
- [ ] Backup em localStorage

### Fase 3: Relatório Cloud
- [ ] Criar `relatorio-cloud.html`
- [ ] Selector de parceiros conectados
- [ ] Função `generateCloudReport()`
- [ ] Reutilizar lógica de `comparison.js`
- [ ] Testar com dados reais

### Fase 4: Dashboard
- [ ] Adicionar botão "📊 Ver Relatório"
- [ ] Indicador de progresso (quantas questões respondidas)
- [ ] Link direto para relatório
- [ ] Histórico de relatórios (opcional)

### Fase 5: Migração
- [ ] Manter `relatorio.html` (ficheiros) como fallback
- [ ] Adicionar link em ambos (cloud ↔️ ficheiros)
- [ ] Documentação para utilizadores
- [ ] Guia de migração de ficheiros para cloud

---

## 🔒 SEGURANÇA & PRIVACIDADE

### Regras Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users podem ler/escrever apenas os seus dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Connections: apenas users envolvidos podem aceder
    match /connections/{connId} {
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.users;
      
      allow create: if request.auth != null && 
                       request.auth.uid in request.resource.data.users;
      
      allow update: if request.auth != null && 
                       request.auth.uid in resource.data.users;
    }
    
    // Reports: apenas users da connection podem ler
    match /reports/{reportId} {
      allow read: if request.auth != null && 
                     (request.auth.uid == resource.data.user1 || 
                      request.auth.uid == resource.data.user2);
    }
  }
}
```

---

## 📊 VANTAGENS vs DESVANTAGENS

### ✅ Vantagens:
1. **UX Muito Melhor**
   - Sem ficheiros para gerir
   - Sem códigos para lembrar
   - 3 cliques para relatório

2. **Sincronização Automática**
   - Respostas sempre acessíveis
   - Histórico de mudanças
   - Backup automático

3. **Funcionalidades Futuras**
   - Notificações push
   - Relatórios periódicos
   - Comparação temporal

4. **Dados Estruturados**
   - Analytics melhores
   - Relatórios agregados
   - Insights globais

### ⚠️ Desvantagens:
1. **Dependência de Autenticação**
   - Obriga utilizadores a criar conta
   - Pode afastar utilizadores anónimos

2. **Privacidade Percebida**
   - Dados na cloud (mesmo que encriptados)
   - Alguns users preferem ficheiros locais

3. **Complexidade**
   - Mais código para manter
   - Sincronização de estado
   - Gestão de erros de rede

### 💡 Solução Híbrida:
- ✅ Manter ambos os fluxos (cloud + ficheiros)
- ✅ Utilizadores autenticados: Cloud por defeito
- ✅ Utilizadores anónimos: Ficheiros .q4c
- ✅ Opção de exportar para .q4c (backup)

---

## 🎯 PRÓXIMOS PASSOS

1. **Validar Proposta** ✅ (este documento)
2. **Implementar Fase 1** (Backend Firebase)
3. **Implementar Fase 2** (Auto-save)
4. **Implementar Fase 3** (Relatório Cloud)
5. **Implementar Fase 4** (Dashboard)
6. **Testes & Deploy**

---

## 📝 NOTAS FINAIS

Esta implementação transforma o Quest4Couple numa **verdadeira plataforma cloud**,
eliminando fricção e melhorando drasticamente a UX para utilizadores autenticados.

**Tempo estimado:** 6-8 horas de desenvolvimento
**Prioridade:** ALTA (melhora core experience)
**Risco:** BAIXO (não quebra funcionalidade existente)

---

**Proposta criada em:** 20 de Novembro de 2025  
**Status:** 📋 AGUARDANDO APROVAÇÃO
