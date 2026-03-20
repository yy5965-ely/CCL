let backtrack;
let img
let x = [];
let y = [];
let sounds = [];

function preload(){
  backtrack = loadSound("assets/my-sounds/00.mp3")
  for (let i = 1; i <= 8; i ++){
    sounds.push(loadSound("assets/my-sounds/0" + i + ".mp3"))
  }
  img = loadImage("assets/images/asterisk.png")
}

function setup() {
  createCanvas(400, 400);
  // backtrack.loop();
}

function draw() {
  background(220);
  for (let i = 0; i < x.length; i ++){
    image(img, x[i], y[i])
  }
}

function drawCircle(x, y){
  fill(30);
  circle(x, y, 30)
}

function mousePressed(){
  x.push(mouseX);
  y.push(mouseY);
  let index = (x.length - 1) % sounds.length
  sounds[index].play()
}