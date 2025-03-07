let polySynth;
let reverb, filter;
let activeKeys = {};
let currentOctave = 4;

const keyMap = {
  'a': 'C', 'w': 'C#', 's': 'D', 'e': 'D#', 'd': 'E', 'f': 'F', 't': 'F#',
  'g': 'G', 'y': 'G#', 'h': 'A', 'u': 'A#', 'j': 'B', 'k': 'C5'
};

let filterSlider, reverbSlider;
let waveformButtons = {};
let currentWaveform = 'sine';

function setup() {
  createCanvas(900, 600);
  textFont('Poppins');
  
  reverb = new Tone.Reverb({ decay: 2, wet: 0.3 }).toDestination();
  filter = new Tone.Filter({ frequency: 1000, type: "lowpass" }).connect(reverb);
  
  polySynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'sine' },
    envelope: { attack: 0.1, decay: 0.3, sustain: 0.4, release: 0.8 }
  }).connect(filter);
  
  createUIControls();
}

function createUIControls() {
  filterSlider = createSlider(100, 5000, 1000, 10).position(width/2 - 150, height - 180).style('width', '300px');
  filterSlider.input(() => filter.frequency.value = filterSlider.value());
  
  reverbSlider = createSlider(0, 1, 0.3, 0.01).position(width/2 - 150, height - 130).style('width', '300px');
  reverbSlider.input(() => reverb.wet.value = reverbSlider.value());
  
  const waveforms = ['sine', 'square', 'sawtooth', 'triangle'];
  const buttonWidth = 100;
  waveforms.forEach((waveform, index) => {
    waveformButtons[waveform] = createButton(waveform);
    waveformButtons[waveform].position(width/2 - 200 + index * buttonWidth, height - 80);
    waveformButtons[waveform].style('width', '90px').style('height', '40px').style('border-radius', '20px');
    waveformButtons[waveform].style('background-color', waveform === currentWaveform ? '#FFB6C1' : '#FFE4E1');
    waveformButtons[waveform].mousePressed(() => changeWaveform(waveform));
  });
}

function changeWaveform(waveform) {
  currentWaveform = waveform;
  Object.keys(waveformButtons).forEach(w => {
    waveformButtons[w].style('background-color', w === currentWaveform ? '#FFB6C1' : '#FFE4E1');
  });
  polySynth.set({ oscillator: { type: waveform } });
}

function draw() {
  background('#FAE3D9');
  drawTitle();
  drawKeyboard();
  fill('#FFAFCC');
  rect(50, height - 220, width - 100, 190, 10);
  fill(80);
  textSize(16);
  text("Filter", width/2, height - 190);
  text(filterSlider.value() + " Hz", width/2 + 180, height - 180);
  text("Reverb", width/2, height - 140);
  text(Math.round(reverbSlider.value() * 100) + "%", width/2 + 180, height - 130);
  text("Wave type", width/2, height - 100);
}

function drawTitle() {
  fill('#FFB6C1');
  rect(0, 0, width, 80);
  fill('#6A0572');
  textSize(38);
  text("Synthesizer", width/2, 50);
}

function drawKeyboard() {
  const keyWidth = 60, keyHeight = 220;
  const startX = width/2 - (Object.keys(keyMap).length * keyWidth) / 2;
  const startY = 100;
  Object.keys(keyMap).forEach((key, index) => {
    fill(activeKeys[key] ? '#FFAFCC' : '#FFFFFF');
    stroke('#B5838D');
    rect(startX + index * keyWidth, startY, keyWidth - 5, keyHeight, 5);
    fill('#6A0572');
    textSize(24);
    text(keyMap[key], startX + index * keyWidth + keyWidth/2, startY + 40);
    textSize(16);
    text(key, startX + index * keyWidth + keyWidth/2, startY + keyHeight - 20);
  });
}

function keyPressed() {
  const k = key.toLowerCase();
  if (keyMap[k] && !activeKeys[k]) {
    playNote(k);
    return false;
  }
  return true;
}

function keyReleased() {
  const k = key.toLowerCase();
  if (keyMap[k]) {
    releaseNote(k);
    return false;
  }
  return true;
}

function playNote(k) {
  let note = keyMap[k];
  let octave = currentOctave;
  
  if (note === 'C5') {
    octave = currentOctave + 1;  // Move C5 to the next octave
  } else if (!note.includes('#')) {
    note += octave;  // Append octave only for natural notes
  } else {
    note += octave;  // Ensure sharps also get the correct octave
  }

  polySynth.triggerAttack(note);
  activeKeys[k] = true;
}

function releaseNote(k) {
  let note = keyMap[k];
  let octave = currentOctave;

  if (note === 'C5') {
    octave = currentOctave + 1;
  } else if (!note.includes('#')) {
    note += octave;
  } else {
    note += octave;
  }

  polySynth.triggerRelease(note);
  activeKeys[k] = false;
}
