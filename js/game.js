var Snake = Snake || {};

Snake.CANVAS = document.getElementById('c');
Snake.CTX = Snake.CANVAS.getContext('2d');
Snake.CANVASW = 600;
Snake.CANVASH = 600;
Snake.CELL = 20; //dimension of one cell
Snake.SNAKE = [];
Snake.WALLS = [];
Snake.BUGGYBUG;
Snake.DIRECTION = 'right';
Snake.SCORE;
Snake.ANIMATIONID;
Snake.FOOD;
Snake.ISGLITCHED = false;
Snake.PREVLENGTH = null;
Snake.NEWHEAD;

//this is to change the FPS of the requestAnimationFrame
// FIXME: global vars
var stop = false;
var fps, fpsInterval, startTime, now, then, elapsed;

Snake.Game = {};

Snake.Game.init = function() {
	this.ui = Snake.UI;
	this.controls = Snake.Controls;
	this.walls = Snake.Walls;

	Snake.Walls.Game = this;

	this.ui.initScore();

	//TODO show menu or info
	//this.ui.showMainMenu();

	this.controls.addListeners(this.moveSnake);

	//initialise the snake
	this.initSnake();

	//initialise the food
	this.initFood();

	//initialise the walls
	this.walls.initWalls();

	then = Date.now();
	startTime = then;

	//start the game
	this.start();
};

Snake.Game.start = function() {
	Snake.ANIMATIONID = window.requestAnimationFrame(this.start.bind(this)); //may change this to setInterval because right now I cant alter the speed of the snake

	now = Date.now();
	elapsed = now - then;

	// make speed depend on snake length
	// TODO: it speeds up a little bit too quickly
	fps = Snake.PREVLENGTH || Snake.SNAKE.length;
	fpsInterval = 1000 / fps;

	// if enough time has elapsed, draw the next frame
	if (elapsed > fpsInterval) {

		// Get ready for next frame by setting then=now, but also adjust for your
		// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
		then = now - (elapsed % fpsInterval);

		//paint the board in the game loop
		this.paint();
	}
};

Snake.Game.initSnake = function() {
	for(var i = 0; i < 5; i++) { //let's start with snake length 5
		//horizontal snake starting from the top left
		Snake.SNAKE.push({x: i, y: 1});
	}
};

Snake.Game.initFood = function() {
	//make sure that the food is not generated on the wall - no sure if this work
	//TODO make sure that it's not generated on buggy bug or snake
	do {
		var randomX = Math.round(Math.random() * (Snake.CANVASW - Snake.CELL) / Snake.CELL);
		var randomY = Math.round(Math.random() * (Snake.CANVASH - Snake.CELL) / Snake.CELL);
	} while (this.walls.findWallIndex(randomX, randomY) !== -1);

	Snake.FOOD = {
		x: randomX,
		y: randomY,
		isGlitched: false
	};
};

Snake.Game.initBuggyBug = function() { //TODO this and above functions are almost the same - make one
	//make sure that the buggy bug is not generated on the wall
	//TODO make sure that it's not generated on food or snake
	do {
		var randomX = Math.round(Math.random() * (Snake.CANVASW - Snake.CELL) / Snake.CELL);
		var randomY = Math.round(Math.random() * (Snake.CANVASH - Snake.CELL) / Snake.CELL);
	} while (this.walls.findWallIndex(randomX, randomY) !== -1);

	Snake.BUGGYBUG = {
		x: randomX,
		y: randomY
	};
};

Snake.Game.paint = function() {
	//paint the board
	Snake.CTX.fillStyle = '#1E1E1E'; //move colour variables to the UI module
	Snake.CTX.fillRect(0, 0, Snake.CANVASW, Snake.CANVASH);

	//take the snake's head
	var snakeX = Snake.SNAKE[Snake.SNAKE.length - 1].x;
	var snakeY = Snake.SNAKE[Snake.SNAKE.length - 1].y;

	if (Snake.DIRECTION == 'right') snakeX++;
	else if (Snake.DIRECTION == 'left') snakeX--;
	else if (Snake.DIRECTION == 'up') snakeY--;
	else if (Snake.DIRECTION == 'down') snakeY++;

	//if we will get out of the board
	if (snakeX === -1) {
		snakeX = Snake.CANVASW / Snake.CELL - 1;
	} else if (snakeX === Snake.CANVASW / Snake.CELL) {
		snakeX = 0;
	} else if (snakeY === -1) {
		snakeY = Snake.CANVASH / Snake.CELL - 1;
	} else if (snakeY === Snake.CANVASH / Snake.CELL) {
		snakeY = 0;
	}

	this.checkCollision(snakeX, snakeY);

	//if the new head position matches the food
	if (snakeX == Snake.FOOD.x && snakeY == Snake.FOOD.y) {
		this.ui.updateScore(1);
		if (Snake.FOOD.isGlitched) {
			//glitch also the opposite piece of the wall so the snake can come through
			this.walls.glitchOppositeWall();
		}
		Snake.ISGLITCHED = false; //fix the snake so the tail can move
		this.addAGlitch(); //sasasasasa
	} else if (Snake.BUGGYBUG && snakeX == Snake.BUGGYBUG.x && snakeY == Snake.BUGGYBUG.y) {
		//if the head position matches the buggy bug,
		//add extra points and enlarge snake without moving the tail
		//until normal food is eaten
		this.ui.updateScore(10);
		Snake.ISGLITCHED = true;
		Snake.BUGGYBUG = {};
		Snake.PREVLENGTH = Snake.SNAKE.length; //need to remember the actual length of the snake
	} else {
		if (!Snake.ISGLITCHED) {
			Snake.SNAKE.shift(); //remove the first cell - tail
			//make it smaller in every paint
			//TODO make the snake smaller immediately?
			if (Snake.PREVLENGTH && Snake.SNAKE.length > Snake.PREVLENGTH) {
				Snake.SNAKE.shift();
			} else if (Snake.PREVLENGTH && Snake.SNAKE.length === Snake.PREVLENGTH) { //no need to make it smaller anymore
				Snake.PREVLENGTH = null;
			}
		}
	}

	Snake.NEWHEAD = {
		x: snakeX,
		y: snakeY
	};

	Snake.SNAKE.push(Snake.NEWHEAD);

	//paint the walls
	this.walls.paintWalls();

	//paint the snake
	for (var i = 0; i < Snake.SNAKE.length; i++) {
		var cell = Snake.SNAKE[i];
		this.paintCell(cell.x, cell.y, '#52DF4A');
	}

	//paint the food
	this.paintCell(Snake.FOOD.x, Snake.FOOD.y, '#E2413A');

	//paint the buggy bug
	if (Snake.BUGGYBUG) {
		this.paintCell(Snake.BUGGYBUG.x, Snake.BUGGYBUG.y, 'white');
	}

	this.ui.paintScore();
};

Snake.Game.addAGlitch = function() {
	var randomGlitchType = Math.round(Math.random() * (3 - 1) + 1); //1 - buggy bug, 2 - wall, 3 - food

	console.log('randomGlitchType: ', randomGlitchType);

	if (randomGlitchType === 1 && !Snake.BUGGYBUG) {
		this.initBuggyBug();
		this.initFood();
	} else if (randomGlitchType === 2) { //place a glitched wall piece in a random place
		this.walls.addSingleWall(Math.round(Math.random() * (Snake.CANVASW - Snake.CELL) / Snake.CELL), Math.round(Math.random() * (Snake.CANVASH - Snake.CELL) / Snake.CELL));
		//TODO the glitched wall should be at least one space from the border of the board
		this.initFood();
	} else if (randomGlitchType === 3) { //food generated somewhere on the wall - if there is any wall left
		if (Snake.WALLS.length) {
			var randomWall = Math.round(Math.random() * (Snake.WALLS.length - 1) / 1); //TODO it cant be in the corner or next to the margin walls
			Snake.FOOD = {
				x: Snake.WALLS[randomWall - 1].x,
				y: Snake.WALLS[randomWall - 1].y,
				isGlitched: true
			};
			//now remove that piece from the WALLS array, otherwise snake will crash
			this.walls.removeSingleWall(randomWall - 1);
		} else {
			this.initFood();
		}
	} else {
		this.initFood();
	}
};

Snake.Game.paintCell = function(x, y, colour) {
	Snake.CTX.fillStyle = colour;
	Snake.CTX.fillRect(x * Snake.CELL, y * Snake.CELL, Snake.CELL, Snake.CELL);
	Snake.CTX.strokeStyle = '#393939';
	Snake.CTX.strokeRect(x * Snake.CELL, y * Snake.CELL, Snake.CELL, Snake.CELL);
};

Snake.Game.checkCollision = function(snakeX, snakeY) {
	if (this.ifCollided(snakeX, snakeY, 'SNAKE') //if the snake will collide with itself
		|| this.ifCollided(snakeX, snakeY, 'WALLS')) { //if the snake will collide with the walls

		//stop the game loop
		window.cancelAnimationFrame(Snake.ANIMATIONID);
		console.log('ifCollidedWithItself', this.ifCollided(snakeX, snakeY, 'SNAKE'));
		console.log('ifCollidedWithWalls', this.ifCollided(snakeX, snakeY, 'WALLS'));
		this.ui.showEndGame();
		//restart game ?
		//this.Game.init();
	}
};

Snake.Game.ifCollided = function(x, y, arrayType) {
	var array = Snake[arrayType]; //either Snake.SNAKE or Snake.WALLS
	//check if the x/y coordinates exist in the given array
	for (var i = 0; i < array.length; i++) {
		if (array[i].x === x && array[i].y === y
			&& (arrayType === 'SNAKE' || (arrayType === 'WALLS' && !array[i].isGlitched))) {
			return true;
		}
	}
	return false;
};

Snake.Game.moveSnake = function(newDirection) {
	Snake.DIRECTION = newDirection;
};

Snake.Game.init();
