import {getOptions, Options} from './shared/options/options';
import {CANVAS_CLASS_NAME, DEFS_ID, NAMESPACE} from './shared/constants';

export class Converter {
    constructor(private source: string | SVGSVGElement, private options?: Options) {
    }

    toDataURI(): Promise<string> {
        const options = getOptions(this.options);
        const svg: SVGSVGElement = typeof this.source === 'string' ? document.querySelector(this.source) : this.source;
        if (!svg) {
            return Promise.reject('SVG not found');
        }
        if (svg.nodeName !== 'svg') {
            return Promise.reject('Only SVG can be converted to PNG');
        }

        if (options.embedCSS) {
            this.embedCSS(svg);
        }
        const str = this.serializeToString(svg);
        const dataUrl = `data:image/svg+xml;base64,${btoa(str)}`;

        const {width, height} = this.getSVGSize(svg);
        const {scaleX, scaleY} = options;
        const canvas = this.createCanvas();
        canvas.width = width * scaleX;
        canvas.height = height * scaleY;
        return this.addImageProcess(dataUrl)
            .then((img: HTMLImageElement) => {
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const pngUrl = canvas.toDataURL('image/png');
                this.removeCanvas();
                this.removeDefs(svg);
                return pngUrl;
            })
            .catch(() => {
                this.removeCanvas();
                this.removeDefs(svg);
                throw 'The source SVG could not be converted to PNG';
            });
    }

    save() {
        this.toDataURI()
            .then(url => this.downloadPNG(url, name))
            .catch(error => console.warn(error));
    }

    private downloadPNG(url: string, name = 'image') {
        const download = document.createElement('a');
        download.href = url;
        download.download = name;
        download.click();
    }

    private embedCSS(svg: SVGSVGElement) {
        const allStyles = this.getUsedStyles(svg);
        const style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.innerHTML = allStyles;

        const defs = document.createElementNS(NAMESPACE, 'defs');
        defs.id = DEFS_ID;
        defs.appendChild(style);
        svg.insertBefore(defs, svg.firstChild);
    }

    private getUsedStyles(svg: SVGSVGElement): string {
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

    private serializeToString(svg: SVGSVGElement): string {
        const serializer = new XMLSerializer();
        return serializer.serializeToString(svg);
    }

    private createCanvas(): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        canvas.className = CANVAS_CLASS_NAME;
        canvas.style.visibility = 'hidden';
        document.body.appendChild(canvas);
        return canvas;
    }

    private getSVGSize(svg: SVGSVGElement): { width: number, height: number } {
        const width = +svg.getAttributeNS(null, 'width') || 0;
        const height = +svg.getAttributeNS(null, 'height') || 0;
        return {width, height};
    }

    private addImageProcess(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    private removeCanvas() {
        const canvas = document.body.querySelector(`.${CANVAS_CLASS_NAME}`);
        if (canvas) {
            document.body.removeChild(canvas);
        }
    }

    private removeDefs(svg: SVGSVGElement) {
        const defs = svg.querySelector(`#${DEFS_ID}`);
        if (defs) {
            svg.removeChild(defs);
        }
    }
}