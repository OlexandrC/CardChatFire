import * as PIXI from 'pixi.js';
import { TextUtils } from '../utils/TextUtils';
import { UIUtils } from '../utils/UIUtils';
import {Howl, Howler} from 'howler';

export class CardsScene extends PIXI.Container {
    private cards: PIXI.Sprite[] = [];
    private stacks: PIXI.Container[] = [];
    private cardsAmount = 144;
    private stacksAmount = 4;
    private stacksTopPosition = 400;
    private minStackSpacing = 100;
    private fpsCorrection = 16.67;
    private cardOffset = 1;
    private cardScale = 0.15;
    private cardImage = '/images/cards/card_back.svg';
    private animationInterval = 1000;
    private animationDuration = 2000;
    private intervalId?: number;
    private activeStackIndex = 0;

    private audioShuffle: Howl | undefined;
    private audioCardMove: Howl | undefined;

    constructor() {
        super();
        this.createScene();
        this.createStacks();
        this.createCards();
        this.createUI();
        this.loadAudio();
        this.playShuffle();
        this.waitForClick();
        this.startCardAnimation();
    }

    /**
     * Create title text.
     */
    private createScene() {
        const text = TextUtils.createStyledText('Ace of Shadows', 10, 610);
        this.addChild(text);
    }

    /**
     * Create stacks (columns) for cards and center them horizontally.
     */
    private createStacks() {
        this.stacks = [];

        const totalWidth = 1200; // Фіксована ширина сцени
        const availableWidth = totalWidth - (this.stacksAmount + 1) * this.minStackSpacing;
        const stackWidth = availableWidth / this.stacksAmount;
        const startX = (totalWidth - ((this.stacksAmount - 1) * this.minStackSpacing + this.stacksAmount * stackWidth)) / 2;

        for (let i = 0; i < this.stacksAmount; i++) {
            const stack = new PIXI.Container();
            stack.x = startX + i * (stackWidth + this.minStackSpacing);
            stack.y = this.stacksTopPosition;
            this.stacks.push(stack);
            this.addChild(stack);
        }
    }

    /**
     * Create cards and place them in the first stack.
     */
    private createCards() {
        for (let i = 0; i < this.cardsAmount; i++) {
            const card = PIXI.Sprite.from(this.cardImage);
            card.anchor.set(0.5);
            card.scale.set(this.cardScale, this.cardScale);
            card.x = 0;
            card.y = -i * this.cardOffset;
            card.zIndex = i;

            this.cards.push(card);
            this.stacks[0].addChild(card);
        }
    }

    private createUI() {
        // Create button to speed up animation
        const buttonIncreaseStackAmount = UIUtils.createButtonSprite({
            width: 50,
            height: 50,
            x: 300, 
            y: 500,
            image: './images/ui/button_left.svg'
        });
        buttonIncreaseStackAmount.on('pointerdown', () => this.setSpeed(this.animationInterval + 200));
        this.addChild(buttonIncreaseStackAmount);

        // Create button to slow down animation
        const buttonDecreaseStackAmount = UIUtils.createButtonSprite({
            width: 50,
            height: 50,
            x: 360, 
            y: 500,
            image: './images/ui/button_right.svg'
        });
        buttonDecreaseStackAmount.on('pointerdown', () => this.setSpeed(this.animationInterval - 200));
        this.addChild(buttonDecreaseStackAmount);

        const buttonsDescription = TextUtils.createText('Animation speed', 100, 485, 20, 0.0);
        this.addChild(buttonsDescription);
    }

    private loadAudio() {
        Howler.volume(0.5);

        this.audioShuffle = new Howl({
            src: ['./audio/chat/shuffle_cards.ogg'],
        });

        this.audioCardMove = new Howl({
            src: ['./audio/cards/card_sound.ogg']
        })
    }

    private waitForClick() {
        window.addEventListener('focus', function() {
            Howler.stop();
        });
    }

    private playShuffle() {
        if (this.audioShuffle !== undefined) {
            this.audioShuffle.play();
        }
    }

    private setSpeed(newAmount: number) {
        if (newAmount < 200) return;
        if (newAmount > 2000) return;

        this.animationInterval = newAmount;
        this.animationDuration = newAmount * 2;

        clearInterval(this.intervalId);
        this.startCardAnimation();
    }

    /**
     * Starts the card movement animation loop.
     */
    private startCardAnimation() {
        this.intervalId = window.setInterval(() => {
            this.moveTopCard();
        }, this.animationInterval);
    }
    
    /**
     * Moves the top card to another stack.
    */
   private moveTopCard() {
       if (this.cards.length === 0) return;
       if (this.stacksAmount < 2) return;
       
       if (this.audioCardMove !== undefined) {
           this.audioCardMove.play();
       }

        const topCard = this.cards.pop()!;
        const currentStack = topCard.parent as PIXI.Container;

        if (!currentStack) return;

        this.activeStackIndex++;

        if (this.activeStackIndex >= this.stacksAmount) {
            this.activeStackIndex = 1;
        }

        this.animateCardMove(topCard, this.stacks[this.activeStackIndex]);
    }

    /**
     * Animates card movement from one stack to another.
     */
    private animateCardMove(card: PIXI.Sprite, newStack: PIXI.Container) {
        const currentStack = card.parent as PIXI.Container;
        if (!currentStack) return;

        const startGlobal = currentStack.toGlobal(card.position);
        const targetGlobal = newStack.toGlobal(new PIXI.Point(0, -newStack.children.length * 2));

        currentStack.removeChild(card);
        this.addChild(card);
        card.position.set(startGlobal.x, startGlobal.y);

        let elapsed = 0;

        const animate = (delta: number) => {
            if (!card.transform) return; // Prevent null reference error

            elapsed += delta * this.fpsCorrection;
            const progress = Math.min(elapsed / this.animationDuration, 1);

            card.x = startGlobal.x + (targetGlobal.x - startGlobal.x) * progress;
            card.y = startGlobal.y + (targetGlobal.y - startGlobal.y) * progress;

            if (progress === 1) {
                PIXI.Ticker.shared.remove(animate);
                newStack.addChild(card);
                card.position.set(0, -newStack.children.length * 2);
            }
        };

        PIXI.Ticker.shared.add(animate);
    }

    /**
     * Cleanup when the scene is removed.
     */
    public destroy(options?: PIXI.IDestroyOptions | boolean) {
        // Stop the interval to prevent errors
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        // Remove all animations
        PIXI.Ticker.shared.stop();

        // Destroy all cards
        this.cards.forEach(card => card.destroy());
        this.cards = [];

        // Destroy all stacks
        this.stacks.forEach(stack => stack.destroy());
        this.stacks = [];

        if (this.audioCardMove !== undefined) { 
            this.audioCardMove.stop();
        }

        if (this.audioShuffle !== undefined) {
            this.audioShuffle.stop();
        }

        // Call parent destroy method
        super.destroy(options);
    }
}
