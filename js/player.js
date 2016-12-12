function createPlayer() {
    player = game.add.sprite(0, 0, 'player');
    player.anchor.setTo(0.5, 0.5);
    player.position.setTo(game.world.centerX, game.world.centerY);

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    // set collider box to waist down
    player.body.setSize(player.width, player.height / 2, 0, player.height / 2);
    game.camera.follow(player);

    // player health
    player.health = 3;
    player.heart = game.add.sprite(5, 5, 'heart');
    player.heart.fixedToCamera = true;
    player.heart.visible = false;
    player.heart.animations.add('healthy', [0, 1, 2, 3], 5, true);
    player.heart.animations.add('hurt', [4, 5, 6, 7], 10, true);
    player.heart.animations.add('danger', [8, 9, 10, 11], 15, true);
    player.heart.animations.add('dead', [12], 7, true);

    player.armor = 0;
    player.vest = game.add.sprite(54, 5, 'vest');
    player.vest.fixedToCamera = true;
    player.vest.visible = false;
    player.vest.animations.add('healthy', [2], 5, true);
    player.vest.animations.add('hurt', [3], 10, true);
    player.vest.animations.add('danger', [4], 15, true);
    
    // TODO: add logic to decrement this with takeDamage if > 0

    player.lives = 3;
    player.alive = true;
    player.score = 0;
    player.level = 1;

    // Player move speed
    player.speed = 75;
    player.speedMultiplier = 1;
    player.currentSpeed = player.speed * player.speedMultiplier;
    
    player.shoes = game.add.sprite(5, 35, 'shoes');
    player.shoes.fixedToCamera = true;
    player.shoes.visible = false;
    player.shoes.frame = 0;

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
    player.standingFrames = {
        'up': 0,
        'right': 5,
        'down': 10,
        'left': 15
    }

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
        // player.animations.play('attack' + player.lookDirection);
        player.weapon.fire(
            null,
            game.input.activePointer.worldX - reticle.width / 2,
            game.input.activePointer.worldY - reticle.height / 2
        );
    }


    player.takeDamage = function(player, danger) {
        if (!player.invincible) {
            if (player.armor > 0) {
                player.armor -= danger.damage;
                if (player.armor < 0) {
                    player.health += player.armor;
                    player.armor = 0;
                }
            } else {
                player.health -= danger.damage;
            }
            bloodSplatter(player);
            // Check to see if this hit kills the player
            if (player.health <= 0) {
                //showHelpText('You died!', 3000);
                // TODO: play hit sound

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

    player.currentSpeed = player.speed * player.speedMultiplier;
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
            player.body.velocity.y = -(player.currentSpeed);
        }
        if (wasd.down.isDown) {
            player.body.velocity.y = player.currentSpeed;
        }
        if (wasd.left.isDown) {
            player.body.velocity.x = -(player.currentSpeed);
        }
        if (wasd.right.isDown) {
            player.body.velocity.x = player.currentSpeed;
        }
        // END PLAYER MOVEMENT
        ///////////////////////////////////

        // SHOOTEMUP
        // game.input.onDown.add(fireBullet)
        if (wasd.pointer.isDown) {
            player.attack();
        }
    }

    // update heart texture with health
    player.heart.visible = true;
    switch (player.health) {
        case 2: player.heart.animations.play('hurt'); break;
        case 1: player.heart.animations.play('danger'); break;
        case 0: player.heart.animations.play('dead'); break;
        default: player.heart.animations.play('healthy'); break;
    }

    // update armor texture
    if (player.armor > 0) {
        player.vest.visible = true;
        switch (player.armor) {
            case 2: player.vest.frame = 2; break;
            case 1: player.vest.frame = 3; break;
            default: player.vest.frame = 0; break;
        }
    } else {
        player.vest.visible = false;
    }

    // update shoe texture
    if (player.speedMultiplier > 1) {
        player.shoes.visible = true;
    } else {
        player.shoes.visible = false;
    }
}