var Snake = Snake || {};

Snake.Walls = {};

Snake.Walls.initWalls = function(state) {
	for (var i = 0; i < state.boardWidth; i++) {
		this.addSingleWall(i, 0);
	}

	for (i = 0; i < state.boardWidth; i++) {
		this.addSingleWall(i, state.boardHeight - 1);
	}

	for (i = 1; i < state.boardHeight - 1; i++) {
		this.addSingleWall(0, i);
	}

	for (i = 1; i < state.boardHeight - 1; i++) {
		this.addSingleWall(state.boardWidth - 1, i);
	}
};

Snake.Walls.glitchOppositeWall = function() {
	var food = Snake.Game.state.food;
	var oppositeWall = this.getOppositeWall(food.x, food.y);
	if (oppositeWall) {
		console.log('oppositeWall: ', oppositeWall);
		var wallIndex = this.findWallIndex(oppositeWall.x, oppositeWall.y);
		console.log('wallIndex: ', wallIndex);
		if (wallIndex !== -1) {
			this.glitchSingleWall(wallIndex);
		}
	}
};

Snake.Walls.findWallIndex = function(x, y) {
	for (var i = 0; i < Snake.Game.state.walls.length; i++) {
		if (Snake.Game.state.walls[i].x === x && Snake.Game.state.walls[i].y === y) {
			return i;
		}
	}

	return -1;
};

Snake.Walls.getOppositeWall = function(foodX, foodY) {
	var state = Snake.Game.state;
	var oppositeWall;

	if (foodY === 0) { //if it's at the top wall
		oppositeWall = {x: foodX, y: state.boardHeight - 1};
	} else if (foodY === state.boardHeight - 1) { //if it's at the bottom wall
		oppositeWall = {x: foodX, y: 0};
	} else if (foodX === 0) { //if on the left wall
		oppositeWall = {x: state.boardWidth - 1, y: foodY};
	} else if (foodX === state.boardWidth - 1) { //if on the right wall
		oppositeWall = {x: 0, y: foodY};
	}

	return oppositeWall;
};

Snake.Walls.addSingleWall = function(x, y) {
	Snake.Game.state.walls.push({
		x: x,
		y: y,
		isGlitched: false
	});
};

Snake.Walls.removeSingleWall = function(i) {
	Snake.Game.state.walls.splice(i, 1);
};

Snake.Walls.glitchSingleWall = function(i) {
	Snake.Game.state.walls[i].isGlitched = true;
};
