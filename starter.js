(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

//Definicao de constantes
gravidade = -2;
velocidadeTerminal = 20;


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
    //console.log(e.layerX - 160, e.layerY - 30);
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
    //var margemErro = (velocidadeTerminal) / 2 + 1;
    var margemErroYDentro = 1;
    var margemErroYFora = 25;
    var margemErroXDentro = 10;
    var margemErroXFora = 20;

    //Se em alcance vertical
    if(pos1.y <= pos2.y && pos2.y < pos1.y + pos1.h ||
       pos2.y <= pos1.y && pos1.y < pos2.y + pos2.h){
        //dir com esq
        if(pos1.x + pos1.w <= pos2.x + margemErroXFora &&
           pos1.x + pos1.w >= pos2.x - margemErroXDentro){
            colisao.um.dir = colisao.dois.esq = true;
            //Arredondamento de posicao (margem de erro)
            if(sprite1.movel){
                var variacao = (pos2.x - pos1.w) - sprite1.pos.x;
                sprite1.pos.x += variacao;
                if(sprite1.moveCamera){
                    viewport.x += variacao;
                }
            }
            else{
                var variacao = (pos1.x + pos1.w) - sprite2.pos.x;
                sprite2.pos.x += variacao;
                if(sprite2.moveCamera){
                    viewport.x += variacao;
                }
            }
        }
        //esq com dir
        else if(pos2.x + pos2.w <= pos1.x + margemErroXFora &&
                pos2.x + pos2.w >= pos1.x - margemErroXDentro){
            colisao.um.esq = colisao.dois.dir = true;
            if(sprite1.movel){
                var variacao = (pos2.x + pos2.w) - sprite1.pos.x;
                sprite1.pos.x += variacao;
                if(sprite1.moveCamera){
                    viewport.x += variacao;
                }
            }
            else{
                var variacao = (pos1.x - pos2.w) - sprite2.pos.x;
                sprite2.pos.x += variacao;
                if(sprite2.moveCamera){
                    viewport.x += variacao;
                }
            }
        }
    }
    var pos1 = sprite1.getPosAtual();
    var pos2 = sprite2.getPosAtual();
    //Se em alcance horizontal
    if(pos1.x <= pos2.x && pos2.x < pos1.x + pos1.w ||
       pos2.x <= pos1.x && pos1.x < pos2.x + pos2.w){
        //cim com bxo
        if(pos1.y + pos1.h <= pos2.y + margemErroYFora &&
           pos1.y + pos1.h >= pos2.y - margemErroYDentro){
            colisao.um.cim = colisao.dois.bxo = true;
            if(sprite1.movel){
                var variacao = (pos2.y - pos1.h) - sprite1.pos.y;
                sprite1.pos.y += variacao;
                if(sprite1.moveCamera){
                    viewport.y += variacao;
                }
            }
            else{
                var variacao = (pos1.y + pos1.h) - sprite2.pos.y;
                sprite2.pos.y += variacao;
                if(sprite2.moveCamera){
                    viewport.y += variacao;
                }
            }
        }
        //bxo com cim
        else if(pos2.y + pos2.h <= pos1.y + margemErroYFora &&
                pos2.y + pos2.h >= pos1.y - margemErroYDentro){
            colisao.um.bxo = colisao.dois.cim = true; 
            if(sprite1.movel){
                var variacao = (pos2.y + pos2.h) - sprite1.pos.y;
                sprite1.pos.y += variacao;
                if(sprite1.moveCamera){
                    viewport.y += variacao;
                }
            }
            else{
                var variacao = (pos1.y - pos2.h) - sprite2.pos.y;
                sprite2.pos.y += variacao;
                if(sprite2.moveCamera){
                    viewport.y += variacao;
                }
            }
        }
    }

    sprite1.colisao["dir"] |= colisao["um"]["dir"];
    sprite1.colisao["esq"] |= colisao["um"]["esq"];
    sprite1.colisao["cim"] |= colisao["um"]["cim"];
    sprite1.colisao["bxo"] |= colisao["um"]["bxo"];
    sprite2.colisao["dir"] |= colisao["dois"]["dir"];
    sprite2.colisao["esq"] |= colisao["dois"]["esq"];
    sprite2.colisao["cim"] |= colisao["dois"]["cim"];
    sprite2.colisao["bxo"] |= colisao["dois"]["bxo"];
    sprite2.hp -= sprite1.dano(colisao["um"]);
    sprite1.hp -= sprite2.dano(colisao["dois"]);

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
