import * as PIXI from 'pixi.js';
import { ApiService } from './ApiService';

export class ChatUtils {

    private static defaultAvatar: PIXI.Texture = PIXI.Texture.from('./images/chat/default-avatar.svg');

    /**
     * Creates text block
     * @param textContent Text block content
     * @param isLeft Position (true = left, false = right)
     * @returns PIXI.Container with text and background
     */
    public static async createMessageBlock(text: string, isLeft: boolean, avatarURI: string, emojiMap: Record<string, string>): Promise<PIXI.Container> {
        const container = new PIXI.Container();
        const elements: PIXI.DisplayObject[] = [];

        // Text styling
        const textStyle = new PIXI.TextStyle({
            fontSize: 18,
            fill: '#ffffff',
            wordWrap: true,
            wordWrapWidth: 300
        });
    
        const messageData = await ChatUtils.parseMessageContent(text, textStyle, emojiMap);
        elements.push(...messageData.elements);
        
        const background = this.createBackground(isLeft, messageData.totalHeight);
    
        container.addChild(background, ...elements);
    
        // Load avatar (fallback to default if unavailable)
        const avatarTexture = await ApiService.loadImage(avatarURI) || ChatUtils.defaultAvatar;
        const avatar = this.createAvatar(avatarTexture, isLeft);
    
        // Create final message container
        const messageContainer = new PIXI.Container();
        container.x = isLeft ? 300 : 520;
        container.y = 10;
    
        messageContainer.addChild(avatar, container);
    
        return messageContainer;
    }

    /**
     * Parses the message text and replaces images and emoji placeholders.
     * @param text The message text
     * @param textStyle The PIXI.TextStyle to be applied
     * @param emojiMap A mapping of emoji placeholders to image URLs
     * @returns An object containing formatted PIXI elements and total height
     */
    private static async parseMessageContent(
        text: string, 
        textStyle: PIXI.TextStyle, 
        emojiMap: Record<string, string>
    ): Promise<{ elements: PIXI.DisplayObject[], totalHeight: number }> {
        const elements: PIXI.DisplayObject[] = [];

        let xOffset = 10; // Horizontal spacing
        let yOffset = 5;  // Vertical spacing
        let lineHeight = 30; // Line height based on text size
        let currentLineWidth = 0; // Track current line width
        let totalHeight = lineHeight; // Track total height dynamically
    
        // Regex to find emoji placeholders or image tags
        const parts = text.split(/(<img src="([^"]+)"[^>]*>|\{(\w+)\})/g);
    
        for (const part of parts) {
            if (!part) continue;
    
            // Check if it's an <img> tag
            const imgMatch = part.match(/<img src="([^"]+)"/);
            if (imgMatch) {
                const texture = await ApiService.loadImage(imgMatch[1]) || ChatUtils.defaultAvatar;
                const imageSprite = new PIXI.Sprite(texture);
                imageSprite.width = 24;
                imageSprite.height = 24;
                imageSprite.x = xOffset;
                imageSprite.y = yOffset;
    
                elements.push(imageSprite);
                xOffset += 28; // Space for image
                currentLineWidth += 40; // Treat as 2-character-wide elements
    
                if (currentLineWidth > 300) {
                    xOffset = 10;
                    yOffset += lineHeight;
                    totalHeight += lineHeight;
                    imageSprite.x = xOffset;
                    imageSprite.y = yOffset;
                    currentLineWidth = 40;
                }
            } 
            // Check if it's an emoji placeholder
            else if (part.startsWith('{') && part.endsWith('}')) {
                const emojiKey = part.slice(1, -1);
                const emojiURL = emojiMap[emojiKey] || ''; // Get emoji image URL if available
    
                const texture = emojiURL ? await ApiService.loadImage(emojiURL) : ChatUtils.defaultAvatar;
                const emojiSprite = new PIXI.Sprite(texture);
                emojiSprite.width = 24;
                emojiSprite.height = 24;
                emojiSprite.x = xOffset;
                emojiSprite.y = yOffset;
    
                elements.push(emojiSprite);
                xOffset += 28; // Space for emoji
                currentLineWidth += 40;
    
                if (currentLineWidth > 300) {
                    xOffset = 10;
                    yOffset += lineHeight;
                    totalHeight += lineHeight;
                    emojiSprite.x = xOffset;
                    emojiSprite.y = yOffset;
                    currentLineWidth = 40;
                }
            } 
            // If it's just text
            else if (part.trim().length > 0) {
                const textElement = new PIXI.Text(part, textStyle);
                textElement.x = xOffset;
                textElement.y = yOffset;
    
                elements.push(textElement);
                xOffset += textElement.width + 5;
                currentLineWidth += textElement.width;
    
                if (currentLineWidth > 300) {
                    xOffset = 10;
                    yOffset += lineHeight;
                    totalHeight += lineHeight;
                    textElement.x = xOffset;
                    textElement.y = yOffset;
                    currentLineWidth = textElement.width;
                }
            }
        }

        // Adjust total height based on content
        totalHeight = Math.max(lineHeight, Math.round((currentLineWidth / 150)) * lineHeight);

        return { elements, totalHeight };
    }

    private static createBackground(isLeft: boolean, totalHeight: number) {
        const background = new PIXI.Graphics();
        background.beginFill(isLeft ? 0x4a90e2 : 0x50c878, 1);
        background.lineStyle(2, isLeft ? 0x316bac : 0x3b9c64, 1);
        background.drawRoundedRect(0, 0, 320, totalHeight + 10, 10);
        background.endFill();

        return background;
    }

    private static createAvatar(avatarTexture: PIXI.Texture, isLeft: boolean) {
        const avatar = new PIXI.Sprite(avatarTexture);
        avatar.width = 40;
        avatar.height = 40;
        avatar.anchor.set(0.5);
        avatar.x = isLeft ? 250 : 900;
        avatar.y = 30;

        return avatar;
    }
    
}
