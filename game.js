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

        // Start in the middle/front view.
        if (this.office) {
            this.office.play("Base", true);
            this.currentofficestate = "Front";

            // Animation completion handler (fires for loop="false" animations).
            this.office.onAnimationComplete = (animName) => {
                console.log("completed:", animName);

                // After finishing the turn-left transition, show the looping Left view.
                if (animName === "TurnLeft") {
                    this.office.play("Left", true);
                    this.currentofficestate = "Left";
                }

                // After finishing the turn-back transition, return to Base/front.
                if (animName === "TurnBackLeft") {
                    this.office.play("Base", true);
                    this.currentofficestate = "Front";
                }
            };
        }

        // Hover LeftHitbox while in Front -> play TurnLeft.
        if (this.turnlefthitbox) {
            this.turnlefthitbox.onEnter = () => {
                if (!this.office) return;
                if (this.currentofficestate !== "Front") return;

                this.office.play("TurnLeft", true);
                this.currentofficestate = "TurningLeft";
            };

            this.turnlefthitbox.onExit = () => {

            };
        }

        // Hover RightHitbox while in Left -> play TurnBackLeft.
        // Note: "Left" is a looping animation, so isPlaying will be true; allow it.
        if (this.turnrighthitbox) {
            this.turnrighthitbox.onEnter = () => {
                if (!this.office) return;
                if (this.currentofficestate !== "Left") return;

                // Don't interrupt a transition animation.
                const isInLeftLoop = this.office.currentAnimationName === "Left";
                if (!isInLeftLoop && this.office.isPlaying) return;

                this.office.play("TurnBackLeft", true);
                this.currentofficestate = "TurningBackLeft";
            };

            this.turnrighthitbox.onExit = () => {

            };
        }


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
        }

        // Fallbacks: if completion callback doesn't fire, switch anyway.
        if (
            this.office &&
            this.currentofficestate === "TurningLeft" &&
            this.office.currentAnimationName === "TurnLeft" &&
            !this.office.isPlaying
        ) {
            this.office.play("Left", true);
            this.currentofficestate = "Left";
        }

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
};
