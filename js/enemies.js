function createEnemies() 
{
    enemies = game.add.group();
    enemies.enableBody = true;

    for (var i = 0; i < 4; i++)
    {
        var enemy = enemies.create(Math.random() * game.world.width, Math.random() * game.world.height, 'enemy');
        enemy.body.immovable = true;
    }
}