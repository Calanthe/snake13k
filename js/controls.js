var Snake = Snake || {};

Snake.Controls = {};

Snake.Controls.addListeners = function(callback) {
	document.onkeydown = function (e) {
		var keyCode = e.keyCode;
		if (keyCode == 37 && Snake.DIRECTION !== 'right') {
			callback('left');
		}
		else if (keyCode == 38 && Snake.DIRECTION !== 'down') {
			callback('up');
		}
		else if (keyCode == 39 && Snake.DIRECTION !== 'left') {
			callback('right');
		}
		else if (keyCode == 40 && Snake.DIRECTION !== 'up') {
			callback('down');
		}
	};
};