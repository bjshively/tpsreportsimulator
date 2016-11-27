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

    walls = game.add.group();
    walls.enableBody = true;

    bgtile = walls.create(0, 0, 'walls');
    bgtile.frame = 2;
    bgtile = walls.create(32, 0, 'walls');
    bgtile.frame = 0;
    bgtile = walls.create(64, 0, 'walls');
    bgtile.frame = 6;
    bgtile = walls.create(96, 0, 'walls');
    bgtile.frame = 6;
    bgtile = walls.create(128, 0, 'walls');
    bgtile.frame = 1;
    bgtile = walls.create(160, 0, 'walls');
    bgtile.frame = 7;
    bgtile = walls.create(192, 0, 'walls');
    bgtile.frame = 1;
    bgtile = walls.create(224, 0, 'walls');
    bgtile.frame = 6;
    bgtile = walls.create(256, 0, 'walls');
    bgtile.frame = 6;
    bgtile = walls.create(288, 0, 'walls');
    bgtile.frame = 0;
    bgtile = walls.create(320, 0, 'walls');
    bgtile.frame = 3;
    
    bgtile = walls.create(0, 32, 'walls');
    bgtile.frame = 4;
    bgtile = walls.create(0, 64, 'walls');
    bgtile.frame = 4;
    bgtile = walls.create(0, 96, 'walls');
    bgtile.frame = 4;
    bgtile = walls.create(0, 128, 'walls');
    bgtile.frame = 4;
    bgtile = walls.create(0, 160, 'walls');
    bgtile.frame = 4;
    bgtile = walls.create(0, 192, 'walls');
    bgtile.frame = 4;
    bgtile = walls.create(0, 224, 'walls');
    bgtile.frame = 4;
    bgtile = walls.create(0, 256, 'walls');
    bgtile.frame = 4;
    bgtile = walls.create(0, 288, 'walls');
    bgtile.frame = 4;

    bgtile = walls.create(352, 32, 'walls');
    bgtile.frame = 5;
    bgtile = walls.create(352, 64, 'walls');
    bgtile.frame = 5;
    bgtile = walls.create(352, 96, 'walls');
    bgtile.frame = 5;
    bgtile = walls.create(352, 128, 'walls');
    bgtile.frame = 5;
    bgtile = walls.create(352, 160, 'walls');
    bgtile.frame = 5;
    bgtile = walls.create(352, 192, 'walls');
    bgtile.frame = 5;
    bgtile = walls.create(352, 224, 'walls');
    bgtile.frame = 5;
    bgtile = walls.create(352, 256, 'walls');
    bgtile.frame = 5;
    bgtile = walls.create(352, 288, 'walls');
    bgtile.frame = 5;

    walls.setAll('body.immovable', true);
}