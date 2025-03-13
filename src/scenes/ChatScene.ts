import * as PIXI from 'pixi.js';
import { TextUtils } from '../utils/TextUtils';
import { fetchChatData } from '../utils/API';
import { ChatUtils } from '../utils/ChatUtils';

export class ChatScene extends PIXI.Container {
    private messages: PIXI.Container;
    private dialogue: any[];
    private avatars: Record<string, string>;
    private emojiMap: Record<string, string>;
    private currentIndex = 0;

    constructor() {
        super();
        this.messages = new PIXI.Container();
        this.addChild(this.messages);

        this.loadChatData();
    }

    private createScene() {
        const text = TextUtils.createStyledText('Magic Words', 10, 610);
        this.addChild(text);
    }

    /**
     * Завантажує дані чату через API.
     */
    private async loadChatData() {
        const chatData = await fetchChatData();
        this.dialogue = chatData.dialogue;

        // Кешуємо аватарки
        this.avatars = {};
        for (const avatar of chatData.avatars) {
            this.avatars[avatar.name] = avatar.url;
            await ChatUtils.loadImage(avatar.url);
        }

        // Кешуємо емодзі
        this.emojiMap = {};
        for (const emoji of chatData.emojies) {
            this.emojiMap[emoji.name] = emoji.url;
            await ChatUtils.loadImage(emoji.url);
        }

        this.startDialogue();
    }

    /**
     * Починає анімацію додавання повідомлень.
     */
    private startDialogue() {
        const interval = setInterval(() => {
            if (this.currentIndex >= this.dialogue.length) {
                clearInterval(interval);
                return;
            }

            const messageData = this.dialogue[this.currentIndex];
            this.addMessage(messageData.name, messageData.text);
            this.currentIndex++;
        }, 2000);
    }

    /**
     * Додає нове повідомлення в чат.
     */
    private async addMessage(name: string, text: string) {
        const isLeft = name === 'Sheldon';
        const messageBlock = ChatUtils.createMessageBlock(ChatUtils.replaceEmojis(text, this.emojiMap), isLeft);

        const avatarTexture = await ChatUtils.loadImage(this.avatars[name]);
        const avatar = new PIXI.Sprite(avatarTexture);
        avatar.width = 50;
        avatar.height = 50;
        avatar.anchor.set(0.5);
        avatar.x = isLeft ? 30 : 470;

        const messageContainer = new PIXI.Container();
        messageBlock.x = isLeft ? 70 : 80;
        messageBlock.y = 10;

        messageContainer.addChild(avatar, messageBlock);
        this.messages.addChild(messageContainer);

        this.updateMessages();
    }

    /**
     * Посуває всі повідомлення вгору при додаванні нового.
     */
    private updateMessages() {
        let yOffset = this.messages.height + 60;
        for (let i = this.messages.children.length - 1; i >= 0; i--) {
            this.messages.children[i].y = yOffset;
            yOffset -= 60;
        }
    }
}
