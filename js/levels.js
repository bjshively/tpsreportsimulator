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
            1: 3
        },
        'obstacles': {
            'desk': 2,
        }
    },
    2: {
        'enemies': {
            1: 3
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
    walls.enableBody = true;

    var o = null;
    var T = 'reserved';
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

    var deskLayout = {
        0: {'available': true, 'x': null, 'y': null},
        1: {'available': true, 'x': null, 'y': null},
        2: {'available': true, 'x': null, 'y': null},
        3: {'available': true, 'x': null, 'y': null},
        4: {'available': true, 'x': null, 'y': null},
        5: {'available': true, 'x': null, 'y': null},
        6: {'available': true, 'x': null, 'y': null},
        7: {'available': true, 'x': null, 'y': null},
        8: {'available': true, 'x': null, 'y': null},
        9: {'available': true, 'x': null, 'y': null},
        10: {'available': true, 'x': null, 'y': null},
        11: {'available': true, 'x': null, 'y': null},
        12: {'available': true, 'x': null, 'y': null},
        13: {'available': true, 'x': null, 'y': null},
        14: {'available': true, 'x': null, 'y': null},
        15: {'available': true, 'x': null, 'y': null},
        16: {'available': true, 'x': null, 'y': null},
        17: {'available': true, 'x': null, 'y': null},
    };

    // player.makeInvincible();
    var currentLevel = levels[player.level];
    
    var currentLevelObstacles = currentLevel['obstacles'];
    var deskLayoutArray = [ , , , , , , , , , , , , , , , , , ];
    var lengthCheck = 0;
    // for (obstacle in currentLevelObstacles) {
    //     for (var i = 0; i < currentLevelObstacles[obstacle]; i++) {
    //         createObstacle(
    //             obstacle,
    //             game.rnd.integerInRange(64, 288),
    //             game.rnd.integerInRange(64, 200)
    //         );
    //     }
    // }

    for (type in currentLevelObstacles) {
        for (var item = 0; item < currentLevelObstacles[type]; item++) {
            // 18 spaces, pick a random one
            var rand = game.rnd.integerInRange(0, 17);
            if (deskLayoutArray[rand] == undefined) {
                // assign the space and iterate
                deskLayoutArray[rand] = type;
                lengthCheck++;
            } else {
                // decrement to avoid running out of spaces or items
                item--;
            }

            // reset the length check after everything in the group is assigned
            lengthCheck = 0;
        }
    }

    var currentOpening = 0;
    var x = 0;
    var y = 0;

    for (var row = 0; row < wallsArray.length; row++) {
        y = row * 32;

        for (var column = 0; column < wallsArray[row].length; column++) {
            x = column * 32;
            var gridSpot = wallsArray[row][column];

            // place an obstacle in a reserved spot
            if (gridSpot == T) {
                if (deskLayoutArray[currentOpening]) {
                    createObstacle(
                        deskLayoutArray[currentOpening], x, y
                    );
                }
                // iterate the current opening to keep in line with the deskLayoutArray
                currentOpening++;
            // replace the numbers with the appropriate wall
            } else if (gridSpot != null) {
                // use the number to grab the frame from the spritesheet
                bgtile = walls.create(x, y, 'walls', gridSpot);
                
                // change textures & colliders for corners
                // add another instance to have two colliders
                if (gridSpot == 2) {
                    bgtile.body.setSize(11, 32, 0, 0);
                    bgtile = walls.create(x, y, 'walls', gridSpot);
                    bgtile.body.setSize(32, 11, 0, 21);
                }
                if (gridSpot == 3) {
                    bgtile.body.setSize(32, 11, 21, 0);
                    bgtile = walls.create(x, y, 'walls', gridSpot);
                    bgtile.body.setSize(11, 32, 0, 21);
                }

                // change textures & colliders for side and bottom
                if (gridSpot == 6) {
                    bgtile.body.setSize(11, 32, 0, 0);
                }
                if (gridSpot == 7) {
                    bgtile.body.setSize(11, 32, 21, 0);
                }
                if (gridSpot == 8) {
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
        this.animations.play('close');
    }
    walls.setAll('body.immovable', true);

    var currentLevelEnemies = currentLevel['enemies'];
    for (type in currentLevelEnemies){
        for (var i = 0; i < currentLevelEnemies[type]; i++) {
            createEnemy(type, 2, 1);
        }
    }
}