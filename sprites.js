//include som.js



////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar o sprites
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function Sprite(){

};
//Carrega sprites a partir de arquivo
Sprite.prototype.load = function(filename){

};
//Desenha o objeto
Sprite.prototype.desenha = function(){

};





////////////////////////////////////////////////////////////////
//Classe para gerenciar o personagem principal
////////////////////////////////////////////////////////////////

SpritePrincipal.prototype = new Sprite();
SpritePrincipal.prototype.constructor = SpritePrincipal;
function SpritePrincipal() {

};
//Funcoes para acoes do personagem
SpritePrincipal.prototype.botaoDireita = function(){

};
SpritePrincipal.prototype.botaoEsquerda = function(){

};
SpritePrincipal.prototype.botaoCima = function(){

};
SpritePrincipal.prototype.botaoBaixo = function(){

};
SpritePrincipal.prototype.botaoAcao = function(){

};

////////////////////////////////////////////////////////////////

SpritePrincipal01.prototype = new Sprite();
SpritePrincipal01.prototype.constructor = SpritePrincipal01;
function SpritePrincipal01() {
	Sprite.prototype.load.call(this)
};
//Funcoes para acoes do personagem
SpritePrincipal01.prototype.botaoAcao = function(){

};
//Atualiza o estado do personagem
SpritePrincipal01.prototype.atualiza = function(){

};







////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//Classe para gerenciar criacao de objetos
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function SpriteFactory(){
	//Criando singleton
	if (arguments.callee._singletonInstance) {
		return arguments.callee._singletonInstance;
	}
	arguments.callee._singletonInstance = this;

	//Funcao que copia um objeto (shallow copy)
	this.copiaRasa(original){
		//Criando copia com prototype de original
	    var copia = Object.create( Object.getPrototypeOf( original ) ) ;

	    //Iterando por cada propriedade de original
	    var i , keys = Object.getOwnPropertyNames( original ) ;
	    for ( i = 0 ; i < keys.length ; i ++ )
	    {
	        //Copiando a propriedade para copia
	        Object.defineProperty( copia , keys[ i ] ,
	            Object.getOwnPropertyDescriptor( original , keys[ i ] )
	        ) ;
	    }

	    return copia;
	};

	//============================================================
	//============================================================

	//Carregar todas as classes finais de sprite
	this.SpritePrincipal01 = newSpritePrincipal01();
	this.SpritePrincipal01.carrega();

	//Funcoes de factory
	this.newSpritePrincipal = function(especificador){
		//especificador = int com numero da fase do personagem principal
		switch(especificador){
			case 1:
				return this.copiaRasa(this.SpritePrincipal01);
		}
	};
};




//# sourceURL=sprites.js