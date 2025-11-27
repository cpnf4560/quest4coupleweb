/* ============================================
   GERAR FICHEIRO .Q4C ENCRIPTADO
   Script para criar ficheiro de teste com código teste123
   ============================================ */

const crypto = require('crypto');
const fs = require('fs');

// Código de segurança
const SECURITY_CODE = 'teste123';

// Dados do ficheiro (simulando respostas reais)
const data = {
  userName: 'Maria Silva',
  answers: {
    romantico: {
      q1: { answer: 'Sim', comment: 'Adoro demonstrações de carinho em público! ❤️' },
      q2: { answer: 'Sim', comment: 'Presente surpresa é sempre especial' },
      q3: { answer: 'Talvez', comment: 'Depende do contexto e do momento' },
      q4: { answer: 'Sim', comment: 'Jantar romântico é perfeito para reconectar' },
      q5: { answer: 'Sim', comment: 'Viagem romântica seria incrível! 🌴' },
      q6: { answer: 'Sim', comment: 'Cartas de amor são lindas e muito tocantes' },
      q7: { answer: 'Talvez', comment: 'Nunca tentei, mas estou aberta' },
      q8: { answer: 'Sim', comment: 'Demonstrar amor é fundamental' },
      q9: { answer: 'Não', comment: 'Prefiro privacidade' },
      q10: { answer: 'Sim', comment: 'Renovar votos seria lindo! 💍' }
    },
    experiencia: {
      q1: { answer: 'Sim', comment: 'Adoro experimentar coisas novas!' },
      q2: { answer: 'Sim', comment: 'Seria uma experiência incrível' },
      q3: { answer: 'Talvez', comment: 'Depende do nível de dificuldade' },
      q4: { answer: 'Sim', comment: 'Adoro cozinhar juntos' },
      q5: { answer: 'Sim', comment: 'Aventura é essencial no relacionamento' }
    },
    pimentinha: {
      q1: { answer: 'Sim', comment: 'Lingerie é sempre bem-vinda 🔥' },
      q2: { answer: 'Talvez', comment: 'Depende do local' },
      q3: { answer: 'Sim', comment: 'Gosto de inovar' },
      q4: { answer: 'Não', comment: 'Não me sinto confortável' },
      q5: { answer: 'Sim', comment: 'Comunicação é tudo!' }
    }
  },
  customQuestions: {},
  timestamp: new Date().toISOString()
};

// Função para encriptar usando AES (compatível com CryptoJS)
function encryptAES(text, passphrase) {
  // CryptoJS usa EVP_BytesToKey para derivar chave e IV
  // Vamos simular o mesmo processo
  
  const salt = crypto.randomBytes(8);
  const { key, iv } = evpBytesToKey(passphrase, salt);
  
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Formato CryptoJS: "Salted__" + salt + encrypted
  const result = Buffer.concat([
    Buffer.from('Salted__', 'utf8'),
    salt,
    Buffer.from(encrypted, 'base64')
  ]);
  
  return result.toString('base64');
}

// Implementação do EVP_BytesToKey (usado pelo CryptoJS)
function evpBytesToKey(passphrase, salt, keySize = 32, ivSize = 16) {
  const hashes = [];
  let hash;
  let data = Buffer.concat([Buffer.from(passphrase, 'utf8'), salt]);
  
  while (hashes.length * 16 < keySize + ivSize) {
    if (hash) {
      data = Buffer.concat([hash, Buffer.from(passphrase, 'utf8'), salt]);
    }
    hash = crypto.createHash('md5').update(data).digest();
    hashes.push(hash);
  }
  
  const result = Buffer.concat(hashes);
  
  return {
    key: result.slice(0, keySize),
    iv: result.slice(keySize, keySize + ivSize)
  };
}

// Gerar o ficheiro
try {
  console.log('🔐 A encriptar dados com código: teste123');
  
  const dataString = JSON.stringify(data);
  console.log('📦 Tamanho dos dados:', dataString.length, 'bytes');
  
  const encrypted = encryptAES(dataString, SECURITY_CODE);
  console.log('✅ Dados encriptados com sucesso');
  console.log('📦 Tamanho encriptado:', encrypted.length, 'bytes');
  
  const fileName = `Quest4Couple_${data.userName.replace(/ /g, '_')}_${new Date().toISOString().slice(0,10)}.q4c`;
  fs.writeFileSync(fileName, encrypted, 'utf8');
  
  console.log('💾 Ficheiro criado:', fileName);
  console.log('');
  console.log('✅ FICHEIRO GERADO COM SUCESSO!');
  console.log('📋 Código de segurança: teste123');
  console.log('👤 Utilizador:', data.userName);
  console.log('📊 Total de respostas:', Object.keys(data.answers).reduce((sum, pack) => sum + Object.keys(data.answers[pack]).length, 0));
  console.log('');
  console.log('🧪 Para testar:');
  console.log('1. Faça upload deste ficheiro no relatorio.html');
  console.log('2. Use o código: teste123');
  console.log('3. Faça upload de um segundo ficheiro com o mesmo código');
  
} catch (error) {
  console.error('❌ Erro ao gerar ficheiro:', error.message);
  process.exit(1);
}
