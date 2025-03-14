/**
 * Becouse of CORS policy and proxy, we have unstable image loading.
 * In a real production it goes with backend and frontend set up.
 */

import * as PIXI from 'pixi.js';
import { TextUtils } from '../utils/TextUtils';
import { ApiService } from '../utils/ApiService';
import { ChatUtils } from '../utils/ChatUtils';
import settings from "../Settings.json";
import {Howl} from 'howler';

export class ChatScene extends PIXI.Container {
    private messages: PIXI.Container;
    private dialogue: any[] = [];
    private avatars: Record<string, string> = {};
    private emojiMap: Record<string, string> = {};
    private currentIndex = 0;

    private loadingText?: PIXI.Text;
    private loadingTextIntervalID?: number;

    private loadingTextContent = 'LOADING';
    private loadingTextAvatars = 'LOADING AVATARS';
    private loadingTextEmojies = 'LOADING EMOJIES';

    private audioMessage: Howl | undefined;

    constructor() {
        super();

        this.createScene();

        this.messages = new PIXI.Container();
        this.messages.y = 580; // Start messages at the bottom of the screen
        this.addChild(this.messages);

        this.showLoading(this.loadingTextContent);
        this.loadAudio();
        this.loadChatData();
    }

    /**
     * Creates initial UI components.
     */
    private createScene() {
        const text = TextUtils.createStyledText('Magic Words', 10, 610);
        this.addChild(text);
    }

    /**
     * Displays a loading message.
     */
    private showLoading(text: string, offsetX?: number) {
        this.loadingText = TextUtils.createText(
            text,
            500 - (offsetX ? offsetX : 0),
            300,
            60,
            0.0
        );

        this.addChild(this.loadingText);
        
        this.loadingTextIntervalID = setInterval(() => {
            if (this.loadingText) {
                this.loadingText.text = this.loadingText.text + '.';

                if (text.length + 3 < this.loadingText.text.length) {
                    this.loadingText.text = text;
                }
            }
        }, 1000);
    }

    /**
     * Load audio content
     */
    loadAudio() {
        this.audioMessage = new Howl({
            src: ['./audio/chat/message.ogg']
        });
    }

    /**
     * Removes the loading message.
     */
    private destroyLoading() {
        clearInterval(this.loadingTextIntervalID);
        this.loadingText?.destroy();
    }

    /**
     * Fetches chat data and initializes message rendering.
     */
    private async loadChatData() {
        const chatData = await ApiService.fetchData(settings.chatURI);

        this.destroyLoading();

        this.dialogue = chatData.dialogue;

        this.showLoading(this.loadingTextAvatars, 150);

        // Cache avatars
        this.avatars = {};
        for (const avatar of chatData.avatars) {
            this.avatars[avatar.name] = avatar.url;
            // await ApiService.loadImage(avatar.url);
        }

        this.destroyLoading();

        this.showLoading(this.loadingTextEmojies, 250);

        // Cache emojis
        this.emojiMap = {};
        for (const emoji of chatData.emojies) {
            this.emojiMap[emoji.name] = emoji.url;
            // await ApiService.loadImage(emoji.url);
        }

        this.destroyLoading();

        this.startDialogue();
    }

    /**
     * Starts the chat dialogue animation.
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
     * Adds a new message to the chat.
     */
    private async addMessage(name: string, text: string) {
        const isLeft = name === 'Sheldon'; // here we should use own user
        const messageBlock = await ChatUtils.createMessageBlock(text, isLeft, this.avatars[name], this.emojiMap);

        this.moveMessagesUp(messageBlock.height);

        this.messages.addChild(messageBlock);

        if (this.audioMessage !== undefined) {
            this.audioMessage.play();        
        }
    }

    /**
     * Animates all messages moving upwards when a new message is added.
     */
    private moveMessagesUp(height: number) {
        const messageSpacing = 5;
        const animationDuration = 10; // Animation time in seconds

        let targetY = height + messageSpacing;
        const step = 10;

        for (let i = this.messages.children.length - 1; i >= 0; i--) {
            const message = this.messages.children[i];

            let messageDiff = targetY;

            const intervalID = setInterval(() => {

                if (!message) { clearInterval(intervalID); }

                if (messageDiff <= step) {
                    message.y = message.y - messageDiff;
                    clearInterval(intervalID);
                }

                message.y = message.y - step;
                
                messageDiff = messageDiff - step;

            }, animationDuration);
        }
    }

    public destroy(options?: PIXI.IDestroyOptions | boolean) {
        // Stop the interval to prevent errors
        if (this.loadingTextIntervalID) {
            clearInterval(this.loadingTextIntervalID);
        }

        // Remove all animations
        PIXI.Ticker.shared.stop();

        // this.messages.destroy();

        if (this.audioMessage !== undefined) {
            this.audioMessage.stop();
        }

        super.destroy(options);
    }
}
