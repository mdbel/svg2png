import {defaultOptions, getOptions} from '../src/shared/options/options';
import {Options} from '../src/shared/options/options';

describe('when using options helper', () => {

    it('should return default options if options not provided', () => {
        expect(getOptions()).toEqual(defaultOptions);
    });

    it('should merge provided options with default options', () => {
        const options: Options = {scaleX: 1.5};
        const mergedOptions = getOptions(options);
        expect(mergedOptions.scaleX).toBe(options.scaleX);
        expect(mergedOptions.scaleY).toBe(defaultOptions.scaleY);
        expect(mergedOptions.embedCSS).toBe(defaultOptions.embedCSS);
    });
});