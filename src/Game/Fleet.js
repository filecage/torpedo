'use strict';

var _ = require('lodash');
var Ship = require('./Ship');
var Field = require('./Field');

class Fleet {

    /**
     * @param {Grid} grid
     * @param shipSizes
     */
    static createRandomFleetOnGrid(grid, shipSizes) {
        var fleet = new Fleet();

        shipSizes.forEach(shipSize => {
            var possibleAreas = [];

            // checking if the complete area is free
            grid.getFieldsByState(Field.STATE.UNKNOWN)
                .forEach(field => {
                    var horizontal = grid.getAreaFields(field.getX(), field.getY(),shipSize, 1);
                    var vertical = grid.getAreaFields(field.getX(), field.getY(), 1, shipSize);

                    if (Field.filterByState(horizontal, Field.STATE.UNKNOWN).length === shipSize) {
                        possibleAreas.push({
                            x: field.getX(),
                            y: field.getY(),
                            width: shipSize,
                            height: 1
                        });
                    }

                    if (Field.filterByState(vertical, Field.STATE.UNKNOWN).length === shipSize) {
                        possibleAreas.push({
                            x: field.getX(),
                            y: field.getY(),
                            width: 1,
                            height: shipSize
                        });
                    }
                });

            // verify that there is no neighbor ship
            possibleAreas = possibleAreas.filter(area => {
                return !fleet.getShipAtPosition(area.x, area.y) && !grid.getAreaNeighborsWithDiagonal(area.x, area.y, area.width, area.height).some(neighbor => {
                    return !!fleet.getShipAtPosition(neighbor.getX(), neighbor.getY());
                });
            });

            if (!possibleAreas.length) {
                throw new Error('unable to place all ships on the battlefield');
            }

            // choose some random area and place the ship
            var position = _.shuffle(possibleAreas).pop();
            var ship = new Ship(grid.getAreaFields(position.x, position.y, position.width, position.height));

            fleet.addShip(ship);
        });

        return fleet;

    }

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
        // filter all sunk ships
        var ships = this._ships.filter(ship => {
            return ship.getState() !== Ship.STATE.SUNK;
        });

        if (ships.length === 0) {
            // no ships left, the fleet is sunk
            return Ship.STATE.SUNK;
        }

        var state = Ship.STATE.HEALTHY;
        ships.forEach(ship => {
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