'use strict';

var StrategyInterface = require('./StrategyInterface');
var Field = require('../Game/Field');
var RandomStrategy = require('./Random');

class Hunter extends StrategyInterface {

    constructor() {
        super();
        this._randomStrategy = new RandomStrategy;
    }

    getTargetField (grid) {
        debug('finding fields to frag an already hit ship..');
        var finishingFields = this.findFinishingFieldsOnGrid(grid);
        if (finishingFields.length) {
            debug('found %d finishing fields', finishingFields.length);
            return finishingFields.shift();
        } else {
            debug('no finishing fields found, getting target by strategy');
            return this._randomStrategy.getTargetField(grid);
        }
    }

    /**
     * @param {Grid} grid
     * @returns {Array}
     */
    findFinishingFieldsOnGrid (grid) {
        var finishingFields = [];
        var hit = grid.getFieldsByState(Field.STATE.HIT);
        hit.forEach(field => {
            finishingFields = finishingFields.concat(
                grid.getFieldNeighbors(field)
                    .filter(neighbor => {
                        return this._isShootable(grid, neighbor);
                    })
            );
        });

        finishingFields.sort((a, b) => {
            return grid.getFieldNeighborsByState(b, Field.STATE.HIT, 2).length - grid.getFieldNeighborsByState(a, Field.STATE.HIT, 2).length;
        });

        return finishingFields;
    }

    /**
     * @param {Grid} grid
     * @param {Field} field
     * @returns {boolean}
     * @private
     */
    _isShootable(grid, field) {
        return field.getState() === Field.STATE.UNKNOWN && grid.getFieldNeighbors(field).filter(neighbor => {
            return neighbor.getState() >= Field.STATE.SUNK;
        }).length === 0;
    }
}

module.exports = Hunter;