// LEVEL LAYOUT
// base levels are x1 - 3
// all base levels have at least 3 computers
// levels x4 and x5 have 4 and 5 computers
// a random computer in each level is a desk with/and printer
// levels have enemies starting with 1
// new enemies are introduced every 5 levels
// levels 1 - 3 have 2 enemies
// base levels have 3 level 1 enemies
// 4 and 5 have 3 and 4 enemies, plus leveled enemies from previous levels

var levels = {
    1: {
        'enemies': {
            1: 2
        },
        'obstacles': {
            'desk': 3
        }
    },
    2: {
        'enemies': {
            1: 2
        },
        'obstacles': {
            'desk': 3
        }
    },
    3: {
        'enemies': {
            1: 3
        },
        'obstacles': {
            'desk': 2,
            'deskWithPrinter': 1,
            'printer': 1
        }
    },
    4: {
        'enemies': {
            1: 4
        },
        'obstacles': {
            'desk': 4,
        }
    },
    5: {
        'enemies': {
            1: 5
        },
        'obstacles': {
            'desk': 4,
            'deskWithPrinter': 1,
            'printer': 1
        }
    },
    6: {
        'enemies': {
            1: 3,
            2: 1
        },
        'obstacles': {
            'desk': 3,
        }
    }
}

var elevator;

function drawLevel() {
    // bgtile = game.add.tileSprite(0, 0, game.world.bounds.width, game.world.height, 'background');

    // walls = game.add.group();
    // walls.enableBody = true;

    var o = null;
    var t = 'taken';
    var wallsArray = [
        [0, 4, 9, 9, 5, o, 5, 9, 9, 4, 1],
        [6, o, o, o, o, o, o, o, o, o, 7],
        [6, o, t, t, t, o, t, t, t, o, 7],
        [6, o, o, o, o, o, o, o, o, o, 7],
        [6, o, t, t, t, o, t, t, t, o, 7],
        [6, o, o, o, o, o, o, o, o, o, 7],
        [6, o, t, t, t, o, t, t, t, o, 7],
        [6, o, o, o, o, o, o, o, o, o, 7],
        [2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3],
    ]

    var x = 0;
    var y = 0;
    var printerExists = false;
    for (var i = 0; i < wallsArray.length; i++) {
        y = i * 32;

        for (var j = 0; j < wallsArray[i].length; j++) {
            x = j * 32;
            if (wallsArray[i][j] == t) {
                var element = game.rnd.integerInRange(1, 5);
                // switch (element) {
                //     case 1: createObstacle('desk', x, y); break;
                //     case 2:
                //         if (!printerExists) {
                //             createObstacle('printer', x, y); 
                //             printerExists = true;
                //             break;
                //         }
                //     case 3: 
                //         if (!printerExists) {
                //             createObstacle('deskWithPrinter', x, y);
                //             break;
                //         }
                //     case 4: createEnemy(2, 1); break;
                //     case 6, 7, 8, 9, 10: break; // leave space empty
                    
                // }
            } else if (wallsArray[i][j] != null) {
                bgtile = walls.create(x, y, 'walls');
                bgtile.frame = wallsArray[i][j];

                // accommodate for corners
                if (wallsArray[i][j] == 2) {
                    bgtile.body.setSize(11, 32, 0, 0);
                    bgtile = walls.create(x, y, 'walls');
                    bgtile.frame = wallsArray[i][j];
                    bgtile.body.setSize(32, 11, 0, 21);
                }
                if (wallsArray[i][j] == 3) {
                    bgtile.body.setSize(32, 11, 21, 0);
                    bgtile = walls.create(x, y, 'walls');
                    bgtile.frame = wallsArray[i][j];
                    bgtile.body.setSize(11, 32, 0, 21);
                }

                // accommodate for side and bottom
                if (wallsArray[i][j] == 6) {
                    bgtile.body.setSize(11, 32, 0, 0);
                }
                if (wallsArray[i][j] == 7) {
                    bgtile.body.setSize(11, 32, 21, 0);
                }
                if (wallsArray[i][j] == 8) {
                    bgtile.body.setSize(32, 11, 0, 21);
                }
            }
        }
    }

    elevator = walls.create(160, 0, 'walls');
    elevator.frame = 10;
    elevator.ready = false;
    elevator.animations.add(
        'ready', Phaser.Animation.generateFrameNames('walls ', 11, 11, '.ase'), 1, false);
    elevator.animations.add(
        'open', Phaser.Animation.generateFrameNames('walls ', 12, 16, '.ase'), 7, false);
    elevator.animations.add(
        'close', Phaser.Animation.generateFrameNames('walls ', 10, 16, '.ase').reverse(), 7, false);
    elevator.open = function () {
        if (!elevator.ready) {
            elevator.ready = true;
            this.animations.play('ready');
            this.animations.currentAnim.onComplete.add(function() {
                this.animations.play('open');
                this.body.setSize(32, 12, 0, 0);
            }, this);
        }
    }
    walls.setAll('body.immovable', true);
}