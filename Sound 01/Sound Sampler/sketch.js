let sounds = {};
let buttons = [];
let reverb;
let reverbSlider;
let soundNames = ["Meow", "Woof", "Moo", "Squeak", "Caw", "Baaaa"];
let currentReverbValue = 0;

function preload() {
    soundNames.forEach(name => {
        sounds[name] = loadSound(`${name}.mp3`);
    });
}

function setup() {
    createCanvas(500, 400);
    background(240);
    textAlign(CENTER, CENTER);
    
    let yOffset = 70;
    soundNames.forEach((name, index) => {
        let btn = createButton(name);
        btn.position(50, yOffset + index * 50);
        btn.size(100, 30);
        btn.style("background-color", "#4CAF50");
        btn.style("color", "white");
        btn.style("border", "none");
        btn.style("border-radius", "5px");
        btn.style("cursor", "pointer");
        btn.mousePressed(() => playSound(name));
        buttons.push(btn);
    });
    
    reverb = new p5.Reverb();
    
    reverbSlider = createSlider(0, 5, 0, 0.1);
    reverbSlider.position(200, height/2);
    reverbSlider.style("width", "200px");
    reverbSlider.input(updateReverb); // Only update when slider changes
    
    let label = createP("Control the reverb!");
    label.position(210, height/2 - 35);
    label.style("font-size", "16px");
    label.style("color", "#333");
    
    let title = createP("Sound Sampler :)");
    title.position(width/2 - 90, 1);
    title.style("font-size", "24px");
    title.style("font-weight", "bold");
    
    // Initialize reverb
    updateReverb();
}

function updateReverb() {
    currentReverbValue = reverbSlider.value();
    // Set the reverb properties globally
    reverb.set(currentReverbValue, 2);
}

function playSound(name) {
    if (sounds[name].isPlaying()) {
        sounds[name].stop();
    }
    
    // Connect to reverb if needed
    if (currentReverbValue > 0) {
        sounds[name].disconnect();
        sounds[name].connect(reverb);
    } else {
        sounds[name].disconnect();
        sounds[name].connect();
    }
    
    sounds[name].play();
}

function draw() {
    background(220);
    fill(50);
    textSize(18);
    text("^ Click a button to play a sound", width / 2 - 28, height - 20);
    
    // No need to dynamically update reverb on every frame
}