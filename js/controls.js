var Snake = Snake || {};

Snake.Controls = {};

Snake.Controls.addListeners = function(callback) {
	document.onkeydown = function (e) {
		var keyCode = e.keyCode;
		if (keyCode == 37) {
			callback('left');
		}
		else if (keyCode == 38) {
			callback('up');
		}
		else if (keyCode == 39) {
			callback('right');
		}
		else if (keyCode == 40) {
			callback('down');
		}
	};
};
