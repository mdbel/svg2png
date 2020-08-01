import {CANVAS_CLASS_NAME, DEFS_ID, NAMESPACE} from './shared/constants';
import {getOptions, Options} from './shared/options/options';

export class Svg2Png {
    static toDataURL(source: string | SVGSVGElement, options?: Options): Promise<string> {
        const opts = getOptions(options);
        const svg: SVGSVGElement = typeof source === 'string' ? document.querySelector(source) : source;
        if (!svg) {
            return Promise.reject(new Error('SVG not found'));
        }
        if (svg.nodeName !== 'svg') {
            return Promise.reject(new Error('Only SVG can be converted to PNG'));
        }

        if (opts.embedCSS) {
            Svg2Png.embedCSS(svg);
        }
        const str = Svg2Png.serialize(svg);
        const dataUrl = `data:image/svg+xml;base64,${btoa(str)}`;
        const canvas = Svg2Png.createCanvas();

        const {width, height} = Svg2Png.getSVGSize(svg);
        const {scaleX, scaleY} = opts;
        canvas.width = width * scaleX;
        canvas.height = height * scaleY;
        const ctx = canvas.getContext('2d');
        return Svg2Png.addImageProcess(dataUrl)
            .then((img: HTMLImageElement) => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const pngUrl = canvas.toDataURL('image/png');
                Svg2Png.removeCanvas();
                Svg2Png.removeDefs(svg);
                return pngUrl;
            })
            .catch(() => {
                Svg2Png.removeCanvas();
                Svg2Png.removeDefs(svg);
                return Promise.reject(new Error('The source SVG could not be converted to PNG'));
            });
    }

    static save(source: string | SVGSVGElement, name?: string, options?: Options) {
        Svg2Png.toDataURL(source, options)
            .then(url => {
                Svg2Png.downloadPNG(url, name);
            })
            .catch(error => console.error(error));
    }

    private static downloadPNG(url: string, name = 'image') {
        const download = document.createElement('a');
        download.href = url;
        download.download = name;
        download.click();
    }

    private static serialize(svg: SVGSVGElement): string {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(svg);
    }

    private static createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.className = CANVAS_CLASS_NAME;
        canvas.style.visibility = 'hidden';
        document.body.appendChild(canvas);
        return canvas;
    }

    private static removeCanvas() {
        const canvas = document.body.querySelector(`.${CANVAS_CLASS_NAME}`);
        if (canvas) {
            document.body.removeChild(canvas);
        }
    }

    private static removeDefs(svg: SVGSVGElement) {
        const defs = svg.querySelector(`#${DEFS_ID}`);
        if (defs) {
            svg.removeChild(defs);
        }
    }

    private static getSVGSize(svg: SVGSVGElement): { width: number, height: number } {
        const width = +svg.getAttributeNS(null, 'width') || 0;
        const height = +svg.getAttributeNS(null, 'height') || 0;
        return {width, height};
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

        const defs = document.createElementNS(NAMESPACE, 'defs');
        defs.id = DEFS_ID;
        defs.appendChild(style);
        svg.insertBefore(defs, svg.firstChild);
    }

    private static getUsedStyles(svg: SVGSVGElement): string {
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