import {Svg2Png} from '../../src/index';
import {Options} from '../../src/shared/options/options';

const svgRect: SVGSVGElement = document.querySelector('svg#rect');
const svgMonitor: SVGSVGElement = document.querySelector('svg#monitor');

const img = document.querySelector('img.test-img');
const options: Options = {
    embedCSS: true,
    scaleX: 1.5
};

Svg2Png.toDataURL(svgRect, options)
    .then((url) => {
        img.setAttribute('src', url);
    })
    .catch(err => console.log('test err: ', err));


Svg2Png.save(svgMonitor, 'name', options);
Svg2Png.save('test', 'test', options);
