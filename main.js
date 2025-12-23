import Engine from "../../Fluxion/Core/Engine.js";
import SceneLoader from "../../Fluxion/Core/SceneLoader.js";
import Input from "../../Fluxion/Core/Input.js";
import { MenuLogic } from "./menu.js";
import { LoadingLogic } from "./loading.js";
import { GameLogic } from "./game.js";

const input = new Input();

const app = {
    currentScene: null,
    menuScene: null,
    loadingScene: null,
    gameScene: null,
    renderer: null,
    currentLogic: null,

    async init(renderer) {
        this.renderer = renderer;
        
        console.log("Loading scenes...");
        // Load both scenes
        this.menuScene = await SceneLoader.load("./menu.xml", renderer);
        this.loadingScene = await SceneLoader.load("./loadingscene.xml", renderer);
        this.gameScene = await SceneLoader.load("./game.xml", renderer);
        
        // Start with Menu
        this.switchScene("menu");
        
    },

    onLoaded() {
        console.log("Game Started");
        
    },

    switchScene(sceneName) {
        let scene;
        let logic;

        if (sceneName === "menu") {
            scene = this.menuScene;
            logic = MenuLogic;
        } else if (sceneName === "loading") {
            scene = this.loadingScene;
            logic = LoadingLogic;
        } else if (sceneName === "game") {
            scene = this.gameScene;
            logic = GameLogic;
        } else {
            console.error("Unknown scene:", sceneName);
            return;
        }

        this.currentScene = scene;
        this.currentLogic = logic;
        
        // Sync engine camera with scene camera if it exists
        if (this.currentScene.camera) {
            const sc = this.currentScene.camera;
            // We update the engine's camera which is injected into this object
            if (this.camera) {
                this.camera.x = sc.x;
                this.camera.y = sc.y;
                this.camera.zoom = sc.zoom;
                this.camera.rotation = sc.rotation;
            }
        }

        // Call onEnter for the logic
        if (this.currentLogic && this.currentLogic.onEnter) {
            this.currentLogic.onEnter(this.currentScene, this);
        }
        
        console.log("Switched to scene:", scene.name);
    },

    update(deltaTime) {
        if (!this.currentScene) return;

        // Delegate update to the current scene logic
        if (this.currentLogic && this.currentLogic.update) {
            this.currentLogic.update(this.currentScene, deltaTime, input, this);
        }

        // Update current scene objects
        this.currentScene.update(deltaTime);

        // Update input state for next frame (required for getKeyDown/Up)
        input.update();
    },

    draw(renderer) {
        if (this.currentScene) {
            this.currentScene.draw(renderer);
        }
    }
};

// Start the engine
new Engine("gameCanvas", app);
