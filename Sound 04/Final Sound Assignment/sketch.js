let bugs = [];
let squishCount = 0;
let gameTime = 30; // 30 seconds countdown
let gameRunning = true;
let lastTimeCheck = 0;
let bugSpeed = 1;
let restartButton;

// Image variables
let bugImage1;
let bugImage2;
let squishImage;

function preload() {
  // Load images from the "media" folder
  bugImage1 = loadImage('Bug1.png');
  bugImage2 = loadImage('Bug2.png');
  squishImage = loadImage('Squish.png');
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);
  
  // Create initial bugs - reduced to a more manageable number
  for (let i = 0; i < 8; i++) {
    bugs.push(new Bug());
  }
  
  lastTimeCheck = millis();
  
  // Create restart button (initially hidden)
  restartButton = createButton('Restart Game');
  restartButton.position(width/2 - 50, height/2 + 80);
  restartButton.size(100, 40);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
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
      restartButton.show(); // Show restart button when game ends
      bugs = []; // Clear all bugs when game ends
    }
    
    // Update and display all bugs
    for (let i = bugs.length - 1; i >= 0; i--) {
      let shouldRemove = bugs[i].update();
      if (shouldRemove) {
        bugs.splice(i, 1);
      } else {
        bugs[i].display();
      }
    }
    
    // Add more bugs if needed - maintain fewer bugs on screen
    if (bugs.length < 6) {
      bugs.push(new Bug());
    }
  } else {
    // Display game over
    fill(0);
    textSize(40);
    textAlign(CENTER);
    text("GAME OVER", width/2, height/2);
    text("Bugs Squished: " + squishCount, width/2, height/2 + 50);
    
    // No bugs are displayed after game over as the bugs array is cleared
  }
  
  // Display the score and timer
  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Bugs Squished: " + squishCount, 20, 30);
  text("Time Left: " + gameTime, 20, 60);
}

// Restart game function
function restartGame() {
  // Reset game variables
  bugs = [];
  squishCount = 0;
  gameTime = 30;
  gameRunning = true;
  bugSpeed = 1;
  lastTimeCheck = millis();
  
  // Create new bugs - reduced number
  for (let i = 0; i < 8; i++) {
    bugs.push(new Bug());
  }
  
  // Hide restart button
  restartButton.hide();
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
    this.size = 100; // **Increased bug size**
    this.shouldRemove = false; // Flag to indicate if this bug should be removed

    // New: Add a small delay before changing direction again
    this.directionChangeCooldown = millis();
  }
  
  update() {
    if (this.squished) {
      // Once squished, the bug stays in place and is removed after 1 second
      if (millis() - this.squishTime > 1000) {
        return true; // Remove this bug
      }
      return false; // Keep this squished bug
    } else {
      // Move in current direction
      this.x += cos(this.angle) * this.speed;
      this.y += sin(this.angle) * this.speed;

      // Change direction if near edge
      if (this.x < 40 || this.x > width - 40 || this.y < 40 || this.y > height - 40) {
        this.angle = random(TWO_PI);
      }

      // **Fix: Prevent sporadic spinning by limiting direction changes**
      if (millis() - this.directionChangeCooldown > 1000) { // Change direction every second at most
        if (random(100) < 5) { // Lower chance of direction change
          this.angle = random(TWO_PI);
        }
        this.directionChangeCooldown = millis();
      }
      
      // Animation timing
      this.frameCounter++;
      if (this.frameCounter >= this.animationSpeed) {
        this.animationFrame = (this.animationFrame + 1) % 2;
        this.frameCounter = 0;
      }
    }
    return false; // Keep this bug
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    // Rotate based on the bug's angle
    rotate(this.angle + HALF_PI);
    
    if (!this.squished) {
      // Draw the appropriate animation frame for live bug
      if (this.animationFrame === 0) {
        image(bugImage1, 0, 0, this.size, this.size);
      } else {
        image(bugImage2, 0, 0, this.size, this.size);
      }
    } else {
      // Draw squished bug in the same direction it was facing
      image(squishImage, 0, 0, this.size, this.size);
    }
    
    pop();
  }
  
  checkSquish(mouseX, mouseY) {
    if (!this.squished) {
      let d = dist(mouseX, mouseY, this.x, this.y);
      if (d < this.size / 2) {
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
      
      // Increase bug speed more significantly after each squish
      bugSpeed += 0.25; 
      
      // Add a new bug after a delay (but only one instead of two)
      if (gameRunning) {
        setTimeout(() => {
          if (gameRunning) { // Only add if game is still running
            bugs.push(new Bug());
          }
        }, 2000);
      }
    }
  }
}
