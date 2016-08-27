var Snake = Snake || {};

Snake.UI = {};

Snake.UI.showMainMenu = function() {
	console.log('Main Menu');
};

Snake.UI.initScore = function() {
	Snake.SCORE = 0;
};

Snake.UI.updateScore = function(n) {
	Snake.SCORE += n;
};

Snake.UI.paintScore = function() {
	Snake.CTX.fillStyle = '#ffffff';
	var scoreText = "Score: " + Snake.SCORE;
	Snake.CTX.fillText(scoreText, 30, Snake.CANVASH - 30);
	var lengthText = "Snake length: " + Snake.SNAKE.length;
	Snake.CTX.fillText(lengthText, 80, Snake.CANVASH - 30);
};

Snake.UI.refreshScore = function() {
	console.log('refreshScore');
};

Snake.UI.showEndGame = function() {
	console.log('Game Over');
};
