var Snake = Snake || {};

Snake.UI = {};

Snake.UI.showMainMenu = function() {
	console.log('Main Menu');
};

// FIXME: UI should not update score, just display it
Snake.UI.initScore = function() {
	Snake.Game.state.score = 0;
};

Snake.UI.updateScore = function(n) {
	Snake.Game.state.score += n;
};

Snake.UI.paintScore = function() {
	Snake.CTX.fillStyle = '#ffffff';
	var scoreText = "Score: " + Snake.Game.state.score;
	Snake.CTX.fillText(scoreText, 30, Snake.CANVASH - 30);
	var lengthText = "Snake length: " + Snake.Game.state.snake.length;
	Snake.CTX.fillText(lengthText, 80, Snake.CANVASH - 30);
};

Snake.UI.refreshScore = function() {
	console.log('refreshScore');
};

Snake.UI.showEndGame = function() {
	console.log('Game Over');
};
