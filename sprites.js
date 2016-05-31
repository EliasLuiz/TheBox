
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar o sprites
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function Sprite(){
	this.colisao = {
		"dir": false,
		"esq": false,
		"cim": false,
		"bxo": false
	};

	//Variaveis basicas
	//Velocidade e posicao atual
	this.pos = { x: 0, y: 0 };
	//(1 - Velocidade de movimento do background relativo ao personagem)
	this.vel = { x: 1 , y: 0 };
	//Vida do sprite - Por padrão NaN = infinito
	this.hp = 0 / 0;
	//Determina se o sprite se movimenta ou nao (causa ou sofre colisao)
	this.movel = false;
};
//Carrega sprites a partir de arquivo
Sprite.prototype.load = function(canvas, filename, onload){
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
//Retorna o dano inflingido por quem enconstar na direcao (ex: cima, baixo)
Sprite.prototype.dano = function(direcao){
	return 0;
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
//Atualiza o comportamento do objeto
Sprite.prototype.atualiza = function(){};
//Informa se o sprite esta visivel
Sprite.prototype.isVisivel = function(){
	var p = this.getPosAtual();
	return p.x + p.w - viewport.x > 0 &&
	   p.x - viewport.x < viewport.w &&
	   p.y + p.h - viewport.y > 0 &&
	   p.y - viewport.y < viewport.h;
}
//Desenha o objeto
Sprite.prototype.desenha = function(){
	//Se estiver visivel imprime
	var p = this.getPosAtual();
	if(this.isVisivel()){
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
//Classe para gerenciar o background
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

BackgroundAnimacao.prototype = new Background();
BackgroundAnimacao.prototype.constructor = BackgroundAnimacao;
function BackgroundAnimacao(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "sprites/Animacao/BackgroundAnimacao.json", onload);
	this.spriteAtual = { "animacao": "idle", "frame": 0 };
	this.h = this.animacoes["idle"].h[1];
	this.w = this.animacoes["idle"].w[1];
	this.cont = 0;
	this.quadrosBranco = 60;
	this.quadrosFade = 5;
	this.quadrosFull = 60;
	this.estado = 0;
	this.estados = ["1.0", "1.25", "1.50", "1.75", "1.100", "1.75", "1.50", "1.25", 
				 "1.0", "2.25", "2.50", "2.75", "2.100", "2.75", "2.50", "2.25", 
				 "1.0", "3.25", "3.50", "3.75", "0"];
};
BackgroundAnimacao.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h,
		w: this.w
	};
}
BackgroundAnimacao.prototype.atualiza = function(){
	this.cont++;
	switch(this.estados[this.estado]){
		case "0":
			this.botaoAcao();
			break;
		case "1.0":
			if(this.cont === this.quadrosBranco){
				this.estado++;
				this.cont = 0;
			}
			else if(this.cont === 1){
				this.spriteAtual.frame = 0;
			}
			break;
		case "1.25":
			if(this.cont === this.quadrosFade){
				this.estado++;
				this.cont = 0;
			}
			else if(this.cont === 1){
				this.spriteAtual.frame = 1;
			}
			break;
		case "1.50":
			if(this.cont === this.quadrosFade){
				this.estado++;
				this.cont = 0;
			}
			else if(this.cont === 1){
				this.spriteAtual.frame = 2;
			}
			break;
		case "1.75":
			if(this.cont === this.quadrosFade){
				this.estado++;
				this.cont = 0;
			}
			else if(this.cont === 1){
				this.spriteAtual.frame = 3;
			}
			break;
		case "1.100":
			if(this.cont === this.quadrosFull){
				this.estado++;
				this.cont = 0;
			}
			else if(this.cont === 1){
				this.spriteAtual.frame = 4;
			}
			break;
		case "2.25":
			if(this.cont === this.quadrosFade){
				this.estado++;
				this.cont = 0;
			}
			else if(this.cont === 1){
				this.spriteAtual.frame = 5;
			}
			break;
		case "2.50":
			if(this.cont === this.quadrosFade){
				this.estado++;
				this.cont = 0;
			}
			else if(this.cont === 1){
				this.spriteAtual.frame = 6;
			}
			break;
		case "2.75":
			if(this.cont === this.quadrosFade){
				this.estado++;
				this.cont = 0;
			}
			else if(this.cont === 1){
				this.spriteAtual.frame = 7;
			}
			break;
		case "2.100":
			if(this.cont === this.quadrosFull){
				this.estado++;
				this.cont = 0;
			}
			else if(this.cont === 1){
				this.spriteAtual.frame = 8;
			}
			break;
		case "3.25":
			if(this.cont === this.quadrosFade){
				this.estado++;
				this.cont = 0;
			}
			else if(this.cont === 1){
				this.spriteAtual.frame = 9;
				this.pos.x = 0;
				this.pos.y = 0;
				this.h = viewport.h;
				this.w = viewport.w;
			}
			break;
		case "3.50":
			if(this.cont === this.quadrosFade){
				this.estado++;
				this.cont = 0;
			}
			else if(this.cont === 1){
				this.spriteAtual.frame = 10;
			}
			break;
		case "3.75":
			if(this.cont === this.quadrosFade){
				this.estado++;
				this.cont = 0;
			}
			else if(this.cont === 1){
				this.spriteAtual.frame = 11;
			}
			break;
	}
};
BackgroundAnimacao.prototype.botaoAcao = function(){
	Jogo().fase = FaseFactory().newFase("Menu");
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
	this.mouse = "";
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
BackgroundMenu.prototype.click = function(x, y){
	if(this.spriteAtual.animacao === "idle"){
		if (x >= 398 && x <= 629 &&
			y >= 374 && y <= 475)
			this.mouse = "play";
		else if (x >= 145 && x <= 375 &&
			y >= 374 && y <= 475)
			this.mouse = "opcoes";
		else if (x >= 656 && x <= 886 &&
			y >= 374 && y <= 475)
			this.mouse = "creditos";
	}
	else if(this.spriteAtual.animacao === "opcoes"){
		if (x >= 68 && x <= 174 &&
			y >= 182 && y <= 211)
			this.mouse = "volume0";
		else if (x >= 175 && x <= 264 &&
			y >= 182 && y <= 211)
			this.mouse = "volume1";
		else if (x >= 265 && x <= 357 &&
			y >= 182 && y <= 211)
			this.mouse = "volume2";
		else if (x >= 172 && x <= 260 &&
			y >= 486 && y <= 513)
			this.mouse = "idle";
	}
	else if(this.spriteAtual.animacao === "creditos"){
		if(x >= 757 && x <= 872 &&
			y >= 468 && y <= 516)
			this.mouse = "idle";
	}
	if(this.mouse !== ""){
		switch(this.mouse){
			case "idle": this.toIdle();break;
			case "opcoes": this.toOpcoes();break;
			case "creditos": this.toCreditos();break;
			case "play": this.play();break;
			case "volume0": this.volume(0);break;
			case "volume1": this.volume(0.5);break;
			case "volume2": this.volume(1);break;
		}
	}
};
BackgroundMenu.prototype.hover = function(x, y){
	if(this.spriteAtual.animacao === "idle"){
		if (x >= 398 && x <= 629 &&
			y >= 374 && y <= 475)
			this.spriteAtual.frame = 1;
		else if (x >= 145 && x <= 375 &&
			y >= 374 && y <= 475)
			this.spriteAtual.frame = 0;
		else if (x >= 656 && x <= 886 &&
			y >= 374 && y <= 475)
			this.spriteAtual.frame = 2;
	}
};
BackgroundMenu.prototype.atualiza = function(){
	if(this.spriteAtual.animacao === "idle"){
		if(this.botao["dir"]){
			this.spriteAtual.frame = this.spriteAtual.frame !== 2 ? this.spriteAtual.frame + 1 : 2;
		}
		else if(this.botao["esq"]){
			this.spriteAtual.frame = this.spriteAtual.frame !== 0 ? this.spriteAtual.frame - 1 : 0;
		}
		if(this.botao["acao"]){
			switch(this.spriteAtual.frame){
				case 0: this.toOpcoes();break;
				case 1: this.play();break;
				case 2: this.toCreditos();break;
			}
		}
	}
	else {
		if(this.botao["voltar"]){
			this.toIdle();
		}
		if(this.spriteAtual.animacao === "opcoes"){
			if(this.botao["dir"]){
				if(this.spriteAtual.frame < 2){
					this.volume((this.spriteAtual.frame+1) / 2);
				}
			}
			else if(this.botao["esq"]){
				if(this.spriteAtual.frame > 0){
					this.volume((this.spriteAtual.frame-1) / 2);
				}
			}
		}
	}
	this.botao = {
		"dir": false,
		"esq": false,
		"acao": false,
		"voltar": false
	}
	this.mouse = "";
};
BackgroundMenu.prototype.toIdle = function(){
	this.spriteAtual.animacao = "idle";
	this.spriteAtual.frame = 1;
	this.botao["voltar"] = false;
};
BackgroundMenu.prototype.toOpcoes = function(){
	this.spriteAtual.animacao = "opcoes";
	this.spriteAtual.frame = Som().volume * 2;
};
BackgroundMenu.prototype.toCreditos = function(){
	this.spriteAtual.animacao = "creditos";
	this.spriteAtual.frame = 0;
};
BackgroundMenu.prototype.play = function(){
	Som().stopMusic("Menu");
	Jogo().fase = FaseFactory().newFase("Fase1");
};
BackgroundMenu.prototype.volume = function(volume){
	if(volume == Som().volume)
		return;
	this.spriteAtual.frame = volume * 2;
	Som().volume = volume;
	Som().music["Menu"].volume = volume;
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
//Classe para gerenciar o cenario nao interagivel
////////////////////////////////////////////////////////////////

Cenario01.prototype = new Background();
Cenario01.prototype.constructor = Cenario01;
function Cenario01(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "sprites/Fase01/Cenario01.json", onload);
	this.vel = { "x": 0.1, "y": 0.1 };
};


////////////////////////////////////////////////////////////////

Cenario02.prototype = new Background();
Cenario02.prototype.constructor = Cenario02;
function Cenario02(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "sprites/Fase01/Cenario02.json", onload);
	this.vel = { "x": 0.1, "y": 0.1 };
};







////////////////////////////////////////////////////////////////
//Classe para gerenciar o cenario interagivel
////////////////////////////////////////////////////////////////

Chao10.prototype = new Sprite();
Chao10.prototype.constructor = Chao10;
function Chao10(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "sprites/lvls/Chao10.json", onload);
	this.h = this.animacoes["idle"].h;
	this.w = this.animacoes["idle"].w;
};
Chao10.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h * this.altura,
		w: this.w * this.altura
	};
}

Chao100.prototype = new Sprite();
Chao100.prototype.constructor = Chao100;
function Chao100(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "sprites/lvls/Chao100.json", onload);
	this.h = this.animacoes["idle"].h;
	this.w = this.animacoes["idle"].w;
};
Chao100.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h * this.altura,
		w: this.w * this.altura
	};
}







////////////////////////////////////////////////////////////////
//Classe para gerenciar o personagem principal
////////////////////////////////////////////////////////////////

SpritePrincipal.prototype = new Sprite();
SpritePrincipal.prototype.constructor = SpritePrincipal;
function SpritePrincipal() {
	this.acc = {x: 25, y: 45};
	this.lado = "Dir";
	this.spriteAtual = { "animacao": "idle", "frame": 0 };
	this.acao = {
		"dir": false,
		"esq": false,
		"cim": false,
		"bxo": false,
		"spa": false
	};
	this.movel = true;
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
		this.vel.y += gravidade * this.altura;
		if(this.vel.y > 0)
			this.vel.y = this.vel.y > velocidadeTerminal ? velocidadeTerminal : this.vel.y;
		else
			this.vel.y = this.vel.y < - velocidadeTerminal ? - velocidadeTerminal : this.vel.y;
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
			this.pos.x += 5;
			viewport.x += 5;
		}
		else
			this.vel.x = 0;
	}
	else if(this.acao["esq"]){
		this.lado = "Esq";
		if(!this.colisao["esq"]){
			this.vel.x = -this.acc.x * this.altura;
			this.pos.x -= 5;
			viewport.x -= 5;
		}
		else
			this.vel.x = 0;
	}


	this.colisao = {
		"dir": false,
		"esq": false,
		"cim": false,
		"bxo": false
	};

	//Vai para o proximo frame da animacao
	this.pos.x += this.vel.x;
	this.pos.y += this.vel.y;
	if(!(this.spriteAtual.animacao.endsWith("Dir") || this.spriteAtual.animacao.endsWith("Esq")))
		this.spriteAtual.animacao += this.lado;
	else
	 	this.spriteAtual.animacao = this.spriteAtual.animacao.slice(0, this.spriteAtual.animacao.length-3) + this.lado;
	this.spriteAtual.frame = (this.spriteAtual.frame + 1) % (this.animacoes[this.spriteAtual.animacao].x.length - 1);



	//Se morreu
	if(this.pos.y + this.animacoes[this.spriteAtual.animacao].h[this.spriteAtual.frame] < 0){
		Jogo().fase.principal = SpriteFactory().newSprite("SpritePrincipal01");
		Jogo().fase.principal.pos.x = Jogo().fase.principalOriginalX;
		Jogo().fase.principal.pos.y = Jogo().fase.principalOriginalY;
		Jogo().fase.principal.altura = Jogo().fase.principalOriginalEscala;
		viewport.x = viewport.y = 0;
	}
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
		carregadoSprites = true;
	};

	//============================================================
	//============================================================

	//Funcoes de factory
	this.newSprite = function(tipo, x, y, altura){
		var copia;
		switch(tipo){
			case "BackgroundAnimacao":
				copia = this.copiaProfunda(this.sprites.BackgroundAnimacao);break;
			case "BackgroundMenu":
				copia = this.copiaProfunda(this.sprites.BackgroundMenu);break;
			case "Background01":
				copia = this.copiaProfunda(this.sprites.Background01);break;
			case "Cenario01":
				copia = this.copiaProfunda(this.sprites.Cenario01);break;
			case "Cenario02":
				copia = this.copiaProfunda(this.sprites.Cenario02);break;
			case "Chao10":
				copia = this.copiaProfunda(this.sprites.Chao10);break;
			case "Chao100":
				copia = this.copiaProfunda(this.sprites.Chao100);break;
			case "SpritePrincipal01":
				copia = this.copiaProfunda(this.sprites.SpritePrincipal01);break;
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
	this.sprites.BackgroundAnimacao = new BackgroundAnimacao(canvas, this.loading);
	this.sprites.BackgroundMenu = new BackgroundMenu(canvas, this.loading);
	this.sprites.Background01 = new Background01(canvas, this.loading);
	this.sprites.Cenario01 = new Cenario01(canvas, this.loading);
	this.sprites.Cenario02 = new Cenario02(canvas, this.loading);
	this.sprites.Chao10 = new Chao10(canvas, this.loading);
	this.sprites.Chao100 = new Chao100(canvas, this.loading);
	this.sprites.SpritePrincipal01 = new SpritePrincipal01(canvas, this.loading);
};




//# sourceURL=sprites.js
