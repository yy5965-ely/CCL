let myPlant;
let imgPlant;

function preload() {
  imgPlant = loadImage('cherry.png');
}

function setup() {
  createCanvas(1500, 800);
  myPlant = new Plant(width / 2, height / 2);
}

function draw() {
  background(30); 
  
  myPlant.update();
  myPlant.display();
  
  fill(255);
  noStroke();
  textAlign(CENTER);
  text("Click the plant to care for it.", width/2, height - 30);
  text("Health: " + floor(myPlant.health), width/2, height - 10);
}

function mousePressed() {
  myPlant.care(mouseX, mouseY);
}

class Plant {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 500;
    this.health = 100;
  }

  update() {
    this.health -= 0.05; 
    if (this.health < 0) {
      this.health = 0;
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
    push();
    let picAlpha = map(this.health, 0, 100, 0, 1); 
    drawingContext.globalAlpha = picAlpha; 
    
    imageMode(CENTER);
    let imgW = this.size;
    let imgH = this.size;
    if (imgPlant.width > 0) {
      imgH = this.size * (imgPlant.height / imgPlant.width);
    }
    image(imgPlant, this.x, this.y, imgW, imgH);
    pop();

    let grid = map(this.health, 80, 0, 0, 255);
    grid = constrain(grid, 0, 255); 

    if (grid > 0 && imgPlant.width > 0) {
      fill(150, 150, 150, grid);
      stroke(80, 80, 80, grid);
      rectMode(CENTER);
      
      let boxSize = map(this.health, 80, 0, 20, 8);
      boxSize = constrain(boxSize, 8, 20);

      for (let i = -imgW / 2; i < imgW / 2; i += boxSize) {
        for (let j = -imgH / 2; j < imgH / 2; j += boxSize) {
          let px = floor(map(i, -imgW / 2, imgW / 2, 0, imgPlant.width));
          let py = floor(map(j, -imgH / 2, imgH / 2, 0, imgPlant.height));
          
          let c = imgPlant.get(px, py);
          
          if (c && c[3] > 50 && (c[0] < 240 || c[1] < 240 || c[2] < 240)) {
            let offsetX = random(-1.5, 1.5);
            let offsetY = random(-1.5, 1.5);
            rect(this.x + i + offsetX, this.y + j + offsetY, boxSize * 0.8);
          }
        }
      }
    }
  }
}