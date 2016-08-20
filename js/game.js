var Snake = Snake || {};

Snake.canvas = document.getElementById("c");
Snake.ctx = Snake.canvas.getContext("2d");
Snake.canvasW = 800;
Snake.canvasH = 800;
Snake.cellWH = 20;
Snake.snakeArray = [];
Snake.direction;
Snake.score = 0;

Snake.Game = {};

Snake.Game.init = function() {
	Snake.direction = 'right';

	//the game loop
	//game_loop = setInterval(paint, 60);
	console.log('init');
	Snake.UI.init();
};
