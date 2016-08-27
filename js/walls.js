var Snake = Snake || {};

Snake.Walls = {};

Snake.Walls.initWalls = function() {
	for (var i = 0; i < Snake.Renderer.canvasWidth / Snake.Renderer.cellSize; i++) {
		this.addSingleWall(i, 0);
	}

	for (i = 0; i < Snake.Renderer.canvasWidth / Snake.Renderer.cellSize; i++) {
		this.addSingleWall(i, Snake.Renderer.canvasHeight / Snake.Renderer.cellSize - 1);
	}

	for (i = 0; i < Snake.Renderer.canvasHeight / Snake.Renderer.cellSize; i++) {
		this.addSingleWall(0, i);
	}

	for (i = 0; i < Snake.Renderer.canvasHeight / Snake.Renderer.cellSize; i++) {
		this.addSingleWall(Snake.Renderer.canvasWidth / Snake.Renderer.cellSize - 1, i);
	}
};

Snake.Walls.paintWalls = function() {
	// TODO: move to Game.paint (?)
	for (var i = 0; i < Snake.Game.state.walls.length; i++) {
		var cell = Snake.Game.state.walls[i];
		this.Game.paintCell(cell.x, cell.y, Snake.Game.state.isGlitched ? 'yellow' : 'rgba(0,0,0,0.7)');
	}
};

Snake.Walls.glitchOppositeWall = function() {
	var oppositeWall = this.getOppositeWall(Snake.Game.state.food.x, Snake.Game.state.food.y);
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
	var oppositeWall;

	if (foodY === 0) { //if it's at the top wall
		oppositeWall = {x: foodX, y: Snake.Renderer.canvasHeight / Snake.Renderer.cellSize - 1};
	} else if (foodY === Snake.Renderer.canvasHeight / Snake.Renderer.cellSize - 1) { //if it's at the bottom wall
		oppositeWall = {x: foodX, y: 0};
	} else if (foodX === 0) { //if on the left wall
		oppositeWall = {x: Snake.Renderer.canvasWidth / Snake.Renderer.cellSize - 1, y: foodY};
	} else if (foodX === Snake.Renderer.canvasWidth / Snake.Renderer.cellSize - 1) { //if on the right wall
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
