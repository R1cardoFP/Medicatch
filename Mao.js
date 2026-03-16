class Mao {
  constructor() {
    // --- tamanho das bolinhas dos pontos da mao
    this.tamanhoPonto = 8;

    // --- lista dos segmentos que vao ser ligados por linhas
    this.segmentos = [
      ['wrist', 'thumb_cmc', 'thumb_mcp', 'thumb_ip', 'thumb_tip'],
      ['wrist', 'index_finger_mcp', 'index_finger_pip', 'index_finger_dip', 'index_finger_tip'],
      ['wrist', 'middle_finger_mcp', 'middle_finger_pip', 'middle_finger_dip', 'middle_finger_tip'],
      ['wrist', 'ring_finger_mcp', 'ring_finger_pip', 'ring_finger_dip', 'ring_finger_tip'],
      ['wrist', 'pinky_finger_mcp', 'pinky_finger_pip', 'pinky_finger_dip', 'pinky_finger_tip'],
      ['index_finger_mcp', 'middle_finger_mcp', 'ring_finger_mcp', 'pinky_finger_mcp']
    ];
  }

  desenhar(hand, larguraCanvas, espelhar = true) {
    // --- se nao houver mao detetada, nao desenha nada
    if (!hand) {
      return;
    }

    // --- estilo das linhas da luva
    stroke(0, 255, 180);
    strokeWeight(3);
    noFill();

    // --- desenha cada segmento da mao ligando os pontos
    for (let i = 0; i < this.segmentos.length; i++) {
      const segmento = this.segmentos[i];
      beginShape(); //--- inicia um novo desenho de forma
      for (let j = 0; j < segmento.length; j++) {
        const nomePonto = segmento[j];
        const ponto = hand[nomePonto];

        if (ponto) {
          // --- espelha no eixo X quando a camara esta em modo espelho
          let x = ponto.x;
          if (espelhar) {
            x = larguraCanvas - ponto.x;
          }

          vertex(x, ponto.y);
        }
      }
      endShape(); //--- finaliza o desenho da forma, conectando os pontos com linhas
    }

    noStroke();
    fill(255);

    // --- desenha uma bolinha em cada ponto valido da mao
    
    for (const nomePonto in hand) {
      const ponto = hand[nomePonto];
        //--- verifica se existe o ponto e se o x e o y sao numeros validos
      if (
        ponto &&
        typeof ponto.x === 'number' &&
        typeof ponto.y === 'number'
      ) {
        let x = ponto.x;
        //--- verifica se esta espelhada
        if (espelhar) {
          x = larguraCanvas - ponto.x;
        }

        circle(x, ponto.y, this.tamanhoPonto);
      }
    }
  }
}
