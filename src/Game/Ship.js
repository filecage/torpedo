'use strict';

var _ = require('lodash');

var Field = require('./Field');

var STATE_HEALTHY = 0;
var STATE_WOUNDED = 1;
var STATE_SUNK = 2;

var ORIENTATION_UNKNOWN = 'unknown';
var ORIENTATION_HORIZONTAL = 'horizontal';
var ORIENTATION_VERTICAL = 'vertical';

class Ship {
    constructor(fields) {
        fields = fields || [];
        this._fields = fields;
    }

    getLength () {
        return this._fields.length;
    }

    getOrientation () {
        if (this._fields.length <= 1) {
            // we do not know anything about the orientation if there is only 1 or less known fields
            return ORIENTATION_UNKNOWN;
        }

        var values = {
            horizontal: [],
            vertical: []
        };

        this._fields.forEach(field => {
            values.vertical.push(field.getY());
            values.horizontal.push(field.getX());
        });

        if (_.uniq(values.vertical).length === 1) {
            return ORIENTATION_VERTICAL;
        } else if (_.uniq(values.horizontal).length === 1) {
            return ORIENTATION_HORIZONTAL;
        }

        throw new Error('invalid ship position, ship has multiple horizontal AND vertical values');
    }

    /**
     * @param {Field} field
     * @returns {Ship}
     */
    addField(field) {
        this._fields.push(field);

        return this;
    }

    getState () {
        // if we do not know about the fields, the ship is healthy
        if (!this._fields.length) {
            return STATE_HEALTHY;
        }

        var fieldsByState = {
            hit : [],
            healthy : []
        };

        this._fields.forEach(field => {
            if (field.getState() > Field.STATE.UNKNOWN) {
                fieldsByState.hit.push(field);
            } else {
                fieldsByState.healthy.push(field);
            }
        });

        if (!fieldsByState.healthy.length) {
            // no healthy fields means the ship is sunk
            return STATE_SUNK;
        } else if (!fieldsByState.hit.length) {
            // no hit fields means the ship is healthy
            return STATE_HEALTHY;
        }

        // anything between these states means the ship is wounded
        return STATE_WOUNDED;
    }
}

Ship.STATE = {
    HEALTHY: STATE_HEALTHY,
    WOUNDED: STATE_WOUNDED,
    SUNK: STATE_SUNK
};

module.exports = Ship;