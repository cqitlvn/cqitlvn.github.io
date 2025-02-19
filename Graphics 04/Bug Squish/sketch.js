let bugs = [];
let squishCount = 0;
let gameTime = 30; // 30 seconds countdown
let gameRunning = true;
let lastTimeCheck = 0;
let bugSpeed = 1;

// Image variables
let bugImage1;
let bugImage2;
let squishImage;

function preload() {
  bugImage1 = loadImage('Bug1.png');
  bugImage2 = loadImage('Bug2.png');
  squishImage = loadImage('Squish.png');
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  
  // Create initial bugs
  for (let i = 0; i < 8; i++) {
    bugs.push(new Bug());
  }
  
  lastTimeCheck = millis();
}

function draw() {
  background(220);
  
  // Game mechanics
  if (gameRunning) {
    // Update timer
    if (millis() - lastTimeCheck >= 1000) {
      gameTime--;
      lastTimeCheck = millis();
    }
    
    // Check if game is over
    if (gameTime <= 0) {
      gameRunning = false;
      gameTime = 0;
    }
    
    // Update and display all bugs
    for (let i = bugs.length - 1; i >= 0; i--) {
      bugs[i].update();
      bugs[i].display();
    }
    
    // Add more bugs if needed
    if (bugs.length < 5) {
      bugs.push(new Bug());
    }
  } else {
    // Display game over
    fill(0);
    textSize(40);
    textAlign(CENTER);
    text("GAME OVER", width/2, height/2);
    text("Bugs Squished: " + squishCount, width/2, height/2 + 50);
  }
  
  // Display the score and timer
  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Bugs Squished: " + squishCount, 20, 30);
  text("Time Left: " + gameTime, 20, 60);
}

// Bug class
class Bug {
  constructor() {
    // Random starting position (not too close to edges)
    this.x = random(50, width - 50);
    this.y = random(50, height - 50);
    
    // Random direction
    this.angle = random(TWO_PI);
    this.speed = bugSpeed;
    
    // Animation related
    this.animationFrame = floor(random(2));
    this.animationSpeed = 10;
    this.frameCounter = 0;
    
    // Status
    this.squished = false;
    this.squishTime = 0;
    this.size = 40; // Size of hit area
  }
  
  update() {
    if (!this.squished) {
      // Move in current direction
      this.x += cos(this.angle) * this.speed;
      this.y += sin(this.angle) * this.speed;
      
      // Change direction if near edge
      if (this.x < 20 || this.x > width - 20 || this.y < 20 || this.y > height - 20) {
        this.angle = random(TWO_PI);
      }
      
      // Random direction change occasionally
      if (random(100) < 1) {
        this.angle = random(TWO_PI);
      }
      
      // Animation timing
      this.frameCounter++;
      if (this.frameCounter >= this.animationSpeed) {
        this.animationFrame = (this.animationFrame + 1) % 2;
        this.frameCounter = 0;
      }
    } else {
      // Check if squished bug should be removed
      if (millis() - this.squishTime > 1000) {
        return true; // Remove this bug
      }
    }
    return false; // Keep this bug
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    if (!this.squished) {
      // Rotate based on movement direction
      rotate(this.angle);
      
      // Flip image if moving left
      if (cos(this.angle) < 0) {
        scale(1, -1);
      }
      
      // Draw the appropriate animation frame
      if (this.animationFrame === 0) {
        image(bugImage1, 0, 0, this.size, this.size);
      } else {
        image(bugImage2, 0, 0, this.size, this.size);
      }
    } else {
      // Draw squished bug
      image(squishImage, 0, 0, this.size, this.size);
    }
    
    pop();
  }
  
  checkSquish(mouseX, mouseY) {
    if (!this.squished) {
      let d = dist(mouseX, mouseY, this.x, this.y);
      if (d < this.size/2) {
        this.squished = true;
        this.squishTime = millis();
        return true;
      }
    }
    return false;
  }
}

function mousePressed() {
  if (!gameRunning) return;
  
  let squishHappened = false;
  
  // Check each bug for squishing
  for (let i = bugs.length - 1; i >= 0; i--) {
    if (bugs[i].checkSquish(mouseX, mouseY)) {
      squishCount++;
      squishHappened = true;
      
      // Remove the squished bug after a delay (handled in update method)
      setTimeout(() => {
        bugs.splice(i, 1);
      }, 1000);
      
      // Increase bug speed after each squish
      bugSpeed += 0.2;
      
      // Create a new bug to replace squished one
      setTimeout(() => {
        bugs.push(new Bug());
      }, 2000);
    }
  }
  
  // If player missed all bugs
  if (!squishHappened) {
    // Optional: penalize misses or add feedback
  }
}