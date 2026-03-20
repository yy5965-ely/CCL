let song
let amplitude

function preload(){
  beat = loadSound("assets/beat.mp3")
  song = loadSound("assets/song.mp3")
}
function setup() {
  createCanvas(400, 400);
  amplitude = new p5.Amplitude();
}

function draw() {
  background(220);
  let level = amplitude.getLevel();

  let dia = map(level, 0, 1, 40, 300)

  circle(200, 200, level * 100)

  let vol = map(mouseX, 0, width, 0.0, 1.0);
  song.setVolume(vol)

  let draw = map(mouseY, 0, height, 0.5, 2.0)
  song.setRate(rate)
}

function mousePressed(){
  if (!song.isPlaying()){
    song.play()
  }


}
