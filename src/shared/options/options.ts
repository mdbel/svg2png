import {Options} from './models';

const DEFAULT_CANVAS_SIZE = 100;
const defaultOptions: Options = {
    width: DEFAULT_CANVAS_SIZE,
    height: DEFAULT_CANVAS_SIZE,
    offsetX: 0,
    offsetY: 0,
    embedCSS: false
};

export const getOptions = (options: Options = {}): Options => {
    return Object.assign(defaultOptions, options);
};