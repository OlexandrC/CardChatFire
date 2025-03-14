import * as PIXI from 'pixi.js';
import { generatePerlinNoise } from 'perlin-noise';

/**
 * Generates a Perlin noise texture with custom colors.
 * @param width Width of the texture
 * @param height Height of the texture
 * @returns PIXI.Texture
 */
export function generatePerlinTexture(width: number, height: number): PIXI.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error("Could not get 2D context for Perlin noise texture");
    }

    const noise = generatePerlinNoise(width, height).flat();

    const color1 = { r: 250, g: 250, b: 250 };
    const color2 = { r: 235, g: 235, b: 235 };

    const imageData = ctx.createImageData(width, height);
    for (let i = 0; i < noise.length; i++) {
        const value = noise[i]; // Noise from 0 to 1

        const r = Math.floor(color1.r + (color2.r - color1.r) * value);
        const g = Math.floor(color1.g + (color2.g - color1.g) * value);
        const b = Math.floor(color1.b + (color2.b - color1.b) * value);

        imageData.data[i * 4] = r;     // R
        imageData.data[i * 4 + 1] = g; // G
        imageData.data[i * 4 + 2] = b; // B
        imageData.data[i * 4 + 3] = 255; // A
    }
    ctx.putImageData(imageData, 0, 0);

    return PIXI.Texture.from(canvas);
}
