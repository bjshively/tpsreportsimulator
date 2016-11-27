function createPlayer() {
    player = game.add.sprite(0, 0, 'player');
    player.anchor.setTo(0.5, 0.5);
    player.position.setTo(game.world.centerX, game.world.centerY);

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    // set collider box to waist down
    player.body.setSize(player.width, player.height / 2, 0, player.height / 2);
    game.camera.follow(player);


    player.health = 3;
    player.score = 0;
    player.level = 1;
    player.maxSpeed = 100;
    player.invincible = false;
    player.invincibleTime;
    player.lookAngle;
    player.lookDirection;
    player.weapon;
    player.canMove = false;

    //  Our two animations, walking left and right.
    player.animations.add(
        'up', Phaser.Animation.generateFrameNames('player ', 0, 3, '.ase'), 7, true);
    player.animations.add(
        'right', Phaser.Animation.generateFrameNames('player ', 5, 8, '.ase'), 7, true);
    player.animations.add(
        'down', Phaser.Animation.generateFrameNames('player ', 10, 13, '.ase'), 7, true);
    player.animations.add(
        'left', Phaser.Animation.generateFrameNames('player ', 15, 18, '.ase'), 7, true);
    // Define the standing frame for each direction the player can face
    player.standingFrames = {};
    player.standingFrames['up'] = 0;
    player.standingFrames['right'] = 5;
    player.standingFrames['down'] = 10;
    player.standingFrames['left'] = 15;

    // add the attack animations
    player.animations.add(
        'attackup', [4, 0], 7, false);
    player.animations.add(
        'attackright', [9, 5], 7, false);
    player.animations.add(
        'attackdown', [14, 10], 7, false);
    player.animations.add(
        'attackleft', [19, 15], 7, false);

    player.attack = function () {
        // TODO: animation is stuck on mouse down
        player.animations.play('attack' + player.lookDirection);
        player.weapon.fire(
            null,
            game.input.activePointer.worldX - reticle.width / 2,
            game.input.activePointer.worldY - reticle.height / 2
        );
    }


    player.takeDamage = function(player, danger) {
        if (!player.invincible) {
            player.health -= danger.damage;

            // Check to see if this hit kills the player
            if (player.health <= 0) {
                gameOver('GAME ERVER');

                // If not, trigger temporary invincibility
            } else {
                player.makeInvincible();
            }
        }
    }

    player.makeInvincible = function() {
            player.invincible = true;
            player.invincibleTime = game.time.now + 2500;
        }
    
    //Player is temporarily invincible upon spawning
    player.makeInvincible();
}

function updatePlayer() {
    // reset player invincibility
    if (game.time.now > player.invincibleTime && player.alive) {
        player.invincible = false;
        player.visible = true;
    }
    // flash while invincible
    if (player.invincible) {
        player.visible = !player.visible;
    }

    ///////////////////////////////////
    // BEGIN PLAYER MOVEMENT
    player.body.velocity.y = 0;
    player.body.velocity.x = 0;

    if (player.canMove) {

        //Divide the look direction into 4 quadrants and determine which direction the mouse is
        player.lookAngle = game.math.radToDeg(game.physics.arcade.angleToPointer(player));
        if (player.lookAngle >= -135 && player.lookAngle < -45) {
            player.lookDirection = 'up';
        } else if (player.lookAngle >= -45 && player.lookAngle < 45) {
            player.lookDirection = 'right';
        } else if (player.lookAngle >= 45 && player.lookAngle < 135) {
            player.lookDirection = 'down';
        } else {
            player.lookDirection = 'left';
        }

        //  Make player face the cursor when standing still
        if (!wasd.up.isDown && !wasd.down.isDown && !wasd.left.isDown && !wasd.right.isDown) {
            player.animations.stop();
            player.frame = player.standingFrames[player.lookDirection];
        }

        //Play the animation for the direction the player is looking
        if (wasd.up.isDown || wasd.down.isDown || wasd.left.isDown || wasd.right.isDown) {
            player.animations.play(player.lookDirection);
        }

        // Move the player
        if (wasd.up.isDown) {
            player.body.velocity.y = -(player.maxSpeed);
        }
        if (wasd.down.isDown) {
            player.body.velocity.y = player.maxSpeed;
        }
        if (wasd.left.isDown) {
            player.body.velocity.x = -(player.maxSpeed);
        }
        if (wasd.right.isDown) {
            player.body.velocity.x = player.maxSpeed;
        }
        // END PLAYER MOVEMENT
        ///////////////////////////////////

        // SHOOTEMUP
        // game.input.onDown.add(fireBullet)
        if (wasd.pointer.isDown || wasd.space.isDown) {
            player.attack();
        }
    }
}