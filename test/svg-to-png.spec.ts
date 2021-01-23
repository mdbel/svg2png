import {Svg2Png} from '../src';

describe('when converting SVG to PNG', () => {
    it('should catch an error when SVG selector is not correct', async () => {
        try {
            await Svg2Png.toDataURL('blabla');
        } catch (e) {
            expect(e).toBe('SVG not found');
        }
    });

    it('should catch an error when providing a non-SVG element', async () => {
        const element = document.createElement('div');
        try {
            await Svg2Png.toDataURL(element as unknown as SVGSVGElement);
        } catch (e) {
            expect(e).toBe('Only SVG can be converted to PNG');
        }
    });
});