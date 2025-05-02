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

buscaJogos("30/04/2025", "05/04/2025");
const data = new Date();
console.log(getTimeFormated(data));
