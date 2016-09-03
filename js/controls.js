var Snake = Snake || {};

Snake.Controls = {};

Snake.Controls.addListeners = function(callback) {
	document.onkeydown = function (e) {
		var keyCode = e.keyCode;

		if (Snake.Game.state.state !== 'play') {
			if (Snake.Game.state.state === 'end') {
				Snake.Game.initNewGame();
			}
			Snake.Game.startNewGame();
		} else if (keyCode === 37) { //during the game read only arrow keys
			callback('left');
		} else if (keyCode === 38) {
			callback('up');
		} else if (keyCode === 39) {
			callback('right');
		} else if (keyCode === 40) {
			callback('down');
		}
	};
};
