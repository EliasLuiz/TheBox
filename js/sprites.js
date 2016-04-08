
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar o sprites
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function Sprite(){
};
//Carrega sprites a partir de arquivo
Sprite.prototype.load = function(canvas, filename){
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

	this.spriteAtual = { "animacao": "", "frame": 0 };

	//Criando delay de idle (GAMBI)
	if(this.animacoes["idle"]){
		for(i in this.animacoes["idle"]){
			var prim = this.animacoes["idle"][i][0];
			var parado = [];
			for(var idx = 0; idx < 300; idx++){
				parado.push(prim);
			}
			this.animacao["idle"][i] = parado.concat(this.animacao["idle"][i])
		}
	}
};
//Retorna as dimensoes atuais do objeto
Sprite.prototype.getPosAtual(){
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
	if(this.x + p.w - viewframe.x > 0 &&
	   this.x - viewframe.x < viewframe.w &&
	   this.y - p.h - viewframe.y > 0 &&
	   this.y - viewframe.y < viewframe.h &&){

	    this.context.drawImage(
	        this.imagem,		//img 	Specifies the image, canvas, or video element to use 	 	
	        this.animacoes[this.spriteAtual.animacao].x[this.spriteAtual.frame],	//sx 		Optional. The x coordinate where to start clipping 	
	        this.animacoes[this.spriteAtual.animacao].y[this.spriteAtual.frame],	//sy 		Optional. The y coordinate where to start clipping 	
	        this.animacoes[this.spriteAtual.animacao].w[this.spriteAtual.frame],	//swidth 	Optional. The width of the clipped image 	
	        this.animacoes[this.spriteAtual.animacao].h[this.spriteAtual.frame],	//sheight 	Optional. The height of the clipped image 	
	        p.x - viewframe.x,	//x 		The x coordinate where to place the image on the canvas 	
	        p.y - viewframe.y,	//y 		The y coordinate where to place the image on the canvas 	
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
Background01.prototype.getPosAtual(){
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
function SpritePrincipal01(canvas) {
	Sprite.prototype.load.call(this, canvas, "../sprites/SpritePrincipal01.json");
	SpritePrincipal.prototype.constructor.call(this, canvas);
};
SpritePrincipal01.prototype.atualiza = function(){
	SpritePrincipal.prototype.atualiza.call(this);
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