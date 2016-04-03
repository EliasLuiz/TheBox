////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar sons do jogo
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
function Som(){
	//Criando singleton
	if (arguments.callee._singletonInstance) {
		return arguments.callee._singletonInstance;
	}
	arguments.callee._singletonInstance = this;

	//Lista com nome dos arquivos music
	this.musicNames = [];
	//Lista com nome dos arquivos sfx
	this.sfxNames = [];

	this.music = {};
	this.sfx = {};

	for(name in this.musicNames){
		this.music[name] = this.carrega(name);
	}
	for(name in this.sfxNames){
		this.sfx[name] = this.carrega(name);
	}

	//=========================================================
	//=========================================================
};




//# sourceURL=som.js