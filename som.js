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

	//definicao dos metodos de som
	this.stop = function(audio){
		audio.pause();
		audio.currentTime = 0;
	}
	this.carrega = function(filename){
		audio = new Audio(filename);
		audio.volume = this.volume;
		audio.load();
		return audio
	}
	this.playMusic = function(audio){
		this.music[audio].volume = this.volume;
		this.stop(this.music[audio]);
		this.music[audio].play();
	}
	this.playSfx = function(audio){
		this.sfx[audio].volume = this.volume;
		this.sfx[audio].play();
	}
	this.stopMusic = function(audio){
		this.stop(this.music[audio]);
	}
	this.stopAllMusic = function(){
		for(var i = 0; i < this.musicNames.length; i++){
			this.stopMusic(this.musicNames[i].nome);
		}
	}
	this.stopSfx = function(audio){
		this.stop(this.sfx[audio]);
	}
	this.stopAllSfx = function(){
		for(var i = 0; i < this.sfxNames.length; i++){
			this.stopSfx(this.sfxNames[i].nome);
		}
	}

	//Lista com nome dos arquivos music
	this.musicNames = [
		{ nome: "Menu", filename: "music/Menu.mp3" },
		{ nome: "Fase1Intro", filename: "music/Fase1Intro.mp3" },
		{ nome: "Fase1Loop", filename: "music/Fase1Loop.mp3" },
		{ nome: "Fase1End", filename: "music/Fase1End.mp3" }
	];
	//Lista com nome dos arquivos sfx
	this.sfxNames = [
		{ nome: "MarioJump", filename: "sfx/MarioJump.wav" },
		{ nome: "MenuClick", filename: "sfx/MenuClick.mp3" },
		{ nome: "MenuHover", filename: "sfx/MenuHover.mp3" },
	];

	this.music = {};
	this.sfx = {};

	this.volume = 0.5;

	for(var i = 0; i < this.musicNames.length; i++){
		this.music[this.musicNames[i].nome] = this.carrega(this.musicNames[i].filename);
	}
	for(var i = 0; i < this.sfxNames.length; i++){
		this.sfx[this.sfxNames[i].nome] = this.carrega(this.sfxNames[i].filename);
	}
}

//# sourceURL=som.js