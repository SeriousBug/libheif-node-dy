const sharp = require("sharp");
const fs = require("fs");
const addon = require("./build/Release/addon");

const file = fs.readFileSync("image1.heic");
const info = addon.get_info(file);
const data = addon.decode(file);

const image = sharp(data, {
  raw: {
    height: info.height,
    width: info.width,
    channels: 4,
    premultiplied: info.is_premultiplied,
  },
});
image.jpeg().toFile("image1.jpg");
