//Definicao de constantes
gravidade = -10;


//(1 - Velocidade de movimento da camada intermediaria relativo ao personagem)
cenariospeed = 1 - 0.5;

viewport = {
	x: 0,
	y: 0,
	h: 400,
	w: 500
};

//Inicializador do jogo
canvas = document.getElementById('canvas').getContext('2d');
spritef = new SpriteFactory(canvas, function(){
    jogo = new Jogo(canvas);
});
som = new Som();



//Gatilhos de eventos

var canvas = document.getElementById("canvas");
canvas.addEventListener('keydown', doKeyDown, true);
canvas.addEventListener('keyup', doKeyUp, true);
//Outras funcoes
function LoadJSON(filename, callback){
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType("application/json");
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		    callback(JSON.parse(xmlhttp.responseText));
		}
	};
	xmlhttp.open("GET", filename, false);
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


function Colisao(sprite1, sprite2){
    var colisao = {
        um: {
            dir: false,
            esq: false,
            cim: false,
            bxo: false
        },
        dois: {
            dir: false,
            esq: false,
            cim: false,
            bxo: false
        }
    };

    var pos1 = sprite1.getPosAtual();
    var pos2 = sprite2.getPosAtual();

    //Margem de erro para igualdade
    //Menor -> mais preciso vel. baixas, mais erros em vel. altas
    var margemErro = 10;

    //Se em alcance vertical
    if(pos1.y >= pos2.y - pos2.h ||
       pos1.y - pos1.h <= pos2.y){
        //dir com esq
        if(pos1.x + pos1.w <= pos2.x + margemErro &&
           pos1.x + pos1.w >= pos2.x - margemErro)
            colisao.um.dir = colisao.dois.esq = true;
        //esq com dir
        else if(pos1.x <= pos2.x + pos2.w + margemErro &&
                pos1.x >= pos2.x + pos2.w - margemErro)
            colisao.um.esq = colisao.dois.dir = true;
    }
    //Se em alcance horizontal
    if(pos1.x + pos1.w >= pos2.x ||
       pos1.x <= pos2.x + pos2.w){
        //cim com bxo
        if(pos1.y >= pos2.y - pos2.h + margemErro &&
           pos1.y <= pos2.y - pos2.h - margemErro)
            colisao.um.cim = colisao.dois.bxo = true;
        //bxo com cim
        else if(pos1.y - pos1.h <= pos2.y + margemErro &&
                pos1.y - pos1.h >= pos2.y - margemErro)
            colisao.um.bxo = colisao.dois.cim = true;
    }

    return colisao;
};

//# sourceURL=starter.js