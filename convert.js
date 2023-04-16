const sharp = require("sharp");
const fs = require("fs");
const addon = require("./build/Release/addon");

const file = fs.readFileSync("image1.heic");
const info = addon.get_info(file);

const c = addon.convert(file);
fs.writeFileSync("image1.jpg", c);
