'use strict';

var Field = require('../Game/Field');

class GridDrawer {
    /**
     * @param {Grid} grid
     */
    constructor(grid) {
        this._grid = grid;
    }

    drawToConsole() {
        var rawGrid = this._grid.getGrid();
        var height = Object.keys(rawGrid).length;
        var width = Object.keys(rawGrid[Object.keys(rawGrid).shift()]).length;

        console.log('%s', '#'.repeat(width * 3));
        Object.keys(rawGrid).forEach(rowIndex => {
            var drawnRow = '';
            Object.keys(rawGrid[rowIndex]).forEach(fieldIndex => {
                switch (rawGrid[rowIndex][fieldIndex].getState()) {
                    case Field.STATE.HIT:
                        drawnRow += ' + ';
                        break;

                    case Field.STATE.SUNK:
                        drawnRow += ' X ';
                        break;

                    case Field.STATE.MISSED:
                        drawnRow += ' o ';
                        break;

                    default:
                        drawnRow += ' · ';
                        break;
                }
            });

            console.log(drawnRow);
        });

        console.log('%s', '#'.repeat(width * 3));
    }
}

module.exports = GridDrawer;