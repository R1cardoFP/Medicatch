let video;
let handPose;
let hands = [];
let handImg;

function preload() {
  handImg = loadImage('assets/mao.png');
  handPose = ml5.handPose();
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);

  video = createCapture({
    video: true,
    audio: false,
  });

  video.size(width, height);
  video.hide();

  handPose.detectStart(video, gotHands);
}

function draw() {
  background(0);
  imageMode(CORNER);
  image(video, 0, 0, width, height);

  if (hands.length > 0) {
    const hand = hands[0];
    const pulso = hand.wrist;
    const baseIndicador = hand.index_finger_mcp;
    const baseMedio = hand.middle_finger_mcp;
    const baseMindinho = hand.pinky_finger_mcp;

    const palmaX = (pulso.x + baseIndicador.x + baseMedio.x + baseMindinho.x) / 4;
    const palmaY = (pulso.y + baseIndicador.y + baseMedio.y + baseMindinho.y) / 4;

    const fingerSpan = dist(baseIndicador.x, baseIndicador.y, baseMindinho.x, baseMindinho.y);
    const handSize = fingerSpan * 2.0;

    imageMode(CENTER);
    image(handImg, palmaX, palmaY, handSize, handSize);
  }
}