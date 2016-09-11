var Snake = Snake || {};

Snake.UI = {
	canvas: document.getElementById('c'),
	ctx: document.getElementById('c').getContext('2d'),

	bgCanvas: document.getElementById('bg'),
	bgCtx: document.getElementById('bg').getContext('2d'),

	buttons: document.getElementById("buttons"),
	body: document.body,

	cellSize: 20, // dimension of one cell

	iconLink: null, // <link> element for favicon
	icons: {}, // icons generated from canvas for each mode

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
			[       ],
			[ , ,1  ],
			[ ,1, ,1],
			[ , ,1  ]
		],
		bug1Left: [
			[ ,1,1  ],
			[ ,1,1  ],
			[ , ,1,1],
			[ , , , ]
		],
		bug1Right: [
			[ ,1    ],
			[1,1,1  ],
			[1,1,1,1],
			[1, ,1  ]
		],
		bug2Left: [
			[ , , , ],
			[ ,1, , ],
			[ ,1, ,1],
			[ , ,1,1]
		],
		bug2Right: [
			[ ,1,1  ],
			[1,1, ,1],
			[1,1,1,1],
			[1,1,1,1]
		],
		bug3Left: [
			[       ],
			[ ,1    ],
			[ ,1,1,1],
			[ , ,1  ]
		],
		bug3Right: [
			[       ],
			[       ],
			[1,1,1,1],
			[1, ,1  ]
		],
		bug4Left: [
			[ , , ,1],
			[ ,1,1,1],
			[ ,1, ,1],
			[ ,1, ,1]
		],
		bug4Right: [
			[1,1    ],
			[1,1,1,1],
			[1,1, ,1],
			[ ,1, ,1]
		],
		bug5Left: [
			[ , ,1  ],
			[ ,1, ,1],
			[ ,1,1,1],
			[ , , ,1]
		],
		bug5Right: [
			[1      ],
			[1,1    ],
			[1,1,1,1],
			[ ,1    ]
		],
		snakeHeadRight: [
			[       ],
			[1,1,1  ],
			[1,1,1  ],
			[1,1,1  ]
		],
		snakeHeadLeft: [
			[       ],
			[ ,1,1,1],
			[ ,1,1,1],
			[ ,1,1,1]
		],
		snakeHeadTop: [
			[ ,1,1,1],
			[ ,1,1,1],
			[ ,1,1,1],
			[ , , , ]
		],
		snakeVertical: [
			[ ,1,1,1],
			[ ,1,1,1],
			[ ,1,1,1],
			[ ,1,1,1]
		],
		snakeHorizontal: [
			[       ],
			[1,1,1,1],
			[1,1,1,1],
			[1,1,1,1]
		],
		snakeTopLeft: [
			[ ,1,1,1],
			[1,1,1,1],
			[1,1,1,1],
			[1,1,1,1]
		],
		snakeBottomRight: [
			[       ],
			[ ,1,1,1],
			[ ,1,1,1],
			[ ,1,1,1]
		]
	},

	//colors
	boardCellTron: 0, // don't draw anything, as background is in CSS (was 'rgba(0,0,255,0.2)'),
	boardCell: 'rgba(0,0,255,0.05)',
	wallTron: 'rgb(255,255,0)',
	foodTron: 'rgb(255,0,0)',
	bugTron: 'rgb(255,255,255)',
	wall: 'rgba(0,0,0,0.7)',
	food: 'rgba(0,0,0,0.7)',
	bug: 'rgba(0,0,0,0.7)',
	snakeTron: 'rgb(0,255,255)',
	snake: 'rgba(0,0,0,0.7)'
};

Snake.UI.init = function(state) {
	this.canvas.width = state.boardWidth * this.cellSize;
	this.canvas.height = state.boardHeight * this.cellSize;

	this.bgCanvas.width = state.boardWidth * this.cellSize;
	this.bgCanvas.height = state.boardHeight * this.cellSize;

	this.initFavicons(state.mode);
	this.initPixels(state);
	this.initSnakeCells();
	this.initWallCells();

	this.paintBG(state);

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
		"__": this.cells.snakeHeadLeft, // single cell snake
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

Snake.UI.showMainMenu = function(state) {
	this.paintString(60, 60, 'SnAkE', this.wall);
	// TODO: show it after some time?
	if (state.showHint) {
		this.paintString(Snake.MOBILE ? 29 : 35, 70, Snake.MOBILE ? 'touch any button' : 'press any key', this.wall);
	}
	this.paintString(9, 113, 'js13k 2016 intuitio bartaz', this.wall);
};

Snake.UI.paintScore = function(state) {
	var paddedScore = this.addPad(state.score, '0000');

	var buggyBugOnBoard = Snake.Game.findBuggyBugOnBoard();

	this.paintString(9, 7, paddedScore, state.mode === 'tron' ? this.snakeTron : this.wall);

	paddedScore = this.addPad(state.hiscore, '0000');
	this.paintString(47, 7, 'HI ' + paddedScore, state.mode === 'tron' ? this.snakeTron : this.wall);

	if (buggyBugOnBoard.length === 2) {
		// paint two parts of buggy bug in the top right corner
		this.paintCell(24, 2, state.mode === 'tron' ? this.bugTron : this.bug, this.cells[buggyBugOnBoard[0].body]);
		this.paintCell(25, 2, state.mode === 'tron' ? this.bugTron : this.bug, this.cells[buggyBugOnBoard[1].body]);
	}

	if (state.buggyBugTimeLeft !== -1) {
		// paint also remaining time
		var paddedTimeLeft = this.addPad(state.buggyBugTimeLeft, '00');
		this.paintString(105, 7, '' + paddedTimeLeft, this.wall);
	}

	if (state.mode === 'tron') {
		this.paintString(97, 7, 'TRON', this.wallTron);
	}

	this.paintLine(9, 13, (state.boardWidth - (state.borderOffset.left + state.borderOffset.right)) * this.pixelsPerCell - 1, state.mode === 'tron' ? this.snakeTron : this.wall);
};

Snake.UI.addPad = function(number, pad) {
	var string = '' + number;
	return pad.substring(0, pad.length - string.length) + string;
};

Snake.UI.showEndGame = function(state) {
	var color =  state.mode === 'tron' ? this.wallTron : this.wall;
	this.paintString(11, 60, '        GAME OVER         ', color);
	if (state.showHint) {
		this.paintString(Snake.MOBILE ? 29 : 35, 70, Snake.MOBILE ? 'touch any button' : 'press any key', color);
	}
};

Snake.UI.showPause = function(state) {
	this.paintString(11, 60, '          PAUSE           ', state.mode === 'tron' ? this.snakeTron : this.wall);
};

Snake.UI.paintBG = function(state) {
	// paint pixels on whole screen
	var pixelWidth = (this.cellSize - this.pixelsPerCell) / this.pixelsPerCell;
	var pixelSpacing = 1;
	var ctx = this.bgCtx;
	for (var x = 0; x < state.boardWidth * this.pixelsPerCell; x++) {
		for(var y = 0; y < state.boardHeight * this.pixelsPerCell; y++) {
			ctx.fillStyle = this.boardCell;
			ctx.fillRect(x * (pixelWidth + pixelSpacing), y * (pixelWidth + pixelSpacing), pixelWidth, pixelWidth);
		}
	}
};

Snake.UI.paint = function(state) {
	this.updateFavicon(state.mode);

	// paint the board
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	// reset pixels matrix
	this.initPixels(state);

	this.paintScore(state);

	if (this.body.className !== state.mode) {
		this.body.className = state.mode;
	}

	if (Snake.MOBILE && !(state.showHint === this.buttons.classList.contains("hint"))) {
		this.buttons.classList[state.showHint ? "add" : "remove"]("hint");
	}

	//paint the snake
	for (var i = 0; i < state.snake.length; i++) {
		var cell = state.snake[i];
		cellPixels = this.cells.snake[this.getSnakeCellType(i, state.snake)];
		this.paintCell(cell.x, cell.y, state.mode === 'tron' ? this.snakeTron : this.snake, cellPixels, cell.isGlitched);
	}

	//paint the board
	for (var x = 0; x < state.boardWidth; x++) {
		for (var y = 0; y < state.boardHeight; y++) {
			cell = state.board[x][y];
			if (cell.type === 'wall') {
				var cellPixels = this.cells.wall[this.getWallCellType(x, y, state.board)];
				this.paintCell(x, y, state.mode === 'tron' ? this.wallTron : this.wall, cellPixels, cell.isGlitched);
			} else if (cell.type === 'food') {
				this.paintCell(x, y, state.mode === 'tron' ? this.foodTron : this.food, this.cells.food);
			} else if (cell.type === 'buggybug') {
				this.paintCell(x, y, state.mode === 'tron' ? this.bugTron : this.bug, this.cells[cell.body]);
			}
		}
	}

	if (state.state === 'menu') {
		this.showMainMenu(state);
	} else if (state.state === 'pause') {
		this.showPause(state);
	} else if (state.state === 'end') {
		this.showEndGame(state);
	}

	this.glitchPixels();
	this.paintPixels();
};

Snake.UI.getSnakeCellType = function(i, snake) {
	var cell = snake[i];
	var prev = snake[i-1];
	var next = snake[i+1];

	var type = ""; // _ = none (tail/head), T = top, B = bottom, R = right, L = left

	function neighbourPosition(cell, neighbour) {
		var pos = "";

		if (neighbour) {
			if (neighbour.x === cell.x) {
				// in theory it should be checked for oposite (y + 1) too,
				// but it kinda looks better on top/left edges this way
				pos = (neighbour.y === cell.y - 1) ? "T" : "B";
			}
			else { // neighbour.y === cell.y
				pos = (neighbour.x === cell.x - 1) ? "L" : "R";
			}
		}
		else {
			pos = "_";
		}

		return pos;
	}

	type += neighbourPosition(cell, prev);
	type += neighbourPosition(cell, next);

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
	var characterPixels = this.font.font[character] || this.font.font["0"];
	if (characterPixels) {
		for (var j = 0; j < characterPixels.length; j++) {
			for (var i = 0; i < characterPixels[j].length; i++) {
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
		var glitchWidth = Snake.Game.random(1, state.boardWidth * this.pixelsPerCell / 2);  // group of how many columns/rows to move
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
		glitchWidth = Snake.Game.random(1, state.boardHeight * this.pixelsPerCell / 2);
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

Snake.UI.initFavicons = function(mode) {
	this.icons = {};
	this.icons['snake'] = this.getFavicon('snake');
	this.icons['sticky'] = this.icons['snake'];
	this.icons['tron'] = this.getFavicon('tron');

	var link = document.createElement('link');
	link.type = 'image/x-icon';
	link.id = 'canvas-favicon';
	link.rel = 'shortcut icon';
	document.getElementsByTagName('head')[0].appendChild(link);

	this.iconLink = link;
	this.updateFavicon(mode);
};

Snake.UI.updateFavicon = function(mode) {
	if (this.iconLink.dataset.mode !== mode) {
		this.iconLink.href = this.icons[mode];
		this.iconLink.dataset.mode = mode;
	}
};

Snake.UI.getFavicon = function(mode) {
	var canvasWH = 32;
	var canvas = document.createElement('canvas');
	canvas.width = canvasWH;
	canvas.height = canvasWH;

	var ctx = canvas.getContext('2d');
	ctx.fillStyle = mode === 'tron' ? "#003" : "rgb(150,200,50)";
	ctx.fillRect(0, 0, canvasWH, canvasWH);
	ctx.fillStyle = mode === 'tron' ? this.foodTron : this.food;
	this.paintFaviconFood(ctx, canvasWH, this.cells.food);
	ctx.fillStyle = mode === 'tron' ? this.wallTron : this.wall;
	this.paintFaviconWall(ctx, 28);

	return canvas.toDataURL("image/x-icon");
};

Snake.UI.paintFaviconFood = function(ctx, canvasWH, cellPixels) {
	var cellWH = 4;
	for (var i = 0; i < cellWH; i++) {
		for (var j = 0; j < cellWH; j++) {
			if (cellPixels[j][i]) {
				ctx.fillRect(j * cellWH * 1.6, i * cellWH * 1.6, cellWH * 1.5, cellWH * 1.5);
			}
		}
	}
};

Snake.UI.paintFaviconWall = function(ctx, canvasWH) {
	var cellWH = 2;
	var maxH, maxW = maxH = canvasWH / cellWH;
	for (var i = 0; i < maxH; i++) {
		for (var j = 0; j < maxW; j++) {
			if (i === 0 || j === 0 || i === maxW - 1 || j === maxW - 1) {
				ctx.fillRect(j * cellWH + 2, i * cellWH + 2, cellWH, cellWH);
			}
		}
	}
};
