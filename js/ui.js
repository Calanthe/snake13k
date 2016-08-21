var Snake = Snake || {};

Snake.UI = {};

Snake.UI.showMainMenu = function() {
	console.log('Main Menu');
};

Snake.UI.initScore = function() {
	Snake.SCORE = 0;
};

Snake.UI.updateScore = function() {
	Snake.SCORE++;
};

Snake.UI.paintScore = function() {
	var scoreText = "Score: " + Snake.SCORE;
	Snake.CTX.fillText(scoreText, 30, Snake.CANVASH - 30);
};

Snake.UI.refreshScore = function() {
	console.log('refreshScore');
};

Snake.UI.showEndGame = function() {
	console.log('Game Over');
};