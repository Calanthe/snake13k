var Snake = Snake || {};

Snake.Game = {};

Snake.Game.initStateValues = function() {
	this.state = {
		state: 'menu', // 'menu', 'play', 'end'
		snake: [],
		direction: 'right', // 'right', 'left', 'top', 'down'
		inputBuffer: [],
		board: [],
		boardWidth: 30,
		boardHeight: 30,
		borderOffset: {
			top: 4,
			bottom: 2,
			left: 2,
			right: 2
		},
		holeInTheWall: false,
		score: 0,
		level: 1,
		mode: 'snake',
		prevLength: null, // real snake length (during tron mode),
		foodEaten: 0,
		buggyBugTimeLeft: -1 // no buggy bug on the board
	};
};

// TODO: wrap in function and turn to local vars?
//       or make a 'class' with prototype
Snake.Game.vars = {
	then: null,
	animationId: null
};

Snake.Game.init = function() {
	this.sound = Snake.Sound;
	this.sound.init();

	this.initNewGame();

	this.ui.paint(this.state);

	this.controls.addListeners(this.onInput.bind(this));
};

Snake.Game.initNewGame = function() {
	this.initStateValues();

	this.ui = this.ui || Snake.UI;
	this.controls = this.controls || Snake.Controls;
	this.board = this.board || Snake.Board;

	this.ui.init(this.state);

	//initialise walls on the board
	this.board.initBoard(this.state);

	//initialise snake
	this.initSnake();

	//initialise food
	this.initFood();
};

Snake.Game.startNewGame = function() {
	this.state.state = 'play';

	this.vars.then = performance.now();

	//start the game
	this.startGameLoop();
};

Snake.Game.startGameLoop = function() {
	this.vars.animationId = window.requestAnimationFrame(this.startGameLoop.bind(this));

	var now = performance.now();
	var elapsed = now - this.vars.then;

	var fps = this.state.level + 4;
	// speed up in tron mode
	if (this.state.mode === 'tron') fps += 2;

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
	for (var i = 0; i < 5; i++) { //let's start with snake length 5
		//horizontal snake in the middle
		this.state.snake.push({x: ~~(this.state.boardWidth / 2) + i - 5, y: ~~(this.state.boardHeight / 2)});
	}
};

Snake.Game.random = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

Snake.Game.initFood = function() {
	this.initEdible('food');
};

Snake.Game.initBuggyBug = function() {
	this.initEdible('buggybug');
};

Snake.Game.initEdible = function(type) {
	var minX, maxX, minY, maxY, offset = 0;

	if (this.state.level === 1) { // food on first level always inside of the board
		offset = 1;
	}

	if (!this.state.holeInTheWall) {
		// if there is no hole in the wall yet let food show on walls but not outside
		minX = this.state.borderOffset.left + offset;
		maxX = this.state.boardWidth - this.state.borderOffset.right - 1 - offset;

		minY = this.state.borderOffset.top + offset;
		maxY = this.state.boardHeight - this.state.borderOffset.bottom - 1 - offset;
	} else {
		// if there is a hole, edible can be outside of the board walls
		minX = minY = 0; //TODO fix if buggybug is on the edge
		maxX = this.state.boardWidth - 1;
		maxY = this.state.boardHeight - 1;
	}

	//buggy bug has two parts so don't generate left side near the edge because right part won't fit
	if (type === 'buggybug') {
		maxX -= 1;
	}

	// make sure that the edible is not generated on the buggy bug, food or snake
	do {
		var randomX = this.random(minX, maxX);
		var randomY = this.random(minY, maxY);
	} while ((this.state.board[randomX][randomY].type === 'food')
		|| (this.state.board[randomX][randomY].type === 'buggybug')
		|| Snake.Game.ifCollidedWithSnake(randomX, randomY)
		||
			// exclude corners, so food don't show in wall corners if there is no hole yet
			// and then it doesn't show in invisible rounded corners
			((randomX === minX && randomY === minY)
			|| (randomX === minX && randomY === maxY)
			|| (randomX === maxX && randomY === minY)
			|| (randomX === maxX && randomY === maxY)));

	//if edible happens to be on wall glitch opposite wall so snake can go through
	if (this.state.board[randomX][randomY].type === 'wall') {
		this.board.glitchOppositeWall(randomX, randomY);
		this.state.holeInTheWall = true;
	}

	Snake.Game.state.board[randomX][randomY] = {
		type: type
	};

	if (type === 'buggybug') { // buggybug's body has two parts
		var bugNo = this.random(1, 3);
		Snake.Game.state.board[randomX][randomY].body = 'bug' + bugNo + 'Left'; // info about the body part
		Snake.Game.state.board[randomX + 1][randomY] = {
			type: type,
			body: 'bug' + bugNo + 'Right' // info about the body part
		};
		var timeout = this.getDistanceFromHead(randomX, randomY) + 10;
		timeout = timeout - (timeout % 10) + 10;
		this.state.buggyBugTimeLeft = timeout;
	}
};

Snake.Game.getDistanceFromHead = function(x, y) {
	var head = Snake.Game.state.snake[Snake.Game.state.snake.length - 1];
	return Math.abs(head.x - x) + Math.abs(head.y - y);
};

Snake.Game.tick = function() {
	this.update();
	this.ui.paint(this.state);
};

Snake.Game.update = function() {
	//take the snake's head
	var snakeX = this.state.snake[this.state.snake.length - 1].x;
	var snakeY = this.state.snake[this.state.snake.length - 1].y;

	var buggyBugOnBoard = this.findBuggyBugOnBoard();

	// update direction based on input
	if (this.state.inputBuffer.length) {
		do {
			var action = this.state.inputBuffer.shift();
		} while (
			// don't accept input with direction opposite to current
			(action === 'right' && this.state.direction === 'left') ||
			(action === 'left' && this.state.direction === 'right') ||
			(action === 'up' && this.state.direction === 'down') ||
			(action === 'down' && this.state.direction === 'up')
		);
		if (action) {
			this.sound.playMove(this.state.mode);
			this.state.direction = action;
		}
	}

	if (this.state.direction === 'right') snakeX++;
	else if (this.state.direction === 'left') snakeX--;
	else if (this.state.direction === 'up') snakeY--;
	else if (this.state.direction === 'down') snakeY++;

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

	//if the new head position matches the food
	if (this.state.board[snakeX][snakeY].type === 'food') {
		this.consumeFood(snakeX, snakeY);
	} else if (this.state.board[snakeX][snakeY].type === 'buggybug') { //if the head position matches the buggy bug
		this.consumeBuggyBug(snakeX, snakeY);
	} else {
		if (this.state.mode === 'snake') {
			this.state.snake.shift(); //remove the first cell - tail
			//make it smaller in every paint
			if (this.state.prevLength && this.state.snake.length > this.state.prevLength) {
				this.state.snake.shift();
			} else if (this.state.prevLength && this.state.snake.length === this.state.prevLength) { //no need to make it smaller anymore
				this.state.prevLength = null;
			}
			//make the snake smaller immediately
			// if (this.state.prevLength && this.state.snake.length > this.state.prevLength) {
			// 	var elementsNo = this.state.snake.length - this.state.prevLength;
			// 	this.state.snake.splice(0, elementsNo);
			// } else if (this.state.prevLength && this.state.snake.length === this.state.prevLength) { //no need to make it smaller anymore
			// 	this.state.prevLength = null;
			// }
		} else {
			this.state.score += 1; //score one point for every piece grown in tron mode
		}
	}

	this.checkCollision(snakeX, snakeY);

	if (this.state.board[snakeX][snakeY].type === 'wall'
		&& this.state.board[snakeX][snakeY].isGlitched) {
		this.sound.playGlitchedWall();
		// glitched wall is just one time use 'portal'
		this.state.board[snakeX][snakeY].isGlitched = false;
	}

	this.state.snake.push({
		x: snakeX,
		y: snakeY
	});

	if (buggyBugOnBoard.length === 2) {
		if (this.state.buggyBugTimeLeft === 1) {
			this.removeBuggyBug(buggyBugOnBoard[0].x, buggyBugOnBoard[0].y);
			this.state.buggyBugTimeLeft = -1;
		} else { //decrease remaining time of the buggyBug
			this.state.buggyBugTimeLeft--;
		}
	}
};

Snake.Game.consumeFood = function(snakeX, snakeY) {
	this.sound.playEatFood(this.state.mode);
	this.state.score += 4 + this.state.level;
	this.state.foodEaten += 1;
	if (this.state.foodEaten % 5 === 0) this.state.level += 1;
	this.state.mode = 'snake'; //fix the snake so the tail can move
	this.addEdible(); // add new food before removing old one (to prevent it showing on same place)
	this.state.board[snakeX][snakeY].type = '';
	if (this.state.prevLength) this.state.prevLength += 1;
};

Snake.Game.consumeBuggyBug = function(snakeX, snakeY) {
	this.sound.playEatBuggyBug();

	// trigger tron mode when buggy bug is eaten from left to right or right to left
	if (this.state.direction === 'right' || this.state.direction === 'left') {
		// add extra points and enlarge snake without moving the tail until normal food is eaten
		this.state.mode = 'tron';
		this.state.score += 1;
		this.state.prevLength = this.state.snake.length; // need to remember the actual length of the snake
	} else {
		this.state.score += 9 + this.state.level;
	}

	this.removeBuggyBug(snakeX, snakeY);
};

Snake.Game.removeBuggyBug = function(x, y) {
	this.state.board[x][y].type = '';
	if (this.state.board[x - 1] && this.state.board[x - 1][y].type === 'buggybug') { // remember to remove the second part of the bug
		this.state.board[x - 1][y].type = '';
	} else if (this.state.board[x + 1] && this.state.board[x + 1][y].type === 'buggybug') {
		this.state.board[x + 1][y].type = '';
	}
};

Snake.Game.findBuggyBugOnBoard = function() {
	var bug = [];

	this.state.board.forEach(function(row, indexX) {
		row.forEach(function(cell, indexY) {
			// filter only cells that are buggybug
			if (cell.type === 'buggybug') { // we should find two pieces
				bug.push({
					x: indexX,
					y: indexY,
					body: cell.body
				});
			}
		});
	});

	return bug;
};

Snake.Game.addEdible = function() {
	// TODO: random buggybug when we stop testing
	if (this.state.level > 2 /*&& Math.random() < 0.3*/ && !this.findBuggyBugOnBoard().length) {
		this.initBuggyBug();
	}
	this.initFood();
};

Snake.Game.checkCollision = function(snakeX, snakeY) {
	if (this.ifCollidedWithSnake(snakeX, snakeY) // if the snake will collide with itself
		|| (this.state.board[snakeX][snakeY].type === 'wall' // or if the snake will collide with the walls
				&& !this.state.board[snakeX][snakeY].isGlitched)) { // but not glitched walls

		this.sound.playDie(this.state.mode);
		//stop the game loop
		window.cancelAnimationFrame(this.vars.animationId);
		console.log('ifCollidedWithItself', this.ifCollidedWithSnake(snakeX, snakeY));
		console.log('ifCollidedWithWalls', this.state.board[snakeX][snakeY].type === 'wall');
		this.state.state = 'end';

		// pause input for a while, so end game screen is not closed by quick input
		this.state.pauseInput = true;
		setTimeout(function(state){
			state.pauseInput = false;
		}, 1000, this.state);
	}
};

Snake.Game.ifCollidedWithSnake = function(x, y) {
	//check if the x/y coordinates exist in the snake array
	return this.state.snake.filter(function(cell) {
		return cell.x === x && cell.y === y;
	}).length;
};

/* eslint no-fallthrough: "off" */

Snake.Game.onInput = function(action) {
	if (this.state.pauseInput) return;

	switch (this.state.state) {
	case 'end':
		Snake.Game.initNewGame();
		this.ui.paint(this.state);
		break;
	case 'menu':
		Snake.Game.startNewGame();
	default:
		if (action !== 'start') {
			this.state.inputBuffer.push(action);
		}
	}
};

Snake.Game.init();
