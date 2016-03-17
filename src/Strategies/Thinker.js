'use strict';

var debug = require('debug')('torpedo:strategies:thinker');

var StrategyInterface = require('./StrategyInterface');
var Field = require('../Game/Field');

var Hunter = require('./Hunter');
var Random = require('./Random');

class Thinker extends StrategyInterface {

    constructor() {
        super();
        this._hunter = new Hunter();
        this._random = new Random();
    }

    getTargetField(grid) {
        debug('checking if theres a hunted target');
        var hunted = this._hunter.findFinishingFieldsOnGrid(grid);
        if (hunted.length) {
            debug('there are %d possible targets', hunted.length);
            return hunted.shift();
        }

        // we assume 4 as the biggest ship
        var shipSizes = [4, 3, 2];
        var weighting = new Map();

        shipSizes.forEach(shipSize => {
            var possibleAreas = [];
            grid.getFieldsByState(Field.STATE.UNKNOWN).forEach(field => {
                var horizontal = grid.getAreaFields(field.getX(), field.getY(), shipSize, 1);
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

            // now walk through all possible areas and add points for each field
            possibleAreas.forEach(area => {
                grid.getAreaFields(area.x, area.y, area.width, area.height)
                    .forEach(field => {
                        if (!weighting.has(field)) {
                            weighting.set(field, 0);
                        }

                        weighting.set(field, weighting.get(field) + 1);
                    });
            });
        });

        return [...weighting.entries()].sort((a, b) => a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0)
            .pop()[0];
    }
}

module.exports = Thinker;