var game = new Phaser.Game(320, 240, Phaser.AUTO, 'game', {
    preload: preload,
    init: init,
    create: create,
    update: update,
    render: render
});

WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.

// emo: not sure what the fuck this line is for
//    active: function() { game.time.events.add(Phaser.Timer.SECOND, null, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['VT323']
    }

};

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.spritesheet('player', 'assets/player/player.png', 15, 31);
    game.load.spritesheet('enemy1', 'assets/enemies/enemy1.png', 15, 31);
    game.load.spritesheet('enemy2', 'assets/enemies/enemy2.png', 15, 31);
    game.load.spritesheet('enemy3', 'assets/enemies/enemy3.png', 15, 31);
    game.load.spritesheet('enemy4', 'assets/enemies/enemy4.png', 15, 31);
    game.load.spritesheet('enemy5', 'assets/enemies/enemy5.png', 15, 31);
    game.load.image('background', 'assets/background.png');
    game.load.image('reticle', 'assets/player/reticle.png');
    game.load.image('arm', 'assets/player/arm.png');
    game.load.image('gun', 'assets/player/weapon/gun.png');
    game.load.image('staple', 'assets/player/weapon/staple.png');
    game.load.image('cdfront', 'assets/player/weapon/cdfront.png');
    game.load.image('cdback', 'assets/player/weapon/cdback.png');
    game.load.spritesheet('desk', 'assets/workstation.png', 42, 39, 16);
    game.load.spritesheet('stapler', 'assets/player/weapon/stapler.png', 16, 16, 10);
    

    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');


    // Enable pixel-perfect game scaling
    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(3, 3);
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
}

//Toggle debug information
var run_debug = false;
var timeCounter = 0;
var currentTime = 0;

var player;
var enemies;
var items;

var platforms;
var wasd;
var reticle;

var scoreText;
var healthText;

var stapler;
var bullets;
var nextFire = 0;

var bgtile;


// Weapon stuff (cooldown, damage)
var pistol = new Weapon(400, 1);
var machinegun = new Weapon(100, 2);

var mygun = pistol;

function init() {}

function create() {
    createControls();
    //  World Setup
    game.world.setBounds(0, 0, 400, 300);
    bgtile = game.add.tileSprite(0, 0, game.world.bounds.width, game.world.height, 'background');
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // create some immovable desks and play animations
    desks = game.add.group();
    desks.enableBody = true;

    var desk = desks.create(
        Math.abs(Math.random() * game.world.width - 44),
        Math.abs(Math.random() * game.world.height - 39),
        'desk');
    desk = desks.create(
        Math.abs(Math.random() * game.world.width - 44),
        Math.abs(Math.random() * game.world.height - 39),
        'desk');
    
    desks.setAll('body.immovable', true);
    desks.callAll('animations.add', 'animations', 'flicker');
    desks.callAll('animations.play', 'animations', 'flicker', 30, true);



    // Create an items group
    // Each item should have a collect function that defines what happens when it is collected
    items = game.add.group();
    items.enableBody = true;
    var stapler = items.create(
        Math.abs(Math.random() * game.world.width - 44),
        Math.abs(Math.random() * game.world.height - 39),
        'stapler');
    stapler.collect = function(){
        mygun = machinegun;
        this.kill();
    }
    stapler.animations.add('bounce');
    stapler.animations.play('bounce', 30, true);




    createPlayer();
    createEnemies();

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    //  HUD
    healthText = game.add.text(5, 5, 'Health: ' + player.health, {
        font: 'VT323',
        fontSize: '14px',
        fill: '#FFF'
    });
    healthText.fixedToCamera = true;

    scoreText = game.add.text(healthText.width + 15, 5, 'Score: ' + player.score, {
        font: 'VT323',
        fontSize: '14px',
        fill: '#FFF'
    });
    scoreText.fixedToCamera = true;


    // Bullets - TODO: Cleanup / roll into player or gun code
    // TODO - Destroy bullets when they exit camera pane, i.e. cannot shoot enemies off screen
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'staple');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    reticle = game.add.sprite(
        game.input.activePointer.worldX, game.input.activePointer.worldY, 'reticle');
}

function update() {
    // Check to see if all enemies are dead
    if (enemies.countLiving() == 0) {
        // Do something when the player wins
    }

    // Replace cursor with reticle
    updateControls();

    // Only perform player actions if the player is alive
    if (player.alive) {
        updatePlayer();
        updateEnemies();

        // Weapon select
        if (wasd.pistolKey.isDown) {
            mygun = pistol;
        }
        if (wasd.machinegunKey.isDown) {
            mygun = machinegun;
}
    }

    game.physics.arcade.collide(player, desks);
    game.physics.arcade.overlap(player, items, collectItem, null, this);
    game.physics.arcade.overlap(bullets, enemies, damageEnemy, null, this);
    game.physics.arcade.overlap(player, enemies, takeDamage, null, this);

    scoreText.text = 'Score: ' + player.score;
    healthText.text = 'Health: ' + player.health;
}

//*********************************
//Helper Functions
//*********************************

function collectItem(player, item) {
    item.collect();
    //Implement item interaction logic
}

// Display gameover message
// TODO: Make this suck less
function gameOver() {
    var gameover = game.add.text(0, 0, 'GAME\nERVER', {
            font: 'VT323',
            fontSize: '30px',
            fill: '#FFF'
        });
    gameover.position.setTo(
        (game.camera.x + (game.camera.width / 2)) - (gameover.width / 2),
        (game.camera.y + (game.camera.height / 2)) - (gameover.height / 2)
        );
    //game.camera.follow(gameover);
}

function render() {
    if (run_debug) {
       game.debug.text(player.invincible, 5, 15);
       game.debug.cameraInfo(game.camera, 5, 15);
       game.debug.spriteCoords(player, 5, 90);
       game.debug.text('Seconds: ' + Math.round(game.time.totalElapsedSeconds() * 100) / 100, 5, 140);
       game.debug.text('Mouse angle: ' + game.math.radToDeg(game.physics.arcade.angleToPointer(player)), 5, 160)
    }
}