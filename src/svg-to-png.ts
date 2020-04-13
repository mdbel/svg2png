import {Options} from './shared/models';
import {CANVAS_CLASS_NAME} from './shared/constants';

export class Svg2Png {
    static toDataURL(source: string | SVGSVGElement, options: Options = {}): Promise<string> {
        const svg: SVGSVGElement = typeof source === 'string' ? document.querySelector(source) : source;
        if (!svg) {
            return Promise.resolve('');
        }
        if (options.embedCSS) {
            Svg2Png.embedCSS(svg);
        }
        const str = Svg2Png.serialize(svg);
        const dataUrl = `data:image/svg+xml;base64,${btoa(str)}`;
        const canvas = Svg2Png.createCanvas(options);
        const ctx = canvas.getContext('2d');
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

    private static serialize(svg: SVGSVGElement): string {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(svg);
    }

    private static createCanvas(options: Options): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
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

    private static embedCSS(svg: SVGSVGElement) {
        const allStyles = Svg2Png.getUsedStyles(svg);
        const style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.innerHTML = allStyles;

        const defs = document.createElementNS(null, 'defs');
        defs.appendChild(style);
        svg.insertBefore(defs, svg.firstChild);
    }

    private static getUsedStyles(svg: SVGSVGElement) {
        let allStyles = '';
        const styleSheets = Array.from(document.styleSheets);

        styleSheets.forEach((sheet: any) => {
            let rules;
            try {
                rules = sheet['cssRules'];
            } catch {
                return;
            }
            Array.from(rules).forEach((rule: any) => {
                const style: CSSRule = rule['style'];
                if (style) {
                    const selector = rule['selectorText'];
                    const elements = svg.querySelectorAll(selector);
                    if (elements && elements.length > 0) {
                        allStyles += `${selector} { ${style.cssText} }\n`;
                    }
                }
            });
        });

        return allStyles;
    }
}