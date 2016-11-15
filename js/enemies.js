function createEnemies() {
    enemies = game.add.group();
    enemies.enableBody = true;

    for (var i = 0; i < game.rnd.integerInRange(3, 10); i++) {
        var enemy = enemies.create(Math.random() * game.world.width, Math.random() * game.world.height, 'enemy');
        enemy.body.immovable = true;
        enemy.speed = 1; //game.rnd.integerInRange(50, 100);
        enemy.moveCounter = 100;
    }
}

function updateEnemies() {
    enemies.forEachAlive(moveEnemy, this, true)
}

function moveEnemy(enemy) {
	// Select a random direction if moveCounter is 0
    if(enemy.moveCounter == 0) {
    	enemy.direction = game.rnd.integerInRange(0, 5);
    	enemy.moveCounter = 100;
    }

    // Move enemy based on direction value and reduce moveCounter
    if (enemy.direction == 0) {
        enemy.x += enemy.speed;

    } else if (enemy.direction == 1) {
        enemy.x -= enemy.speed;

    } else if (enemy.direction == 2) {
        enemy.y += enemy.speed;

    } else {
        enemy.y -= enemy.speed;
    }
    enemy.moveCounter -= 1;
}