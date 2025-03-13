import * as PIXI from 'pixi.js';
import { CardsScene } from './scenes/CardsScene';
import { ChatScene } from './scenes/ChatScene';
import { FireScene } from './scenes/FireScene';
import { UIUtils } from './utils/UIUtils';

export class SceneManager {
    private app: PIXI.Application;
    private currentScene: PIXI.Container | null = null;

    private topStart = 80;
    private interval = 60;
    private rightPosition = 10;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.createUI();
    }

    private buttonImages = {
        cards: '/images/ui/button_game_cards.svg',
        chat: '/images/ui/button_game_chat.svg',
        fire: '/images/ui/button_game_fire.svg'
    };

    changeScene(sceneName: string) {
        if (this.currentScene) {
            this.app.stage.removeChild(this.currentScene);
            this.currentScene.destroy({ children: true });
        }

        if (sceneName === 'cards') {
            this.currentScene = new CardsScene();
        } else if (sceneName === 'chat') {
            this.currentScene = new ChatScene();
        } else if (sceneName === 'fire') {
            this.currentScene = new FireScene();
        }

        if (this.currentScene) {
            this.app.stage.addChild(this.currentScene);
        }
    }

    private createUI() {
        const buttonNames: Array<'cards' | 'chat' | 'fire'> = ['cards', 'chat', 'fire'];
    
        buttonNames.forEach((name, index) => {

            const button = UIUtils.createButtonDOM({
                width: 50,
                height: 50,
                right: 10,
                top: this.topStart + index * this.interval,
                image: this.buttonImages[name]
            })

            button.addEventListener('click', () => {
                this.changeScene(name);
            });
        });
    }
    
}
