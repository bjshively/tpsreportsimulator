function createItems() {
	// create some weapons
	weaponCD = game.add.weapon(2, 'cd');
	weaponCD.setBulletFrames(8, 8);
	weaponCD.fireRate = 500;
	weaponCD.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
	weaponCD.damage = 2;
	weaponCD.bulletSpeed = 200;

	weaponStapler = game.add.weapon(10, 'staple');
	weaponStapler.fireRate = 200;
	weaponStapler.bulletKillType = Phaser.Weapon.KILL_CAMERA_BOUNDS;
	weaponStapler.damage = 1;
	weaponStapler.bulletSpeed = 300;


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
    pickupStapler.collect = function(){
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
	pickupCD.collect = function(){
        player.weapon = weaponCD;
        player.score += 10;
        this.kill();
    }
}