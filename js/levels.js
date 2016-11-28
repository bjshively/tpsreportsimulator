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
            1: 1
        },
        'obstacles': {
            'desk': 1
        }
    },
    2: {
        'enemies': {
            1: 1
        },
        'obstacles': {
            'desk': 1
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
            'desk': 4
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
            'desk': 3
        }
    }
}

var elevator;

function drawLevel(inclusions) {
    // bgtile = game.add.tileSprite(0, 0, game.world.bounds.width, game.world.height, 'background');

    // walls = game.add.group();
    // walls.enableBody = true;

    var o = null;
    var T = 'taken';
    var wallsArray = [
        [0, 4, 9, 9, 5, o, 5, 9, 9, 4, 1],
        [6, o, o, o, o, o, o, o, o, o, 7],
        [6, o, T, T, T, o, T, T, T, o, 7],
        [6, o, o, o, o, o, o, o, o, o, 7],
        [6, o, T, T, T, o, T, T, T, o, 7],
        [6, o, o, o, o, o, o, o, o, o, 7],
        [6, o, T, T, T, o, T, T, T, o, 7],
        [6, o, o, o, o, o, o, o, o, o, 7],
        [2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3],
    ];
    // var currentLevel = levels[player.level];
    // var currentLevelEnemies = currentLevel['enemies'];
    // var currentLevelObstacles = currentLevel['obstacles'];
    // player.makeInvincible();

    // for (var i = 0; i < currentLevelEnemies[1]; i++) {
    //     createEnemy('1', 2, 1);
    // }
    // for (var i = 0; i < currentLevelEnemies[2]; i++) {
    //     createEnemy('2', 3, 1);
    // }
    // for (var i = 0; i < currentLevelEnemies[3]; i++) {
    //     createEnemy('3', 4, 2);
    // }
    // for (var i = 0; i < currentLevelEnemies[4]; i++) {
    //     createEnemy('4', 5, 3);
    // }
    // for (var i = 0; i < currentLevelEnemies[5]; i++) {
    //     createEnemy('5', 6, 4);
    // }

    // for (obstacle in currentLevelObstacles) {
    //     for (var i = 0; i < currentLevelObstacles[obstacle]; i++) {
    //         createObstacle(
    //             obstacle,
    //             game.rnd.integerInRange(64, 288),
    //             game.rnd.integerInRange(64, 200)
    //         );
    //     }
    // }

    var x = 0;
    var y = 0;
    for (var i = 0; i < wallsArray.length; i++) {
        y = i * 32;

        for (var j = 0; j < wallsArray[i].length; j++) {
            x = j * 32;
            if (wallsArray[i][j] == T) {
                // var element = game.rnd.integerInRange(1, 5);
                // switch (element) {
                //     case 1: 
                //         createObstacle('desk', x, y); 
                //         break;
                //     case 2:
                //         createObstacle('printer', x, y); 
                //         break;
                //     case 3: 
                //         createObstacle('deskWithPrinter', x, y);
                //         break;
                //     case 4: 
                //         createEnemy(2, 1);
                //         break;                    
                // }
            } else if (wallsArray[i][j] != null) {
                bgtile = walls.create(x, y, 'walls');
                bgtile.frame = wallsArray[i][j];

                // accommodate colliders for corners
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

                // accommodate colliders for side and bottom
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
    elevator.starting = false;
    elevator.isOpen = false;
    elevator.canProceed = false;
    elevator.animations.add(
        'ready', Phaser.Animation.generateFrameNames('walls ', 11, 11, '.ase'), 1, false);
    elevator.animations.add(
        'open', Phaser.Animation.generateFrameNames('walls ', 12, 16, '.ase'), 7, false);
    elevator.animations.add(
        'close', Phaser.Animation.generateFrameNames('walls ', 10, 16, '.ase').reverse(), 7, false);
    elevator.open = function () {
        if (!elevator.isOpen) {
            elevator.isOpen = true;
            this.animations.play('ready');
            this.animations.currentAnim.onComplete.add(function() {
                this.animations.play('open');
                this.animations.currentAnim.onComplete.add(function() {
                    elevator.body.setSize(32, 12, 0, 0);
                    elevator.canProceed = true;
                }, this);
            }, this);
        }
    }

    elevator.close = function() {
        elevator.isOpen = false;
        elevator.starting = false;
        elevator.body.setSize(32, 32, 0, 0);
        console.log('closed')
        this.animations.play('close');
    }

    walls.setAll('body.immovable', true);
}