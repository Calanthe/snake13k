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
	}
};

Snake.UI.init = function(state) {
	this.canvas.width = state.boardWidth * this.cellSize;
	this.canvas.height = state.boardHeight * this.cellSize;

	Snake.UI.initSnakeCells();
	console.log(this.cells.snake);
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
	//TODO move colour variables to the UI module
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	// paint pixels on whole screen
	for (var i = 0; i < state.boardWidth; i++) {
		for (var j = 0; j < state.boardHeight; j++) {
			// TODO: special tron background? bigger squares? only blue lines?
			this.paintCell(i, j, state.isGlitched ? 'rgba(0,0,255,0.2)' : 'rgba(0,0,0,0.05)', true, this.cells.full);
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
		this.paintCell(cell.x, cell.y, state.isGlitched ? 'yellow' : 'rgba(0,0,0,0.7)', false, this.cells.snakeHeadLeft);
	}

	//paint the snake

	for (i = 0; i < state.snake.length; i++) {
		cell = state.snake[i];
		var cellPixels = this.cells.snake[ this.getSnakeCellType(i, state.snake)];
		console.log(this.getSnakeCellType(i, state.snake), cellPixels);
		this.paintCell(cell.x, cell.y, state.isGlitched ? 'cyan' : 'rgba(0,0,0,0.7)', false, cellPixels);
	}


	//paint the food
	this.paintCell(state.food.x, state.food.y, state.isGlitched ? 'red' : 'rgba(0,0,0,0.7)', false, this.cells.food);

	//paint the buggy bug
	if (state.bug) {
		this.paintCell(state.bug.x, state.bug.y, state.isGlitched ? 'white' : 'rgba(0,0,0,0.7)', false, this.cells.bug);
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
