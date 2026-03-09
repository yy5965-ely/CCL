/*
Template for IMA's Creative Coding Lab 

Project A: Generative Creatures
CCLaboratories Biodiversity Atlas 
*/

let t = 0;
let jx = 400;
let jy = 250;
let vx = 1;
let vy = 1;
let accX = 0;
let accY = 0;
let myAngle = 0;
let breathe = 0;

let activeLevel = 0.5;
let oldMx = 0;
let oldMy = 0;
let stopTime = 0;
let sleepVal = 0;
let mouseIn = false;
let dashTime = 0;

let clickNum = 0;
let magicTime = 0;
let magicPower = 0;
let waterFlow = 0;
let bgPos = 0;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  
  canvas.mouseOver(() => { mouseIn = true; });
  canvas.mouseOut(() => { mouseIn = false; });

  background(5, 5, 15);
  angleMode(DEGREES);
  vx = random(1.2, 1.5);
  vy = random(1.2, 1.5);
}

function draw() {
  blendMode(BLEND);
  background(5, 5, 25, 35);
  blendMode(ADD);

  if (keyIsDown(LEFT_ARROW)) {
    waterFlow = lerp(waterFlow, -3.5, 0.05);
  } else if (keyIsDown(RIGHT_ARROW)) {
    waterFlow = lerp(waterFlow, 3.5, 0.05);
  } else {
    waterFlow = lerp(waterFlow, 0, 0.02);
  }
  bgPos += waterFlow;

  push();
  noStroke();
  for (let i = 0; i < 60; i++) {
    let p = 1 + (i % 3) * 0.3; 
    let startX = ((i * 73 + bgPos * p) % 800 + 800) % 800;
    let startY = (i * 97) % 500;
    
    let dx = sin(frameCount * 0.5 + i * 11) * 15;
    let dy = cos(frameCount * 0.3 + i * 13) * 15;
    
    let xx = startX + dx;
    let yy = startY + dy;
    
    let tType = i % 3; 
    let sBase = 0;
    if (tType == 0) {
      sBase = 1.8;
    } else if (tType == 1) {
      sBase = 0.9;
    } else {
      sBase = 0.4;
    }
    
    let sNow = sBase + sin(frameCount * 2 + i * 5) * (sBase * 0.3);
    
    let aBase = 0;
    if (tType == 0) {
      aBase = 160;
    } else if (tType == 1) {
      aBase = 110;
    } else {
      aBase = 60;
    }
    
    let aNow = aBase + sin(frameCount * 3 + i * 7) * 50;
    
    let r1 = 100 + sin(i * 15) * 50;
    let g1 = 180 + cos(i * 25) * 50;
    let b1 = 255;
    
    fill(r1, g1, b1, aNow * 0.3);
    ellipse(xx, yy, sNow * 2.5);
    
    fill(255, 255, 255, aNow);
    ellipse(xx, yy, sNow);
  }
  pop();

  let dMouse = dist(mouseX, mouseY, oldMx, oldMy);

  if (mouseIn == true && dMouse > 0) {
    if (activeLevel < 0.55) {
      activeLevel += 0.01;
    }
    stopTime = 0;
  } else {
    stopTime++;
    if (stopTime > 300) {
      clickNum = 0;
    }
    if (stopTime > 900) { 
      activeLevel -= 0.0004; 
    }
  }

  if (dashTime > 0) {
    dashTime--;
  } else if (activeLevel > 0.55 && magicTime == 0) {
    activeLevel -= 0.005; 
  }

  if (activeLevel > 1) activeLevel = 1;
  if (activeLevel < 0) activeLevel = 0;

  oldMx = mouseX;
  oldMy = mouseY;

  if (magicTime > 0) {
    magicPower = lerp(magicPower, 1.0, 0.02);
    magicTime--;
    if (magicTime == 0) {
      activeLevel = 1.0;
      dashTime = 100;
    }
  } else {
    magicPower = lerp(magicPower, 0.0, 0.008);
  }

  let spd = map(activeLevel, 0, 1, 1.0, 6.0); 
  if (magicTime > 0) {
    spd = 2.0; 
  }
  breathe += spd;

  if (magicTime > 0) {
    doMagic();
  } else if (mouseIn == true && stopTime < 900) {
    followM();
  } else {
    normalMove();
  }

  jx += waterFlow * 0.6;
  if (jx < 40) jx = 40;
  if (jx > 760) jx = 760;
}

function mousePressed() {
  if (mouseIn == true) {
    let d = dist(mouseX, mouseY, jx, jy);
    if (d < 80) { 
      clickNum++;
      if (clickNum >= 5) {
        magicTime = 600; 
        clickNum = 0;
      } else {
        activeLevel = 1.0;
        dashTime = 150; 
        
        let a = random(360);
        vx += cos(a) * 5;
        vy += sin(a) * 5;
      }
    }
  }
}

function doMagic() {
  sleepVal = 0;
  
  jx = lerp(jx, 400, 0.015);
  jy = lerp(jy, 250, 0.015);
  vx *= 0.85;
  vy *= 0.85;
  
  let ta = 180;
  let df = ta - myAngle;
  while (df < -180) df += 360;
  while (df > 180) df -= 360;
  myAngle += df * 0.03;
  
  let st = 0.5;
  let con = sin(t * 2) * st * 15;
  drawJelly(jx, jy, 0.35 + sin(breathe) * 0.02, con);
  t += 0.015;
}

function normalMove() {
  let ac = map(activeLevel, 0, 1, 0.0, 0.03);
  
  if (frameCount % 15 == 0) {
    accX = random(-ac, ac);
    accY = random(-ac, ac);
  }

  let tf = map(activeLevel, 0, 1, 0.002, 0.08);
  
  if (jx < 100) accX += tf;
  if (jx > 700) accX -= tf;
  if (jy < 50) accY += tf;
  
  if (activeLevel > 0.1) {
     if (jy > 360) accY -= tf;
  } else {
     vy += 0.006; 
  }

  vx += accX;
  vy += accY;

  let sNow = sqrt(vx * vx + vy * vy);
  let maxS = map(activeLevel, 0, 1, 0.4, 3.5);
  let minS = map(activeLevel, 0, 1, 0.0, 1.2);

  if (sNow > maxS) {
    vx = (vx / sNow) * maxS;
    vy = (vy / sNow) * maxS;
  } else if (sNow < minS && sNow > 0.01) {
    vx = (vx / sNow) * minS;
    vy = (vy / sNow) * minS;
  }

  if (jy > 360) {
    jy = 360;
    if (vy > 0) vy *= 0.5; 
    if (activeLevel < 0.05) {
      vx = sin(frameCount * 0.5) * 0.3;
    }
  }

  jx += vx;
  jy += vy;

  calcAngle();

  let st = map(activeLevel, 0, 1, 0.4, 1.2); 
  let con = sin(t * 1) * st;
  drawJelly(jx, jy, 0.30 + sin(breathe) * 0.02, con);
  
  let ts = map(activeLevel, 0, 1, 0.008, 0.035);
  t += ts;
}

function followM() {
  let st = map(activeLevel, 0, 1, 0.4, 1.2);
  let con = sin(t * 1) * st;
  let am = map(activeLevel, 0, 1, 0.01, 0.04);

  let d = dist(jx, jy, mouseX, mouseY);
  let cf = map(d, 0, 400, 1, 0);
  if (cf > 1) cf = 1;
  if (cf < 0) cf = 0;

  let hx = sin(frameCount * 1.5) * 250 * activeLevel * cf;
  let hy = cos(frameCount * 2.2) * 180 * activeLevel * cf;

  let tx = mouseX + hx;
  let ty = mouseY + hy;

  let ox = jx;
  let oy = jy;
  jx = lerp(jx, tx, am);
  jy = lerp(jy, ty, am);

  vx = jx - ox;
  vy = jy - oy;
  
  calcAngle();

  drawJelly(jx, jy, 0.30 + sin(breathe) * 0.02, con);
  
  let ts = map(activeLevel, 0, 1, 0.008, 0.025);
  t += ts;
}

function calcAngle() {
  if (jy >= 358 && activeLevel < 0.05) {
    sleepVal = lerp(sleepVal, 1, 0.015);
  } else {
    sleepVal = lerp(sleepVal, 0, 0.05);
  }
  
  let sw = sin(frameCount * 0.5) * 8;
  let ra = 180 + sw;
  
  let sNow = sqrt(vx * vx + vy * vy);
  let va = myAngle;
  
  if (sNow > 0.2 || abs(waterFlow) > 0.1) {
    va = atan2(vx - waterFlow * 3.0, vy);
  }
  
  let fx = sin(va) * (1 - sleepVal) + sin(ra) * sleepVal;
  let fy = cos(va) * (1 - sleepVal) + cos(ra) * sleepVal;
  let ta = atan2(fx, fy);
  
  let df = ta - myAngle;
  while (df < -180) df += 360;
  while (df > 180) df -= 360;
  
  let ts = map(activeLevel, 0, 1, 0.015, 0.1);
  myAngle += df * ts;
}

function drawJelly(xPos, yPos, s, con) {
  push();
  translate(xPos, yPos);
  rotate(-myAngle + 180);
  scale(s);

  let rad = 180 + con * 20;
  strokeWeight(lerp(1.2, 0.8, magicPower));
  noFill();

  for (let i = 0; i < 150; i++) {
    let a = map(i, 0, 150, 0, 360);
    
    let rb = map(activeLevel, 0.6, 1, 0, 85);
    if (rb < 0) rb = 0;
    let bd = map(activeLevel, 0.6, 1, 0, 115);
    if (bd < 0) bd = 0;
    
    let rn = map(sin(a + t), -1, 1, 80 + rb, 180 + rb);
    let gn = map(cos(a - t), -1, 1, 120, 220);
    let bn = 255 - bd;

    let pNum = 6;
    let lp = a * pNum; 
    let leaf = pow(abs(sin(lp / 2)), 1.2); 
    
    let shake = sin(frameCount * 4 + a * 3) * 15 * leaf;
    let sw = sin(frameCount * 1.5) * 6; 
    let sa = a + sw;

    let hs = sin(a * 2 + t * 4) * 30;
    
    let rs1 = map(leaf, 0, 1, 120, 255) + hs;
    let gs1 = map(leaf, 0, 1, 40, 160);
    let bs1 = map(sin(a * 3 + t * 5), -1, 1, 200, 255);
    
    if (rs1 > 255) rs1 = 255; if (rs1 < 0) rs1 = 0;
    if (gs1 > 255) gs1 = 255; if (gs1 < 0) gs1 = 0;
    if (bs1 > 255) bs1 = 255; if (bs1 < 0) bs1 = 0;
    
    let rf = lerp(rn, rs1, magicPower);
    let gf = lerp(gn, gs1, magicPower);
    let bf = lerp(bn, bs1, magicPower);
    
    let alphaVal = map(magicPower, 0, 1, 20, 55);
    stroke(rf, gf, bf, alphaVal);

    beginShape();
    vertex(0, con * 15 - 60);
    
    let nx1 = cos(a) * rad * 0.6;
    let ny1 = -30;
    let nx2 = cos(a) * rad;
    let ny2 = 80 + con * 25;
    let nval = noise(cos(a) + 1, sin(a) + 1, t * 0.4);
    let tx1 = cos(a) * (rad * 0.2) + map(nval, 0, 1, -150, 150);
    let ty1 = 350 + map(nval, 0, 1, -80, 180) - con * 50;

    let fr = rad * (0.6 + 1.2 * leaf) + shake; 
    let sp = cos(lp / 2) * 45; 
    
    let sx1 = cos(sa) * rad * 0.4;
    let sy1 = sin(sa) * rad * 0.4;
    let sx2 = cos(sa + sp) * rad * 1.3 * leaf;
    let sy2 = sin(sa + sp) * rad * 1.3 * leaf;
    let tw = sin(frameCount * 5 + lp) * 8;
    let tx2 = cos(sa + tw) * fr;
    let ty2 = sin(sa + tw) * fr;

    let fx1 = lerp(nx1, sx1, magicPower);
    let fy1 = lerp(ny1, sy1, magicPower);
    let fx2 = lerp(nx2, sx2, magicPower);
    let fy2 = lerp(ny2, sy2, magicPower);
    let fx3 = lerp(tx1, tx2, magicPower);
    let fy3 = lerp(ty1, ty2, magicPower);

    bezierVertex(fx1, fy1, fx2, fy2, fx3, fy3);
    endShape();
  }
  pop();
}