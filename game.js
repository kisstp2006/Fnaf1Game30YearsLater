export const GameLogic = {
    office:null,
    freddynosehitbox: null,
    noseaudio:null,

    turnleft:null,
    turnlefthitbox:null,

    turnright:null,
    turnrighthitbox:null,


    currentofficestate: "Front",

    onEnter(scene, context) {
        this.freddynosehitbox = scene.getObjectByName("NoseHitbox");
        this.noseaudio = scene.getObjectByName("NoseAudio");

        this.office = scene.getObjectByName("Office");

        this.turnleft = scene.getObjectByName("Left");
        this.turnlefthitbox = scene.getObjectByName("LeftHitbox");
        this.turnright = scene.getObjectByName("Right");
        this.turnrighthitbox = scene.getObjectByName("RightHitbox");

        // Start in the middle (front) view.
        if (this.office) {
            this.office.play("Base", true);
            this.currentofficestate = "Front";
        }

        if (this.turnlefthitbox && this.turnleft) {
            this.turnlefthitbox.onEnter = () => {
                if (!this.office) return;
                if (this.currentofficestate !== "Front") return;

            this.office.onAnimationComplete = (animName) => {
                console.log("completed:", animName);

                if (animName === "TurnLeft") {
                    this.currentofficestate = "Left";
                }

                if (animName === "TurnBackLeft") {
                    this.office.play("Base", true);
                    this.currentofficestate = "Front";
                }
            };

                // From middle/front, hovering the left zone turns left.
                this.office.play("TurnLeft", true);
                this.currentofficestate = "Left";
            };
            this.turnlefthitbox.onExit = () => {

            };
        }

        if (this.turnrighthitbox && this.turnright) {
            this.turnrighthitbox.onEnter = () => {
                if (!this.office) return;
                if (this.currentofficestate !== "Left") return;
                // Only allow turning back when the left-turn animation has fully stopped.
                if (this.office.isPlaying) return;

                this.office.play("TurnBackLeft", true);
                this.currentofficestate = "Returning";
            };
            this.turnrighthitbox.onExit = () => {

            };
        }

        this.office.onAnimationComplete = (animName) => {
        console.log("completed:", animName);

        if (animName === "TurnBackLeftLeft") {
            this.office.play("Base", true);
            this.currentofficestate = "Front";
        }
        };


        //After everything is loaded make sure to play the basic office animation

    },

    update(scene, deltaTime, input, context) {
        // In Game: Press Escape to go back to menu
        if (input.getKeyDown("Escape")) {
            context.switchScene("menu");
        }

        if (this.noseaudio && this.freddynosehitbox) {
            this.freddynosehitbox.onClick = () => {
                if(this.noseaudio){
                    this.noseaudio.play();
                }
               
            };

        // Fallback: if TurnBackLeft ends but the completion callback doesn't fire, force Base.
        if (
            this.office &&
            this.currentofficestate === "TurningBackLeft" &&
            this.office.currentAnimationName === "TurnBackLeft" &&
            !this.office.isPlaying
        ) {
            this.office.play("Base", true);
            this.currentofficestate = "Front";
        }
        }




    }
};
