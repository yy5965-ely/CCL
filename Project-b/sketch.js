let items = [];

let isNight = false;
let nightAlpha = 0;

let imgSky, imgNight, imgGrass, imgPond, imgCherry, imgMaple, imgTree1, imgTree2;
let imgCat, imgCat2, imgSquirrel, imgSunflower, imgWildflower;
let imgBottleEmpty, imgBottleWatering;

let sndLeaves, sndCat, sndWater, sndBee, sndSquirrel;

let isSystemPaused = false;

function preload() {
  imgSky = loadImage('sky.png');
  imgNight = loadImage('night.png'); 
  imgGrass = loadImage('lawn.png');
  imgPond = loadImage('pond.png');

  imgCherry = loadImage('cherry.png');
  imgMaple = loadImage('maple.png');
  imgTree1 = loadImage('tree1.png');
  imgTree2 = loadImage('tree2.png');
  
  imgCat = loadImage('cat.png');
  imgCat2 = loadImage('cat2.png'); 

  imgSquirrel = loadImage('squirrel.png');
  imgSunflower = loadImage('sunflower.png');
  imgWildflower = loadImage('flower.png');

  imgBottleEmpty = loadImage('waterBottle0.png');
  imgBottleWatering = loadImage('waterBottle.png');
  
  soundFormats('mp3', 'ogg');
  sndLeaves = loadSound('Leaves.mp3');
  sndCat = loadSound('cat.mp3');
  sndWater = loadSound('Water.mp3');
  sndBee = loadSound('Bee.mp3');
  sndSquirrel = loadSound('Squirrel.mp3');
}

function setup() {
  createCanvas(1500, 800);

  items.push(new Environment(imgSky, width / 2, height / 2, 1600, imgNight));
  items.push(new Environment(imgGrass, width / 2, height / 2 + 150, 1500));

  items.push(new Pond(imgPond, 950, 580, 480));

  items.push(new NormalTree(imgTree1, 80, 280, 650));
  items.push(new NormalTree(imgTree2, 1000, 280, 650));
  items.push(new NormalTree(imgTree1, 1350, 280, 650));
  items.push(new CherryTree(imgCherry, 600, 250, 950));
  items.push(new MapleTree(imgMaple, 1250, 400, 650));

  items.push(new Flower(imgSunflower, 150, 380, 300, 'sunflower'));
  items.push(new Flower(imgWildflower, 1250, 680, 500));
  items.push(new Flower(imgWildflower, 900, 720, 350));

  items.push(new Cat(imgCat, imgCat2, 400, 500, 600));
  items.push(new Squirrel(imgSquirrel, 750, 420, 200));
}

function draw() {
  background(30);

  let hoverType = false;
  let activeHoverItem = null;
  
  isSystemPaused = false;
  
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].checkHover) {
      let res = items[i].checkHover(mouseX, mouseY);
      if (res) {
        hoverType = res; 
        activeHoverItem = items[i];
        break; 
      }
    }
  }

  if (mouseIsPressed) {
    if (activeHoverItem) {
      isSystemPaused = true; 

      let snd = getSoundForInteraction(activeHoverItem, hoverType);
      if (snd) {
        snd.setLoop(true); 
        if (snd.isPlaying() === false) {
          snd.play();
        }
      }

      if (frameCount % 15 === 0) {
         if (activeHoverItem.name !== 'Squirrel') {
             activeHoverItem.interact(mouseX, mouseY);
         }
      }
    }
  }

  let totalHealth = 0;
  let count = 0;

  for (let i = 0; i < items.length; i++) {
    items[i].update();
    items[i].display();

    if (items[i].health !== undefined) {
      totalHealth = totalHealth + items[i].health;
      count = count + 1;
    }
  }

  if (isNight === true) {
    nightAlpha = lerp(nightAlpha, 160, 0.05);
  } else {
    nightAlpha = lerp(nightAlpha, 0, 0.05);
  }

  if (nightAlpha > 1) {
    push();
    fill(10, 15, 45, nightAlpha); 
    noStroke();
    rectMode(CORNER);
    rect(0, 0, width, height);
    pop();
  }

  let avgHealth = 0;
  if (count > 0) {
    avgHealth = totalHealth / count;
  }
  
  drawGlobalGrid(avgHealth);

  fill(255);
  noStroke();
  textAlign(CENTER);
  text("Click or Hold bottom of plants to water. Click tops to interact.", width / 2, height - 30);
  textAlign(LEFT);
  text("System Health: " + round(avgHealth) + "%", 20, 30);

  if (hoverType === 'water') {
    noCursor();
    push();
    imageMode(CENTER);
    translate(mouseX, mouseY);
    if (mouseIsPressed) {
      rotate(0.4); 
      image(imgBottleWatering, 0, 0, 180, 80);
    } else {
      image(imgBottleEmpty, 0, 0, 180, 80);
    }
    pop();
  } else if (hoverType === 'special' || hoverType === 'animal' || hoverType === 'pond') {
    cursor(HAND); 
  } else {
    cursor(ARROW);
  }
}

function getSoundForInteraction(item, type) {
  if (type === 'water') {
    return sndWater;
  }
  if (type === 'pond') {
    return sndWater;
  }
  
  if (item.name === 'Cat') {
    return sndCat;
  }
  
  if (item.name === 'Squirrel') {
    return sndSquirrel;
  }
  
  if (item.name === 'Flower') {
    if (type === 'special') {
      if (item.type === 'sunflower') {
        return null;
      } else {
        return sndBee;
      }
    }
  }
  
  if (item.name === 'NormalTree' || item.name === 'CherryTree' || item.name === 'MapleTree') {
    if (type === 'special') {
      return sndLeaves;
    }
  }
  
  return null;
}

function mousePressed() {
  userStartAudio();

  let interactedItem = null;
  let hType = false;
  
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].checkHover) {
      hType = items[i].checkHover(mouseX, mouseY);
      if (hType) {
        let result = items[i].interact(mouseX, mouseY);
        if (result === true) {
          interactedItem = items[i];
          break; 
        }
      }
    }
  }

  if (interactedItem) {
    let snd = getSoundForInteraction(interactedItem, hType);
    if (snd) {
      if (snd.isPlaying() === false) {
        snd.play();
      }
    }
  }
}

function mouseReleased() {
  if (sndLeaves) { sndLeaves.setLoop(false); }
  if (sndCat) { sndCat.setLoop(false); }
  if (sndWater) { sndWater.setLoop(false); }
  if (sndBee) { sndBee.setLoop(false); }
  if (sndSquirrel) { sndSquirrel.setLoop(false); }
}

function drawGlobalGrid(avgHealth) {
  if (avgHealth >= 40) {
    return;
  }

  let maxDist = dist(0, 0, width / 2, height / 2) + 100;
  let safeRadius = map(avgHealth, 40, 0, maxDist, -300);

  let gridSize = 30;
  rectMode(CENTER);

  for (let x = -gridSize; x <= width + gridSize; x += gridSize) {
    for (let y = -gridSize; y <= height + gridSize; y += gridSize) {
      let d = dist(x, y, width / 2, height / 2);

      if (d >= safeRadius) {
        let gridAlpha = map(d - safeRadius, 0, 200, 40, 255);
        if (gridAlpha < 0) { gridAlpha = 0; }
        if (gridAlpha > 255) { gridAlpha = 255; }

        fill(70, 70, 70, gridAlpha * random(0.85, 1));
        stroke(30, 30, 30, gridAlpha);
        rect(x, y, gridSize * 0.95, gridSize * 0.95);
      }
    }
  }
}

class AshParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2.5, -0.5);
    this.vy = random(-1.0, 1.0);
    this.life = 255;
    this.size = random(2, 4);
    let shade = random(50, 150);
    this.color = color(shade, shade, shade);
  }
  update() {
    this.x = this.x + this.vx;
    this.y = this.y + this.vy;
    this.life = this.life - random(2, 4);
  }
  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.life);
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size);
  }
  isDead() { 
    if (this.life <= 0) {
      return true;
    } else {
      return false;
    }
  }
}

class LeafParticle {
  constructor(x, y, leafColor, sizeMult = 1.0) {
    this.x = x;
    this.y = y;
    this.vx = random(-1.5, 1.5);
    this.vy = random(1, 3);
    this.leafColor = leafColor;
    this.life = 255;
    this.size = random(6, 12) * sizeMult;
    this.angle = random(TWO_PI);
    this.spin = random(-0.05, 0.05);
    this.swayOffset = random(1000); 
  }
  update() {
    this.x = this.x + this.vx + sin(frameCount * 0.05 + this.swayOffset) * 0.5; 
    this.y = this.y + this.vy;
    this.angle = this.angle + this.spin;
    this.life = this.life - 2.5; 
  }
  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    noStroke();
    fill(red(this.leafColor), green(this.leafColor), blue(this.leafColor), this.life);
    ellipse(0, 0, this.size, this.size * 0.6); 
    pop();
  }
  isDead() { 
    if (this.life <= 0) {
      return true;
    } else {
      return false;
    }
  }
}

class BeeParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.seed = random(1000);
    this.life = 255;
    this.vx = random(-0.8, 0.8);
    this.vy = random(-0.6, 0.6); 
  }
  update() {
    this.x = this.x + this.vx + sin(frameCount * 0.3 + this.seed) * 2.0;
    this.y = this.y + this.vy + cos(frameCount * 0.4 + this.seed) * 1.5;
    this.life = this.life - 1.2; 
  }
  display() {
    push();
    translate(this.x, this.y);
    noStroke();
    
    fill(255, 255, 255, this.life * 0.7);
    ellipse(-3, -4, 6, 8);
    ellipse(3, -4, 6, 8);

    fill(255, 204, 0, this.life); 
    ellipse(0, 0, 10, 8);

    fill(0, this.life); 
    rectMode(CENTER);
    rect(0, 0, 3, 8, 2);
    
    pop();
  }
  isDead() { 
    if (this.life <= 0) {
      return true;
    } else {
      return false;
    }
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.alpha = 255;
  }
  update() {
    this.size = this.size + 2;   
    this.alpha = this.alpha - 5;  
  }
  display() {
    push();
    noFill();
    stroke(255, 255, 255, this.alpha);
    strokeWeight(2);
    ellipse(this.x, this.y, this.size, this.size * 0.5); 
    pop();
  }
  isDead() { 
    if (this.alpha <= 0) {
      return true;
    } else {
      return false;
    }
  }
}

class Environment {
  constructor(img, x, y, size, imgNight = null) {
    this.name = 'Environment';
    this.img = img;
    this.imgNight = imgNight;
    this.x = x;
    this.y = y;
    this.size = size;
  }
  update() {
  } 
  display() {
    push();
    imageMode(CENTER);
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }
    
    image(this.img, this.x, this.y, this.size, imgH);
    
    if (this.imgNight) {
      if (nightAlpha > 0) {
        let imgAlpha = map(nightAlpha, 0, 160, 0, 255);
        tint(255, imgAlpha);
        image(this.imgNight, this.x, this.y, this.size, imgH);
        noTint();
      }
    }
    pop();
  }
}

class Cat {
  constructor(img1, img2, x, y, size) {
    this.name = 'Cat';
    this.img1 = img1; 
    this.img2 = img2; 
    this.x = x;
    this.y = y;
    this.size = size;
    this.health = 100; 
    this.particles = [];
    
    this.wagFrame = 0;      
    this.wagTimer = 0; 
  }
  update() {
    // 全局未暂停时才掉血
    if (!isSystemPaused) {
      this.health = this.health - 0.02;
      if (this.health < 0) {
        this.health = 0;
      }
    }

    let imgW = this.size;
    let imgH = this.size;
    if (this.img1.width > 0) {
      imgH = this.size * (this.img1.height / this.img1.width);
    }

    if (this.health < 40) {
      if (this.health > 10) {
        if (random() < 0.2) {
          let numParticles = floor(random(2, 5));
          for (let k = 0; k < numParticles; k++) {
            let px = this.x + random(-imgW/2, imgW/2);
            let py = this.y + random(-imgH/2, imgH/2);
            this.particles.push(new AshParticle(px, py));
          }
        }
      }
    }
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
    
    if (this.wagTimer > 0) {
      this.wagTimer = this.wagTimer - 1;
      if (frameCount % 15 < 7) {
        this.wagFrame = 1;
      } else {
        this.wagFrame = 0;
      }
    } else {
      this.wagFrame = 0;
    }
  }
  water() { 
    this.health = this.health + 1.5; // 回血降至极慢
    if (this.health > 100) {
      this.health = 100;
    }
    this.wagTimer = 40; 
  }
  checkHover(mx, my) {
    let imgW = this.size;
    let imgH = this.size;
    if (this.img1.width > 0) {
      imgH = this.size * (this.img1.height / this.img1.width);
    }
    let hitW = imgW * 0.7;
    let hitH = imgH * 0.8;
    
    if (mx > this.x - hitW / 2) {
      if (mx < this.x + hitW / 2) {
        if (my > this.y - hitH / 2) {
          if (my < this.y + hitH / 2) {
            return 'animal';
          }
        }
      }
    }
    return false;
  }
  interact(mx, my) {
    if (this.checkHover(mx, my) === 'animal') {
      this.water();
      return true;
    }
    return false;
  }
  display() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
    
    push();
    imageMode(CENTER);
    let imgW = this.size;
    let imgH = this.size;
    if (this.img1.width > 0) {
      imgH = this.size * (this.img1.height / this.img1.width);
    }

    if (this.health < 40) {
      let alphaValue = map(this.health, 40, 15, 255, 0);
      if (alphaValue < 0) { alphaValue = 0; }
      if (alphaValue > 255) { alphaValue = 255; }
      tint(255, alphaValue);
    }
    
    if (this.wagFrame === 0) {
      image(this.img1, this.x, this.y, imgW, imgH);
    } else {
      image(this.img2, this.x, this.y, imgW, imgH);
    }
    noTint();
    pop();
  }
}

class Squirrel {
  constructor(img, x, y, size) {
    this.name = 'Squirrel';
    this.img = img;
    this.x = x;
    this.y = y;
    this.size = size;
    this.health = 100; 
    this.particles = [];
  }
  update() {
    // 全局未暂停时才掉血
    if (!isSystemPaused) {
      this.health = this.health - 0.02;
      if (this.health < 0) {
        this.health = 0;
      }
    }

    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (this.health < 40) {
      if (this.health > 10) {
        if (random() < 0.2) {
          let numParticles = floor(random(2, 5));
          for (let k = 0; k < numParticles; k++) {
            let px = this.x + random(-imgW/2, imgW/2);
            let py = this.y + random(-imgH/2, imgH/2);
            this.particles.push(new AshParticle(px, py));
          }
        }
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
  water() { 
    this.health = this.health + 1.5; 
    if (this.health > 100) {
      this.health = 100;
    }
  }
  checkHover(mx, my) {
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }
    let hitW = imgW * 0.5;
    let hitH = imgH * 0.7;
    
    if (mx > this.x - hitW / 2) {
      if (mx < this.x + hitW / 2) {
        if (my > this.y - hitH / 2) {
          if (my < this.y + hitH / 2) {
            return 'animal';
          }
        }
      }
    }
    return false;
  }
  interact(mx, my) {
    if (this.checkHover(mx, my) === 'animal') {
      this.water(); 
      
      let imgW = this.size;
      let imgH = this.size;
      if (this.img.width > 0) {
        imgH = this.size * (this.img.height / this.img.width);
      }
      
      for (let k = 0; k < 15; k++) {
        let px = this.x + random(-imgW/4, imgW/4);
        let py = this.y + random(-imgH/4, imgH/4);
        this.particles.push(new AshParticle(px, py));
      }

      this.x = random(200, 1300); 
      this.y = random(450, 700);  
      return true;
    }
    return false;
  }
  display() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
    
    push();
    imageMode(CENTER);
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (this.health < 40) {
      let alphaValue = map(this.health, 40, 15, 255, 0);
      if (alphaValue < 0) { alphaValue = 0; }
      if (alphaValue > 255) { alphaValue = 255; }
      tint(255, alphaValue);
    }
    image(this.img, this.x, this.y, imgW, imgH);
    noTint();
    pop();
  }
}

class Pond {
  constructor(img, x, y, size) {
    this.name = 'Pond';
    this.img = img;
    this.x = x;
    this.y = y;
    this.size = size;
    this.health = 100; 
    this.particles = []; 
    this.ripples = [];   
  }
  update() {
    // 全局未暂停时才掉血
    if (!isSystemPaused) {
      this.health = this.health - 0.02; 
      if (this.health < 0) {
        this.health = 0;
      }
    }

    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (this.health < 40) {
      if (this.health > 10) {
        if (random() < 0.2) {
          let px = this.x + random(-imgW/3, imgW/3);
          let py = this.y + random(-imgH/4, imgH/4);
          this.particles.push(new AshParticle(px, py));
        }
      }
    }

    for (let i = this.ripples.length - 1; i >= 0; i--) {
      this.ripples[i].update();
      if (this.ripples[i].isDead()) {
        this.ripples.splice(i, 1);
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
  water() {
    this.health = this.health + 1.5; 
    if (this.health > 100) {
      this.health = 100;
    }
  }
  checkHover(mx, my) {
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }
    let hitW = imgW * 0.9;
    let hitH = imgH * 0.8;
    
    if (mx > this.x - hitW / 2) {
      if (mx < this.x + hitW / 2) {
        if (my > this.y - hitH / 2) {
          if (my < this.y + hitH / 2) {
            return 'pond'; 
          }
        }
      }
    }
    return false;
  }
  interact(mx, my) {
    if (this.checkHover(mx, my) === 'pond') {
      this.water();
      this.ripples.push(new Ripple(mx, my));
      return true;
    }
    return false;
  }
  display() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }

    push();
    imageMode(CENTER);
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (this.health < 40) {
      let alphaValue = map(this.health, 40, 15, 255, 0);
      if (alphaValue < 0) { alphaValue = 0; }
      if (alphaValue > 255) { alphaValue = 255; }
      tint(255, alphaValue);
    }
    image(this.img, this.x, this.y, imgW, imgH);
    noTint();
    pop();

    for (let i = 0; i < this.ripples.length; i++) {
      this.ripples[i].display();
    }
  }
}

class NormalTree {
  constructor(img, x, y, size) {
    this.name = 'NormalTree';
    this.img = img;
    this.x = x;
    this.y = y;
    this.size = size;
    this.health = 100; 
    this.particles = [];
    this.leaves = []; 
  }
  update() {
    // 全局未暂停时才掉血
    if (!isSystemPaused) {
      this.health = this.health - 0.02;
      if (this.health < 0) {
        this.health = 0;
      }
    }

    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (this.health < 40) {
      if (this.health > 10) {
        if (random() < 0.2) {
          let numParticles = floor(random(2, 5));
          for (let k = 0; k < numParticles; k++) {
            let px = this.x + random(-imgW/2, imgW/2);
            let py = this.y + random(-imgH/2, imgH/2);
            this.particles.push(new AshParticle(px, py));
          }
        }
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
    for (let i = this.leaves.length - 1; i >= 0; i--) {
      this.leaves[i].update();
      if (this.leaves[i].isDead()) {
        this.leaves.splice(i, 1);
      }
    }
  }
  water() {
    this.health = this.health + 1; 
    if (this.health > 100) {
      this.health = 100;
    }
  }
  checkHover(mx, my) {
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }
    let hitW = imgW * 0.6;
    let hitH = imgH * 0.8;
    
    if (mx > this.x - hitW / 2) {
      if (mx < this.x + hitW / 2) {
        if (my > this.y - hitH / 2) {
          if (my <= this.y) {
            return 'special'; 
          }
        }
        if (my > this.y) {
          if (my < this.y + hitH / 2) {
            return 'water';   
          }
        }
      }
    }
    return false;
  }
  specialInteract() {
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }
    
    let amount = floor(random(1, 4));
    for (let i = 0; i < amount; i++) {
      let lx = this.x + random(-imgW * 0.35, imgW * 0.35);
      let ly = this.y - random(0, imgH * 0.4);
      let greenColor = color(random(30, 80), random(150, 220), random(30, 80)); 
      this.leaves.push(new LeafParticle(lx, ly, greenColor));
    }
  }
  interact(mx, my) {
    let hoverType = this.checkHover(mx, my);
    if (hoverType === 'special') {
      this.specialInteract(); 
    }
    if (hoverType === 'water') {
      this.water();
    }
    if (hoverType === 'water') {
      return true;
    } else if (hoverType === 'special') {
      return true;
    } else {
      return false;
    }
  }
  display() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
    for (let i = 0; i < this.leaves.length; i++) {
      this.leaves[i].display();
    }

    push();
    imageMode(CENTER);
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (this.health < 40) {
      let alphaValue = map(this.health, 40, 15, 255, 0);
      if (alphaValue < 0) { alphaValue = 0; }
      if (alphaValue > 255) { alphaValue = 255; }
      tint(255, alphaValue);
    }
    image(this.img, this.x, this.y, imgW, imgH);
    noTint();
    pop();
  }
}

class CherryTree {
  constructor(img, x, y, size) {
    this.name = 'CherryTree';
    this.img = img;
    this.x = x;
    this.y = y;
    this.size = size;
    this.health = 100; 
    this.particles = [];
    this.leaves = []; 
  }
  update() {
    // 全局未暂停时才掉血
    if (!isSystemPaused) {
      this.health = this.health - 0.02; 
      if (this.health < 0) {
        this.health = 0;
      }
    }

    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (this.health < 40) {
      if (this.health > 10) {
        if (random() < 0.2) {
          let numParticles = floor(random(2, 5));
          for (let k = 0; k < numParticles; k++) {
            let px = this.x + random(-imgW/2, imgW/2);
            let py = this.y + random(-imgH/2, imgH/2);
            this.particles.push(new AshParticle(px, py));
          }
        }
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
    for (let i = this.leaves.length - 1; i >= 0; i--) {
      this.leaves[i].update();
      if (this.leaves[i].isDead()) {
        this.leaves.splice(i, 1);
      }
    }
  }
  water() {
    this.health = this.health + 1; 
    if (this.health > 100) {
      this.health = 100;
    }
  }
  checkHover(mx, my) {
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }
    let hitW = imgW * 0.6;
    let hitH = imgH * 0.8;
    
    if (mx > this.x - hitW / 2) {
      if (mx < this.x + hitW / 2) {
        if (my > this.y - hitH / 2) {
          if (my <= this.y) {
            return 'special'; 
          }
        }
        if (my > this.y) {
          if (my < this.y + hitH / 2) {
            return 'water';   
          }
        }
      }
    }
    return false;
  }
  specialInteract() {
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }
    
    let amount = floor(random(1, 4));
    for (let i = 0; i < amount; i++) {
      let lx = this.x + random(-imgW * 0.35, imgW * 0.35);
      let ly = this.y - random(0, imgH * 0.4);
      let pinkColor = color(255, random(150, 190), random(180, 210)); 
      this.leaves.push(new LeafParticle(lx, ly, pinkColor));
    }
  }
  interact(mx, my) {
    let hoverType = this.checkHover(mx, my);
    if (hoverType === 'special') {
      this.specialInteract(); 
    }
    if (hoverType === 'water') {
      this.water();
    }
    if (hoverType === 'water') {
      return true;
    } else if (hoverType === 'special') {
      return true;
    } else {
      return false;
    }
  }
  display() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
    for (let i = 0; i < this.leaves.length; i++) {
      this.leaves[i].display();
    }

    push();
    imageMode(CENTER);
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (this.health < 40) {
      let alphaValue = map(this.health, 40, 15, 255, 0);
      if (alphaValue < 0) { alphaValue = 0; }
      if (alphaValue > 255) { alphaValue = 255; }
      tint(255, alphaValue);
    }
    image(this.img, this.x, this.y, imgW, imgH);
    noTint();
    pop();
  }
}

class MapleTree {
  constructor(img, x, y, size) {
    this.name = 'MapleTree';
    this.img = img;
    this.x = x;
    this.y = y;
    this.size = size;
    this.health = 100; 
    this.particles = [];
    this.leaves = []; 
  }
  update() {

    if (!isSystemPaused) {
      this.health = this.health - 0.02; 
      if (this.health < 0) {
        this.health = 0;
      }
    }

    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (this.health < 40) {
      if (this.health > 10) {
        if (random() < 0.2) {
          let numParticles = floor(random(2, 5));
          for (let k = 0; k < numParticles; k++) {
            let px = this.x + random(-imgW/2, imgW/2);
            let py = this.y + random(-imgH/2, imgH/2);
            this.particles.push(new AshParticle(px, py));
          }
        }
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
    for (let i = this.leaves.length - 1; i >= 0; i--) {
      this.leaves[i].update();
      if (this.leaves[i].isDead()) {
        this.leaves.splice(i, 1);
      }
    }
  }
  water() {
    this.health = this.health + 1; 
    if (this.health > 100) {
      this.health = 100;
    }
  }
  checkHover(mx, my) {
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }
    let hitW = imgW * 0.6;
    let hitH = imgH * 0.8;
    
    if (mx > this.x - hitW / 2) {
      if (mx < this.x + hitW / 2) {
        if (my > this.y - hitH / 2) {
          if (my <= this.y) {
            return 'special'; 
          }
        }
        if (my > this.y) {
          if (my < this.y + hitH / 2) {
            return 'water';   
          }
        }
      }
    }
    return false;
  }
  specialInteract() {
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }
    
    let amount = floor(random(1, 4));
    for (let i = 0; i < amount; i++) {
      let lx = this.x + random(-imgW * 0.35, imgW * 0.35);
      let ly = this.y - random(0, imgH * 0.4);
      let redColor = color(random(200, 255), random(30, 80), random(20, 50)); 
      this.leaves.push(new LeafParticle(lx, ly, redColor));
    }
  }
  interact(mx, my) {
    let hoverType = this.checkHover(mx, my);
    if (hoverType === 'special') {
      this.specialInteract(); 
    }
    if (hoverType === 'water') {
      this.water();
    }
    if (hoverType === 'water') {
      return true;
    } else if (hoverType === 'special') {
      return true;
    } else {
      return false;
    }
  }
  display() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
    for (let i = 0; i < this.leaves.length; i++) {
      this.leaves[i].display();
    }

    push();
    imageMode(CENTER);
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (this.health < 40) {
      let alphaValue = map(this.health, 40, 15, 255, 0);
      if (alphaValue < 0) { alphaValue = 0; }
      if (alphaValue > 255) { alphaValue = 255; }
      tint(255, alphaValue);
    }
    image(this.img, this.x, this.y, imgW, imgH);
    noTint();
    pop();
  }
}

class Flower {
  constructor(img, x, y, size, type = 'normal') {
    this.name = 'Flower';
    this.img = img;
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type; 
    this.health = 100; 
    this.particles = [];
    this.petals = []; 
    this.bees = [];   
  }
  update() {
    // 全局未暂停时才掉血
    if (!isSystemPaused) {
      this.health = this.health - 0.02; 
      if (this.health < 0) {
        this.health = 0;
      }
    }

    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (this.health < 40) {
      if (this.health > 10) {
        if (random() < 0.2) {
          let numParticles = floor(random(2, 5));
          for (let k = 0; k < numParticles; k++) {
            let px = this.x + random(-imgW/2, imgW/2);
            let py = this.y + random(-imgH/2, imgH/2);
            this.particles.push(new AshParticle(px, py));
          }
        }
      }
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].isDead()) {
        this.particles.splice(i, 1);
      }
    }
    for (let i = this.petals.length - 1; i >= 0; i--) {
      this.petals[i].update();
      if (this.petals[i].isDead()) {
        this.petals.splice(i, 1);
      }
    }
    for (let i = this.bees.length - 1; i >= 0; i--) {
      this.bees[i].update();
      if (this.bees[i].isDead()) {
        this.bees.splice(i, 1);
      }
    }
  }
  water() {
    this.health = this.health + 1; 
    if (this.health > 100) {
      this.health = 100;
    }
  }
  checkHover(mx, my) {
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }
    let hitW = imgW * 0.6;
    let hitH = imgH * 0.8;
    
    if (mx > this.x - hitW / 2) {
      if (mx < this.x + hitW / 2) {
        if (my > this.y - hitH / 2) {
          if (my <= this.y) {
            return 'special'; 
          }
        }
        if (my > this.y) {
          if (my < this.y + hitH / 2) {
            return 'water';   
          }
        }
      }
    }
    return false;
  }
  specialInteract() {
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }
    
    let amount = floor(random(1, 3));
    for (let i = 0; i < amount; i++) {
      let lx = this.x + random(-imgW * 0.25, imgW * 0.25);
      let ly = this.y - random(0, imgH * 0.3);
      let petalColor = color(random(220, 255), random(150, 220), random(50, 150)); 
      this.petals.push(new LeafParticle(lx, ly, petalColor, 0.7));
    }
    
    if (this.type !== 'sunflower') {
      if (this.bees.length < 3) {
        if (random() < 0.02) {
          let bx = this.x + random(-imgW * 0.2, imgW * 0.2);
          let by = this.y - random(0, imgH * 0.3);
          this.bees.push(new BeeParticle(bx, by));
        }
      }
    }
  }
  interact(mx, my) {
    let hoverType = this.checkHover(mx, my);
    if (hoverType === 'special') {
      this.specialInteract(); 
      if (this.type === 'sunflower') {
        if (isNight === true) {
          isNight = false;
        } else {
          isNight = true;
        }
      }
    }
    if (hoverType === 'water') {
      this.water();
    }
    if (hoverType === 'water') {
      return true;
    } else if (hoverType === 'special') {
      return true;
    } else {
      return false;
    }
  }
  display() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
    for (let i = 0; i < this.petals.length; i++) {
      this.petals[i].display();
    }

    push();
    imageMode(CENTER);
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (this.health < 40) {
      let alphaValue = map(this.health, 40, 15, 255, 0);
      if (alphaValue < 0) { alphaValue = 0; }
      if (alphaValue > 255) { alphaValue = 255; }
      tint(255, alphaValue);
    }
    image(this.img, this.x, this.y, imgW, imgH);
    noTint();
    pop();

    for (let i = 0; i < this.bees.length; i++) {
      this.bees[i].display();
    }
  }
}