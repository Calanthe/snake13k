var Snake = Snake || {};

Snake.Board = {};

Snake.Board.initBoard = function(state) {
	var type;

	for (var x = 0; x < state.boardWidth; x++) {
		Snake.Game.state.board[x] = new Array(state.boardHeightidth);
		for (var y = 0; y < state.boardHeight; y++) {
			if (x === 0 || y === 0 || x === state.boardWidth - 1 || y === state.boardHeight - 1) {
				type = 'wall';
			} else {
				type = '';
			}
			Snake.Game.state.board[x][y] = {
				type: type,
				isGlitched: false
			};
		}
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

	if (y === 0) { //if it's at the top wall
		coords = {
			x: x,
			y: state.boardHeight - 1
		};
	} else if (y === state.boardHeight - 1) { //if it's at the bottom wall
		coords = {
			x: x,
			y: 0
		};
	} else if (x === 0) { //if on the left wall
		coords = {
			x: state.boardWidth - 1,
			y: y
		};
	} else if (x === state.boardWidth - 1) { //if on the right wall
		coords = {
			x: 0,
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
