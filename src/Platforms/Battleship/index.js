'use strict';

var debug = require('debug')('torpedo:platforms:battleship');
var argv = require('minimist')(process.argv.slice(2));
var Platform = require('../Platform');
var GameBrowser = require('./GameBrowser');

class Battleship extends Platform {
    constructor() {
        if (!argv.id) {
            debug('ERROR: no battleship-game.org id given (use with --id=<id>)');
            process.exit(1);
        }

        super();
        this._browser = new GameBrowser(argv.id);
        var preparation = this._browser.prepare().then(() => {
            debug('browser seems to be ready');
        });

        this.on('ready', () => {
            preparation.then(() => {
                this._browser.startGame().then(() => {
                    debug('game started');
                    this._checkPlayableStatus();
                });
            });
        });

        debug('initializing game browser to game ID %d' , argv.id);
    }

    _checkPlayableStatus() {
        this._browser.isPlayable()
            .then(() => {
                this.emit('turn');
            }, (error) => {
                if (error) {
                    console.log(error);
                }

                setTimeout(this._checkPlayableStatus.bind(this), 1000);
            })
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });

        return this;
    }
}

module.exports = Battleship;