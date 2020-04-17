import {Options} from './models';

export const defaultOptions: Options = {
    scaleX: 1,
    scaleY: 1,
    embedCSS: false
};

export const getOptions = (options: Options = {}): Options => {
    return Object.assign(defaultOptions, options);
};