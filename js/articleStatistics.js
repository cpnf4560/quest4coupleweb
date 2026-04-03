/* ============================================
   QUEST4COUPLE - ARTICLE STATISTICS
   Sistema de curiosidades baseadas em dados reais
   Inseridas dinamicamente nos artigos do blog
   ============================================ */

console.log('✅ articleStatistics.js carregado');

// ========================================
// MAPEAMENTO: Artigo → Questões Relevantes
// ========================================

/**
 * Mapeia cada artigo às questões dos packs que são relevantes para o tema
 * Formato: articleId → array de { packId, questionIndex, keywords[] }
 */
const articleQuestionMapping = {
  
  // === DINÂMICAS ===
  
  'menage-a-trois': {
    title: 'Ménage à Trois',
    questions: [
      { packId: 'poliamor', keywords: ['ménage', 'mmf', 'ffm', 'threesome', 'trio'] },
      { packId: 'poliamor', questionText: 'Ménage com outro homem (MMF)' },
      { packId: 'poliamor', questionText: 'Ménage com outra mulher (FFM)' },
      { packId: 'poliamor', questionText: 'Fantasia em threesome ou sexo em grupo' },
      { packId: 'poliamor', questionText: 'Que o/a parceiro/a tenha a fantasia de threesome' },
      { packId: 'poliamor', questionText: 'Um(a) amante em comum para o casal (Unicorn Hunting)' }
    ],
    curiosities: [
      {
        type: 'comparison',
        template: '📊 **Curiosidade Quest4Couple:** {porfavor_yup}% dos utilizadores aceitam a ideia de um ménage MMF. Se olharmos apenas para homens entre 35-45 anos, esta percentagem {direction} para {filtered_rate}%.',
        questionText: 'Ménage com outro homem (MMF)',
        filters: { gender: 'M', ageRange: '36-45' }
      },
      {
        type: 'gender_diff',
        template: '👫 **Diferença entre géneros:** {female_rate}% das mulheres vs {male_rate}% dos homens mostram abertura para um ménage FFM - uma diferença de {diff}%.',
        questionText: 'Ménage com outra mulher (FFM)'
      },
      {
        type: 'simple',
        template: '💭 **Fantasia comum:** {porfavor_yup}% dos casais na plataforma já fantasiaram com threesome, mesmo sem intenção de concretizar.',
        questionText: 'Fantasia em threesome ou sexo em grupo'
      }
    ]
  },

  'cuckold-dinamicas': {
    title: 'Dinâmicas Cuckold/Cuckquean',
    questions: [
      { packId: 'poliamor', questionText: 'Assistir ao/à parceiro/a a receber prazer sexual de outro/a' },
      { packId: 'poliamor', questionText: 'Receber prazer sexual de outro/a, sendo assistido/a' },
      { packId: 'pimentinha', questionText: 'Cuckqueaning/cuckolding light (fantasiar, não concretizar)' },
      { packId: 'poliamor', questionText: 'Fantasiar sobre o/a parceiro/a a ser elogiado/a por terceiros' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '📊 **Dados reais:** {porfavor_yup}% dos utilizadores aceitam assistir ao parceiro a receber prazer de outra pessoa.',
        questionText: 'Assistir ao/à parceiro/a a receber prazer sexual de outro/a'
      },
      {
        type: 'gender_diff',
        template: '👫 **Curiosidade:** A fantasia de cuckolding light é aceite por {female_rate}% das mulheres e {male_rate}% dos homens.',
        questionText: 'Cuckqueaning/cuckolding light (fantasiar, não concretizar)'
      }
    ]
  },

  'swing-iniciantes': {
    title: 'Swing para Iniciantes',
    questions: [
      { packId: 'poliamor', questionText: 'Ir a um bar/discoteca swing ou a uma festa, apenas para observar' },
      { packId: 'poliamor', questionText: 'Ir a um bar swing ou festa com o objetivo de participar' },
      { packId: 'poliamor', questionText: 'Soft Swing (apenas beijos e carícias com outro casal)' },
      { packId: 'poliamor', questionText: 'Hard Swing: A quatro, com troca completa entre casais' },
      { packId: 'poliamor', questionText: 'Dates com outro casal (ver se rola algo)' }
    ],
    curiosities: [
      {
        type: 'progression',
        template: '📈 **Progressão natural:** {rate1}% aceita ir observar a um clube swing, mas apenas {rate2}% estaria disposto a participar ativamente.',
        questions: [
          'Ir a um bar/discoteca swing ou a uma festa, apenas para observar',
          'Ir a um bar swing ou festa com o objetivo de participar'
        ]
      },
      {
        type: 'comparison',
        template: '🔥 **Soft vs Hard:** {rate1}% dos casais prefere soft swing (sem penetração), enquanto {rate2}% está aberto a hard swing completo.',
        questions: [
          'Soft Swing (apenas beijos e carícias com outro casal)',
          'Hard Swing: A quatro, com troca completa entre casais'
        ]
      }
    ]
  },

  'poliamor': {
    title: 'Poliamor Ético',
    questions: [
      { packId: 'poliamor', questionText: 'Ter encontros sexuais com terceiros de forma planeada e consentida' },
      { packId: 'poliamor', questionText: 'Parceiro/a fixo/a para mim só para sexo' },
      { packId: 'poliamor', questionText: 'Fantasiar com o/a parceiro/a a terem um relacionamento romântico' },
      { packId: 'poliamor', questionText: 'Discussão honesta sobre ciúme antes de haver envolvimento' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '💜 **Abertura ao poliamor:** {porfavor_yup}% dos utilizadores aceita a ideia de ter encontros consentidos com terceiros.',
        questionText: 'Ter encontros sexuais com terceiros de forma planeada e consentida'
      },
      {
        type: 'age_comparison',
        template: '📊 **Por faixa etária:** A aceitação de parceiros fixos externos vai de {young_rate}% (18-25 anos) a {older_rate}% (36-45 anos).',
        questionText: 'Parceiro/a fixo/a para mim só para sexo',
        ageRanges: ['18-25', '36-45']
      }
    ]
  },

  // === BDSM ===

  'bdsm-iniciantes': {
    title: 'BDSM para Iniciantes',
    questions: [
      { packId: 'pimentinha', questionText: 'Usar algemas durante o sexo' },
      { packId: 'pimentinha', questionText: 'Ser dominado/a de forma leve' },
      { packId: 'pimentinha', questionText: 'Dominar o/a parceiro/a de forma leve' },
      { packId: 'pimentinha', questionText: 'Sexo com venda nos olhos' },
      { packId: 'pimentinha', questionText: 'Experimentar spanking leve' },
      { packId: 'experiencia', questionText: 'Bondage leve com lençóis ou gravatas' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '⛓️ **Popularidade:** {porfavor_yup}% dos utilizadores já experimentou ou quer experimentar algemas durante o sexo.',
        questionText: 'Usar algemas durante o sexo'
      },
      {
        type: 'gender_diff',
        template: '👫 **Preferências:** {female_rate}% das mulheres gosta de ser dominada vs {male_rate}% dos homens.',
        questionText: 'Ser dominado/a de forma leve'
      },
      {
        type: 'simple',
        template: '👁️ **Sensorial:** Vendas nos olhos são aceites por {porfavor_yup}% - uma das práticas mais populares para iniciantes.',
        questionText: 'Sexo com venda nos olhos'
      }
    ]
  },

  'bdsm-avancado': {
    title: 'BDSM Avançado',
    questions: [
      { packId: 'kinks', questionText: 'Ataduras/amarrações elaboradas (shibari, cordas)' },
      { packId: 'kinks', questionText: 'Imobilização total com correntes, algemas ou cuffs' },
      { packId: 'kinks', questionText: 'Gagging (tapar a boca) e/ou muzzling (mordaças)' },
      { packId: 'kinks', questionText: 'Spanking (palmadas) intensas ao ponto de deixar marca' },
      { packId: 'kinks', questionText: 'Impact play (impacto) usando a mão ou utensílios' },
      { packId: 'kinks', questionText: 'Brincar com cera quente (wax play)' },
      { packId: 'kinks', questionText: 'Edge play (levar ao orgasmo e parar repetidamente)' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '🎭 **Shibari:** Apenas {porfavor_yup}% está interessado em amarrações elaboradas como shibari - uma prática que requer dedicação e conhecimento.',
        questionText: 'Ataduras/amarrações elaboradas (shibari, cordas)'
      },
      {
        type: 'comparison',
        template: '🔥 **Intensidade:** {rate1}% aceita spanking intenso, mas apenas {rate2}% aceita impact play com utensílios.',
        questions: [
          'Spanking (palmadas) intensas ao ponto de deixar marca',
          'Impact play (impacto) usando a mão ou utensílios'
        ]
      },
      {
        type: 'gender_diff',
        template: '🎯 **Edge play:** {female_rate}% das mulheres vs {male_rate}% dos homens gostam de ser levados ao limite e parar.',
        questionText: 'Edge play (levar ao orgasmo e parar repetidamente)'
      }
    ]
  },

  // === PRÁTICAS ESPECÍFICAS ===

  'pegging-guia': {
    title: 'Pegging',
    questions: [
      { packId: 'pimentinha', questionText: 'Pegging (sexo com strap-on)' },
      { packId: 'pimentinha', questionText: 'Penetração anal com dedos no/a parceiro/a' },
      { packId: 'pimentinha', questionText: 'Receber penetração anal com dedos' },
      { packId: 'pimentinha', questionText: 'Usar vibrador de próstata' },
      { packId: 'pimentinha', questionText: 'Massagem prostática externa' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '🔄 **Pegging:** {porfavor_yup}% dos utilizadores está aberto a experimentar pegging - uma prática em crescimento.',
        questionText: 'Pegging (sexo com strap-on)'
      },
      {
        type: 'gender_diff',
        template: '👫 **Perspetivas:** {female_rate}% das mulheres quer experimentar dar, {male_rate}% dos homens aceita receber.',
        questionText: 'Pegging (sexo com strap-on)'
      },
      {
        type: 'age_comparison',
        template: '📊 **Gerações:** O interesse em vibrador de próstata varia de {young_rate}% (18-25) a {older_rate}% (36-45).',
        questionText: 'Usar vibrador de próstata',
        ageRanges: ['18-25', '36-45']
      }
    ]
  },

  'sexo-anal-guia': {
    title: 'Sexo Anal',
    questions: [
      { packId: 'pimentinha', questionText: 'Beijo grego (com devida higiene)' },
      { packId: 'pimentinha', questionText: 'Estimular o anus do/a parceiro/a (externo)' },
      { packId: 'pimentinha', questionText: 'Penetração anal com dedos' },
      { packId: 'pimentinha', questionText: 'Experimentar plugs anais' },
      { packId: 'experiencia', questionText: 'Usar um butt plug durante o sexo' },
      { packId: 'pimentinha', questionText: 'Usar anal beads (contas anais)' }
    ],
    curiosities: [
      {
        type: 'progression',
        template: '📈 **Progressão:** {rate1}% aceita estimulação anal externa, {rate2}% aceita dedos, e {rate3}% experimenta plugs.',
        questions: [
          'Estimular o anus do/a parceiro/a (externo)',
          'Penetração anal com dedos',
          'Experimentar plugs anais'
        ]
      },
      {
        type: 'simple',
        template: '💋 **Beijo grego:** Surpreendentemente, {porfavor_yup}% está aberto a esta prática (com higiene adequada).',
        questionText: 'Beijo grego (com devida higiene)'
      }
    ]
  },

  'sexo-oral-tecnicas': {
    title: 'Técnicas de Sexo Oral',
    questions: [
      { packId: 'romantico', questionText: 'Acordar o/a parceiro/a com sexo oral' },
      { packId: 'romantico', questionText: 'Ser acordado/a com sexo oral' },
      { packId: 'pimentinha', questionText: 'Sexo oral como atividade principal' },
      { packId: 'pimentinha', questionText: 'Facesitting (sentar na cara do/a parceiro/a)' },
      { packId: 'pimentinha', questionText: 'Throatfucking (oral profundo)' },
      { packId: 'experiencia', questionText: 'Teabag (oral nos testículos)' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '☀️ **Despertar sensual:** {porfavor_yup}% adora ser acordado com sexo oral - uma das fantasias mais populares.',
        questionText: 'Ser acordado/a com sexo oral'
      },
      {
        type: 'gender_diff',
        template: '👫 **Facesitting:** {female_rate}% das mulheres vs {male_rate}% dos homens gostam desta prática.',
        questionText: 'Facesitting (sentar na cara do/a parceiro/a)'
      },
      {
        type: 'simple',
        template: '🔥 **Oral como foco:** {porfavor_yup}% prefere sexo oral como atividade principal, sem necessidade de penetração.',
        questionText: 'Sexo oral como atividade principal'
      }
    ]
  },

  // === FETICHES ===

  'glossario-fetiches': {
    title: 'Glossário de Fetiches',
    questions: [
      { packId: 'kinks', questionText: 'Pés (foot fetishism)' },
      { packId: 'kinks', questionText: 'Látex/borracha (rubber fetishism)' },
      { packId: 'kinks', questionText: 'Couro/cabedal (leather)' },
      { packId: 'kinks', questionText: 'Uniformes (militar, enfermagem)' },
      { packId: 'kinks', questionText: 'Meias de rede, fishnets' },
      { packId: 'kinks', questionText: 'Sapatos de salto alto ou botas' },
      { packId: 'kinks', questionText: 'Tatuagens e piercings como fator de atração' }
    ],
    curiosities: [
      {
        type: 'ranking',
        template: '📊 **Top fetiches de vestuário:** 1) Meias/fishnets ({rate1}%), 2) Saltos altos ({rate2}%), 3) Uniformes ({rate3}%), 4) Couro ({rate4}%)',
        questions: [
          'Meias de rede, fishnets',
          'Sapatos de salto alto ou botas',
          'Uniformes (militar, enfermagem)',
          'Couro/cabedal (leather)'
        ]
      },
      {
        type: 'simple',
        template: '👣 **Podolatria:** O fetiche por pés é aceite por {porfavor_yup}% dos utilizadores - mais comum do que se pensa!',
        questionText: 'Pés (foot fetishism)'
      },
      {
        type: 'gender_diff',
        template: '🎨 **Tatuagens:** {female_rate}% das mulheres vs {male_rate}% dos homens veem tatuagens como fator de atração sexual.',
        questionText: 'Tatuagens e piercings como fator de atração'
      }
    ]
  },

  'parafilias-guia': {
    title: 'Parafilias',
    questions: [
      { packId: 'kinks', questionText: 'Urina (urolagnia ou golden shower)' },
      { packId: 'kinks', questionText: 'Fezes (scat ou coprophilia)' },
      { packId: 'kinks', questionText: 'Sangue (vampirism / hematolagnia)' },
      { packId: 'kinks', questionText: 'Age play (brincar com diferenças de idade)' },
      { packId: 'kinks', questionText: 'Furry (fantasias com disfarces de animais) ou pet play' },
      { packId: 'kinks', questionText: 'Diaper play (uso de fraldas)' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '🧠 **Dados reais:** Apenas {porfavor_yup}% demonstra interesse em golden shower - uma das parafilias mais conhecidas.',
        questionText: 'Urina (urolagnia ou golden shower)'
      },
      {
        type: 'comparison',
        template: '📊 **Parafilias de role:** Age play ({rate1}%) é mais aceite que pet play ({rate2}%) ou diaper play ({rate3}%).',
        questions: [
          'Age play (brincar com diferenças de idade)',
          'Furry (fantasias com disfarces de animais) ou pet play',
          'Diaper play (uso de fraldas)'
        ]
      }
    ]
  },

  // === SAÚDE E DICAS ===

  'massagem-tantrica': {
    title: 'Massagem Tântrica',
    questions: [
      { packId: 'romantico', questionText: 'Experimentar massagem Yoni/Lingham (tântrica)' },
      { packId: 'poliamor', questionText: 'Fazer uma massagem tântrica (Yoni/Lingham)' },
      { packId: 'poliamor', questionText: 'Que o/a parceiro/a receba uma massagem tântrica de terceiro/a' },
      { packId: 'romantico', questionText: 'Experimentar sexo tântrico (respiração sincronizada)' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '🧘 **Interesse crescente:** {porfavor_yup}% dos utilizadores quer experimentar massagem Yoni/Lingam.',
        questionText: 'Experimentar massagem Yoni/Lingham (tântrica)'
      },
      {
        type: 'gender_diff',
        template: '👫 **Por género:** {female_rate}% das mulheres vs {male_rate}% dos homens mostram interesse em sexo tântrico.',
        questionText: 'Experimentar sexo tântrico (respiração sincronizada)'
      }
    ]
  },

  'comunicacao-casal': {
    title: 'Comunicação Sexual',
    questions: [
      { packId: 'romantico', questionText: 'Palavras de carinho e afeto durante o sexo' },
      { packId: 'romantico', questionText: 'Conversar sobre o que gostamos na pornografia' },
      { packId: 'experiencia', questionText: 'Conversar abertamente sobre fantasias sexuais secretas' },
      { packId: 'romantico', questionText: 'Trocar fantasias sexuais por escrito' },
      { packId: 'romantico', questionText: 'Partilhar qual foi o momento sexual mais memorável' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '💬 **Comunicação:** {porfavor_yup}% dos casais quer conversar abertamente sobre fantasias secretas.',
        questionText: 'Conversar abertamente sobre fantasias sexuais secretas'
      },
      {
        type: 'gender_diff',
        template: '👫 **Escrita vs Verbal:** {female_rate}% das mulheres prefere trocar fantasias por escrito vs {male_rate}% dos homens.',
        questionText: 'Trocar fantasias sexuais por escrito'
      }
    ]
  },

  'guia-posicoes': {
    title: 'Guia de Posições',
    questions: [
      { packId: 'romantico', questionText: 'Explorar posições novas do Kamasutra' },
      { packId: 'experiencia', questionText: 'Tentar uma posição nova por semana' },
      { packId: 'romantico', questionText: 'Sexo lento e profundamente conectado' },
      { packId: 'pimentinha', questionText: 'Sexo em pé contra a parede' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '🛏️ **Exploração:** {porfavor_yup}% quer explorar posições novas do Kamasutra.',
        questionText: 'Explorar posições novas do Kamasutra'
      },
      {
        type: 'age_comparison',
        template: '📊 **Por idade:** O interesse em posição nova por semana varia: {young_rate}% (18-25) vs {older_rate}% (36-45).',
        questionText: 'Tentar uma posição nova por semana',
        ageRanges: ['18-25', '36-45']
      }
    ]
  },

  // === LIFESTYLE ===

  'dogging-guia': {
    title: 'Dogging',
    questions: [
      { packId: 'poliamor', questionText: 'Dogging Ativo: Fazer sexo em locais públicos' },
      { packId: 'experiencia', questionText: 'Sexo ao ar livre (praia, floresta, beco)' },
      { packId: 'pimentinha', questionText: 'Sexo no carro em local discreto' },
      { packId: 'pimentinha', questionText: 'Ser \'apanhado/a\' durante o sexo' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '🚗 **Dogging:** Apenas {porfavor_yup}% está interessado em dogging ativo com observadores.',
        questionText: 'Dogging Ativo: Fazer sexo em locais públicos'
      },
      {
        type: 'comparison',
        template: '🌳 **Ar livre:** {rate1}% aceita sexo ao ar livre, mas apenas {rate2}% em contexto de dogging.',
        questions: [
          'Sexo ao ar livre (praia, floresta, beco)',
          'Dogging Ativo: Fazer sexo em locais públicos'
        ]
      }
    ]
  },

  'cruising-gloryholes': {
    title: 'Cruising e Gloryholes',
    questions: [
      { packId: 'poliamor', questionText: 'Frequentar saunas mistas ou cruising spots (como gloryholes)' },
      { packId: 'experiencia', questionText: 'Visitar uma sauna mista juntos' },
      { packId: 'kinks', questionText: 'Sexo com máscaras ou anonimato' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '🚪 **Cruising:** {porfavor_yup}% mostra interesse em frequentar cruising spots ou gloryholes.',
        questionText: 'Frequentar saunas mistas ou cruising spots (como gloryholes)'
      },
      {
        type: 'gender_diff',
        template: '👫 **Anonimato:** Sexo anónimo com máscaras atrai {female_rate}% das mulheres e {male_rate}% dos homens.',
        questionText: 'Sexo com máscaras ou anonimato'
      }
    ]
  },

  'turismo-adulto': {
    title: 'Turismo Adulto',
    questions: [
      { packId: 'experiencia', questionText: 'Viagem/férias focada em prazer e intimidade' },
      { packId: 'experiencia', questionText: 'Noite íntima num motel/hotel' },
      { packId: 'poliamor', questionText: 'Experiências poliamorosas no estrangeiro' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '✈️ **Viagens sensuais:** {porfavor_yup}% dos casais sonha com férias focadas em prazer e intimidade.',
        questionText: 'Viagem/férias focada em prazer e intimidade'
      }
    ]
  },

  'praias-nudistas-portugal': {
    title: 'Praias Nudistas',
    questions: [
      { packId: 'experiencia', questionText: 'Experimentar nudismo numa praia ou resort' },
      { packId: 'poliamor', questionText: 'Convidar casal para encontro íntimo (nudismo, por ex)' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '🏖️ **Nudismo:** {porfavor_yup}% dos utilizadores quer experimentar nudismo em praia ou resort.',
        questionText: 'Experimentar nudismo numa praia ou resort'
      },
      {
        type: 'age_comparison',
        template: '📊 **Por geração:** Interesse em nudismo: {young_rate}% (18-25) vs {older_rate}% (36-45 anos).',
        questionText: 'Experimentar nudismo numa praia ou resort',
        ageRanges: ['18-25', '36-45']
      }
    ]
  },

  // === BRINQUEDOS ===

  'brinquedos-casais': {
    title: 'Brinquedos Sexuais',
    questions: [
      { packId: 'experiencia', questionText: 'Comprar um brinquedo sexual para usarem juntos' },
      { packId: 'pimentinha', questionText: 'Usar vibrador/outro juntos (em simultâneo)' },
      { packId: 'pimentinha', questionText: 'Brincar com um vibrador de controlo remoto em locais públicos' },
      { packId: 'experiencia', questionText: 'Usar brinquedo com controlo remoto discretamente' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '🎁 **Brinquedos a dois:** {porfavor_yup}% dos casais quer comprar brinquedos para usar juntos.',
        questionText: 'Comprar um brinquedo sexual para usarem juntos'
      },
      {
        type: 'gender_diff',
        template: '👫 **Controlo remoto em público:** {female_rate}% das mulheres vs {male_rate}% dos homens aceitam esta ideia picante.',
        questionText: 'Brincar com um vibrador de controlo remoto em locais públicos'
      }
    ]
  },

  'pompoarismo-guia': {
    title: 'Pompoarismo',
    questions: [
      { packId: 'romantico', questionText: 'Prolongar preliminares por mais de 30 minutos' },
      { packId: 'romantico', questionText: 'Sedução lenta e prolongada' }
    ],
    curiosities: [
      {
        type: 'gender_diff',
        template: '💪 **Preliminares longas:** {female_rate}% das mulheres vs {male_rate}% dos homens querem preliminares de 30+ minutos.',
        questionText: 'Prolongar preliminares por mais de 30 minutos'
      }
    ]
  },

  // === ROLEPLAY ===

  'tasklists-sexuais': {
    title: 'Tasklists Sexuais',
    questions: [
      { packId: 'romantico', questionText: 'Escrever uma \'bucket list sexual\' juntos' },
      { packId: 'romantico', questionText: 'Agendar e planear ao detalhe um encontro íntimo' },
      { packId: 'experiencia', questionText: 'Desafio de 7 experiências em 7 dias' },
      { packId: 'experiencia', questionText: 'Experimentar um \'sex jar\' (frasco com ideias escritas)' }
    ],
    curiosities: [
      {
        type: 'simple',
        template: '📋 **Bucket list:** {porfavor_yup}% dos casais quer criar uma lista de desejos sexuais juntos.',
        questionText: 'Escrever uma \'bucket list sexual\' juntos'
      },
      {
        type: 'gender_diff',
        template: '👫 **Planeamento:** {female_rate}% das mulheres vs {male_rate}% dos homens gostam de planear encontros íntimos.',
        questionText: 'Agendar e planear ao detalhe um encontro íntimo'
      }
    ]
  }
};

// ========================================
// PACK ID MAPPING
// ========================================

const packIdMap = {
  'romantico': 'romantico',
  'experiencia': 'experiencia', 
  'pimentinha': 'pimentinha',
  'poliamor': 'poliamor',
  'kinks': 'kinks'
};

// ========================================
// FUNÇÕES DE CÁLCULO
// ========================================

/**
 * Calcula taxa de aceitação (porfavor + yup + talvez*0.5)
 * @param {Object} data - { porfavor, yup, talvez, meh, total }
 * @returns {number} Percentagem de aceitação
 */
function calculateAcceptanceRate(data) {
  if (!data || !data.total || data.total === 0) return null;
  const accepted = (data.porfavor || 0) + (data.yup || 0) + ((data.talvez || 0) * 0.5);
  return Math.round((accepted / data.total) * 100);
}

/**
 * Busca estatísticas de uma questão específica
 * @param {string} questionText - Texto parcial da questão
 * @param {Array} analyticsData - Dados do cache de analytics
 * @returns {Object|null} Estatísticas da questão
 */
function findQuestionStats(questionText, analyticsData) {
  if (!analyticsData || !questionText) return null;
  
  const searchText = questionText.toLowerCase().trim();
  
  return analyticsData.find(q => {
    if (!q.questionText) return false;
    const qText = q.questionText.toLowerCase().trim();
    
    // Match exato ou parcial
    return qText.includes(searchText) || searchText.includes(qText) ||
           qText.split(' ').some(word => searchText.includes(word) && word.length > 4);
  });
}

/**
 * Gera curiosidades para um artigo
 * @param {string} articleId - ID do artigo
 * @param {Array} analyticsData - Dados do cache de analytics
 * @returns {Array} Array de curiosidades formatadas em HTML
 */
function generateArticleCuriosities(articleId, analyticsData) {
  const mapping = articleQuestionMapping[articleId];
  if (!mapping || !mapping.curiosities || !analyticsData || analyticsData.length === 0) {
    return [];
  }

  const curiosities = [];

  for (const curiosity of mapping.curiosities) {
    try {
      let html = '';

      switch (curiosity.type) {
        case 'simple': {
          const stats = findQuestionStats(curiosity.questionText, analyticsData);
          if (!stats) continue;
          
          const rate = calculateAcceptanceRate(stats);
          if (rate === null) continue;
          
          html = curiosity.template
            .replace('{porfavor_yup}', rate)
            .replace('{total}', stats.total);
          break;
        }

        case 'gender_diff': {
          const stats = findQuestionStats(curiosity.questionText, analyticsData);
          if (!stats || !stats.byGender) continue;
          
          const femaleData = stats.byGender['F'];
          const maleData = stats.byGender['M'];
          
          if (!femaleData || !maleData) continue;
          
          const femaleRate = calculateAcceptanceRate(femaleData);
          const maleRate = calculateAcceptanceRate(maleData);
          
          if (femaleRate === null || maleRate === null) continue;
          
          const diff = Math.abs(femaleRate - maleRate);
          
          html = curiosity.template
            .replace('{female_rate}', femaleRate)
            .replace('{male_rate}', maleRate)
            .replace('{diff}', diff);
          break;
        }

        case 'comparison': {
          const stats = findQuestionStats(curiosity.questionText, analyticsData);
          if (!stats || !stats.byGender) continue;
          
          const overallRate = calculateAcceptanceRate(stats);
          if (overallRate === null) continue;
          
          // Get filtered rate
          let filteredRate = null;
          let filterData = null;
          
          if (curiosity.filters?.gender && stats.byGender[curiosity.filters.gender]) {
            filterData = stats.byGender[curiosity.filters.gender];
          }
          
          if (curiosity.filters?.ageRange && stats.byAge) {
            // Map age ranges
            const ageRangeMapping = {
              '18-25': ['18-23', '18-24', '24-29'],
              '26-35': ['24-29', '25-34', '30-35'],
              '36-45': ['35-44', '36-40', '41-49'],
              '46-55': ['41-49', '50+'],
              '56+': ['50+']
            };
            const targetRanges = ageRangeMapping[curiosity.filters.ageRange] || [curiosity.filters.ageRange];
            
            let aggregated = { porfavor: 0, yup: 0, talvez: 0, meh: 0, total: 0 };
            targetRanges.forEach(range => {
              const rangeData = stats.byAge[range];
              if (rangeData) {
                aggregated.porfavor += rangeData.porfavor || 0;
                aggregated.yup += rangeData.yup || 0;
                aggregated.talvez += rangeData.talvez || 0;
                aggregated.meh += rangeData.meh || 0;
                aggregated.total += rangeData.total || 0;
              }
            });
            
            if (aggregated.total > 0) {
              filterData = aggregated;
            }
          }
          
          if (filterData) {
            filteredRate = calculateAcceptanceRate(filterData);
          }
          
          if (filteredRate === null) continue;
          
          const direction = filteredRate > overallRate ? 'sobe' : 'desce';
          
          html = curiosity.template
            .replace('{porfavor_yup}', overallRate)
            .replace('{filtered_rate}', filteredRate)
            .replace('{direction}', direction);
          break;
        }

        case 'progression': {
          if (!curiosity.questions || curiosity.questions.length < 2) continue;
          
          const rates = [];
          for (const qText of curiosity.questions) {
            const stats = findQuestionStats(qText, analyticsData);
            if (!stats) {
              rates.push(null);
              continue;
            }
            rates.push(calculateAcceptanceRate(stats));
          }
          
          if (rates.some(r => r === null)) continue;
          
          html = curiosity.template;
          rates.forEach((rate, i) => {
            html = html.replace(`{rate${i + 1}}`, rate);
          });
          break;
        }

        case 'ranking': {
          if (!curiosity.questions || curiosity.questions.length < 2) continue;
          
          const items = [];
          for (const qText of curiosity.questions) {
            const stats = findQuestionStats(qText, analyticsData);
            if (!stats) continue;
            const rate = calculateAcceptanceRate(stats);
            if (rate !== null) {
              items.push({ text: qText, rate });
            }
          }
          
          if (items.length < 2) continue;
          
          // Sort by rate descending
          items.sort((a, b) => b.rate - a.rate);
          
          html = curiosity.template;
          items.forEach((item, i) => {
            html = html.replace(`{rate${i + 1}}`, item.rate);
          });
          break;
        }

        case 'age_comparison': {
          const stats = findQuestionStats(curiosity.questionText, analyticsData);
          if (!stats || !stats.byAge || !curiosity.ageRanges) continue;
          
          const ageRangeMapping = {
            '18-25': ['18-23', '18-24', '24-29'],
            '26-35': ['24-29', '25-34', '30-35'],
            '36-45': ['35-44', '36-40', '41-49'],
            '46-55': ['41-49', '50+'],
            '56+': ['50+']
          };
          
          const rates = [];
          for (const ageRange of curiosity.ageRanges) {
            const targetRanges = ageRangeMapping[ageRange] || [ageRange];
            let aggregated = { porfavor: 0, yup: 0, talvez: 0, meh: 0, total: 0 };
            
            targetRanges.forEach(range => {
              const rangeData = stats.byAge[range];
              if (rangeData) {
                aggregated.porfavor += rangeData.porfavor || 0;
                aggregated.yup += rangeData.yup || 0;
                aggregated.talvez += rangeData.talvez || 0;
                aggregated.meh += rangeData.meh || 0;
                aggregated.total += rangeData.total || 0;
              }
            });
            
            if (aggregated.total > 0) {
              rates.push(calculateAcceptanceRate(aggregated));
            } else {
              rates.push(null);
            }
          }
          
          if (rates.some(r => r === null)) continue;
          
          html = curiosity.template
            .replace('{young_rate}', rates[0])
            .replace('{older_rate}', rates[1]);
          break;
        }
      }

      if (html) {
        curiosities.push({
          html: formatCuriosityHtml(html),
          type: curiosity.type
        });
      }
    } catch (error) {
      console.error(`Erro ao gerar curiosidade para ${articleId}:`, error);
    }
  }

  return curiosities;
}

/**
 * Formata o HTML da curiosidade com estilos
 * @param {string} text - Texto da curiosidade (pode ter markdown básico)
 * @returns {string} HTML formatado
 */
function formatCuriosityHtml(text) {
  // Convert **bold** to <strong>
  let html = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  return `
    <div class="article-curiosity" style="
      background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
      border-left: 4px solid #667eea;
      padding: 15px 20px;
      margin: 25px 0;
      border-radius: 0 12px 12px 0;
      font-size: 0.95em;
      line-height: 1.6;
    ">
      ${html}
      <div style="
        font-size: 0.75em;
        color: #6c757d;
        margin-top: 8px;
        font-style: italic;
      ">
        Dados baseados em respostas anónimas na plataforma Quest4Couple
      </div>
    </div>
  `;
}

/**
 * Insere curiosidades num artigo já renderizado
 * @param {string} articleId - ID do artigo
 * @param {string} contentHtml - HTML do conteúdo do artigo
 * @param {Array} analyticsData - Dados do cache de analytics
 * @returns {string} HTML com curiosidades inseridas
 */
function insertCuriositiesIntoArticle(articleId, contentHtml, analyticsData) {
  const curiosities = generateArticleCuriosities(articleId, analyticsData);
  
  if (curiosities.length === 0) {
    return contentHtml;
  }

  // Strategy: Insert after specific sections or spread throughout
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${contentHtml}</div>`, 'text/html');
  const container = doc.body.firstChild;
  
  // Find h3 or h4 elements to insert after
  const headings = container.querySelectorAll('h3, h4');
  
  if (headings.length === 0) {
    // No headings, just append at the end
    curiosities.forEach(c => {
      const div = doc.createElement('div');
      div.innerHTML = c.html;
      container.appendChild(div.firstChild);
    });
  } else {
    // Distribute curiosities after headings
    const insertionPoints = Math.min(curiosities.length, Math.floor(headings.length / 2));
    const step = Math.max(1, Math.floor(headings.length / (insertionPoints + 1)));
    
    let curiosityIndex = 0;
    for (let i = step; i < headings.length && curiosityIndex < curiosities.length; i += step) {
      const heading = headings[i];
      // Find the next sibling that's a paragraph or div
      let insertAfter = heading.nextElementSibling;
      while (insertAfter && !['P', 'DIV', 'UL', 'OL'].includes(insertAfter.tagName)) {
        insertAfter = insertAfter.nextElementSibling;
      }
      
      if (insertAfter) {
        const div = doc.createElement('div');
        div.innerHTML = curiosities[curiosityIndex].html;
        insertAfter.parentNode.insertBefore(div.firstChild, insertAfter.nextSibling);
        curiosityIndex++;
      }
    }
    
    // If we have remaining curiosities, add them at the end
    while (curiosityIndex < curiosities.length) {
      const div = doc.createElement('div');
      div.innerHTML = curiosities[curiosityIndex].html;
      container.appendChild(div.firstChild);
      curiosityIndex++;
    }
  }
  
  return container.innerHTML;
}

// ========================================
// EXPORT / GLOBAL ACCESS
// ========================================

// Make functions available globally
window.articleStatistics = {
  articleQuestionMapping,
  generateArticleCuriosities,
  insertCuriositiesIntoArticle,
  calculateAcceptanceRate,
  findQuestionStats
};

console.log('📊 articleStatistics: Sistema de curiosidades carregado com', Object.keys(articleQuestionMapping).length, 'artigos mapeados');
