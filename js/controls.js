var Snake = Snake || {};

Snake.Controls = {};

Snake.Controls.addListeners = function(callback) {
	document.addEventListener('keydown', function (e) {
		var keyCode = e.keyCode;

		// ignore keyboard shortcuts
		if (e.shiftKey || e.metaKey || e.altKey || e.ctrlKey) { return; }

		e.preventDefault();

		switch (keyCode) {
			case 37: //during the game read only arrow keys or WASD
			case 65: callback('left');
				break;
			case 38:
			case 87: callback('up');
				break;
			case 39:
			case 68: callback('right');
				break;
			case 40:
			case 83: callback('down');
				break;
			case 77: callback('mute'); // M toggles mute
				break;
			case 80: callback('pause'); // P pauses the game
				break;
			default: // any key can start the game
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
