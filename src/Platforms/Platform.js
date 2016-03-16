'use strict';

var EventEmitter = require('events').EventEmitter;

/**
 * @abstract
 */
class Platform extends EventEmitter {

    constructor() {
        super();
    }

    /**
     * @return {Grid}
     */
    getEnemyGrid() {
        throw new Error('Platform must implement method getEnemyGrid()');
    }

    /**
     * @param {Field} field
     */
    shootAt(field) {
        throw new Error('Platform must implement method shootAt')
    }
}

module.exports = Platform;