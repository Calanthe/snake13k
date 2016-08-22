var Snake = Snake || {};

Snake.Walls = {};

Snake.Walls.initWalls = function() {
	for (var i = 0; i < Snake.CANVASW / Snake.CELL; i++) {
		this.addSingleWall(i, 0);
	}

	for (var i = 0; i < Snake.CANVASW / Snake.CELL; i++) {
		this.addSingleWall(i, Snake.CANVASH / Snake.CELL - 1);
	}

	for (var i = 0; i < Snake.CANVASH / Snake.CELL; i++) {
		this.addSingleWall(0, i);
	}

	for (var i = 0; i < Snake.CANVASH / Snake.CELL; i++) {
		this.addSingleWall(Snake.CANVASW / Snake.CELL - 1, i);
	}
};

Snake.Walls.paintWalls = function() {
	for (var i = 0; i < Snake.WALLS.length; i++) {
		var cell = Snake.WALLS[i];
		this.Game.paintCell(cell.x, cell.y, '#49A6DA');
	}
};

Snake.Walls.glitchOppositeWall = function() {
	var oppositeWall = this.getOppositeWall(Snake.FOOD.x, Snake.FOOD.y);
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
	for (var i = 0; i < Snake.WALLS.length; i++) {
		if (Snake.WALLS[i].x === x && Snake.WALLS[i].y === y) {
			return i;
		}
	}

	return -1;
};

Snake.Walls.getOppositeWall = function(foodX, foodY) {
	var oppositeWall;

	if (foodY === 0) { //if it's at the top wall
		oppositeWall = {x: foodX, y: Snake.CANVASH / Snake.CELL - 1};
	} else if (foodY === Snake.CANVASH / Snake.CELL - 1) { //if it's at the bottom wall
		oppositeWall = {x: foodX, y: 0};
	} else if (foodX === 0) { //if on the left wall
		oppositeWall = {x: Snake.CANVASW / Snake.CELL - 1, y: foodY};
	} else if (foodX === Snake.CANVASW / Snake.CELL - 1) { //if on the right wall
		oppositeWall = {x: 0, y: foodY};
	}

	return oppositeWall;
};

Snake.Walls.addSingleWall = function(x, y) {
	Snake.WALLS.push({
		x: x,
		y: y,
		isGlitched: false
	});
};

Snake.Walls.removeSingleWall = function(i) {
	Snake.WALLS.splice(i, 1);
};

Snake.Walls.glitchSingleWall = function(i) {
	Snake.WALLS[i].isGlitched = true;
};