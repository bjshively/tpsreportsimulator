// CREATE CONTENTS FOR EACH LEVEL
var levels = {};

// create 10 levels
for (var level = 1; level <= 10; level++) {
    levels[level] = {
        'enemies': {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        },
        'obstacles': {
            'desk': 0,
            'deskWithPrinter': 0,
            'printer': 0
        }
    }

    // random number of desks possibly increasing with level
    levels[level]['obstacles']['desk'] = game.rnd.integerInRange(2, 2 + level);

    // one in four chance of a printer showing up
    if (game.rnd.integerInRange(1, 4) == 1) {
        levels[level]['obstacles']['deskWithPrinter'] = 1;
        levels[level]['obstacles']['printer'] = 1;
    }

    // always have 3+ base enemies
    levels[level]['enemies']['1'] = game.rnd.integerInRange(3, 5);
    
    // levels 3, 5, 7, 9 have new enemy types
    if (level >= 3) {
        levels[level]['enemies']['2'] = game.rnd.integerInRange(2, 5);
    }
    if (level >= 5) {
        levels[level]['enemies']['3'] = game.rnd.integerInRange(2, 5);
    }
    if (level >= 7) {
        levels[level]['enemies']['4'] = game.rnd.integerInRange(2, 5);
    }
    if (level >= 9) {
        levels[level]['enemies']['5'] = game.rnd.integerInRange(1, 2);
    }
}

var elevator;

function drawLevel(inclusions) {
    // bgtile = game.add.tileSprite(0, 0, game.world.bounds.width, game.world.height, 'background');
    walls.enableBody = true;

    var o = null;
    var T = 'reserved';
    var E = 'elevator';
    var wallsArray = [
        [0, 4, 9, 9, 5, E, 5, 9, 9, 4, 1],
        [6, o, o, o, o, o, o, o, o, o, 7],
        [6, o, T, T, T, o, T, T, T, o, 7],
        [6, o, o, o, o, o, o, o, o, o, 7],
        [6, o, T, T, T, o, T, T, T, o, 7],
        [6, o, o, o, o, o, o, o, o, o, 7],
        [6, o, T, T, T, o, T, T, T, o, 7],
        [6, o, o, o, o, o, o, o, o, o, 7],
        [2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 3],
    ];

    // player.makeInvincible();
    var currentLevel = levels[player.level];
    
    var currentLevelObstacles = currentLevel['obstacles'];
    var deskLayoutArray = [ , , , , , , , , , , , , , , , , , ];
    var lengthCheck = 0;

    for (type in currentLevelObstacles) {
        for (var obstacle = 0; obstacle < currentLevelObstacles[type]; obstacle++) {
            // 18 spaces, pick a random one
            var rand = game.rnd.integerInRange(0, 17);
            if (deskLayoutArray[rand] == undefined) {
                // assign the space and iterate
                deskLayoutArray[rand] = type;
                lengthCheck++;
            } else {
                // decrement to avoid running out of spaces or obstacles
                obstacle--;
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
                createObstacle('cubicle', x, y);

                if (deskLayoutArray[currentOpening]) {
                    createObstacle(
                        deskLayoutArray[currentOpening], x, y
                    );
                }
                // iterate the current opening to keep in line with the deskLayoutArray
                currentOpening++;
            } else if (gridSpot == E) {
                elevator = walls.create(160, 0, 'walls');
                elevator.frame = 10;
                elevator.starting = false;
                elevator.isOpen = false;
                elevator.canProceed = false;
                elevator.animations.add(
                    'ready', Phaser.Animation.generateFrameNames(
                        'walls ', 11, 11, '.ase'),
                    1, false);
                elevator.animations.add(
                    'open', Phaser.Animation.generateFrameNames(
                        'walls ', 12, 16, '.ase'),
                    7, false);
                elevator.animations.add(
                    'close', Phaser.Animation.generateFrameNames(
                        'walls ', 10, 16, '.ase').reverse(),
                    7, false);
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

    walls.setAll('body.immovable', true);

    var currentLevelEnemies = currentLevel['enemies'];
    for (type in currentLevelEnemies){
        for (var i = 0; i < currentLevelEnemies[type]; i++) {
            createEnemy(type, 2, 1);
        }
    }
}