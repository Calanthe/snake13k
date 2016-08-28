var Snake = Snake || {};

Snake.Renderer = {
	canvas: document.getElementById('c'),
	ctx: document.getElementById('c').getContext('2d'),

	cellSize: 21 //dimension of one cell
};

Snake.Renderer.init = function(state) {
	this.canvas.width = state.boardWidth * this.cellSize;
	this.canvas.height = state.boardHeight * this.cellSize;
};

Snake.Renderer.paint = function(state) {
	//paint the board
	//TODO move colour variables to the UI module
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	// paint pixels on whole screen
	for (var i = 0; i < state.boardWidth; i++) {
		for (var j = 0; j < state.boardHeight; j++) {
			// TODO: special tron background? bigger squares? only blue lines?
			this.paintCell(i, j, state.isGlitched ? 'rgba(0,0,255,0.2)' : 'rgba(0,0,0,0.05)', true);
		}
	}

	// FIXME: quick and dirty tron mode prototype
	if (state.isGlitched) {
		document.body.className = 'tron';
	}
	else {
		document.body.className = '';
	}

	//paint the walls
	for (i = 0; i < state.walls.length; i++) {
		var cell = state.walls[i];
		this.paintCell(cell.x, cell.y, state.isGlitched ? 'yellow' : 'rgba(0,0,0,0.7)');
	}

	//paint the snake
	for (i = 0; i < state.snake.length; i++) {
		cell = state.snake[i];
		this.paintCell(cell.x, cell.y, state.isGlitched ? 'cyan' : 'rgba(0,0,0,0.7)');
	}

	//paint the food
	this.paintCell(state.food.x, state.food.y, 'rgba(255,0,0,0.7)');

	//paint the buggy bug
	if (state.bug) {
		this.paintCell(state.bug.x, state.bug.y, 'rgba(255,255,255,0.7)');
	}
};

Snake.Renderer.paintCell = function(x, y, colour, forcePaint) {
	// FIXME: decide on one paint mode and use it
	var mode = document.querySelector('[name=paintMode]:checked').value || 'big';

	var pixelWidth = mode === 'big' ? this.cellSize - 2 : (this.cellSize - 6) / 3;

	this.ctx.fillStyle = colour;

	if (mode === 'big') {
		this.ctx.fillRect(x * this.cellSize + 1, y * this.cellSize + 1, pixelWidth, pixelWidth);
	}
	else {
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				// if paint mode is 'glitched' hide random pixels
				if (mode === 'small' || forcePaint || Math.random() < 0.995) {
					this.ctx.fillRect(x * this.cellSize + 1 + i * (pixelWidth + 2), y * this.cellSize + 1 + j * (pixelWidth + 2), pixelWidth, pixelWidth);
				}
			}
		}
	}
};

Snake.Game = {};

Snake.Game.state = {
	snake: [],
	direction: 'right', // 'right', 'left', 'top', 'down'
	newDirection: null, //
	food: null, // { x, y }
	bug: null, // TODO: { x, y, type, time }
	board: [], // TODO: array of full game board
	boardWidth: 30,
	boardHeight: 30,
	score: 0,
	level: 1,
	mode: 'snake', // TODO: 'snake' / 'tron' modes
	prevLength: null, // real snake length (during tron mode)

	// FIXME: temporary values to be refactored
	walls: [], // FIXME: to be replaced with board
	isGlitched: false // FIXME: to be replaced with mode
};

// TODO: wrap in function and turn to local vars?
//       or make a 'class' with prototype
Snake.Game.vars = {
	then: null,
	animationId: null
};

Snake.Game.init = function() {
	this.ui = Snake.UI;
	this.controls = Snake.Controls;
	this.walls = Snake.Walls;
	this.renderer = Snake.Renderer;

	this.renderer.init(this.state);

	// TODO: move score to state
	this.ui.initScore();

	//TODO show menu or info
	//this.ui.showMainMenu();

	this.controls.addListeners(this.onInput.bind(this));

	//initialise the snake
	this.initSnake();

	//initialise the food
	this.initFood();

	//initialise the walls
	this.walls.initWalls(this.state);

	this.vars.then = performance.now();

	//start the game
	this.start();
};

Snake.Game.start = function() {
	this.vars.animationId = window.requestAnimationFrame(this.start.bind(this)); //may change this to setInterval because right now I cant alter the speed of the snake

	var now = performance.now();
	var elapsed = now - this.vars.then;

	// make speed depend on snake length
	// TODO: it speeds up a little bit too quickly
	var fps = this.state.prevLength || this.state.snake.length;
	// speed up in tron mode
	if (this.state.isGlitched) fps += 2;

	var fpsInterval = 1000 / fps;

	// if enough time has elapsed, draw the next frame
	if (elapsed > fpsInterval) {

		// Get ready for next frame by setting then=now, but also adjust for your
		// specified fpsInterval
		this.vars.then = now - (elapsed % fpsInterval);

		//paint the board in the game loop
		this.tick();
	}
};

Snake.Game.initSnake = function() {
	for(var i = 0; i < 5; i++) { //let's start with snake length 5
		//horizontal snake starting from the top left
		this.state.snake.push({x: i, y: 1});
	}
};

Snake.Game.initFood = function() {
	//make sure that the food is not generated on the wall -> no sure if this work
	//neither on buggy bug nor snake
	do {
		var randomX = Math.round(Math.random() * this.state.boardWidth);
		var randomY = Math.round(Math.random() * this.state.boardHeight);
	} while (this.walls.findWallIndex(randomX, randomY) !== -1
		|| (this.state.bug && randomX === this.state.bug.x && randomY === this.state.bug.y)
		|| Snake.Game.ifCollided(randomX, randomY, this.state.snake));

	this.state.food = {
		x: randomX,
		y: randomY,
		isGlitched: false
	};
};

Snake.Game.initBuggyBug = function() { //TODO this and above functions are almost the same - make one
	//make sure that the buggy bug is not generated on the wall
	//neither on food nor snake
	do {
		var randomX = Math.round(Math.random() * this.state.boardWidth);
		var randomY = Math.round(Math.random() * this.state.boardHeight);
	} while (this.walls.findWallIndex(randomX, randomY) !== -1
		|| (this.state.food && randomX === this.state.food.x && randomY === this.state.food.y)
		|| Snake.Game.ifCollided(randomX, randomY, this.state.snake));

	this.state.bug = {
		x: randomX,
		y: randomY
	};
};

Snake.Game.tick = function() {
	this.update();
	this.renderer.paint(this.state);
	this.ui.paintScore();
};

Snake.Game.update = function() {
	//take the snake's head
	var snakeX = this.state.snake[this.state.snake.length - 1].x;
	var snakeY = this.state.snake[this.state.snake.length - 1].y;

	// update direction based on input
	if (this.state.newDirection) {
		this.state.direction = this.state.newDirection;
	}

	if (this.state.direction == 'right') snakeX++;
	else if (this.state.direction == 'left') snakeX--;
	else if (this.state.direction == 'up') snakeY--;
	else if (this.state.direction == 'down') snakeY++;

	//if we will get out of the board
	if (snakeX === -1) {
		snakeX = this.state.boardWidth - 1;
	} else if (snakeX === this.state.boardWidth) {
		snakeX = 0;
	} else if (snakeY === -1) {
		snakeY = this.state.boardHeight - 1;
	} else if (snakeY === this.state.boardWidth) {
		snakeY = 0;
	}

	this.checkCollision(snakeX, snakeY);

	//if the new head position matches the food
	if (snakeX == this.state.food.x && snakeY == this.state.food.y) {
		this.ui.updateScore(1);
		if (this.state.food.isGlitched) {
			//glitch also the opposite piece of the wall so the snake can come through
			this.walls.glitchOppositeWall();
		}
		this.state.isGlitched = false; //fix the snake so the tail can move
		this.addAGlitch(); //sasasasasa
	} else if (this.state.bug && snakeX == this.state.bug.x && snakeY == this.state.bug.y) {
		//if the head position matches the buggy bug,
		//add extra points and enlarge snake without moving the tail
		//until normal food is eaten
		this.ui.updateScore(10);
		this.state.isGlitched = true;
		this.state.bug = {};
		this.state.prevLength = this.state.snake.length; //need to remember the actual length of the snake
	} else {
		if (!this.state.isGlitched) {
			this.state.snake.shift(); //remove the first cell - tail
			//make it smaller in every paint
			//TODO make the snake smaller immediately?
			if (this.state.prevLength && this.state.snake.length > this.state.prevLength) {
				this.state.snake.shift();
			} else if (this.state.prevLength && this.state.snake.length === this.state.prevLength) { //no need to make it smaller anymore
				this.state.prevLength = null;
			}
		}
	}

	this.state.snake.push({
		x: snakeX,
		y: snakeY
	});
};

Snake.Game.addAGlitch = function() {
	var randomGlitchType = Math.round(Math.random() * (3 - 1) + 1); //1 - buggy bug, 2 - wall, 3 - food

	console.log('randomGlitchType: ', randomGlitchType);

	if (randomGlitchType === 1 && !this.state.bug) {
		this.initBuggyBug();
		this.initFood();
	} else if (randomGlitchType === 2) { //place a glitched wall piece after snake's tail
		this.walls.addSingleWall(this.state.snake[0].x, this.state.snake[0].y);
		this.initFood();
	} else if (randomGlitchType === 3) { //food generated somewhere on the wall - if there is any wall left
		if (this.state.walls.length) {
			var randomWall = Math.round(Math.random() * (this.state.walls.length - 1) / 1); //TODO it cant be in the corner or next to the margin walls
			this.state.food = {
				x: this.state.walls[randomWall - 1].x,
				y: this.state.walls[randomWall - 1].y,
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

Snake.Game.checkCollision = function(snakeX, snakeY) {
	if (this.ifCollided(snakeX, snakeY, this.state.snake) //if the snake will collide with itself
		|| this.ifCollided(snakeX, snakeY, this.state.walls)) { //if the snake will collide with the walls

		//stop the game loop
		window.cancelAnimationFrame(this.vars.animationId);
		console.log('ifCollidedWithItself', this.ifCollided(snakeX, snakeY, this.state.snake));
		console.log('ifCollidedWithWalls', this.ifCollided(snakeX, snakeY, this.state.walls));
		this.ui.showEndGame();
		//restart game ?
		//this.Game.init();
	}
};

Snake.Game.ifCollided = function(x, y, array) {
	//check if the x/y coordinates exist in the given array
	for (var i = 0; i < array.length; i++) {
		if (array[i].x === x && array[i].y === y && !array[i].isGlitched) {
			return true;
		}
	}
	return false;
};

Snake.Game.onInput = function(newDirection) {
	// don't accept input with direction oposite to current
	if ((newDirection == 'right' && this.state.direction !== 'left') ||
			(newDirection == 'left' && this.state.direction !== 'right') ||
			(newDirection == 'up' && this.state.direction !== 'down') ||
			(newDirection == 'down' && this.state.direction !== 'up')) {
		this.state.newDirection = newDirection;
	}
};

Snake.Game.init();
