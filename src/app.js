var Game = require('./Game');
var TestPlatform = require('./Platforms/Test');
var RandomStrategy = require('./Strategies/Random');

var game = new Game(new TestPlatform(), new RandomStrategy());

game.play();