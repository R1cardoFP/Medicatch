let video;
let handPose;
let hands = [];
let cestoImg;
let cesto;
let mao;
let estrelaImg;
let estrelas = [];
const LARGURA_CANVAS = 960;
const ALTURA_CANVAS = 720;

function preload() {
  cestoImg = loadImage('assets/cesto.png');
  estrelaImg = loadImage('assets/estrela.png');
  handPose = ml5.handPose({ maxHands: 2, flipped: false });
}

function gotHands(results) {
  hands = results;
}

function setup() {
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

  cesto = new Cesto(cestoImg, width, height);
  mao = new Mao();
  handPose.detectStart(video, gotHands);

  for (let i = 0; i < 5; i++) {
    estrelas[i] = new Estrela(estrelaImg, width, height);
  }
}

function draw() {
  background(0);

 
  imageMode(CORNER);
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  resetMatrix();

  cesto.atualizar();
  cesto.desenhar();

  for (let estrela of estrelas) {
    estrela.atualizar();
    estrela.desenhar();

    if (!estrela.ativa) {
      estrela.y = -20;
      estrela.x = random(20, width - 20);
      estrela.velocidadeY = random(1, 3);
      estrela.ativa = true;
    }
  }

  for (let i = 0; i < hands.length && i < 2; i++) {
    mao.desenhar(hands[i], width, true);
  }
}