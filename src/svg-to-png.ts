import {Converter} from './converter';
import {Options} from './shared/options/options';

export class Svg2Png {
    static toDataURL(source: string | SVGSVGElement, options?: Options): Promise<string> {
        const converter = new Converter(source, options);
        return converter.toDataURI();
    }

    static save(source: string | SVGSVGElement, name?: string, options?: Options) {
        const converter = new Converter(source, options);
        converter.save(name);
    }
}