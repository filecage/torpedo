'use strict';

var debug = require('debug')('torpedo:platforms:battleship');
var argv = require('minimist')(process.argv.slice(2));

var GridDrawer = require('../../Helper/GridDrawer');
var Grid = require('../../Game/Grid');
var Platform = require('../Platform');
var GameBrowser = require('./GameBrowser');

class Battleship extends Platform {
    constructor() {
        if (!argv.id) {
            debug('ERROR: no battleship-game.org id given (use with --id=<id>)');
            process.exit(1);
        }

        super();
        this._grid = new Grid(10, 10);
        this._gridDrawer = new GridDrawer(this._grid);
        this._browser = new GameBrowser(argv.id);
        this._lastNotice = null;

        var preparation = this._browser.prepare()
            .then(this._browser.randomizeFleet.bind(this._browser))
            .then(() => {
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

    getEnemyGrid () {
        return this._grid;
    }

    shootAt (field) {
        this._browser.shootField(field.getX(), field.getY())
            .then(this._wait.bind(this, 500))
            .then(this._updateGrid.bind(this))
            .then(this._drawGrid.bind(this))
            .then(this._checkGameStatus.bind(this))
            .then(this._checkPlayableStatus.bind(this))
            .catch(error=> {
                console.error(error);
                process.exit(1);
            });
    }

    _updateGrid () {
        return new Promise((resolve) => {
            this._browser.getFields()
                .then(fields => {
                    fields.forEach(field => {
                        this._grid.setFieldState(field.x, field.y, this._browser.getStateByClassName(field.classes));
                    });

                    resolve();
                });
        });
    }

    _drawGrid () {
        this._gridDrawer.drawToConsole();
    }

    _wait(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve.bind(), ms);
        });
    }

    _checkGameStatus () {
        return new Promise((resolve, reject) => {
            this._browser.getNotice()
                .then((notice) => {
                    if (!notice || notice.message == this._lastNotice) {
                        return resolve();
                    }

                    debug('game says: %s', notice.message);
                    if (notice.classes.match(/game-over-win/)) {
                        this.emit('win');
                        debug('we won that game, nice!');
                    }

                    this._lastNotice = notice.message;
                    resolve();
                });
        })
    }

    _checkPlayableStatus() {
        this._browser.isPlayable()
            .then(() => {
                this.emit('turn');
            }, (error) => {
                if (error) {
                    console.log(error);
                }

                this._checkGameStatus().then(() => {
                    setTimeout(this._checkPlayableStatus.bind(this), 1000);
                });
            })
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });

        return this;
    }
}

module.exports = Battleship;