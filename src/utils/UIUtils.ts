/**
 * There are two ways of button elements.
 * First is using HTML element. It has better quality. But it is unbinded with the canvas. On diferent screens there will be harder to set relative position between HTML button and canvas.
 * Second way is using PIXI sprite. It can have lower quality, but it alway at the same position. Also we can apply PIXI styles/efects/animations to this type elemnt.
 */

import * as PIXI from 'pixi.js';

export class UIUtils {

    public static createButtonDOM(parameters: {width?: number, height?: number, left?: number, top?: number, right?: number, bottom?: number, name?: string, image?: string}) {
        const button = document.createElement('button');
        button.classList.add('scene-button');
    
        if (parameters.image && parameters.image.trim() !== '') {
            const img = document.createElement('img');
            img.src = parameters.image;
            img.style.width = '100%';
            img.style.height = '100%';
            button.appendChild(img);
        }
    
        if (parameters.top !== undefined) { button.style.top = `${parameters.top}px`; }
        if (parameters.bottom !== undefined) { button.style.bottom = `${parameters.bottom}px`; }
        if (parameters.left !== undefined) { button.style.left = `${parameters.left}px`; }
        if (parameters.right !== undefined) { button.style.right = `${parameters.right}px`; }        
    
        if (parameters.width !== undefined) { button.style.width = `${parameters.width}px` };
        if (parameters.height !== undefined) { button.style.height = `${parameters.height}px`};

        if (parameters.name) { button.setAttribute('name', parameters.name); }

        return button;
    }

    public static createButtonSprite(parameters: {width: number, height: number, x: number, y: number, image: string}) {
        const texture = PIXI.Texture.from(parameters.image);
        const sprite = new PIXI.Sprite(texture);
    
        if (texture.baseTexture.valid) {
            this.adjustSpriteSize(sprite, parameters.width, parameters.height);
        } else {
            texture.baseTexture.once('loaded', () => {
                this.adjustSpriteSize(sprite, parameters.width, parameters.height);
            });
        }
    
        sprite.x = parameters.x;
        sprite.y = parameters.y;
        sprite.eventMode = 'static';
        sprite.anchor.set(0.5);

        sprite.on('pointerover', () => {
            sprite.scale.set(sprite.scale.x * 1.1, sprite.scale.y * 1.1);
        });
        
        sprite.on('pointerout', () => {
            sprite.scale.set(sprite.scale.x * 0.9, sprite.scale.y * 0.9);
        });
    
        return sprite;
    }
    
    private static adjustSpriteSize(sprite: PIXI.Sprite, maxWidth: number, maxHeight: number) {
        const originalWidth = sprite.texture.width;
        const originalHeight = sprite.texture.height;
    
        const scale = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
        sprite.scale.set(scale);
    }
    


}