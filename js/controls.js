var Snake = Snake || {};

Snake.Controls = {};

Snake.Controls.addListeners = function(callback) {
	document.addEventListener('keydown', function (e) {
		var keyCode = e.keyCode;

		// ignore keyboard shortcuts
		if (e.shiftKey || e.metaKey || e.altKey || e.ctrlKey) { return; }

		e.preventDefault();

		if (keyCode === 37 || keyCode === 65) { //during the game read only arrow keys or WASD
			callback('left');
		} else if (keyCode === 38 || keyCode === 87) {
			callback('up');
		} else if (keyCode === 39 || keyCode === 68) {
			callback('right');
		} else if (keyCode === 40 || keyCode === 83) {
			callback('down');
		} else if (keyCode === 77) { // M toggles mute
			callback('mute');
		} else if (keyCode === 80) { // P pauses the game
			callback('pause');
		} else if (keyCode) { // any key can start the game
			callback('start');
		}
	});

	if (Snake.MOBILE) {
		document.getElementById('s').addEventListener("touchstart", function() {
			callback('pause');
		}, false);
	}

	// pause when page is hidden
	document.addEventListener('visibilitychange', function(){
		if (document.hidden) {
			callback('pause');
		}
	});

	document.ontouchstart = function(e) {
		var action = e.target.dataset.action;
		if (action) {
			e.target.classList.add('active');

			if (window.navigator.vibrate) {
				window.navigator.vibrate(50);
			}

			callback(action);
			e.preventDefault();
		}
	};

	document.ontouchend = function(e) {
		e.target.classList.remove('active');
	};

};
