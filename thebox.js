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
	//this.now = +new Date();
	arguments.callee._singletonInstance = this;

	//Construtor de Jogo
	this.canvas = canvas;
	this.faseAtual = "Animacao";
	this.fase = FaseFactory().newFase("Animacao");
	this.pausado = false;
	this.atualiza();
};
//Gatilhos para os botoes
Jogo.prototype.botaoDireita = function(estado){
	this.fase.botaoDireita(estado);
};
Jogo.prototype.botaoEsquerda = function(estado){
	this.fase.botaoEsquerda(estado);
};
Jogo.prototype.botaoCima = function(estado){
	this.fase.botaoCima(estado);
};
Jogo.prototype.botaoBaixo = function(estado){
	this.fase.botaoBaixo(estado);
};
Jogo.prototype.botaoAcao = function(estado){
	this.fase.botaoAcao(estado);
};
Jogo.prototype.botaoPause = function(estado){
	this.pausado = !this.pausado;
};
Jogo.prototype.botaoVoltar = function(estado){
	this.fase.botaoVoltar(estado);
};
Jogo.prototype.load = function(){
	this.faseAtual = loadFase();
	this.restart();
};
Jogo.prototype.restart = function(x, y){
	Som().stopAllMusic();
	Som().stopAllSfx();
	this.fase = FaseFactory().newFase(this.faseAtual);
	viewport.x = viewport.y = 0;
	this.fase.atualiza();
};
Jogo.prototype.click = function(x, y){
	this.fase.click(x, y);
};
Jogo.prototype.hover = function(x, y){
	this.fase.hover(x, y);
};
var intervalo=0;
var fps=0;
Jogo.prototype.atualiza = function(){
	var now = +new Date();
	//$('#fps').html((1000/(now-this.now)).toFixed(0) + " fps");
	canvas.clearRect(0, 0, viewport.w, viewport.h);
	this.fase.desenha();
	this.fase.atualiza();
	
	if(intervalo==60 || intervalo==0){		
		fps=(1000/(now-this.now)).toFixed(0);
		intervalo=1;
	}
	if(!isNaN(fps)){
		canvas.font = "20px sans-serif";
		canvas.fillText(fps + " fps",10,20);
	}
	requestNextAnimationFrame(window.funcaoAtualiza);
	this.now = now;
	intervalo=intervalo+1;
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
			for(var i = 0; i < aux.length; i++){
				//Blocos invisiveis multiplos
				if(aux[i].tipo.indexOf("Inv") !== -1 &&
				   aux[i].tipo.indexOf("10010") !== -1){
					var w = SpriteFactory().newSprite("Inv11010", aux[i].x, aux[i].y, aux[i].escala).w
					for (var j = 0; j < 10; j++){
						gambi.elementosCenario.push(SpriteFactory().newSprite("Inv11010", aux[i].x + j*w*aux[i].escala, aux[i].y, aux[i].escala));
					}
				}
				else if(aux[i].tipo.indexOf("Inv") !== -1 &&
				   		aux[i].tipo.indexOf("10100") !== -1){
					var h = SpriteFactory().newSprite("Inv11010", aux[i].x, aux[i].y, aux[i].escala).h
					for (var j = 0; j < 10; j++){
						gambi.elementosCenario.push(SpriteFactory().newSprite("Inv11010", aux[i].x, aux[i].y + j*h*aux[i].escala, aux[i].escala));
					}
				}
				else
					gambi.elementosCenario.push(SpriteFactory().newSprite(aux[i].tipo, aux[i].x, aux[i].y, aux[i].escala));
			}

		aux = json["inimigos"];
		gambi.inimigos = [];
		if(aux !== [])
			for(var i = 0; i < aux.length; i++)
				gambi.inimigos.push(SpriteFactory().newSprite(aux[i].tipo, aux[i].x, aux[i].y, aux[i].escala));

		aux = json["projeteis"];
		gambi.projeteis = [];
		if(aux !== [])
			for(var i = 0; i < aux.length; i++)
				gambi.projeteis.push(SpriteFactory().newSprite(aux[i].tipo, aux[i].x, aux[i].y, aux[i].escala));

		var aux = json["principal"];
		if(aux !== "")
			gambi.principal = SpriteFactory().newSprite(aux.tipo, aux.x, aux.y, aux.escala);

		aux = json["frente"];
		gambi.frente = [];
		if(aux !== [])
			for(var i = 0; i < aux.length; i++)
				gambi.frente.push(SpriteFactory().newSprite(aux[i].tipo, aux[i].x, aux[i].y, aux[i].escala));
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
Fase.prototype.click = function(x, y){
};
Fase.prototype.hover = function(x, y){
};
//Atualizar os elementos do Fase
Fase.prototype.atualiza = function(){
	//Testando colisoes
	inimigosPersonagem = false;
	var aux, mudancaViewport = {"x": 0, "y": 0};
	for (var i = 0; i < this.elementosCenario.length; i++) {
		if(!this.elementosCenario[i].isVisivel())
			continue;
		aux = Colisao(this.elementosCenario[i], this.principal);
		mudancaViewport.x += aux.x;
		mudancaViewport.y += aux.y;
		for (var j = 0; j < this.inimigos.length; j++) {
			if(!this.inimigos[j].isVisivel())
				continue;
			aux = Colisao(this.elementosCenario[i], this.inimigos[j]);
		}
	}


	//Atualiza elementos fixos em relacao a tela
	this.principal.atualiza();
	for (var i = 0; i < this.elementosCenario.length; i++) {
		if(this.elementosCenario[i].isVisivel()){
			this.elementosCenario[i].atualiza();
		}
	}
	var destruidos = [];
	for (var i = 0; i < this.inimigos.length; i++) {
		if(this.inimigos[i].isVisivel()){
			this.inimigos[i].atualiza();
			if(this.inimigos[i].destruido)
				destruidos.push(i);
		}
	}
	for (var i = 0; i < destruidos.length; i++) {
		this.inimigos.splice(destruidos[i]-i, 1);
	}

	var velx = vely = 0;
	//Desloca a fase
	velx = this.principal.vel.x + mudancaViewport.x;
	vely = this.principal.vel.y + mudancaViewport.y;
	viewport.x += velx;
	viewport.y += vely;


	//Atualiza quem nao se move junto com a tela
	this.planodefundo.atualiza(velx, vely);
	for (var i = 0; i < this.cenario.length; i++) {
		this.cenario[i].atualiza(velx, vely);
	}
	for (var i = 0; i < this.projeteis.length; i++) {
		this.projeteis[i].atualiza(velx, vely);
	}
	for (var i = 0; i < this.frente.length; i++) {
		this.frente[i].atualiza(velx, vely);
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
	for (var i = 0; i < this.projeteis.length; i++) {
		this.projeteis[i].desenha();
	}
	this.principal.desenha();
	for (var i = 0; i < this.frente.length; i++) {
		this.frente[i].desenha();
	}
};



////////////////////////////////////////////////////////////////
//Classes para gerenciar cada fase
////////////////////////////////////////////////////////////////

Animacao.prototype = new Fase("");
Animacao.prototype.construtor = Animacao;
function Animacao (canvas){
	//Construtor de Animacao
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Animacao");
}
//Atualiza os elementos especificos da Fase
Animacao.prototype.atualiza = function(){
	this.planodefundo.atualiza();
};
Animacao.prototype.botaoAcao = function(estado){
	if(!estado)
		this.planodefundo.botaoAcao();
};
Animacao.prototype.desenha = function(){
	this.planodefundo.desenha();
};
Animacao.prototype.proxFase = function(){
	Jogo().faseAtual = "Menu";
	Jogo().fase = FaseFactory().newFase("Menu");
};

////////////////////////////////////////////////////////////////

Menu.prototype = new Fase("");
Menu.prototype.construtor = Menu;
function Menu (canvas){
	//Construtor de Menu
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Menu");
	this.tocando = "";
	this.addHover = false;
}
//Atualiza os elementos especificos da Fase
Menu.prototype.atualiza = function(){
	if(!this.addHover){
		document.getElementById("canvas").addEventListener('mousemove', hover, false);
		this.addHover = true;
	}
	if(this.tocando === ""){
		Som().stopAllMusic();
		Som().music["Menu"].loop = true;
		Som().playMusic("Menu");
		this.tocando = "Menu";
		viewport.x = 0;
		viewport.y = 0;
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
Menu.prototype.click = function(x, y){
	this.planodefundo.click(x, y);
};
Menu.prototype.hover = function(x, y){
	this.planodefundo.hover(x, y);
};
//Desenhar os elementos do Menu
Menu.prototype.desenha = function(){
	this.planodefundo.desenha();
};
Menu.prototype.proxFase = function(){
	Jogo().faseAtual = "Fase1";
	salvaFase("Fase1");
	Jogo().fase = FaseFactory().newFase("Fase1");
	Jogo().fase.atualiza();
};

////////////////////////////////////////////////////////////////

Fase1.prototype = new Fase("");
Fase1.prototype.construtor = Fase1;
function Fase1 (canvas){
	//Construtor de Fase1
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Fase1");
	this.tocando = "";
	this.removeHover = false;
};
//Atualiza os elementos especificos da Fase
Fase1.prototype.atualiza = function(){
	if(!this.removeHover){
		viewport.x = 1700;
		document.getElementById("canvas").removeEventListener("mousemove", hover);
		this.removeHover = true;
		this.planodefundo.pos.x = 1700;
	}
	Fase.prototype.atualiza.call(this);
	if(this.tocando === ""){
		Som().stopAllMusic();
		Som().playMusic("Fase1Intro");
		this.tocando = "Intro";
	}
	else if(this.tocando === "Intro" && Som().music["Fase1Intro"].ended){
		this.tocando = "Loop";
		Som().music["Fase1Loop"].loop = true;
		Som().playMusic("Fase1Loop");
	}
};
Fase1.prototype.proxFase = function(){
	Jogo().faseAtual = "Menu";
	//salvaFase("Fase2");
	Jogo().fase = FaseFactory().newFase("Menu");
	Jogo().fase.atualiza();
};

////////////////////////////////////////////////////////////////

Fase2.prototype = new Fase("");
Fase2.prototype.construtor = Fase2;
function Fase2 (canvas){
	//Construtor de Fase2
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Fase2");
};
//Atualiza os elementos especificos da Fase
Fase2.prototype.atualiza = function(){

	Fase.prototype.atualiza.call(this);
};
Fase2.prototype.proxFase = function(){
	Jogo().faseAtual = "Fase3";
	//salvaFase("Fase3");
	Jogo().fase = FaseFactory().newFase("Fase3");
	Jogo().fase.atualiza();
};

////////////////////////////////////////////////////////////////

Fase3.prototype = new Fase("");
Fase3.prototype.construtor = Fase3;
function Fase3 (canvas){
	//Construtor de Fase3
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Fase3");
};
//Atualiza os elementos especificos da Fase
Fase3.prototype.atualiza = function(){

	Fase.prototype.atualiza.call(this);
};
Fase3.prototype.proxFase = function(){
	Jogo().faseAtual = "Fase4";
	//salvaFase("Fase4");
	Jogo().fase = FaseFactory().newFase("Fase4");
	Jogo().fase.atualiza();
};

////////////////////////////////////////////////////////////////

Fase4.prototype = new Fase("");
Fase4.prototype.construtor = Fase4;
function Fase4 (canvas){
	//Construtor de Fase4
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Fase4");
};
//Atualiza os elementos especificos da Fase
Fase4.prototype.atualiza = function(){

	Fase.prototype.atualiza.call(this);
};
Fase4.prototype.proxFase = function(){
	Jogo().faseAtual = "Fase5";
	//salvaFase("Fase5");
	Jogo().fase = FaseFactory().newFase("Fase5");
	Jogo().fase.atualiza();
};

////////////////////////////////////////////////////////////////

Fase5.prototype = new Fase("");
Fase5.prototype.construtor = Fase5;
function Fase5 (canvas){
	//Construtor de Fase5
	Fase.prototype.construtor.call(this, canvas);
	Fase.prototype.load.call(this, "Fase5");
};
//Atualiza os elementos especificos da Fase
Fase5.prototype.atualiza = function(){

	Fase.prototype.atualiza.call(this);
};
Fase5.prototype.proxFase = function(){
	Jogo().faseAtual = "Menu";
	//salvaFase("Fase1");
	Jogo().fase = FaseFactory().newFase("Menu");
	Jogo().fase.atualiza();
};







////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar criacao de fases
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function FaseFactory(canvas){
	//Criando singleton
	if (arguments.callee._singletonInstance) {
		return arguments.callee._singletonInstance;
	}
	arguments.callee._singletonInstance = this;

	//Guarda as classes de sprite
	this.fases = {};

	//Funcao que copia um objeto (deep copy)
	this.copiaProfunda = function(obj){	
	    return jQuery.extend(true, {}, obj);
	};

	//============================================================
	//============================================================

	//Funcoes de factory
	this.newFase = function(tipo){
		switch(tipo){
			case "Animacao":
				return this.copiaProfunda(this.fases.Animacao);break;
			case "Menu":
				return this.copiaProfunda(this.fases.Menu);break;
			case "Fase1":
				return this.copiaProfunda(this.fases.Fase1);break;
				//return new Fase1(canvas);break;
			case "Fase2":
				return this.copiaProfunda(this.fases.Fase2);break;
		}
	};

	//Carregar todas as classes finais de sprite
	this.fases.Animacao = new Animacao(canvas);
	this.fases.Menu = new Menu(canvas);
	this.fases.Fase1 = new Fase1(canvas);
	this.fases.Fase2 = new Fase2(canvas);
};



//# sourceURL=thebox.js
