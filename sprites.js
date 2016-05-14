
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
	if(this.animacoes["idleDir"]){
		for(i in this.animacoes["idleDir"]){
			var prim = this.animacoes["idleDir"][i][0];
			var parado = [];
			for(var idx = 0; idx < 300; idx++){
				parado.push(prim);
			}
			this.animacoes["idleDir"][i] = parado.concat(this.animacoes["idleDir"][i])
		}
	}
	if(this.animacoes["idleEsq"]){
		for(i in this.animacoes["idleEsq"]){
			var prim = this.animacoes["idleEsq"][i][0];
			var parado = [];
			for(var idx = 0; idx < 300; idx++){
				parado.push(prim);
			}
			this.animacoes["idleEsq"][i] = parado.concat(this.animacoes["idleEsq"][i])
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
			this.spriteAtual.frame] * this.altura,
		w: this.animacoes[this.spriteAtual.animacao].w[
			this.spriteAtual.frame] * this.altura
	};
}
//Desenha o objeto
Sprite.prototype.desenha = function(){

	// desenha o pedaço do sprite em tela
	var p = this.getPosAtual();

	//Se estiver visivel imprime
	if(p.x + p.w - viewport.x > 0 &&
	   p.x - viewport.x < viewport.w &&
	   p.y + p.h - viewport.y > 0 &&
	   p.y - viewport.y < viewport.h){

	    this.context.drawImage(
	        this.imagem,		//img 	Specifies the image, canvas, or video element to use 	 	
	        this.animacoes[this.spriteAtual.animacao].x[this.spriteAtual.frame],	//sx 		Optional. The x coordinate where to start clipping 	
	        this.animacoes[this.spriteAtual.animacao].y[this.spriteAtual.frame],	//sy 		Optional. The y coordinate where to start clipping 	
	        this.animacoes[this.spriteAtual.animacao].w[this.spriteAtual.frame],	//swidth 	Optional. The width of the clipped image 	
	        this.animacoes[this.spriteAtual.animacao].h[this.spriteAtual.frame],	//sheight 	Optional. The height of the clipped image 	
	        p.x - viewport.x,	//x 		The x coordinate where to place the image on the canvas 	
	        viewport.h - (p.y + p.h + viewport.y),	//y 		The y coordinate where to place the image on the canvas 	
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
	this.vel = {x: 0.01, y: 0.01};
};
//Atualiza o estado do background
Background.prototype.atualiza = function(vel){
	this.pos.x += vel * this.vel.x;
};

////////////////////////////////////////////////////////////////

BackgroundMenu.prototype = new Background();
BackgroundMenu.prototype.constructor = BackgroundMenu;
function BackgroundMenu(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "sprites/Menu/BackgroundMenu.json", onload);
	this.botao = {
		"dir": false,
		"esq": false,
		"acao": false,
		"voltar": false
	}
	this.fase = ""; //Vai ser setado depois por fase
	this.spriteAtual = { "animacao": "idle", "frame": 1 };
	this.w = (this.animacoes["idle"].w[0] / this.animacoes["idle"].h[0]) * viewport.h;
};
BackgroundMenu.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: viewport.h,
		w: this.w
	};
}
BackgroundMenu.prototype.atualiza = function(){
	if(this.spriteAtual.animacao === "idle"){
		if(this.botao["dir"]){
			this.spriteAtual.frame = this.spriteAtual.frame !== 2 ? this.spriteAtual.frame + 1 : 2;
			this.botao["dir"] = false;
		}
		else if(this.botao["esq"]){
			this.spriteAtual.frame = this.spriteAtual.frame !== 0 ? this.spriteAtual.frame - 1 : 0;
			this.botao["esq"] = false;
		}
		if(this.botao["acao"]){
			switch(this.spriteAtual.frame){
				case 0: 
					this.spriteAtual.animacao = "opcoes";
					this.spriteAtual.frame = Som().volume * 2;
					break;
				case 1: 
					this.fase.faseAtual++;
					break;
				case 2: 
					this.spriteAtual.animacao = "creditos";
					this.spriteAtual.frame = 0;
					break;
			}
			this.botao["acao"] = false;
		}
	}
	else {
		if(this.botao["voltar"]){
			this.spriteAtual.animacao = "idle";
			this.spriteAtual.frame = 1;
			this.botao["voltar"] = false;
		}
		if(this.spriteAtual.animacao === "opcoes"){
			if(this.botao["dir"]){
				if(this.spriteAtual.frame < 2){
					this.spriteAtual.frame++;
					Som().volume += 0.5;
					Som().music["Menu"].volume += 0.5;
				}
				this.botao["dir"] = false;
			}
			else if(this.botao["esq"]){
				if(this.spriteAtual.frame > 0){
					this.spriteAtual.frame--;
					Som().volume -= 0.5;
					Som().music["Menu"].volume -= 0.5;
				}
				this.botao["esq"] = false;
			}
			if(this.botao["acao"]){
				switch(this.spriteAtual.frame){
					case 0: 
						this.spriteAtual.animacao = "opcoes";
						this.spriteAtual.frame = Som().volume * 2;
						break;
					case 1: 
						this.fase.faseAtual++;
						break;
					case 2: 
						this.spriteAtual.animacao = "creditos";
						this.spriteAtual.frame = 0;
						break;
				}
				this.botao["acao"] = false;
			}
		}
	}
};

////////////////////////////////////////////////////////////////

Background01.prototype = new Background();
Background01.prototype.constructor = Background01;
function Background01(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "sprites/Fase01/Background01.json", onload);
	this.w = (this.animacoes["idle"].w[0] / this.animacoes["idle"].h[0]) * viewport.h;
};
Background01.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: viewport.h,
		w: this.w
	};
}







////////////////////////////////////////////////////////////////
//Classe para gerenciar o personagem principal
////////////////////////////////////////////////////////////////

SpritePrincipal.prototype = new Sprite();
SpritePrincipal.prototype.constructor = SpritePrincipal;
function SpritePrincipal() {
	this.acc = {x: 25, y: 35};
	this.lado = "Dir";
	this.spriteAtual = { "animacao": "idle", "frame": 0 };
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
	if(this.pos.y > 0 && this.pos.y < 100) 
		this.colisao["bxo"] = true;
	else
		this.colisao["bxo"] = false;
	if(!this.colisao["bxo"]){
		this.vel.y += gravidade * this.altura;
		if(this.vel.y <= 0 && this.spriteAtual.animacao !== ("falling" + this.lado)){
			this.spriteAtual.animacao = "falling";
			this.spriteAtual.frame = -1;		
		}
	}
	else{
		//Se estiver pulando
		if(this.acao["cim"]){			
			this.acao["cim"] = false;
			if(this.vel.y == 0){
				this.vel.y = this.acc.y * this.altura;
				this.spriteAtual.animacao = "jumping";
				Som().playSfx("MarioJump");
				this.spriteAtual.frame = -1;
			}
		}
		//Se estiver escorado no chao
		else if(this.vel.y <= 0){
			this.vel.y = 0;
			//Se estiver andando para o lado
			if(this.acao["dir"]){
				this.lado = "Dir";
				if(!this.colisao["dir"]){
					this.vel.x = this.acc.x * this.altura;
					if(this.spriteAtual.animacao !== ("walking" + this.lado)){
						this.spriteAtual.animacao = "walking";
						this.spriteAtual.frame = 0;
					}
				}
			}
			else if(this.acao["esq"]){
				this.lado = "Esq";
				if(!this.colisao["esq"]){
					this.vel.x = -this.acc.x * this.altura;
					if(this.spriteAtual.animacao !== ("walking" + this.lado)){
						this.spriteAtual.animacao = "walking";
						this.spriteAtual.frame = 0;
					}
				}
			}
			else if(this.spriteAtual.animacao !== ("idle" + this.lado)){
				this.vel.x = 0;
				this.vel.x = 0;
				this.spriteAtual.animacao = "idle";
				this.spriteAtual.frame = 0;
			}
		}
	}
	//Se estiver colidindo com o teto
	if(this.colisao["cim"] && this.vel.y > 0){
		this.vel.y = 0;	
	}
	if(this.acao["dir"]){
		this.lado = "Dir";
		if(!this.colisao["dir"]){
			this.vel.x = this.acc.x * this.altura;
		}
	}
	else if(this.acao["esq"]){
		this.lado = "Esq";
		if(!this.colisao["esq"]){
			this.vel.x = -this.acc.x * this.altura;
		}
	}
	else{
		this.vel.x = 0;
	}


	//Vai para o proximo frame da animacao
	this.pos.x += this.vel.x;
	this.pos.y += this.vel.y;
	if(!(this.spriteAtual.animacao.endsWith("Dir") || this.spriteAtual.animacao.endsWith("Esq")))
		this.spriteAtual.animacao += this.lado;
	else
	 	this.spriteAtual.animacao = this.spriteAtual.animacao.slice(0, this.spriteAtual.animacao.length-3) + this.lado;
	this.spriteAtual.frame = (this.spriteAtual.frame + 1) % (this.animacoes[this.spriteAtual.animacao].x.length - 1);
};

////////////////////////////////////////////////////////////////

SpritePrincipal01.prototype = new SpritePrincipal();
SpritePrincipal01.prototype.constructor = SpritePrincipal01;
function SpritePrincipal01(canvas, onload) {
	SpritePrincipal.prototype.constructor.call(this, canvas);
	Sprite.prototype.load.call(this, canvas, "sprites/Fase01/SpritePrincipal01.json", onload);
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

	//Funcao que copia um objeto (deep copy)
	this.copiaProfunda = function(obj){	
		/*	
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

	    else if (obj instanceof Function) {
	    	return obj;
	    }
	    */
	    return jQuery.extend(true, {}, obj);
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
	this.newSprite = function(tipo, x, y, altura){
		var copia;
		switch(tipo){
			case "SpritePrincipal01":
				copia = this.copiaProfunda(this.sprites.SpritePrincipal01);break;
			case "BackgroundMenu":
				copia = this.copiaProfunda(this.sprites.BackgroundMenu);break;
			case "Background01":
				copia = this.copiaProfunda(this.sprites.Background01);break;
		}
		copia.pos.x = x;
		copia.pos.y = y;
		if(altura === undefined) 
			copia.altura = 1; 
		else 
			copia.altura = altura;
		return copia;
	};

	//Carregar todas as classes finais de sprite
	this.sprites.SpritePrincipal01 = new SpritePrincipal01(canvas, this.loading);
	this.sprites.BackgroundMenu = new BackgroundMenu(canvas, this.loading);
	this.sprites.Background01 = new Background01(canvas, this.loading);
};




//# sourceURL=sprites.js