import {Options} from './shared/models';
import {CANVAS_CLASS_NAME} from './shared/constants';

export class Svg2Png {
    static fromString(str: string, options: Options = {}): Promise<string> {
        const dataUrl = `data:image/svg+xml;base64,${btoa(str)}`;
        const canvas = Svg2Png.createCanvas(options);
        const ctx = canvas.getContext('2d')!;
        return Svg2Png.addImageProcess(dataUrl)
            .then((img: HTMLImageElement) => {
                const {offsetX = 0, offsetY = 0} = options;
                ctx.drawImage(img, offsetX, offsetY);
                const pngUrl = canvas.toDataURL("image/png");
                Svg2Png.removeCanvas();
                return pngUrl;
            })
            .catch(() => {
                Svg2Png.removeCanvas();
                return Promise.reject(new Error('The source SVG could not be converted to PNG'));
            });
    }

    static fromUrl(url: string) {

    }

    private static createCanvas(options: Options): HTMLCanvasElement {
        const canvas = document.createElement('canvas')!;
        canvas.className = CANVAS_CLASS_NAME;
        canvas.style.visibility = 'hidden';
        document.body.appendChild(canvas);
        const {width = 100, height = 100} = options;
        canvas.width = width;
        canvas.height = height;
        return canvas;
    }

    private static removeCanvas() {
        const canvas = document.body.querySelector(`.${CANVAS_CLASS_NAME}`);
        if (canvas) {
            document.body.removeChild(canvas);
        }
    }

    private static addImageProcess(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }
}