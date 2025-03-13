export class FullscreenUtils {
    constructor() {
    }

    static enableFullscreen() {
        const fullscreenBtn = document.getElementById('fullscreen-btn');

        fullscreenBtn?.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Fullscreen error: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });

        window.addEventListener('resize', () => {
            document.body.style.overflow = 'hidden';
        });
    }

    static createFullscreenButton(topPosition: number, rightPosition: number, size: number) {
        const button = document.createElement('button');
        button.id = 'fullscreen-btn';
        button.classList.add('scene-button');

        const img = document.createElement('img');
        img.src = '/images/ui/button_fullscreen.svg';
        img.alt = 'Fullscreen';
        img.style.width = '100%';
        img.style.height = '100%';

        button.appendChild(img);

        button.style.width = `${size}px`;
        button.style.height = `${size}px`;

        button.style.position = 'absolute';
        button.style.top = `${topPosition}px`;
        button.style.right = `${rightPosition}px`;

        button.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error(`Fullscreen error: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });

        document.body.appendChild(button);
    }
}
