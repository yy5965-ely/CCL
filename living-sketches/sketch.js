let scanned = [];
let currentFrame = 0;


function preload() {
  for (let i = 0; i <= 17; i++) {
    scanned.push(loadImage("images/0" + i + ".png"));
  }
}

function setup() {
  createCanvas(800, 500);
}

function draw() {
  background(255);

  image(scanned[currentFrame], 0, 0, width, height)

  currentFrame = floor(frameCount / 5 % 17)
  console.log(currentFrame)
}


function crop(imgs, x, y, w, h) {
  let cropped = [];
  for (let i = 0; i < imgs.length; i++) {
    cropped.push(imgs[i].get(x, y, w, h));
  }
  return cropped;
}

function eraseBg(imgs, threshold = 10) {
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    img.loadPixels();
    for (let j = 0; j < img.pixels.length; j += 4) {
      let d = 255 - img.pixels[j];
      d += 255 - img.pixels[j + 1];
      d += 255 - img.pixels[j + 2];
      if (d < threshold) {
        img.pixels[j + 3] = 0;
      }
    }
    img.updatePixels();
  }
  // this function uses the pixels array
  // we will cover this later in the semester - stay tuned
}
