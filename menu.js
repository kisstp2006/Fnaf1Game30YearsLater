export const MenuLogic = {
    menubg: null,
    wichrobot:0, //0 = Freddy, 1 = Bonnie, 2 = Chica, 3 = Foxy

    onEnter(scene, context) {
        console.log("Menu Logic Loaded");
        this.menubg = scene.getObjectByName("MenuBG");
        this.wichrobot = Math.floor(Math.random() * 4); //Randomly select a robot
        
        const btnSprite = scene.getObjectByName("StartButton");
        const btnHitbox = scene.getObjectByName("StartButtonHitbox");
        
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
       const randomNumber = Math.floor(Math.random() * 51) + 150;

        console.log("[DEBUG ]Random Number:", randomNumber);
        
        if (this.menubg) {
            this.menubg.setTransparency(randomNumber);
        }

    }
};
