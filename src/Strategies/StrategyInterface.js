'use strict';

class StrategyInterface {
    getTargetField (grid) {
        throw new Error('Strategy must implement getTargetField method');
    }
}

module.exports = StrategyInterface;