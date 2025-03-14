import * as PIXI from 'pixi.js';
import { TextUtils } from '../utils/TextUtils';
import {Howl, Howler} from 'howler';

export class FireScene extends PIXI.Container {
    private particles: Map<PIXI.Sprite, number> = new Map();
    private particlesAmount = 10;
    private particlesLifeTime = 40;
    private flareImage = './images/fire/yellow_flare.png';
    private campFireImage = './images/fire/camp_fire_01.png';
    private fireTexture: PIXI.Texture | undefined;
    private intervalId?: number;
    private firePosition = { x: 600, y: 400 };
    private audioFire: Howl | undefined;

    constructor() {
        super();
        this.createScene();
        this.createFire();
        this.loadAudio();
        this.playAudio();
        this.startAnimation();
    }

    /**
     * Creates the scene with a title text.
     */
    private createScene() {
        const text = TextUtils.createStyledText('Phoenix Flame', 10, 610);
        this.addChild(text);
    }

    /**
     * Initializes the fire texture and sets the position to the center.
     */
    private createFire() {
        this.fireTexture = PIXI.Texture.from(this.flareImage);

        this.createCampfire();
    }

    private createCampfire() {
        const campFireTexture = PIXI.Texture.from(this.campFireImage);
        const sprite = new PIXI.Sprite(campFireTexture);
        
        sprite.scale.set(0.5);

        sprite.x = this.firePosition.x;
        sprite.y = this.firePosition.y;

        sprite.anchor.set(0.5);

        this.addChild(sprite);
    }

    private loadAudio() {
        Howler.volume(0.5);

        this.audioFire = new Howl({
            src: './audio/fire/fire_sound.ogg',
            loop: true
        })

    }

    private playAudio() {
        if (this.audioFire !== undefined) {
            this.audioFire.play();
        }
    }

    /**
     * Starts the fire animation by adding new particles periodically.
     */
    private startAnimation() {
        if (this.intervalId) clearInterval(this.intervalId);

        PIXI.Ticker.shared.add(this.updateParticles, this);
        this.intervalId = setInterval(() => {
            this.addFireParticle();
        }, 50);
    }

    /**
     * Adds a new fire particle with random properties.
     */
    private addFireParticle() {
        if (this.particles.size >= this.particlesAmount) return;

        const particle = new PIXI.Sprite(this.fireTexture);
        particle.anchor.set(0.5);
        particle.scale.set(0.3 + Math.random() * 0.2);
        particle.alpha = 1.0;

        particle.x = this.firePosition.x + (Math.random() - 0.5) * 30;
        particle.y = this.firePosition.y - 20;
        
        const lifetime = this.particlesLifeTime * (0.7 + Math.random() * 0.5);

        this.addChild(particle);
        this.particles.set(particle, lifetime);
    }

    /**
     * Updates all particles in each frame.
     * @param delta Time elapsed since last frame
     */
    private updateParticles(delta: number) {
        const particlesToRemove: PIXI.Sprite[] = [];
        
        for (const [particle, lifetime] of this.particles) {
            const remainingLife = lifetime - delta;
    
            if (remainingLife <= 0) {
                particlesToRemove.push(particle);
                continue;
            }

            // flare goes up
            particle.y -= 2 * delta;
            particle.x += (Math.random() - 0.5) * 2;

            const lifeFactor = remainingLife / this.particlesLifeTime;
            particle.alpha = Math.max(0, lifeFactor);

            particle.scale.set(0.3 + 0.7 * lifeFactor);
    
            this.particles.set(particle, remainingLife);
        }
    
        particlesToRemove.forEach((particle) => {
            this.removeChild(particle);
            this.particles.delete(particle);
        });
    }

    /**
     * Cleans up when the scene is destroyed.
     * Removes all particles and stops the animation.
     */
    public destroy(options?: PIXI.IDestroyOptions | boolean) {
        clearInterval(this.intervalId);
        PIXI.Ticker.shared.remove(this.updateParticles, this);
        this.particles.forEach((_, particle) => this.removeChild(particle));
        this.particles.clear();

        if (this.audioFire !== undefined) {
            this.audioFire.stop();
        }

        super.destroy(options);
    }
}
