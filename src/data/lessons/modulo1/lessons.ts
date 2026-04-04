// src/data/lessons/modulo1/lessons.ts
// Módulo 1 — Introdução ao Mercado Financeiro (1.1 a 1.11)

export interface MatchPair {
  term: string;
  definition: string;
}

export interface Step {
  type: "explanation" | "example" | "activity" | "true_false" | "match_pairs";
  title?: string;
  body?: string;
  highlight?: string;
  emoji?: string;
  question?: string;
  options?: string[];
  correct?: number;
  statement?: string;
  explanation?: string;
  pairs?: MatchPair[];
}

export interface Lesson {
  title: string;
  slug: string;
  steps: Step[];
}

export const modulo1Content: Lesson[] = [
  {
    "title": "1.1 A História do Mercado Financeiro",
    "slug": "historia-mercado-financeiro",
    "steps": [
      {
        "type": "explanation",
        "title": "Tudo começou num café ☕",
        "body": "Em 1602, a Companhia das Índias Orientais precisava de grana pra financiar suas viagens. A solução foi genial: vender pedaços da empresa pra várias pessoas. Quem comprasse virava sócio e dividia o lucro. Isso foi a primeira ação da história. 🚢",
        "emoji": "💡"
      },
      {
        "type": "example",
        "title": "A Lanchonete dos Amigos",
        "body": "Imagina que tu e mais 9 amigos juntam dinheiro pra abrir uma lanchonete. Cada um vira sócio com 10% do negócio. Se lucrar, todo mundo ganha. Se der prejuízo, todo mundo sofre junto. Isso é exatamente o que uma ação representa.",
        "highlight": "1602 → Primeira ação da história (Holanda)\n1792 → Bolsa de NY fundada debaixo de uma árvore 🌳\n2008 → Bovespa + BM&F viram BM&FBovespa\n2017 → Fusão com Cetip cria a B3",
        "emoji": "🎯"
      },
      {
        "type": "activity",
        "question": "Em qual país surgiu a primeira bolsa de valores do mundo?",
        "options": ["Inglaterra", "Estados Unidos", "Holanda", "Brasil"],
        "correct": 2
      },
      {
        "type": "true_false",
        "statement": "A bolsa de valores foi criada no século XX com o surgimento da internet.",
        "correct": 0,
        "explanation": "Falso! A bolsa existe desde 1602, muito antes da internet ou dos computadores."
      },
      {
        "type": "match_pairs",
        "pairs": [
          { "term": "Ação", "definition": "Pedaço de uma empresa à venda" },
          { "term": "Sócio", "definition": "Quem possui parte de um negócio" },
          { "term": "Companhia das Índias", "definition": "Primeira empresa a vender ações" },
          { "term": "1602", "definition": "Ano do nascimento do mercado de capitais" }
        ]
      }
    ]
  },
  {
    "title": "1.2 Para que Serve a Bolsa?",
    "slug": "para-que-serve-a-bolsa",
    "steps": [
      {
        "type": "explanation",
        "title": "A bolsa é uma ponte 🌉",
        "body": "A bolsa conecta dois lados que precisam um do outro. De um lado, empresas que precisam de dinheiro pra crescer. Do outro, investidores que têm dinheiro e querem fazê-lo render. É o ponto de encontro perfeito entre esses dois mundos. 🤝",
        "emoji": "💡"
      },
      {
        "type": "example",
        "title": "O iFood do Dinheiro",
        "body": "Pensa no iFood: restaurante quer vender, cliente quer comer — o app conecta os dois. A bolsa faz o mesmo, só que com dinheiro e participação em empresas. A Magazine Luiza queria expandir pro Norte e Nordeste, precisava de R$ 1 bilhão e não queria pagar juros de banco. Solução? Vendeu ações na bolsa.",
        "highlight": "Empresa capta dinheiro sem pagar juros bancários\nInvestidor entra como sócio e pode lucrar\nA bolsa organiza e garante a transação\nTodos ganham quando o negócio vai bem 📈",
        "emoji": "🎯"
      },
      {
        "type": "activity",
        "question": "Qual é a função principal da bolsa de valores?",
        "options": [
          "Guardar dinheiro com segurança",
          "Emprestar dinheiro com juros",
          "Conectar empresas que precisam de capital com investidores",
          "Controlar a inflação do país"
        ],
        "correct": 2
      },
      {
        "type": "true_false",
        "statement": "Quando uma empresa vende ações na bolsa, ela está pedindo dinheiro emprestado e terá que devolver com juros.",
        "correct": 0,
        "explanation": "Falso! A empresa não devolve o dinheiro. Ela vende uma parte de si mesma. O investidor vira sócio, não credor."
      },
      {
        "type": "match_pairs",
        "pairs": [
          { "term": "Empresa", "definition": "Precisa de capital pra crescer" },
          { "term": "Investidor", "definition": "Tem capital e quer rendimento" },
          { "term": "Bolsa", "definition": "Ambiente que conecta os dois lados" },
          { "term": "Ação", "definition": "O ingresso de entrada na sociedade" }
        ]
      }
    ]
  },
  {
    "title": "1.3 Quem Participa da Bolsa?",
    "slug": "quem-participa-da-bolsa",
    "steps": [
      {
        "type": "explanation",
        "title": "O cast completo do mercado 👥",
        "body": "A bolsa não é só pra rico. Mas tem vários personagens nessa história — e cada um tem um papel diferente. É como um jogo online: tem o jogador, o servidor, o moderador e a plataforma. Tira um, o jogo não roda.",
        "emoji": "💡"
      },
      {
        "type": "example",
        "title": "O Show ao Vivo do Mercado",
        "body": "Pensa num show: tem o artista (empresa), o público (investidor), o ingresso (ação), a casa de shows (bolsa) e a bilheteria (corretora). Quando você quer comprar ações da Petrobras, você não liga pra Petrobras. Você acessa sua corretora, faz a ordem, e a B3 executa. A CVM garante que ninguém tá trapaceando.",
        "highlight": "🏢 Empresas → vendem ações pra captar recursos\n👤 Investidores → compram ações pra lucrar\n🏦 Corretoras → intermediam as operações\n🏛️ B3 → o ambiente onde tudo acontece\n🚔 CVM → o fiscal que regula e protege",
        "emoji": "🎯"
      },
      {
        "type": "activity",
        "question": "Qual órgão regula e fiscaliza o mercado de capitais no Brasil?",
        "options": [
          "Banco Central",
          "Receita Federal",
          "Tesouro Nacional",
          "CVM — Comissão de Valores Mobiliários"
        ],
        "correct": 3
      },
      {
        "type": "true_false",
        "statement": "Para comprar ações, o investidor precisa contatar diretamente a empresa que emitiu os papéis.",
        "correct": 0,
        "explanation": "Falso! O investidor opera por meio de uma corretora, que acessa a bolsa em seu nome."
      },
      {
        "type": "match_pairs",
        "pairs": [
          { "term": "CVM", "definition": "Órgão regulador do mercado" },
          { "term": "Corretora", "definition": "Intermediária entre investidor e bolsa" },
          { "term": "B3", "definition": "Ambiente oficial de negociação" },
          { "term": "Investidor", "definition": "Comprador de participação em empresas" }
        ]
      }
    ]
  },
  {
    "title": "1.4 O que Acontece quando Você Compra uma Ação?",
    "slug": "o-que-acontece-ao-comprar-acao",
    "steps": [
      {
        "type": "explanation",
        "title": "Você virou sócio — de verdade 🤯",
        "body": "Comprar uma ação não é comprar um papel. É comprar um pedaço real de uma empresa. Quando você compra 1 ação da Ambev, você literalmente possui uma fração da empresa que fabrica a Skol, a Brahma e o Guaraná Antarctica. Se a Ambev lucra → você lucra. Se vai mal → seu patrimônio cai junto.",
        "emoji": "💡"
      },
      {
        "type": "example",
        "title": "A Pizza Que Pode se Multiplicar 🍕",
        "body": "É como entrar num grupo pra rachar uma pizza. Você paga sua parte, come sua parte, e se a pizza vier ruim, sofre junto. Só que aqui a pizza pode se multiplicar! Você compra 10 ações de ABEV3 a R$ 12,00. Total: R$ 120. Daqui a 1 ano, a ação vai pra R$ 15,00. Seu patrimônio vira R$ 150 — lucro de 25%. 🎉",
        "highlight": "Você vira sócio no momento da compra\nLucro pode vir de valorização da ação\nLucro pode vir de dividendos pagos pela empresa\nO risco de queda também é seu — sem garantia",
        "emoji": "🎯"
      },
      {
        "type": "activity",
        "question": "O que representa possuir uma ação de uma empresa?",
        "options": [
          "Um empréstimo feito à empresa",
          "Uma fração da propriedade da empresa",
          "Uma promessa de lucro garantido",
          "Um contrato de prestação de serviços"
        ],
        "correct": 1
      },
      {
        "type": "true_false",
        "statement": "Ao comprar ações, o investidor tem garantia de lucro, pois a empresa é obrigada a pagar dividendos todo ano.",
        "correct": 0,
        "explanation": "Falso! Não há garantia de lucro nem obrigatoriedade de pagamento de dividendos. O retorno depende do desempenho da empresa."
      },
      {
        "type": "match_pairs",
        "pairs": [
          { "term": "Dividendo", "definition": "Parte do lucro distribuída ao acionista" },
          { "term": "Valorização", "definition": "Aumento no preço da ação ao longo do tempo" },
          { "term": "Risco", "definition": "Possibilidade de perda no investimento" },
          { "term": "Acionista", "definition": "Proprietário de ações de uma empresa" }
        ]
      }
    ]
  },
  {
    "title": "1.5 A Bolsa no Brasil — B3",
    "slug": "bolsa-no-brasil-b3",
    "steps": [
      {
        "type": "explanation",
        "title": "A nossa casa — B3 🇧🇷",
        "body": "A B3 (Brasil, Bolsa, Balcão) é a única bolsa de valores oficial do Brasil. Fica em São Paulo, na Rua XV de Novembro — mas você opera ela pelo celular de onde estiver. É uma das maiores bolsas do mundo, com mais de 300 empresas listadas e trilhões em negócios por ano. 💰",
        "emoji": "💡"
      },
      {
        "type": "example",
        "title": "O Shopping que se Listou 🤯",
        "body": "Em 2008, a Bovespa (bolsa de ações) se fundiu com a BM&F (bolsa de derivativos). Virou BM&FBovespa. Em 2017, se uniu à Cetip e passou a se chamar B3. O mais incrível? A B3 é uma empresa privada listada na própria bolsa. É como se o shopping vendesse ingresso pra entrar no próprio shopping.",
        "highlight": "Única bolsa oficial do Brasil\nSede em São Paulo — operação 100% digital\nListada na própria bolsa com ticker B3SA3\nSupervisionada pela CVM e pelo Banco Central",
        "emoji": "🎯"
      },
      {
        "type": "activity",
        "question": "Qual fusão deu origem à B3 como conhecemos hoje?",
        "options": [
          "Bradesco + Itaú",
          "CVM + Banco Central",
          "BM&FBovespa + Cetip",
          "Tesouro Nacional + Bovespa"
        ],
        "correct": 2
      },
      {
        "type": "true_false",
        "statement": "A B3 é uma empresa estatal, controlada pelo governo federal brasileiro.",
        "correct": 0,
        "explanation": "Falso! A B3 é uma empresa privada, inclusive listada na própria bolsa com o ticker B3SA3."
      },
      {
        "type": "match_pairs",
        "pairs": [
          { "term": "B3", "definition": "Única bolsa oficial do Brasil" },
          { "term": "Bovespa", "definition": "Antecessora da B3, focada em ações" },
          { "term": "CVM", "definition": "Órgão regulador do mercado de capitais" },
          { "term": "B3SA3", "definition": "Ticker da própria B3 na bolsa" }
        ]
      }
    ]
  },
  {
    "title": "1.6 Bolsas no Mundo (NYSE, NASDAQ...)",
    "slug": "bolsas-no-mundo",
    "steps": [
      {
        "type": "explanation",
        "title": "O mercado não tem fronteira 🌍",
        "body": "A B3 é nossa, mas o mundo tem várias bolsas enormes — e você pode investir nelas também. As duas maiores ficam nos EUA e movimentam mais da metade de todo o dinheiro negociado em bolsas no planeta. Apple, Google, Tesla — tudo lá. 🤯",
        "emoji": "💡"
      },
      {
        "type": "example",
        "title": "Do Mercadão pro Walmart Global 🛒",
        "body": "A B3 é o mercadão do bairro: ótimo, movimentado, cheio de gente. Mas a NYSE é o Walmart global — outro nível de tamanho. Você pode comprar ações de Apple, Amazon e Google pelo Brasil via BDRs. Isso a gente vê mais pra frente 👀",
        "highlight": "🗽 NYSE → maior bolsa do mundo, empresas tradicionais\n💻 NASDAQ → foco em tecnologia (Apple, Google, Meta)\n🇬🇧 London Stock Exchange → principal da Europa\n🇯🇵 Tokyo Stock Exchange → maior da Ásia\n🇧🇷 B3 → nossa representante no ranking global",
        "emoji": "🎯"
      },
      {
        "type": "activity",
        "question": "Qual bolsa americana é mais conhecida por concentrar empresas de tecnologia?",
        "options": ["NYSE", "B3", "NASDAQ", "London Stock Exchange"],
        "correct": 2
      },
      {
        "type": "true_false",
        "statement": "Investidores brasileiros não conseguem ter acesso a ações de empresas estrangeiras listadas em bolsas internacionais.",
        "correct": 0,
        "explanation": "Falso! É possível acessar empresas estrangeiras via BDRs na B3 ou abrindo conta em corretoras internacionais."
      },
      {
        "type": "match_pairs",
        "pairs": [
          { "term": "NYSE", "definition": "Maior bolsa do mundo — empresas tradicionais" },
          { "term": "NASDAQ", "definition": "Bolsa americana focada em tecnologia" },
          { "term": "B3", "definition": "Bolsa oficial do Brasil" },
          { "term": "BDR", "definition": "Forma de investir em empresas estrangeiras pelo Brasil" }
        ]
      }
    ]
  },
  {
    "title": "1.7 Como a Bolsa Funciona no Dia a Dia",
    "slug": "como-a-bolsa-funciona",
    "steps": [
      {
        "type": "explanation",
        "title": "Por baixo dos panos ⚙️",
        "body": "Parece mágica, mas tem uma lógica bem clara. Quando você manda uma ordem de compra, ela vai pra um sistema eletrônico que busca alguém querendo vender pelo mesmo preço. Quando os dois lados batem, a negociação acontece em milissegundos. ⚡",
        "emoji": "💡"
      },
      {
        "type": "example",
        "title": "O Matchmaking do Mercado 🎮",
        "body": "É tipo o sistema de matchmaking de um jogo online. Você entra na fila querendo jogar (comprar), o sistema te conecta com outro jogador (vendedor). Quando encaixa — bam, negócio feito. Você abre o app, digita: comprar 5 ações de PETR4 a R$ 38,00. O sistema encontra quem quer vender por R$ 38,00. Executado. Você virou acionista da Petrobras. Tudo em menos de 1 segundo. 🚀",
        "highlight": "Ordens de compra e venda se encontram eletronicamente\nO preço é definido pela oferta e demanda em tempo real\nA liquidação ocorre em D+2 (dois dias úteis)\nCorretora e B3 garantem que ninguém dá calote",
        "emoji": "🎯"
      },
      {
        "type": "activity",
        "question": "O que define o preço de uma ação no mercado?",
        "options": [
          "O governo estipula um preço justo",
          "A empresa decide o preço diariamente",
          "O Banco Central regula os preços",
          "A oferta e demanda entre compradores e vendedores"
        ],
        "correct": 3
      },
      {
        "type": "true_false",
        "statement": "Quando você compra uma ação, o dinheiro e o ativo mudam de mão instantaneamente no mesmo momento da transação.",
        "correct": 0,
        "explanation": "Falso! A liquidação financeira ocorre em D+2, ou seja, dois dias úteis após a execução da ordem."
      },
      {
        "type": "match_pairs",
        "pairs": [
          { "term": "Ordem de compra", "definition": "Instrução para adquirir um ativo" },
          { "term": "Liquidação", "definition": "Transferência efetiva do dinheiro e do ativo" },
          { "term": "D+2", "definition": "Prazo padrão para liquidação de ações" },
          { "term": "Oferta e demanda", "definition": "Mecanismo que define o preço das ações" }
        ]
      }
    ]
  },
  {
    "title": "1.8 O que é o Pregão?",
    "slug": "o-que-e-o-pregao",
    "steps": [
      {
        "type": "explanation",
        "title": "Abre o jogo 🔔",
        "body": "Pregão é o período oficial do dia em que a bolsa está aberta pra negociações. Antigamente era um salão cheio de operadores gritando ordens uns pros outros. Hoje é tudo eletrônico — mas o nome pegou. 😄 Enquanto o pregão está aberto, os preços oscilam em tempo real. Fechou, congelam até amanhã.",
        "emoji": "💡"
      },
      {
        "type": "example",
        "title": "O Restaurante com Horário Fixo 🍽️",
        "body": "Pregão é como o horário de atendimento de um restaurante. Pode querer comer à meia-noite, mas só funciona no horário comercial. Fora do pregão, sua ordem fica agendada pra próxima abertura. Durante o pregão (10h às 17h), o mercado respira: resultados chegam, notícias surgem, investidores reagem — e os preços sobem e caem em tempo real.",
        "highlight": "Pregão = período oficial de negociações\nPreços oscilam em tempo real durante o pregão\nFora do pregão, as ordens ficam em espera\nLeilão de abertura e fechamento organizam o dia",
        "emoji": "🎯"
      },
      {
        "type": "activity",
        "question": "O que acontece com as ordens enviadas fora do horário do pregão?",
        "options": [
          "São canceladas automaticamente",
          "São executadas a qualquer preço imediatamente",
          "São enviadas para outra bolsa internacional",
          "Ficam agendadas para a próxima abertura do mercado"
        ],
        "correct": 3
      },
      {
        "type": "true_false",
        "statement": "No pregão eletrônico atual, ainda existem operadores humanos gritando ordens no salão da bolsa para executar as negociações.",
        "correct": 0,
        "explanation": "Falso! O pregão hoje é 100% eletrônico. Os operadores físicos no salão fazem parte da história, não da operação atual."
      },
      {
        "type": "match_pairs",
        "pairs": [
          { "term": "Pregão", "definition": "Período oficial de negociações na bolsa" },
          { "term": "Leilão de abertura", "definition": "Mecanismo que inicia o pregão com equilíbrio de ordens" },
          { "term": "Leilão de fechamento", "definition": "Define o preço de fechamento ao final do dia" },
          { "term": "Ordem agendada", "definition": "Compra ou venda enviada fora do horário do pregão" }
        ]
      }
    ]
  },
  {
    "title": "1.9 Horários de Funcionamento",
    "slug": "horarios-de-funcionamento",
    "steps": [
      {
        "type": "explanation",
        "title": "A bolsa tem horário — respeite ⏰",
        "body": "Não é 24/7. Mas tem mais janelas do que parece. A B3 tem fases distintas durante o dia — e conhecer cada uma evita que você mande uma ordem no momento errado e leve um susto no preço. Cada fase tem sua dinâmica. 📊",
        "emoji": "💡"
      },
      {
        "type": "example",
        "title": "O Cardápio do Dia 🍳",
        "body": "É como um restaurante com café, almoço e jantar. Cada serviço tem seu horário e suas regras. Pré-abertura (09h45): ordens entram, sem execução. Pregão regular (10h00–17h00): negociações abertas. Leilão de fechamento (17h00–17h25). After market (17h30–18h00): negociações com restrições.",
        "highlight": "Pré-abertura → 09h45 a 10h00\nPregão regular → 10h00 a 17h00 ✅\nLeilão de fechamento → 17h00 a 17h25\nAfter market → 17h30 a 18h00 (restrições de preço)",
        "emoji": "🎯"
      },
      {
        "type": "activity",
        "question": "Qual é o horário de início do pregão regular da B3?",
        "options": ["09h00", "09h45", "10h30", "10h00"],
        "correct": 3
      },
      {
        "type": "true_false",
        "statement": "O after market da B3 permite negociações com as mesmas regras e variações de preço do pregão regular.",
        "correct": 0,
        "explanation": "Falso! O after market tem restrições de variação de preço, funcionando com regras mais limitadas que o pregão regular."
      },
      {
        "type": "match_pairs",
        "pairs": [
          { "term": "Pré-abertura", "definition": "Fase de entrada de ordens sem execução" },
          { "term": "Pregão regular", "definition": "Janela principal de negociações — 10h às 17h" },
          { "term": "After market", "definition": "Sessão estendida com regras restritas" },
          { "term": "Feriado nacional", "definition": "Causa suspensão total do pregão" }
        ]
      }
    ]
  },
  {
    "title": "1.10 Quiz do Módulo 🎯",
    "slug": "quiz-modulo-1",
    "steps": [
      {
        "type": "activity",
        "question": "Em que ano surgiu a primeira ação da história?",
        "options": ["1792", "1850", "1602", "1920"],
        "correct": 2
      },
      {
        "type": "activity",
        "question": "Qual a principal função da bolsa de valores?",
        "options": [
          "Guardar dinheiro com segurança",
          "Conectar empresas e investidores",
          "Controlar a inflação",
          "Emitir moeda"
        ],
        "correct": 1
      },
      {
        "type": "activity",
        "question": "Quem fiscaliza o mercado de capitais no Brasil?",
        "options": ["Banco Central", "CVM", "B3", "Receita Federal"],
        "correct": 1
      },
      {
        "type": "activity",
        "question": "O que representa possuir uma ação?",
        "options": [
          "Fração de propriedade da empresa",
          "Empréstimo à empresa",
          "Garantia de dividendos",
          "Contrato de serviço"
        ],
        "correct": 0
      },
      {
        "type": "activity",
        "question": "Qual fusão originou a B3?",
        "options": [
          "Bovespa + CVM",
          "BM&FBovespa + Cetip",
          "Bradesco + Bovespa",
          "Cetip + CVM"
        ],
        "correct": 1
      },
      {
        "type": "activity",
        "question": "Qual bolsa americana concentra mais empresas de tecnologia?",
        "options": ["NYSE", "NASDAQ", "B3", "London Stock Exchange"],
        "correct": 1
      },
      {
        "type": "activity",
        "question": "O que define o preço de uma ação?",
        "options": [
          "O governo",
          "A própria empresa",
          "Oferta e demanda",
          "O Banco Central"
        ],
        "correct": 2
      },
      {
        "type": "activity",
        "question": "Quanto tempo leva a liquidação de uma ação após a compra?",
        "options": ["D+1", "D+2", "D+3", "Instantâneo"],
        "correct": 1
      },
      {
        "type": "activity",
        "question": "Qual o horário de início do pregão regular da B3?",
        "options": ["09h00", "09h45", "10h00", "10h30"],
        "correct": 2
      },
      {
        "type": "activity",
        "question": "A B3 é uma empresa:",
        "options": [
          "Estatal federal",
          "Controlada pelo Banco Central",
          "Privada, listada na própria bolsa",
          "Internacional"
        ],
        "correct": 2
      }
    ]
  },
  {
    "title": "1.11 Desafio: Encontre o Ticker de 3 Empresas",
    "slug": "desafio-ticker-empresas",
    "steps": [
      {
        "type": "explanation",
        "title": "Hora de ir pro campo 🕵️",
        "body": "Você aprendeu que toda empresa listada tem um ticker — seu apelido na bolsa. PETR4, VALE3, ABEV3... Agora é hora de caçar esses tickers na vida real. Acesse o site da B3 (b3.com.br), o app da sua corretora ou pesquise no Google: 'ticker + nome da empresa'.",
        "emoji": "🎮"
      },
      {
        "type": "example",
        "title": "O Pulo do Gato dos Tickers 🐱",
        "body": "Os números no final do ticker não são aleatórios. Terminação 3 = ação ordinária (ON) — dá direito a voto na empresa. Terminação 4 = ação preferencial (PN) — prioridade no recebimento de dividendos. Por isso a Petrobras tem PETR3 e PETR4. Dois tipos de ação, mesma empresa!",
        "highlight": "PETR3 / PETR4 → Petrobras\nVALE3 → Vale\nMGLU3 → Magazine Luiza\nITUB4 → Itaú Unibanco\nABEV3 → Ambev\nWEGE3 → WEG\nEMBR3 → Embraer",
        "emoji": "🎯"
      },
      {
        "type": "activity",
        "question": "O que indica a terminação '3' no ticker de uma ação como PETR3?",
        "options": [
          "É a terceira empresa listada na bolsa",
          "Ação preferencial com prioridade em dividendos",
          "Ação ordinária com direito a voto",
          "Código exclusivo de empresas estatais"
        ],
        "correct": 2
      },
      {
        "type": "true_false",
        "statement": "Uma mesma empresa pode ter mais de um ticker na bolsa, representando diferentes tipos de ação.",
        "correct": 1,
        "explanation": "Verdadeiro! A Petrobras possui PETR3 (ação ordinária) e PETR4 (ação preferencial) — dois tipos distintos de participação na mesma empresa."
      },
      {
        "type": "match_pairs",
        "pairs": [
          { "term": "VALE3", "definition": "Ação ordinária da Vale" },
          { "term": "ITUB4", "definition": "Ação preferencial do Itaú Unibanco" },
          { "term": "ABEV3", "definition": "Ação ordinária da Ambev" },
          { "term": "EMBR3", "definition": "Ação ordinária da Embraer" }
        ]
      }
    ]
  }
];
