let items = [];

let imgSky, imgGrass, imgPond, imgCherry, imgMaple, imgTree1, imgTree2;
let imgCat, imgSquirrel, imgSunflower, imgWildflower;

function preload() {
  imgSky = loadImage('sky.png'); 
  imgGrass = loadImage('lawn.png');
  imgPond = loadImage('pond.png');
  
  imgCherry = loadImage('cherry.png');
  imgMaple = loadImage('maple.png');
  imgTree1 = loadImage('tree1.png'); 
  imgTree2 = loadImage('tree2.png');
  imgCat = loadImage('cat.png');
  imgSquirrel = loadImage('squirrel.png');
  imgSunflower = loadImage('sunflower.png');
  imgWildflower = loadImage('flower.png');
}

function setup() {
  createCanvas(1500, 800);
  
  items.push(new GardenItem(imgSky, width / 2, height / 2, 1600));

  items.push(new GardenItem(imgGrass, width / 2, height / 2 + 150, 1500));
  items.push(new GardenItem(imgPond, 950, 580, 480));
  
  items.push(new GardenItem(imgTree1, 80, 280, 650)); 
  items.push(new GardenItem(imgTree2, 1000, 280, 650)); 
  items.push(new GardenItem(imgTree1, 1350, 280, 650)); 
  items.push(new GardenItem(imgCherry, 600, 250, 950));
  items.push(new GardenItem(imgMaple, 1250, 400, 650));
  
  items.push(new GardenItem(imgSunflower, 150, 380, 300));
  items.push(new GardenItem(imgWildflower, 1250, 680, 500));
  items.push(new GardenItem(imgWildflower, 900, 720, 350));
  
  items.push(new GardenItem(imgCat, 400, 500, 600));
  items.push(new GardenItem(imgSquirrel, 750, 420, 200));
}

function draw() {
  background(30); 
  
  let totalHealth = 0;
  let count = 0;

  for (let i = 0; i < items.length; i++) {
    items[i].update();
    items[i].display();
    
    if (!items[i].isBackgroundElement) {
      totalHealth += items[i].health;
      count++;
    }
  }
  
  let avgHealth = count > 0 ? totalHealth / count : 0;
  
  drawGlobalGrid(avgHealth);
  
  fill(255);
  noStroke();
  textAlign(CENTER);
  text("Click on any element to care for it.", width / 2, height - 30);
  textAlign(LEFT);
  text("System Health: " + floor(avgHealth) + "%", 20, 30);
}

function mousePressed() {
  for (let i = 0; i < items.length; i++) {
    items[i].care(mouseX, mouseY);
  }
}

function drawGlobalGrid(avgHealth) {
  if (avgHealth >= 40) return; 

  let maxDist = dist(0, 0, width / 2, height / 2) + 100; 
  let safeRadius = map(avgHealth, 40, 0, maxDist, -300); 
  
  let gridSize = 30; 
  rectMode(CENTER);
  
  for (let x = -gridSize; x <= width + gridSize; x += gridSize) {
    for (let y = -gridSize; y <= height + gridSize; y += gridSize) {
      let d = dist(x, y, width / 2, height / 2);
      
      if (d >= safeRadius) { 
        let gridAlpha = map(d - safeRadius, 0, 200, 40, 255);
        gridAlpha = constrain(gridAlpha, 0, 255);
        
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
    this.x += this.vx;
    this.y += this.vy;
    this.life -= random(2, 4); 
  }

  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.life);
    rectMode(CENTER);
    rect(this.x, this.y, this.size, this.size);
  }

  isDead() {
    return this.life <= 0;
  }
}

class GardenItem {
  constructor(img, x, y, size) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.size = size;
    this.health = 100 + random(-5, 5); 
    this.isBackgroundElement = (img === imgGrass || img === imgSky);
    this.particles = []; 
  }

  update() {
    if (!this.isBackgroundElement) {
      this.health -= 0.01; 
      if (this.health < 0) {
        this.health = 0;
      }

      let imgW = this.size;
      let imgH = this.img.width > 0 ? this.size * (this.img.height / this.img.width) : this.size;

      if (this.health < 40 && this.health > 10) {
        if (random() < 0.2) { 
          let numParticles = floor(random(2, 5));
          for (let k = 0; k < numParticles; k++) {
            let px = this.x + random(-imgW / 2, imgW / 2); 
            let py = this.y + random(-imgH / 2, imgH / 2); 
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

  care(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    if (d < this.size / 2) {
      this.health += 25; 
      if (this.health > 100) {
        this.health = 100;
      }
    }
  }

  display() {
    for (let p of this.particles) {
      p.display();
    }

    push();
    imageMode(CENTER);
    
    let imgW = this.size;
    let imgH = this.size;
    if (this.img.width > 0) {
      imgH = this.size * (this.img.height / this.img.width);
    }

    if (!this.isBackgroundElement && this.health < 40) {
      let alphaValue = map(this.health, 40, 15, 255, 0);
      alphaValue = constrain(alphaValue, 0, 255);
      tint(255, alphaValue); 
    }

    image(this.img, this.x, this.y, imgW, imgH);
    
    noTint(); 
    pop();
  }
}