'use strict';

/**
 * @abstract
 */
class Platform {
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