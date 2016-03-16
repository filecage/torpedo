'use strict';

var Field = require('../Game/Field');

class Visualizer {
    visualizeField(field) {
        switch (field.getState()) {
            case Field.STATE.HIT:
                return ' + ';
                break;

            case Field.STATE.SUNK:
                return ' X ';
                break;

            case Field.STATE.MISSED:
                return ' o ';
                break;

            default:
                return ' · ';
                break;
        }
    }
}

module.exports = Visualizer;