//include sprite.js e som.js



////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar o jogo
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function Jogo (canvas) {
	//Construtor de Jogo
	this.canvas = canvas;
	this.fase = [
		new Fase1(canvas),
		new Fase2(canvas),
		new Fase3(canvas),
		new Fase4(canvas),
		new Fase5(canvas),
	];
	this.faseAtual = 0;
};
//Gatilhos para os botoes
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

};
Jogo.prototype.botaoVoltar = function(){

};







////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar uma fase
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function Fase (canvas){
	//Construtor de Fase
	this.canvas = canvas;
	this.planodefundo = ;
	this.cenario = [

	]; //cenario nao interagivel
	this.elementoscenario = [

	]; //cenario interagivel
	this.inimigos = [

	];
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

};
//Desenhar os elementos do Fase
Fase.prototype.desenha = function(now){

};



////////////////////////////////////////////////////////////////
//Classes para gerenciar cada fase
////////////////////////////////////////////////////////////////

Menu.prototype = new Fase("");
Menu.prototype.construtor = Menu;
function Menu (canvas){
	//Construtor de Menu
	this.canvas = canvas;
};
//Chamada para elementos sonoros de Fase - musica, sons da fase, etc
Menu.prototype.som = function(){

};
Menu.prototype.atualiza = function(now){

};

////////////////////////////////////////////////////////////////

Fase1.prototype = new Fase("");
Fase1.prototype.construtor = Fase1;
function Fase1 (canvas){
	//Construtor de Fase1
	this.canvas = canvas;
};
//Chamada para elementos sonoros de Fase - musica, sons da fase, etc
Fase1.prototype.som = function(){

};
//Atualiza os elementos especificos da Fase
Fase1.prototype.atualiza = function(now){

	Fase.prototype.atualiza.call(this);
};

////////////////////////////////////////////////////////////////

Fase2.prototype = new Fase("");
Fase2.prototype.construtor = Fase2;
function Fase2 (canvas){
	//Construtor de Fase2
	this.canvas = canvas;
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
	this.canvas = canvas;
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
	this.canvas = canvas;
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
	this.canvas = canvas;
};
//Chamada para elementos sonoros de Fase - musica, sons da fase, etc
Fase5.prototype.som = function(){

};
//Atualiza os elementos especificos da Fase
Fase5.prototype.atualiza = function(now){

	Fase.prototype.atualiza.call(this);
};



//# sourceURL=thebox.js