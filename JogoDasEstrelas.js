let video;
let handPose;
let hands = [];
let cestoImg;
let cesto;
let mao;
let estrelaImg;
let estrela;
let estrelaAgarrada = false;
let menu;
const LARGURA_CANVAS = 960;
const ALTURA_CANVAS = 720;

function resetarEstrela() {
  // --- volta a estrela para cima para cair novamente
  estrela.y = -20;
  estrela.x = random(20, width - 20);
  estrela.velocidadeY = random(1, 3);
  estrela.ativa = true;
}

function preload() {
  // --- carrega imagens e modelo de detecao da mao
  cestoImg = loadImage('assets/cesto.png');
  estrelaImg = loadImage('assets/estrela.png');
  handPose = ml5.handPose({ maxHands: 2, flipped: false });
}

function gotHands(results) {
  // --- guarda as maos detetadas em cada frame
  hands = results;
}

function setup() {
  // --- cria canvas e configura a camera
  pixelDensity(1);
  createCanvas(LARGURA_CANVAS, ALTURA_CANVAS);

  video = createCapture({
    video: {
      width: LARGURA_CANVAS,
      height: ALTURA_CANVAS,
      facingMode: 'user',
    },
    audio: false,
  }); 

  video.size(width, height);
  video.hide();

  // --- cria objetos do jogo
  cesto = new Cesto(cestoImg, width, height);
  mao = new Mao();
  menu = new Menu(width, height);
  handPose.detectStart(video, gotHands);
  estrela = new Estrela(estrelaImg, width, height);
}

function draw() {
  if (menu.ativo) {
    imageMode(CORNER);
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    resetMatrix();
    menu.atualizar(hands);
    menu.desenhar();
  } else {
    // --- limpa o ecra a cada frame
    background(0);

    // --- desenha o video espelhado
    imageMode(CORNER);
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    resetMatrix();

    // --- atualiza e desenha o cesto
    cesto.atualizar();
    cesto.desenhar();

  // --- usa apenas a primeira mao detetada
  const hand = hands.length > 0 ? hands[0] : null;
  let centroMao = null;

  if (hand) {
    // --- calcula o centro da mao e verifica se tocou na estrela
    let somaX = 0;
    let somaY = 0;
    let total = 0;
    let tocouEstrela = false;

    for (const nomePonto in hand) {
      const ponto = hand[nomePonto];
      if (ponto && typeof ponto.x === 'number' && typeof ponto.y === 'number') {
        const x = width - ponto.x;
        const y = ponto.y;

        somaX += x;
        somaY += y;
        total++;

        if (dist(x, y, estrela.x, estrela.y) < 40) {
          tocouEstrela = true;
        }
      }
    }

    if (total > 0) {
      centroMao = {
        x: somaX / total,
        y: somaY / total,
      };
    }

    if (!estrelaAgarrada && tocouEstrela) {
      // --- quando toca na estrela, fica agarrada
      estrelaAgarrada = true;
    }
  } else {
    // --- sem mao no ecran, larga a estrela
    estrelaAgarrada = false;
  }

  if (estrelaAgarrada && centroMao) {
    // --- com estrela agarrada, arrasta com a mao
    estrela.x = centroMao.x;
    estrela.y = centroMao.y;
  } else {
    // --- sem agarrar, estrela cai normalmente
    estrela.atualizar();
  }

  // --- limites do cesto para detetar entrada da estrela
  const esquerda = cesto.x - cesto.largura / 2;
  const direita = cesto.x + cesto.largura / 2;
  const topo = cesto.y - cesto.altura / 2;
  const base = cesto.y + cesto.altura / 2;

  const entrouNoCesto =
    estrela.x >= esquerda &&
    estrela.x <= direita &&
    estrela.y >= topo &&
    estrela.y <= base;

  if (entrouNoCesto) {
    // --- ao entrar no cesto, solta e reinicia a estrela
    estrelaAgarrada = false;
    resetarEstrela();
  }

  if (!estrela.ativa) {
    // --- se sair do ecran, reinicia a estrela
    estrelaAgarrada = false;
    resetarEstrela();
  }

  // --- desenha a estrela
  estrela.desenhar();

  // --- desenha a luva/pontos da mao por cima do video
  for (let i = 0; i < hands.length && i < 2; i++) {
    mao.desenhar(hands[i], width, true);
  }
  }
}