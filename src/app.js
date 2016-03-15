var Game = require('./Game');
var Grid = require('./Game/Grid');
var Field = require('./Game/Field');

var mine = new Grid(10, 10);
var enemy = new Grid(10, 10);

var game = new Game(mine, enemy);

enemy.setFieldState(3, 3, Field.STATE.MISSED);
enemy.setFieldState(1, 1, Field.STATE.HIT);
enemy.setFieldState(1, 2, Field.STATE.HIT);
enemy.setFieldState(6, 5, Field.STATE.MISSED);
enemy.setFieldState(5, 6, Field.STATE.MISSED);

console.log(game._findFinishingFields(enemy));