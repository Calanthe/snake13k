var Snake = Snake || {};

Snake.UI = {
	canvas: document.getElementById('c'),
	ctx: document.getElementById('c').getContext('2d'),

	cellSize: 20, //dimension of one cell

	pixels: [],
	pixelsPerCell: 4,

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

	Snake.UI.initPixels(state);
	Snake.UI.initSnakeCells();
	Snake.UI.initWallCells();

	this.font = Snake.Font;
};

Snake.UI.initPixels = function(state) {
	this.pixels = [];
	for (var x = 0; x < state.boardWidth * this.pixelsPerCell; x++) {
		this.pixels.push(new Array(state.boardHeight * this.pixelsPerCell));
	}
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
};

Snake.UI.initWallCells = function() {
	this.cells.wall = {
		// horizontal wall
		"__LR": this.cells.snakeHorizontal,
		"__L_": this.cells.snakeHorizontal,
		"___R": this.cells.snakeHeadLeft,
		"____": this.cells.snakeHeadLeft,

		// vertical wall
		"TB__": this.cells.snakeVertical,
		"T___": this.cells.snakeVertical,
		"_B__": this.cells.snakeHeadLeft,

		// corners
		"_B_R": this.cells.snakeHeadLeft,
		"_BL_": this.cells.snakeHorizontal,
		"T_L_": this.cells.snakeTopLeft,
		"T__R": this.cells.snakeVertical

	};
};

Snake.UI.showMainMenu = function() {
	this.ctx.fillStyle = this.wall;
	this.ctx.font = "50px monospace";
	var titleText = "Sn@Ķæ";
	this.ctx.fillText(titleText, 50, 60);
	this.ctx.font = "18px monospace";
	var subtitleText = "A game where glitch is a feature!";
	this.ctx.fillText(subtitleText, 50, 80);
	this.ctx.font = "18px monospace";
	subtitleText = "--Press [SPACE] to start--";
	this.ctx.fillText(subtitleText, 100, 300);
};

Snake.UI.paintScore = function(state) {
	var score = '' + state.score;
	var pad = "0000";
	var paddedScore = pad.substring(0, pad.length - score.length) + score;

	this.paintString(9, 7, paddedScore, state.mode === 'tron' ? this.snakeTron : this.wall);
	this.paintLine(9, 13, (state.boardWidth - (state.borderOffset.left + state.borderOffset.right)) * this.pixelsPerCell - 1, state.mode === 'tron' ? this.snakeTron : this.wall);
};

Snake.UI.showEndGame = function() {
	this.ctx.fillStyle = this.wall;
	this.ctx.font = "24px monospace";
	var subtitleText = "Game over ;(";
	this.ctx.fillText(subtitleText, 100, 260);
	this.ctx.font = "18px monospace";
	subtitleText = "--Press [SPACE] to start a new game--";
	this.ctx.fillText(subtitleText, 100, 300);
};

Snake.UI.paintBoard = function(state) {
	//paint the board
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	// paint pixels on whole screen
	for (var x = 0; x < state.boardWidth; x++) {
		for (var y = 0; y < state.boardHeight; y++) {
			this.paintCell(x, y, state.mode === 'tron' ? this.boardCellTron : this.boardCell, this.cells.full);
		}
	}

	document.body.className = state.mode;

	//paint the snake
	for (var i = 0; i < state.snake.length; i++) {
		var cell = state.snake[i];
		cellPixels = this.cells.snake[this.getSnakeCellType(i, state.snake)];
		this.paintCell(cell.x, cell.y, state.mode === 'tron' ? this.snakeTron : this.snake, cellPixels);
	}

	//paint the board
	for (x = 0; x < state.boardWidth; x++) {
		for (y = 0; y < state.boardHeight; y++) {
			cell = state.board[x][y];
			if (cell.type === 'wall') {
				var cellPixels = this.cells.wall[this.getWallCellType(x, y, state.board)];
				this.paintCell(x, y, state.mode === 'tron' ? this.wallTron : this.wall, cellPixels, cell.isGlitched);
			} else if (cell.type === 'food') {
				this.paintCell(x, y, state.mode === 'tron' ? this.foodTron : this.food, this.cells.food);
			} else if (cell.type === 'buggybug') {
				this.paintCell(x, y, state.mode === 'tron' ? this.bugTron : this.bug, this.cells.bug);
			}
		}
	}

	this.paintScore(state);

	this.glitchPixels();
	this.paintPixels();
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

Snake.UI.getWallCellType = function(x, y, board) {
	var top =    board[x]   && board[x][y-1] && board[x][y-1].type === 'wall';
	var bottom = board[x]   && board[x][y+1] && board[x][y+1].type === 'wall';
	var left =   board[x-1] && board[x-1][y] && board[x-1][y].type === 'wall';
	var right =  board[x+1] && board[x+1][y] && board[x+1][y].type === 'wall';

	return (top ? 'T' : '_') + (bottom ? 'B' : '_') + (left ? 'L' : '_') + (right ? 'R' : '_');
};

Snake.UI.paintCell = function(x, y, colour, cellPixels, isGlitched) {
	for (var i = 0; i < this.pixelsPerCell; i++) {
		for (var j = 0; j < this.pixelsPerCell; j++) {
			if (cellPixels[j][i] && (!isGlitched || Math.random() < 0.9)) {
				this.pixels[x * this.pixelsPerCell + i][y * this.pixelsPerCell + j] = colour;
			}
		}
	}
};

Snake.UI.paintLine = function(x, y, width, colour) {
	for (var i = 0; i < width; i++) {
		this.pixels[x + i][y] = colour;
	}
};

Snake.UI.paintCharacter = function(x, y, character, colour) {
	var characterPixels = this.font.font[character];
	if (characterPixels) {
		for (var i = 0; i < this.font.characterPixelsWidth; i++) {
			for (var j = 0; j < this.font.characterPixelsHeight; j++) {
				if (characterPixels[j][i]) {
					this.pixels[x + i][y + j] = colour;
				}
			}
		}
	}
};

Snake.UI.paintString = function(x, y, stringValue, colour) {
	for (var i = 0; i < stringValue.length; i++) { //iterate over string characters
		this.paintCharacter(x + (this.font.characterPixelsWidth + 1) * i, y, stringValue.charAt(i), colour);
	}
};

Snake.UI.glitchPixels = function() {
	var state = Snake.Game.state;

	for (var g = 0; g < state.level - 1; g++) {
		// glitch columns (simple shifting/pushing pixels around)
		var glitchOffset = Snake.Game.random(0, state.level - 1); // move by how many pixels
		var glitchWidth = Snake.Game.random(state.level, state.boardWidth * this.pixelsPerCell / 2);  // group of how many columns/rows to move
		var rand = Math.random(); // direction of move

		var column = Snake.Game.random(0, state.boardWidth * this.pixelsPerCell - 1 - glitchWidth); // which column to move

		for (var w = 0; w < glitchWidth; w++) {
			var x = column + w;
			for (var o = 0; o < glitchOffset; o++) {
				if (rand < 0.01) {
					var pixel = this.pixels[x].shift();
					this.pixels[x].push(pixel);
				} else if (rand > 0.99) {
					pixel = this.pixels[x][state.boardHeight * this.pixelsPerCell - 1];
					this.pixels[x].unshift(pixel);
				}
			}
		}

		// glitch rows (we need to move pixels between columns)
		glitchOffset = Snake.Game.random(0, state.level - 1);
		glitchWidth = Snake.Game.random(state.level, state.boardHeight * this.pixelsPerCell / 2);
		rand = Math.random();
		var row = Snake.Game.random(0, state.boardHeight * this.pixelsPerCell - 1 - glitchWidth);

		for (w = 0; w < glitchWidth; w++) {
			var y = row + w;
			for (o = 0; o < glitchOffset; o++) {
				if (rand < 0.01) {
					// move pixels left
					pixel = this.pixels[0][y];
					for (x = 0; x < this.pixels.length - 1; x++) {
						this.pixels[x][y] = this.pixels[x + 1][y];
					}
					this.pixels[this.pixels.length - 1][y] = pixel;
				}
				else if (rand > 0.99) {
					// move pixels right
					pixel = this.pixels[this.pixels.length - 1][y];
					for (x = this.pixels.length - 1; x > 0; x--) {
						this.pixels[x][y] = this.pixels[x - 1][y];
					}
					this.pixels[0][y] = pixel;
				}
			}
		}
	}
};

Snake.UI.paintPixels = function() {
	var pixelWidth = (this.cellSize - this.pixelsPerCell) / this.pixelsPerCell;
	var pixelSpacing = 1;
	if (Snake.Game.state.mode === 'tron') {
		pixelWidth += 1;
		pixelSpacing = 0;
	}
	var ctx = this.ctx;
	this.pixels.forEach(function(column, x) {
		column.forEach(function(pixel, y) {
			if (pixel) {
				ctx.fillStyle = pixel;
				ctx.fillRect(x * (pixelWidth + pixelSpacing), y * (pixelWidth + pixelSpacing), pixelWidth, pixelWidth);
			}
		});
	});

};
