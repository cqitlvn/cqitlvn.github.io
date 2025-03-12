let osc, env, filter, noise, modulator, reverb;
let meowTriggered = false;
let closedImg, openImg;
let meowDuration = 1200;
let volumeSlider, reverbSlider;
let uiBoxX, uiBoxY, uiBoxWidth, uiBoxHeight;
let sliderClicked = false;
let cuteFont; 

function preload() {
  closedImg = loadImage("closed.png");
  openImg = loadImage("open.png");
  cuteFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceSansPro-Regular.otf');
}

function setup() {
  createCanvas(600, 750); 

  background(245, 230, 255); 

  osc = new p5.Oscillator('triangle');

  env = new p5.Envelope();
  env.setADSR(0.1, 0.3, 0.4, 0.5);
  env.setRange(0.7, 0);

  modulator = new p5.Oscillator('sine');
  modulator.freq(5); 
  modulator.amp(2);
  modulator.start();

  filter = new p5.Filter('bandpass');
  filter.freq(800);
  filter.res(6);

  noise = new p5.Noise('pink');
  noise.amp(0.03);

  reverb = new p5.Reverb();

  osc.disconnect();
  osc.connect(filter);
  noise.disconnect();
  noise.connect(filter);

  uiBoxWidth = 280;
  uiBoxHeight = 100;
  uiBoxX = (width - uiBoxWidth) / 2;
  uiBoxY = height - 160;

  volumeSlider = createSlider(0, 1, 0.7, 0.01);
  volumeSlider.position(uiBoxX + 40, uiBoxY + 35);
  volumeSlider.style('width', '200px');
  
  reverbSlider = createSlider(0, 5, 0, 0.1); 
  reverbSlider.position(uiBoxX + 40, uiBoxY + 75);
  reverbSlider.style('width', '200px');

  noLoop();
}

function draw() {
  background(245, 230, 255); 

  if (meowTriggered) {
    image(openImg, 100, 100, 400, 400);
  } else {
    image(closedImg, 100, 100, 400, 400);
  }

  fill(255, 200, 220);
  rect(uiBoxX, uiBoxY, uiBoxWidth, uiBoxHeight, 15);

  textFont(cuteFont);
  fill(80, 80, 80);
  textSize(20); 
  textAlign(CENTER);
  text("Volume", uiBoxX + uiBoxWidth / 2, uiBoxY + 25);
  text("Reverb", uiBoxX + uiBoxWidth / 2, uiBoxY + 65);

  textFont(cuteFont);
  textSize(28); 
  textAlign(CENTER);
  fill(100, 60, 100); 
  text("Click for meow!", width / 2, 50);
}

function mousePressed() {
  if (mouseX > uiBoxX + 40 && mouseX < uiBoxX + 240 && mouseY > uiBoxY + 30 && mouseY < uiBoxY + 90) {
    sliderClicked = true;
    return;
  }
  sliderClicked = false;

  meowTriggered = true;
  redraw();

  let volume = volumeSlider.value();
  let reverbLevel = reverbSlider.value();

  osc.amp(volume);
  noise.amp(volume * 0.1);

  if (reverbLevel === 0) {
    reverb.drywet(0); 
  } else {
    reverb.process(osc, reverbLevel, 2 + reverbLevel);
    reverb.drywet(1);
  }

  noise.start();
  filter.freq(300); 
  setTimeout(() => {
    noise.stop();
    filter.freq(800); 
  }, 200);

  osc.freq(250);
  osc.start();
  osc.freq(400, 0.3); 

  
  setTimeout(() => {
    osc.freq(220, 0.4);
    filter.freq(500 );
  }, 700);

  
  env.play(osc);

  setTimeout(() => {
    osc.stop();
    meowTriggered = false;
    redraw();
  }, meowDuration);
}