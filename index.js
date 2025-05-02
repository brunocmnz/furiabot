const TelegramBot = require("node-telegram-bot-api");

// Substitua pelo seu token do BotFather
const token = "7944328720:AAFXiiDMtsgcgeAk7SFjV8iGJ3qwq8HBy1Y";

const bot = new TelegramBot(token, { polling: true });

const estadoUsuario = new Map();

function formatarParaDiaMesAno(dataString) {
  const [ano, mes, dia] = dataString.split("-");
  return `${dia}/${mes}/${ano}`;
}

// ===== MENU PRINCIPAL =====
function menuPrincipal(chatId) {
  bot.sendMessage(chatId, "Escolha uma opção:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎉 Modo Torcida", callback_data: "modo_torcida" }],
        [{ text: "📅 Consultar partidas", callback_data: "opcao_b" }],
        [{ text: "🛍 Loja da FURIA", url: "https://www.furia.gg/" }], // botão com link externo
      ],
    },
  });
}

function iniciarModoTorcida(chatId) {
  bot.sendMessage(chatId, "🐆 FURIOSO: Fala ai! Tá preparado pro jogão de hoje? 🔥🐆", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "CLARO! VAMO PRA CIMA!", callback_data: "torcida_preparado" }],
        [{ text: "Tô nervoso...", callback_data: "torcida_nervoso" }]
      ]
    }
  });
}


// ===== SUBMENU DE OPÇÃO B =====
function menuOpcaoB(chatId) {
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
  const textoAjuda = `🤖 <b>Digite /help para ver os comandos do Bot.</b>`;
  bot.sendMessage(chatId, textoAjuda, { parse_mode: "HTML" });
  const chatId = msg.chat.id;
  estadoUsuario.delete(chatId); // reseta qualquer estado anterior
  menuPrincipal(chatId);
});

// ===== CALLBACK DOS BOTÕES =====
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "opcao_a") {
    bot.sendMessage(chatId, "Você escolheu a Opção A!");
  }

  if (data === "opcao_b") {
    menuOpcaoB(chatId);
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
    retornarJogos(dataInicio, dataFim, chatId, "📅 Aqui estão os próximos jogos:");
  }

  if (data === "pesquisar_periodo") {
    bot.sendMessage(chatId, "Digite a data de início no formato 00-00-0000:");
    estadoUsuario.set(chatId, { acao: "aguardando_inicio_periodo" });
  }

  bot.answerCallbackQuery(query.id);
});

// ===== RESPOSTAS DE TEXTO =====
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text;

  if (texto.startsWith("/")) return;

  const estado = estadoUsuario.get(chatId);
  if (!estado) return;

  const dataExtraida = extrairDataPadrao(texto);
  if (!dataExtraida) {
    menuVoltar(
      chatId,
      `❌ Data inválida. Envie no formato válido (Ex: 25/05/2025).`,
      "opcao_b"
    );
    return; // permanece no estado
  }

  if (estado.acao === "aguardando_data") {
    bot.sendMessage(chatId, `✅ Você escolheu a data: ${dataExtraida}`);
    // buscarPorData(dataExtraida);
    estadoUsuario.delete(chatId);
    return;
  }

  if (estado.acao === "aguardando_inicio_periodo") {
    estado.dataInicio = dataExtraida;
    estado.acao = "aguardando_fim_periodo";
    bot.sendMessage(
      chatId,
      `Agora digite a <b>data de fim</b> no formato <code>00-00-0000</code>:`,
      {
        parse_mode: "HTML",
      }
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
      {
        parse_mode: "HTML",
      }
    );
    retornarJogos(dataInicio, dataFim, chatId, `📅 CALENDÁRIO - ${formatarParaDiaMesAno(dataInicio)} A ${formatarParaDiaMesAno(dataFim)}:`);
    estadoUsuario.delete(chatId);
    return;
  }
});

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
        const placarMandante = typeof jogo.placar.mandante === "number" ? jogo.placar.mandante : "";
        const placarVisitante = typeof jogo.placar.visitante === "number" ? jogo.placar.visitante : "";

        const linha = placarMandante !== "" && placarVisitante !== ""
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
      menuOpcaoB(chatId);
    })
    .catch((err) => {
      console.error("Erro ao buscar jogos:", err.message);
      bot.sendMessage(
        chatId,
        "⚠️ Erro ao buscar partidas. Tente novamente mais tarde."
      );
    });
}


function wait(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
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


bot.onText(/\/torcida/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId, "🐆 FURIOSO: Fala ai! Tá preparado pro jogão de hoje? 🔥", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "CLARO! VAMO PRA CIMA!", callback_data: "torcida_preparado" }],
        [{ text: "Tô nervoso...", callback_data: "torcida_nervoso" }]
      ]
    }
  });
});

bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === "modo_torcida") {
    iniciarModoTorcida(chatId);
  }

  if (data === "torcida_preparado") {
    await bot.sendMessage(chatId, "🐆 FURIOSO: É ISSO!!! 🔥 Hoje o adversário vai sentir o rugido! 💪");
    await wait(1500);
    await bot.sendMessage(chatId, "🐆 FURIOSO: Qual seu palpite pro placar?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "2x0 FURIA", callback_data: "placar_2x0" }],
          [{ text: "2x1 sofrido", callback_data: "placar_2x1" }]
        ]
      }
    });
  }

  if (data === "torcida_nervoso") {
    await bot.sendMessage(chatId, "🐆 FURIOSO: Fica não! A FURIA cresce nos momentos difíceis! 💪");
    await wait(1500);
    await bot.sendMessage(chatId, "🐆 FURIOSO: Qual seu palpite pro placar?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "2x0 FURIA", callback_data: "placar_2x0" }],
          [{ text: "2x1 sofrido", callback_data: "placar_2x1" }]
        ]
      }
    });
  }

  if (data === "placar_2x0") {
    await bot.sendMessage(chatId, "🐆 FURIOSO: Isso aí! Confiança é tudo!! 🔥");
  }

  if (data === "placar_2x1") {
    await bot.sendMessage(chatId, "🐆 FURIOSO: Sofrido ou não, o importante é ganhar!!! Vamo pra cimaa!! 💪🐆🏆"); 
  }

  bot.answerCallbackQuery(query.id);
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;

  const textoAjuda = `
🤖 <b>Ajuda do Bot da FURIA</b>

Aqui estão os comandos que você pode usar:

/start — Abre o <b>menu principal</b> com as opções do bot.
/torcida — Inicia o <b>modo torcida</b>, onde você simula uma conversa com outro torcedor da FURIA.
/help — Mostra esta mensagem de ajuda com os comandos disponíveis.

Em breve teremos ainda mais funcionalidades! 🐆🔥
`;

  bot.sendMessage(chatId, textoAjuda, { parse_mode: "HTML" });
});
