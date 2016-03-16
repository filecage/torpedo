'use strict';

var colors = require('colors/safe');

var Field = require('../Game/Field');

class Visualizer {
    visualizeField(field) {
        switch (field.getState()) {
            case Field.STATE.HIT:
                return colors.red.bold(' + ');
                break;

            case Field.STATE.SUNK:
                return colors.red(' X ');
                break;

            case Field.STATE.MISSED:
                return colors.cyan(' o ');
                break;

            default:
                return colors.cyan(' · ');
                break;
        }
    }
}

module.exports = Visualizer;