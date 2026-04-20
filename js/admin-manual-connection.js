/**
 * Script para criar conexão manual entre dois utilizadores
 * 
 * COMO USAR:
 * 1. Abre a consola do browser na página admin.html (F12)
 * 2. Cola todo este código e pressiona Enter
 * 3. Chama a função: createManualConnection('@jpn91', '@vnl94')
 */

// Função para encontrar utilizador por username
async function findUserByUsername(username) {
  // Remover @ se existir
  const cleanUsername = username.replace('@', '');
  
  console.log(`🔍 Procurando utilizador: @${cleanUsername}`);
  
  const snapshot = await db.collection('users')
    .where('username', '==', cleanUsername)
    .get();
  
  if (snapshot.empty) {
    console.error(`❌ Utilizador @${cleanUsername} não encontrado!`);
    return null;
  }
  
  const doc = snapshot.docs[0];
  const data = doc.data();
  console.log(`✅ Encontrado: @${cleanUsername}`, {
    id: doc.id,
    name: data.name,
    email: data.email,
    createdAt: data.createdAt?.toDate?.()
  });
  
  return { id: doc.id, ...data };
}

// Função para criar conexão manual
async function createManualConnection(username1, username2) {
  console.log('========================================');
  console.log('🔗 CRIAR CONEXÃO MANUAL');
  console.log('========================================');
  
  // Encontrar utilizadores
  const user1 = await findUserByUsername(username1);
  const user2 = await findUserByUsername(username2);
  
  if (!user1 || !user2) {
    console.error('❌ Não foi possível encontrar ambos os utilizadores!');
    return false;
  }
  
  // Verificar se já existe conexão
  const connectionId = [user1.id, user2.id].sort().join('_');
  console.log(`🔑 Connection ID: ${connectionId}`);
  
  const existingConnection = await db.collection('connections').doc(connectionId).get();
  
  if (existingConnection.exists) {
    console.log('⚠️ Conexão já existe!', existingConnection.data());
    return { exists: true, connectionId, data: existingConnection.data() };
  }
  
  // Nota: Não verificamos pedidos de conexão pois as regras do Firestore
  // não permitem queries admin na coleção connection_requests
  // A conexão será criada diretamente
  
  // Criar conexão
  console.log('🔗 Criando conexão...');
  
  await db.collection('connections').doc(connectionId).set({
    users: [user1.id, user2.id],
    sharedPacks: [],
    report: null,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: 'admin_manual',
    notes: `Conexão criada manualmente pelo admin em ${new Date().toISOString()}`
  });
  
  console.log('✅ CONEXÃO CRIADA COM SUCESSO!');
  console.log(`   @${username1.replace('@','')} ↔ @${username2.replace('@','')}`);
  console.log(`   Connection ID: ${connectionId}`);
  
  return { success: true, connectionId, user1, user2 };
}

// Função para investigar problemas de conexão
async function investigateConnectionIssue(username1, username2) {
  console.log('========================================');
  console.log('🔍 INVESTIGAR PROBLEMA DE CONEXÃO');
  console.log('========================================');
  
  const user1 = await findUserByUsername(username1);
  const user2 = await findUserByUsername(username2);
  
  if (!user1 || !user2) {
    console.error('❌ Utilizador(es) não encontrado(s)!');
    return;
  }
  
  console.log('\n📊 DADOS DO UTILIZADOR 1:');
  console.log('   ID:', user1.id);
  console.log('   Username:', user1.username);
  console.log('   Nome:', user1.name);
  console.log('   Email:', user1.email);
  console.log('   Criado:', user1.createdAt?.toDate?.());
  
  console.log('\n📊 DADOS DO UTILIZADOR 2:');
  console.log('   ID:', user2.id);
  console.log('   Username:', user2.username);
  console.log('   Nome:', user2.name);
  console.log('   Email:', user2.email);
  console.log('   Criado:', user2.createdAt?.toDate?.());
  
  // Verificar conexão existente
  const connectionId = [user1.id, user2.id].sort().join('_');
  const connection = await db.collection('connections').doc(connectionId).get();
  
  console.log('\n🔗 CONEXÃO EXISTENTE:', connection.exists ? 'SIM ✅' : 'NÃO ❌');
  if (connection.exists) {
    const data = connection.data();
    console.log('   Criado:', data.createdAt?.toDate?.());
    console.log('   Criado por:', data.createdBy || 'sistema');
    console.log('   Packs partilhados:', data.sharedPacks?.length || 0);
  }
  
  // Verificar se usernames estão corretos
  console.log('\n🔤 VERIFICAÇÃO DE USERNAMES:');
  console.log(`   @${user1.username} - OK ✅`);
  console.log(`   @${user2.username} - OK ✅`);
  
  console.log('\n📋 PRÓXIMOS PASSOS:');
  if (connection.exists) {
    console.log('   ✅ Conexão já existe! Os utilizadores devem conseguir ver-se.');
    console.log('   💡 Se ainda há problemas, verifique se o dashboard está atualizado.');
  } else {
    console.log('   ❌ Conexão não existe entre estes utilizadores.');
    console.log('   💡 Para criar a conexão manualmente, execute:');
    console.log(`   createManualConnection("${username1}", "${username2}")`);
  }
  return { user1, user2, connectionExists: connection.exists, connectionId };
}

// ========================================
// FUNÇÕES DE DIAGNÓSTICO DE CONEXÕES
// ========================================

// Listar todos os pedidos de conexão pendentes
async function listPendingRequests() {
  console.log('========================================');
  console.log('📋 PEDIDOS DE CONEXÃO PENDENTES');
  console.log('========================================');
  
  try {
    const snapshot = await db.collection('connection_requests')
      .where('status', '==', 'pending')
      .get();
    
    console.log(`\n📬 Total de pedidos pendentes: ${snapshot.size}`);
    
    if (snapshot.empty) {
      console.log('✅ Não há pedidos pendentes!');
      return [];
    }
    
    const requests = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        from: data.fromUsername || data.fromUserName,
        to: data.toUsername || data.toUserName,
        fromId: data.fromUserId,
        toId: data.toUserId,
        createdAt: data.createdAt?.toDate?.()
      });
    });
    
    // Ordenar por data
    requests.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
    console.log('\n📋 Lista de pedidos:');
    requests.forEach((req, i) => {
      console.log(`   ${i+1}. @${req.from || '?'} → @${req.to || '?'} (${req.createdAt?.toLocaleDateString('pt-PT') || '?'})`);
    });
    
    return requests;
  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error.message);
    return [];
  }
}

// Listar todos os pedidos de conexão (incluindo aceites e rejeitados)
async function listAllRequests(limit = 50) {
  console.log('========================================');
  console.log('📋 TODOS OS PEDIDOS DE CONEXÃO');
  console.log('========================================');
  
  try {
    const snapshot = await db.collection('connection_requests')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    console.log(`\n📬 Total: ${snapshot.size} pedidos (limite: ${limit})`);
    
    if (snapshot.empty) {
      console.log('⚠️ Nenhum pedido encontrado!');
      return [];
    }
    
    const requests = [];
    const byStatus = { pending: 0, accepted: 0, rejected: 0 };
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const status = data.status || 'unknown';
      byStatus[status] = (byStatus[status] || 0) + 1;
      
      requests.push({
        id: doc.id,
        from: data.fromUsername || data.fromUserName,
        to: data.toUsername || data.toUserName,
        status: status,
        createdAt: data.createdAt?.toDate?.()
      });
    });
    
    console.log('\n📊 Por status:');
    console.log(`   ⏳ Pendentes: ${byStatus.pending}`);
    console.log(`   ✅ Aceites: ${byStatus.accepted}`);
    console.log(`   ❌ Rejeitados: ${byStatus.rejected}`);
    
    console.log('\n📋 Últimos pedidos:');
    requests.slice(0, 20).forEach((req, i) => {
      const statusIcon = req.status === 'accepted' ? '✅' : req.status === 'rejected' ? '❌' : '⏳';
      console.log(`   ${i+1}. ${statusIcon} @${req.from || '?'} → @${req.to || '?'} (${req.createdAt?.toLocaleDateString('pt-PT') || '?'})`);
    });
    
    return requests;
  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error.message);
    console.error('   Isto pode indicar falta de índice no Firestore.');
    console.error('   Tenta: listAllRequestsSimple()');
    return [];
  }
}

// Versão sem ordenação (caso não haja índice)
async function listAllRequestsSimple() {
  console.log('========================================');
  console.log('📋 TODOS OS PEDIDOS (SEM ORDENAÇÃO)');
  console.log('========================================');
  
  try {
    const snapshot = await db.collection('connection_requests').get();
    
    console.log(`\n📬 Total: ${snapshot.size} pedidos`);
    
    const requests = [];
    const byStatus = { pending: 0, accepted: 0, rejected: 0 };
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const status = data.status || 'unknown';
      byStatus[status] = (byStatus[status] || 0) + 1;
      
      requests.push({
        id: doc.id,
        from: data.fromUsername || data.fromUserName,
        to: data.toUsername || data.toUserName,
        fromId: data.fromUserId,
        toId: data.toUserId,
        status: status,
        createdAt: data.createdAt?.toDate?.()
      });
    });
    
    // Ordenar manualmente
    requests.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
    console.log('\n📊 Por status:');
    console.log(`   ⏳ Pendentes: ${byStatus.pending}`);
    console.log(`   ✅ Aceites: ${byStatus.accepted}`);
    console.log(`   ❌ Rejeitados: ${byStatus.rejected}`);
    
    console.log('\n📋 Todos os pedidos:');
    requests.forEach((req, i) => {
      const statusIcon = req.status === 'accepted' ? '✅' : req.status === 'rejected' ? '❌' : '⏳';
      console.log(`   ${i+1}. ${statusIcon} @${req.from || '?'} → @${req.to || '?'} (${req.createdAt?.toLocaleDateString('pt-PT') || '?'})`);
    });
    
    return requests;
  } catch (error) {
    console.error('❌ Erro ao listar pedidos:', error.message);
    return [];
  }
}

// Listar todas as conexões
async function listConnections(limit = 50) {
  console.log('========================================');
  console.log('💑 TODAS AS CONEXÕES');
  console.log('========================================');
  
  try {
    const snapshot = await db.collection('connections').get();
    
    console.log(`\n🔗 Total: ${snapshot.size} conexões`);
    
    if (snapshot.empty) {
      console.log('⚠️ Nenhuma conexão encontrada!');
      return [];
    }
    
    const connections = [];
    
    for (const doc of snapshot.docs) {
      const data = doc.data();
      const userIds = data.users || [];
      
      // Tentar obter nomes dos utilizadores
      let user1Name = '?', user2Name = '?';
      try {
        if (userIds[0]) {
          const u1 = await db.collection('users').doc(userIds[0]).get();
          if (u1.exists) user1Name = u1.data().username || u1.data().name || '?';
        }
        if (userIds[1]) {
          const u2 = await db.collection('users').doc(userIds[1]).get();
          if (u2.exists) user2Name = u2.data().username || u2.data().name || '?';
        }
      } catch (e) {
        // Ignorar erros de permissão
      }
      
      connections.push({
        id: doc.id,
        user1: user1Name,
        user2: user2Name,
        sharedPacks: data.sharedPacks?.length || 0,
        createdAt: data.createdAt?.toDate?.(),
        createdBy: data.createdBy || 'sistema'
      });
    }
    
    // Ordenar por data
    connections.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    
    console.log('\n📋 Lista de conexões:');
    connections.forEach((conn, i) => {
      const date = conn.createdAt?.toLocaleDateString('pt-PT') || '?';
      console.log(`   ${i+1}. @${conn.user1} ↔ @${conn.user2} | Packs: ${conn.sharedPacks} | Data: ${date}`);
    });
    
    return connections;
  } catch (error) {
    console.error('❌ Erro ao listar conexões:', error.message);
    return [];
  }
}

// Diagnóstico completo do sistema de conexões
async function diagnoseConnectionSystem() {
  console.log('========================================');
  console.log('🔬 DIAGNÓSTICO DO SISTEMA DE CONEXÕES');
  console.log('========================================');
  console.log('Data:', new Date().toLocaleString('pt-PT'));
  
  // 1. Contar conexões
  try {
    const connectionsSnap = await db.collection('connections').get();
    console.log(`\n🔗 Conexões: ${connectionsSnap.size}`);
    
    // Conexões recentes (últimos 7 dias)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    let recentConnections = 0;
    
    connectionsSnap.forEach(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate?.();
      if (createdAt && createdAt > weekAgo) {
        recentConnections++;
      }
    });
    console.log(`   📅 Últimos 7 dias: ${recentConnections}`);
  } catch (e) {
    console.error('   ❌ Erro ao contar conexões:', e.message);
  }
  
  // 2. Contar pedidos
  try {
    const requestsSnap = await db.collection('connection_requests').get();
    let pending = 0, accepted = 0, rejected = 0;
    
    requestsSnap.forEach(doc => {
      const status = doc.data().status;
      if (status === 'pending') pending++;
      else if (status === 'accepted') accepted++;
      else if (status === 'rejected') rejected++;
    });
    
    console.log(`\n📬 Pedidos de conexão:`);
    console.log(`   ⏳ Pendentes: ${pending}`);
    console.log(`   ✅ Aceites: ${accepted}`);
    console.log(`   ❌ Rejeitados: ${rejected}`);
    
    if (pending > 0) {
      console.log('\n⚠️ HÁ PEDIDOS PENDENTES! Os utilizadores podem não estar a ver as notificações.');
    }
  } catch (e) {
    console.error('   ❌ Erro ao contar pedidos:', e.message);
  }
  
  // 3. Verificar utilizadores sem username
  try {
    const usersSnap = await db.collection('users').get();
    let withoutUsername = 0;
    
    usersSnap.forEach(doc => {
      const data = doc.data();
      if (!data.username) {
        withoutUsername++;
      }
    });
    
    console.log(`\n👥 Utilizadores:`);
    console.log(`   Total: ${usersSnap.size}`);
    console.log(`   Sem username: ${withoutUsername}`);
    
    if (withoutUsername > 0) {
      console.log(`   ⚠️ ${withoutUsername} utilizadores não podem ser encontrados por parceiros!`);
    }
  } catch (e) {
    console.error('   ❌ Erro ao verificar utilizadores:', e.message);
  }
  
  console.log('\n========================================');
  console.log('📋 COMANDOS ÚTEIS:');
  console.log('========================================');
  console.log('• listPendingRequests() - Ver pedidos pendentes');
  console.log('• listAllRequestsSimple() - Ver todos os pedidos');
  console.log('• listConnections() - Ver todas as conexões');
  console.log('• investigateConnectionIssue("@user1", "@user2")');
  console.log('• createManualConnection("@user1", "@user2")');
}

// ========================================
// EXPOR FUNÇÕES GLOBALMENTE
// ========================================
window.findUserByUsername = findUserByUsername;
window.createManualConnection = createManualConnection;
window.investigateConnectionIssue = investigateConnectionIssue;
window.listPendingRequests = listPendingRequests;
window.listAllRequests = listAllRequests;
window.listAllRequestsSimple = listAllRequestsSimple;
window.listConnections = listConnections;
window.diagnoseConnectionSystem = diagnoseConnectionSystem;

// Instruções
console.log('========================================');
console.log('🛠️ SCRIPT DE CONEXÃO MANUAL CARREGADO');
console.log('========================================');
console.log('');
console.log('🔬 DIAGNÓSTICO:');
console.log('   diagnoseConnectionSystem() - Diagnóstico completo');
console.log('');
console.log('📋 LISTAR:');
console.log('   listPendingRequests() - Pedidos pendentes');
console.log('   listAllRequestsSimple() - Todos os pedidos');
console.log('   listConnections() - Todas as conexões');
console.log('');
console.log('🔍 INVESTIGAR:');
console.log('   investigateConnectionIssue("@user1", "@user2")');
console.log('');
console.log('🔧 CORRIGIR:');
console.log('   createManualConnection("@user1", "@user2")');
console.log('');
console.log('💡 Começa com: diagnoseConnectionSystem()');
console.log('');
