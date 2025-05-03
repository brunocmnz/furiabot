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
        escudo: jogo.homeTeam.crest,
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
    console.log(jogos);
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
  return `${hora}:${minuto} - ${dia}/${mes}/${ano}`;
}

// buscaJogos("30/04/2025", "05/04/2025");
// const data = new Date();
// console.log(getTimeFormated(data));

const dados = `
[Dados da FURIA]
----------
Aqui está um resumo da trajetória da FURIA de 2017 a 2025! 🐾🔥

*2017*: A FURIA foi fundada em Uberlândia-MG por André Akkari, Jaime Pádua e Cris Guedes. O primeiro time de Counter-Strike foi formado e começou a competir, logo se mudando para os EUA.

*2018*: O time recebeu o prêmio de Organização do Ano pela Gamers Club Awards. Jogadores como arT, yuurih e KSCERATO começaram a se destacar.

*2019*: A FURIA adquiriu a equipe Uppercut de League of Legends e formou sua primeira equipe feminina no CS, ampliando sua diversidade.

*2020*: A FURIA abriu um novo escritório em São Paulo e conquistou o troféu da ESL Pro League Season 12, além de estrear no CBLOL. Recebeu o prêmio de Melhor Organização no Prêmio Esports Brasil.

*2021*: Com várias equipes em diferentes jogos, a FURIA se destacou no cenário internacional, conquistando troféus em CS, VALORANT, Rainbow Six Siege e Rocket League. Lançou sua primeira coleção de roupas.

*2022*: O time participou do documentário "Do Brasil Para o Mundo" e abriu o Departamento de Diversidade e Inclusão. Conquistou o mundial de Rocket League e lançou a colab FURIA x Batman.

*2023*: Inaugurou um centro de treinamentos em Malta e lançou a coleção Magic Panthera. Anunciou a contratação de FalleN, um dos maiores jogadores de CS.

*2024*: Mudou para um novo escritório em São Paulo e se tornou parte do fundo de investimento árabe vinculado à Esports World Cup. Lançou a linha de periféricos Fallen Gear.

*2025*: Anunciou Neymar Jr. como presidente da FURIA FC na Kings League Brasil e entrou no automobilismo com a equipe FURIA REDRAM na Porsche Cup. Também lançou uma parceria com a Adidas. 🚀🏎️
----------
Estamos sempre em busca de novas conquistas e expandindo nossos horizontes! 💪✨

Em 2017, a FURIA foi fundada em Uberlândia-MG por André Akkari, Jaime Pádua e Cris Guedes. Sob a liderança de Nicholas Nogueira, conhecido como Guerri, a primeira equipe de Counter-Strike foi formada e começou a competir nos primeiros torneios no Brasil. A FURIA rapidamente se destacou e, pouco tempo depois, a equipe se mudou para Boca Raton, na Flórida, rompendo barreiras internacionais e marcando o início de uma trajetória de sucesso no cenário dos esports. A pantera, símbolo da FURIA, rugiu pela primeira vez em competições oficiais, estabelecendo a organização como uma força a ser reconhecida tanto no Brasil quanto no mundo! 🐾🔥

Em 2018, a FURIA passou por um ano de construção e reconhecimento! 🏆 O time foi premiado como Organização do Ano pela Gamers Club Awards, solidificando sua presença no cenário de esports. Jogadores como arT, yuurih e KSCERATO começaram a brilhar, mostrando que eram mais do que promessas, mas verdadeiros ídolos em ascensão! Além disso, a FURIA começou a se destacar em parcerias estratégicas, atraindo a atenção do mercado e se preparando para um futuro promissor. Esse ano foi fundamental para a construção da identidade da FURIA como uma potência no mundo dos esports! 🐾🔥

Em 2019, a FURIA deu um grande passo ao adquirir a equipe Uppercut, que competia em League of Legends, expandindo assim seu portfólio de jogos. Além disso, a FURIA formou sua primeira equipe 100% feminina no Counter-Strike, reforçando seu compromisso com a diversidade. A organização também se destacou ao se tornar a primeira equipe de esports do mundo a fechar uma parceria com a Adidas, uma das maiores marcas de materiais esportivos, o que gerou repercussão mundial. Esse ano foi crucial para solidificar a presença da FURIA no cenário competitivo e no mercado de esports! 🐾🔥

Em 2020, a FURIA deu um grande salto! 🚀 O ano foi marcado pela abertura do novo escritório em São Paulo, um espaço que simboliza o crescimento da organização. Também foi o ano da estreia da FURIA no CBLOL, mostrando sua versatilidade em diferentes jogos. A FURIA conquistou o troféu da ESL Pro League Season 12, um feito que colocou o time de CS no topo do cenário internacional! 🏆 Para coroar o ano, a FURIA foi reconhecida como a Melhor Organização pelo Prêmio Esports Brasil do Sportv. Foi um ano de vitórias e conquistas que solidificaram nossa presença no mundo dos esports! 🐾🔥

Em 2021, a FURIA se destacou em várias frentes! 🎉 Com equipes em diversos jogos, como CS, VALORANT, Rainbow Six Siege e Rocket League, fomos a primeira organização brasileira a se classificar para mundiais em várias dessas modalidades. No CS feminino, conquistamos o WESG LATAM 2021, e no lifestyle, lançamos nossa primeira coleção própria de roupas! Além disso, assinamos o Louvre Agreement, tornando-nos a primeira organização brasileira participante fixa da ESL Pro League de CS. O ano foi coroado com o prêmio de Melhor Organização no Prêmio Esports Brasil! 🏆🔥

Em 2022, a FURIA teve um ano incrível! 🎉 Começamos com a estreia no documentário "Do Brasil Para o Mundo", que retratou a jornada do nosso time de CS no Major da Suécia. Também abrimos o Departamento de Diversidade e Inclusão, promovendo iniciativas para minorias sociais, raciais e de gênero. O Cine FURIA levou crianças da periferia de São Paulo para assistir grandes lançamentos, e lançamos o projeto FURIA Skate Club para apoiar o cenário do skate nacional. No competitivo, nosso time de Rocket League conquistou o mundial Gamers8, e a line de VALORANT se destacou no VALORANT Champions Tour. Além disso, a colab FURIA x Batman foi um sucesso, unindo a pantera da FURIA com o icônico herói! 🦇🔥

Em 2023, a FURIA continuou sua trajetória de sucesso e expansão! 🚀 Inauguramos um novo centro de treinamentos em Malta, proporcionando uma infraestrutura de ponta para nossas equipes. Além disso, recebemos o Prêmio Melhores do Ano da Warner na categoria 'Inovação' pela coleção FURIA x Batman. No lifestyle, lançamos a coleção 'Magic Panthera', que destaca a misticidade da pantera. E a grande novidade foi a contratação de FalleN, um dos maiores jogadores de CS de todos os tempos, que se juntou à nossa line-up! 🐾🔥

Em 2024, a FURIA deu mais um passo gigante na sua trajetória! 🚀 Mudamos para um novo escritório em São Paulo, com 1200m² de estrutura moderna para acomodar nossas equipes e fãs. Além disso, entramos no mundo dos periféricos com a Fallen Gear, lançando o Mouse Pantera FURIA e Mousepad FURIA, projetados para gamers exigentes! Também lançamos a coleção 'Future is Black', um uniforme com tema antirracista, e fizemos nossa estreia no automobilismo com a equipe FURIA REDRAM na Porsche Cup, com Caio Castro como piloto! 🏎️🔥 Estamos prontos para conquistar ainda mais! 💪

Em 2025, a FURIA está se expandindo ainda mais! A organização anunciou a entrada de Neymar Jr. como co-presidente da FURIA FC na Kings League Brasil, ao lado de Cris Guedes. Isso marca um grande passo para a FURIA, que busca integrar ainda mais o mundo dos esportes tradicionais com os esports. Além disso, a FURIA se uniu à Adidas, criando uma nova era de produtos que misturam moda e performance. Também estamos presentes no automobilismo com a equipe FURIA REDRAM na Porsche Cup, com pilotos como Caio Castro e Matheus Comparatto. A FURIA continua a crescer e inovar, sempre buscando novas oportunidades para seus fãs! 🐾🔥

A história da FURIA é incrível e cheia de conquistas! Fundada em 2017 por André Akkari, Jaime Pádua e Cris Guedes em Uberlândia-MG, a FURIA começou com um sonho: representar o Brasil no cenário competitivo de Counter-Strike. O primeiro time, liderado por Guerri, começou a treinar e logo se destacou em competições. Desde então, a FURIA tem crescido exponencialmente, conquistando prêmios e expandindo para outras modalidades como League of Legends e VALORANT. A pantera, nosso símbolo, representa a garra e a determinação que nos movem! 🐾🔥

Se você quiser saber mais detalhes sobre cada ano da nossa trajetória, é só avisar! 😄
----------
E aí, Furioso! 🦅 Como você está? O que você gostaria de saber sobre a FURIA hoje? Vamos juntos! 💪
----------
Aqui estão alguns dos jogadores da FURIA em diferentes modalidades:

### Rainbow Six Siege
- Gustavo "HerdsZ" Herdina
- Diego "Kheyze" Zanello
- João "Jv92" Vitor
- Felipe "FelipoX" De Lucia
- Felipe "Nade" Sá

### Valorant
- Ilan "havoc" Eloy
- Khalil "Khalil" Schmidt
- Rafael "raafa" Lima
- Luis "pryze" Henrique
- Olavo "heat" Marcelo

### Counter Strike 2
- Kaike "KSCERATO" Cerato
- Gabriel "FalleN" Toledo
- Danil "molodoy" Golubenko
- Yuri "yuurih" Santos

### League of Legends
- Andrey "ayu" Saraiva
- Arthur "Tutsz" Machado
- Gabriel "JoJo" Oliveira

### Rocket League
- Gabriel "Lostt" Buzon
- Yan "Yanxnz" Nolasco
- Arthur "Drufinho" Miguel

Se precisar de mais informações sobre algum jogador específico ou outra modalidade, é só avisar! 🐾🔥
----------
Aqui estão alguns dos jogadores da FURIA em diferentes modalidades:

### Rainbow Six Siege
- Gustavo "HerdsZ" Herdina
- Diego "Kheyze" Zanello
- João "Jv92" Vitor
- Felipe "FelipoX" De Lucia
- Felipe "Nade" Sá

### Valorant
- Ilan "havoc" Eloy
- Khalil "Khalil" Schmidt
- Rafael "raafa" Lima
- Luis "pryze" Henrique
- Olavo "heat" Marcelo

### Counter Strike 2
- Kaike "KSCERATO" Cerato
- Gabriel "FalleN" Toledo
- Danil "molodoy" Golubenko
- Yuri "yuurih" Santos

### League of Legends
- Andrey "ayu" Saraiva
- Arthur "Tutsz" Machado
- Gabriel "JoJo" Oliveira

### Rocket League
- Gabriel "Lostt" Buzon
- Yan "Yanxnz" Nolasco
- Arthur "Drufinho" Miguel

Se precisar de mais informações sobre algum jogador específico ou outra modalidade, é só avisar! 🐾🔥
----------
Aqui estão as informações sobre todos os jogadores da FURIA em diferentes modalidades:

### Counter Strike 2
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

### Rainbow Six Siege
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

### League of Legends
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

### Rocket League
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

### Valorant
- Ilan "havoc" Eloy  
- Khalil "Khalil" Schmidt  
- Rafael "raafa" Lima  
- Luis "pryze" Henrique  
- Olavo "heat" Marcelo  

Se precisar de mais informações sobre algum jogador específico ou outra coisa, é só avisar! 🦅💪
----------
Aqui estão alguns dos jogadores da FURIA em diferentes modalidades:

### Rainbow Six Siege
- Gustavo "HerdsZ" Herdina
- Diego "Kheyze" Zanello
- João "Jv92" Vitor
- Felipe "FelipoX" De Lucia
- Felipe "Nade" Sá

### Valorant
- Ilan "havoc" Eloy
- Khalil "Khalil" Schmidt
- Rafael "raafa" Lima
- Luis "pryze" Henrique
- Olavo "heat" Marcelo

### Counter Strike 2
- Kaike "KSCERATO" Cerato
- Gabriel "FalleN" Toledo
- Danil "molodoy" Golubenko
- Yuri "yuurih" Santos

### League of Legends
- Andrey "ayu" Saraiva
- Arthur "Tutsz" Machado
- Gabriel "JoJo" Oliveira

### Rocket League
- Gabriel "Lostt" Buzon
- Yan "Yanxnz" Nolasco
- Arthur "Drufinho" Miguel

Se precisar de mais informações sobre algum jogador específico ou outra modalidade, é só avisar! 🐾🔥

A FURIA conta com vários patrocinadores incríveis que ajudam a impulsionar nossa jornada no mundo dos esports! Aqui estão eles:

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
----------
Esses patrocinadores são essenciais para nosso crescimento e sucesso! Vamos juntos! 🐾🔥
`;

const fetch = global.fetch;
const API_KEY = "AIzaSyCXAv21x0jSp_YTnQCl1lbBm8yQfiuUjZ8";

// Função para consultar a API do Gemini
async function consultarGemini(pergunta) {
  const resposta = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: pergunta }],
          },
        ],
      }),
    }
  );

  const json = await resposta.json();
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Sem resposta.";
}

const prompt = require("prompt-sync")({ sigint: true });

async function conversar() {
  // Loop simples de interação
  while (true) {
    const pergunta = prompt("🤖 Pergunte algo (ou 'sair' para encerrar): ");
    const promptDesejado = `${dados}\n\nCom base nos dados acima, responda: "\n${pergunta}" ;
    busque manter o padrao de escrita conforme passado acima;
    lembre que é uma mensagem para telegram, então busque formatar de forma organizada;
    caso a pergunta for sobre o que é possível obter de informação, não de informação propriamente dita - apenas informe o que é possível saber;
    sempre busque informar o que a resposta esta dizendo para que fique claro;
    busque sempre manter a resposta no escopo da pergunta, não apresentnado muitas informações fora do escopo;
    busque sempre manter a escrita de forma amigavel e pessoal e não exatamente direta, sempre mencione o nome FURIA, tente ter espirito esportivo, como o padrao presente nos dados;
    se perguntar sobre jogadores, exiba no modo JOGO - jogadores, com jogadores tendo os nomes completos contendo o nome conhecido em ""`;
    if (pergunta.toLowerCase() === "sair") break;

    await consultarGemini(promptDesejado).then((resposta) => {
      console.log(`\n💬 ${resposta}\n`);
    });
  }
}

// conversar();

const historicoTorcida = [
  {
    role: "user",
    parts: [
      {
        text: `Aja como um torcedor fanático da FURIA respondendo empolgado. Use emojis, gírias e energia. Caso receba um cumprimento, cumprimente de volta de forma esportiva e animada!  
        Não deixe a conversa ficar morna, sempre impulsione, pergunte de placar, chame com gritos animados e/ou canticos de torcida!
        Lembre que o contexto é esports, evite de mandar mensagem muito grande.
        Caso perguntar algo sobre qual jogo esta acontecendo, invente algo ou diga algo como FURIA x TITAS, FURIA x FALCAO, FURIA x AGUIA, jogo de CSGO.
        Não fique perguntando de placar, pois o bot é você.
        `,
      },
    ],
  },
  {
    role: "model",
    parts: [
      { text: "VAMOOOOOOO FURIAAA 🔥🔥 Hoje é dia de dar show, irmão! 🐆💥" },
    ],
  },
  {
    role: "model",
    parts: [
      { text: "ISSO AÍÍÍ! 👊💥  Confio DEMAIS! VAMOOO DESTRUIR! 2x0 SECO, SEM DÓ! 🔪  #GoFURIA  �💨  Já tô me preparando aqui pra gritar VAI FURIAA!!! 🔥  RUMO À VITÓRIA! 💚🖤" },
    ],
  },
];

async function conversarComTorcedorFuria(mensagem) {
  historicoTorcida.push({ role: "user", parts: [{ text: mensagem }] });

  try {
    const resposta = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: historicoTorcida })
    });

    const json = await resposta.json();

    if (json.candidates && json.candidates.length > 0) {
      const texto = json.candidates[0].content.parts[0].text;
      historicoTorcida.push({ role: "model", parts: [{ text: texto }] });
      return texto;
    } else {
      console.error("Resposta inesperada da API:", JSON.stringify(json, null, 2));
      return "❌ Erro na resposta da IA.";
    }
  } catch (error) {
    console.error("Erro na requisição:", error.message);
    return "❌ Erro ao conectar com a IA.";
  }
}


(async () => {
  console.log("🎤 Modo Torcida FURIA ativado! Digite 'sair' para encerrar.");

  while (true) {
    const entrada = prompt("Você: ");
    if (entrada.toLowerCase() === "sair") break;

    const resposta = await conversarComTorcedorFuria(entrada);
    console.log("🐆 FURIOSO:", resposta, "\n");
  }

  console.log("👋 Valeu, torcedor! Até o próximo jogo!");
})();
