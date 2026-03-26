/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new TeddyBearDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class TeddyBearDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.bearColor = color(158, 208, 236);
    this.strokeColor = color(60, 90, 120); 
    this.muzzleColor = color(218, 242, 255);
    this.time = 0;
    this.bounceY = 0;
    this.tiltAngle = 0;
    this.leftArmAngle = 0;
    this.rightArmAngle = 0;
    this.leftLegAngle = 0;
    this.rightLegAngle = 0;
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
    this.time += 0.05;
    this.bounceY = sin(this.time * 4) * 10;
    this.tiltAngle = sin(this.time * 2) * 0.1;
    this.leftArmAngle = sin(this.time * 2) * 0.5;
    this.rightArmAngle = cos(this.time * 2) * 0.4;
    this.leftLegAngle = sin(this.time * 2 + PI) * 0.2;
    this.rightLegAngle = cos(this.time * 2 + PI) * 0.2;
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️

    translate(0, this.bounceY);
    rotate(this.tiltAngle);
    scale(0.65); 

    stroke(this.strokeColor);
    strokeWeight(1.5);
    fill(this.bearColor);
    
    push();
    translate(-30, 90);
    rotate(this.leftLegAngle);
    ellipse(0, 10, 70, 90);
    pop();

    push();
    translate(30, 90);
    rotate(this.rightLegAngle);
    ellipse(0, 10, 70, 90);
    pop();
    
    ellipse(0, 40, 130, 150); 
    
    push();
    translate(-40, -10);
    rotate(this.leftArmAngle);
    ellipse(0, 30, 50, 100);
    pop();

    push();
    translate(40, -10);
    rotate(this.rightArmAngle);
    ellipse(0, 30, 50, 100);
    pop();
    
    ellipse(0, -60, 120, 110); 
    
    ellipse(-50, -110, 45, 45); 
    ellipse(50, -110, 45, 45);  
    
    fill(this.muzzleColor);
    ellipse(-50, -110, 30, 30); 
    ellipse(50, -110, 30, 30);  
    
    ellipse(0, -45, 70, 55); 
    
    noStroke();
    fill(30); 
    ellipse(-25, -70, 12, 12); 
    ellipse(25, -70, 12, 12);  
    
    ellipse(0, -55, 25, 18);  
    
    noFill();
    stroke(30);      
    strokeWeight(2); 
    line(0, -46, 0, -30);           
    arc(0, -30, 30, 15, 0, PI);     

    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    this.drawReferenceShapes()

    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/