function createPlayer() {
    player = game.add.sprite(0, 0, 'dude');
    player.position.setTo(game.world.centerX - player.width / 2, game.world.centerY - player.height / 2);

    player.maxSpeed = 100;
    game.physics.arcade.enable(player);
    game.camera.follow(player);

    player.body.collideWorldBounds = true;
    player.anchor.setTo(0.5, 0.5);

    //  Our two animations, walking left and right.
    player.animations.add('down', [1, 2, 3, 0], 5, true);
    player.animations.add('up', [5, 6, 7, 4], 5, true);
    player.animations.add('right', [9, 10, 11, 8], 5, true);
    player.animations.add('left', [13, 14, 15, 12], 5, true);
}

function updatePlayer() {
    var vertical = false;
    // Player movement
    player.body.velocity.y = 0;
    player.body.velocity.x = 0;

    if (wasd.up.isDown) {
        player.body.velocity.y = -(player.maxSpeed);
        player.animations.play('up');
        vertical = true;
    }
    if (wasd.down.isDown) {
        player.body.velocity.y = player.maxSpeed;
        player.animations.play('down');
        vertical = true;
    }
    if (wasd.left.isDown) {
        player.body.velocity.x = -(player.maxSpeed);
        if (!vertical) {
            player.animations.play('left');
        }
    }
    if (wasd.right.isDown) {
        player.body.velocity.x = player.maxSpeed;
        if (!vertical) {
            player.animations.play('right');
        }
    }

    // SHOOTEMUP
    if (wasd.pointer.isDown || wasd.space.isDown) {
        fireBullet();
    }

    //  Stand still
    if (!wasd.up.isDown && !wasd.down.isDown && !wasd.left.isDown && !wasd.right.isDown) {
        player.animations.stop();
        player.frame = 0;
    }

    //Rotate the player sprite to face the cursor
    //player.rotation = game.physics.arcade.angleToPointer(player);


    //Scratch code
        //  Reset the players velocity (movement)
//    player.body.velocity.x = 0;


    //  Allow the player to jump if they are touching the ground.
    /*if (wasd.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -500;
    }
*/
}