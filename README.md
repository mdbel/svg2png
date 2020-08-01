# svg2png
Lightweight TypeScript SVG to PNG converter.
## Usage
If you want to generate a PNG dataURI, you can call **Svg2Png.toDataURL(source, options)**, which returns a Promise.
As a source you can use an SVG element or a selector that refers to an element in DOM. 
If you want to download your SVG as PNG, you can call **Svg2Png.save(source, name, options)**
## Installation
To install with npm:
```bash
npm i svg2png-converter
```
## Examples


```typescript
import {Svg2Png} from 'svg2png-converter';

const svg = document.querySelector('svg');
const options = {
    scaleX: 2,
    scaleY: 2
};

Svg2Png.toDataURL(svg, options).then(url => {
    document.querySelector('img').setAttribute('src', url);
});
```

```typescript
import {Svg2Png} from 'svg2png-converter';

Svg2Png.save('svg', 'icon');
```

### Options

Please note that all options are optional.

| Option               | Default value                      |
| -------------------- | ---------------------------------- | 
| `scaleX`             | 1                                  | 
| `scaleY`             | 1                                  |
| `embedCSS`           | true                               | 
