let c; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  c = color('black'); 
  background(240, 240, 240);

}

function draw() {
  
  noStroke();
  fill(240,240,240);
  rect(0,0,31,283);
  
  fill('red');
  square(3, 3, 25);
  
  fill('orange')
  square(3, 31, 25);
  
  fill('yellow')
  square(3, 59, 25);
  
  fill('green')
  square(3, 87, 25);
  
  fill('cyan')
  square(3, 115, 25);
  
  fill('blue')
  square(3, 143, 25);
  
  fill('magenta')
  square(3, 171, 25);
  
  fill('brown')
  square(3, 199, 25);
  
  stroke(1);
  strokeWeight(.1);
  fill('white')
  square(3, 227, 25);
  
  noStroke();
  fill('black')
  square(3, 255, 25);
  
  strokeWeight(15);
}

function mousePressed() {
  if(mouseX > 3 && mouseX < 28) {  
    if(mouseY > 3 && mouseY < 28) {
      c = color('red');
    } else if(mouseY > 31 && mouseY < 56) {
      c = color('orange');
    } else if(mouseY > 59 && mouseY < 84) {
      c = color('yellow');
    } else if(mouseY > 87 && mouseY < 112) {
      c = color('green');
    } else if(mouseY > 115 && mouseY < 140) {
      c = color('cyan');
    } else if(mouseY > 143 && mouseY < 168) {
      c = color('blue');
    } else if(mouseY > 171 && mouseY < 196) {
      c = color('magenta');
    } else if(mouseY > 199 && mouseY < 224) {
      c = color('brown');
    } else if(mouseY > 227 && mouseY < 252) {
      c = color('white');
    } else if(mouseY > 255 && mouseY < 280) {
      c = color('black');
    }
  }
}

function mouseDragged() {
  stroke(c);
  line(pmouseX, pmouseY, mouseX, mouseY);
}