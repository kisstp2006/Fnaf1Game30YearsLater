export const MenuLogic = {
    onEnter(scene, context) {
        const btnHitbox = scene.getObjectByName("StartButtonHitbox");
        const btnSprite = scene.getObjectByName("StartButton");
        
        if (btnHitbox && btnSprite) {
            btnHitbox.onEnter = () => {
                btnSprite.setColor(200, 200, 255); // Tint
            };
            btnHitbox.onExit = () => {
                btnSprite.setColor(255, 255, 255); // Reset
            };
            btnHitbox.onClick = () => {
                context.switchScene("game");
            };
        }
    },

    update(scene, deltaTime, input, context) {
        // In Menu: Press Enter to start
        /*if (input.getKeyDown("Enter")) {
            context.switchScene("game");
        }
        */
       
    }
};
