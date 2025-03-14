import Stats from 'stats.js';
import * as PIXI from 'pixi.js';

export class FPSCounter {
    private stats: Stats;

    constructor() {
        this.stats = new Stats();
        this.stats.showPanel(0); // 0 - FPS

        // Set absolute positioning
        this.stats.dom.style.position = 'absolute';
        this.stats.dom.style.top = '10px';
        this.stats.dom.style.left = '10px';
        this.stats.dom.style.zIndex = '100';

        document.body.appendChild(this.stats.dom);
    }

    startTracking(ticker: PIXI.Ticker) {
        ticker.add(() => {
            this.stats.begin();
            this.stats.end();
        });
    }
}
