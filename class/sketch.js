let myball

function setup() {
  createCanvas(400, 400);
  myball = new ball()
}

function draw() {
  background(220);
  myball.display()
}

class ball {
  constructor(){
    this.x = 200
    this.y = 200
    this.dia = 50
  }
  display(){
    circle(this.x, this.y, this.dia)
  }
}