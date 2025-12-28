export const GameLogic = {
    leftdooropen:true,
    
    rightdooropen:true,


    office:null,
    freddynosehitbox: null,
    noseaudio:null,

    turnleft:null,
    turnlefthitbox:null,

    turnright:null,
    turnrighthitbox:null,

    camerapickupicon:null,
    camerapickuphitbox:null,


    leftdoorhitbox:null,

    rightdoorhitbox:null,


    currentofficestate: "Front",

    onEnter(scene, context) {
        this.freddynosehitbox = scene.getObjectByName("NoseHitbox");
        this.noseaudio = scene.getObjectByName("NoseAudio");

        this.office = scene.getObjectByName("Office");

        this.turnleft = scene.getObjectByName("Left");
        this.turnlefthitbox = scene.getObjectByName("LeftHitbox");
        this.turnright = scene.getObjectByName("Right");
        this.turnrighthitbox = scene.getObjectByName("RightHitbox");
        this.camerapickupicon = scene.getObjectByName("CameraPickup");
        this.camerapickuphitbox = scene.getObjectByName("CameraPickupHitbox");

        this.leftdoorhitbox = scene.getObjectByName("LeftDoorHitbox");

        // Left door is only usable while looking left.
        if (this.leftdoorhitbox) {
            this.leftdoorhitbox.active = false;
            this.leftdoorhitbox.onClick = () => {
                if (!this.office) return;
                if (this.currentofficestate !== "Left") return;

                // Prevent spamming while a transition is currently playing.
                const isInLeftView =
                    this.office.currentAnimationName === "Left" ||
                    this.office.currentAnimationName === "LeftDoorClosed";
                if (this.office.isPlaying && !isInLeftView) return;

                if (this.leftdooropen) {
                    this.office.play("LeftCloseDoor", true);
                    this.leftdooropen = false;
                } else {
                    this.office.play("LeftOpenDoor", true);
                    this.leftdooropen = true;
                }
            };
        }


        if (this.noseaudio && this.freddynosehitbox) {
            this.freddynosehitbox.onClick = () => {
                if (!this.noseaudio) return;

                // "Looking forward" means we're in the Front state (Base animation).
                // Using both state + currentAnimationName makes it resilient if you tweak states later.
                const isLookingForward =
                    this.currentofficestate === "Front" &&
                    this.office &&
                    this.office.currentAnimationName === "Base";

                if (isLookingForward) {
                    this.noseaudio.play();
                }
               
            };
        }

        // Start in the middle/front view.
        if (this.office) {
            this.office.play("Base", true);
            this.currentofficestate = "Front";

            // Animation completion handler (fires for loop="false" animations).
            this.office.onAnimationComplete = (animName) => {
                console.log("completed:", animName);

                // After finishing the turn-left transition, show the looping Left view.
                if (animName === "TurnLeft" || animName === "TurnLeftWithDoorClosed") {
                    this.office.play(this.leftdooropen ? "Left" : "LeftDoorClosed", true);
                    this.currentofficestate = "Left";
                    if (this.leftdoorhitbox) this.leftdoorhitbox.active = true;
                }

                // After finishing the turn-back transition, return to Base/front.
                if (animName === "TurnBackLeft" || animName === "TurnBackFromLeftWithDoorClosed") {
                    this.office.play("Base", true);
                    if (this.camerapickuphitbox) this.camerapickuphitbox.active = true;
                    if (this.camerapickupicon) this.camerapickupicon.active = true;
                    this.currentofficestate = "Front";
                    if (this.leftdoorhitbox) this.leftdoorhitbox.active = false;
                }

                // After finishing the turn-right transition, stay in the Right view.
                // (If you later add a dedicated looping "Right" animation, you can switch to it here.)
                if (animName === "TurnRight") {
                    this.currentofficestate = "Right";
                    if (this.leftdoorhitbox) this.leftdoorhitbox.active = false;
                }

                // After finishing the turn-back-from-right transition, return to Base/front.
                if (animName === "TurnBackRight") {
                    this.office.play("Base", true);
                    if (this.camerapickuphitbox) this.camerapickuphitbox.active = true;
                    if (this.camerapickupicon) this.camerapickupicon.active = true;
                    this.currentofficestate = "Front";
                    if (this.leftdoorhitbox) this.leftdoorhitbox.active = false;
                }
            };
        }

        // Hover LeftHitbox while in Front -> play TurnLeft.
        if (this.turnlefthitbox) {
            this.turnlefthitbox.onEnter = () => {
                if (!this.office) return;
                if (this.currentofficestate !== "Front" && this.currentofficestate !== "Right") return;

                // From Right view, hovering left edge returns back to Front.
                if (this.currentofficestate === "Right") {
                    // Don't interrupt a transition animation.
                    if (this.office.isPlaying && this.office.currentAnimationName !== "TurnRight") return;
                    this.office.play("TurnBackRight", true);
                    this.currentofficestate = "TurningBackRight";
                    return;
                }

                const turnAnim = this.leftdooropen ? "TurnLeft" : "TurnLeftWithDoorClosed";
                this.office.play(turnAnim, true);
                this.currentofficestate = "TurningLeft";
                if (this.camerapickuphitbox) this.camerapickuphitbox.active = false;
                if (this.camerapickupicon) this.camerapickupicon.active = false;
            };

            this.turnlefthitbox.onExit = () => {

            };
        }

        // Hover RightHitbox while in Left -> play TurnBackLeft.
        // Note: "Left" is a looping animation, so isPlaying will be true; allow it.
        if (this.turnrighthitbox) {
            this.turnrighthitbox.onEnter = () => {
                if (!this.office) return;
                if (this.currentofficestate !== "Left" && this.currentofficestate !== "Front") return;

                // From Front view, hovering right edge turns to the Right.
                if (this.currentofficestate === "Front") {
                    // Don't interrupt another transition.
                    if (this.office.isPlaying && this.office.currentAnimationName !== "Base") return;
                    this.office.play("TurnRight", true);
                    this.currentofficestate = "TurningRight";
                    if (this.camerapickuphitbox) this.camerapickuphitbox.active = false;
                    if (this.camerapickupicon) this.camerapickupicon.active = false;
                    if (this.leftdoorhitbox) this.leftdoorhitbox.active = false;
                    return;
                }

                // Don't interrupt a transition animation.
                const isInLeftView =
                    this.office.currentAnimationName === "Left" ||
                    this.office.currentAnimationName === "LeftDoorClosed";
                if (!isInLeftView && this.office.isPlaying) return;

                const turnBackAnim = this.leftdooropen ? "TurnBackLeft" : "TurnBackFromLeftWithDoorClosed";
                this.office.play(turnBackAnim, true);
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


        // Fallbacks: if completion callback doesn't fire, switch anyway.
        if (
            this.office &&
            this.currentofficestate === "TurningLeft" &&
            (this.office.currentAnimationName === "TurnLeft" || this.office.currentAnimationName === "TurnLeftWithDoorClosed") &&
            !this.office.isPlaying
        ) {
            this.office.play(this.leftdooropen ? "Left" : "LeftDoorClosed", true);
            this.currentofficestate = "Left";
            if (this.leftdoorhitbox) this.leftdoorhitbox.active = true;
        }

        if (
            this.office &&
            this.currentofficestate === "TurningBackLeft" &&
            (this.office.currentAnimationName === "TurnBackLeft" || this.office.currentAnimationName === "TurnBackFromLeftWithDoorClosed") &&
            !this.office.isPlaying
        ) {
            this.office.play("Base", true);
            if (this.camerapickuphitbox) this.camerapickuphitbox.active = true;
            if (this.camerapickupicon) this.camerapickupicon.active = true;
            this.currentofficestate = "Front";
            if (this.leftdoorhitbox) this.leftdoorhitbox.active = false;
        }

        if (
            this.office &&
            this.currentofficestate === "TurningRight" &&
            this.office.currentAnimationName === "TurnRight" &&
            !this.office.isPlaying
        ) {
            this.currentofficestate = "Right";
            if (this.leftdoorhitbox) this.leftdoorhitbox.active = false;
        }

        if (
            this.office &&
            this.currentofficestate === "TurningBackRight" &&
            this.office.currentAnimationName === "TurnBackRight" &&
            !this.office.isPlaying
        ) {
            this.office.play("Base", true);
            if (this.camerapickuphitbox) this.camerapickuphitbox.active = true;
            if (this.camerapickupicon) this.camerapickupicon.active = true;
            this.currentofficestate = "Front";
            if (this.leftdoorhitbox) this.leftdoorhitbox.active = false;
        }




    }
};
