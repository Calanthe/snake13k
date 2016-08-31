var Snake = Snake || {};

Snake.Board = {};

Snake.Board.initBoard = function(state) {
	var type;

	for (var i = 0; i < state.boardWidth; i++) {
		Snake.Game.state.board[i] = new Array(state.boardWidth);
		for (var j = 0; j < state.boardHeight; j++) {
			if (i === 0 || j === 0 || i === state.boardWidth - 1 || j === state.boardHeight - 1) {
				type = 'wall';
			} else {
				type = '';
			}
			Snake.Game.state.board[i][j] = {
				type: type,
				isGlitched: false
			}
		}
	}
};

Snake.Board.glitchOppositeWall = function() {
	var food = Snake.Game.state.food;
	var getOppositeWallCoords = this.getOppositeWallCoords(food.x, food.y);
	if (getOppositeWallCoords) {
		console.log('getOppositeWallCoords: ', getOppositeWallCoords);
		this.glitchSingleWall(getOppositeWallCoords);
	}
};

Snake.Board.getOppositeWallCoords = function(x, y) {
	var state = Snake.Game.state;
	var coords;

	if (y === 0) { //if it's at the top wall
		coords = {
			x: x,
			y: state.boardHeight - 1
		}
	} else if (y === state.boardHeight - 1) { //if it's at the bottom wall
		coords = {
			x: x,
			y: 0
		}
	} else if (x === 0) { //if on the left wall
		coords = {
			x: state.boardWidth - 1,
			y: y
		}
	} else if (x === state.boardWidth - 1) { //if on the right wall
		coords = {
			x: 0,
			y: y
		}
	}

	return coords;
};

Snake.Board.addSingleWall = function(i, j) {
	Snake.Game.state.board[i][j].type = 'wall';
};

Snake.Board.removeSingleWall = function(i, j) {
	Snake.Game.state.board[i][j].type = '';
};

Snake.Board.glitchSingleWall = function(i, j) {
	if (Snake.Game.state.board[i][j].type === 'wall') {
		Snake.Game.state.board[i][j].isGlitched = true;
	}
};
