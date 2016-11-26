// TODO: allow enemies to shoot
// TODO: add enemy area of attention - invisible circle
// TODO: Define enemy types/stats (i.e. 1 - slow, 1 hit, 2 - medium, 2 hits, 3 - fast, many hits)

// ENEMY STORY TODO
// enemy1 has only melee, enemy2 has stapler, +
// enemy1 has 2 health, enemy2 has 3 health, +
// new enemies appear once every 5th wave, quantity increases with wave

function createEnemies() {

    // Spawn a random number of enemies
    for (var i = 0; i < game.rnd.integerInRange(3, 10); i++) {
        createEnemy(2, 1);
    }
}

function updateEnemies() {
    // Check to see if all enemies are dead
    if (enemies.countLiving() == 0) {
        player.level += 1;
        gameOver('YOU WIN');
    } else {
        enemies.forEachAlive(moveEnemy, this, true);
    }
}

function moveEnemy(enemy) {
    if (Math.abs(enemy.ySpeed) > Math.abs(enemy.xSpeed)) {
        if (enemy.ySpeed < 0) {
            enemy.animations.play('up');
        } else {
            enemy.animations.play('down');
        }
    } else {
        if (enemy.xSpeed < 0) {
            enemy.animations.play('left');
        } else {
            enemy.animations.play('right');
        }
    }

    // Select a random direction if moveCounter is 0
    if (enemy.moveCounter == 0) {
        enemy.xSpeed = game.rnd.integerInRange(-1, 1) * enemy.maxSpeed;
        enemy.ySpeed = game.rnd.integerInRange(-1, 1) * enemy.maxSpeed;
        // enemy.direction = game.rnd.integerInRange(0, 5);
        enemy.moveCounter = game.rnd.integerInRange(100, 300);
    }

    // Move enemy based on direction value and reduce moveCounter
    enemy.body.velocity.x = enemy.xSpeed;
    enemy.body.velocity.y = enemy.ySpeed;
    enemy.moveCounter -= 1;
}

function damageEnemy(bullet, enemy) {
    bloodSplatter(enemy);

    enemy.health -= player.weapon.damage;
    if (player.weapon == weaponCD) {
        weaponCD.destroy(bullet);
    } else {
        bullet.kill();
    }

    if (enemy.health <= 0) {
        enemy.kill();
        player.score += 1;
    }
}

// Spawn an enemy
function createEnemy(health, damage) {
    var enemy = enemies.create(
        Math.random() * game.world.width,
        Math.random() * game.world.height,
        'enemy' + game.rnd.integerInRange(1, 5)
    );
    game.physics.arcade.enable(enemy);
    enemy.body.mass = -50;
    enemy.body.collideWorldBounds = true;
    enemy.anchor.setTo(0.5, 0.5);
    enemy.speed = 1; //game.rnd.integerInRange(50, 100);
    enemy.health = health;
    enemy.damage = damage;
    enemy.maxSpeed = 50;
    //enemy.movement = game.rnd.integerInRange(100, 300);
    enemy.moveCounter = 0;
    enemy.xSpeed = game.rnd.integerInRange(-100, 100);
    enemy.ySpeed = game.rnd.integerInRange(-100, 100);
    enemy.animations.add('down', [1, 2, 3, 0], 5, true);
    enemy.animations.add('up', [5, 6, 7, 4], 5, true);
    enemy.animations.add('right', [9, 10, 11, 8], 5, true);
    enemy.animations.add('left', [13, 14, 15, 12], 5, true);
    enemy.animations.play('down');
}

function spawnWave(numberOfEnemies) {

}