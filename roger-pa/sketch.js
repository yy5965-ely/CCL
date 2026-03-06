/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let t = 0;
let x = 400;
let y = 250;
let xspeed = 1;
let yspeed = 1;
let xac = 0;
let yac = 0;
let fre = 4;
let angle1 = 0;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container")
  background(5, 5, 15);
  angleMode(DEGREES);
  xspeed = random(1.2, 1.5);
  yspeed = random(1.2, 1.5);
}

function draw() {
  blendMode(BLEND);
  background(5, 5, 25, 35);
  blendMode(ADD);

  if (mouseX > 0 && mouseX < 800 && mouseY > 0 && mouseY < 500) {
    followMouse();
  } else {
    move();
  }
}

function move() {
  if (frameCount % 15 == 0) {
    xac = random(-0.02, 0.02);
    yac = random(-0.02, 0.02);
  }

  let turnForce = 0.05;

  if (x < 100) xac += turnForce;
  if (x > 700) xac -= turnForce;
  if (y < 50) yac += turnForce;
  if (y > 400) yac -= turnForce;

  xspeed += xac;
  yspeed += yac;

  let currentSpeed = sqrt(xspeed * xspeed + yspeed * yspeed);
  let maxSpeed = 2.0;
  let minSpeed = 1.0;

  if (currentSpeed > maxSpeed) {
    xspeed = (xspeed / currentSpeed) * maxSpeed;
    yspeed = (yspeed / currentSpeed) * maxSpeed;
  } else if (currentSpeed < minSpeed && currentSpeed > 0.01) {
    xspeed = (xspeed / currentSpeed) * minSpeed;
    yspeed = (yspeed / currentSpeed) * minSpeed;
  }

  x += xspeed;
  y += yspeed;

  angle1 = atan2(xspeed, yspeed);

  let currentContraction = sin(t * 1);
  drawjellyfish(x, y, 0.30 + sin(frameCount * fre) * 0.02, currentContraction);
  t += 0.015;
}

function followMouse() {
  let currentContraction = sin(t * 1);
  let amt = 0.05;

  let oldX = x;
  let oldY = y;
  x = lerp(x, mouseX, amt);
  y = lerp(y, mouseY, amt);

  xspeed = x - oldX;
  yspeed = y - oldY;
  angle1 = atan2(xspeed, yspeed);

  drawjellyfish(x, y, 0.30 + sin(frameCount * fre) * 0.02, currentContraction);
  t += 0.015;
}

function drawjellyfish(x, y, size, contraction) {
  push();
  translate(x, y);
  rotate(-angle1 + 180);
  scale(size);

  let R = 180 + contraction * 20;
  noFill();
  strokeWeight(1.2);

  for (let i = 0; i < 150; i++) {
    let angle = map(i, 0, 150, 0, 360);
    let r = map(sin(angle + t), -1, 1, 80, 180);
    let g = map(cos(angle - t), -1, 1, 120, 220);
    let b = 255;
    stroke(r, g, b, 20);

    beginShape();
    vertex(0, contraction * 15 - 60);
    let cx1 = cos(angle) * R * 0.6;
    let cy1 = -30;
    let cx2 = cos(angle) * R;
    let cy2 = 80 + contraction * 25;
    let n = noise(cos(angle) + 1, sin(angle) + 1, t * 0.4);
    let tx = cos(angle) * (R * 0.2) + map(n, 0, 1, -150, 150);
    let ty = 350 + map(n, 0, 1, -80, 180) - contraction * 50;
    bezierVertex(cx1, cy1, cx2, cy2, tx, ty);
    endShape();
  }
  pop();
}