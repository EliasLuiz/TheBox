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
function SoundPool(maxSize) {
	var size = maxSize; // Max sounds allowed in the pool
	var pool = [];
	this.pool = pool;
	var currSound = 0;
	/*
	 * Populates the pool array with the given sound
	 */
	this.init = function(object) {
		if (object == "laser") {
			for (var i = 0; i < size; i++) {
				// Initalize the sound
				laser = new Audio("sounds/MarioJump.wav");
				laser.volume = .12;
				laser.load();
				pool[i] = laser;
			}
		}
		else if (object == "explosion") {
			for (var i = 0; i < size; i++) {
				var explosion = new Audio("sounds/explosion.wav");
				explosion.volume = .1;
				explosion.load();
				pool[i] = explosion;
			}
		}
	};
	/*
	 * Plays a sound
	 */
	this.get = function() {
		if(pool[currSound].currentTime == 0 || pool[currSound].ended) {
			pool[currSound].play();
		}
		currSound = (currSound + 1) % size;
	};
}



//# sourceURL=som.js