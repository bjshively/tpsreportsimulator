var levels = {
    1: {
        'enemies': {
            1: 5,
            2: 3
        },
        'obstacles': {
            'desk': 3,
            'printer': 1
        }
    },
    2: {
        'enemies': {
            1: 7,
            2: 10
        },
        'obstacles': {
            'desk': 2,
            'printer': 1
        }
    }
}

var elevator;

function drawWalls() {
    bgtile = game.add.tileSprite(0, 0, game.world.bounds.width, game.world.height, 'background');

    walls = game.add.group();
    walls.enableBody = true;

    var o = null;
    var wallsArray = [
        [2, 0, 6, 6, 1, o, 1, 6, 6, 0, 3],
        [4, o, o, o, o, o, o, o, o, o, 5],
        [4, o, o, o, o, o, o, o, o, o, 5],
        [4, o, o, o, o, o, o, o, o, o, 5],
        [4, o, o, o, o, o, o, o, o, o, 5],
        [4, o, o, o, o, o, o, o, o, o, 5],
        [4, o, o, o, o, o, o, o, o, o, 5],
        [4, o, o, o, o, o, o, o, o, o, 5],
        [4, o, o, o, o, o, o, o, o, o, 5],
        [4, o, o, o, o, o, o, o, o, o, 5],
    ]

    var x = 0;
    var y = 0;
    for (var i = 0; i < wallsArray.length; i++) {
        y = i * 32;

        for (var j = 0; j < wallsArray[i].length; j++) {
            x = j * 32;
            if (wallsArray[i][j] != null) {
                bgtile = walls.create(x, y, 'walls');
                bgtile.frame = wallsArray[i][j];

                if (wallsArray[i][j] == 4) {
                    bgtile.body.setSize(11, 32, 0, 0);
                }
                if (wallsArray[i][j] == 5) {
                    bgtile.body.setSize(11, 32, 21, 0);
                }
            }
        }
    }

    elevator = walls.create(160, 0, 'walls');
    elevator.frame = 7;
    elevator.animations.add(
        'ready', Phaser.Animation.generateFrameNames('walls ', 7, 7, '.ase'), 1, false);
    elevator.animations.add(
        'open', Phaser.Animation.generateFrameNames('walls ', 7, 7, '.ase'), 5, false);
    elevator.open = function () {
        this.animations.play('ready');
        this.animations.currentAnim.onComplete.add(function() {
            this.animations.play('open');
            this.body.setSize(32, 12, 0, 0);
        }, this);
    }


    // bgtile = walls.create(0, 0, 'walls');
    // bgtile.frame = 2;
    // bgtile = walls.create(32, 0, 'walls');
    // bgtile.frame = 0;
    // bgtile = walls.create(64, 0, 'walls');
    // bgtile.frame = 6;
    // bgtile = walls.create(96, 0, 'walls');
    // bgtile.frame = 6;
    // bgtile = walls.create(128, 0, 'walls');
    // bgtile.frame = 1;
    // bgtile = walls.create(160, 0, 'walls');
    // bgtile.frame = 7;
    // bgtile = walls.create(192, 0, 'walls');
    // bgtile.frame = 1;
    // bgtile = walls.create(224, 0, 'walls');
    // bgtile.frame = 6;
    // bgtile = walls.create(256, 0, 'walls');
    // bgtile.frame = 6;
    // bgtile = walls.create(288, 0, 'walls');
    // bgtile.frame = 0;
    // bgtile = walls.create(320, 0, 'walls');
    // bgtile.frame = 3;
    
    // bgtile = walls.create(0, 32, 'walls');
    // bgtile.frame = 4;
    // bgtile = walls.create(0, 64, 'walls');
    // bgtile.frame = 4;
    // bgtile = walls.create(0, 96, 'walls');
    // bgtile.frame = 4;
    // bgtile = walls.create(0, 128, 'walls');
    // bgtile.frame = 4;
    // bgtile = walls.create(0, 160, 'walls');
    // bgtile.frame = 4;
    // bgtile = walls.create(0, 192, 'walls');
    // bgtile.frame = 4;
    // bgtile = walls.create(0, 224, 'walls');
    // bgtile.frame = 4;
    // bgtile = walls.create(0, 256, 'walls');
    // bgtile.frame = 4;
    // bgtile = walls.create(0, 288, 'walls');
    // bgtile.frame = 4;

    // bgtile = walls.create(320, 32, 'walls');
    // bgtile.frame = 5;
    // bgtile = walls.create(320, 64, 'walls');
    // bgtile.frame = 5;
    // bgtile = walls.create(320, 96, 'walls');
    // bgtile.frame = 5;
    // bgtile = walls.create(320, 128, 'walls');
    // bgtile.frame = 5;
    // bgtile = walls.create(320, 160, 'walls');
    // bgtile.frame = 5;
    // bgtile = walls.create(320, 192, 'walls');
    // bgtile.frame = 5;
    // bgtile = walls.create(320, 224, 'walls');
    // bgtile.frame = 5;
    // bgtile = walls.create(320, 256, 'walls');
    // bgtile.frame = 5;
    // bgtile = walls.create(320, 288, 'walls');
    // bgtile.frame = 5;

    walls.setAll('body.immovable', true);
}