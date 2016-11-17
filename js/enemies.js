function createEnemies() {
    enemies = game.add.group();
    enemies.enableBody = true;

    for (var i = 0; i < game.rnd.integerInRange(3, 10); i++) {
        var enemy = enemies.create(Math.random() * game.world.width, Math.random() * game.world.height, 'enemy1');
        enemy.body.immovable = true;
        enemy.body.collideWorldBounds = true;
        enemy.speed = 1; //game.rnd.integerInRange(50, 100);
        enemy.health = 2;
        enemy.moveCounter = game.rnd.integerInRange(50, 100);
        enemy.xSpeed = game.rnd.integerInRange(-1, 1);
        enemy.ySpeed = game.rnd.integerInRange(-1, 1);
    }
    enemies.callAll('animations.add', 'animations', 'down', [1, 2, 3, 0], 5, true);
    enemies.callAll('animations.add', 'animations', 'up', [5, 6, 7, 4], 5, true);
    enemies.callAll('animations.add', 'animations', 'right', [9, 10, 11, 8], 5, true);
    enemies.callAll('animations.add', 'animations', 'left', [13, 14, 15, 12], 5, true);


    //  And play them
    enemies.callAll('animations.play', 'animations', 'down');
}

function updateEnemies() {
    enemies.forEachAlive(moveEnemy, this, true)
}

function moveEnemy(enemy) {
    if (enemy.ySpeed == -1) {
        enemy.animations.play('up');
    } else if (enemy.ySpeed == 1) {
        enemy.animations.play('down');
    } else if (enemy.xSpeed == -1) {
        enemy.animations.play('left');
    } else {
        enemy.animations.play('right');
    }
    // if () {
    //     enemy.animations.play('left');
    // }
    // if () {
    //     enemy.animations.play('right');
    // Select a random direction if moveCounter is 0
    if (enemy.moveCounter == 0) {
        enemy.xSpeed = game.rnd.integerInRange(-1, 1);
        enemy.ySpeed = game.rnd.integerInRange(-1, 1);
        // enemy.direction = game.rnd.integerInRange(0, 5);
        enemy.moveCounter = game.rnd.integerInRange(50, 100);
    }

    // Move enemy based on direction value and reduce moveCounter
    // if(enemy.x == 0 || enemy.x == )
    enemy.x += enemy.xSpeed;
    enemy.y += enemy.ySpeed;

    // if (enemy.direction == 0) {
    //     enemy.x += enemy.speed;

    // } else if (enemy.direction == 1) {
    //     enemy.x -= enemy.speed;

    // } else if (enemy.direction == 2) {
    //     enemy.y += enemy.speed;

    // } else {
    //     enemy.y -= enemy.speed;
    // }
    enemy.moveCounter -= 1;
}

function damageEnemy(bullet, enemy) {
    enemy.health -= bullet.damage;
    bullet.kill();

    if (enemy.health <= 0) {
        enemy.kill();
        player.score += 1;
    }
}
