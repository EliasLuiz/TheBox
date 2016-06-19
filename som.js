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
		this.stop(this.sfx[audio]);
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
		{ nome: "Fase01Intro", filename: "music/Fase01Intro.mp3" },
		{ nome: "Fase01Loop", filename: "music/Fase01Loop.mp3" },
		{ nome: "Fase01End", filename: "music/Fase01End.mp3" }
	];
	//Lista com nome dos arquivos sfx
	this.sfxNames = [
		{ nome: "MarioJump", filename: "sfx/MarioJump.wav" }
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