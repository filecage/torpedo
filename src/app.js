var debug = require('debug')('torpedo');
var format = require('util').format;
var argv = require('minimist')(process.argv.slice(2));

var Platform = require(format('./Platforms/%s', argv.platform || 'Test'));
var Strategy = require(format('./Strategies/%s', argv.strategy || 'Random'));
var Game = require('./Game');

var platform = new Platform();

var game = new Game(platform, new Strategy());

(() => {
    var rounds = 0;
    platform
        .on('turn', () => {
            rounds++;
        })
        .on('win', () => {
            debug('game won after %d rounds', rounds);
            process.exit(0);
        })
        .on('lose', () => {
            debug('game lost after %d rounds', rounds);
        });
})();

game.play();