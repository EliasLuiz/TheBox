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
		new Menu(canvas),
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
Jogo.prototype.botaoPause = function(estado){
	this.pausado = !this.pausado;
};
Jogo.prototype.botaoVoltar = function(estado){
	this.fase[this.faseAtual].botaoVoltar(estado);
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
		if(aux !== "")
			gambi.planodefundo = SpriteFactory().newSprite(aux.tipo, aux.x, aux.y, aux.escala);

		//cenario nao interagivel - 2a camada
		aux = json["cenario"];
		gambi.cenario = [];
		if(aux !== [])
			for(var i = 0; i < aux.length; i++)
				gambi.cenario.push(SpriteFactory().newSprite(aux[i].tipo, aux[i].x, aux[i].y, aux[i].escala));

		//cenario interagivel
		aux = json["elementosCenario"];
		gambi.elementosCenario = [];
		if(aux !== [])
			for(var i = 0; i < aux.length; i++)
				gambi.elementosCenario.push(SpriteFactory().newSprite(aux[i].tipo, aux[i].x, aux[i].y, aux[i].escala));

		aux = json["inimigos"];
		gambi.inimigos = [];
		if(aux !== [])
			for(var i = 0; i < aux.length; i++)
				gambi.inimigos.push(SpriteFactory().newSprite(aux[i].tipo, aux[i].x, aux[i].y, aux[i].escala));

		var aux = json["principal"];
		if(aux !== "")
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
Fase.prototype.atualiza = function(){

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

Menu.prototype = new Fase("");
Menu.prototype.construtor = Menu;
function Menu (canvas){
	//Construtor de Menu
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Menu.json");
	this.tocando = "";
}
//Atualiza os elementos especificos da Fase
Menu.prototype.atualiza = function(now){
	if(this.tocando === ""){
		Som().music["Menu"].loop = true;
		Som().playMusic("Menu");
		this.tocando = "Menu";
	}
	this.planodefundo.atualiza()
};
//Gatilhos para os botoes
Menu.prototype.botaoDireita = function(estado){
	this.planodefundo.botao["dir"] = !estado;
};
Menu.prototype.botaoEsquerda = function(estado){
	this.planodefundo.botao["esq"] = !estado;
};
Menu.prototype.botaoAcao = function(estado){
	this.planodefundo.botao["acao"] = !estado;
};
Menu.prototype.botaoVoltar = function(estado){
	this.planodefundo.botao["voltar"] = !estado;
};
//Desenhar os elementos do Menu
Menu.prototype.desenha = function(){
	this.planodefundo.desenha();
};

////////////////////////////////////////////////////////////////

Fase1.prototype = new Fase("");
Fase1.prototype.construtor = Fase1;
function Fase1 (canvas){
	//Construtor de Fase1
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Fase1.json");
	this.tocando = "";
};
//Atualiza os elementos especificos da Fase
Fase1.prototype.atualiza = function(now){
	Fase.prototype.atualiza.call(this);
	if(this.tocando === ""){
		Som().playMusic("Fase01Intro");
		this.tocando = "Intro";
	}
	else if(this.tocando === "Intro" && Som().music["Fase01Intro"].ended){
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
//Atualiza os elementos especificos da Fase
Fase5.prototype.atualiza = function(now){

	Fase.prototype.atualiza.call(this);
};



//# sourceURL=thebox.js