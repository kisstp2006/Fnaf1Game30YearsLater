export const MenuLogic = {
    menubg: null,
    wichrobot:0, //0 = Freddy, 1 = Bonnie, 2 = Chica, 3 = Foxy

    newgametext: null,

    continuetext: null,

    hatthnighttext: null,

    exittext: null,


    newgamehitbox: null,

    continuethitbox: null,

    hatthnighthitbox: null,

    exithitbox: null,

    onEnter(scene, context) {
        console.log("Menu Logic Loaded");
        this.menubg = (scene.getObjectByName("MenuBG"));

        this.newgametext =  (scene.getObjectByName("NewGame"));
        this.continuetext =  (scene.getObjectByName("Continue"));
        this.hatthnighttext =  (scene.getObjectByName("6thnight"));
        this.exittext =  (scene.getObjectByName("Exit"));

        this.newgamehitbox =  (scene.getObjectByName("NewGameHitbox"));


        this.wichrobot = Math.floor(Math.random() * 4); //Randomly select a robot

        if (this.newgamehitbox && this.newgametext) {
            this.newgamehitbox.onEnter = () => {
                this.newgametext.setColor(200, 200, 255); // Tint
                console.log("New Game Hovered");
                this.newgametext.text=">New Game";
                
            };
            this.newgamehitbox.onExit = () => {
                this.newgametext.setColor(255, 255, 255); // Reset
                console.log("New Game Unhovered");
                this.newgametext.text="New Game";

            };
            this.newgamehitbox.onClick = () => {
                context.switchScene("game");
                console.log("New Game Clicked");
            };
        }
        if (this.continuethitbox && this.continuetext) {
            this.continuethitbox.onEnter = () => {
                this.continuetext.setColor(200, 200, 255); // Tint
                console.log("Continue Hovered");
                this.continuetext.text=">Continue";
                
            };
            this.continuethitbox.onExit = () => {
                this.continuetext.setColor(255, 255, 255); // Reset
                console.log("Continue Unhovered");
                this.continuetext.text="Continue";

            };
            this.continuethitbox.onClick = () => {
                context.switchScene("game");
                console.log("Continue Clicked");
            };
        }

        this.newgametext.text=">New Game";
        this.continuetext.text="Continue";
        this.hatthnighttext.text="6th Night";
        this.exittext.text="Exit";
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
