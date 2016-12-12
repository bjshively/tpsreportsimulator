function Weapon() {

}

var vest;
var shoes;
var stopwatch;
//var cubicle;

function createItems() {
    // Create an items group
    // Each item should have a collect function that defines what happens when it is collected
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

    pickupNerfGun = items.create(
        Math.abs(Math.random() * game.world.width - 44),
        Math.abs(Math.random() * game.world.height - 39),
        'nerfgun');
    pickupNerfGun.animations.add('bounce');
    pickupNerfGun.animations.play('bounce', 30, true);
    pickupNerfGun.collect = function() {
        player.weapon = weaponNerfGun;
        player.score += 20;
        this.kill();
    }

    pickupCD = items.create(
        Math.abs(Math.random() * game.world.width - 44),
        Math.abs(Math.random() * game.world.height - 39),
        'cd');
    pickupCD.animations.add('spin', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 15, true);
    pickupCD.animations.play('spin');
    pickupCD.collect = function() {
        player.weapon = weaponCD;
        player.score += 10;
        this.kill();
    }

    // TODO: add code to make collected items appear in relevant spots as player collects them
}

function createObstacle(type, whereX, whereY) {
    // create regular desk
    if (type == 'desk') {
        // Create regular desks
        var desk = obstacles.create(whereX, whereY, type);
        desk.body.setSize(32, 18, 0, 12);
        desk.complete = false;
        desk.interact = function() {
            if (!this.complete) {
                if (wasd.hackKey.isDown) {
                    this.animations.play('hacking');
                    this.animations.currentAnim.onComplete.add(function() {
                        this.animations.play('done');
                        this.complete = true;
                    }, this);
                }
            }
        }
        desk.animations.add(
            'flicker', Phaser.Animation.generateFrameNames('desk ', 0, 15, '.ase'), 30, true);
        desk.animations.add(
            'hacking', Phaser.Animation.generateFrameNames('desk ', 16, 59, '.ase'), 30, false);
        desk.animations.add(
            'done', Phaser.Animation.generateFrameNames('desk ', 60, 61, '.ase'), 30, true);
        desk.animations.play('flicker', 30, true);

        // Setup desk physics
        desk.body.collideWorldBounds = true;
        desk.body.immovable = true;
    }

    // Create desk that controls printer
    if (type == 'deskWithPrinter') {
        var desk = obstacles.create(whereX, whereY, type);
        desk.body.setSize(32, 29, 0, 3);
        desk.complete = false;
        desk.interact = function() {
            if (!this.complete) {
                if (wasd.hackKey.isDown) {
                    this.animations.play('hacking');
                    this.animations.currentAnim.onComplete.add(function() {
                        this.animations.play('done');
                        this.complete = true;
                        printer.complete = true;
                        printer.activate();
                    }, this);
                }
            }
        }
        desk.animations.add(
            'flicker', Phaser.Animation.generateFrameNames('deskWithPrinter ', 0, 15, '.ase'), 30, true);
        desk.animations.add(
            'hacking', Phaser.Animation.generateFrameNames('deskWithPrinter ', 16, 59, '.ase'), 30, false);
        desk.animations.add(
            'done', Phaser.Animation.generateFrameNames('deskWithPrinter ', 60, 61, '.ase'), 30, true);
        desk.animations.play('flicker');

        // Setup desk physics
        desk.body.collideWorldBounds = true;
        desk.body.immovable = true;
    }

    // create printer
    if (type == 'printer') {
        printer = obstacles.create(whereX, whereY, type);
        game.physics.arcade.enable(printer);
        printer.body.setSize(39, 17, 0, 12);
        // printer.body.mass = -1500;
        printer.body.collideWorldBounds = true;
        printer.body.immovable = true;
        printer.animations.add(
            'standing', Phaser.Animation.generateFrameNames('printer ', 0, 0, '.ase'), 30, false);
        printer.animations.add(
            'printing', Phaser.Animation.generateFrameNames('printer ', 1, 141, '.ase'), 30, false);
        printer.animations.add(
            'eject', Phaser.Animation.generateFrameNames('printer ', 142, 156, '.ase'), 30, false);
        printer.animations.add(
            'done', Phaser.Animation.generateFrameNames('printer ', 157, 157, '.ase'), 30, false);
        printer.frame = 0;
        printer.interact = function() {};
        printer.activate = function() {
            this.animations.play('printing');
            this.animations.currentAnim.onComplete.add(function() {
                this.animations.play('eject');
                this.animations.currentAnim.onComplete.add(function() {
                    this.animations.currentAnim.onComplete.removeAll();
                    this.animations.play('done');
                    printItem();
                }, this);
            }, this);
        }

        printer.body.collideWorldBounds = true;
        printer.body.immovable = true;
    }

    // create cubicles
    if (type == 'cubicle') {
    	// TODO: needed?
        // game.physics.arcade.enable(cubicle);
        var rand = game.rnd.integerInRange(1, 10);

        // full cube
        if (rand == 1) {
            var cubicle = walls.create(whereX + 2, whereY, 'cubewallhorizontal');
            cubicle.body.setSize(32, 1, 0, 20);
            cubicle.body.immovable = true;
            cubicle = walls.create(whereX - 4, whereY + 4, 'cubewallvertical');
            cubicle.body.setSize(4, 10, 0, 20);
            cubicle.body.immovable = true;
            cubicle = walls.create(whereX + 32, whereY + 4, 'cubewallvertical'); 
            cubicle.body.setSize(4, 10, 0, 20);
            cubicle.body.immovable = true;
        }

        // half cube left wall
        if (rand == 2) {
            var cubicle = walls.create(whereX + 2, whereY, 'cubewallhorizontal');
            cubicle.body.setSize(32, 1, 0, 20);
            cubicle.body.immovable = true;
            cubicle = walls.create(whereX - 4, whereY + 4, 'cubewallvertical'); 
            cubicle.body.setSize(4, 10, 0, 20);
            cubicle.body.immovable = true;
        }

        // half cube right wall
        if (rand == 3) {
            var cubicle = walls.create(whereX + 2, whereY, 'cubewallhorizontal');
            cubicle.body.setSize(32, 1, 0, 20);
            cubicle.body.immovable = true;
            cubicle = walls.create(whereX + 32, whereY + 4, 'cubewallvertical'); 
            cubicle.body.setSize(4, 10, 0, 20);
            cubicle.body.immovable = true;
        }

        // cubicle.body.immovable = true;
        // cubicle.interact = function() {}
    }
}

function printItem() {
    makeShoes(printer.x + 10, printer.y + printer.height - 5);
	switch(game.rnd.integerInRange(1, 3)) {
		case 1: makeStopwatch(printer.x + 10, printer.y + printer.height - 5); break;
		case 2: makeShoes(printer.x + 10, printer.y + printer.height - 5); break;
		case 3: makeVest(printer.x + 10, printer.y + printer.height - 5); break;
	}
}

function makeStopwatch(x, y) {
    stopwatch = items.create(x, y, 'stopwatch');
    stopwatch.animations.add('flicker', [0, 1], 10, true);
    stopwatch.animations.play('flicker');
    stopwatch.collect = function() {
        // player.speedMultiplier = 2;
        // player.score += 20;
        showHelpText('Slowin\' down time...', 3000);
        this.kill();
    }
}
function makeShoes(x, y) {
    shoes = items.create(x, y, 'shoes');
    shoes.animations.add('flicker', [0, 1], 10, true);
    shoes.animations.play('flicker');
    shoes.collect = function() {
        player.speedMultiplier = 2;
        player.score += 20;
        showHelpText('Picked up some sweet kicks!', 3000);
        this.kill();
    }
}
function makeVest(x, y) {
    vest = items.create(x, y, 'vest');
    vest.animations.add('flicker', [0, 1], 10, true);
    vest.animations.play('flicker');
    vest.collect = function() {
        player.score += 20;
        player.armor += 3;
        showHelpText('Picked up a flacket!', 3000);
        this.kill();
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
    weaponCD.addBulletAnimation('break', [16, 17, 18, 19], 23);
    weaponCD.addBulletAnimation('throw', [8]);
    weaponCD.bulletAnimation = 'throw';
    weaponCD.setBulletBodyOffset(9, 9, 6, 6)
    weaponCD.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    weaponCD.fireRate = 500;
    weaponCD.damage = 1;
    weaponCD.bulletSpeed = 300;
    weaponCD.trackedSprite = player;
    weaponCD.destroy = function(bullet) {
        // bullet.bulletAnimation = 'break';
        // bullet.animations.currentAnim.onComplete.add(function() {
        //        bullet.kill();
        //    }, this);
        bullet.kill();
        bullet = game.add.sprite(bullet.x, bullet.y, 'cd');
        bullet.animations.add('break', [16, 17, 18, 19], 20);
        bullet.animations.play('break');
        bullet.animations.currentAnim.onComplete.add(function() {
            bullet.kill();
        }, this);

    }

    weaponStapler = game.add.weapon(10, 'staple');
    weaponStapler.icon = 'stapler';
    weaponStapler.fireRate = 200;
    weaponStapler.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    weaponStapler.damage = 1;
    weaponStapler.bulletSpeed = 300;
    weaponStapler.trackedSprite = player;

    weaponNerfGun = game.add.weapon(10, 'nerfammo');
    weaponNerfGun.icon = 'nerfgun';
    weaponNerfGun.fireRate = 200;
    weaponNerfGun.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
    weaponNerfGun.bulletAngleOffset = 90;
    weaponNerfGun.damage = 1;
    weaponNerfGun.bulletSpeed = 300;
    weaponNerfGun.trackedSprite = player;
}