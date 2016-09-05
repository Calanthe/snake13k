/* global jsfxr */
/* eslint no-sparse-arrays: "off" */

// Based on:
// https://github.com/mneubrand/jsfxr

var Snake = Snake || {};

Snake.Sound = {
	sounds: {
		snakeEat: jsfxr([1,,0.1114,,0.1243,0.4982,,,,,,,,,,,,,1,,,0.1,,0.5]),
		snakeHit: jsfxr([0,,0.01,,0.2869,0.5177,,-0.4476,,,,,,0.11,,,,,1,,,,,0.5]),
		tronEat: jsfxr([0,,0.0151,0.4104,0.1648,0.6155,,,,,,,,,,,,,1,,,,,0.5]),
		tronHit: jsfxr([3,,0.2394,0.4801,0.1741,0.3551,,-0.3345,,,,0.1722,0.6674,,,,,,1,,,,,0.5])
	}
};

Snake.Sound.init = function() {
	this.player = new Audio();
};

Snake.Sound.play = function(name) {
	this.player.src = this.sounds[name];
	this.player.play();
};
