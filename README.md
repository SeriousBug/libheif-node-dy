# libheif-node-dy

Native HEIC/HEIF image decoding and information, using dynamically linked [libheif](https://github.com/strukturag/libheif). Supports converting HEIC to JPEG, PNG, and other formats when combined with [Sharp](https://sharp.pixelplumbing.com/).

This package dynamically links against libheif, and you must separately have it installed.

## Usage

```js
const fs = require('fs');
const { decode, getInfo } = require('libheif-node-dy');
// Or, import { decode, getInfo } from 'libheif-node-dy';

// Or any other way to get your image into a Buffer
const image = fs.readFileSync('path-to.heic');
const { width, height, isPremultiplied, hasAlphaChannel } = getInfo(image);
const decodedImage = decode(image);

// To convert it into JPEG or PNG, use it with sharp:
const sharp = require('sharp');
const newImage = sharp(decodedImage, {
  raw: {
    height,
    width,
    channels: 4,
    premultiplied: isPremultiplied,
  },
});
newImage.jpeg().toFile("image.jpg");
// Or .toBuffer() to get a buffer to use in something else
```

You can also look at the [benchmark/convert.js](benchmark/convert.js) file,
which is an example CLI program for converting HEIC files to JPEGs.

## Performance

`libheif-node-dy` is around 3 to 5 times faster than `heic-decode` in decoding images.

![4 violin plots. X axes are labeled Time (ms). First plot: Small images, about 0.6MP. libheif-node-dy averages around 80, heic-decode is between 264 and 284. Second plot: Medium images, about 2.5MP. libheif-node-dy averages around 280, heic-decode is slightly above 1039. Third plot: Large images, about 5.7MP. libheif-node-dy averages around 600, heic-decode is between 2322 and 2522. Fourth plot: Extra large images, 9.1MP to 24MP. libheif-node-dy averages around 1500, heic-decode is slightly below 7884.](benchmark/results.png)

## Licensing

This package is licensed under MIT. `libheif` is licensed under LGPL, which
grants an exception for dynamic linking. This package dynamically links against
libheif, which should satisfy that requirement. This means you can use this
package without licensing your software under GPL, so long as you don't bundle
your application in a way that restricts users from being able to replace
libheif.

Note that other packages like
[libheif-js](https://www.npmjs.com/package/libheif-js), and thus its
dependencies like [heic-decode](https://www.npmjs.com/package/heic-decode) may
require you to license your software under GPL if you bundle them within your
application in a way that users could not replace the library.
Bundlers like rollup, webpack, and others that bundle all code into one or a few
files very likely will violate the LGPL exception, and will therefore require
you to distribute your application under GPL, if you do distribute your
application.

This is not legal advice, and I'm not a lawyer. Contact a lawyer if you have
questions on how these licenses apply to your application.