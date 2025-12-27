export const GameLogic = {
    freddynosehitbox: null,
    noseaudio:null,

    onEnter(scene, context) {
        this.freddynosehitbox = scene.getObjectByName("NoseHitbox");
        this.noseaudio = scene.getObjectByName("NoseAudio");
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




    }
};
