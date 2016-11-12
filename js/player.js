function createPlayer () {
    // The player and its settings
    player = game.add.sprite(0, 0, 'dude');
    player.scale.setTo(3, 3);
    player.smoothed = false;

    player.position.setTo(game.world.centerX - player.width / 2, game.world.centerY - player.height / 2);


    player.maxSpeed = 200;
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.camera.follow(player);
    //  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;
    //player.body.gravity.y = gravity;
    player.body.collideWorldBounds = true;
    player.anchor.setTo(0.5, 0.5);

    
    //  Our two animations, walking left and right.
    player.animations.add('up', [1], 10, true);
    player.animations.add('down', [0], 10, true);
    player.animations.add('right', [2], 10, true);
    player.animations.add('left', [3], 10, true);
    
}

