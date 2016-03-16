'use strict';

var debug = require('debug')('torpedo:platform:test');

var Fleet = require('../../Game/Fleet');
var Platform = require('./../Platform');
var Field = require('../../Game/Field');
var Ship = require('../../Game/Ship');
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

    shootAt(field) {
        var x = field.getX();
        var y = field.getY();

        var ship = this._enemyFleet.getShipAtPosition(x, y);
        if (ship) {
            debug('thats a hit!');
            field.setState(Field.STATE.HIT);

            if (ship.getState() === Ship.STATE.SUNK) {
                debug('the ship is sinking, blub blub');
                ship.setFieldStates(Field.STATE.SUNK);
            }
        } else {
            field.setState(Field.STATE.MISSED);
        }

        if (this._enemyFleet.getState() === Ship.STATE.SUNK) {
            debug('enemy fleet sunk! congratulations.');
            return;
        }

        debug('waiting 1s for next shot');
        setTimeout(this.emit.bind(this, 'turn'), 1000);
    }
}

module.exports = Test;