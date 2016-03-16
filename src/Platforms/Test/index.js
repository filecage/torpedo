'use strict';

var debug = require('debug')('torpedo:platform:test');

var Fleet = require('../../Game/Fleet');
var Platform = require('./../Platform');
var Grid = require('../../Game/Grid');

class Test extends Platform {
    constructor() {
        super();

        debug('creating grid and enemy fleet');
        this._grid = new Grid(10, 10);
        this._enemyFleet = Fleet.createRandomFleetOnGrid(this._grid, [4, 3, 3, 2, 2]);
        debug('done, waiting for Game to emit ready');

        this.on('ready', () => {
            debug('ready, starting in 3s');
            setTimeout(this.emit.bind(this, 'turn'), 3000);
        });
    }

    getEnemyGrid () {
        return this._grid;
    }
}

module.exports = Test;