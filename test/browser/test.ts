import {Svg2Png} from '../../src/svg-to-png';
import {Options} from '../../src/shared/options/models';

const svg = document.querySelector('svg');
const options: Options = {width: 120, height: 120, embedCSS: true};
Svg2Png.toDataURL(svg, options).then((url) => {
    const img = document.querySelector('img.test-img')!;
    img.setAttribute('src', url);
});

