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
	Snake.Renderer.ctx.fillStyle = '#ffffff';
	var scoreText = "Score: " + Snake.Game.state.score;
	Snake.Renderer.ctx.fillText(scoreText, 30, Snake.Renderer.canvasHeight - 30);
	var lengthText = "Snake length: " + Snake.Game.state.snake.length;
	Snake.Renderer.ctx.fillText(lengthText, 80, Snake.Renderer.canvasHeight - 30);
};

Snake.UI.refreshScore = function() {
	console.log('refreshScore');
};

Snake.UI.showEndGame = function() {
	console.log('Game Over');
};
