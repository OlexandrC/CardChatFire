import * as PIXI from 'pixi.js';
import { SceneManager } from './SceneManager';
import { FullscreenUtils } from './utils/FullscreenUtils';
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

function resizeGame() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Обчислюємо масштаб, зберігаючи пропорції
    let scale = windowWidth / fixedWidth;
    if (scale * (fixedWidth / aspectRatio) > windowHeight) {
        scale = windowHeight / (fixedWidth / aspectRatio);
    }

    // Задаємо розміри canvas через CSS
    pixiApp.view.style.width = `${fixedWidth * scale}px`;
    pixiApp.view.style.height = `${(fixedWidth / aspectRatio) * scale}px`;

    // Центруємо сцену у вікні браузера
    pixiApp.view.style.position = 'absolute';
    pixiApp.view.style.left = `${(windowWidth - fixedWidth * scale) / 2}px`;
    pixiApp.view.style.top = `${(windowHeight - (fixedWidth / aspectRatio) * scale) / 2}px`;
}

resizeGame();
window.addEventListener('resize', resizeGame);

const fpsCounter = new FPSCounter();
fpsCounter.startTracking(pixiApp.ticker);

const sceneManager = new SceneManager(pixiApp);
sceneManager.changeScene('cards');

FullscreenUtils.enableFullscreen();
FullscreenUtils.createFullscreenButton(10, 10, 50);
