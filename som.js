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
	this.musicas = new Howl({//http://howlerjs.com/
        urls: ['music/musicas.mp3', 'music/musicas.wav', 'music/musicas.ogg'],
        //loop: true,
        volume: 0.5,
		buffer: true,
        sprite: {
			Menu: [0, 1000,true],//início em milisegundos, duração em milisegundos, loop(true or false)
            Fase1Intro: [1000, 1000],//ínicio,duração
            Fase1Loop: [2000, 1000, true],//pode tirar o loop daqui e colocar só na hora do play tb
			Fase1End: [1000, 1000],
			Fase2Intro: [1000, 1000],
			Fase2Loop: [2000, 1000, true],
			Fase2End: [1000, 1000],
			Fase3Intro: [1000, 1000],
			Fase3Loop: [2000, 1000, true],
			Fase3End: [1000, 1000],
			Fase4Intro: [1000, 1000],
			Fase4Loop: [2000, 1000, true],
			Fase4End: [1000, 1000],
        },		
    });
	this.efeitos = new Howl({//http://howlerjs.com/
        urls: ['music/efeitos.mp3', 'music/efeitos.wav', 'music/efeitos.ogg'],
		volume: 0.5,
		buffer: true,
        sprite: {
            jump: [0, 500],
            MenuHover: [500, 600],
            MenuClick: [1100, 2200],
            acao: [3300, 1000]
        
        }
    });
	//definicao dos metodos de som
	// this.stop = function(audio){
		// audio.pause();
		// audio.currentTime = 0;
	// }
	// this.carrega = function(filename){
		// audio = new Audio(filename);
		// audio.volume = this.volume;
		// audio.load();
		// return audio
	// }
	// this.playMusic = function(audio){
		// this.music[audio].volume = this.volume;
		// this.stop(this.music[audio]);
		// this.music[audio].play();
	// }
	// this.playSfx = function(audio){
		// this.sfx[audio].volume = this.volume;
		// this.sfx[audio].play();
	// }
	// this.stopMusic = function(audio){
		// this.stop(this.music[audio]);
	// }
	this.stopAllMusic = function(){
		this.musicas.stop();
		this.efeitos.stop();
	}
	// this.stopSfx = function(audio){
		// this.stop(this.sfx[audio]);
	// }
	// this.stopAllSfx = function(){
		// for(var i = 0; i < this.sfxNames.length; i++){
			// this.stopSfx(this.sfxNames[i].nome);
		// }
	// }

	// //Lista com nome dos arquivos music
	// this.musicNames = [
		// { nome: "Menu", filename: "music/Menu.mp3" },
		// { nome: "Fase1Intro", filename: "music/Fase1Intro.mp3" },
		// { nome: "Fase1Loop", filename: "music/Fase1Loop.mp3" },
		// { nome: "Fase1End", filename: "music/Fase1End.mp3" },
		// { nome: "Fase2Intro", filename: "music/Fase2Intro.mp3" },
		// { nome: "Fase2Loop", filename: "music/Fase2Loop.mp3" },
		// { nome: "Fase2End", filename: "music/Fase2End.mp3" }
	// ];
	// //Lista com nome dos arquivos sfx
	// this.sfxNames = [
		// { nome: "MarioJump", filename: "sfx/MarioJump.wav" },
		// { nome: "MenuClick", filename: "sfx/MenuClick.mp3" },
		// { nome: "MenuHover", filename: "sfx/MenuHover.mp3" },
	// ];

	// this.music = {};
	// this.sfx = {};

	// this.volume = 0.5;

	// for(var i = 0; i < this.musicNames.length; i++){
		// this.music[this.musicNames[i].nome] = this.carrega(this.musicNames[i].filename);
	// }
	// for(var i = 0; i < this.sfxNames.length; i++){
		// this.sfx[this.sfxNames[i].nome] = this.carrega(this.sfxNames[i].filename);
	// }
}

//# sourceURL=som.js