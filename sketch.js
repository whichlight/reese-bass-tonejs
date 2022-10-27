//touch interaction var
var noises = [];
var started = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  //disable default touch events for mobile
  var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart", pdefault, false);
  el.addEventListener("touchend", pdefault, false);
  el.addEventListener("touchcancel", pdefault, false);
  el.addEventListener("touchleave", pdefault, false);
  el.addEventListener("touchmove", pdefault, false);

  stroke(255);
  strokeWeight(10);
  line(0, height / 1.6, width, height / 1.6);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function pdefault(e) {
  e.preventDefault();
}

function draw() {
  render();
}

function update() {}

function render() {}

function initSynth() {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
    if (iOS) {
      window.addEventListener(
        "touchend",
        function () {
          var buffer = context.createBuffer(1, 1, 22050);
          var source = context.createBufferSource();
          source.buffer = buffer;
          source.connect(context.destination);
          source.start(0);
        },
        false
      );
    }
  } catch (err) {
    alert("web audio not supported");
  }

  if (typeof context != "undefined") {
    startSynth();
  }
}

var touchStarted = function () {
  if (!started) {
    initSynth();
  }
  console.log(touchY);
  background(0);
  stroke(255);
  strokeWeight(10);
  line(0, touchY, width, touchY);

  f = map(touchY, height, 0, 30, 200);
  synth.triggerAttack(f);
  console.log(f);

  return false;
};

var touchMoved = function () {
  background(0);
  stroke(255);
  strokeWeight(10);
  line(0, touchY, width, touchY);
  f = map(touchY, height, 0, 30, 200);

  detune = map(touchX, 0, width, 0, 50);

  synth.detune.value = detune;
  synth.triggerAttack(f);
  synth2.triggerAttack(f);
  console.log(f);

  return false;
};

var touchEnded = function () {
  console.log("ended");

  synth.triggerRelease();
  synth2.triggerRelease();
  return false;
};

var startSynth = function () {
  Tone.Master.volume.value = -10;

  synth = new Tone.MonoSynth({
    detune: 25,
    filterEnvelope: {
      attack: 0,
      decay: 0,
      sustain: 0,
      release: 0,
      baseFrequency: 200,
    },
  }).toMaster();

  synth2 = new Tone.MonoSynth({
    detune: 25,
    filterEnvelope: {
      attack: 0,
      decay: 0,
      sustain: 0,
      release: 0,
      baseFrequency: 200,
    },
  }).toMaster();

  synth.detune.value = 25;
};
