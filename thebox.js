//include sprite.js e som.js



////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar o jogo
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function Jogo (canvas) {
	//Criando singleton
	if (arguments.callee._singletonInstance) {
		return arguments.callee._singletonInstance;
	}
	arguments.callee._singletonInstance = this;

	//Construtor de Jogo
	this.canvas = canvas;
	this.fase = [
		new Fase1(canvas),
	];
	this.faseAtual = 0;
	this.pausado = false;
	this.atualiza();
};
//Gatilhos para os botoes
Jogo.prototype.botaoDireita = function(estado){
	this.fase[this.faseAtual].botaoDireita(estado);
};
Jogo.prototype.botaoEsquerda = function(estado){
	this.fase[this.faseAtual].botaoEsquerda(estado);
};
Jogo.prototype.botaoCima = function(estado){
	this.fase[this.faseAtual].botaoCima(estado);
};
Jogo.prototype.botaoBaixo = function(estado){
	this.fase[this.faseAtual].botaoBaixo(estado);
};
Jogo.prototype.botaoAcao = function(estado){
	this.fase[this.faseAtual].botaoAcao(estado);
};
Jogo.prototype.botaoPause = function(){
	this.pausado = !this.pausado;
};
Jogo.prototype.botaoVoltar = function(){

};
Jogo.prototype.atualiza = function(now){
	Jogo().fase[this.faseAtual].atualiza();
	Jogo().fase[this.faseAtual].desenha();
	requestNextAnimationFrame(window.funcaoAtualiza);
};







////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar uma fase
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

Fase.prototype.construtor = Fase;
function Fase (canvas, filename){
	this.canvas = canvas;
}
Fase.prototype.load = function(filename){
	var gambi = this;
	function __loadfase__(json){
		var aux = json["planodefundo"];
		gambi.planodefundo = SpriteFactory().newSprite(aux.tipo, aux.x, aux.y, aux.escala);

		//cenario nao interagivel - 2a camada
		aux = json["cenario"];
		gambi.cenario = [];
		for(var i = 0; i < aux.length; i++){
			gambi.cenario.push(SpriteFactory().newSprite(aux[i].tipo, aux[i].x, aux[i].y, aux[i].escala));
		}

		//cenario interagivel
		aux = json["elementosCenario"];
		gambi.elementosCenario = [];
		for(var i = 0; i < aux.length; i++){
			gambi.elementosCenario.push(SpriteFactory().newSprite(aux[i].tipo, aux[i].x, aux[i].y, aux[i].escala));
		}

		aux = json["inimigos"];
		gambi.inimigos = [];
		for(var i = 0; i < aux.length; i++){
			gambi.inimigos.push(SpriteFactory().newSprite(aux[i].tipo, aux[i].x, aux[i].y, aux[i].escala));
		}

		var aux = json["principal"];
		gambi.principal = SpriteFactory().newSprite(aux.tipo, aux.x, aux.y, aux.escala);
	}
	LoadJSON(filename, __loadfase__);
};
//Gatilhos para os botoes
Fase.prototype.botaoDireita = function(estado){
	this.principal.botaoDireita(estado);
};

Fase.prototype.botaoEsquerda = function(estado){
	this.principal.botaoEsquerda(estado);
};

Fase.prototype.botaoCima = function(estado){
	this.principal.botaoCima(estado);
};

Fase.prototype.botaoBaixo = function(estado){
	this.principal.botaoBaixo(estado);
};

Fase.prototype.botaoAcao = function(estado){
	this.principal.botaoAcao(estado);
};
//Atualizar os elementos do Fase
Fase.prototype.atualiza = function(now){

	//Atualiza elementos fixos em relacao a tela
	this.principal.atualiza();
	for (var i = 0; i < this.elementosCenario.length; i++) {
		this.elementosCenario[i].atualiza();
	}
	for (var i = 0; i < this.inimigos.length; i++) {
		this.inimigos[i].atualiza();
	}

	var vel = 0;
	//Desloca a fase
	if(this.principal.acao["dir"] || this.principal.acao["esq"]) {
		vel = this.principal.vel.x;
		viewport.x += vel;	
	}

	//Atualiza quem nao se move junto com a tela
	this.planodefundo.atualiza(vel);
	for (var i = 0; i < this.cenario.length; i++) {
		this.cenario[i].atualiza(vel);
	}

};
//Desenhar os elementos do Fase
Fase.prototype.desenha = function(){

	this.planodefundo.desenha();
	for (var i = 0; i < this.cenario.length; i++) {
		this.cenario[i].desenha();
	}
	for (var i = 0; i < this.elementosCenario.length; i++) {
		this.elementosCenario[i].desenha();
	}
	for (var i = 0; i < this.inimigos.length; i++) {
		this.inimigos[i].desenha();
	}
	this.principal.desenha();

};



////////////////////////////////////////////////////////////////
//Classes para gerenciar cada fase
////////////////////////////////////////////////////////////////

Fase1.prototype = new Fase("");
Fase1.prototype.construtor = Fase1;
function Fase1 (canvas){
	//Construtor de Fase1
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Fase1.json");
	this.tocando = "Intro";
	Som().playMusic("Fase01Intro");
};
//Chamada para elementos sonoros de Fase - musica, sons da fase, etc
Fase1.prototype.som = function(){

};
//Atualiza os elementos especificos da Fase
Fase1.prototype.atualiza = function(now){
	Fase.prototype.atualiza.call(this);
	if(this.tocando === "Intro" && Som().music["Fase01Intro"].ended){
		this.tocando = "Loop";
		Som().music["Fase01Loop"].loop = true;
		Som().playMusic("Fase01Loop");
	}
};

////////////////////////////////////////////////////////////////

Fase2.prototype = new Fase("");
Fase2.prototype.construtor = Fase2;
function Fase2 (canvas){
	//Construtor de Fase2
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Fase2.json");
};
//Chamada para elementos sonoros de Fase - musica, sons da fase, etc
Fase2.prototype.som = function(){

};
//Atualiza os elementos especificos da Fase
Fase2.prototype.atualiza = function(now){

	Fase.prototype.atualiza.call(this);
};

////////////////////////////////////////////////////////////////

Fase3.prototype = new Fase("");
Fase3.prototype.construtor = Fase3;
function Fase3 (canvas){
	//Construtor de Fase3
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Fase3.json");
};
//Chamada para elementos sonoros de Fase - musica, sons da fase, etc
Fase3.prototype.som = function(){

};
//Atualiza os elementos especificos da Fase
Fase3.prototype.atualiza = function(now){

	Fase.prototype.atualiza.call(this);
};

////////////////////////////////////////////////////////////////

Fase4.prototype = new Fase("");
Fase4.prototype.construtor = Fase4;
function Fase4 (canvas){
	//Construtor de Fase4
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Fase4.json");
};
//Chamada para elementos sonoros de Fase - musica, sons da fase, etc
Fase4.prototype.som = function(){

};
//Atualiza os elementos especificos da Fase
Fase4.prototype.atualiza = function(now){

	Fase.prototype.atualiza.call(this);
};

////////////////////////////////////////////////////////////////

Fase5.prototype = new Fase("");
Fase5.prototype.construtor = Fase5;
function Fase5 (canvas){
	//Construtor de Fase5
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Fase5.json");
};
//Chamada para elementos sonoros de Fase - musica, sons da fase, etc
Fase5.prototype.som = function(){

};
//Atualiza os elementos especificos da Fase
Fase5.prototype.atualiza = function(now){

	Fase.prototype.atualiza.call(this);
};



//# sourceURL=thebox.js