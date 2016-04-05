//Inicializando singletons
// spritef = new SpriteFactory();
// som = new Som();

//Inicializador do jogo
// canvas = document.getElementById('canvas').getContext('2d');
// jogo = new Jogo(canvas);

//Gatilhos de eventos

var canvas = document.getElementById("canvas");
canvas.addEventListener('keydown', doKeyDown, true);
canvas.addEventListener('keyup', doKeyUp, true);
//Outras funcoes
function LoadJSON(filename, callback){
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		    callback(JSON.parse(xmlhttp.responseText));
		}
	};
	xmlhttp.open("GET", filename, true);
	xmlhttp.send();
};
function doKeyDown(e) {
switch (e.keyCode) {
        case 37: botaoEsquerda(true);break; 
        case 38: botaoCima(true);break; 
        case 39: botaoDireita(true);break; 
        case 40: botaoBaixo(true);break; 
		case 32: botaoAcao(true);break; //space
		case 80: botaoPause();break; //p
		case 27: botaoVoltar();break;//esc
        default: console.log("erroooou1! "+ e.keyCode);break; //Everything else
    }

}
function doKeyUp(e) {
switch (e.keyCode) {
        case 37: botaoEsquerda(false);break; 
        case 38: botaoCima(false);break; 
        case 39: botaoDireita(false);break; 
        case 40: botaoBaixo(false);break; 
		case 32: botaoAcao(false);break; //space		
        default: console.log("erroooou2! "+ e.keyCode);break; //Everything else
    }
}


//# sourceURL=starter.js