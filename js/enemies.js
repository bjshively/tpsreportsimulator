// TODO: allow enemies to shoot
// TODO: Define enemy types/stats (i.e. 1 - slow, 1 hit, 2 - medium, 2 hits, 3 - fast, many hits)
// TODO: Consider making enemy follow distance vary (i.e. harder enemies follow from further away?)

// ENEMY STORY TODO
// enemy1 has only melee, enemy2 has stapler, +
// enemy1 has 2 health, enemy2 has 3 health, +
// new enemies appear once every 5th wave, quantity increases with wave

function createEnemies(level) {

    // Spawn a random number of enemies
    for (var i = 0; i < game.rnd.integerInRange(3, 10); i++) {
        createEnemy(2, 1);
    }
}

function updateEnemies() {
    // Check to see if all enemies are dead

    // TODO: This code should really live somewhere else.
    // Still need to create a GameManager.js or something similar.

    if (enemies.countLiving() == 0 && obstacles.checkAll('complete', true)) {

        // If all enemies are dead and obstacles are hacked, open the elevator
        elevator.open();
        game.physics.arcade.collide(player, elevator, function() {
            player.level += 1;
            createLevel();            
        });

        
    } else {
        enemies.forEachAlive(moveEnemy, this, true);
    }
}

function moveEnemy(enemy) {

    // Enemies will follow the player if he gets too close
    if (game.physics.arcade.distanceToXY(enemy, player.x, player.y) < 100) {
        enemy.following = true;
    } else {
        // If the enemy was previously following the player,
        // give the enemy new movement instructions
        if (enemy.following == true) {

        }
        enemy.following = false;
    }

    // If player is within 100px, follow the player
    // And play the appropriate facing animation
    if (enemy.following) {
        game.physics.arcade.moveToObject(enemy, player, enemy.maxSpeed);
        var xDiff = player.x - enemy.x;
        var yDiff = player.y - enemy.y;
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff >= 0) {
                enemy.animations.play('right');
            } else {
                enemy.animations.play('left');
            }
        } else {
            if (yDiff >= 0) {
                enemy.animations.play('down');
            } else {
                enemy.animations.play('up');
            }
        }
    }

    if (!enemy.following) {
        moveRandomly(enemy);

        // Animations
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
    }
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

function moveRandomly(enemy) {
    if (enemy.moveCounter == 0) {
        enemy.xSpeed = game.rnd.integerInRange(-1, 1) * enemy.maxSpeed;
        enemy.ySpeed = game.rnd.integerInRange(-1, 1) * enemy.maxSpeed;
        enemy.moveCounter = game.rnd.integerInRange(100, 300);
    }

    // Move enemy based on direction value and reduce moveCounter
    enemy.body.velocity.x = enemy.xSpeed;
    enemy.body.velocity.y = enemy.ySpeed;
    enemy.moveCounter -= 1;
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