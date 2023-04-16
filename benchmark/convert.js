const sharp = require("sharp");
const fs = require("fs");
const libheif = require("libheif-node-dy");

const fileNames = process.argv.slice(2);
if (fileNames.length === 0) {
  console.error("Usage: node convert.js <file1.heic> <file2.heic> ...");
  process.exit(1);
}
fileNames.forEach((fileName) => {
  const file = fs.readFileSync(fileName);
  const info = libheif.getInfo(file);
  const data = libheif.decode(file);

  const image = sharp(data, {
    raw: {
      height: info.height,
      width: info.width,
      channels: 4,
    },
  });
  image.jpeg().toFile(fileName.replace(/\.heic$/, ".jpg"));
});
