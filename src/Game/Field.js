'use strict';

var STATE_UNKNOWN = 0;
var STATE_MISSED = 1;
var STATE_HIT = 2;
var STATE_SUNK = 3;

class Field {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._state = STATE_UNKNOWN;
    }

    getX() {
        return this._x;
    }

    getY() {
        return this._y;
    }

    getState() {
        return this._state;
    }

    setState(state) {
        this._state = state;

        return this;
    }
}

Field.STATE = {
    UNKNOWN : STATE_UNKNOWN,
    MISSED : STATE_MISSED,
    HIT : STATE_HIT,
    SUNK : STATE_SUNK
};

module.exports = Field;