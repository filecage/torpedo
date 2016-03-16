'use strict';

var phantom = require('phantom');
var debug = require('debug')('torpedo:platforms:battleship:browser');

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