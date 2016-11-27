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

function drawWalls() {
    bgtile = game.add.tileSprite(0, 0, game.world.bounds.width, game.world.height, 'background');
    bgtile = game.add.sprite(0, 0, 'walls');
    bgtile.frame = 2;
    bgtile = game.add.sprite(32, 0, 'walls');
    bgtile.frame = 0;
    bgtile = game.add.sprite(64, 0, 'walls');
    bgtile.frame = 6;
    bgtile = game.add.sprite(96, 0, 'walls');
    bgtile.frame = 0;
    bgtile = game.add.sprite(128, 0, 'walls');
    bgtile.frame = 6;
    bgtile = game.add.sprite(160, 0, 'walls');
    bgtile.frame = 1;
    bgtile = game.add.sprite(192, 0, 'walls');
    bgtile.frame = 1;
    bgtile = game.add.sprite(224, 0, 'walls');
    bgtile.frame = 6;
    bgtile = game.add.sprite(256, 0, 'walls');
    bgtile.frame = 0;
    bgtile = game.add.sprite(288, 0, 'walls');
    bgtile.frame = 6;
    bgtile = game.add.sprite(320, 0, 'walls');
    bgtile.frame = 0;
    bgtile = game.add.sprite(352, 0, 'walls');
    bgtile.frame = 3;

    bgtile = game.add.sprite(0, 32, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 64, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 96, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 128, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 160, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 192, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 224, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 256, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 288, 'walls');
    bgtile.frame = 4;

    bgtile = game.add.sprite(352, 32, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 64, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 96, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 128, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 160, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 192, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 224, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 256, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 288, 'walls');
    bgtile.frame = 5;
}