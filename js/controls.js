function createControls() {
	    // INPUT SETTINGS
    wasd = {
        up: game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        space: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
        pointer: game.input.activePointer,
        pistolKey: game.input.keyboard.addKey(49),
        machinegunKey: game.input.keyboard.addKey(50),
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

    reticle = game.add.sprite(game.input.activePointer.worldX, game.input.activePointer.worldY, 'reticle');
}

function updateControls() {    // Replace cursor with reticle
    reticle.x = game.input.activePointer.worldX - reticle.width / 2;
    reticle.y = game.input.activePointer.worldY - reticle.height / 2;

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

}