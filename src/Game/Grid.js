'use strict';

var Field = require('./Field');

class Grid {

    constructor(width, height) {
        this._grid = this._buildGrid(width, height);
    }

    getGrid () {
        return this._grid;
    }

    getFieldAtPosition (x, y) {
        if (!this._grid[y] || !this._grid[y][x]) {
            return null;
        }

        return this._grid[y][x];
    }

    getVerticalLine(offset) {
        var _values = {};

        Object.keys(this._grid).forEach(rowIdx => {
            _values.push(this._grid[rowIdx][offset]);
        });

        return _values;
    }

    getHorizontalLine(offset) {
        return Object.values(this._grid[offset]);
    }

    getFieldsByState (state) {
        var _fields = [];

        Object.keys(this._grid).forEach(rowIdx => {
            var row = this._grid[rowIdx];
            Object.keys(row).forEach(fieldIdx => {
                var field = row[fieldIdx];
                if (field.getState() === state) {
                    _fields.push(field);
                }
            });
        });

        return _fields;
    }

    getFieldNeighbors (field, depth) {
        depth = depth || 1;
        var x = field.getX();
        var y = field.getY();

        return [
            this.getFieldAtPosition(x, y - depth),
            this.getFieldAtPosition(x + depth, y),
            this.getFieldAtPosition(x, y + depth),
            this.getFieldAtPosition(x - depth, y)
        ].filter(neighbor => {
            return neighbor !== null;
        });
    }

    getFieldNeighborsByState (field, state, depth) {
        depth = depth || 1;
        return this.getFieldNeighbors(field, depth).filter(function(neighbor){
            return neighbor.getState() === state;
        });
    }

    /**
     * @param {Field} field
     */
    getFieldNeighborsDiagonal (field) {
        var depth = 1;
        var x = field.getX();
        var y = field.getY();

        return [
            this.getFieldAtPosition(x - depth, y - depth),
            this.getFieldAtPosition(x + depth, y - depth),
            this.getFieldAtPosition(x - depth, y + depth),
            this.getFieldAtPosition(x + depth, y + depth)
        ].filter(neighbor => {
            return neighbor !== null;
        });
    }

    /**
     * @param {int} x
     * @param {int} y
     * @param {int} width
     * @param {int} height
     * @returns {Array}
     */
    getAreaNeighbors (x, y, width, height) {
        var neighbors = [];

        this._walkArea(x, y, width, height, (x, y) => {
            neighbors = neighbors.concat(this.getFieldNeighbors(this.getFieldAtPosition(x, y)));
        });

        return neighbors;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @param {int} width
     * @param {int} height
     * @returns {Array}
     */
    getAreaNeighborsDiagonal (x, y, width, height) {
        var neighbors =  [];

        this._walkArea(x, y, width, height, (x, y) => {
            neighbors = neighbors.concat(this.getFieldNeighborsDiagonal(this.getFieldAtPosition(x, y)));
        });

        return neighbors;
    }

    setFieldState (x, y, state) {
        if (!this._grid[y] || typeof this._grid[y][x] === 'undefined') {
            throw new Error('Unknown field');
        }

        this._grid[y][x].setState(state);

        return this;
    }

    /**
     * @param {int} x
     * @param {int} y
     * @param {int} width
     * @param {int} height
     * @param {function} callback
     * @returns {Grid}
     * @private
     */
    _walkArea(x, y, width, height, callback) {
        for(var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                if (this._grid[y + i] && this._grid[y + i][x + j]) {
                    callback.call(this, x + j, y + i);
                }
            }
        }

        return this;
    }

    /**
     * @param width
     * @param height
     * @returns {{}}
     * @private
     */
    _buildGrid(width, height) {
        var _field = {};

        for (var i = 0; i < height; i++) {
            var row = {};
            for (var j = 0; j < width; j++) {
                row[j] = new Field(j, i);
            }

            _field[i] = row;
        }

        return _field;
    }
}

module.exports = Grid;