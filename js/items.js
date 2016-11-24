function Weapon() {

}

function createItems() {
    // Create an items group
    // Each item should have a collect function that defines what happens when it is collected
    // TODO: existence is questionable?
    items = game.add.group();
    items.enableBody = true;

    pickupStapler = items.create(
        Math.abs(Math.random() * game.world.width - 44),
        Math.abs(Math.random() * game.world.height - 39),
        'stapler');
    pickupStapler.animations.add('bounce');
    pickupStapler.animations.play('bounce', 30, true);
    pickupStapler.collect = function() {
        player.weapon = weaponStapler;
        player.score += 20;
        this.kill();
    }

    pickupCD = items.create(
        Math.abs(Math.random() * game.world.width - 44),
        Math.abs(Math.random() * game.world.height - 39),
        'cd');
    pickupCD.animations.add('spin');
    pickupCD.animations.play('spin', 15, true);
    pickupCD.collect = function() {
        player.weapon = weaponCD;
        player.score += 10;
        this.kill();
    }

    // create some desks, add a collision offset
    desks = game.add.group();
    desks.enableBody = true;

    var desk = desks.create(
        Math.abs(Math.random() * game.world.width - 44),
        Math.abs(Math.random() * game.world.height - 39),
        'desk');
    desk.body.setSize(42, 29, 0, 3);
    desk.complete = false;
    desk.interact = function() {
    	this.complete = true;
        this.animations.play('hacking');
        this.animations.currentAnim.onComplete.add(function() {
            this.animations.play('done');
        }, this);
    }

    desk = desks.create(
        Math.abs(Math.random() * game.world.width - 44),
        Math.abs(Math.random() * game.world.height - 39),
        'desk');
    desk.body.setSize(42, 29, 0, 3);
    desk.complete = false;
    desk.interact = function() {
        this.complete = true;
        this.animations.play('hacking');
        this.animations.currentAnim.onComplete.add(function() {
            this.animations.play('done');
        }, this);
    }
    desks.callAll('animations.add', 'animations', 'flicker', Phaser.Animation.generateFrameNames('desk ', 0, 15, '.ase'), 30, false);
    desks.callAll('animations.add', 'animations', 'hacking', Phaser.Animation.generateFrameNames('desk ', 16, 59, '.ase'), 30, false);
    desks.callAll('animations.add', 'animations', 'done', Phaser.Animation.generateFrameNames('desk ', 60, 61, '.ase'), 30, true);


    // add a random printer desk
    desk = desks.create(
        Math.abs(Math.random() * game.world.width - 44),
        Math.abs(Math.random() * game.world.height - 39),
        'deskWithPrinter');
    desk.body.setSize(33, 29, 0, 3);
    desk.complete = false;
    desk.interact = function() {
        if (!this.complete) {
            this.animations.play('hacking');
            this.animations.currentAnim.onComplete.add(function() {
                this.animations.play('done');
                this.complete = true;
                printer.interact();
            }, this);
        }
    }
    desk.animations.add('flicker', Phaser.Animation.generateFrameNames('deskWithPrinter ', 0, 15, '.ase'), 30, false);
    desk.animations.add('hacking', Phaser.Animation.generateFrameNames('deskWithPrinter ', 16, 59, '.ase'), 30, false);
    desk.animations.add('done', Phaser.Animation.generateFrameNames('deskWithPrinter ', 60, 61, '.ase'), 30, true);


    // make desks immovable, world bound, add some animations & play them
    desks.setAll('body.collideWorldBounds', true);
    // desks.setAll('body.mass', -100);
    desks.setAll('body.immovable', true);
    desks.callAll('animations.play', 'animations', 'flicker', 30, true);


    // add a random printer
    printer = desks.create(
        Math.abs(Math.random() * game.world.width - 44),
        Math.abs(Math.random() * game.world.height - 39),
        'printer');
    game.physics.arcade.enable(printer);
    printer.body.setSize(39, 17, 0, 0);
    printer.body.mass = -1500;
    printer.body.collideWorldBounds = true;
    printer.animations.add(
        'standing', Phaser.Animation.generateFrameNames('printer ', 0, 0, '.ase'), 30, false);
    printer.animations.add(
        'printing', Phaser.Animation.generateFrameNames('printer ', 1, 197, '.ase'), 30, false);
    printer.animations.add(
        'eject', Phaser.Animation.generateFrameNames('printer ', 198, 212, '.ase'), 30, false);
    printer.animations.add(
        'done', Phaser.Animation.generateFrameNames('printer ', 213, 213, '.ase'), 30, false);
    printer.frame = 0;
    printer.interact = function() {
        this.animations.play('printing');
        this.animations.currentAnim.onComplete.add(function() {
            this.animations.play('eject');
            this.animations.currentAnim.onComplete.add(function() {
                this.animations.play('done');
            }, this);
        }, this);
    }
}

function createWeapons() {
    // create some weapons
    weaponCutter = game.add.weapon(1, 'cutter');
    weaponCutter.icon = 'cutter';
    weaponCutter.fireRate = 200;
    // TODO: FUCK THIS FUCKING MELEE GARBAGE ASS BULLSHIT
    // make it stop auto firing
    weaponCutter.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
    weaponCutter.bulletKillDistance = 10;
    weaponCutter.damage = 2;
    weaponCutter.bulletSpeed = 500;
    weaponCutter.trackedSprite = player;

    weaponCD = game.add.weapon(2, 'cd');
    weaponCD.icon = 'cd';
    weaponCD.setBulletFrames(8, 8);
    weaponCD.fireRate = 500;
    weaponCD.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    weaponCD.damage = 1;
    weaponCD.bulletSpeed = 300;
    weaponCD.trackedSprite = player;
    weaponCD.autofire = false;

    weaponStapler = game.add.weapon(10, 'staple');
    weaponStapler.icon = 'stapler';
    weaponStapler.fireRate = 200;
    weaponStapler.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    weaponStapler.damage = 1;
    weaponStapler.bulletSpeed = 300;
    weaponStapler.trackedSprite = player;
    //	weaponStapler.autofire = true;
}