var Game = require('./Game');
var Platform = require('./Platforms/Battleship');
var RandomStrategy = require('./Strategies/Random');

var game = new Game(new Platform(), new RandomStrategy());

game.play();