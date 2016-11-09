function createPlayer () {
    // The player and its settings
    player = game.add.sprite(100, 150, 'dude');
    player.scale.setTo(3, 3)
    player.smoothed = false;
    player.maxSpeed = 200;
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.camera.follow(player);
    //  Player physics properties. Give the little guy a slight bounce.
    //player.body.bounce.y = 0.2;
    player.body.gravity.y = gravity;
    player.body.collideWorldBounds = true;

    
    //  Our two animations, walking left and right.
    player.animations.add('left', [7, 8, 9, 10, 11, 12, 13], 10, true);
    player.animations.add('right', [14, 15, 16, 17, 18, 19, 20], 10, true);
    //player.animations.add('down', [0, 1, 2, 3, 4, 5, 6], 10, true);
    //player.animations.add('up', [21, 22, 23, 24, 25, 26, 27], 10, true);

}