class Menu {
  constructor(largura, altura) {
    this.largura = largura;
    this.altura = altura;
    this.ativo = true;
    this.estado = 'principal';
    this.botaoIniciar = { x: largura / 2, y: altura / 2 - 50, largura: 200, altura: 50 };
    this.botaoInstrucoes = { x: largura / 2, y: altura / 2 + 50, largura: 200, altura: 50 };
    this.botaoVoltar = { x: largura / 2, y: altura - 100, largura: 150, altura: 40 };
    this.tempoIniciar = 0;
    this.tempoInstrucoes = 0;
    this.tempoVoltar = 0;
    this.selecionado = null;
  }

  atualizar(hands) {
    if (!this.ativo) return;

    for (let hand of hands) {
      const dedo = hand.index_finger_tip;
      const x = this.largura - dedo.x;
      const y = dedo.y;

      if (this.estado === 'principal') {
        if (this.estaSobre(x, y, this.botaoIniciar)) {
          this.tempoIniciar += deltaTime / 1000;
          if (this.tempoIniciar >= 3) {
            this.selecionado = 'iniciar';
            this.ativo = false;
          }
        } else {
          this.tempoIniciar = 0;
        }

        if (this.estaSobre(x, y, this.botaoInstrucoes)) {
          this.tempoInstrucoes += deltaTime / 1000;
          if (this.tempoInstrucoes >= 3) {
            this.estado = 'instrucoes';
            this.tempoInstrucoes = 0;
          }
        } else {
          this.tempoInstrucoes = 0;
        }
      } else if (this.estado === 'instrucoes') {
        if (this.estaSobre(x, y, this.botaoIniciar)) {
          this.tempoIniciar += deltaTime / 1000;
          if (this.tempoIniciar >= 3) {
            this.selecionado = 'iniciar';
            this.ativo = false;
          }
        } else {
          this.tempoIniciar = 0;
        }

        if (this.estaSobre(x, y, this.botaoVoltar)) {
          this.tempoVoltar += deltaTime / 1000;
          if (this.tempoVoltar >= 3) {
            this.estado = 'principal';
            this.tempoVoltar = 0;
          }
        } else {
          this.tempoVoltar = 0;
        }
      }
    }
  }

  estaSobre(x, y, botao) {
    return x > botao.x - botao.largura / 2 && x < botao.x + botao.largura / 2 &&
           y > botao.y - botao.altura / 2 && y < botao.y + botao.altura / 2;
  }

  desenhar() {
    if (!this.ativo) return;

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text('Medicatch', this.largura / 2, this.altura / 4);

    if (this.estado === 'principal') {
      this.desenharBotao(this.botaoIniciar, 'Iniciar', this.tempoIniciar);
      this.desenharBotao(this.botaoInstrucoes, 'Instruções', this.tempoInstrucoes);
    } else if (this.estado === 'instrucoes') {
      textSize(24);
      text('Instruções:', this.largura / 2, this.altura / 2 - 100);
      textSize(18);
      text('Coloque as estrelas na cesta usando a mão.', this.largura / 2, this.altura / 2 - 50);

      this.desenharBotao(this.botaoIniciar, 'Iniciar', this.tempoIniciar);
      this.desenharBotao(this.botaoVoltar, 'Voltar', this.tempoVoltar);
    }

    fill(255);
    textSize(16);
    text('Aponte o dedo indicador para o botão por 3 segundos', this.largura / 2, this.altura - 50);
  }

  desenharBotao(botao, texto, tempo) {
    const progresso = tempo / 3;
    fill(255);
    rectMode(CENTER);
    rect(botao.x, botao.y, botao.largura, botao.altura);
    if (progresso > 0) {
      fill(0, 255, 0);
      rect(botao.x - botao.largura / 2 + (botao.largura * progresso) / 2, botao.y, botao.largura * progresso, botao.altura);
    }
    fill(0);
    textSize(20);
    text(texto, botao.x, botao.y);
  }
}
