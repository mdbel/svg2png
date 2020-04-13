import {Svg2Png} from '../../src/svg-to-png';
import {Options} from '../../src/shared/models';

const svg = document.querySelector('svg');
const options: Options = {width: 125, height: 120, offsetX: 5, embedCSS: true};
Svg2Png.toDataURL(svg, options).then((url) => {
    const img = document.querySelector('img.test-img')!;
    img.setAttribute('src', url);
});

