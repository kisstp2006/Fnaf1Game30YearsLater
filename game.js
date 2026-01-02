export const GameLogic = {
    doors: { leftOpen: true, rightOpen: true },
    refs: {
        office: null,
        noseHitbox: null,
        noseAudio: null,
        turnLeftHitbox: null,
        turnRightHitbox: null,
        cameraPickupIcon: null,
        cameraPickupHitbox: null,
        cameraRooms: null,
        leftDoorHitbox: null,
        rightDoorHitbox: null,
    },

    camera:{ panel:null, switchicon:null,camerascree:null },

    viewState: "Front",
    cameraState:"Off",

    onEnter(scene, context) {
        const refs = this.refs;
        const doors = this.doors;

        refs.noseHitbox = scene.getObjectByName("NoseHitbox");
        refs.noseAudio = scene.getObjectByName("NoseAudio");
        refs.office = scene.getObjectByName("Office");

        refs.turnLeftHitbox = scene.getObjectByName("LeftHitbox");
        refs.turnRightHitbox = scene.getObjectByName("RightHitbox");
        refs.cameraPickupIcon = scene.getObjectByName("CameraPickup");
        refs.cameraPickupHitbox = scene.getObjectByName("CameraPickupHitbox");
        refs.cameraRooms = scene.getObjectByName("CameraRooms");

        refs.leftDoorHitbox = scene.getObjectByName("LeftDoorHitbox");
        refs.rightDoorHitbox = scene.getObjectByName("RightDoorHitbox");

        this.camera.panel= scene.getObjectByName("CameraTablet");
        this.camera.switchicon= scene.getObjectByName("CameraPickup");

        // Left door is only usable while looking left.

        // Camera tablet: hover the pickup area to toggle Open/Closed.
        // NOTE: keep the pickup sprite *active*; hiding it via active=false would stop updating its ClickableArea child.
        if (this.camera.panel) {
            // Start hidden/off even if XML had it active.
            this.camera.panel.stop();
            this.camera.panel.active = false;
            this.camera.panel.visible = false;
            this.cameraState = "Off";

            const pp = context.renderer?.postProcessing;
            if (pp && pp.isReady) {
                pp.disableEffect("crt");
            }

            if (refs.cameraRooms) {
                refs.cameraRooms.active = false;
                refs.cameraRooms.visible = false;
            }

            // When animations finish, toggle the tablet/camera view state.
            this.camera.panel.onAnimationComplete = (animName) => {
                if (animName === "Open") {
                    this.cameraState = "On";

                    const pp = context.renderer?.postProcessing;
                    if (pp && pp.isReady) {
                        pp.enableEffect("crt");
                        pp.setUniform("crt", "time", performance.now() / 1000);
                    }

                    if (refs.cameraRooms) {
                        refs.cameraRooms.active = true;
                        refs.cameraRooms.visible = true;
                        refs.cameraRooms.play("EveryOneOnStage", true);
                    }
                    return;
                }

                if (animName === "Closed") {
                    this.camera.panel.active = false;
                    this.camera.panel.visible = false;
                    this.cameraState = "Off";

                    const pp = context.renderer?.postProcessing;
                    if (pp && pp.isReady) {
                        pp.disableEffect("crt");
                    }

                    if (refs.cameraRooms) {
                        refs.cameraRooms.active = false;
                        refs.cameraRooms.visible = false;
                    }

                    if (this.camera.switchicon) this.camera.switchicon.visible = true;
                }
            };
        }

        if (refs.cameraPickupHitbox) {
            refs.cameraPickupHitbox.onClick = null; // use hover toggle instead
            refs.cameraPickupHitbox.onEnter = () => {
                if (!this.camera.panel) return;
                if (this.camera.panel.isPlaying) return; // don't restart mid-animation

                if (this.cameraState === "Off") {
                    this.camera.panel.active = true;
                    this.camera.panel.visible = true;
                    this.camera.panel.play("Open", true);
                    this.cameraState = "On";

                    if (this.camera.switchicon) this.camera.switchicon.visible = false;
                } else if (this.cameraState === "On") {
                    // As soon as we start closing, hide the camera scene immediately.
                    if (refs.cameraRooms) {
                        refs.cameraRooms.active = false;
                        refs.cameraRooms.visible = false;
                    }

                    const pp = context.renderer?.postProcessing;
                    if (pp && pp.isReady) {
                        pp.disableEffect("crt");
                    }

                    this.camera.panel.active = true;
                    this.camera.panel.visible = true;
                    this.camera.panel.play("Closed", true);
                    // cameraState switches back to Off in onAnimationComplete
                }
            };

            refs.cameraPickupHitbox.onExit = () => {
                // Make the indicator visible again when leaving the hover area,
                // even if the tablet is currently On.
                if (this.camera.switchicon) this.camera.switchicon.visible = true;
            };
        }


        if (refs.leftDoorHitbox) {
            refs.leftDoorHitbox.active = false;
            refs.leftDoorHitbox.onClick = () => {
                if (!refs.office) return;
                if (this.viewState !== "Left") return;

                // Prevent spamming while a transition is currently playing.
                const isInLeftView =
                    refs.office.currentAnimationName === "Left" ||
                    refs.office.currentAnimationName === "LeftDoorClosed";
                if (refs.office.isPlaying && !isInLeftView) return;

                if (doors.leftOpen) {
                    refs.office.play("LeftCloseDoor", true);
                    doors.leftOpen = false;
                } else {
                    refs.office.play("LeftOpenDoor", true);
                    doors.leftOpen = true;
                }
            };
        }

        // Right door is only usable while looking right.
        if (refs.rightDoorHitbox) {
            refs.rightDoorHitbox.active = false;
            refs.rightDoorHitbox.onClick = () => {
                if (!refs.office) return;
                if (this.viewState !== "Right") return;

                // Prevent spamming while a transition is currently playing.
                const isInRightView =
                    refs.office.currentAnimationName === "Right" ||
                    refs.office.currentAnimationName === "RightDoorClosed";
                if (refs.office.isPlaying && !isInRightView) return;

                if (doors.rightOpen) {
                    refs.office.play("RightCloseDoor", true);
                    doors.rightOpen = false;
                } else {
                    refs.office.play("RightOpenDoor", true);
                    doors.rightOpen = true;
                }
            };
        }

        if (refs.noseAudio && refs.noseHitbox) {
            refs.noseHitbox.onClick = () => {
                if (!refs.noseAudio) return;

                // "Looking forward" means we're in the Front state (Base animation).
                // Using both state + currentAnimationName makes it resilient if you tweak states later.
                const isLookingForward =
                    this.viewState === "Front" &&
                    refs.office &&
                    refs.office.currentAnimationName === "Base";

                if (isLookingForward) {
                    refs.noseAudio.play();
                }
               
            };
        }

        // Start in the middle/front view.
        if (refs.office) {
            refs.office.play("Base", true);
            this.viewState = "Front";

            // Animation completion handler (fires for loop="false" animations).
            refs.office.onAnimationComplete = (animName) => {
                console.log("completed:", animName);

                // After finishing the turn-left transition, show the looping Left view.
                if (animName === "TurnLeft" || animName === "TurnLeftWithDoorClosed") {
                    refs.office.play(doors.leftOpen ? "Left" : "LeftDoorClosed", true);
                    this.viewState = "Left";
                    if (refs.leftDoorHitbox) refs.leftDoorHitbox.active = true;
                    if (refs.rightDoorHitbox) refs.rightDoorHitbox.active = false;
                }

                // After finishing the turn-back transition, return to Base/front.
                if (animName === "TurnBackLeft" || animName === "TurnBackFromLeftWithDoorClosed") {
                    refs.office.play("Base", true);
                    if (refs.cameraPickupHitbox) refs.cameraPickupHitbox.active = true;
                    if (refs.cameraPickupIcon) refs.cameraPickupIcon.active = true;
                    this.viewState = "Front";
                    if (refs.leftDoorHitbox) refs.leftDoorHitbox.active = false;
                    if (refs.rightDoorHitbox) refs.rightDoorHitbox.active = false;
                }

                // After finishing the turn-right transition, stay in the Right view.
                // (If you later add a dedicated looping "Right" animation, you can switch to it here.)
                if (animName === "TurnRight" || animName === "TurnRightWithDoorClosed") {
                    refs.office.play(doors.rightOpen ? "Right" : "RightDoorClosed", true);
                    this.viewState = "Right";
                    if (refs.leftDoorHitbox) refs.leftDoorHitbox.active = false;
                    if (refs.rightDoorHitbox) refs.rightDoorHitbox.active = true;
                }

                // After finishing the turn-back-from-right transition, return to Base/front.
                if (animName === "TurnBackRight" || animName === "TurnBackFromRightWithDoorClosed") {
                    refs.office.play("Base", true);
                    if (refs.cameraPickupHitbox) refs.cameraPickupHitbox.active = true;
                    if (refs.cameraPickupIcon) refs.cameraPickupIcon.active = true;
                    this.viewState = "Front";
                    if (refs.leftDoorHitbox) refs.leftDoorHitbox.active = false;
                    if (refs.rightDoorHitbox) refs.rightDoorHitbox.active = false;
                }

                // Snap right door animations to their idle poses.
                if (animName === "RightCloseDoor") {
                    refs.office.play("RightDoorClosed", true);
                }
                if (animName === "RightOpenDoor") {
                    refs.office.play("Right", true);
                }
            };
        }

        // Hover LeftHitbox while in Front -> play TurnLeft.
        if (refs.turnLeftHitbox) {
            refs.turnLeftHitbox.onEnter = () => {
                if(this.cameraState === "On") return;
                if (!refs.office) return;
                if (this.viewState !== "Front" && this.viewState !== "Right") return;

                // From Right view, hovering left edge returns back to Front.
                if (this.viewState === "Right") {
                    // Don't interrupt a transition animation.
                    const isInRightView =
                        refs.office.currentAnimationName === "Right" ||
                        refs.office.currentAnimationName === "RightDoorClosed";
                    if (!isInRightView && refs.office.isPlaying) return;
                    refs.office.play(doors.rightOpen ? "TurnBackRight" : "TurnBackFromRightWithDoorClosed", true);
                    this.viewState = "TurningBackRight";
                    return;
                }

                const turnAnim = doors.leftOpen ? "TurnLeft" : "TurnLeftWithDoorClosed";
                refs.office.play(turnAnim, true);
                this.viewState = "TurningLeft";
                if (refs.cameraPickupHitbox) refs.cameraPickupHitbox.active = false;
                if (refs.cameraPickupIcon) refs.cameraPickupIcon.active = false;
            };

            refs.turnLeftHitbox.onExit = () => {};
        }

        // Hover RightHitbox while in Left -> play TurnBackLeft.
        // Note: "Left" is a looping animation, so isPlaying will be true; allow it.
        if (refs.turnRightHitbox) {
            refs.turnRightHitbox.onEnter = () => {
                if(this.cameraState === "On") return;
                if (!refs.office) return;
                if (this.viewState !== "Left" && this.viewState !== "Front") return;

                // From Front view, hovering right edge turns to the Right.
                if (this.viewState === "Front") {
                    // Don't interrupt another transition.
                    if (refs.office.isPlaying && refs.office.currentAnimationName !== "Base") return;
                    refs.office.play(doors.rightOpen ? "TurnRight" : "TurnRightWithDoorClosed", true);
                    this.viewState = "TurningRight";
                    if (refs.cameraPickupHitbox) refs.cameraPickupHitbox.active = false;
                    if (refs.cameraPickupIcon) refs.cameraPickupIcon.active = false;
                    if (refs.leftDoorHitbox) refs.leftDoorHitbox.active = false;
                    if (refs.rightDoorHitbox) refs.rightDoorHitbox.active = false;
                    return;
                }

                // Don't interrupt a transition animation.
                const isInLeftView =
                    refs.office.currentAnimationName === "Left" ||
                    refs.office.currentAnimationName === "LeftDoorClosed";
                if (!isInLeftView && refs.office.isPlaying) return;

                const turnBackAnim = doors.leftOpen ? "TurnBackLeft" : "TurnBackFromLeftWithDoorClosed";
                refs.office.play(turnBackAnim, true);
                this.viewState = "TurningBackLeft";
            };

            refs.turnRightHitbox.onExit = () => {};
        }

    },

    update(scene, deltaTime, input, context) {
        const refs = this.refs;
        const doors = this.doors;

        const pp = context.renderer?.postProcessing;
        if (pp && pp.isReady && pp.activeEffects.includes("crt")) {
            pp.setUniform("crt", "time", performance.now() / 1000);
        }

        // In Game: Press Escape to go back to menu
        if (input.getKeyDown("Escape")) {
            context.switchScene("menu");
        }


        // Fallbacks: if completion callback doesn't fire, switch anyway.
        if (
            refs.office &&
            this.viewState === "TurningLeft" &&
            (refs.office.currentAnimationName === "TurnLeft" || refs.office.currentAnimationName === "TurnLeftWithDoorClosed") &&
            !refs.office.isPlaying
        ) {
            refs.office.play(doors.leftOpen ? "Left" : "LeftDoorClosed", true);
            this.viewState = "Left";
            if (refs.leftDoorHitbox) refs.leftDoorHitbox.active = true;
        }

        if (
            refs.office &&
            this.viewState === "TurningBackLeft" &&
            (refs.office.currentAnimationName === "TurnBackLeft" || refs.office.currentAnimationName === "TurnBackFromLeftWithDoorClosed") &&
            !refs.office.isPlaying
        ) {
            refs.office.play("Base", true);
            if (refs.cameraPickupHitbox) refs.cameraPickupHitbox.active = true;
            if (refs.cameraPickupIcon) refs.cameraPickupIcon.active = true;
            this.viewState = "Front";
            if (refs.leftDoorHitbox) refs.leftDoorHitbox.active = false;
        }

        if (
            refs.office &&
            this.viewState === "TurningRight" &&
            (refs.office.currentAnimationName === "TurnRight" || refs.office.currentAnimationName === "TurnRightWithDoorClosed") &&
            !refs.office.isPlaying
        ) {
            refs.office.play(doors.rightOpen ? "Right" : "RightDoorClosed", true);
            this.viewState = "Right";
            if (refs.leftDoorHitbox) refs.leftDoorHitbox.active = false;
            if (refs.rightDoorHitbox) refs.rightDoorHitbox.active = true;
        }

        if (
            refs.office &&
            this.viewState === "TurningBackRight" &&
            (refs.office.currentAnimationName === "TurnBackRight" || refs.office.currentAnimationName === "TurnBackFromRightWithDoorClosed") &&
            !refs.office.isPlaying
        ) {
            refs.office.play("Base", true);
            if (refs.cameraPickupHitbox) refs.cameraPickupHitbox.active = true;
            if (refs.cameraPickupIcon) refs.cameraPickupIcon.active = true;
            this.viewState = "Front";
            if (refs.leftDoorHitbox) refs.leftDoorHitbox.active = false;
            if (refs.rightDoorHitbox) refs.rightDoorHitbox.active = false;
        }

        if (
            refs.office &&
            this.viewState === "Right" &&
            (refs.office.currentAnimationName === "RightCloseDoor" || refs.office.currentAnimationName === "RightOpenDoor") &&
            !refs.office.isPlaying
        ) {
            refs.office.play(doors.rightOpen ? "Right" : "RightDoorClosed", true);
        }

    }
};
