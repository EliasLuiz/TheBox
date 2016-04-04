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
function doKeyDown(e) {

alert( e.keyCode );
switch (e.keyCode) {
        case 37,38,39,40,32,80,27: console.log("vish " + e.keyCode); kDown(true,e.keyCode); break; //Left key
        // case 38: alert("Up"); kDown(true); break; //Up key
        // case 39: alert("Right"); kDown(true); break; //Right key
        // case 40: alert("Down"); kDown(true); break; //Down key
		// case 32: alert("Action"); kDown(true); break; //Down key
		// case 80: alert("Pause"); kDown(true); break; //Down key
		// case 27: alert("Esc"); kDown(true); break; //Down key
        default: alert(e.keyCode); //Everything else
    }

}
function doKeyUp(e) {

alert( e.keyCode )
switch (e.keyCode) {
        case 37,38,39,40,32,80,27: console.log("parou " + e.keyCode); kDown(false,e.keyCode); break; //Left key
        // case 38: alert("Up"); upDownDown=false; break; //Up key
        // case 39: alert("Right"); rightDown=false; break; //Right key
        // case 40: alert("Down"); downDown=false; break; //Down key
		// case 32: alert("Action"); actionDown=false; break; //Down key
		// case 80: alert("Pause"); pauseDown=false; break; //Down key
		// case 27: alert("Esc"); escDown=false; break; //Down key
        default: console.log("erroooou! "+ e.keyCode);icq(); //Everything else
    }
}


//# sourceURL=starter.js