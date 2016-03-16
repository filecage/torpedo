'use strict';

var phantom = require('phantom');
var debug = require('debug')('torpedo:platforms:battleship:browser');

var Field = require('../../Game/Field');

class GameBrowser {
    constructor(id) {
        this._id = id;
        this._phantom = null;
        this._page = null;
    }

    prepare() {
        return this._preparePhantom()
            .then(this._preparePage.bind(this))
            .then(this._openGame.bind(this))
            .catch((error) => {
                throw new Error('an error occured: ' + error);
            });
    }

    startGame () {
        return this._page.evaluate(function() {
            $('.battlefield-start-button').click();
        });
    }

    isPlayable () {
        return new Promise((resolve, reject) => {
            this._page.evaluate(function(){
                return !$('.battlefield__rival').is('.battlefield__wait');
            }).then((playable) => {
                if (playable) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    shootField(x, y) {
        return this._page.evaluate(function(x, y){
            $('.battlefield__rival').find('[data-x="' + x + '"][data-y="' + y + '"]').click();
        }, x, y);
    }

    getStateByClassName(className) {
        if (className.match(/battlefield-cell__empty/)) {
            return Field.STATE.UNKNOWN;
        } else if (className.match(/battlefield-cell__hit/)) {
            return Field.STATE.HIT;
        } else if (className.match(/battlefield-cell__miss/)) {
            return Field.STATE.MISSED;
        } else if (className.match(/battlefield-cell__done/)) {
            return Field.STATE.SUNK;
        }

        console.log(className);
        throw new Error('Unknown field state');
    }

    _preparePhantom () {
        return phantom.create();
    }

    _preparePage(phantom) {
        this._phantom = phantom;

        return phantom.createPage();
    }

    _openGame(page) {
        debug('opening game at http://de.battleship-game.org/id%d', this._id);
        this._page = page;

        return page.open('http://de.battleship-game.org/id' + this._id);
    }
}

module.exports = GameBrowser;