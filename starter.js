(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

//Definicao de constantes
gravidade = -2;


//(1 - Velocidade de movimento da camada intermediaria relativo ao personagem)
cenariospeed = 1 - 0.5;

window.viewport = {
	x: 0,
	y: 0,
	h: 576,
	w: 1024
};

carregado = false;

//Gatilhos de eventos
var canvas = document.getElementById("canvas");
canvas.addEventListener('keydown', doKeyDown, true);
canvas.addEventListener('keyup', doKeyUp, true);
canvas.addEventListener('click', click, false);
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
        case 37: Jogo().botaoEsquerda(true);break; 
        case 38: Jogo().botaoCima(true);break; 
        case 39: Jogo().botaoDireita(true);break; 
        case 40: Jogo().botaoBaixo(true);break; 
        case 13:                                //enter
		case 32: Jogo().botaoAcao(true);break;  //space
		case 80: Jogo().botaoPause(true);break; //p
        case 8:                                 //backspace
		case 27: Jogo().botaoVoltar(true);break;//esc
    }

}
function doKeyUp(e) {
    switch (e.keyCode) {
        case 37: Jogo().botaoEsquerda(false);break; 
        case 38: Jogo().botaoCima(false);break; 
        case 39: Jogo().botaoDireita(false);break; 
        case 40: Jogo().botaoBaixo(false);break; 
        case 13:                                 //enter
		case 32: Jogo().botaoAcao(false);break;  //space	
        case 80: Jogo().botaoPause(false);break; //p
        case 8:                                  //backspace
        case 27: Jogo().botaoVoltar(false);break;//esc
    }
}
function click(e){
    console.log(e.layerX - 160, e.layerY - 30);
    Jogo().click(e.layerX - 160, e.layerY - 30);
}
function hover(e){
    //console.log(e.layerX - 160, e.layerY - 30);
    Jogo().hover(e.layerX - 160, e.layerY - 30);
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

window.funcaoAtualiza = function(){
    Jogo().atualiza();
}


//Inicializador do jogo
canvas = document.getElementById('canvas').getContext('2d');
som = new Som();
spritef = new SpriteFactory(canvas);
fasef = new FaseFactory(canvas);
while(true){
    if(carregadoSprites){
        jogo = new Jogo(canvas);
        break;
    }
}
document.getElementById('canvas').focus()

//# sourceURL=starter.js