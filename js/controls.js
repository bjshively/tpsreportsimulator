function createControls() {
    // INPUT SETTINGS
    wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
        pointer: game.input.activePointer,
        weaponCutterKey: game.input.keyboard.addKey(49),
        weaponCDKey: game.input.keyboard.addKey(50),
        weaponStaplerKey: game.input.keyboard.addKey(51),
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

    reticle = game.add.sprite(
        game.input.activePointer.worldX,
        game.input.activePointer.worldY,
        'reticle'
        );
    reticle.anchor.setTo(0.5, 0.5);
}

function updateControls() {    
	// Replace cursor with reticle
    reticle.x = game.input.activePointer.worldX;
    reticle.y = game.input.activePointer.worldY;

        // Weapon select
    if (wasd.weaponCutterKey.isDown) {
        player.weapon = weaponCutter;
        // selectWeapon('cd');

    }
    if (wasd.weaponCDKey.isDown) {
        player.weapon = weaponCD;
        // selectWeapon('cd');

    }
    if (wasd.weaponStaplerKey.isDown) {
        player.weapon = weaponStapler;
        // selectWeapon('stapler');
    }

}