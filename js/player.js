function createPlayer() {
    // The player and its settings
    player = game.add.sprite(0, 0, 'dude');
//    player.scale.setTo(3, 3);
    player.smoothed = false;

    player.position.setTo(game.world.centerX - player.width / 2, game.world.centerY - player.height / 2);


    player.maxSpeed = 100;
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.camera.follow(player);
    //  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;
    //player.body.gravity.y = gravity;
    player.body.collideWorldBounds = true;
    player.anchor.setTo(0.5, 0.5);


    //  Our two animations, walking left and right.
    player.animations.add('down', [1, 2], 5, true);
    player.animations.add('up', [4, 5], 5, true);
    player.animations.add('right', [7, 8], 5, true);
    player.animations.add('left', [10, 11], 5, true);

}

function updatePlayer() {
    // Player movement
    if (wasd.up.isDown) {
        player.body.velocity.y = -(player.maxSpeed);
        player.animations.play('up');
    }
    if (wasd.down.isDown) {
        player.body.velocity.y = player.maxSpeed;
        player.animations.play('down');
    }
    if (wasd.left.isDown) {
        player.body.velocity.x = -(player.maxSpeed);
        player.animations.play('left');
    }
    if (wasd.right.isDown) {
        player.body.velocity.x = player.maxSpeed;
        player.animations.play('right');
    }
    if (wasd.pointer.isDown || wasd.space.isDown) {
        fireBullet();
    }


    //  Stand still
    if (!wasd.up.isDown && !wasd.down.isDown && !wasd.left.isDown && !wasd.right.isDown) {
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        player.animations.stop();
        player.frame = 4;
    }

    //Rotate the player sprite to face the cursor
    player.rotation = game.physics.arcade.angleToPointer(player);


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