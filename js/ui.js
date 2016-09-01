var Snake = Snake || {};

Snake.UI = {
	canvas: document.getElementById('c'),
	ctx: document.getElementById('c').getContext('2d'),

	cellSize: 20, //dimension of one cell

	cells: {
		full: [
			[1,1,1,1],
			[1,1,1,1],
			[1,1,1,1],
			[1,1,1,1]
		],
		food: [
			[0,0,0,0],
			[0,0,1,0],
			[0,1,0,1],
			[0,0,1,0]
		],
		bug: [
			[0,0,0,0],
			[0,1,0,1],
			[0,0,1,0],
			[0,1,0,1]
		],
		snakeHeadRight: [
			[0,0,0,0],
			[1,1,1,0],
			[1,1,1,0],
			[1,1,1,0]
		],
		snakeHeadLeft: [
			[0,0,0,0],
			[0,1,1,1],
			[0,1,1,1],
			[0,1,1,1]
		],
		snakeHeadTop: [
			[0,1,1,1],
			[0,1,1,1],
			[0,1,1,1],
			[0,0,0,0]
		],
		snakeVertical: [
			[0,1,1,1],
			[0,1,1,1],
			[0,1,1,1],
			[0,1,1,1]
		],
		snakeHorizontal: [
			[0,0,0,0],
			[1,1,1,1],
			[1,1,1,1],
			[1,1,1,1]
		],
		snakeTopLeft: [
			[0,1,1,1],
			[1,1,1,1],
			[1,1,1,1],
			[1,1,1,1]
		],
		snakeBottomRight: [
			[0,0,0,0],
			[0,1,1,1],
			[0,1,1,1],
			[0,1,1,1]
		]
	},

	//colors
	boardCellTron: 'rgba(0,0,255,0.2)',
	boardCell: 'rgba(0,0,255,0.05)',
	wallTron: 'yellow',
	foodTron: 'red',
	bugTron: 'white',
	wall: 'rgba(0,0,0,0.7)',
	food: 'rgba(0,0,0,0.7)',
	bug: 'rgba(0,0,0,0.7)',
	snakeTron: 'cyan',
	snake: 'rgba(0,0,0,0.7)'
};

Snake.UI.init = function(state) {
	this.canvas.width = state.boardWidth * this.cellSize;
	this.canvas.height = state.boardHeight * this.cellSize;

	Snake.UI.initSnakeCells();
};

Snake.UI.initSnakeCells = function() {
	this.cells.snake = {
		// head and tail
		"_T": this.cells.snakeHeadTop,
		"_B": this.cells.snakeBottomRight,
		"T_": this.cells.snakeHeadTop,
		"B_": this.cells.snakeBottomRight,

		"_L": this.cells.snakeHeadRight,
		"_R": this.cells.snakeBottomRight,
		"L_": this.cells.snakeHeadRight,
		"R_": this.cells.snakeBottomRight,

		// body
		"BT": this.cells.snakeVertical,
		"TB": this.cells.snakeVertical,
		"LR": this.cells.snakeHorizontal,
		"RL": this.cells.snakeHorizontal,

		// body when moving through board edges
		"TT": this.cells.snakeVertical,
		"BB": this.cells.snakeVertical,
		"RR": this.cells.snakeHorizontal,
		"LL": this.cells.snakeHorizontal,

		// body corners
		"TR": this.cells.snakeVertical,
		"RT": this.cells.snakeVertical,
		"LB": this.cells.snakeHorizontal,
		"BL": this.cells.snakeHorizontal,

		"TL": this.cells.snakeTopLeft,
		"LT": this.cells.snakeTopLeft,
		"BR": this.cells.snakeBottomRight,
		"RB": this.cells.snakeBottomRight
	};
},


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
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	// paint pixels on whole screen
	for (var i = 0; i < state.boardWidth; i++) {
		for (var j = 0; j < state.boardHeight; j++) {
			// TODO: special tron background? bigger squares? only blue lines?
			this.paintCell(i, j, state.mode === 'tron' ? this.boardCellTron : this.boardCell, true, this.cells.full);
		}
	}

	// FIXME: quick and dirty tron mode prototype
	document.body.className = state.mode;

	//paint the board
	for (var i = 0; i < state.boardWidth; i++) {
		for (var j = 0; j < state.boardHeight; j++) {
			var cell = state.board[i][j];
			if (cell.type === 'wall') {
				this.paintCell(i, j, state.mode === 'tron' ? this.wallTron : this.wall, false, this.cells.snakeHeadLeft);
			} else if (cell.type === 'food') {
				this.paintCell(i, j, state.mode === 'tron' ? this.foodTron : this.food, false, this.cells.food);
			} else if (cell.type === 'buggybug') {
				this.paintCell(i, j, state.mode === 'tron' ? this.bugTron : this.bug, false, this.cells.bug);
			}
		}
	}

	//paint the snake
	for (i = 0; i < state.snake.length; i++) {
		cell = state.snake[i];
		var cellPixels = this.cells.snake[this.getSnakeCellType(i, state.snake)];
		this.paintCell(cell.x, cell.y, state.mode === 'tron' ? this.snakeTron : this.snake, false, cellPixels);
	}
};

Snake.UI.getSnakeCellType = function(i, snake) {
	var cell = snake[i];
	var prev = snake[i-1];
	var next = snake[i+1];

	var type = ""; // _ = none (tail/head), T = top, B = bottom, R = right, L = left

	if (prev) {
		if (prev.x === cell.x) {
			type += (prev.y > cell.y) ? "B" : "T";
		}
		else { // prev.y === cell.y
			type += (prev.x > cell.x) ? "R" : "L";
		}
	}
	else {
		type += "_";
	}

	if (next) {
		if (next.x === cell.x) {
			type += (next.y > cell.y) ? "B" : "T";
		}
		else { // prev.y === cell.y
			type += (next.x > cell.x) ? "R" : "L";
		}
	}
	else {
		type += "_";
	}

	return type;
};

Snake.UI.paintCell = function(x, y, colour, forcePaint, cellPixels) {
	// FIXME: decide on one paint mode and use it
	var mode = document.querySelector('[name=paintMode]:checked').value || 'big';

	var pixelWidth = mode === 'big' ? this.cellSize - 1 : (this.cellSize - 4) / 4;

	this.ctx.fillStyle = colour;

	if (mode === 'big') {
		this.ctx.fillRect(x * this.cellSize, y * this.cellSize, pixelWidth, pixelWidth);
	}
	else {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				// if paint mode is 'glitched' hide random pixels
				if (forcePaint || ((mode === 'small' || Math.random() < 0.995) && cellPixels[j][i])) {
					this.ctx.fillRect(x * this.cellSize + i * (pixelWidth + 1), y * this.cellSize+ j * (pixelWidth + 1), pixelWidth, pixelWidth);
				}
			}
		}
	}
};
