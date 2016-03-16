'use strict';

var colors = require('colors/safe');

var Visualizer = require('./Visualizer');
var Ship = require('../Game/Ship');

class FleetVisualizer extends Visualizer {
    /**
     * @param {Fleet} fleet
     */
    constructor(fleet) {
        super();
        this._fleet = fleet;
    }

    /**
     * @param {Field} field
     */
    visualizeField(field) {
        // check if there is a ship at this position
        var ship = this._fleet.getShipAtPosition(field.getX(), field.getY());
        if (ship) {
            return colors.grey.bgWhite.bold(ship.getOrientation() === Ship.ORIENTATION.VERTICAL ? ' | ' : ' - ');
        }

        return super.visualizeField(field);
    }
}

module.exports = FleetVisualizer;