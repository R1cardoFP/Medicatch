class Cesto {
	constructor(imagem, larguraCanvas, alturaCanvas) {
		this.imagem = imagem;
		this.larguraCanvas = larguraCanvas;
		this.alturaCanvas = alturaCanvas;

		this.largura = 120;
		this.altura = 90;
		this.x = larguraCanvas / 2;
		this.y = alturaCanvas - 50;
		this.velocidadeX = 1.5;
	}

	atualizar() {
		this.x += this.velocidadeX;

		const meiaLargura = this.largura / 2;
		const bateuEsquerda = this.x <= meiaLargura;
		const bateuDireita = this.x >= this.larguraCanvas - meiaLargura;

		if (bateuEsquerda || bateuDireita) {
			this.velocidadeX *= -1;
		}
	}

	desenhar() {
		imageMode(CENTER);
		image(this.imagem, this.x, this.y, this.largura, this.altura);
	}
}
