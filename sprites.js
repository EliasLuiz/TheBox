
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
	//Determina se a camera deve seguir o sprite ou nao
	this.moveCamera = false;
	//Diz se sprite deve ser desenhado ou nao
	this.visivel = true;
	
	this.spriteAtual = { "animacao": "idle", "frame": 0 };
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
	//__loadsprite__(JSONS[filename]);
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
	if(this.visivel && this.isVisivel()){
		var p = this.getPosAtual();
	    this.context.drawImage(
	        this.imagem,		//img 	Specifies the image, canvas, or video element to use 	 	
	        this.animacoes[this.spriteAtual.animacao].x[this.spriteAtual.frame],	//sx 		Optional. The x coordinate where to start clipping 	
	        this.animacoes[this.spriteAtual.animacao].y[this.spriteAtual.frame],	//sy 		Optional. The y coordinate where to start clipping 	
	        this.animacoes[this.spriteAtual.animacao].w[this.spriteAtual.frame],	//swidth 	Optional. The width of the clipped image 	
	        this.animacoes[this.spriteAtual.animacao].h[this.spriteAtual.frame],	//sheight 	Optional. The height of the clipped image 	
	        p.x - viewport.x,	//x 		The x coordinate where to place the image on the canvas 	
	        viewport.h - (p.y + p.h - viewport.y),	//y 		The y coordinate where to place the image on the canvas 	
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
	this.vel = {x: 1, y: 1};
};
//Atualiza o estado do background
Background.prototype.atualiza = function(velx, vely){
	this.pos.x += (velx !== undefined ? velx : 0) * this.vel.x;
	this.pos.y += (vely !== undefined ? vely : 0) * this.vel.y;
};

////////////////////////////////////////////////////////////////

BackgroundAnimacao.prototype = new Background();
BackgroundAnimacao.prototype.constructor = BackgroundAnimacao;
function BackgroundAnimacao(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "BackgroundAnimacao", onload);
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
	Jogo().fase.proxFase();
};

////////////////////////////////////////////////////////////////

BackgroundMenu.prototype = new Background();
BackgroundMenu.prototype.constructor = BackgroundMenu;
function BackgroundMenu(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "BackgroundMenu", onload);
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
	console.log(x + " " + y);
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
	if(this.spriteAtual.animacao === "play"){
		if (x >= 168 && x <= 452 &&
			y >= 381 && y <= 464)
			this.mouse = "newGame";
		else if (x >= 583 && x <= 864 &&
				 y >= 379 && y <= 462)
			this.mouse = "continue";
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
			case "newGame": this.newGame();break;
			case "continue": this.continue();break;
			case "volume0": this.volume(0);break;
			case "volume1": this.volume(0.5);break;
			case "volume2": this.volume(1);break;
		}
	}
};
BackgroundMenu.prototype.hover = function(x, y){
	if(this.spriteAtual.animacao === "idle"){
		if (x >= 398 && x <= 629 &&
			y >= 374 && y <= 475){
			this.spriteAtual.frame = 1;
			Som().efeitos.play('MenuHover');
		}
		else if (x >= 145 && x <= 375 &&
			y >= 374 && y <= 475){
			this.spriteAtual.frame = 0;
			Som().efeitos.play('MenuHover');
		}
		else if (x >= 656 && x <= 886 &&
			y >= 374 && y <= 475){
			this.spriteAtual.frame = 2;
			Som().efeitos.play('MenuHover');
		}
	}
	else if(this.spriteAtual.animacao === "play"){
		if (x >= 168 && x <= 452 &&
			y >= 381 && y <= 464)
			this.spriteAtual.frame = 0;
		else if (x >= 583 && x <= 864 &&
				 y >= 379 && y <= 462)
			this.spriteAtual.frame = 1;
	}
};
BackgroundMenu.prototype.atualiza = function(){
	if(this.spriteAtual.animacao === "idle"){
		if(this.botao["dir"]){
			this.spriteAtual.frame = this.spriteAtual.frame !== 2 ? this.spriteAtual.frame + 1 : 2;
			Som().efeitos.play('MenuHover');
		}
		else if(this.botao["esq"]){
			this.spriteAtual.frame = this.spriteAtual.frame !== 0 ? this.spriteAtual.frame - 1 : 0;
			Som().efeitos.play('MenuHover');
		}
		if(this.botao["acao"]){
			switch(this.spriteAtual.frame){
				case 0: this.toOpcoes();break;
				case 1: this.play();break;
				case 2: this.toCreditos();break;
			}
			Som().efeitos.play('MenuClick');
		}
	}
	else if(this.spriteAtual.animacao === "play"){
		if(this.botao["dir"]){
			this.spriteAtual.frame = 1;
			Som().efeitos.play('MenuHover');
		}
		if(this.botao["esq"]){
			this.spriteAtual.frame = 0;
			Som().efeitos.play('MenuHover');
		}
		if(this.botao["acao"]){
			switch(this.spriteAtual.frame){
				case 0: this.newGame();break;
				case 1: this.continue();break;
			}
			Som().musicas.stop('Menu');
			Som().efeitos.play('MenuClick');
			// Som().stopMusic("Menu");
			// Som().playSfx("MenuClick");
		}
	}
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
	//this.spriteAtual.frame = Som().musicas.volume * 2;
	this.spriteAtual.frame = Som().getVolume() * 2;
};
BackgroundMenu.prototype.toCreditos = function(){
	this.spriteAtual.animacao = "creditos";
	this.spriteAtual.frame = 0;
};
BackgroundMenu.prototype.play = function(){
	this.spriteAtual.animacao = "play";
	this.spriteAtual.frame = 0;
};
BackgroundMenu.prototype.newGame = function(){
	Jogo().fase.proxFase();
};
BackgroundMenu.prototype.continue = function(){
	Jogo().load();
};
BackgroundMenu.prototype.volume = function(volume){
	if(volume == Som().musicas.volume)
		return;
	this.spriteAtual.frame = volume * 2;
	Som().setVolume(volume);
	//Som().musicas.volume = volume;
	//Som().efeitos.volume = volume;
	//Som().musicas.volume('Menu') = volume;//nao entendi se é isso mesmo
};


////////////////////////////////////////////////////////////////

Background01.prototype = new Background();
Background01.prototype.constructor = Background01;
function Background01(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Background01", onload);
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

Background02.prototype = new Background();
Background02.prototype.constructor = Background02;
function Background02(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Background02", onload);
	this.w = (this.animacoes["idle"].w[0] / this.animacoes["idle"].h[0]) * viewport.h;
};
Background02.prototype.getPosAtual = function(){
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

Cenario101.prototype = new Background();
Cenario101.prototype.constructor = Cenario101;
function Cenario101(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Cenario101", onload);
	this.vel = { "x": 0.15, "y": 0.5 };
};


////////////////////////////////////////////////////////////////

Cenario102.prototype = new Background();
Cenario102.prototype.constructor = Cenario102;
function Cenario102(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Cenario102", onload);
	this.vel = { "x": 0.15, "y": 0.5 };
};

////////////////////////////////////////////////////////////////

Cenario201.prototype = new Background();
Cenario201.prototype.constructor = Cenario201;
function Cenario201(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Cenario201", onload);
	this.vel = { "x": 0.15, "y": 0.5 };
};

////////////////////////////////////////////////////////////////

Estalactite.prototype = new Background();
Estalactite.prototype.constructor = Estalactite;
function Estalactite(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Estalactite", onload);
	this.vel = { "x": 0, "y": 0 };
};

////////////////////////////////////////////////////////////////

Estalagmite.prototype = new Background();
Estalagmite.prototype.constructor = Estalagmite;
function Estalagmite(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Estalagmite", onload);
	this.vel = { "x": 0, "y": 0 };
};







////////////////////////////////////////////////////////////////
//Classe para gerenciar o cenario interagivel
////////////////////////////////////////////////////////////////

Chao11010.prototype = new Sprite();
Chao11010.prototype.constructor = Chao11010;
function Chao11010(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Chao11010", onload);
	this.h = this.animacoes["idle"].h;
	this.w = this.animacoes["idle"].w;
};
Chao11010.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h * this.altura,
		w: this.w * this.altura
	};
}

////////////////////////////////////////////////////////////////

Chao110010.prototype = new Sprite();
Chao110010.prototype.constructor = Chao110010;
function Chao110010(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Chao110010", onload);
	this.h = this.animacoes["idle"].h;
	this.w = this.animacoes["idle"].w;
};

Chao110010.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h * this.altura,
		w: this.w * this.altura
	};
}

////////////////////////////////////////////////////////////////

Chao110100.prototype = new Sprite();
Chao110100.prototype.constructor = Chao110100;
function Chao110100(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Chao110100", onload);
	this.h = this.animacoes["idle"].h;
	this.w = this.animacoes["idle"].w;
};
Chao110100.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h * this.altura,
		w: this.w * this.altura
	};
}

////////////////////////////////////////////////////////////////

Inv11010.prototype = new Sprite();
Inv11010.prototype.constructor = Inv11010;
function Inv11010(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Inv11010", onload);
	this.h = this.animacoes["idle"].h;
	this.w = this.animacoes["idle"].w;
};
Inv11010.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h * this.altura,
		w: this.w * this.altura
	};
}
Inv11010.prototype.desenha = function(){
	if(this.colisao["esq"] || this.colisao["dir"] || this.colisao["cim"] || this.colisao["bxo"]){
		Sprite.prototype.desenha.call(this);
		this.colisao = {
			"dir": false,
			"esq": false,
			"cim": false,
			"bxo": false
		};
	}
}

////////////////////////////////////////////////////////////////

Chao21010.prototype = new Sprite();
Chao21010.prototype.constructor = Chao21010;
function Chao21010(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Chao21010", onload);
	this.h = this.animacoes["idle"].h;
	this.w = this.animacoes["idle"].w;
};
Chao21010.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h * this.altura,
		w: this.w * this.altura
	};
}

////////////////////////////////////////////////////////////////

Chao210010.prototype = new Sprite();
Chao210010.prototype.constructor = Chao210010;
function Chao210010(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Chao210010", onload);
	this.h = this.animacoes["idle"].h;
	this.w = this.animacoes["idle"].w;
};
Chao210010.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h * this.altura,
		w: this.w * this.altura
	};
}

////////////////////////////////////////////////////////////////

Chao210100.prototype = new Sprite();
Chao210100.prototype.constructor = Chao210100;
function Chao210100(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Chao210100", onload);
	this.h = this.animacoes["idle"].h;
	this.w = this.animacoes["idle"].w;
};
Chao210100.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h * this.altura,
		w: this.w * this.altura
	};
}

////////////////////////////////////////////////////////////////

Plataforma.prototype = new Sprite();
Plataforma.prototype.constructor = Plataforma;
function Plataforma(canvas, onload) {
	//Sprite.prototype.load.call(this, canvas, "Plataforma", onload);
	this.vel = {"x": 0, "y": 0};
	this.posOriginal = {"x": this.pos.x, "y": this.pos.y};
};
Plataforma.prototype.atualiza = function(){
	if(this.colisao["cma"]){
		this.pos.x += this.vel.x;
		this.pos.y += this.vel.y;
	}
	else{
		if(this.posOriginal.x !== this.pos.x)
			this.pos.x -= this.vel.x;
		if(this.posOriginal.y !== this.pos.y)
			this.pos.y -= this.vel.y;
	}
	this.colisao = {
		"dir": false,
		"esq": false,
		"cim": false,
		"bxo": false
	};
}

////////////////////////////////////////////////////////////////

PlatTop21010.prototype = new Plataforma();
PlatTop21010.prototype.constructor = PlatTop21010;
function PlatTop21010(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Chao21010", onload);
	this.vel = {"x": 0, "y": 2};
	this.h = this.animacoes["idle"].h * this.altura;
	this.w = this.animacoes["idle"].w * this.altura;
};
PlatTop21010.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h,
		w: this.w
	};
};

////////////////////////////////////////////////////////////////

PlatDir21010.prototype = new Plataforma();
PlatDir21010.prototype.constructor = PlatDir21010;
function PlatDir21010(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Chao21010", onload);
	this.vel = {"x": 2, "y": 0};
	this.h = this.animacoes["idle"].h * this.altura;
	this.w = this.animacoes["idle"].w * this.altura;
};
PlatDir21010.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h,
		w: this.w
	};
};

////////////////////////////////////////////////////////////////

Inv21010.prototype = new Sprite();
Inv21010.prototype.constructor = Inv21010;
function Inv21010(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Inv21010", onload);
	this.h = this.animacoes["idle"].h;
	this.w = this.animacoes["idle"].w;
};
Inv21010.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h * this.altura,
		w: this.w * this.altura
	};
}
Inv21010.prototype.desenha = function(){
	if(this.colisao["esq"] || this.colisao["dir"] || this.colisao["cim"] || this.colisao["bxo"]){
		Sprite.prototype.desenha.call(this);
		this.colisao = {
			"dir": false,
			"esq": false,
			"cim": false,
			"bxo": false
		};
	}
}

////////////////////////////////////////////////////////////////

InvInv1010.prototype = new Sprite();
InvInv1010.prototype.constructor = InvInv1010;
function InvInv1010(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Inv11010", onload);
	this.h = this.animacoes["idle"].h;
	this.w = this.animacoes["idle"].w;
};
InvInv1010.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h * this.altura,
		w: this.w * this.altura
	};
}
InvInv1010.prototype.desenha = function(){}

////////////////////////////////////////////////////////////////

Portal.prototype = new Sprite();
Portal.prototype.constructor = Portal;
function Portal(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Portal", onload);
	this.spriteAtual = { "animacao": "idle", "frame": 0 };
	this.incremento = 0;
	this.auxCont = 0;
	this.musica = "";
	this.mod = 6;
	this.h = this.animacoes["idle"].h[0];
	this.w = this.animacoes["idle"].w[0];
};
Portal.prototype.getPosAtual = function(){
	return {
		x: this.pos.x,
		y: this.pos.y,
		h: this.h * this.altura,
		w: this.w * this.altura
	};
}
Portal.prototype.atualiza = function(){
	this.colisao = {
		"dir": false,
		"esq": false,
		"cim": false,
		"bxo": false
	};
	if(this.spriteAtual.frame === 23){
		this.incremento = -1;
		Jogo().fase.principal.visivel = false;
	}
	if(this.spriteAtual.frame === 0 && this.incremento === -1){
		Jogo().fase.proxFase();
		return;
	}
	Colisao(this, Jogo().fase.principal);
	if(this.colisao["esq"] || this.colisao["dir"] || this.colisao["cim"] || this.colisao["bxo"]){
		if(this.spriteAtual.frame === 0){
			this.incremento = 1;
			Som().stopAllMusic();
			//Som().playMusic(this.musica);
			Som().musicas.play(this.musica);
		}
		//Desfaz movimento do personagem
		Jogo().fase.principal.vel.x = 0;
		Jogo().fase.principal.vel.y = 0;
		//Puxa o principal para o centro
		var p = Jogo().fase.principal.getPosAtual();
		Jogo().fase.principal.pos.x = this.pos.x + (this.w * this.altura - p.w) / 2;
		Jogo().fase.principal.pos.y = this.pos.y
		//Desativa movimentos personagem
		Jogo().fase.principal.botaoDireita = function(x){};
		Jogo().fase.principal.botaoEsquerda = function(x){};
		Jogo().fase.principal.botaoCima = function(x){};
		Jogo().fase.principal.acao = {
			"dir": false,
			"esq": false,
			"cim": false,
			"bxo": false,
			"spa": false
		};
	}
	this.auxCont = (this.auxCont + 1) % this.mod;
	if(this.auxCont === 0)
		this.spriteAtual.frame += this.incremento;
}

////////////////////////////////////////////////////////////////

Portal1.prototype = new Sprite();
Portal1.prototype.constructor = Portal1;
function Portal1(canvas, onload) {
	Portal.prototype.constructor.call(this, canvas, onload);
	this.musica = "Fase1End";
};
Portal1.prototype.atualiza = Portal.prototype.atualiza;

////////////////////////////////////////////////////////////////

Portal2.prototype = new Sprite();
Portal2.prototype.constructor = Portal2;
function Portal2(canvas, onload) {
	Portal.prototype.constructor.call(this, canvas, onload);
	this.musica = "Fase2End";
	this.mod = 9;
};
Portal2.prototype.atualiza = Portal.prototype.atualiza;







////////////////////////////////////////////////////////////////
//Classes para gerenciar os inimigos
////////////////////////////////////////////////////////////////

Inimigo201.prototype = new Sprite();
Inimigo201.prototype.constructor = Inimigo201;
function Inimigo201(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Inimigo201", onload);
	this.acc = {x: 5, y: 21};
	this.lado = "Dir";
	this.spriteAtual = { "animacao": "idleDir", "frame": 0 };
	this.acao = {
		"dir": false,
		"esq": false,
		"cim": false,
		"bxo": false,
		"spa": false
	};
	this.movel = true;
	this.moveCamera = false;
	this.classe = "Inimigo201";
	this.destruido = false;
	this.yOriginal = this.pos.y;
};
Inimigo201.prototype.atualiza = function(){
	//Se estiver livre
	if(!this.isVisivel())
		return;
	if(!this.colisao["bxo"]){
		this.vel.y += gravidade * this.altura;
		if(this.vel.y > 0)
			this.vel.y = this.vel.y > velocidadeTerminal ? velocidadeTerminal : this.vel.y;
		else
			this.vel.y = this.vel.y < - velocidadeTerminal ? - velocidadeTerminal : this.vel.y;
		if(this.vel.y <= 0 && this.spriteAtual.animacao !== ("falling" + this.lado)){
			this.spriteAtual.animacao = "falling" + this.lado;
			this.spriteAtual.frame = -1;		
		}
	}
	//Se estiver escorado no chao
	else{
		this.lado = this.lado === "Dir" ? "Esq" : "Dir";
		if(this.spriteAtual.animacao === ("falling" + this.lado)){
			this.spriteAtual.animacao = "jumping" + this.lado;
			this.spriteAtual.frame = -1;
		}
		else if(this.spriteAtual.animacao === ("jumping" + this.lado) &&
				this.spriteAtual.frame === this.animacoes["jumping" + this.lado].x.length-1){
			this.spriteAtual.animacao = "idle" + this.lado;
			this.spriteAtual.frame = -1;
			this.vel.y = this.acc.y;
			this.vel.x = -this.vel.x
		}
	}
	this.colisao = {
		"dir": false,
		"esq": false,
		"cim": false,
		"bxo": false
	};
	this.pos.x += this.vel.x;
	this.pos.y += this.vel.y;
	this.spriteAtual.frame = (this.spriteAtual.frame + 1) % (this.animacoes[this.spriteAtual.animacao].x.length);
	if(Jogo().fase.principal != undefined){
		Colisao(this, Jogo().fase.principal);
		if(this.colisao["dir"] || this.colisao["esq"]){
			this.destruido = true;
		}
	}
	this.colisao = {
		"dir": false,
		"esq": false,
		"cim": false,
		"bxo": false
	};
}
////////////////////////////////////////////////////////////////

Inimigo202.prototype = new Sprite();
Inimigo202.prototype.constructor = Inimigo202;
function Inimigo202(canvas, onload) {
	Sprite.prototype.load.call(this, canvas, "Inimigo201", onload);
	this.acc = {x: 0, y: 0};
	this.lado = "Dir";
	this.spriteAtual = { "animacao": "idleDir", "frame": 0 };
	this.acao = {
		"dir": false,
		"esq": false,
		"cim": false,
		"bxo": false,
		"spa": false
	};
	this.movel = true;
	this.moveCamera = false;
	this.classe = "Inimigo202";
	this.destruido = false;
};

Inimigo202.prototype.atualiza = function(){
}







////////////////////////////////////////////////////////////////
//Classe para gerenciar o personagem principal
////////////////////////////////////////////////////////////////

SpritePrincipal.prototype = new Sprite();
SpritePrincipal.prototype.constructor = SpritePrincipal;
function SpritePrincipal() {
	this.acc = {x: 35, y: 45};
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
	this.moveCamera = true;
	this.classe = "";
	this.yMinimo = 0;
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
	if(!(this.spriteAtual.animacao.endsWith("Dir") || this.spriteAtual.animacao.endsWith("Esq")))
		this.spriteAtual.animacao += this.lado;

	//Se estiver livre
	if(!this.colisao["bxo"]){
		this.vel.y += gravidade * this.altura;
		if(this.vel.y > 0)
			this.vel.y = this.vel.y > velocidadeTerminal ? velocidadeTerminal : this.vel.y;
		else
			this.vel.y = this.vel.y < - velocidadeTerminal ? - velocidadeTerminal : this.vel.y;
		if(this.vel.y <= 0 && this.spriteAtual.animacao !== ("falling" + this.lado)){
			this.spriteAtual.animacao = "falling" + this.lado;
			this.spriteAtual.frame = -1;		
		}
	}
	//Se estiver escorado no chao
	else{
		this.vel.y = 0;
		//Se estiver pulando
		if(this.acao["cim"]){			
			this.acao["cim"] = false;
			this.vel.y = this.acc.y * this.altura;
			this.spriteAtual.animacao = "jumping" + this.lado;
			//Som().playSfx("MarioJump");
			Som().efeitos.play('jump');
			this.spriteAtual.frame = -1;
		}
		else{
			//Se estiver andando para a direita
			if(this.acao["dir"]){
				this.lado = "Dir";
				if(!this.colisao["dir"]){
					this.vel.x = this.acc.x * this.altura;
					if(this.spriteAtual.animacao !== ("walking" + this.lado)){
						this.spriteAtual.animacao = "walking" + this.lado;
						this.spriteAtual.frame = 0;
					}
				}
			}
			//Se estiver andando para a esquerda
			else if(this.acao["esq"]){
				this.lado = "Esq";
				if(!this.colisao["esq"]){
					this.vel.x = -this.acc.x * this.altura;
					if(this.spriteAtual.animacao !== ("walking" + this.lado)){
						this.spriteAtual.animacao = "walking" + this.lado;
						this.spriteAtual.frame = 0;
					}
				}
			}
			//Se estiver parado
			else if(this.spriteAtual.animacao !== ("idle" + this.lado)){
				this.vel.x = 0;
				this.vel.x = 0;
				this.spriteAtual.animacao = "idle" + this.lado;
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
			// this.pos.x += 5;
			// viewport.x += 5;
		}
		else
			this.vel.x = 0;
	}
	else if(this.acao["esq"]){
		this.lado = "Esq";
		if(!this.colisao["esq"]){
			this.vel.x = -this.acc.x * this.altura;
			// this.pos.x -= 5;
			// viewport.x -= 5;
		}
		else
			this.vel.x = 0;
	}

	//Testa colisao com inimigos
	var morreu = false
	for (var i = 0; i < Jogo().fase.inimigos.length; i++) {
		var inimigo = Jogo().fase.inimigos[i];
		this.colisao = {
			"dir": false,
			"esq": false,
			"cim": false,
			"bxo": false
		};
		Colisao(this, inimigo);
		if((inimigo.classe === "Inimigo201" || inimigo.classe === "Inimigo202") && this.colisao["bxo"]){
			morreu = true;
			break;
		}
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
	if(morreu || this.pos.y + this.animacoes[this.spriteAtual.animacao].h[this.spriteAtual.frame] < this.yMinimo){
		Jogo().fase.principal = SpriteFactory().newSprite(this.classe);
		Jogo().restart();
	}
};

////////////////////////////////////////////////////////////////

SpritePrincipal01.prototype = new SpritePrincipal();
SpritePrincipal01.prototype.constructor = SpritePrincipal01;
function SpritePrincipal01(canvas, onload) {
	SpritePrincipal.prototype.constructor.call(this, canvas);
	this.classe = "SpritePrincipal01";
	Sprite.prototype.load.call(this, canvas, "SpritePrincipal01", onload);
};
SpritePrincipal01.prototype.atualiza = function(){
	SpritePrincipal.prototype.atualiza.call(this);
};

////////////////////////////////////////////////////////////////

SpritePrincipal02.prototype = new SpritePrincipal();
SpritePrincipal02.prototype.constructor = SpritePrincipal02;
function SpritePrincipal02(canvas, onload) {
	SpritePrincipal.prototype.constructor.call(this, canvas);
	this.classe = "SpritePrincipal02";
	Sprite.prototype.load.call(this, canvas, "SpritePrincipal02", onload);
	this.yMinimo = -1000;
};
SpritePrincipal02.prototype.atualiza = function(){
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
			case "Background02":
				copia = this.copiaProfunda(this.sprites.Background02);break;
			case "Cenario101":
				copia = this.copiaProfunda(this.sprites.Cenario101);break;
			case "Cenario102":
				copia = this.copiaProfunda(this.sprites.Cenario102);break;
			case "Estalactite":
				copia = this.copiaProfunda(this.sprites.Estalactite);break;
			case "Estalagmite":
				copia = this.copiaProfunda(this.sprites.Estalagmite);break;
			case "Cenario201":
				copia = this.copiaProfunda(this.sprites.Cenario201);break;
			case "Chao11010":
				copia = this.copiaProfunda(this.sprites.Chao11010);break;
			case "Chao110010":
				copia = this.copiaProfunda(this.sprites.Chao110010);break;
			case "Chao110100":
				copia = this.copiaProfunda(this.sprites.Chao110100);break;
			case "Chao21010":
				copia = this.copiaProfunda(this.sprites.Chao21010);break;
			case "Chao210010":
				copia = this.copiaProfunda(this.sprites.Chao210010);break;
			case "Chao210100":
				copia = this.copiaProfunda(this.sprites.Chao210100);break;
			case "PlatTop21010":
				copia = this.copiaProfunda(this.sprites.PlatTop21010);break;
			case "PlatDir21010":
				copia = this.copiaProfunda(this.sprites.PlatDir21010);break;
			case "Inv11010":
				copia = this.copiaProfunda(this.sprites.Inv11010);break;
			case "Inv21010":
				copia = this.copiaProfunda(this.sprites.Inv21010);break;
			case "InvInv1010":
				copia = this.copiaProfunda(this.sprites.InvInv1010);break;
			case "Portal1":
				copia = this.copiaProfunda(this.sprites.Portal1);break;
			case "Portal2":
				copia = this.copiaProfunda(this.sprites.Portal2);break;
			case "Inimigo201":
				copia = this.copiaProfunda(this.sprites.Inimigo201);break;
			case "Inimigo202":
				copia = this.copiaProfunda(this.sprites.Inimigo202);break;
			case "SpritePrincipal01":
				copia = this.copiaProfunda(this.sprites.SpritePrincipal01);break;
			case "SpritePrincipal02":
				copia = this.copiaProfunda(this.sprites.SpritePrincipal02);break;
		}
		if(copia == undefined) 
			var x = 1+1;
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
	this.sprites.Background02 = new Background02(canvas, this.loading);
	///////////////////////////////////////////////////////////////////////
	this.sprites.Cenario101 = new Cenario101(canvas, this.loading);
	this.sprites.Cenario102 = new Cenario102(canvas, this.loading);
	this.sprites.Chao11010 = new Chao11010(canvas, this.loading);
	this.sprites.Chao110010 = new Chao110010(canvas, this.loading);
	this.sprites.Chao110100 = new Chao110100(canvas, this.loading);
	this.sprites.Inv11010 = new Inv11010(canvas, this.loading);

	this.sprites.Cenario201 = new Cenario201(canvas, this.loading);
	this.sprites.Estalactite = new Estalactite(canvas, this.loading);
	this.sprites.Estalagmite = new Estalagmite(canvas, this.loading);
	this.sprites.Chao21010 = new Chao21010(canvas, this.loading);
	this.sprites.PlatTop21010 = new PlatTop21010(canvas, this.loading);
	this.sprites.PlatDir21010 = new PlatDir21010(canvas, this.loading);
	this.sprites.Chao210010 = new Chao210010(canvas, this.loading);
	this.sprites.Chao210100 = new Chao210100(canvas, this.loading);
	this.sprites.Inv21010 = new Inv21010(canvas, this.loading);

	this.sprites.InvInv1010 = new InvInv1010(canvas, this.loading);
	this.sprites.Portal2 = new Portal2(canvas, this.loading);
	this.sprites.Portal1 = new Portal1(canvas, this.loading);
	///////////////////////////////////////////////////////////////////////
	this.sprites.Inimigo201 = new Inimigo201(canvas, this.loading);
	this.sprites.Inimigo202 = new Inimigo202(canvas, this.loading);
	///////////////////////////////////////////////////////////////////////
	this.sprites.SpritePrincipal01 = new SpritePrincipal01(canvas, this.loading);
	this.sprites.SpritePrincipal02 = new SpritePrincipal02(canvas, this.loading);
};




//# sourceURL=sprites.js
