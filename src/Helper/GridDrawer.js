'use strict';

var Field = require('../Game/Field');
var DefaultVisualizer = require('./Visualizer');

class GridDrawer {
    /**
     * @param {Grid} grid
     * @param {Visualizer} visualizer
     */
    constructor(grid, visualizer) {
        this._grid = grid;
        this._visualizer = visualizer || new DefaultVisualizer;
    }

    drawToConsole() {
        var rawGrid = this._grid.getGrid();
        var width = Object.keys(rawGrid[Object.keys(rawGrid).shift()]).length;

        console.log('%s', '#'.repeat(width * 3));
        Object.keys(rawGrid).forEach(rowIndex => {
            var drawnRow = '';
            Object.keys(rawGrid[rowIndex]).forEach(fieldIndex => {
                drawnRow += this._visualizer.visualizeField(rawGrid[rowIndex][fieldIndex]);
            });

            console.log(drawnRow);
        });

        console.log('%s', '#'.repeat(width * 3));
    }
}

module.exports = GridDrawer;