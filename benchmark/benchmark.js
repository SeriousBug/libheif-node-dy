const fs = require("fs");
const path = require("path");
const heicDecode = require("heic-decode");
const { decode: nodeDecode } = require("libheif-node-dy");

function load(name) {
  const small = fs.readFileSync(
    path.join(__dirname, "test-images", `${name}-small.heic`),
  );
  const medium = fs.readFileSync(
    path.join(__dirname, "test-images", `${name}-medium.heic`),
  );
  const large = fs.readFileSync(
    path.join(__dirname, "test-images", `${name}-large.heic`),
  );
  const original = fs.readFileSync(
    path.join(__dirname, "test-images", `${name}-original.heic`),
  );
  return { small, medium, large, original };
}

function loadAll() {
  const images = {
    small: [],
    medium: [],
    large: [],
    original: [],
  };
  const names = [
    "pexels-axel-sandoval-14631645",
    "pexels-cristian-muduc-12160606",
    "pexels-john-farias-14623857",
    "pexels-sultan-raimosan-10477018",
  ];
  names.forEach((name) => {
    const { small, medium, large, original } = load(name);
    images.small.push(small);
    images.medium.push(medium);
    images.large.push(large);
    images.original.push(original);
  });
  return images;
}

const allImages = loadAll();

function decodeWithHeicDecode(images) {
  images.forEach((image) => {
    const { width, height, data } = heicDecode({ buffer: image });
  });
}

function decodeWithNodeDecode(images) {
  images.forEach((image) => {
    const data = nodeDecode(image);
  });
}

const WARMUP_ROUNDS = 20;
const SMALL_ROUNDS = 80;
const MEDIUM_ROUNDS = 40;
const LARGE_ROUNDS = 20;
const ORIGINAL_ROUNDS = 10;

function logData(name, times) {
  const sum = times.reduce((a, b) => a + b, 0);
  const avg = sum / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  console.log(`${name},${avg},${min},${max},${sum}`);
}

function benchmark(name, cb) {
  let start;
  let end;

  // warmup
  for (let i = 0; i < WARMUP_ROUNDS; i++) {
    cb(allImages.small);
    cb(allImages.medium);
  }

  const times = {
    small: [],
    medium: [],
    large: [],
    original: [],
  };

  // run
  for (let i = 0; i < SMALL_ROUNDS; i++) {
    start = Date.now();
    cb(allImages.small);
    end = Date.now();
    times.small.push(end - start);
  }
  logData(`${name} small`, times.small);

  for (let i = 0; i < MEDIUM_ROUNDS; i++) {
    start = Date.now();
    cb(allImages.medium);
    end = Date.now();
    times.medium.push(end - start);
  }
  logData(`${name} medium`, times.medium);

  for (let i = 0; i < LARGE_ROUNDS; i++) {
    start = Date.now();
    cb(allImages.large);
    end = Date.now();
    times.large.push(end - start);
  }
  logData(`${name} large`, times.large);

  for (let i = 0; i < ORIGINAL_ROUNDS; i++) {
    start = Date.now();
    cb(allImages.original);
    end = Date.now();
    times.original.push(end - start);
  }
  logData(`${name} original`, times.original);

  return times;
}

function benchmarkAll() {
  console.log("name,avg,min,max,sum");
  const timesHeicDecode = benchmark("heic-decode", decodeWithHeicDecode);
  const timesNodeDecode = benchmark("libheif-node-dy", decodeWithNodeDecode);
  fs.writeFileSync(
    path.join(__dirname, "results.json"),
    JSON.stringify({
      heicDecode: timesHeicDecode,
      nodeDecode: timesNodeDecode,
    }),
  );
}

benchmarkAll();
