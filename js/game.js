var Snake = Snake || {};

Snake.CANVAS = document.getElementById('c');
Snake.CTX = Snake.CANVAS.getContext('2d');
Snake.CANVASW = 600;
Snake.CANVASH = 600;
Snake.CELL = 10; //dimension of one cell
Snake.SNAKE = [];
Snake.DIRECTION = 'right';
Snake.SCORE;
Snake.ANIMATIONID;
Snake.FOOD;

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

	//start the game
	this.start();
};

Snake.Game.start = function() {
	//paint the board in the game loop
	Snake.ANIMATIONID = window.requestAnimationFrame(this.start.bind(this)); //may change this to setInterval because right now I cant alter the speed of the snake
	this.paint();
};

Snake.Game.initSnake = function() {
	for(var i = 0; i < 5; i++) { //let's start with snake length 5
		//horizontal snake starting from the top left
		Snake.SNAKE.push({x: i, y: 0});
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
	Snake.CTX.fillStyle = 'white';
	Snake.CTX.fillRect(0, 0, Snake.CANVASW, Snake.CANVASH);
	Snake.CTX.strokeStyle = 'black';
	Snake.CTX.strokeRect(0, 0, Snake.CANVASW, Snake.CANVASH);

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

	for (var i = 0; i < Snake.SNAKE.length; i++) {
		var cell = Snake.SNAKE[i];
		this.paintCell(cell.x, cell.y);
	}

	//paint the food
	this.paintCell(Snake.FOOD.x, Snake.FOOD.y);

	this.ui.paintScore();
};

Snake.Game.paintCell = function(x, y) {
	Snake.CTX.fillStyle = "blue";
	Snake.CTX.fillRect(x * Snake.CELL, y * Snake.CELL, Snake.CELL, Snake.CELL);
	Snake.CTX.strokeStyle = "white";
	Snake.CTX.strokeRect(x * Snake.CELL, y * Snake.CELL, Snake.CELL, Snake.CELL);
};

Snake.Game.checkCollision = function(snakeX, snakeY) {
	if (snakeX == -1 //if we will get out of the board
		|| snakeX == Snake.CANVASW / Snake.CELL
		|| snakeY == -1
		|| snakeY == Snake.CANVASH / Snake.CELL
		|| this.ifHitItself(snakeX, snakeY)) { //if the snake will collide with itself

		//stop the game loop
		window.cancelAnimationFrame(Snake.ANIMATIONID);
		this.ui.showEndGame();
		//restart game ?
		//this.Game.init();
	}
};

Snake.Game.ifHitItself = function(x, y) {
	//check if the given x/y coordinates exist in the snake array
	for (var i = 0; i < Snake.SNAKE.length; i++) {
		if (Snake.SNAKE[i].x == x && Snake.SNAKE[i].y == y) {
			return true;
		}
	}
	return false;
};

Snake.Game.moveSnake = function(newDirection) {
	Snake.DIRECTION = newDirection;
};

Snake.Game.init();