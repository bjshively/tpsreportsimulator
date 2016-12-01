// TODO: Add leveling (keep same logic for now)
// TODO: more pick ups
// TODO: Add layer sorting

var game = new Phaser.Game(320, 240, Phaser.AUTO, 'game', {
    preload: preload,
    init: init,
    create: create,
    update: update,
    render: render
});

WebFontConfig = {
    // TODO: not sure what the fuck this line is for
    // 'active' means all requested fonts have finished loading
    // Set a 1 second delay before calling 'createText'.
    // For some reason if we don't the browser cannot render the text the first time it's created.
    // active: function() { game.time.events.add(Phaser.Timer.SECOND, showHelpText, this); },

    //  Load fonts into the array
    google: {
        families: ['VT323']
    }
};

var gameStarted = false;
var timeCounter = 0;
var currentTime = 0;
var graphics;

var player;
var enemies;
var items;
var walls;
var masterGroup;

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

    // Level sprites
    game.load.image('background', 'assets/level/background.png');
    game.load.atlas('desk', 'assets/level/desk.png', 'assets/level/desk.json');
    game.load.atlas('deskWithPrinter', 'assets/level/deskWithPrinter.png',
        'assets/level/deskWithPrinter.json');
    game.load.atlas('printer', 'assets/level/printer.png', 'assets/level/printer.json');
    game.load.atlas('walls', 'assets/level/walls.png', 'assets/level/walls.json');

    // player sprites
    game.load.atlas('player', 'assets/player/player.png', 'assets/player/player.json');
    game.load.image('reticle', 'assets/player/reticle.png');
    game.load.spritesheet('heart', 'assets/player/health.png', 23, 23);

    // item sprites
    game.load.spritesheet('stapler', 'assets/weapons/staplerPickup.png', 16, 16);
    game.load.image('staple', 'assets/weapons/staplerAmmo.png');
    game.load.spritesheet('cd', 'assets/weapons/cd.png', 11, 11);
    game.load.image('cutter', 'assets/weapons/cutter.png');
    game.load.spritesheet('shoes', 'assets/items/shoes.png', 16, 16)
    game.load.spritesheet('vest', 'assets/items/vest.png', 16, 20)

    // enemy sprites
    game.load.spritesheet('enemy1', 'assets/enemies/enemy1.png', 15, 31);
    game.load.spritesheet('enemy2', 'assets/enemies/enemy2.png', 15, 31);
    game.load.spritesheet('enemy3', 'assets/enemies/enemy3.png', 15, 31);
    game.load.spritesheet('enemy4', 'assets/enemies/enemy4.png', 15, 31);
    game.load.spritesheet('enemy5', 'assets/enemies/enemy5.png', 15, 31);
    game.load.image('blood', 'assets/enemies/blood.png');

    // sound effects
    // game.load.spritesheet('enemy1', 'assets/enemies/enemy1.png', 15, 31);
    // game.load.spritesheet('enemy2', 'assets/enemies/enemy2.png', 15, 31);

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
    // Try to keep in multiples of 32 for permiter sprites
    game.world.setBounds(0, 0, 352, 288);
    game.physics.startSystem(Phaser.Physics.ARCADE);

    lastLevel = Object.keys(levels).length;

    bgtile = game.add.tileSprite(0, 0, game.world.bounds.width, game.world.height, 'background');

    // Create object groups
    enemies = game.add.group();
    items = game.add.group();
    obstacles = game.add.group();
    walls = game.add.group();
    enemies.enableBody = true;
    items.enableBody = true;
    obstacles.enableBody = true;
    walls.enableBody = true;
    enemies.sort();
    obstacles.sort();

    // create all the things
    createControls();
    createPlayer();
    createWeapons();
    createLevel(player.level);
    createItems();

    player.weapon = weaponStapler;
    ////////////////////////
    // HUD
    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    // healthText = game.add.text(0, 0, '', {
    //     font: '14px VT323',
    //     fill: '#FFF'
    // });
    // healthText.stroke = '#000';
    // healthText.strokeThickness = 3;
    // // alight left
    // healthText.anchor.setTo(0, 0);
    // healthText.position.setTo(5, 5);
    // healthText.fixedToCamera = true;

    levelText = game.add.text(0, 0, '', {
        font: '14px VT323',
        fill: '#FFF'
    });
    levelText.stroke = '#000';
    levelText.strokeThickness = 3;
    // align right
    levelText.anchor.setTo(0, 1);
    levelText.position.setTo(5, game.camera.height - 5);
    levelText.fixedToCamera = true;

    scoreText = game.add.text(0, 0, '', {
        font: '14px VT323',
        fill: '#FFF'
    });
    scoreText.stroke = '#000';
    scoreText.strokeThickness = 3;
    // align center
    scoreText.anchor.setTo(1, 0);
    scoreText.position.setTo(game.camera.width - 5, 5);
    scoreText.fixedToCamera = true;

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
        fill: '#fff',
        align: 'center'
    });
    helpText.stroke = '#000';
    helpText.strokeThickness = 3;
    // align center
    helpText.anchor.setTo(0.5, 1);
    helpText.position.setTo(game.camera.width / 2, game.camera.height - 5);
    helpText.fixedToCamera = true;
    helpText.visible = false;

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
    // draw a rectangle
    // graphics.drawRect(0, 0, game.world.bounds.x, game.world.bounds.y);
    // graphics.beginFill(0x00000, 1);



    masterGroup = game.add.group();

    game.camera.flash('#000000');
}

function update() {

    // Start menu
    if (!gameStarted) {
        enemies.visible = false;
        obstacles.visible = false;
        reticle.visible = false;
        player.visible = false;
        showHelpText('Kill the enemies.\n' +
                'Press \'E\' to hack terminals.\n' +
                'Don\'t die.\n' +
                'Press SPACE to start.\n\n',
                100000)
            // Display menu/instructions

        //Start game
        if (wasd.space.isDown) {
            gameStarted = true;
            enemies.visible = true;
            obstacles.visible = true;
            reticle.visible = true;
            player.visible = true;
            helpText.visible = false;
        }
    } else {

        // Only perform player actions if the player is alive
        if (player.alive) {
            updateControls();
            updatePlayer();
            updateEnemies();

            // Make help text disappear after expiration
            if (game.time.now > helpText.expirationTime) {
                helpText.visible = false;
            }
        }

        // This is a quick way to test any function by mapping it to the hack key
        // if (wasd.hackKey.isDown) {
        //     elevator.close();
        // }
        updateHUD();

        // TODO: touching the printer sets it off, but only if getting hurt??
        game.physics.arcade.collide(player, printer);
        game.physics.arcade.collide(player, obstacles, interactWithObstacle);
        game.physics.arcade.collide(player, elevator, completeLevel);
        game.physics.arcade.collide(player, walls);

        game.physics.arcade.collide(obstacles, obstacles);
        game.physics.arcade.collide(enemies, enemies);
        game.physics.arcade.overlap(player, items, collectItem);
        game.physics.arcade.collide(player.weapon.bullets, enemies, damageEnemy);
        game.physics.arcade.collide(player, enemies, player.takeDamage);
        // TODO: enemies still go through obstacles
        game.physics.arcade.collide(enemies, obstacles);
        game.physics.arcade.collide(enemies, walls);
        game.physics.arcade.overlap(player.weapon.bullets, obstacles, killBullet);


        // On new levels, open the elevator, and wait for the player to exit to close it
        // TODO: put this somewhere better?
        if (player.level > 1 && player.body.y > 32 && elevator.starting) {
            elevator.close();
        }

        // obstacles.sort('y', Phaser.Group.SORT_ASCENDING);
        // enemies.sort('y', Phaser.Group.SORT_ASCENDING);
        // masterGroup.add(enemies);
        // masterGroup.add(items);
        // masterGroup.add(obstacles);
        // masterGroup.add(walls);
        // masterGroup.add(player);
        //masterGroup.sort();

        // masterGroup.sort('y', Phaser.Group.SORT_ASCENDING);
    }

}

//*********************************
//Helper Functions
//*********************************
function killBullet(bullet) {
    bullet.kill();
}

function interactWithObstacle(player, obstacle) {
    // if (obstacle.complete == false) {
    obstacle.interact();
    // }
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
    reticle.kill();
    // healthText.kill();
    levelText.kill();
    gameOverText.text = message;
    player.kill();
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
    walls.removeAll();
    game.camera.onFadeComplete.removeAll();
    game.camera.onFlashComplete.removeAll();
}

function completeLevel() {
    if (elevator.isOpen && elevator.canProceed) {
        // lock out the elevator so you can just hold up and keep advancing levels
        elevator.canProceed = false;
        player.canMove = false;

        // fade to black then advance the level
        game.camera.fade('#000000');
        game.camera.onFadeComplete.add(function() {
            player.level += 1;
            createLevel(player.level);
        });
    }
}

function createLevel(level) {
    clearLevel();

    // TODO: Add "space to restart"

    if (player.level > lastLevel) {
        game.camera.flash('#000000');
        gameOver('YOU WIN');
    } else {
        drawLevel();
        // start with the elevator open
        if (level > 1) {
            elevator.body.setSize(32, 12, 0, 0);
            elevator.frame = 16;
            elevator.isOpen = true;
            elevator.starting = true;
        }

        // fade in from black and unlock player movement
        game.camera.flash('#000000');
        game.camera.onFlashComplete.add(function() {
            player.canMove = true;
        });

        // keep player safe on new levels
        player.makeInvincible();
    }
}

function updateHUD() {
    // healthText.text = 'Health: ' + player.health;
    levelText.text = 'Level: ' + player.level;
    scoreText.text = 'Score: ' + player.score;
    currentWeapon.loadTexture(player.weapon.icon);

}

function showHelpText(message, duration) {
    helpText.text = message;
    helpText.visible = true;
    helpText.expirationTime = game.time.now + duration;
}

//Toggle debug information
var run_debug = false;

function render() {
    if (run_debug) {
        game.debug.text('Sprite z-depth: ' + player.z, 10, 20);
        // game.debug.text(player.invincible, 5, 15);
        // game.debug.cameraInfo(game.camera, 5, 15);
        // game.debug.spriteCoords(player, 5, 90);
        // game.debug.text(
        // 'Seconds: ' + Math.round(
        // game.time.totalElapsedSeconds() * 100) / 100, 5, 140);
        // game.debug.text(
        //     'Mouse angle: ' + game.math.radToDeg(
        //     game.physics.arcade.angleToPointer(player)), 5, 160)
    }
}