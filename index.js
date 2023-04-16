const libheif = require("bindings")("heif.node");

module.exports = {
  decode: libheif.decode,
  getInfo: libheif.get_info,
};
