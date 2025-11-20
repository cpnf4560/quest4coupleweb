/**
 * SCRIPT DE MIGRAÇÃO - ADICIONAR USERNAME A UTILIZADORES EXISTENTES
 * 
 * Este script adiciona automaticamente um username a todos os utilizadores
 * que ainda não têm um definido.
 * 
 * COMO USAR:
 * 1. Abrir Firebase Console: https://console.firebase.google.com
 * 2. Ir para Firestore Database
 * 3. Abrir a consola JavaScript do browser (F12)
 * 4. Copiar e colar este código completo
 * 5. Executar: migrateUsernames()
 * 
 * OU executar via Node.js com Firebase Admin SDK
 */

async function migrateUsernames() {
  console.log('🔄 Iniciando migração de usernames...');
  
  try {
    // Buscar todos os utilizadores sem username
    const usersSnapshot = await db.collection('users')
      .where('username', '==', null)
      .get();
    
    if (usersSnapshot.empty) {
      console.log('✅ Todos os utilizadores já têm username!');
      return;
    }
    
    console.log(`📊 Encontrados ${usersSnapshot.size} utilizadores sem username`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const doc of usersSnapshot.docs) {
      try {
        const userData = doc.data();
        const userId = doc.id;
        
        // Gerar username base a partir do nome ou email
        let baseUsername = '';
        if (userData.name) {
          baseUsername = userData.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^a-z0-9]/g, '')        // Remove caracteres especiais
            .substring(0, 15);
        } else if (userData.email) {
          baseUsername = userData.email
            .split('@')[0]
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 15);
        } else {
          baseUsername = 'user';
        }
        
        // Garantir que tem pelo menos 3 caracteres
        if (baseUsername.length < 3) {
          baseUsername = baseUsername + '123';
        }
        
        // Verificar se username já existe e adicionar número se necessário
        let username = baseUsername;
        let counter = 1;
        let isUnique = false;
        
        while (!isUnique) {
          const check = await db.collection('users')
            .where('username', '==', username)
            .limit(1)
            .get();
          
          if (check.empty) {
            isUnique = true;
          } else {
            username = `${baseUsername}${counter}`;
            counter++;
          }
        }
        
        // Atualizar documento com o username
        await doc.ref.update({ 
          username: username,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`✅ ${userData.email || userId} -> @${username}`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Erro ao processar ${doc.id}:`, error);
        errorCount++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESUMO DA MIGRAÇÃO:');
    console.log(`✅ Sucesso: ${successCount} utilizadores`);
    console.log(`❌ Erros: ${errorCount} utilizadores`);
    console.log('='.repeat(50));
    
    if (errorCount === 0) {
      console.log('🎉 Migração concluída com sucesso!');
    } else {
      console.log('⚠️ Migração concluída com alguns erros. Reveja os logs acima.');
    }
    
  } catch (error) {
    console.error('❌ Erro fatal na migração:', error);
  }
}

// Função auxiliar para verificar o estado atual
async function checkUsernameStatus() {
  console.log('🔍 Verificando estado dos usernames...');
  
  const allUsers = await db.collection('users').get();
  const withUsername = allUsers.docs.filter(doc => doc.data().username);
  const withoutUsername = allUsers.docs.filter(doc => !doc.data().username);
  
  console.log(`📊 Total de utilizadores: ${allUsers.size}`);
  console.log(`✅ Com username: ${withUsername.length}`);
  console.log(`❌ Sem username: ${withoutUsername.length}`);
  
  if (withoutUsername.length > 0) {
    console.log('\n📋 Utilizadores sem username:');
    withoutUsername.forEach(doc => {
      const data = doc.data();
      console.log(`  - ${data.email || data.name || doc.id}`);
    });
  }
}

console.log('✅ Script de migração carregado!');
console.log('');
console.log('📝 COMANDOS DISPONÍVEIS:');
console.log('  - checkUsernameStatus()  -> Verificar estado atual');
console.log('  - migrateUsernames()     -> Executar migração');
console.log('');
