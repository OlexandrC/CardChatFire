import * as PIXI from 'pixi.js';

export class ChatUtils {
    private static imageCache: Map<string, PIXI.Texture> = new Map();

    /**
     * Loads images and cashing it.
     * @param url URL зображення
     * @returns PIXI.Texture
     */
    public static async loadImage(url: string): Promise<PIXI.Texture> {
        if (this.imageCache.has(url)) {
            return this.imageCache.get(url)!;
        }

        return new Promise((resolve) => {
            const texture = PIXI.Texture.from(url);
            texture.baseTexture.on('loaded', () => {
                this.imageCache.set(url, texture);
                resolve(texture);
            });
        });
    }

    /**
     * Change {emoji} to an image
     * @param text 
     * @param emojiMap 
     * @returns Changed text
     */
    public static replaceEmojis(text: string, emojiMap: Record<string, string>): string {
        return text.replace(/\{(\w+)\}/g, (_, emojiKey) => {
            return emojiMap[emojiKey] ? `<img src="${emojiMap[emojiKey]}" width="24" height="24">` : `{${emojiKey}}`;
        });
    }

    /**
     * Створює блок повідомлення з текстом та фоном.
     * @param textContent Текст повідомлення
     * @param isLeft Чи зліва повідомлення (true = ліворуч, false = праворуч)
     * @returns PIXI.Container з текстом та стилізованим бекграундом
     */
    public static createMessageBlock(textContent: string, isLeft: boolean): PIXI.Container {
        const container = new PIXI.Container();

        // Стилізація тексту
        const textStyle = new PIXI.TextStyle({
            fontSize: 18,
            fill: '#ffffff',
            wordWrap: true,
            wordWrapWidth: 300
        });

        const text = new PIXI.Text(textContent, textStyle);
        text.x = 10;
        text.y = 5;

        // Фон повідомлення
        const background = new PIXI.Graphics();
        background.beginFill(isLeft ? 0x4a90e2 : 0x50c878, 1); // Блакитний або зелений фон
        background.lineStyle(2, isLeft ? 0x316bac : 0x3b9c64, 1); // Темніший бордер
        background.drawRoundedRect(0, 0, text.width + 20, text.height + 10, 10);
        background.endFill();
        background.filters = [new PIXI.filters.DropShadowFilter({ blur: 4, distance: 3, alpha: 0.5 })];

        container.addChild(background, text);

        return container;
    }
}
