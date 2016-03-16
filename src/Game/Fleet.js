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

    getShipAtPosition(x, y) {
        var targetShip = null;
        this._ships.some(ship => {
            return ship.getFields().some(field => {
                if (field.getX() === x && field.getY() === y) {
                    targetShip = ship;
                    return true;
                }

                return false;
            })
        });

        return targetShip;
    }
}

module.exports = Fleet;