
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/link.png', 20, 23);
    game.load.image('checker', 'assets/checker.png');
    game.load.image('reticle', 'assets/player/reticle.png');
    game.load.image('head', 'assets/player/head.png');
    game.load.image('torso', 'assets/player/torso.png');
    game.load.image('arm', 'assets/player/arm.png');
    game.load.image('leg', 'assets/player/leg.png');
    game.load.image('foot', 'assets/player/foot.png');
    game.load.image('gun', 'assets/player/gun.png');
    game.load.image('bullet', 'assets/player/bullet.png');

    //Mouse angle test code
    game.load.image('arrow', 'assets/sprites/arrow.png');
}

var player;
var platforms;
var wasd;

var stars;
var score = 0;
var scoreText;

var gravity = 1500;

var bgtile;

function create() {
    //Make the map large
    game.world.setBounds(0, 0, 1920, 1920);

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    //bgtile = game.add.tileSprite(0, 0, game.stage.bounds.width, 'checker');
    bgtile = game.add.tileSprite(0, 0, game.world.bounds.width, game.world.height, 'checker');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Setup the ground
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
    ledge.scale.setTo(.5, 2);
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // player stuff went here
    createPlayer();
    
    game.camera.deadzone = new Phaser.Rectangle(
        game.width * .3, game.height * .3, game.width * .4, game.height * .4);

    //  Finally some stars to collect
    stars = game.add.group();

    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = gravity;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    
    //  Our controls.
    wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
    };

//    var wasd = game.input.keyboard.addKeys({ 'up': Phaser.Keyboard.W, 'down': Phaser.Keyboard.S, 'left': Phaser.Keyboard.A, 'right': Phaser.Keyboard.D } );

    //Mouse angle testing
    arm = game.add.sprite(player.x, player.y, 'arm');
    arm.scale.setTo(3, 3);
    arm.smoothed = false;
    arm.anchor.setTo(0.1, 0.5);

    
}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    
    if (wasd.left.isDown || wasd.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -(player.maxSpeed);
//        player.animations.play('left');
    }
    else if (wasd.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = player.maxSpeed;
//        player.animations.play('right');
    }
    //  Stand still
    else {
        player.animations.stop();
        player.frame = 4;
    }
         
    //  Allow the player to jump if they are touching the ground.
    if (wasd.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -500;
    }

    //Mouse angle test
    arm.rotation = game.physics.arcade.angleToPointer(arm);
    if(player.body.velocity.x >= 0) {
        arm.x = player.x + player.width / 2;
    } else {
        arm.x = player.x;
    }
    arm.y = player.y + 10;
}

function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 10;
    scoreText.text = 'Score: ' + score;

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}
