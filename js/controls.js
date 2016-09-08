var Snake = Snake || {};

Snake.Controls = {};

Snake.Controls.addListeners = function(callback) {
	document.addEventListener('keydown', function (e) {
		var keyCode = e.keyCode;

		// ignore keyboard shortcuts
		if (e.shiftKey || e.metaKey || e.altKey || e.ctrlKey) { return; }

		e.preventDefault();

		if (keyCode === 37) { //during the game read only arrow keys
			callback('left');
		} else if (keyCode === 38) {
			callback('up');
		} else if (keyCode === 39) {
			callback('right');
		} else if (keyCode === 40) {
			callback('down');
		} else if (keyCode === 80) { // P pauses the game
			callback('pause');
		} else if (keyCode) { // any key can start the game
			callback('start');
		}
	});

	// pause when page is hidden
	document.addEventListener('visibilitychange', function(){
		if (document.hidden) {
			callback('pause');
		}
	});
};
