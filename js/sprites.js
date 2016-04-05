
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar o sprites
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function Sprite(){
};
//Carrega sprites a partir de arquivo
Sprite.prototype.load = function(canvas){
	this.context = canvas;

	//<Javascript eh um trem muito louco>
	var gambi = this;
	function __loadsprite__(json){
		//Criando os elementos de sprite
		gambi.imagem = new Image();
		gambi.imagem.src = json.imagem;
		gambi.animacoes = json.animacoes;
		//Avisa para SpriteFactory quando terminar de carregar
		gambi.imagem.onload = SpriteFactory().loading;
	}
	LoadJSON(filename, __loadsprite__);
	//</Javascript eh um trem muito louco>

};
//Desenha o objeto
Sprite.prototype.desenha = function(){

	// desenha o pedaço do sprite em tela
	/*
    this.context.drawImage(
        this.imagem,
        this.centroImgX[this.proximaImg] - (this.width[this.proximaImg] / 2),
        this.centroImgY[this.proximaImg] - (this.height[this.proximaImg] / 2),
        this.width[this.proximaImg],
        this.height[this.proximaImg],
        this.novoSx,
        this.novoSy,
        this.novoWidth,
        this.novoHeight);

img 	Specifies the image, canvas, or video element to use 	 	
sx 		Optional. The x coordinate where to start clipping 	
sy 		Optional. The y coordinate where to start clipping 	
swidth 	Optional. The width of the clipped image 	
sheight Optional. The height of the clipped image 	
x 		The x coordinate where to place the image on the canvas 	
y 		The y coordinate where to place the image on the canvas 	
width 	Optional. The width of the image to use (stretch or reduce the image) 	
height 	Optional. The height of the image to use (stretch or reduce the image)
	*/
};





////////////////////////////////////////////////////////////////
//Classe para gerenciar o personagem principal
////////////////////////////////////////////////////////////////

SpritePrincipal.prototype = new Sprite();
SpritePrincipal.prototype.constructor = SpritePrincipal;
function SpritePrincipal() {
	this.acao = {
		"dir": false,
		"esq": false,
		"cim": false,
		"bxo": false,
		"spa": false
	};
	this.colisao = {
		"dir": false,
		"esq": false,
		"cim": false,
		"bxo": false
	};
};
//Funcoes para acoes do personagem
SpritePrincipal.prototype.botaoDireita = function(estado){
	this.acao["dir"] = estado;
};
SpritePrincipal.prototype.botaoEsquerda = function(estado){
	this.acao["esq"] = estado;
};
SpritePrincipal.prototype.botaoCima = function(estado){
	this.acao["cim"] = estado;
};
SpritePrincipal.prototype.botaoBaixo = function(estado){
	this.acao["bxo"] = estado;
};
SpritePrincipal.prototype.botaoAcao = function(estado){
	this.acao["spa"] = estado;
};
SpritePrincipal.prototype.colisaoDireita = function(){
	this.colisao["dir"] = true;
};
SpritePrincipal.prototype.colisaoEsquerda = function(){
	this.colisao["esq"] = true;
};
SpritePrincipal.prototype.colisaoCima = function(){
	this.colisao["cim"] = true;
};
SpritePrincipal.prototype.colisaoBaixo = function(){
	this.colisao["bxo"] = true;
};
//Atualiza o estado do personagem
SpritePrincipal.prototype.atualiza = function(){
	//Se estiver livre
	if(!this.colisao["bxo"]){
		this.vel.y += gravidade;	
	}
	else{
		//Se estiver pulando
		if(this.acao["cim"]){
			this.acao["cim"] = false;
			this.vel.y = this.acc.y;
		}
		//Se estiver escorado no chao
		else if(this.vel.y < 0){
			this.vel.y = 0;		
		}
	}
	//Se estiver colidindo com o teto
	if(this.colisao["cim"] && this.vel.y > 0)
		this.vel.y = 0;

	if()
};

////////////////////////////////////////////////////////////////

SpritePrincipal01.prototype = new Sprite();
SpritePrincipal01.prototype.constructor = SpritePrincipal01;
function SpritePrincipal01() {
	//Velocidade e posicao atual
	this.pos = { x: 0, y: 0 };
	this.vel = { x: 0, y: 0 };
	//Velocidade de corrida e pulo
	this.acc = { x: 10, y: 1000 };
};
SpritePrincipal01.prototype.load = function(canvas){
	Sprite.prototype.load.call(
		this, canvas, "../sprites/SpritePrincipal01.json");
};







////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar criacao de objetos
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function SpriteFactory(canvas, onload){
	//Criando singleton
	if (arguments.callee._singletonInstance) {
		return arguments.callee._singletonInstance;
	}
	arguments.callee._singletonInstance = this;

	//Guarda as classes de sprite
	this.sprites = {};
	//Guarda quantos elementoso foram carregados
	this.carregados = 0;
	//Callback para quando todos os sprites forem carregados
	this.loadCallback = onload;

	//Funcao que copia um objeto (shallow copy)
	this.copiaRasa = function(original){
		//Criando copia com prototype de original
	    var copia = Object.create(Object.getPrototypeOf(original));

	    //Iterando por cada propriedade de original
	    var i , keys = Object.getOwnPropertyNames(original);
	    for (i = 0; i < keys.length; i++){
	        //Copiando a propriedade para copia
	        Object.defineProperty(copia , keys[i] ,
	            Object.getOwnPropertyDescriptor(original , keys[i]));
	    }

	    return copia;
	};

	//Funcao que chama callback quando todos os sprites carregarem
	this.loading = function(){
		this.carregados++;
		if(this.carregados < this.sprites.length)
			return;
		this.loadCallback();
	};

	//============================================================
	//============================================================

	//Carregar todas as classes finais de sprite
	this.sprites["SpritePrincipal01"] = newSpritePrincipal01();
	this.sprites["SpritePrincipal01"].carrega(canvas);

	//Funcoes de factory
	this.newSpritePrincipal = function(tipo){
		//tipo = int com numero da fase do personagem principal
		switch(tipo){
			case 1:
				return this.copiaRasa(this.sprites["SpritePrincipal01"]);
		}
	};
};




//# sourceURL=sprites.js