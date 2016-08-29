var Snake = Snake || {};

Snake.UI = {
	canvas: document.getElementById('c'),
	ctx: document.getElementById('c').getContext('2d'),

	cellSize: 21 //dimension of one cell
};

Snake.UI.init = function(state) {
	this.canvas.width = state.boardWidth * this.cellSize;
	this.canvas.height = state.boardHeight * this.cellSize;
};

Snake.UI.showMainMenu = function() {
	// TODO
	console.log('Main Menu');
};

Snake.UI.paintScore = function(state) {
	this.ctx.fillStyle = '#ffffff';
	var scoreText = "Score: " + state.score;
	this.ctx.fillText(scoreText, 30, this.canvas.height - 30);
	var lengthText = "Snake length: " + state.snake.length;
	this.ctx.fillText(lengthText, 80, this.canvas.height - 30);
};

Snake.UI.showEndGame = function() {
	// TODO
	console.log('Game Over');
};

Snake.UI.paintBoard = function(state) {
	//paint the board
	//TODO move colour variables to the UI module
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	// paint pixels on whole screen
	for (var i = 0; i < state.boardWidth; i++) {
		for (var j = 0; j < state.boardHeight; j++) {
			// TODO: special tron background? bigger squares? only blue lines?
			this.paintCell(i, j, state.isGlitched ? 'rgba(0,0,255,0.2)' : 'rgba(0,0,0,0.05)', true);
		}
	}

	// FIXME: quick and dirty tron mode prototype
	if (state.isGlitched) {
		document.body.className = 'tron';
	}
	else {
		document.body.className = '';
	}

	//paint the walls
	for (i = 0; i < state.walls.length; i++) {
		var cell = state.walls[i];
		this.paintCell(cell.x, cell.y, state.isGlitched ? 'yellow' : 'rgba(0,0,0,0.7)');
	}

	//paint the snake
	for (i = 0; i < state.snake.length; i++) {
		cell = state.snake[i];
		this.paintCell(cell.x, cell.y, state.isGlitched ? 'cyan' : 'rgba(0,0,0,0.7)');
	}

	//paint the food
	this.paintCell(state.food.x, state.food.y, 'rgba(255,0,0,0.7)');

	//paint the buggy bug
	if (state.bug) {
		this.paintCell(state.bug.x, state.bug.y, 'rgba(255,255,255,0.7)');
	}
};

Snake.UI.paintCell = function(x, y, colour, forcePaint) {
	// FIXME: decide on one paint mode and use it
	var mode = document.querySelector('[name=paintMode]:checked').value || 'big';

	var pixelWidth = mode === 'big' ? this.cellSize - 2 : (this.cellSize - 6) / 3;

	this.ctx.fillStyle = colour;

	if (mode === 'big') {
		this.ctx.fillRect(x * this.cellSize + 1, y * this.cellSize + 1, pixelWidth, pixelWidth);
	}
	else {
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				// if paint mode is 'glitched' hide random pixels
				if (mode === 'small' || forcePaint || Math.random() < 0.995) {
					this.ctx.fillRect(x * this.cellSize + 1 + i * (pixelWidth + 2), y * this.cellSize + 1 + j * (pixelWidth + 2), pixelWidth, pixelWidth);
				}
			}
		}
	}
};
