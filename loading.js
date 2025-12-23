export const LoadingLogic = {
    timer: 0,
    duration: 2.0,

    onEnter(scene, context) {
        this.timer = 0;
    },

    update(scene, deltaTime, input, context) {
        this.timer += deltaTime;
        if (this.timer >= this.duration) {
            context.switchScene("game");
        }
    }
};
