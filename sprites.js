
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar o sprites
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function Sprite(){
};
//Carrega sprites a partir de arquivo
Sprite.prototype.load = function(canvas, filename, onload){
	this.context = canvas;

	//Variaveis basicas
	//Velocidade e posicao atual
	this.pos = { x: 0, y: 0 };
	//(1 - Velocidade de movimento do background relativo ao personagem)
	this.vel = { x: 1 - 0.1, y: 0 };

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

	this.spriteAtual = { "animacao": "idle", "frame": 0 };

	//Criando delay de idle (GAMBI)
	if(this.animacoes["idle"]){
		for(i in this.animacoes["idle"]){
			var prim = this.animacoes["idle"][i][0];
			var parado = [];
			for(var idx = 0; idx < 300; idx++){
				parado.push(prim);
			}
			this.animacoes["idle"][i] = parado.concat(this.animacoes["idle"][i])
		}
	}

	onload();
};
//Retorna as dimensoes atuais do objeto
Sprite.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.animacoes[this.spriteAtual.animacao].h[
			this.spriteAtual.sprite] * this.altura,
		w: this.animacoes[this.spriteAtual.animacao].w[
			this.spriteAtual.sprite] * this.altura
	};
}
//Desenha o objeto
Sprite.prototype.desenha = function(){

	// desenha o pedaço do sprite em tela
	var p = this.getPosAtual();

	//Se estiver visivel imprime
	if(p.x + p.w - viewport.x > 0 &&
	   p.x - viewport.x < viewport.w &&
	   p.y - p.h - viewport.y > 0 &&
	   p.y - viewport.y < viewport.h){

	    this.context.drawImage(
	        this.imagem,		//img 	Specifies the image, canvas, or video element to use 	 	
	        this.animacoes[this.spriteAtual.animacao].x[this.spriteAtual.frame],	//sx 		Optional. The x coordinate where to start clipping 	
	        this.animacoes[this.spriteAtual.animacao].y[this.spriteAtual.frame],	//sy 		Optional. The y coordinate where to start clipping 	
	        this.animacoes[this.spriteAtual.animacao].w[this.spriteAtual.frame],	//swidth 	Optional. The width of the clipped image 	
	        this.animacoes[this.spriteAtual.animacao].h[this.spriteAtual.frame],	//sheight 	Optional. The height of the clipped image 	
	        p.x - viewport.x,	//x 		The x coordinate where to place the image on the canvas 	
	        p.y - viewport.y,	//y 		The y coordinate where to place the image on the canvas 	
	        p.w, 	//width 	Optional. The width of the image to use (stretch or reduce the image) 	
	        p.h); 	//height 	Optional. The height of the image to use (stretch or reduce the image)

	}
};





////////////////////////////////////////////////////////////////
//Classe para gerenciar o b
////////////////////////////////////////////////////////////////

Background.prototype = new Sprite();
Background.prototype.constructor = Background;
function Background() {
};
//Atualiza o estado do background
Background.prototype.atualiza = function(vel){
	this.pos.x += vel * this.vel.x;
};

////////////////////////////////////////////////////////////////

Background01.prototype = new Background();
Background01.prototype.constructor = Background01;
function Background01(canvas) {
	Sprite.prototype.load.call(this, canvas, "bg01.json");
};
Background01.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: viewport.h,
		w: viewport.w
	};
}







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
SpritePrincipal.prototype.botaoDireita = function(estado){ 	this.acao["dir"] = estado; };
SpritePrincipal.prototype.botaoEsquerda = function(estado){	this.acao["esq"] = estado; };
SpritePrincipal.prototype.botaoCima = function(estado){		this.acao["cim"] = estado; };
SpritePrincipal.prototype.botaoBaixo = function(estado){	this.acao["bxo"] = estado; };
SpritePrincipal.prototype.botaoAcao = function(estado){		this.acao["spa"] = estado; };
SpritePrincipal.prototype.colisaoDireita = function(){ 		this.colisao["dir"] = true; };
SpritePrincipal.prototype.colisaoEsquerda = function(){		this.colisao["esq"] = true; };
SpritePrincipal.prototype.colisaoCima = function(){			this.colisao["cim"] = true; };
SpritePrincipal.prototype.colisaoBaixo = function(){ 		this.colisao["bxo"] = true; };
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
			this.spriteAtual.animacao = "jumping";
			this.spriteAtual.frame = -1;
		}
		//Se estiver escorado no chao
		else if(this.vel.y < 0){
			this.vel.y = 0;
			//Se estiver abaixando
			if(this.acao["bxo"]){
				this.spriteAtual.animacao = "ducking";
				this.spriteAtual.frame = -1;
			}
			else {
				this.spriteAtual.animacao = "idle";
				this.spriteAtual.frame = -1;				
			}
		}
	}
	//Se estiver colidindo com o teto
	if(this.colisao["cim"] && this.vel.y > 0){
		this.vel.y = 0;	
	}

	//Se estiver andando para o lado
	if(this.acao["dir"] && !this.colisao["dir"]){
		this.vel.x = this.acc.x;
		if(this.spriteAtual.animacao !== "walking"){
			this.spriteAtual.animacao = "walking";
			this.spriteAtual.frame = -1;
		}
	}
	else if(this.acao["esq"] && !this.colisao["esq"]){
		this.vel.x = -this.acc.x;
	}

	//Vai para o proximo frame da animacao
	this.spriteAtual.frame = (this.spriteAtual.frame + 1) % (this.animacoes[this.spriteAtual.animacao].x.length);
};

////////////////////////////////////////////////////////////////

SpritePrincipal01.prototype = new SpritePrincipal();
SpritePrincipal01.prototype.constructor = SpritePrincipal01;
function SpritePrincipal01(canvas, onload) {
	SpritePrincipal.prototype.constructor.call(this, canvas);
	Sprite.prototype.load.call(this, canvas, "sprites/SpritePrincipal01.json", onload);
};
SpritePrincipal01.prototype.atualiza = function(){
	SpritePrincipal.prototype.atualiza.call(this);
};







////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar criacao de objetos
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function SpriteFactory(canvas){
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
	this.copiaProfunda = function(obj){		
	    var copy;

	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != typeof obj) 
	    	return obj;

	    // Handle Date
	    else if (obj instanceof Date) {
	        copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    else if (obj instanceof Array) {
	        copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = this.copiaProfunda(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    else if (obj instanceof Object) {
	        copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) 
	            	copy[attr] = this.copiaProfunda(obj[attr]);
	        }
	        return copy;
	    }

	    else if (obj instanceof Object) {
	    	
	    }
	};

	//Funcao que chama callback quando todos os sprites carregarem
	var gambi = this;
	this.loading = function(){
		gambi.carregados++;
		if(gambi.carregados < gambi.sprites.length)
			return;
		carregado = true;
	};

	//============================================================
	//============================================================

	//Funcoes de factory
	this.newSpritePrincipal = function(tipo, x, y){
		//tipo = int com numero da fase do personagem principal
		switch(tipo){
			case 1:
				var aux = this.copiaProfunda(this.sprites.SpritePrincipal01);
				aux.pos.x = x;
				aux.pos.y = y;
				return aux;
		}
	};

	//Carregar todas as classes finais de sprite
	this.sprites.SpritePrincipal01 = new SpritePrincipal01(canvas, this.loading);
};




//# sourceURL=sprites.js