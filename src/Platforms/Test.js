'use strict';

var Platform = require('./Platform');
var Grid = require('../Game/Grid');

class Test extends Platform {
    constructor() {
        super();
        this._grid = new Grid(10, 10);
    }
}

module.exports = Test;