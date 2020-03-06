import {Svg2Png} from '../../src/svg-to-png';
import {Options} from '../../src/models/options';

const str = document.querySelector('svg')!.outerHTML;
const options: Options = {width: 125, height: 120, offsetX: 5};
Svg2Png.fromString(str, options).then((url) => {
    const img = document.querySelector('img.test-img')!;
    img.setAttribute('src', url);
});

