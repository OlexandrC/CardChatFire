import * as PIXI from 'pixi.js';
import { SceneManager } from './SceneManager';
import { FPSCounter } from './utils/FPSCounter';
import { generatePerlinTexture } from './utils/PerlinNoiseTexture';
import './style.css';

// Fixed scene size
const fixedWidth = 1200;
const aspectRatio = 16 / 9;

const pixiApp = new PIXI.Application({
    width: fixedWidth,
    height: fixedWidth / aspectRatio,
});
document.body.appendChild(pixiApp.view as HTMLCanvasElement);

const backgroundTexture = generatePerlinTexture(fixedWidth, fixedWidth / aspectRatio);
const backgroundSprite = new PIXI.Sprite(backgroundTexture);
pixiApp.stage.addChild(backgroundSprite);

function resizeGame(pixiApp: PIXI.Application) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let scale = windowWidth / fixedWidth;
    if (scale * (fixedWidth / aspectRatio) > windowHeight) {
        scale = windowHeight / (fixedWidth / aspectRatio);
    }

    const canvas = pixiApp.view as HTMLCanvasElement;

    canvas.style.width = `${fixedWidth * scale}px`;
    canvas.style.height = `${(fixedWidth / aspectRatio) * scale}px`;

    // Центруємо сцену у вікні браузера
    canvas.style.position = 'absolute';
    canvas.style.left = `${(windowWidth - fixedWidth * scale) / 2}px`;
    canvas.style.top = `${(windowHeight - (fixedWidth / aspectRatio) * scale) / 2}px`;
    
}

resizeGame(pixiApp);
window.addEventListener('resize', () => requestAnimationFrame(() => resizeGame(pixiApp)));

const fpsCounter = new FPSCounter();
fpsCounter.startTracking(pixiApp.ticker);

const sceneManager = new SceneManager(pixiApp);
sceneManager.changeScene('cards');
