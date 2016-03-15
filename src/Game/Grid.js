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

    setFieldState (x, y, state) {
        if (!this._grid[y] || typeof this._grid[y][x] === 'undefined') {
            throw new Error('Unknown field');
        }

        this._grid[y][x].setState(state);

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