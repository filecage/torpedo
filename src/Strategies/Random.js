'use strict';

var _ = require('lodash');
var debug = require('debug')('torpedo:strategies:random');

var StrategyInterface = require('./StrategyInterface');
var Field = require('../Game/Field');

class Random extends StrategyInterface {
    /**
     * @param {Grid} grid
     */
    getTargetField (grid) {
        debug('choosing a random field');
        return _.shuffle(grid.getFieldsByState(Field.STATE.UNKNOWN)).pop();
    }
}

module.exports = Random;