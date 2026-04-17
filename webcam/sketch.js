let cam;

function setup() {
  createCanvas(640, 480); // default dimensions of webcam
  cam = createCapture(VIDEO);
}

function draw() {
  background(0);
  push()
  scale(-1, 1)
  translate(-width, 0)
  image(cam, 0, 0);
  cam.loadPixels();


  for(let y = 0; y <= cam.height; y += 5){
    for (let x = 0; x <= cam.width; x += 5){
      let index = (x + y * cam.width) * 4
      let r = cam.pixels[index + 0]     
      let g = cam.pixels[index + 1]     
      let b = cam.pixels[index + 2]

      let avg = (r + g + b) / 3
      let size = map (avg, 0, 255, 0, 5)


      fill(0, 0, 0);

      rect(x, y, 5)
    }
  }
}
