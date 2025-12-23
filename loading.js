export const LoadingLogic = {
    timer: 0,
    duration: 14.0,
    timeText:null,
    nightText:null,
    clockicon: null,
    fade:null,

    fadeStarted: false,
    switched: false,

    clockFadeTime: 1.0,
    fadeSpriteFadeTime: 1.0,
    clockTargetAlpha: 255,
    fadeTargetAlpha: 255,
    clockAlpha: 0,
    fadeAlpha: 0,

    onEnter(scene, context) {
        this.timer = 0;
        this.fadeStarted = false;
        this.switched = false;
        // Support both old/new naming in the XML
        this.timeText = scene.getObjectByName("Time") || scene.getObjectByName("Text");
        this.nightText = scene.getObjectByName("Night") || scene.getObjectByName("Text_copy");
        this.clockicon = scene.getObjectByName("Clock");
        this.fade = scene.getObjectByName("Fade");

        // Clock fade-in
        if (this.clockicon && typeof this.clockicon.getTransparency === "function") {
            this.clockTargetAlpha = this.clockicon.getTransparency();
        } else {
            this.clockTargetAlpha = 255;
        }
        this.clockAlpha = 0;
        if (this.clockicon && typeof this.clockicon.setTransparency === "function") {
            this.clockicon.setTransparency(0);
        }

        // Fade sprite fade-in (to whatever opacity you set in XML)
        if (this.fade && typeof this.fade.getTransparency === "function") {
            this.fadeTargetAlpha = this.fade.getTransparency();
        } else {
            this.fadeTargetAlpha = 255;
        }
        this.fadeAlpha = 0;
        if (this.fade && typeof this.fade.setTransparency === "function") {
            this.fade.setTransparency(0);
        }
    },

    update(scene, deltaTime, input, context) {
        this.timer += deltaTime;

        // Phase 1: just wait
        if (!this.fadeStarted) {
            if (this.timer < this.duration) return;
            this.fadeStarted = true;
        }

        // Fade in the clock sprite
        if (this.clockicon && typeof this.clockicon.setTransparency === "function") {
            if (this.clockFadeTime <= 0) {
                this.clockAlpha = this.clockTargetAlpha;
            } else {
                const clockSpeed = this.clockTargetAlpha / this.clockFadeTime; // alpha per second
                this.clockAlpha = Math.min(this.clockTargetAlpha, this.clockAlpha + clockSpeed * deltaTime);
            }
            this.clockicon.setTransparency(this.clockAlpha);
        }

        // Fade in the overlay fade sprite
        if (this.fade && typeof this.fade.setTransparency === "function") {
            if (this.fadeSpriteFadeTime <= 0) {
                this.fadeAlpha = this.fadeTargetAlpha;
            } else {
                const fadeSpeed = this.fadeTargetAlpha / this.fadeSpriteFadeTime;
                this.fadeAlpha = Math.min(this.fadeTargetAlpha, this.fadeAlpha + fadeSpeed * deltaTime);
            }
            this.fade.setTransparency(this.fadeAlpha);
        }

        // Phase 2: after fade completes, switch scene once
        const clockDone = !this.clockicon || this.clockAlpha >= this.clockTargetAlpha;
        const fadeDone = !this.fade || this.fadeAlpha >= this.fadeTargetAlpha;
        if (!this.switched && clockDone && fadeDone) {
            this.switched = true;
            context.switchScene("game");
        }
    }
};
