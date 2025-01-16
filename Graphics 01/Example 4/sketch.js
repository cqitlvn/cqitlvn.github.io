function setup() {
  createCanvas(400,400);
}

function draw() {
  background('navy');
  
  fill('green');
  strokeWeight(5);
  stroke('white');
  circle(200,200,200);
  
  fill('red');
  rotate(5.976); 
  star(130,252, 40, 100, 5);
  
}


//star code by someone else online 
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}