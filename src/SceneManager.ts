import * as PIXI from 'pixi.js';
import { CardsScene } from './scenes/CardsScene';
import { ChatScene } from './scenes/ChatScene';
import { FireScene } from './scenes/FireScene';
import { UIUtils } from './utils/UIUtils';
import { FullscreenUtils } from './utils/FullscreenUtils';
import {Howler} from 'howler';

export class SceneManager {
    private app: PIXI.Application;
    private currentScene: PIXI.Container | null = null;

    private topStart = 80;
    private interval = 60;

    private soundMuted = false;

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
        this.createFullscreenButton();

        this.createSceneButtons();

        this.createAudioButton();
    }

    private createFullscreenButton() {
        FullscreenUtils.createFullscreenButton(10, 10, 50);
        FullscreenUtils.enableFullscreen();
    }

    private createSceneButtons() {
        const buttonNames: Array<'cards' | 'chat' | 'fire'> = ['cards', 'chat', 'fire'];
    
        buttonNames.forEach((name, index) => {

            const button = UIUtils.createButtonDOM({
                width: 50,
                height: 50,
                right: 10,
                top: this.topStart + index * this.interval,
                image: this.buttonImages[name]
            });

            button.addEventListener('click', () => {
                this.changeScene(name);
            });

            document.body.appendChild(button);
        });
    }
    
    private createAudioButton() {
        const button = UIUtils.createButtonDOM({
            width: 50,
            height: 50,
            right: 70,
            top: 10,
            image: './images/ui/button_sound.svg'
        });

        const image = button.querySelector('img');
        
        button.addEventListener('click', () => {
            if(this.soundMuted) {
                this.soundMuted = false;
                Howler.mute(this.soundMuted);
                
                if (image) {
                    image.src = './images/ui/button_sound.svg'
                }
            } else {
                this.soundMuted = true;
                Howler.mute(this.soundMuted);
                console.log("Sound is now OFF");
                
                if (image) {
                    image.src = './images/ui/button_sound_off.svg';
                }
            }
        });
        

        document.body.appendChild(button);
    }
}
