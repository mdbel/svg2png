import {Svg2Png} from '../../src/svg-to-png';
import {Options} from '../../src/shared/options/models';

const svg = document.querySelector('svg');
const options: Options = {
    width: 200,
    height: 200,
    offsetY: 50,
    offsetX: 50,
    embedCSS: true,
    background: '#a9b7ad'
};
Svg2Png.toDataURL(svg, options).then((url) => {
    const img = document.querySelector('img.test-img')!;
    img.setAttribute('src', url);
});

