const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'output.csv');
const stream = fs.createWriteStream(filePath);

const TOTAL_LINHAS = 300000;
const BATCH_SIZE = 100;
let linhaAtual = 1;
let ultimaPorcentagem = -1;

// Escreve cabeçalho
stream.write('id,nome,email\n');

function showProgress(atual, total) {
  const porcentagem = Math.floor((atual / total) * 100);
  if (porcentagem !== ultimaPorcentagem) {
    ultimaPorcentagem = porcentagem;
    console.log(`${porcentagem}% de ${TOTAL_LINHAS}`);
  }
}

function escreverLote() {
  let podeEscrever = true;

  while (linhaAtual <= TOTAL_LINHAS && podeEscrever) {
    const fimDoLote = Math.min(linhaAtual + BATCH_SIZE - 1, TOTAL_LINHAS);
    let lote = '';

    for (let i = linhaAtual; i <= fimDoLote; i++) {
      lote += `${i},Usuario${i},usuario${i}@exemplo.com\n`;
    }

    podeEscrever = stream.write(lote);
    linhaAtual = fimDoLote + 1;

    showProgress(linhaAtual - 1, TOTAL_LINHAS);
  }

  if (linhaAtual <= TOTAL_LINHAS) {
    stream.once('drain', escreverLote);
  } else {
    stream.end(() => {
      console.log('Arquivo CSV gerado com sucesso!');
    });
  }
}

escreverLote();
