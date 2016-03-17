var debug = require('debug')('torpedo');
var Game = require('./Game');
var Platform = require('./Platforms/Test');
var Strategy = require('./Strategies/Random');

var platform = new Platform();

var game = new Game(platform, new Strategy());

(() => {
    var rounds = 0;
    platform
    .on('turn', () => {
        rounds++;
    }).on('win', () => {
        debug('game won after %d rounds', rounds);
        process.exit(0);
    });
})();

game.play();