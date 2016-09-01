var Snake = Snake || {};

Snake.Board = {};

Snake.Board.wallOffsetTop = 1;
Snake.Board.wallOffsetBottom = 1;
Snake.Board.wallOffsetLeft = 1;
Snake.Board.wallOffsetRight = 1;

Snake.Board.initBoard = function(state) {
	var wallOffsetTop = Snake.Board.wallOffsetTop;
	var wallOffsetBottom = Snake.Board.wallOffsetBottom;
	var wallOffsetLeft = Snake.Board.wallOffsetLeft;
	var wallOffsetRight = Snake.Board.wallOffsetRight;

	for (var x = 0; x < state.boardWidth; x++) {
		Snake.Game.state.board[x] = new Array(state.boardWidth);
		for (var y = 0; y < state.boardHeight; y++) {
			Snake.Game.state.board[x][y] = {
				type: null,
				isGlitched: false
			};
		}
	}

	for (x = wallOffsetLeft; x < state.boardWidth - wallOffsetRight; x++) {
		Snake.Game.state.board[x][wallOffsetTop].type = 'wall';
		Snake.Game.state.board[x][state.boardHeight - wallOffsetBottom - 1].type = 'wall';
	}

	for (y = wallOffsetTop; y < state.boardHeight - wallOffsetBottom; y++) {
		Snake.Game.state.board[wallOffsetLeft][y].type = 'wall';
		Snake.Game.state.board[state.boardWidth - wallOffsetRight - 1][y].type = 'wall';
	}

};

Snake.Board.glitchOppositeWall = function(x, y) {
	var oppositeCoords = this.getOppositeWallCoords(x, y);
	if (oppositeCoords) {
		console.log('getOppositeWallCoords: ', oppositeCoords);
		this.glitchSingleWall(oppositeCoords.x, oppositeCoords.y);
	}
};

Snake.Board.getOppositeWallCoords = function(x, y) {
	var state = Snake.Game.state;
	var coords;

	var wallOffsetTop = Snake.Board.wallOffsetTop;
	var wallOffsetBottom = Snake.Board.wallOffsetBottom;
	var wallOffsetLeft = Snake.Board.wallOffsetLeft;
	var wallOffsetRight = Snake.Board.wallOffsetRight;

	if (y === wallOffsetTop) { //if it's at the top wall
		coords = {
			x: x,
			y: state.boardHeight - wallOffsetBottom - 1
		};
	} else if (y === state.boardHeight - wallOffsetBottom - 1) { //if it's at the bottom wall
		coords = {
			x: x,
			y: wallOffsetTop
		};
	} else if (x === wallOffsetLeft) { //if on the left wall
		coords = {
			x: state.boardWidth - wallOffsetRight - 1,
			y: y
		};
	} else if (x === state.boardWidth - wallOffsetRight - 1) { //if on the right wall
		coords = {
			x: wallOffsetLeft,
			y: y
		};
	}

	return coords;
};

Snake.Board.addSingleWall = function(x, y) {
	Snake.Game.state.board[x][y].type = 'wall';
};

Snake.Board.removeSingleWall = function(x, y) {
	Snake.Game.state.board[x][y].type = '';
};

Snake.Board.glitchSingleWall = function(x, y) {
	if (Snake.Game.state.board[x][y].type === 'wall') {
		Snake.Game.state.board[x][y].isGlitched = true;
	}
};
