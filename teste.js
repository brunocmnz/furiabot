function deveInverterPlacar(palavras) {
  const termosInversao = [
    "para eles",
    "pra eles",
    "contra nós",
    "placar adversário",
    "placar deles",
  ];

  // Sliding window de até 4 palavras
  for (let i = 0; i < palavras.length - 1; i++) {
    for(const termo of termosInversao){
        const palavra1 = palavras[i];
        const palavra2 = palavras[i + 1];

        const termos = termo.split(/\s+/);

        const simi1 = calcularSimilaridade(palavra1, termos[0]);
        const simi2 = calcularSimilaridade(palavra2, termos[1]);
        if(simi1 > 0.8 && simi2 > 0.8){
            console.log("INVERTE")
        }
    }
  }
  return false;
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

const texto = "pra eles";
const palavras = texto.split(/\s+/);
deveInverterPlacar(palavras);
