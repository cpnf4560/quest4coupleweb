/**
 * Script para gerar ficheiros .q4c de teste encriptados
 * Uso: node generate_test_q4c.js
 */

const crypto = require('crypto');
const fs = require('fs');

// Função para encriptar dados (igual ao storage.js)
function encryptData(data, securityCode) {
  const dataStr = JSON.stringify(data);
  const key = crypto.createHash('sha256').update(securityCode).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(dataStr, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Função para gerar respostas aleatórias
function getRandomAnswer() {
  const answers = ['Sim', 'Não', 'Talvez'];
  return answers[Math.floor(Math.random() * answers.length)];
}

function getRandomComment(answer) {
  const comments = {
    'Sim': [
      'Adoraria muito! ❤️',
      'Definitivamente sim! 😊',
      'Com certeza! Vamos fazer!',
      'Estou super a fim! 🎉',
      'Perfeito para nós! 💝'
    ],
    'Não': [
      'Prefiro outra coisa',
      'Não é bem o meu estilo',
      'Talvez no futuro, mas agora não',
      'Não me sinto confortável com isso',
      'Vamos pensar em alternativas'
    ],
    'Talvez': [
      'Preciso pensar melhor',
      'Depende das circunstâncias',
      'Pode ser interessante',
      'Vamos discutir juntos',
      'Estou aberto a considerar'
    ]
  };
  const options = comments[answer];
  return options[Math.floor(Math.random() * options.length)];
}

// Pack Romântico - 10 perguntas
const romanticoQuestions = [
  'romantico_basico_1', 'romantico_basico_2', 'romantico_basico_3', 
  'romantico_basico_4', 'romantico_basico_5',
  'romantico_avancado_1', 'romantico_avancado_2', 'romantico_avancado_3',
  'romantico_avancado_4', 'romantico_avancado_5'
];

// Pack Aventura - 10 perguntas
const aventuraQuestions = [
  'aventura_basico_1', 'aventura_basico_2', 'aventura_basico_3',
  'aventura_basico_4', 'aventura_basico_5',
  'aventura_avancado_1', 'aventura_avancado_2', 'aventura_avancado_3',
  'aventura_avancado_4', 'aventura_avancado_5'
];

// Pack Comunicação - 10 perguntas
const comunicacaoQuestions = [
  'comunicacao_basico_1', 'comunicacao_basico_2', 'comunicacao_basico_3',
  'comunicacao_basico_4', 'comunicacao_basico_5',
  'comunicacao_avancado_1', 'comunicacao_avancado_2', 'comunicacao_avancado_3',
  'comunicacao_avancado_4', 'comunicacao_avancado_5'
];

// Função para gerar respostas de um parceiro
function generateAnswers(questions) {
  const answers = {};
  questions.forEach(q => {
    const answer = getRandomAnswer();
    answers[q] = {
      answer: answer,
      comment: getRandomComment(answer)
    };
  });
  return answers;
}

// Função para calcular compatibilidade
function calculateCompatibility(answers1, answers2, questions) {
  let superMatches = 0;
  let matches = 0;
  let possibilities = 0;

  questions.forEach(q => {
    const a1 = answers1[q]?.answer;
    const a2 = answers2[q]?.answer;

    if (a1 === 'Sim' && a2 === 'Sim') superMatches++;
    else if (a1 === a2) matches++;
    else if (a1 === 'Talvez' || a2 === 'Talvez') possibilities++;
  });

  const total = questions.length;
  const compatibility = Math.round(((superMatches * 1.0 + matches * 0.7 + possibilities * 0.3) / total) * 100);

  return { compatibility, superMatches, matches, possibilities };
}

// Gerar ficheiro 1: Pack Romântico
console.log('🔄 A gerar ficheiro 1: Pack Romântico...');
const partner1Romantico = generateAnswers(romanticoQuestions);
const partner2Romantico = generateAnswers(romanticoQuestions);
const statsRomantico = calculateCompatibility(partner1Romantico, partner2Romantico, romanticoQuestions);

const dataRomantico = {
  version: '2.0',
  code: 'teste123',
  packId: 'romantico',
  packName: 'Pack Romântico 💝',
  partner1: {
    name: 'Sofia Ferreira',
    email: 'sofia.ferreira@example.com',
    answers: partner1Romantico
  },
  partner2: {
    name: 'Miguel Santos',
    email: 'miguel.santos@example.com',
    answers: partner2Romantico
  },
  submittedAt: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  metadata: {
    totalQuestions: romanticoQuestions.length,
    compatibility: statsRomantico.compatibility,
    superMatches: statsRomantico.superMatches,
    matches: statsRomantico.matches,
    possibilities: statsRomantico.possibilities,
    categories: {
      romantico_basico: { total: 5, matches: 0, superMatches: 0 },
      romantico_avancado: { total: 5, matches: 0, superMatches: 0 }
    }
  }
};

const encryptedRomantico = encryptData(dataRomantico, 'teste123');
fs.writeFileSync('teste123_romantico.q4c', encryptedRomantico);
console.log('✅ Criado: teste123_romantico.q4c');
console.log(`   Compatibilidade: ${statsRomantico.compatibility}% | Super Matches: ${statsRomantico.superMatches}`);

// Gerar ficheiro 2: Pack Aventura
console.log('\n🔄 A gerar ficheiro 2: Pack Aventura...');
const partner1Aventura = generateAnswers(aventuraQuestions);
const partner2Aventura = generateAnswers(aventuraQuestions);
const statsAventura = calculateCompatibility(partner1Aventura, partner2Aventura, aventuraQuestions);

const dataAventura = {
  version: '2.0',
  code: 'teste123',
  packId: 'aventura',
  packName: 'Pack Aventura 🏔️',
  partner1: {
    name: 'Carolina Alves',
    email: 'carolina.alves@example.com',
    answers: partner1Aventura
  },
  partner2: {
    name: 'Ricardo Costa',
    email: 'ricardo.costa@example.com',
    answers: partner2Aventura
  },
  submittedAt: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  metadata: {
    totalQuestions: aventuraQuestions.length,
    compatibility: statsAventura.compatibility,
    superMatches: statsAventura.superMatches,
    matches: statsAventura.matches,
    possibilities: statsAventura.possibilities,
    categories: {
      aventura_basico: { total: 5, matches: 0, superMatches: 0 },
      aventura_avancado: { total: 5, matches: 0, superMatches: 0 }
    }
  }
};

const encryptedAventura = encryptData(dataAventura, 'teste123');
fs.writeFileSync('teste123_aventura.q4c', encryptedAventura);
console.log('✅ Criado: teste123_aventura.q4c');
console.log(`   Compatibilidade: ${statsAventura.compatibility}% | Super Matches: ${statsAventura.superMatches}`);

// Gerar ficheiro 3: Pack Comunicação
console.log('\n🔄 A gerar ficheiro 3: Pack Comunicação...');
const partner1Comunicacao = generateAnswers(comunicacaoQuestions);
const partner2Comunicacao = generateAnswers(comunicacaoQuestions);
const statsComunicacao = calculateCompatibility(partner1Comunicacao, partner2Comunicacao, comunicacaoQuestions);

const dataComunicacao = {
  version: '2.0',
  code: 'teste123',
  packId: 'comunicacao',
  packName: 'Pack Comunicação 💬',
  partner1: {
    name: 'Beatriz Lima',
    email: 'beatriz.lima@example.com',
    answers: partner1Comunicacao
  },
  partner2: {
    name: 'André Pereira',
    email: 'andre.pereira@example.com',
    answers: partner2Comunicacao
  },
  submittedAt: new Date().toISOString(),
  generatedAt: new Date().toISOString(),
  metadata: {
    totalQuestions: comunicacaoQuestions.length,
    compatibility: statsComunicacao.compatibility,
    superMatches: statsComunicacao.superMatches,
    matches: statsComunicacao.matches,
    possibilities: statsComunicacao.possibilities,
    categories: {
      comunicacao_basico: { total: 5, matches: 0, superMatches: 0 },
      comunicacao_avancado: { total: 5, matches: 0, superMatches: 0 }
    }
  }
};

const encryptedComunicacao = encryptData(dataComunicacao, 'teste123');
fs.writeFileSync('teste123_comunicacao.q4c', encryptedComunicacao);
console.log('✅ Criado: teste123_comunicacao.q4c');
console.log(`   Compatibilidade: ${statsComunicacao.compatibility}% | Super Matches: ${statsComunicacao.superMatches}`);

console.log('\n🎉 Todos os ficheiros .q4c foram gerados com sucesso!');
console.log('🔐 Código de segurança: teste123');
console.log('\n📝 Ficheiros criados:');
console.log('   1. teste123_romantico.q4c');
console.log('   2. teste123_aventura.q4c');
console.log('   3. teste123_comunicacao.q4c');
console.log('\n🧪 Para testar: Abrir relatorio.html e fazer upload de qualquer ficheiro');
