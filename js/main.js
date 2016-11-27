// TODO: Add leveling (keep same logic for now)
// TODO: more pick ups

/* TODO: 
 
 */
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
var graphics;

var player;
var enemies;
var items;

var printer;
var wasd;
var reticle;

var lastLevel;

var scoreText;
var healthText;
var levelText;
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
    game.load.script('levels', 'js/levels.js');
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    // Load sprites
    game.load.image('background', 'assets/background.png');
    game.load.atlas('desk', 'assets/desk.png', 'assets/desk.json');
    game.load.atlas('deskWithPrinter', 'assets/deskWithPrinter.png', 'assets/deskWithPrinter.json');
    game.load.atlas('printer', 'assets/printer.png', 'assets/printer.json');
    game.load.atlas('walls', 'assets/walls.png', 'assets/walls.json');

    game.load.atlas('player', 'assets/player/player.png', 'assets/player/player.json');
    game.load.image('reticle', 'assets/player/reticle.png');
    game.load.spritesheet('stapler', 'assets/player/weapon/staplerPickup.png', 16, 16);
    game.load.image('staple', 'assets/player/weapon/staplerAmmo.png');
    game.load.spritesheet('cd', 'assets/player/weapon/cd.png', 11, 11);
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
    game.add.graphics(0, 0);
    game.world.setBounds(0, 0, 384, 304);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    bgtile = game.add.tileSprite(0, 0, game.world.bounds.width, game.world.height, 'background');

    bgtile = game.add.sprite(0, 0, 'walls');
    bgtile.frame = 2;
    bgtile = game.add.sprite(32, 0, 'walls');
    bgtile.frame = 0;
    bgtile = game.add.sprite(64, 0, 'walls');
    bgtile.frame = 6;
    bgtile = game.add.sprite(96, 0, 'walls');
    bgtile.frame = 0;
    bgtile = game.add.sprite(128, 0, 'walls');
    bgtile.frame = 6;
    bgtile = game.add.sprite(160, 0, 'walls');
    bgtile.frame = 1;
    bgtile = game.add.sprite(192, 0, 'walls');
    bgtile.frame = 1;
    bgtile = game.add.sprite(224, 0, 'walls');
    bgtile.frame = 6;
    bgtile = game.add.sprite(256, 0, 'walls');
    bgtile.frame = 0;
    bgtile = game.add.sprite(288, 0, 'walls');
    bgtile.frame = 6;
    bgtile = game.add.sprite(320, 0, 'walls');
    bgtile.frame = 0;
    bgtile = game.add.sprite(352, 0, 'walls');
    bgtile.frame = 3;

    bgtile = game.add.sprite(0, 32, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 64, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 96, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 128, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 160, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 192, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 224, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 256, 'walls');
    bgtile.frame = 4;
    bgtile = game.add.sprite(0, 288, 'walls');
    bgtile.frame = 4;

    bgtile = game.add.sprite(352, 32, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 64, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 96, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 128, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 160, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 192, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 224, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 256, 'walls');
    bgtile.frame = 5;
    bgtile = game.add.sprite(352, 288, 'walls');
    bgtile.frame = 5;

    lastLevel = Object.keys(levels).length;


    // Create object groups
    enemies = game.add.group();
    items = game.add.group();
    obstacles = game.add.group();
    enemies.enableBody = true;
    items.enableBody = true;
    obstacles.enableBody = true;

    // create all the things
    createControls();
    createPlayer();
    createWeapons();
    createLevel(player.level);

    player.weapon = weaponStapler;
    ////////////////////////
    // HUD
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    healthText = game.add.text(0, 0, '', {
        font: '14px VT323',
        fill: '#FFF'
    });
    healthText.stroke = '#000';
    healthText.strokeThickness = 3;
    // alight left
    healthText.anchor.setTo(0, 0);
    healthText.position.setTo(5, 5);
    healthText.fixedToCamera = true;

    scoreText = game.add.text(0, 0, '', {
        font: '14px VT323',
        fill: '#FFF'
    });
    scoreText.stroke = '#000';
    scoreText.strokeThickness = 3;
    // align center
    scoreText.anchor.setTo(0.5, 0);
    scoreText.position.setTo(game.camera.width / 2, 5);
    scoreText.fixedToCamera = true;

    levelText = game.add.text(0, 0, '', {
        font: '14px VT323',
        fill: '#FFF'
    });
    levelText.stroke = '#000';
    levelText.strokeThickness = 3;
    // align right
    levelText.anchor.setTo(1, 0);
    levelText.position.setTo(game.camera.width - 5, 5);
    levelText.fixedToCamera = true;

    gameOverText = game.add.text(0, 0, '', {
        font: '30px VT323',
        fill: '#fff'
    });
    gameOverText.stroke = '#000';
    gameOverText.strokeThickness = 6;
    // align center
    gameOverText.anchor.setTo(0.5, 0.5);
    gameOverText.position.setTo(game.camera.width / 2, game.camera.height / 2);
    gameOverText.fixedToCamera = true;

    helpText = game.add.text(0, 0, '', {
        font: '14px VT323',
        fill: '#fff'
    });
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
    // levelText = createHUDtext('FUCK YOU', '14px', 3);
    // // align right
    // levelText.anchor.setTo(1, 0);
    // levelText.position.setTo(game.camera.width - 5, 5);

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
    blood.minRotation = 0;
    blood.maxRotation = 0;
    blood.smoothed = false;
    blood.setSize(5, 5);
    blood.gravity = 500;
    // set the velocities in X, Y
    // don't mess with these numbers they're kinda confusing
    blood.minParticleSpeed.setTo(-75, -150);
    blood.maxParticleSpeed.setTo(75, 1);

    graphics = game.add.graphics(100, 100);

}

function update() {
    // Only perform player actions if the player is alive
    if (player.alive) {
        updateControls();
        updatePlayer();
        updateEnemies();
  //      console.log(obstacles);
//        console.log(obstacles.checkAll('complete', 'true'));
    }

    // This is a quick way to test any function by mapping it to the hack key
    // if (wasd.hackKey.isDown) {
    //     clearLevel();
    // }
    updateHUD();

    game.physics.arcade.collide(player, obstacles, interactWithObstacle);
    game.physics.arcade.collide(obstacles, obstacles);
    game.physics.arcade.collide(enemies, enemies);
    game.physics.arcade.overlap(player, items, collectItem);
    game.physics.arcade.collide(player, obstacles, showHelpText);
    game.physics.arcade.collide(player.weapon.bullets, enemies, damageEnemy);
    game.physics.arcade.collide(player, enemies, player.takeDamage);
    // TODO: enemies still go through obstacles
    game.physics.arcade.collide(enemies, obstacles);
    game.physics.arcade.overlap(player.weapon.bullets, obstacles, killBullet);
    // TODO: LOLOL this kills printer
    // game.physics.arcade.overlap(player.weapon.bullets, printer, killBullet);

    game.physics.arcade.collide(player, printer);

}

//*********************************
//Helper Functions
//*********************************
function killBullet(bullet) {
    bullet.kill();
}

function interactWithObstacle(player, desk) {
    if (desk.complete == false) {
        desk.interact();
    }
}

function collectItem(player, item) {
    item.collect();
    //Implement item interaction logic
}

function bloodSplatter(where) {
    for (var i = 0; i < game.rnd.integerInRange(10, 20); i++) {
        blood.x = where.x;
        blood.y = where.y;
        var maxSize = game.rnd.integerInRange(1, 5);
        var lifespan = game.rnd.integerInRange(100, 500);
        blood.setScale(1, maxSize, 1, maxSize, lifespan);
        blood.start(true, lifespan, null, 1);
    }
}

// Display gameover message
function gameOver(message) {
    game.camera.follow(null, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
    player.kill();
    reticle.kill();
    healthText.kill();
    levelText.kill();
    gameOverText.text = message;
}

// function selectWeapon(weapon) {
//     selectedWeapon.kill();
//     selectedWeapon = game.add.sprite(game.camera.width - 20, game.camera.height - 20, weapon);
//     selectedWeapon.fixedToCamera = true;
// }

function clearLevel() {
    // Clear obstacles and items
    obstacles.removeAll();
    items.removeAll();
}

function createLevel(level) {
    clearLevel();
    if (player.level > lastLevel) {
        gameOver('YOU WIN');
    } else {
        var currentLevel = levels[player.level];
        var currentLevelEnemies = currentLevel['enemies'];
        var currentLevelObstacles = currentLevel['obstacles'];

        for (var i = 0; i < currentLevelEnemies[1]; i++) {
            createEnemy(2, 1);
        }

        for (obstacle in currentLevelObstacles) {
            for (var i = 0; i < currentLevelObstacles[obstacle]; i++) {
                createObstacle(obstacle);
            }
        }
    }
}

function updateHUD() {
    scoreText.text = 'Score: ' + player.score;
    healthText.text = 'Health: ' + player.health;
    levelText.text = 'Level: ' + player.level;
    currentWeapon.loadTexture(player.weapon.icon);

}

function showHelpText(message, duration) {
    console.log(1);
    helpText.visible = true;
    helpText.text = message;
}

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