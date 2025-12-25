export const MenuLogic = {
    menubg: null,
    static: null,

    scenecamera: null,

    cameraMoveTargetX: null,
    isCameraMoving: false,

    newspaperFadeActive: false,
    newspaperFadeAlpha: 0,
    newspaperWaitAfterFade: 2.0,
    newspaperWaitTimer: 0,
    newspaperSwitchQueued: false,

    wichrobot:0, //0 = Freddy, 1 = Bonnie, 2 = Chica, 3 = Foxy
    newgametext: null,
    continuetext: null,
    hatthnighttext: null,
    exittext: null,
    settingstext:null,


    newgamehitbox: null,
    continuethitbox: null,
    hatthnighthitbox: null,
    exithitbox: null,
    settingshitbox: null,
    newspaper: null,



    backbtn:null,
    backbtnhitbox:null,



    onEnter(scene, context) {
        console.log("Menu Logic Loaded");
        this.menubg = (scene.getObjectByName("MenuBG"));

        this.newgametext =  (scene.getObjectByName("NewGame"));
        this.continuetext =  (scene.getObjectByName("Continue"));
        this.hatthnighttext =  (scene.getObjectByName("6thnight"));
        this.exittext =  (scene.getObjectByName("Exit"));

        this.settingstext =  (scene.getObjectByName("Settings"));


        this.newgamehitbox =  (scene.getObjectByName("NewGameHitbox"));
        this.continuethitbox =  (scene.getObjectByName("ContinueHitbox"));
        this.hatthnighthitbox =  (scene.getObjectByName("6thnightHitbox"));
        this.exithitbox =  (scene.getObjectByName("ExitHitbox"));

        this.settingshitbox =  (scene.getObjectByName("SettingsHitbox"));


        this.static = (scene.getObjectByName("Static"));

        this.newspaper = (scene.getObjectByName("NewsPaper"));

        this.scenecamera = scene.getObjectByName("MainCamera");


        this.backbtn = scene.getObjectByName("Backbtn");
        this.backbtnhitbox = scene.getObjectByName("BackbtnHitbox");



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
                //context.switchScene("game");
                this.fadetoNewsPaper();
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
                context.switchScene("loading");
                console.log("Continue Clicked");
            };
        }
        if (this.hatthnighthitbox && this.hatthnighttext) {
            this.hatthnighthitbox.onEnter = () => {
                this.hatthnighttext.setColor(200, 200, 255);
                console.log("6th Night Hovered");
                this.hatthnighttext.text=">6th Night";
            };
            this.hatthnighthitbox.onExit = () => {
                this.hatthnighttext.setColor(255, 255, 255);
                console.log("6th Night Unhovered");
                this.hatthnighttext.text="6th Night";
            };
            this.hatthnighthitbox.onClick = () => {
                context.switchScene("loading");
                console.log("6th Night Clicked");
            };
        }

        if (this.exithitbox && this.exittext) {
            this.exithitbox.onEnter = () => {
                this.exittext.setColor(200, 200, 255);
                console.log("Exit Hovered");
                this.exittext.text=">Exit";
            };
            this.exithitbox.onExit = () => {
                this.exittext.setColor(255, 255, 255);
                console.log("Exit Unhovered");
                this.exittext.text="Exit";
            };
            this.exithitbox.onClick = () => {
                console.log("Exit Clicked");
                if (context.window && context.window.close) {
                    context.window.close();
                } else if (window.electronAPI && window.electronAPI.close) {
                    window.electronAPI.close();
                }
            };
        }
        if( this.settingshitbox && this.settingstext) {
            this.settingshitbox.onEnter = () => {
                this.settingstext.setColor(200, 200, 255);
                console.log("Settings Hovered");
                this.settingstext.text="Settings<";
            };
            this.settingshitbox.onExit = () => {
                this.settingstext.setColor(255, 255, 255);
                console.log("Settings Unhovered");
                this.settingstext.text="Settings";
            };
            this.settingshitbox.onClick = () => {
                //context.switchScene("settings");
                console.log("Settings Clicked");
                if (this.scenecamera) {
                    this.cameraMoveTargetX = this.scenecamera.x + 1920;
                    this.isCameraMoving = true;
                }
            };
        }
        if (this.backbtnhitbox && this.backbtn) {
            this.backbtnhitbox.onEnter = () => {
                this.backbtn.setColor(200, 200, 255);
                console.log("Back Hovered");
                this.backbtn.text=">Back";
            };
            this.backbtnhitbox.onExit = () => {
                this.backbtn.setColor(255, 255, 255);
                console.log("Back Unhovered");
                this.backbtn.text="Back";
            };
            this.backbtnhitbox.onClick = () => {
                console.log("Back Clicked");
                if (this.scenecamera) {
                    this.cameraMoveTargetX = this.scenecamera.x - 1920;
                    this.isCameraMoving = true;
                }
            }
        }


        this.newgametext.text="New Game";
        this.continuetext.text="Continue";
        this.hatthnighttext.text="6th Night";
        this.exittext.text="Exit";
        this.settingstext.text="Settings";
    },

    update(scene, deltaTime, input, context) {
        if (this.isCameraMoving && this.scenecamera) {
            const speed = 2000; // pixels per second
            const moveStep = speed * deltaTime;
            
            if (this.scenecamera.x < this.cameraMoveTargetX) {
                this.scenecamera.x += moveStep;
                if (this.scenecamera.x >= this.cameraMoveTargetX) {
                    this.scenecamera.x = this.cameraMoveTargetX;
                    this.isCameraMoving = false;
                }
            } else if (this.scenecamera.x > this.cameraMoveTargetX) {
                this.scenecamera.x -= moveStep;
                if (this.scenecamera.x <= this.cameraMoveTargetX) {
                    this.scenecamera.x = this.cameraMoveTargetX;
                    this.isCameraMoving = false;
                }
            }
       }

        // In Menu: Press Enter to start
        /*if (input.getKeyDown("Enter")) {
            context.switchScene("game");
        }
        */
         // Opacity in this engine is 0..255 (lower = more transparent)
         // More transparent overall + bigger interval (wider range)
         const randomNumber = Math.floor(Math.random() * 61) + 80; // 80..140

         // Static overlay: even more transparent + bigger interval
         const randomNumber2 = Math.floor(Math.random() * 71) + 10; // 10..80


        console.log("[DEBUG ]Random Number:", randomNumber);
        
        if (this.menubg) {
            this.menubg.setTransparency(randomNumber);
        }

        if (this.static) {
            this.static.setTransparency(randomNumber2);
        }

        if (this.newspaperFadeActive && this.newspaper) {
            // Fade in over ~1 second
            const fadeSpeed = 255; // alpha per second
            this.newspaperFadeAlpha = Math.min(255, this.newspaperFadeAlpha + fadeSpeed * deltaTime);
            this.newspaper.setTransparency(this.newspaperFadeAlpha);

            if (this.newspaperFadeAlpha >= 255) {
                this.newspaperFadeActive = false;
                this.newspaperSwitchQueued = true;
                this.newspaperWaitTimer = 0;
            }
        }

        if (this.newspaperSwitchQueued) {
            this.newspaperWaitTimer += deltaTime;
            if (this.newspaperWaitTimer >= this.newspaperWaitAfterFade) {
                this.newspaperSwitchQueued = false;
                context.switchScene("loading");
            }
        }

    },

    fadetoNewsPaper(){
        if (!this.newspaper) return;

        this.newspaperFadeActive = true;
        this.newspaperFadeAlpha = 0;
        this.newspaper.setTransparency(0);

        this.newspaperSwitchQueued = false;
        this.newspaperWaitTimer = 0;
    }
};
