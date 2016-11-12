var game = new Phaser.Game(320, 240, Phaser.AUTO, 'game', {
    preload: preload,
    init: init,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.spritesheet('dude', 'assets/player/player.png', 15, 30);
    game.load.spritesheet('enemy1', 'assets/enemies/enemy1.png', 15, 30);
    game.load.image('checker', 'assets/checker.png');
    game.load.image('reticle', 'assets/player/reticle.png');
    game.load.image('arm', 'assets/player/arm.png');
    game.load.image('gun', 'assets/player/weapon/gun.png');
    game.load.image('bullet', 'assets/player/weapon/bullet.png');

    // Enable pixel-perfect game scaling
    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(3, 3);
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
}

//Toggle debug information
var run_debug = false;

var player;
var platforms;
var wasd;

var score = 0;
var scoreText;

var gravity = 1500;

var sprite;
var bullets;
var fireWait = 400;
var nextFire = 0;

var bgtile;

function init() {}

function create() {
    // INPUT SETTINGS
    wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
        pointer: game.input.activePointer
    };

    //  Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture(
        [Phaser.Keyboard.W,
            Phaser.Keyboard.A,
            Phaser.Keyboard.S,
            Phaser.Keyboard.D,
            Phaser.Keyboard.SPACEBAR
        ]);

    game.input.mouse.capture = true;

    //  World Setup
    game.world.setBounds(0, 0, 800, 600);
    bgtile = game.add.tileSprite(0, 0, game.world.bounds.width, game.world.height, 'checker');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Setup the ground
    var ground = platforms.create(0, game.world.height - 5, 'ground');
    //    ground.scale.setTo(1, 60);
    ground.body.immovable = true;

    //  Now let's create two ledges
    //    var ledge = platforms.create(400, 400, 'ground');
    //    ledge.scale.setTo(.5, 2);
    //    ledge.body.immovable = true;
    //    ledge = platforms.create(-150, 250, 'ground');
    //    ledge.body.immovable = true;

    // player stuff went here
    createPlayer();

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    //game.camera.deadzone = new Phaser.Rectangle(
    //game.width * .35, game.height * .35, game.width * .3, game.height * .3);

    //  Scoreboard
    scoreText = game.add.text(16, 16, 'score: 0', {
        fontSize: '32px',
        fill: '#000'
    });

    if (run_debug) {
        mouseAngle = game.add.text(300, 300, game.physics.arcade.angleToPointer(player));
    }

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);


    //game.physics.enable(sprite, Phaser.Physics.ARCADE);

    //var wasd = game.input.keyboard.addKeys({ 'up': Phaser.Keyboard.W, 'down': Phaser.Keyboard.S, 'left': Phaser.Keyboard.A, 'right': Phaser.Keyboard.D } );
}

function update() {

    updatePlayer();

    if(run_debug){
        mouseAngle.text = game.math.radToDeg(game.physics.arcade.angleToPointer(player));
    }
    
    //Collisions
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(platforms, bullets, killBullet, null, this);
}

//*********************************
//Helper Functions
//*********************************

function collectItem(player, item) {

    //Implement item interaction logic
}

function killBullet(platform, bullet) {
    bullet.kill();
}

function fireBullet() {
    if (game.time.now > nextFire && bullets.countDead() > 0) {
        nextFire = game.time.now + fireWait;

        var bullet = bullets.getFirstDead();

        bullet.reset(player.x, player.y - 5);
        //        bullet.scale.setTo(3, 3);
        bullet.smoothed = false;

        game.physics.arcade.moveToPointer(bullet, 300);
    }
}

function render() {
    if (run_debug) {
        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);
    }

}