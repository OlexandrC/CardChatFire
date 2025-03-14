import * as PIXI from 'pixi.js';

export class TextUtils {

    /**
     * Creates styled text with effects.
     * @param textContent The text to display
     * @param x X position
     * @param y Y position
     * @param pulseSpeed Adjusts the speed of pulsation (default: 0.002)
     * @returns PIXI.Text with styles and animation
     */
    static createStyledText(textContent: string, x: number, y: number, pulseSpeed: number = 0.0002): PIXI.Text {
        const textStyle = new PIXI.TextStyle({
            fontSize: 50,
            fontWeight: 'bold',
            fill: ['#F2C53D', '#F23838'],
            stroke: '#ffffff',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#0D0D0D',
            dropShadowBlur: 5,
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 5
        });

        const text = new PIXI.Text(textContent, textStyle);
        text.anchor.set(0.0);
        text.position.set(x, y);

        let scaleDirection = 1;

        const animate = () => {
            if (!text.transform) return;
            if (text.scale.x > 1.05) scaleDirection = -1;
            if (text.scale.x < 0.95) scaleDirection = 1;
            text.scale.x += pulseSpeed * scaleDirection;
            text.scale.y += pulseSpeed * scaleDirection;
        };

        PIXI.Ticker.shared.add(animate);

        text.destroy = ((originalDestroy) => {
            return function (this: PIXI.Text, options?: PIXI.IDestroyOptions | boolean) {
                PIXI.Ticker.shared.remove(animate);
                originalDestroy.call(this, options);
            };
        })(text.destroy);        

        return text;
    }

    static createText(textContent: string, x: number, y: number, size: number, anchor: number) {

        const textStyle = new PIXI.TextStyle({
            fontSize: size,
            fontWeight: 'bold',
            fill: ['#0D0D0D', '#0D0D0D'],
            stroke: '#ffffff',
            strokeThickness: 4,
            dropShadow: true,
            dropShadowColor: '#0D0D0D',
            dropShadowBlur: 5,
            dropShadowAngle: Math.PI / 4,
            dropShadowDistance: 3
        });

        const text = new PIXI.Text(textContent, textStyle);
        text.anchor.set(anchor);
        text.position.set(x, y);

        text.destroy = ((originalDestroy) => {
            return function (this: PIXI.Text, options?: PIXI.IDestroyOptions | boolean) {
                originalDestroy.call(this, options);
            };
        })(text.destroy);

        return text;
    }
}

