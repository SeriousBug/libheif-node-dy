const sharp = require("sharp");
const fs = require("fs");
const libheif = require("./index");

const file = fs.readFileSync("image.heic");
const info = libheif.getInfo(file);
const data = libheif.decode(file);

const image = sharp(data, {
  raw: {
    height: info.height,
    width: info.width,
    channels: 4,
    premultiplied: info.is_premultiplied,
  },
});
image.jpeg().toFile("image.jpg");
