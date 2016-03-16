'use strict';

var debug = require('debug')('torpedo:Game');
var format = require('util').format;

var Grid = require('./Grid');
var Field = require('./Field');

var TURN_MYSELF = 1;
var TURN_ENEMY = 2;

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

        debug('now playing the freaking game!');
    }

    _turn () {
        debug('my turn');
        var target = null;
        var grid = this._platform.getEnemyGrid();

        debug('finding fields to frag an already hit ship..');
        var finishingFields = this._findFinishingFields(grid);
        if (finishingFields.length) {
            debug('found %d finishing fields', finishingFields.length);
            target = finishingFields.shift();
        } else {
            debug('no finishing fields found, getting target by strategy');
            target = this._strategy.getTargetField(grid);
        }

        if (target) {
            debug('shooting at %d/%d', target.getX(), target.getY());
            this._platform.shootAt(target);
        } else {
            debug('no target found, is the game over?');
        }
    }

    _findFinishingFields (grid) {
        var finishingFields = [];
        var hit = grid.getFieldsByState(Field.STATE.HIT);
        hit.forEach(field => {
            finishingFields = finishingFields.concat(
                grid.getFieldNeighbors(field)
                    .filter(neighbor => {
                        return this._isShootable(grid, neighbor);
                    })
            );
        });

        finishingFields.sort((a, b) => {
            return grid.getFieldNeighborsByState(b, Field.STATE.HIT, 2).length - grid.getFieldNeighborsByState(a, Field.STATE.HIT, 2).length;
        });

        return finishingFields;
    }

    _isShootable(grid, field) {
        return field.getState() === Field.STATE.UNKNOWN && grid.getFieldNeighbors(field).filter(neighbor => {
            return neighbor.getState() >= Field.STATE.SUNK;
        }).length === 0;
    }
}

module.exports = Game;