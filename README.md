# libheif-node-dy

Native image decoding and information, using dynamically linked [libheif](https://github.com/strukturag/libheif).

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
application in a way that users could not replace the library if they choose so.
Bundlers like rollup, webpack and others that bundle all code into one or a few
files very likely will violate the LGPL exception, and will therefore require
you to distribute your application under GPL (if you do distribute your
application).

This is not legal advice, and I'm not a lawyer. Contact a lawyer if you have
questions on how these licenses apply to your application.

## Performance

Hmm, benchmarks.
