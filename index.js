const { Console } = require("console");
const TelegramBot = require("node-telegram-bot-api");
const { text } = require("stream/consumers");

// Substitua pelo seu token do BotFather
const token = "7944328720:AAGUDBk6wKpFMNchE2W82ZuBFYiwfVXJLjk";


// const bot = new TelegramBot(token, { polling: true });
const bot = new TelegramBot(token);
bot.setWebHook(`${process.env.URL || 'https://furiabot-w84e.onrender.com'}/bot${token}`);


const estadoUsuario = new Map();

const modoTorcidaAtivo = new Map(); // key: chatId → value: histórico de conversa
const modoInformativoAtivo = new Map(); // key: chatId → value: histórico de conversa
const modoCalendarioAtivo = new Map(); // key: chatId → value: histórico de conversa

function desativarModoTorcida(chatId) {
  modoTorcidaAtivo.delete(chatId);
}

function desativarModoInformativo(chatId) {
  modoInformativoAtivo.delete(chatId);
}

function desativarModoCalendario(chatId) {
  modoCalendarioAtivo.delete(chatId);
}

const fetch = global.fetch;
const API_KEY = "AIzaSyCXAv21x0jSp_YTnQCl1lbBm8yQfiuUjZ8";

// ===== MENU PRINCIPAL =====
function menuPrincipal(chatId) {
  bot.sendMessage(
    chatId,
    `Olá! Tudo bem? 😃 \nSou o FURIOSO, o bot que te aproxima da FURIA!🐆🖤 \nEscolha uma opção: ☑️`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Modo Torcida 🎉", callback_data: "modo_torcida" }],
          [{ text: "Modo Informativo ℹ️ ", callback_data: "modo_informativo" }],
          [{ text: "Modo Calendário 📅", callback_data: "consultar_partidas" }],
          [{ text: "Lista de comandos 📲", callback_data: "ajuda" }],
          [{ text: "Loja da FURIA 🛍", url: "https://www.furia.gg/" }],
        ],
      },
    }
  );
}

function setaModoInfoDesativaOutros(chatId) {
  modoInformativoAtivo.set(chatId, true);
  desativarModoCalendario(chatId);
  desativarModoTorcida(chatId);
}

// ===== CALLBACK DOS BOTÕES =====
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "modo_torcida") {
    reiniciaPlacar();
    iniciarModoTorcida(chatId); // ✅ usa a função unificada
  }

  if (data === "modo_informativo") {
    setaModoInfoDesativaOutros(chatId);
    bot.sendMessage(
      chatId,
      `E aí, Furioso! 🦅 Como você está?\n<b>O que você gostaria de saber sobre a FURIA hoje? \nVamos juntos! </b>💪\nConsigo informar sobre a história da FURIA, nossos patrocinadores, jogadores e suas trajetórias.\n<b>Para voltar ao Menu Principal, digite /voltar.</b>`,
      { parse_mode: "HTML" }
    );
  }

  if (data === "consultar_partidas") {
    menuConsultarPartidas(chatId);
  }

  if (data === "ajuda") {
    bot.sendMessage(chatId, textoAjuda, { parse_mode: "HTML" });
  }

  if (data === "voltar_menu") {
    estadoUsuario.delete(chatId);
    menuPrincipal(chatId);
  }

  if (data === "pesquisar_data") {
    const hoje = new Date();
    const seteDiasDepois = new Date();
    seteDiasDepois.setDate(hoje.getDate() + 7);

    const dataInicio = hoje.toISOString().split("T")[0]; // yyyy-mm-dd
    const dataFim = seteDiasDepois.toISOString().split("T")[0]; // yyyy-mm-dd

    bot.sendMessage(
      chatId,
      `🔍 Buscando partidas de <b>${formatarParaDiaMesAno(
        dataInicio
      )}</b> até <b>${formatarParaDiaMesAno(dataFim)}</b>...`,
      {
        parse_mode: "HTML",
      }
    );
    retornarJogos(
      dataInicio,
      dataFim,
      chatId,
      "📅 Aqui estão os próximos jogos:"
    );
  }

  if (data === "pesquisar_periodo") {
    bot.sendMessage(chatId, "Digite a data de início no formato 00-00-0000:");
    estadoUsuario.set(chatId, { acao: "aguardando_inicio_periodo" });
  }

  bot.answerCallbackQuery(query.id);
});

// ===== SUBMENU DE OPÇÃO B =====
function menuConsultarPartidas(chatId) {
  desativarModoInformativo(chatId);
  desativarModoTorcida(chatId);
  modoCalendarioAtivo.set(chatId, true);
  bot.sendMessage(chatId, "Deseja pesquisar partidas por:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📅 Próximos 7 dias", callback_data: "pesquisar_data" }],
        [{ text: "🗓️ Período de datas", callback_data: "pesquisar_periodo" }],
        [{ text: "⬅️ Voltar ao Menu Principal", callback_data: "voltar_menu" }],
      ],
    },
  });
}

function menuVoltar(chatId, mensagem, data) {
  bot.sendMessage(chatId, mensagem, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "⬅️ Voltar ao menu anterior", callback_data: data }],
      ],
    },
  });
}

// ===== FUNÇÃO INICIAL /START =====
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  menuPrincipal(chatId);
  const textoAjuda = `🤖 <b>Digite /ajuda para ver os comandos do Bot a qualquer momento.</b>`;

  bot.sendMessage(chatId, textoAjuda, { parse_mode: "HTML" });
  estadoUsuario.delete(chatId); // reseta qualquer estado anterior
});

// Texto exibido no /ajuda
const textoAjuda = `
🤖 <b>Ajuda do Bot da FURIA</b>

Aqui estão os comandos que você pode usar:

/start — Abre o <b>menu principal</b> com as opções do bot.
/torcida — Inicia o <b>modo torcida</b>, onde você conversa com o FURIOSO, o bot torcedor da FURIA.
/calendario - Exibe o modo calendário, onde é possível pesquisar as partidas dos próximos 7 dias ou de um  período específico.
/info - Abre modo informativo, sendo possível obter informações sobre a história da FURIA, jogadores, patrocinadores, etc.
/ajuda — Mostra esta mensagem de ajuda com os comandos disponíveis.
/voltar - Exibir o Menu Principal.

Em breve teremos ainda mais funcionalidades! 🐆🔥
`;

bot.onText(/\/voltar/, (msg) => {
  const chatId = msg.chat.id;
  modoTorcidaAtivo.delete(chatId); // desativa o modo torcida com IA
  estadoUsuario.delete(chatId); // limpa qualquer outro estado
  menuPrincipal(chatId);
});

// Variavel que armazena o valor dos pontos (score)
let placar = {
  adversario: 0,
  furia: 0,
};

// Variavel que armazena o placara anterior (score)
let ultimoPlacar = {
  adversario: 0,
  furia: 0,
};

// Array que armazena as possiveis respostas do modo Torcida
const respostasPorPalavra = {
  empate: [
    "🐆 Ficou no empate... Mas a FURIA continua!",
    "🐆 FURIA lutou, mas ficou tudo igual!",
    "🐆 Empatou… mas deu pra ver a raça!",
    "💭 Empatou... Mas valeu o esforço!",
    "📊 Tudo igual no placar final!",
  ],
  derrota: [
    "😢 Não foi dessa vez, FURIA...🐆",
    "💔 A luta foi boa, mas ficou pra eles!🐆",
    "📉 Derrota doída, mas faz parte!🐆",
    "⚠️ Hoje não deu… Mas que continue a FURIA!🐆🔥",
    "🥀 Perdemos, mas com cabeça erguida!🔥",
  ],
  vitoria: [
    "🏆 Isso sim é jogo!",
    "🎉 Bora comemorar!",
    "🙌 Vitória merecida demais!",
    "🐆 Jogaram muito! Mais que merecido!",
    "🚀 Partida insana! Vitória garantida!",
    "😎 É assim que se representa!",
    "🥇 FURIA no topo mais uma vez!",
  ],
  adversarioEmpatou: [
    `😠 ${placar.adversario} a ${placar.furia}? Tá de brincadeira?! REAGE FURIAA!! 💥`,
    "🚫 Não podemos deixar eles ganharem! 😤 VAMOO FURIAA!! 💥",
    "👊 FURIA, mostra quem manda! VAMOO! 💥",
    "🐆 Empataram? Hora de mostrar quem manda!",
    "🎯 Isso aqui é FURIA, não é recreio! VAMO FURIA! 🐆",
    "⚡ ACORDA FURIAA! Ainda dá tempo! 🕒",
    "😤 Eles empataram... NÃO PODEMOS VACILAR! VAMO FURIA!",
    "😠 Que isso, FURIA?! Bora acordar!",
    "😡 Não podemos deixar eles crescerem!",
    "😓 Placar igual? Foco total!",
    "💢 Tá tudo igual... mas não por muito tempo!",
    "💥 Eles vieram buscar? Vamos devolver em dobro!",
    "🧨 Tá pegando fogo! Hora de pontuar de novo!",
  ],
  furiaEmpatou: [
    "🧠 *placar* Placar igual? Foco total!!",
    "😮‍💨 *placar* E vamos! Agora ninguém segura a FURIA!🐆🔥",
    "🐆 EMPATOU! Agora é pegar o embalo e virar!!",
    "🔥 Empatamos! Agora é no ritmo da virada!",
    "😤 Tudo igual! Bora pra cima, FURIA!🔥",
    "👊 *placar* É isso!! Pressão total neles agora!",
    "🚀 Igualamos! A próxima é nossa!",
    "🧨 Empatamos, mas o jogo é nosso! VAMOO!",
  ],
  pontoRumoVirada: [
    "⚡ MAIS UM! RUMO À VIRADA!",
    "🐆 Tamo chegando! Mais um pra cima deles!",
    "🔥 A virada vem! Acredita!",
    "😤 Bora buscar! A diferença tá caindo!",
    "🚀 O gás tá vindo! Vira esse jogo!",
    "🎯 FURIA encostando! Pressiona!",
    "📈 Eles sentiram! Agora é manter o ritmo!",
  ],
  ponto: [
    "🐆 MAIS UM!! VAMO FURIA!",
    "💪 FURIAA! Estamos no controle!",
    "🔥 Oh yeah! FURIA dominando!",
    "📈 Isso! Abrindo vantagem com estilo!",
    "⚡ Vamoo! Seguimos firmes! Não para FURIA!",
    "👊 Boaa! Cada ponto, mais pressão neles!",
  ],
  pontoAdv: [
    "😠 Eles passaram na frente… bora reagir!",
    "⚠️ Estamos atrás! Hora de virar!",
    "😓 Não podemos deixar escapar!",
    "🐆 FURIA, foco total agora!",
    "💢 Eles marcaram... mas a resposta vem!",
    "🧨 Acorda, FURIAA! VAMO!",
    "📉 Caiu um ponto, mas não o jogo! Foco FURIA!",
    "😤 Respira e volta pro jogo cheio de FURIA!",
  ],
};

const reacoes = {
  // Reacoes do torcedor
  animado: [
    "🔥 Essa energia aí sim, torcedor! CONTINUA! A FURIA sente você vibrando!",
    "🐆 Que vibe boa! Assim que a FURIA gosta: torcida ligada no 220!",
    "💥 Essa empolgação aí vale mais que grito de torcida! Vamo com tudo!",
    "🏁 Bora transformar essa animação em vitória! Foco e fé, torcedor!",
    "🚀 Sua animação impulsiona a FURIA rumo ao topo!",
  ],
  desanimado: [
    "🖤 Calma, torcedor. A FURIA sempre levanta mais forte. Isso aqui não acabou!",
    "🙌 Desanimar é normal... mas aqui é FURIA! Levanta a cabeça e bora torcer juntos!",
    "⚔️ Grandes vitórias nascem dos momentos difíceis. Segura firme!",
    "🌪️ Até o vento vira a favor quando a FURIA ruge! Não desiste agora!",
    "🐾 Já viu pantera fugir de desafio? Então bora junto nessa!",
  ],
  nervoso: [
    "😬 Jogo tenso, né? Mas é aqui que a FURIA cresce!",
    "🧠 Calma, respira... a FURIA treina pra esses momentos!",
    "📢 É nervoso aí, é pressão aqui... mas confia no time!",
    "💢 A tensão é o tempero da vitória. A FURIA vai responder!",
    "🔥 Segura no rugido e confia! Cada segundo pode virar tudo!",
  ],
  medo: [
    "😨 Tá com medo? Relaxa, a FURIA já enfrentou monstros maiores!",
    "🛡️ Medo não vence jogo. Confiança sim! E a FURIA tá pronta!",
    "💪 Torcedor, seu apoio é força! Medo nenhum apaga esse rugido!",
    "🌙 Até no escuro a pantera enxerga. A FURIA sabe o caminho!",
    "🎯 Medo existe, mas a FURIA tem mira certeira: é vitória no alvo!",
  ],
};

// Funcao que busca uma resposta no modo Torcida
function buscarResposta(tipo, conjunto, chatId) {
  const aliases = {
    vencemos: "vitoria",
    ganhamos: "vitoria",
    empatamos: "empate",
    empatou: "empate",
    perdemos: "derrota",
  };
  const chave = aliases[tipo] || tipo;
  const respostas = conjunto[chave];

  console.log(respostas);
  if (respostas) {
    let respAleat = respostas[Math.floor(Math.random() * respostas.length)];
    if (respAleat.includes("*placar*")) {
      console.log("A frase contém *placar*");
      const placarStr = `${placar.furia} x ${placar.adversario}`;
      respAleat = respAleat.replace("*placar*", placarStr);
    }
    console.log("RESPOSTAS");
    console.log(respAleat);
    bot.sendMessage(chatId, respAleat);
    return true;
  }
}

// Array que contem informacoes para serem impressas no modo info
const respostasModoInfo = {
  historiaDetalhada: [
    `Aqui está um resumo da trajetória da FURIA de 2017 a 2025! 🐾🔥

<b>2017</b>: A FURIA foi fundada em Uberlândia-MG por André Akkari, Jaime Pádua e Cris Guedes. O primeiro time de Counter-Strike foi formado e começou a competir, logo se mudando para os EUA.

<b>2018</b>: O time recebeu o prêmio de Organização do Ano pela Gamers Club Awards. Jogadores como arT, yuurih e KSCERATO começaram a se destacar.

<b>2019</b>: A FURIA adquiriu a equipe Uppercut de League of Legends e formou sua primeira equipe feminina no CS, ampliando sua diversidade.

<b>2020</b>: A FURIA abriu um novo escritório em São Paulo e conquistou o troféu da ESL Pro League Season 12, além de estrear no CBLOL. Recebeu o prêmio de Melhor Organização no Prêmio Esports Brasil.

<b>2021</b>: Com várias equipes em diferentes jogos, a FURIA se destacou no cenário internacional, conquistando troféus em CS, VALORANT, Rainbow Six Siege e Rocket League. Lançou sua primeira coleção de roupas.

<b>2022</b>: O time participou do documentário <b>Do Brasil Para o Mundo</b> e abriu o Departamento de Diversidade e Inclusão. Conquistou o mundial de Rocket League e lançou a colab FURIA x Batman.

<b>2023</b>: Inaugurou um centro de treinamentos em Malta e lançou a coleção Magic Panthera. Anunciou a contratação de FalleN, um dos maiores jogadores de CS.

<b>2024</b>: Mudou para um novo escritório em São Paulo e se tornou parte do fundo de investimento árabe vinculado à Esports World Cup. Lançou a linha de periféricos Fallen Gear.

<b>2025</b>: Anunciou Neymar Jr. como presidente da FURIA FC na Kings League Brasil e entrou no automobilismo com a equipe FURIA REDRAM na Porsche Cup. Também lançou uma parceria com a Adidas. 🚀🏎️

Estamos sempre em busca de novas conquistas e expandindo nossos horizontes! 💪✨`,
  ],

  trajetoriaPorAno: {
    2017: [
      "Em 2017, a FURIA foi fundada em Uberlândia-MG por André Akkari, Jaime Pádua e Cris Guedes. Sob a liderança de Nicholas Nogueira, conhecido como Guerri, a primeira equipe de Counter-Strike foi formada e começou a competir nos primeiros torneios no Brasil. A FURIA rapidamente se destacou e, pouco tempo depois, a equipe se mudou para Boca Raton, na Flórida, rompendo barreiras internacionais e marcando o início de uma trajetória de sucesso no cenário dos esports. A pantera, símbolo da FURIA, rugiu pela primeira vez em competições oficiais, estabelecendo a organização como uma força a ser reconhecida tanto no Brasil quanto no mundo! 🐾🔥",
    ],
    2018: [
      "Em 2018, a FURIA passou por um ano de construção e reconhecimento! 🏆 O time foi premiado como Organização do Ano pela Gamers Club Awards, solidificando sua presença no cenário de esports. Jogadores como arT, yuurih e KSCERATO começaram a brilhar, mostrando que eram mais do que promessas, mas verdadeiros ídolos em ascensão! Além disso, a FURIA começou a se destacar em parcerias estratégicas, atraindo a atenção do mercado e se preparando para um futuro promissor. Esse ano foi fundamental para a construção da identidade da FURIA como uma potência no mundo dos esports! 🐾🔥",
    ],
    2019: [
      "Em 2019, a FURIA deu um grande passo ao adquirir a equipe Uppercut, que competia em League of Legends, expandindo assim seu portfólio de jogos. Além disso, a FURIA formou sua primeira equipe 100% feminina no Counter-Strike, reforçando seu compromisso com a diversidade. A organização também se destacou ao se tornar a primeira equipe de esports do mundo a fechar uma parceria com a Adidas, uma das maiores marcas de materiais esportivos, o que gerou repercussão mundial. Esse ano foi crucial para solidificar a presença da FURIA no cenário competitivo e no mercado de esports! 🐾🔥",
    ],
    2020: [
      "Em 2020, a FURIA deu um grande salto! 🚀 O ano foi marcado pela abertura do novo escritório em São Paulo, um espaço que simboliza o crescimento da organização. Também foi o ano da estreia da FURIA no CBLOL, mostrando sua versatilidade em diferentes jogos. A FURIA conquistou o troféu da ESL Pro League Season 12, um feito que colocou o time de CS no topo do cenário internacional! 🏆 Para coroar o ano, a FURIA foi reconhecida como a Melhor Organização pelo Prêmio Esports Brasil do Sportv. Foi um ano de vitórias e conquistas que solidificaram nossa presença no mundo dos esports! 🐾🔥",
    ],
    2021: [
      "Em 2021, a FURIA se destacou em várias frentes! 🎉 Com equipes em diversos jogos, como CS, VALORANT, Rainbow Six Siege e Rocket League, fomos a primeira organização brasileira a se classificar para mundiais em várias dessas modalidades. No CS feminino, conquistamos o WESG LATAM 2021, e no lifestyle, lançamos nossa primeira coleção própria de roupas! Além disso, assinamos o Louvre Agreement, tornando-nos a primeira organização brasileira participante fixa da ESL Pro League de CS. O ano foi coroado com o prêmio de Melhor Organização no Prêmio Esports Brasil! 🏆🔥",
    ],
    2022: [
      'Em 2022, a FURIA teve um ano incrível! 🎉 Começamos com a estreia no documentário "Do Brasil Para o Mundo", que retratou a jornada do nosso time de CS no Major da Suécia. Também abrimos o Departamento de Diversidade e Inclusão, promovendo iniciativas para minorias sociais, raciais e de gênero. O Cine FURIA levou crianças da periferia de São Paulo para assistir grandes lançamentos, e lançamos o projeto FURIA Skate Club para apoiar o cenário do skate nacional. No competitivo, nosso time de Rocket League conquistou o mundial Gamers8, e a line de VALORANT se destacou no VALORANT Champions Tour. Além disso, a colab FURIA x Batman foi um sucesso, unindo a pantera da FURIA com o icônico herói! 🦇🔥',
    ],
    2023: [
      "Em 2023, a FURIA continuou sua trajetória de sucesso e expansão! 🚀 Inauguramos um novo centro de treinamentos em Malta, proporcionando uma infraestrutura de ponta para nossas equipes. Além disso, recebemos o Prêmio Melhores do Ano da Warner na categoria 'Inovação' pela coleção FURIA x Batman. No lifestyle, lançamos a coleção 'Magic Panthera', que destaca a misticidade da pantera. E a grande novidade foi a contratação de FalleN, um dos maiores jogadores de CS de todos os tempos, que se juntou à nossa line-up! 🐾🔥",
    ],
    2024: [
      "Em 2024, a FURIA deu mais um passo gigante na sua trajetória! 🚀 Mudamos para um novo escritório em São Paulo, com 1200m² de estrutura moderna para acomodar nossas equipes e fãs. Além disso, entramos no mundo dos periféricos com a Fallen Gear, lançando o Mouse Pantera FURIA e Mousepad FURIA, projetados para gamers exigentes! Também lançamos a coleção 'Future is Black', um uniforme com tema antirracista, e fizemos nossa estreia no automobilismo com a equipe FURIA REDRAM na Porsche Cup, com Caio Castro como piloto! 🏎️🔥 Estamos prontos para conquistar ainda mais! 💪",
    ],
    2025: [
      "Em 2025, a FURIA está se expandindo ainda mais! A organização anunciou a entrada de Neymar Jr. como co-presidente da FURIA FC na Kings League Brasil, ao lado de Cris Guedes. Isso marca um grande passo para a FURIA, que busca integrar ainda mais o mundo dos esportes tradicionais com os esports. Além disso, a FURIA se uniu à Adidas, criando uma nova era de produtos que misturam moda e performance. Também estamos presentes no automobilismo com a equipe FURIA REDRAM na Porsche Cup, com pilotos como Caio Castro e Matheus Comparatto. A FURIA continua a crescer e inovar, sempre buscando novas oportunidades para seus fãs! 🐾🔥",
    ],
  },

  historia: [
    `A história da FURIA é incrível e cheia de conquistas! Fundada em 2017 por André Akkari, Jaime Pádua e Cris Guedes em Uberlândia-MG... Se você quiser saber mais detalhes sobre cada ano da nossa trajetória, é só avisar! 😄`,
  ],

  jogadoresResumido: [
    `Aqui estão alguns dos jogadores da FURIA em diferentes modalidades:

<b>Rainbow Six Siege</b>
- Gustavo "HerdsZ" Herdina
- Diego "Kheyze" Zanello
- João "Jv92" Vitor
- Felipe "FelipoX" De Lucia
- Felipe "Nade" Sá

<b>Valorant</b>
- Ilan "havoc" Eloy
- Khalil "Khalil" Schmidt
- Rafael "raafa" Lima
- Luis "pryze" Henrique
- Olavo "heat" Marcelo

<b>Counter Strike 2</b>
- Kaike "KSCERATO" Cerato
- Gabriel "FalleN" Toledo
- Danil "molodoy" Golubenko
- Yuri "yuurih" Santos

<b>League of Legends</b>
- Andrey "ayu" Saraiva
- Arthur "Tutsz" Machado
- Gabriel "JoJo" Oliveira

<b>Rocket League</b>
- Gabriel "Lostt" Buzon
- Yan "Yanxnz" Nolasco
- Arthur "Drufinho" Miguel

Se precisar de mais informações sobre algum jogador específico ou outra modalidade, é só avisar! 🐾🔥`,
  ],

  jogadoresDetalhado: [
    `Aqui estão as informações sobre todos os jogadores da FURIA em diferentes modalidades:

<b>Counter Strike 2</b>
- Kaike "KSCERATO" Cerato  
  Nascimento: 12 de setembro de 1999  
  Começou a jogar profissionalmente: 2015  
  Entrou na FURIA: 2018

- Gabriel "FalleN" Toledo  
  Nascimento: 30 de maio de 1991  
  Começou a jogar profissionalmente: 2003  
  Entrou na FURIA: 2023

- Danil "molodoy" Golubenko  
  Nascimento: 10 de Janeiro de 2005  
  Começou a jogar profissionalmente: 2024  
  Entrou na FURIA: 2025

- Yuri "yuurih" Santos  
  Nascimento: 22 de dezembro de 1999  
  Começou a jogar profissionalmente: 2016  
  Entrou na FURIA: 2017

- Sidnei "sidde" Macedo  
  Nascimento: 6 de fevereiro de 1997  
  Começou a jogar profissionalmente: 2019  
  Entrou na FURIA: 2024

<b>Rainbow Six Siege</b>
- Gustavo "HerdsZ" Herdina  
  Nascimento: 24 de Agosto de 2000  
  Começou a jogar profissionalmente: 2019  
  Entrou na FURIA: 2024

- Diego "Kheyze" Zanello  
  Nascimento: 7 de Maio de 2002  
  Começou a jogar profissionalmente: 2020  
  Entrou na FURIA: 2024

- João "Jv92" Vitor  
  Nascimento: 31 de Dezembro de 2002  
  Começou a jogar profissionalmente: 2021  
  Entrou na FURIA: 2024

- Felipe "FelipoX" De Lucia  
  Nascimento: 12 de Novembro de 2001  
  Começou a jogar profissionalmente: 2018  
  Entrou na FURIA: 2024

- Felipe "Nade" Sá  
  Nascimento: 24 de Abril de 2003  
  Começou a jogar profissionalmente: 2022  
  Entrou na FURIA: 2024

<b>League of Legends</b>
- Andrey "ayu" Saraiva  
  Nascimento: 06 de outubro de 2005  
  Começou a jogar profissionalmente: 2022  
  Entrou na FURIA: 2023

- Arthur "Tutsz" Machado  
  Nascimento: 16 de Dezembro de 2002  
  Começou a jogar profissionalmente: 2020  
  Entrou na FURIA: 2023

- Gabriel "JoJo" Oliveira  
  Nascimento: 11 de Novembro de 1998  
  Começou a jogar profissionalmente: 2018  
  Entrou na FURIA: 2024

<b>Rocket League</b>
- Gabriel "Lostt" Buzon  
  Nascimento: 29 de Março de 2005  
  Começou a jogar profissionalmente: 2020  
  Entrou na FURIA: 2023

- Yan "Yanxnz" Nolasco  
  Nascimento: 10 de Agosto de 2004  
  Começou a jogar profissionalmente: 2020  
  Entrou na FURIA: 2021

- Arthur "Drufinho" Miguel  
  Nascimento: 28 de Junho de 2005  
  Começou a jogar profissionalmente: 2019  
  Entrou na FURIA: 2023

<b>Valorant</b>
- Ilan "havoc" Eloy  
- Khalil "Khalil" Schmidt  
- Rafael "raafa" Lima  
- Luis "pryze" Henrique  
- Olavo "heat" Marcelo

Se precisar de mais informações é só avisar! 🦅💪`,
  ],

  patrocinadores: [
    `A FURIA conta com vários patrocinadores incríveis que ajudam a impulsionar nossa jornada no mundo dos esports! Aqui estão eles:

1. Red Bull - A famosa bebida energética que está conosco desde 2020, trazendo energia e inspiração para nossos jogadores! 🥤
   - https://www.redbull.com/br-pt/energydrink/empresa-red-bull

2. Lenovo Legion - Nossa parceira desde 2023, oferecendo laptops de alto desempenho para os gamers! 💻
   - https://www.lenovo.com/br/pt/legion/

3. PokerStars - A maior plataforma de poker online do mundo, parceira da FURIA desde 2020! 🃏
   - https://www.pokerstars.com/pt-BR/poker/download/

4. Hellmann's - A maionese Nº1 do Brasil, que se juntou a nós em 2024 para criar conteúdos e experiências incríveis! 🍔
   - https://www.hellmanns.com.br/home.html

5. Cruzeiro do Sul Virtual - Uma das principais marcas de educação a distância do Brasil, parceira desde 2023! 🎓
   - https://www.cruzeirodosulvirtual.com.br

6. Adidas - A gigante do esporte que se uniu à FURIA em 2025, trazendo estilo e inovação! 👟
   - https://www.adidas.com.br/

Esses patrocinadores são essenciais para nosso crescimento e sucesso! Vamos juntos! 🐾🔥`,
  ],
};

// Funcao para enviar um texto sem \n inserindo as quebras com \n para ficar certo no telegram
function enviarTextoQuebrandoLinha(texto, chatId) {
  if (Array.isArray(texto)) {
    texto = texto[0]; // pega o primeiro item se for array
  }
  try {
    let imprimir = "";
    let linhas = texto.split("\n"); // aqui sim funciona corretamente
    for (let i = 0; i < linhas.length; i++) {
      imprimir += linhas[i] + "\n";
    }
    bot.sendMessage(chatId, imprimir, { parse_mode: "HTML" });
    return;
  } catch (erro) {}
  bot.sendMessage(chatId, texto, {
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

//Funcao que diz se o valor eh um ano
function stringEhUmAno(valor) {
  return /^\d{4}$/.test(valor);
}

const comparacoes = {
  historia: ["história", "trajetória"],
  detalhado: ["detalhado", "detalhes"],
  patrocinadores: ["patrocinadores"],
  jogadores: ["jogadores", "competidores", "equipe", "time", "competição"],
  quando: ["quando"],
  entrou: ["entrou"],
};

// ===== RESPOSTAS DE TEXTO =====
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text.toLowerCase();
  const palavrasUsuario = texto.split(/[\s\-]+/);

  // Se nenhuma palavra-chave foi encontrada
  // bot.sendMessage(chatId, "Não entendi muito bem... pode repetir?");

  // Ignora comandos que começam com /
  if (texto.startsWith("/")) return;

  // ============================
  // 1. Modo Info ativo
  if (modoInformativoAtivo.has(chatId)) {
    const historico = modoInformativoAtivo.get(chatId);
    if (historico) {
      console.log("MODO INFO ATIVO");
      // const resposta = await consultarGemini(texto);
      // bot.sendMessage(chatId, `ℹ️ ${resposta}`, { parse_mode: "HTML" });
      let doBreak = false;
      /**
       * historia
       * detalhado
       * trajetoria
       * jogadores
       * patrocinadores
       * ANO a ANO ou ANO - ANO
       * ANO
       */
      let imprimir = {
        historia: false,
        patrocinadores: false,
        jogadores: false,
        ano1: "",
        ano2: "",
        detalhado: false,
        quando: false,
        entrou: false,
      };

      for (const palavraAt of palavrasUsuario) {
        if (stringEhUmAno(palavraAt)) {
          if (imprimir.ano1 === "") {
            imprimir.ano1 = palavraAt;
          } else {
            imprimir.ano2 = palavraAt;
          }
        } else {
          for (const [categoria, termos] of Object.entries(comparacoes)) {
            for (const termo of termos) {
              if (calcularSimilaridade(palavraAt, termo) > 0.8) {
                imprimir[categoria] = true;
              }
            }
          }
        }
      }

      // Foi informado um ano
      if (imprimir.ano1 !== "") {
        // Foi informado dois anos (um periodo pra pesquisar)
        if (imprimir.ano2 !== "") {
          // Converte os anos para números
          let anoInicial = parseInt(imprimir.ano1);
          let anoFinal = parseInt(imprimir.ano2);

          // Garante que anoInicial sempre seja o menor
          if (anoInicial > anoFinal) {
            [anoInicial, anoFinal] = [anoFinal, anoInicial];
          }

          let resposta = "";
          for (let ano = anoInicial; ano <= anoFinal; ano++) {
            const textosAno = respostasModoInfo.trajetoriaPorAno[ano];
            if (textosAno && textosAno.length > 0) {
              resposta += textosAno[0] + "\n\n";
            }
          }

          if (resposta !== "") {
            const msgIni = `<b>Vou te informar sobre a história da FURIA no perido:\n ${anoInicial} - ${anoFinal} 🐆🔥</b>\n\n`;
            enviarTextoQuebrandoLinha(msgIni + resposta.trim(), chatId);
          } else {
            bot.sendMessage(
              chatId,
              "Não encontrei informações sobre esse período."
            );
          }
          return;
        } else {
          // Apenas um ano foi citado
          const textoAno = respostasModoInfo.trajetoriaPorAno[imprimir.ano1];
          if (textoAno && textoAno.length > 0) {
            enviarTextoQuebrandoLinha(textoAno[0], chatId);
          } else {
            bot.sendMessage(
              chatId,
              `Não encontrei informações sobre esse ano. 🧐\nSó consigo responder no intervalo 2017 - ${new Date().getFullYear()}.📆\nJá que estamos em <b>${new Date().getFullYear()} e a FURIA surgiu em 2017.🔥🐆</b>`,
              { parse_mode: "HTML" }
            );
          }
        }
      }

      if (imprimir.historia) {
        if (imprimir.detalhado) {
          enviarTextoQuebrandoLinha(
            respostasModoInfo.historiaDetalhada,
            chatId
          );
        } else {
          enviarTextoQuebrandoLinha(respostasModoInfo.historia, chatId);
        }
      }

      if (imprimir.patrocinadores) {
        enviarTextoQuebrandoLinha(respostasModoInfo.patrocinadores, chatId);
      }

      if (imprimir.jogadores) {
        if (imprimir.detalhado) {
          enviarTextoQuebrandoLinha(
            respostasModoInfo.jogadoresDetalhado,
            chatId
          );
        } else {
          enviarTextoQuebrandoLinha(
            respostasModoInfo.jogadoresResumido,
            chatId
          );
        }
      } else if (imprimir.quando && imprimir.entrou) {
        enviarTextoQuebrandoLinha(respostasModoInfo.jogadoresDetalhado, chatId);
      }

      // bot.sendMessage(chatId, resposta, { parse_mode: "Markdown" });
    }
    return;
  }

  // ============================
  // 1. Modo torcida ativo
  if (modoTorcidaAtivo.has(chatId)) {
    let imprimir = {
      animado: false,
      desanimado: false,
      nervoso: false,
      medo: false,
    };

    for (const palavraAt of palavrasUsuario) {
      for (const [categoria, termos] of Object.entries(reacoes)) {
        if (categoria === palavraAt) {
          imprimir[categoria] = true;
        }
      }
    }

    if (imprimir.animado) {
      buscarResposta("animado", reacoes, chatId);
    }
    
    if (imprimir.desanimado) {
      buscarResposta("desanimado", reacoes, chatId);
    }
    
    if (imprimir.nervoso) {
      buscarResposta("nervoso", reacoes, chatId);
    }
    
    if (imprimir.medo) {
      buscarResposta("medo", reacoes, chatId);
    }

    let doBreak = false;
    for (const palavraUsuario of palavrasUsuario) {
      doBreak = buscarResposta(palavraUsuario, chatId);
      if (doBreak) {
        break;
      }
    }

    const placarIn = extrairPlacar(texto);
    console.log("TEXTO: ", texto);
    /*  empate      derrota      vitoria
        adversarioEmpatou     furiaEmpatou
        pontoRumoVirada     ponto
        pontoAdv  */
    const hist = modoTorcidaAtivo.get(chatId);
    if (hist && placarIn) {
      console.log("MODO TORCIDA ATIVO");
      ultimoPlacar = placarIn;
      console.log(placarIn);
      console.log(placar);
      let tipo = null;
      let respostas = null;
      if (placarIn.placar1 > placar.furia) {
        //furia marcou
        if (placarIn.placar1 > placarIn.placar2) {
          //ponto
          tipo = "ponto";
          console.log("PONTO");
        } else if (placarIn.placar1 == placarIn.placar2) {
          //furiaEmpatou
          tipo = "furiaEmpatou";
          // respostas = getFuriaEmpatouFrases(placar);
        } else {
          tipo = "pontoRumoVirada";
        }
      } else if (placarIn.placar2 > placar.adversario) {
        //adversario marcou
        if (placarIn.placar1 == placarIn.placar2) {
          //furiaEmpatou
          tipo = "adversarioEmpatou";
        } else {
          tipo = "pontoAdv";
        }
      }
      if (
        placar.furia == placarIn.placar1 &&
        placar.adversario == placarIn.placar2
      ) {
        const emj = placar.furia > placar.adversario ? "😎" : "👀";
        console.log("EMOJI: ", emj);
        bot.sendMessage(chatId, `Sim, tô sabendo! ${emj}`);
        // return;
      } else if (
        placar.furia > placarIn.placar1 ||
        placar.adversario > placarIn.placar2
      ) {
        bot.sendMessage(
          chatId,
          `🤔 Esse placar está incoerente! Antes estava ${placar.furia} x ${placar.adversario}\nSe estiver falando de um novo jogo, clique em /torcida.`
        );
        tipo = null;
        // return;
      }
      if (tipo != null) {
        placar.furia = placarIn.placar1;
        placar.adversario = placarIn.placar2;
        buscarResposta(tipo, chatId);
        console.log(tipo);
        return;
      }
    }
  }

  // ============================
  // 2. Lógica para datas
  const estado = estadoUsuario.get(chatId);
  if (!estado) return;

  const dataExtraida = extrairDataPadrao(texto);
  if (!dataExtraida) {
    menuVoltar(
      chatId,
      `❌ Data inválida. Envie no formato válido (Ex: 25/05/2025).`,
      "consultar_partidas"
    );
    return;
  }

  if (estado.acao === "aguardando_data") {
    bot.sendMessage(chatId, `✅ Você escolheu a data: ${dataExtraida}`);
    estadoUsuario.delete(chatId);
    return;
  }

  if (estado.acao === "aguardando_inicio_periodo") {
    estado.dataInicio = dataExtraida;
    estado.acao = "aguardando_fim_periodo";
    bot.sendMessage(
      chatId,
      `Agora digite a <b>data de fim</b> no formato <code>00-00-0000</code>:`,
      { parse_mode: "HTML" }
    );
    return;
  }

  if (estado.acao === "aguardando_fim_periodo") {
    const dataInicio = estado.dataInicio;
    const dataFim = dataExtraida;
    bot.sendMessage(
      chatId,
      `🔍 Buscando resultados de <b>${formatarParaDiaMesAno(
        dataInicio
      )}</b> até <b>${formatarParaDiaMesAno(dataFim)}</b>...`,
      { parse_mode: "HTML" }
    );
    retornarJogos(
      dataInicio,
      dataFim,
      chatId,
      `📅 CALENDÁRIO - ${formatarParaDiaMesAno(
        dataInicio
      )} A ${formatarParaDiaMesAno(dataFim)}:`
    );
    estadoUsuario.delete(chatId);
    return;
  }
});

bot.onText(/\/ajuda/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, textoAjuda, { parse_mode: "HTML" });
});

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  setaModoInfoDesativaOutros(chatId);

  bot.sendMessage(
    chatId,
    `
    E aí, Furioso! 🦅 Como você está?
    <b>O que você gostaria de saber sobre a FURIA hoje?
    Vamos juntos! </b>💪
    Consigo informar sobre a história da FURIA, nossos patrocinadores, jogadores e suas trajetórias.
    <b>Para voltar ao Menu Principal, digite /voltar.</b>`,
    { parse_mode: "HTML" }
  );
});

bot.onText(/\/torcida/, (msg) => {
  reiniciaPlacar();
  const chatId = msg.chat.id;
  iniciarModoTorcida(chatId); // ✅ usa a mesma função
});

bot.onText(/\/calendario/, (msg) => {
  const chatId = msg.chat.id;
  menuConsultarPartidas(chatId);
});

// ==== FUNCOES PRATICAS SEM SER DO TELEGRAM =======
// =================================================
// =================================================
// =================================================
// =================================================
// =================================================
function reiniciaPlacar() {
  placar.furia = 0;
  placar.adversario = 0;
}

function extrairPlacar(texto) {
  const regex = /(\d+)\s*[ xXaA-]\s*(\d+)/;
  const match = texto.match(regex);
  if (match) {
    const placar1 = parseInt(match[1]);
    const placar2 = parseInt(match[2]);
    if (placar1 > placar2) return { placar1, placar2 };
    else return { placar2, placar1 };
  }
  return null;
}

function calcularSimilaridade(a, b) {
  const distancia = levenshtein(a, b);
  const tamanhoMaior = Math.max(a.length, b.length);
  const similaridade = 1 - distancia / tamanhoMaior;
  return similaridade;
}

function levenshtein(a, b) {
  const matriz = [];

  for (let i = 0; i <= b.length; i++) {
    matriz[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matriz[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matriz[i][j] = matriz[i - 1][j - 1];
      } else {
        matriz[i][j] = Math.min(
          matriz[i - 1][j - 1] + 1, // substituição
          matriz[i][j - 1] + 1, // inserção
          matriz[i - 1][j] + 1 // deleção
        );
      }
    }
  }

  return matriz[b.length][a.length];
}

function extrairDataPadrao(texto) {
  // Regex para encontrar qualquer formato de data
  const regex = /\b(\d{2}[\/-]\d{2}[\/-]\d{4}|\d{4}[\/-]\d{2}[\/-]\d{2})\b/;

  // Encontra a primeira ocorrência
  const match = texto.match(regex);

  if (!match) return null;

  const dataEncontrada = match[0];

  // Se a data começa com o ano (formato já quase certo)
  if (/^\d{4}/.test(dataEncontrada)) {
    return dataEncontrada.replace(/\//g, "-"); // só troca / por -
  }

  // Se começa com dia (formato brasileiro)
  const [dia, mes, ano] = dataEncontrada.split(/[-\/]/);
  return `${ano}-${mes}-${dia}`;
}

function retornarJogos(dataInicio, dataFim, chatId, mensagem) {
  buscaJogos(dataInicio, dataFim)
    .then((jogos) => {
      if (!jogos || jogos.length === 0) {
        bot.sendMessage(chatId, "❌ Nenhuma partida encontrada nesse período.");
        return;
      }

      const jogosPorDia = {};

      // Agrupa por data (dd/mm/aaaa)
      jogos.forEach((jogo) => {
        const [dia, mes, ano] = jogo.data.split(" ")[0].split("/");
        const dataFormatada = `${dia}/${mes}/${ano}`;
        const hora = jogo.data.split(" ")[2] || jogo.data.split(" ")[1]; // pega a parte da hora
        const mandante = jogo.mandante.sigla;
        const visitante = jogo.visitante.sigla;
        const status = jogo.status;
        const placarMandante =
          typeof jogo.placar.mandante === "number" ? jogo.placar.mandante : "";
        const placarVisitante =
          typeof jogo.placar.visitante === "number"
            ? jogo.placar.visitante
            : "";

        const linha =
          placarMandante !== "" && placarVisitante !== ""
            ? `- ${hora}  ${mandante} ${placarMandante} x ${placarVisitante} ${visitante} - ${status}`
            : `- ${hora}  ${mandante} x ${visitante} - ${status}`;

        if (!jogosPorDia[dataFormatada]) {
          jogosPorDia[dataFormatada] = [];
        }

        jogosPorDia[dataFormatada].push(linha);
      });

      // Monta a mensagem
      //let mensagem = "📅 <b>Aqui estão os próximos jogos:</b>\n\n";
      mensagem += "\n\n";
      for (const data in jogosPorDia) {
        mensagem += `<b>${data}</b>\n`;
        mensagem += jogosPorDia[data].join("\n");
        mensagem += "\n\n";
      }

      bot.sendMessage(chatId, mensagem.trim(), { parse_mode: "HTML" });
    })
    .then(() => {
      menuConsultarPartidas(chatId);
    })
    .catch((err) => {
      console.error("Erro ao buscar jogos:", err.message);
      bot.sendMessage(
        chatId,
        "⚠️ Erro ao buscar partidas. Tente novamente mais tarde."
      );
    });
}

async function buscaJogos(dataInicio, dataFim) {
  if (dataInicio > dataFim) {
    aux = dataInicio;
    dataInicio = dataFim;
    dataFim = aux;
  }
  const dateTo = extrairDataPadrao(dataFim);
  const dateFrom = extrairDataPadrao(dataInicio);
  const url = `https://api.football-data.org/v4/competitions/BSA/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;

  const options = {
    method: "GET",
    headers: {
      "X-Auth-Token": "05e97a655f924aec8d3726f1bbb96d34",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.message}`);
    }
    const result = await response.json(); // usa .json() em vez de .text()
    const jogosGrupo = result.matches;
    const jogos = jogosGrupo.map((jogo) => ({
      data: getTimeFormated(jogo.utcDate),
      mandante: {
        id: jogo.homeTeam.id,
        nome: jogo.homeTeam.shortName,
        sigla: jogo.homeTeam.tla,
      },
      visitante: {
        id: jogo.awayTeam.id,
        nome: jogo.awayTeam.shortName,
        sigla: jogo.awayTeam.tla,
        escudo: jogo.awayTeam.crest,
      },
      status: jogo.status,
      placar: {
        mandante: jogo.score.fullTime.home,
        visitante: jogo.score.fullTime.away,
      },
    }));
    return jogos;
  } catch (error) {
    console.error("Erro na requisição:", error.message);
  }
}

function getTimeFormated(dataIn) {
  // Corrigindo fuso horário manualmente (UTC-3)
  const data = new Date(dataIn);
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano} - ${hora}:${minuto}`;
}

function formatarParaDiaMesAno(dataString) {
  const [ano, mes, dia] = dataString.split("-");
  return `${dia}/${mes}/${ano}`;
}

function iniciarModoTorcida(chatId) {
  desativarModoCalendario(chatId);
  desativarModoInformativo(chatId);
  // Faz uma cópia do array de definição
  modoTorcidaAtivo.set(chatId, true);
  bot.sendMessage(
    chatId,
    "Fala comigo FURIOSO! 🐆\nAnimado para o jogo de hoje? 🔥 \nPara voltar ao Menu Principal, digite /voltar."
  );
}




//bot
const express = require("express");
const app = express();
app.use(express.json());

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot está rodando via webhook na porta ${PORT}`);
});
