// TODO: allow enemies to shoot
// TODO: Define enemy types/stats (i.e. 1 - slow, 1 hit, 2 - medium, 2 hits, 3 - fast, many hits)
// TODO: Consider making enemy follow distance vary (i.e. harder enemies follow from further away?)

// ENEMY STORY TODO
// enemy1 has only melee, enemy2 has stapler, +
// enemy1 has 2 health, enemy2 has 3 health, +
// new enemies appear once every 5th wave, quantity increases with wave

function updateEnemies() {
    // Check to see if all enemies are dead

    // TODO: This code should really live somewhere else.
    // Still need to create a GameManager.js or something similar.

    if (enemies.countLiving() == 0 && obstacles.checkAll('complete', true)) {
        // If all enemies are dead and obstacles are hacked, complete the level
        elevator.open();

    } else {
        enemies.forEachAlive(moveEnemy, this);
    }
}

function moveEnemy(enemy) {
    enemy.move();
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
function createEnemy(enemyClass) {
    var enemy = enemies.create(
        game.rnd.integerInRange(32, 300),
        game.rnd.integerInRange(32, 250),
        'enemy' + enemyClass
    );

    // Populate enemy stats based on enemy class type
    enemyStats = enemyTypeAttributes[enemyClass];
    for (var k in enemyStats) {
        enemy[k] = enemyStats[k];
    }

    enemy.moveRandomly = function () {
    if (this.moveCounter == 0) {
        this.xSpeed = game.rnd.integerInRange(-1, 1) * this.maxSpeed;
        this.ySpeed = game.rnd.integerInRange(-1, 1) * this.maxSpeed;
        this.moveCounter = game.rnd.integerInRange(100, 300);
    }

    // Move this based on direction value and reduce moveCounter
    this.body.velocity.x = this.xSpeed;
    this.body.velocity.y = this.ySpeed;
    this.moveCounter -= 1;
}
    enemy.move = function() {
        // Enemies will follow the player if he gets too close
        if (game.physics.arcade.distanceToXY(this, player.x, player.y) < this.detection) {
            this.following = true;
        } else {
            // If the this was previously following the player,
            // give the this new movement instructions
            if (this.following == true) {

            }
            this.following = false;
        }

        // If player is within 100px, follow the player
        // And play the appropriate facing animation
        if (this.following) {
            game.physics.arcade.moveToObject(this, player, this.maxSpeed);
            var xDiff = player.x - this.x;
            var yDiff = player.y - this.y;
            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                if (xDiff >= 0) {
                    this.animations.play('right');
                } else {
                    this.animations.play('left');
                }
            } else {
                if (yDiff >= 0) {
                    this.animations.play('down');
                } else {
                    this.animations.play('up');
                }
            }
        }

        if (!this.following) {
            this.moveRandomly();

            // Animations
            if (Math.abs(this.ySpeed) > Math.abs(this.xSpeed)) {
                if (this.ySpeed < 0) {
                    this.animations.play('up');
                } else {
                    this.animations.play('down');
                }
            } else {
                if (this.xSpeed < 0) {
                    this.animations.play('left');
                } else {
                    this.animations.play('right');
                }
            }
        }
    }

    enemy.turnAround = function () {
        this.moveCounter = 0;
    }

    game.physics.arcade.enable(enemy);
    enemy.body.mass = -50;
    enemy.body.collideWorldBounds = true;
    // enemy.body.setSize(enemy.width, enemy.height / 2, 0, enemy.height / 2);
    enemy.anchor.setTo(0.5, 0.5);
    enemy.speed = 1; //game.rnd.integerInRange(50, 100);
    enemy.maxSpeed = 50;
    enemy.detection = 100;
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

var enemyTypeAttributes = {
    // create each class
    1: {
        'health': 2,
        'damage': 1,
        'sprite': 1,
        'weapon': null
    },
    2: {
        'health': 3,
        'damage': 1,
        'sprite': 2,
        'weapon': null
    },
    3: {
        'health': 5,
        'damage': 2,
        'sprite': 3,
        'weapon': null
    },
    4: {
        'health': 7,
        'damage': 3,
        'sprite': 4,
        'weapon': null
    },
    5: {
        'health': 10,
        'damage': 4,
        'sprite': 5,
        'weapon': null
    }
}

function spawnWave(numberOfEnemies) {

}