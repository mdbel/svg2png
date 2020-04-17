import {Svg2Png} from '../../src/svg-to-png';
import {Options} from '../../src/shared/options/models';

const svg = document.querySelector('svg');
const img = document.querySelector('img.test-img');
const options: Options = {
    embedCSS: true,
    scaleX: 1.5
};

Svg2Png.toDataURL(svg, options).then((url) => {
    img.setAttribute('src', url);
});
