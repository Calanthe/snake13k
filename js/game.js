var Snake = Snake || {};

Snake.CANVAS = document.getElementById('c');
Snake.CTX = Snake.CANVAS.getContext('2d');
Snake.CANVASW = 600;
Snake.CANVASH = 600;
Snake.CELL = 20; //dimension of one cell
Snake.SNAKE = [];
Snake.WALLS = [];
Snake.DIRECTION = 'right';
Snake.SCORE;
Snake.ANIMATIONID;
Snake.FOOD;

//this is to change the FPS of the requestAnimationFrame
var stop = false;
var fps = 16, fpsInterval, startTime, now, then, elapsed;

Snake.Game = {};

Snake.Game.init = function() {
	this.ui = Snake.UI;
	this.controls = Snake.Controls;

	this.ui.initScore();

	//TODO show menu or info
	//this.ui.showMainMenu();

	this.controls.addListeners(this.moveSnake);

	//initialise the snake
	this.initSnake();

	//initialise the food
	this.initFood();

	//initialise the walls
	this.initWalls();

	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;

	//start the game
	this.start();
};

Snake.Game.start = function() {
	//paint the board in the game loop
	Snake.ANIMATIONID = window.requestAnimationFrame(this.start.bind(this)); //may change this to setInterval because right now I cant alter the speed of the snake

	now = Date.now();
	elapsed = now - then;

	// if enough time has elapsed, draw the next frame
	if (elapsed > fpsInterval) {

		// Get ready for next frame by setting then=now, but also adjust for your
		// specified fpsInterval not being a multiple of RAF's interval (16.7ms)
		then = now - (elapsed % fpsInterval);

		this.paint();
	}
};

Snake.Game.initSnake = function() {
	for(var i = 0; i < 5; i++) { //let's start with snake length 5
		//horizontal snake starting from the top left
		Snake.SNAKE.push({x: i, y: 1});
	}
};

Snake.Game.initWalls = function() {
	for (var i = 0; i < Snake.CANVASW / Snake.CELL; i++) {
		Snake.WALLS.push({x: i, y: 0});
	}

	for (var i = 0; i < Snake.CANVASW / Snake.CELL; i++) {
		Snake.WALLS.push({x: i, y: Snake.CANVASH / Snake.CELL - 1});
	}

	for (var i = 0; i < Snake.CANVASH / Snake.CELL; i++) {
		Snake.WALLS.push({x: 0, y: i});
	}

	for (var i = 0; i < Snake.CANVASH / Snake.CELL; i++) {
		Snake.WALLS.push({x: Snake.CANVASW / Snake.CELL - 1, y: i});
	}
};

Snake.Game.initFood = function() {
	Snake.FOOD = {
		x: Math.round(Math.random() * (Snake.CANVASW - Snake.CELL) / Snake.CELL),
		y: Math.round(Math.random() * (Snake.CANVASH - Snake.CELL) / Snake.CELL)
	};
};

Snake.Game.paint = function() {
	//paint the board
	Snake.CTX.fillStyle = '#1E1E1E';
	Snake.CTX.fillRect(0, 0, Snake.CANVASW, Snake.CANVASH);

	//take the snake's head
	var snakeX = Snake.SNAKE[Snake.SNAKE.length - 1].x;
	var snakeY = Snake.SNAKE[Snake.SNAKE.length - 1].y;

	if (Snake.DIRECTION == 'right') snakeX++; //5,0
	else if (Snake.DIRECTION == 'left') snakeX--;
	else if (Snake.DIRECTION == 'up') snakeY--;
	else if (Snake.DIRECTION == 'down') snakeY++;

	this.checkCollision(snakeX, snakeY);

	//if the new head position matches the food,
	//create a new head instead of moving the tail
	if (snakeX == Snake.FOOD.x && snakeY == Snake.FOOD.y) {
		var tail = {
			x: snakeX,
			y: snakeY
		};
		this.ui.updateScore();
		this.initFood();
	} else {
		var tail = Snake.SNAKE.shift(); //take the first cell - tail
		tail.x = snakeX;
		tail.y = snakeY;
	}

	Snake.SNAKE.push(tail); //puts back the tail as the new head

	//paint the walls
	for (var i = 0; i < Snake.WALLS.length; i++) {
		var cell = Snake.WALLS[i];
		this.paintCell(cell.x, cell.y, '#49A6DA');
	}

	//paint the snake
	for (var i = 0; i < Snake.SNAKE.length; i++) {
		var cell = Snake.SNAKE[i];
		this.paintCell(cell.x, cell.y, '#52DF4A');
	}

	//paint the food
	this.paintCell(Snake.FOOD.x, Snake.FOOD.y, '#E2413A');

	this.ui.paintScore();
};

Snake.Game.paintCell = function(x, y, colour) {
	Snake.CTX.fillStyle = colour;
	Snake.CTX.fillRect(x * Snake.CELL, y * Snake.CELL, Snake.CELL, Snake.CELL);
	Snake.CTX.strokeStyle = '#393939';
	Snake.CTX.strokeRect(x * Snake.CELL, y * Snake.CELL, Snake.CELL, Snake.CELL);
};

Snake.Game.checkCollision = function(snakeX, snakeY) {
	if (snakeX == -1 //if we will get out of the board
		|| snakeX == Snake.CANVASW / Snake.CELL
		|| snakeY == -1
		|| snakeY == Snake.CANVASH / Snake.CELL
		|| this.ifCollided(snakeX, snakeY, Snake.SNAKE) //if the snake will collide with itself
		|| this.ifCollided(snakeX, snakeY, Snake.WALLS)) { //if the snake will collide with walls

		//stop the game loop
		window.cancelAnimationFrame(Snake.ANIMATIONID);
		this.ui.showEndGame();
		//restart game ?
		//this.Game.init();
	}
};

Snake.Game.ifCollided = function(x, y, array) {
	//check if the x/y coordinates exist in the given array
	for (var i = 0; i < array.length; i++) {
		if (array[i].x == x && array[i].y == y) {
			return true;
		}
	}
	return false;
};

Snake.Game.moveSnake = function(newDirection) {
	Snake.DIRECTION = newDirection;
};

Snake.Game.init();