'use strict';

var _ = require('lodash');

var StrategyInterface = require('./StrategyInterface');
var Field = require('../Game/Field');

class Random extends StrategyInterface {
    /**
     * @param {Grid} grid
     */
    getTargetField (grid) {
        return _.shuffle(grid.getFieldsByState(Field.STATE.UNKNOWN)).pop();
    }
}