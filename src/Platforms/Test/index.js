'use strict';

var Fleet = require('../../Game/Fleet');
var Platform = require('./../Platform');
var Grid = require('../../Game/Grid');

class Test extends Platform {
    constructor() {
        super();
        this._grid = new Grid(10, 10);
        this._enemyFleet = Fleet.createRandomFleetOnGrid(this._grid, [4, 3, 3, 2, 2]);

        this.on('ready', () => {
            setTimeout(this.emit.bind(this, 'turn'), 5000);
        });
    }
}

module.exports = Test;