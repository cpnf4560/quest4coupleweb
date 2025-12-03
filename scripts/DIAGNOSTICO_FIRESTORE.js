// ========================================
// DIAGNÓSTICO COMPLETO - COPIAR E COLAR NO CONSOLE
// ========================================

console.log('🔍 ========================================');
console.log('🔍 DIAGNÓSTICO FIRESTORE PERMISSIONS');
console.log('🔍 ========================================');

// 1. Verificar Auth
console.log('\n1️⃣ VERIFICANDO AUTENTICAÇÃO:');
const currentUser = firebase.auth().currentUser;
if (currentUser) {
  console.log('✅ User autenticado:', currentUser.email);
  console.log('✅ User UID:', currentUser.uid);
  
  // Forçar refresh do token
  currentUser.getIdToken(true).then(token => {
    console.log('✅ Token obtido (primeiros 50 chars):', token.substring(0, 50) + '...');
    
    // Decodificar token para ver claims
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('📋 Token Payload:', {
      user_id: payload.user_id,
      email: payload.email,
      auth_time: new Date(payload.auth_time * 1000).toLocaleString(),
      exp: new Date(payload.exp * 1000).toLocaleString()
    });
    
    // 2. Testar escrita no Firestore
    console.log('\n2️⃣ TESTANDO ESCRITA NO FIRESTORE:');
    const testDoc = firebase.firestore().collection('users').doc(currentUser.uid);
    
    console.log('📝 Document path:', testDoc.path);
    console.log('📝 UID do Auth:', currentUser.uid);
    console.log('📝 UID do Doc:', testDoc.id);
    console.log('✅ UIDs coincidem?', currentUser.uid === testDoc.id);
    
    // Tentar escrever
    testDoc.set({
      uid: currentUser.uid,
      email: currentUser.email,
      testField: 'TESTE_' + Date.now(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      console.log('✅✅✅ SUCESSO! Documento criado no Firestore!');
      console.log('✅ Verificar Firebase Console → Firestore → users →', currentUser.uid);
    })
    .catch(err => {
      console.error('❌❌❌ ERRO AO ESCREVER:', err);
      console.error('❌ Error code:', err.code);
      console.error('❌ Error message:', err.message);
      
      // Diagnóstico do erro
      if (err.code === 'permission-denied') {
        console.error('\n🔴 PROBLEMA: FIRESTORE RULES BLOQUEANDO!');
        console.error('🔴 Possíveis causas:');
        console.error('   1. Rules não foram publicadas corretamente');
        console.error('   2. Rules têm erro de sintaxe');
        console.error('   3. Token não tem as claims corretas');
        console.error('\n📋 AÇÃO: Verificar Firebase Console → Firestore → Rules');
        console.error('📋 Deve ter: allow create: if request.auth != null && request.auth.uid == userId;');
      }
    });
    
  }).catch(err => {
    console.error('❌ Erro ao obter token:', err);
  });
  
} else {
  console.error('❌ Nenhum utilizador autenticado!');
  console.error('❌ Fazer login primeiro antes de testar!');
}

console.log('\n🔍 ========================================');
console.log('🔍 FIM DO DIAGNÓSTICO');
console.log('🔍 ========================================');
