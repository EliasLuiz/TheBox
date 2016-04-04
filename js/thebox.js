//include sprite.js e som.js



////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar o jogo
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function Jogo (canvas){
	//Construtor de Jogo
	this.canvas = canvas;
	this.fase = [

	];
	this.faseAtual = 0;
};
//Gatilhos para os botoes
Jogo.prototype.botaoDireita = function(){

};
Jogo.prototype.botaoEsquerda = function(){

};
Jogo.prototype.botaoCima = function(){

};
Jogo.prototype.botaoBaixo = function(){

};
Jogo.prototype.botaoAcao = function(){

};
//Atualizar os elementos do Jogo
Jogo.prototype.atualiza = function(now){

};
//Desenhar os elementos do Jogo
Jogo.prototype.desenha = function(now){

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
Fase.prototype.botaoDireita = function(){

};
Fase.prototype.botaoEsquerda = function(){

};
Fase.prototype.botaoCima = function(){

};
Fase.prototype.botaoBaixo = function(){

};
Fase.prototype.botaoAcao = function(){

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
Fase.prototype.som = function(){

};
Fase.prototype.atualiza = function(now){

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