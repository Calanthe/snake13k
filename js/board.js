var Snake = Snake || {};

Snake.Board = {};

Snake.Board.initBoard = function(state) {
	var offset = state.borderOffset;

	for (var x = 0; x < state.boardWidth; x++) {
		state.board[x] = new Array(state.boardWidth);
		for (var y = 0; y < state.boardHeight; y++) {
			state.board[x][y] = {
				type: null,
				isGlitched: false
			};
		}
	}

	for (x = offset.left; x < state.boardWidth - offset.right; x++) {
		state.board[x][offset.top].type = 'wall';
		state.board[x][state.boardHeight - offset.bottom - 1].type = 'wall';
	}

	for (y = offset.top; y < state.boardHeight - offset.bottom; y++) {
		state.board[offset.left][y].type = 'wall';
		state.board[state.boardWidth - offset.right - 1][y].type = 'wall';
	}
};

Snake.Board.glitchOppositeWall = function(x, y, state) {
	var oppositeCoords = this.getOppositeWallCoords(x, y, state);
	if (oppositeCoords) {
		this.glitchSingleWall(oppositeCoords.x, oppositeCoords.y, state);
	}
};

Snake.Board.getOppositeWallCoords = function(x, y, state) {
	var coords;

	var offset = state.borderOffset;

	if (y === offset.top) { // if it's at the top wall
		coords = {
			x: x,
			y: state.boardHeight - offset.bottom - 1
		};
	} else if (y === state.boardHeight - offset.bottom - 1) { // if it's at the bottom wall
		coords = {
			x: x,
			y: offset.top
		};
	} else if (x === offset.left) { // if on the left wall
		coords = {
			x: state.boardWidth - offset.right - 1,
			y: y
		};
	} else if (x === state.boardWidth - offset.right - 1) { // if on the right wall
		coords = {
			x: offset.left,
			y: y
		};
	}

	return coords;
};

Snake.Board.glitchSingleWall = function(x, y, state) {
	if (state.board[x][y].type === 'wall') {
		state.board[x][y].isGlitched = true;
	}
};
