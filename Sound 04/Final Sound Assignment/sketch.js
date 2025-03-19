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

// Audio variables
let audioContext;
let isMusicPlaying = false;
let activeOscillators = [];
let musicSpeedFactor = 1;
let musicTimeout;
let melodyNotes = [220, 330, 440, 550, 660, 880]; // Sample notes

// Sound effect variables
let gunSound;
let wrongSound;
let clockSound;
let clockPlayed = false; // Prevent multiple plays of clock sound

function preload() {
  // Load images from the "media" folder
  bugImage1 = loadImage('Bug1.png');
  bugImage2 = loadImage('Bug2.png');
  squishImage = loadImage('Squish.png');

  // Load sound effects
  gunSound = loadSound('gun.mp3');
  wrongSound = loadSound('wrong.mp3');
  clockSound = loadSound('clock.mp3');
}

function setup() {
  createCanvas(800, 600);
  imageMode(CENTER);

  for (let i = 0; i < 8; i++) {
    bugs.push(new Bug());
  }

  lastTimeCheck = millis();

  restartButton = createButton('Restart Game');
  restartButton.position(width / 2 - 50, height / 2 + 80);
  restartButton.size(100, 40);
  restartButton.mousePressed(restartGame);
  restartButton.hide();

  startMusic(); // Start background music when game starts
}

function draw() {
  background(220);

  if (gameRunning) {
    if (millis() - lastTimeCheck >= 1000) {
      gameTime--;
      lastTimeCheck = millis();
      musicSpeedFactor = map(gameTime, 30, 0, 1, 3); // Increase speed as time decreases

      // Play clock sound at 10 seconds remaining
      if (gameTime === 10 && !clockPlayed) {
        clockSound.play();
        clockPlayed = true; // Prevent multiple plays
      }
    }

    if (gameTime <= 0) {
      gameRunning = false;
      gameTime = 0;
      restartButton.show();
      bugs = [];
      stopMusic(); // Stop music when the game ends
    }

    for (let i = bugs.length - 1; i >= 0; i--) {
      let shouldRemove = bugs[i].update();
      if (shouldRemove) {
        bugs.splice(i, 1);
      } else {
        bugs[i].display();
      }
    }

    if (bugs.length < 6) {
      bugs.push(new Bug());
    }
  } else {
    fill(0);
    textSize(40);
    textAlign(CENTER);
    text("GAME OVER", width / 2, height / 2);
    text("Bugs Squished: " + squishCount, width / 2, height / 2 + 50);
  }

  fill(0);
  textSize(24);
  textAlign(LEFT);
  text("Bugs Squished: " + squishCount, 20, 30);
  text("Time Left: " + gameTime, 20, 60);
}

function restartGame() {
  bugs = [];
  squishCount = 0;
  gameTime = 30;
  gameRunning = true;
  bugSpeed = 1;
  lastTimeCheck = millis();
  clockPlayed = false; // Reset clock sound flag

  for (let i = 0; i < 8; i++) {
    bugs.push(new Bug());
  }

  restartButton.hide();
  startMusic(); // Restart music when game restarts
}

class Bug {
  constructor() {
    this.x = random(50, width - 50);
    this.y = random(50, height - 50);
    this.angle = random(TWO_PI);
    this.speed = bugSpeed;
    this.animationFrame = floor(random(2));
    this.animationSpeed = 10;
    this.frameCounter = 0;
    this.squished = false;
    this.squishTime = 0;
    this.size = 100;
    this.shouldRemove = false;
    this.directionChangeCooldown = millis();
  }

  update() {
    if (this.squished) {
      if (millis() - this.squishTime > 1000) {
        return true;
      }
      return false;
    } else {
      this.x += cos(this.angle) * this.speed;
      this.y += sin(this.angle) * this.speed;

      if (this.x < 40 || this.x > width - 40 || this.y < 40 || this.y > height - 40) {
        this.angle = random(TWO_PI);
      }

      if (millis() - this.directionChangeCooldown > 1000) {
        if (random(100) < 5) {
          this.angle = random(TWO_PI);
        }
        this.directionChangeCooldown = millis();
      }

      this.frameCounter++;
      if (this.frameCounter >= this.animationSpeed) {
        this.animationFrame = (this.animationFrame + 1) % 2;
        this.frameCounter = 0;
      }
    }
    return false;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle + HALF_PI);

    if (!this.squished) {
      if (this.animationFrame === 0) {
        image(bugImage1, 0, 0, this.size, this.size);
      } else {
        image(bugImage2, 0, 0, this.size, this.size);
      }
    } else {
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

  for (let i = bugs.length - 1; i >= 0; i--) {
    if (bugs[i].checkSquish(mouseX, mouseY)) {
      squishCount++;
      squishHappened = true;
      bugSpeed += 0.25;

      // Play squish sound effect
      gunSound.play();

      if (gameRunning) {
        setTimeout(() => {
          if (gameRunning) {
            bugs.push(new Bug());
          }
        }, 2000);
      }
    }
  }

  // If no bug was squished, play the "wrong" sound effect
  if (!squishHappened) {
    wrongSound.play();
  }
}

// ====== BACKGROUND MUSIC FUNCTIONS ======

function startMusic() {
  if (!isMusicPlaying) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    isMusicPlaying = true;
    playLoopingMelody();
  }
}

function stopMusic() {
  isMusicPlaying = false;
  activeOscillators.forEach(osc => {
    osc.stop();
    osc.disconnect();
  });
  activeOscillators = [];
  if (musicTimeout) {
    clearTimeout(musicTimeout);
  }
}

function playLoopingMelody() {
  if (!isMusicPlaying) return;

  let time = audioContext.currentTime;
  let interval = 0.3 / musicSpeedFactor;

  for (let i = 0; i < 20; i++) {
    let osc = audioContext.createOscillator();
    let gainNode = audioContext.createGain();
    let freq = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];

    osc.frequency.setValueAtTime(freq, time + i * interval);
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    osc.start(time + i * interval);
    osc.stop(time + i * interval + 0.25);
    activeOscillators.push(osc);
  }

  musicTimeout = setTimeout(playLoopingMelody, 6000 / musicSpeedFactor);
}
