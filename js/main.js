// TODO: Add leveling (keep same logic for now)
// TODO: more pick ups

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

// TODO: not sure what the fuck this line is for
//    active: function() { game.time.events.add(Phaser.Timer.SECOND, null, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['VT323']
    }

};

//Toggle debug information
var run_debug = false;
var timeCounter = 0;
var currentTime = 0;

var player;
var enemies;
var items;

var printer;
var wasd;
var reticle;

var scoreText;
var healthText;
var waveText;
var gameOverText;
var helpText;

var pickupStapler;
var pickupCD;
var bgtile;

// Weapon stuff
var weaponCutter;
var weaponCD;
var weaponStapler;
var currentWeapon;
var blood;

function preload() {
    // load JS module files
    game.load.script('player', 'js/player.js');
    game.load.script('enemies', 'js/enemies.js');
    game.load.script('controls', 'js/controls.js');
    game.load.script('items', 'js/items.js');
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    // Load sprites
    game.load.image('background', 'assets/background.png');
    game.load.spritesheet('desk', 'assets/desk.png', 42, 39);
    game.load.spritesheet('deskWithPrinter', 'assets/deskWithPrinter.png', 33, 39);
    game.load.atlas('printer', 'assets/printer.png', 'assets/printer.json');
    
    // game.load.spritesheet('player', 'assets/player/player.png', 15, 31);
    game.load.atlasJSONArray('player', 'assets/player/player.png', 'assets/player/player.json');
    game.load.image('reticle', 'assets/player/reticle.png');
    game.load.spritesheet('stapler', 'assets/player/weapon/staplerPickup.png', 16, 16);
    game.load.image('staple', 'assets/player/weapon/staplerAmmo.png');
    game.load.spritesheet('cd', 'assets/player/weapon/cd.png', 11, 11, 16);
    game.load.image('cutter', 'assets/player/weapon/cutter.png');

    game.load.spritesheet('enemy1', 'assets/enemies/enemy1.png', 15, 31);
    game.load.spritesheet('enemy2', 'assets/enemies/enemy2.png', 15, 31);
    game.load.spritesheet('enemy3', 'assets/enemies/enemy3.png', 15, 31);
    game.load.spritesheet('enemy4', 'assets/enemies/enemy4.png', 15, 31);
    game.load.spritesheet('enemy5', 'assets/enemies/enemy5.png', 15, 31);
    game.load.image('blood', 'assets/blood.png');
    
    // Enable pixel-perfect game sscaling
    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(3, 3);
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
}

function init() {}

function create() {
    //  World Setup
    game.world.setBounds(0, 0, 400, 300);
    bgtile = game.add.tileSprite(0, 0, game.world.bounds.width, game.world.height, 'background');
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // create all the things
    createControls();
    createItems();
    createPlayer();
    createWeapons();
    createEnemies();

    // TODO: enable this to carry over from the previous wave
    player.weapon = weaponCutter;

    ////////////////////////
    // HUD
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    healthText = game.add.text(0, 0, '', {font: '14px VT323', fill: '#FFF'});
    healthText.stroke = '#000';
    healthText.strokeThickness = 3;
    // alight left
    healthText.anchor.setTo(0, 0);
    healthText.position.setTo(5, 5);
    healthText.fixedToCamera = true;

    scoreText = game.add.text(0, 0, '', {font: '14px VT323', fill: '#FFF'});
    scoreText.stroke = '#000';
    scoreText.strokeThickness = 3;
    // align center
    scoreText.anchor.setTo(0.5, 0);
    scoreText.position.setTo(game.camera.width / 2, 5);
    scoreText.fixedToCamera = true;

    waveText = game.add.text(0, 0, '', {font: '14px VT323', fill: '#FFF'});
    waveText.stroke = '#000';
    waveText.strokeThickness = 3;
    // align right
    waveText.anchor.setTo(1, 0);
    waveText.position.setTo(game.camera.width - 5, 5);
    waveText.fixedToCamera = true;

    gameOverText = game.add.text(0, 0,'', {font: '30px VT323', fill: '#fff' });
    gameOverText.stroke = '#000';
    gameOverText.strokeThickness = 6;
    // align center
    gameOverText.anchor.setTo(0.5, 0.5);
    gameOverText.position.setTo(game.camera.width / 2, game.camera.height / 2);
    gameOverText.fixedToCamera = true;

    helpText = game.add.text(0, 0,'', {font: '14px VT323', fill: '#fff' });
    helpText.stroke = '#000';
    helpText.strokeThickness = 3;
    // align center
    helpText.anchor.setTo(0.5, 1);
    helpText.position.setTo(game.camera.width / 2, game.camera.height - 5);
    helpText.fixedToCamera = true;
    helpText.visible = false;

    // show current weapon
    currentWeapon = game.add.sprite(50, 50, player.weapon.icon);
    currentWeapon.anchor.setTo(1, 1);
    currentWeapon.position.setTo(game.camera.width - 5, game.camera.height - 5);
    currentWeapon.fixedToCamera = true;

    // TODO: WTF Y NO WORK
    // waveText = createHUDtext('FUCK YOU', '14px', 3);
    // // align right
    // waveText.anchor.setTo(1, 0);
    // waveText.position.setTo(game.camera.width - 5, 5);

    // function createHUDtext (words, size, thickness) {
    //     var element = game.add.text(0, 0, words, {font: '14px VT323', fill: '#fff' });
    //     element.stroke = '#000';
    //     element.strokeThickness = thickness;
    //     element.fixedToCamera = true;
    //     return element;
    // }

    // setup the blood shots
    blood = game.add.emitter(0, 0, 100);
    blood.makeParticles('blood');
    blood.setSize(5, 5);
    blood.minParticleSpeed.setTo(-10, -10);
    blood.maxParticleSpeed.setTo(10, -10);
    blood.gravity = 10;
    blood.duration = 3000;

    blood.setScale(1, 5, 1, 5, blood.duration, Phaser.Easing.Quintic.Out);

}

function update() {
    // Only perform player actions if the player is alive
    if (player.alive) {
        updateControls();
        updatePlayer();
        updateEnemies();
    }

    game.physics.arcade.collide(player, desks);
    game.physics.arcade.collide(desks, desks);
    game.physics.arcade.collide(enemies, enemies);
    game.physics.arcade.overlap(player, items, collectItem);
    game.physics.arcade.overlap(player, desks, hackHelp);
    game.physics.arcade.collide(player.weapon.bullets, enemies, damageEnemy);
    game.physics.arcade.collide(player, enemies, takeDamage);
    // TODO: enemies still go through desks
    game.physics.arcade.collide(enemies, desks);
    game.physics.arcade.overlap(player.weapon.bullets, desks, killBullet);
    // TODO: LOLOL this kills printer
    // game.physics.arcade.overlap(player.weapon.bullets, printer, killBullet);

    game.physics.arcade.collide(player, printer, printer.print);
    
    scoreText.text = 'Score: ' + player.score;
    healthText.text = 'Health: ' + player.health;
    waveText.text = 'Wave: ' + player.wave;
    currentWeapon.loadTexture(player.weapon.icon);
}

//*********************************
//Helper Functions
//*********************************
function killBullet(bullet) {
    bullet.kill();
}

function hackHelp () {
    helpText.visible = true;
    helpText.text = 'Press \'E\' to hack';
}

function collectItem(player, item) {
    item.collect();
    //Implement item interaction logic
}

// Display gameover message
function gameOver(message) {
    game.camera.follow(null, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    player.kill();
    reticle.kill();
    healthText.kill();
    waveText.kill();
    gameOverText.text = message;
}

// function selectWeapon(weapon) {
//     selectedWeapon.kill();
//     selectedWeapon = game.add.sprite(game.camera.width - 20, game.camera.height - 20, weapon);
//     selectedWeapon.fixedToCamera = true;
// }

function render() {
    if (run_debug) {
        game.debug.text(player.invincible, 5, 15);
        game.debug.cameraInfo(game.camera, 5, 15);
        game.debug.spriteCoords(player, 5, 90);
        game.debug.text(
            'Seconds: ' + Math.round(game.time.totalElapsedSeconds() * 100) / 100, 5, 140);
        game.debug.text(
            'Mouse angle: ' + game.math.radToDeg(game.physics.arcade.angleToPointer(player)), 5, 160)
    }
}