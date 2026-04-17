let img

function preload(){
  img = loadImage("matisse.png")
}

function setup() {
  createCanvas(800, 500);
}

function draw() {
  background(220);
  image(img, 0, 0)
  img.loadPixels();

  let x = floor(random(0, width));
  let y = floor(random(0, height));

  for(let y = 0; y <= img.height; y += 5){
    for (let x = 0; x <= img.width; x += 5){
      let index = (x + y * img.width) * 4
      let r = img.pixels[index + 0]     
      let g = img.pixels[index + 1]     
      let b = img.pixels[index + 2]

      fill(r, g, b);

      rect(x, y, 5)
    }
  }

  // let index = (mouseX + mouseY + img.width) * 4
  // let r = img.pixels[index + 0]     
  // let g = img.pixels[index + 1]     
  // let b = img.pixels[index + 2]

  // fill(r, g, b);
  // circle(mouseX, mouseY, 30)
}
