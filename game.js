export const GameLogic = {
    onEnter(scene, context) {
        // Any specific initialization for game scene when entering
    },

    update(scene, deltaTime, input, context) {
        // In Game: Press Escape to go back to menu
        if (input.getKeyDown("Escape")) {
            context.switchScene("menu");
        }
        
        // Game logic: Move player
        const player = scene.getObjectByName("Player");
        if (player) {
            const speed = 500;
            if (input.getKey("w")) player.y -= speed * deltaTime;
            if (input.getKey("s")) player.y += speed * deltaTime;
            if (input.getKey("a")) player.x -= speed * deltaTime;
            if (input.getKey("d")) player.x += speed * deltaTime;
        }
        
        // Simple enemy logic: Rotate enemy
        const enemy = scene.getObjectByName("Enemy");
        if (enemy) {
            enemy.rotation -= 2 * deltaTime;
        }
    }
};
