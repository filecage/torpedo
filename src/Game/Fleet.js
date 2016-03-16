'use strict';

var Ship = require('./Ship');

class Fleet {
    constructor () {
        this._ships = [];
    }

    /**
     * @param {Ship} ship
     * @returns {Fleet}
     */
    addShip (ship) {
        this._ships.push(ship);

        return this;
    }

    getState() {
        var state = Ship.STATE.HEALTHY;
        this._ships.forEach(ship => {
            state = Math.max(ship.getState(), state);
        });

        return state;
    }
}

module.exports = Fleet;