//Inicializando singletons
spritef = new SpriteFactory();
som = new Som();

//Inicializador do jogo
canvas = document.getElementById('canvas').getContext('2d');
jogo = new Jogo(canvas);

//Gatilhos de eventos

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

//# sourceURL=starter.js