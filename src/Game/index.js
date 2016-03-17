'use strict';

var debug = require('debug')('torpedo:Game');
var format = require('util').format;

var Grid = require('./Grid');
var Field = require('./Field');

class Game {
    /**
     * @param {Platform} platform
     * @param {StrategyInterface} strategy
     */
    constructor(platform, strategy) {
        this._platform = platform;
        this._strategy = strategy;

        debug('new game created');
    }

    play() {
        this._platform
            .on('turn', this._turn.bind(this))
            .emit('ready');
    }

    _turn () {
        debug('my turn');
        var target = this._strategy.getTargetField(this._platform.getEnemyGrid());

        if (target) {
            debug('shooting at %d/%d', target.getX(), target.getY());
            this._platform.shootAt(target);
        } else {
            debug('no target found, is the game over?');
        }
    }
}

module.exports = Game;