
function setup() {
  createCanvas(400, 200);
}

function draw() {
  background('black');
  
  noStroke();
  
  
  //pacman
  fill('yellow');
  arc(100, 100, 160, 160, PI + PI/4, PI - PI/4);
  
  //ghost
  fill('red');
  circle(290,100,160);
  rect(210, 100, 160, 80);
  
  fill('white');
  circle(251, 100, 50);
  circle(329, 100, 50);
  
  fill('blue');
  circle(251, 100, 30);
  circle(329, 100, 30);

}