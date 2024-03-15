let skeles = [];
let zones = [];

//MIDI
let myOutput; //the variable in charge of out MIDI output

//relating to weather
let weatherData;
let lat;
let lon;
let overTime;
let skeleIndex = 0;
let threshold;
let fallRate = 260; // how many frames
let fallRateMin = 150;
let fallRateDelta = 2;
let pieceDuration = 0;
let startColor;
let endColor;
let bgColor;

function preload() {
  lat = 41.878113;
  lon = -87.629799;
  // let url =
  //   "http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=" + lat + "&lon=" + lon + "&appid=87fb783a54817f1793f0556477730e7c";
  // let url = "http://api.openweathermap.org/data/2.5/air_pollution/history?lat=" + lat + "&lon=" + lon + "&start=1687791600&end=1687964400&appid=87fb783a54817f1793f0556477730e7c";

  // started the date a day earlier to better build up to the climactic aqi 5.
  // 1/2 day == 43200
  // 1 day == 86400
  // NYC 6/7/23 12AM: 1686110400
  // NYC 6/7/23: 1686150000
  // NYC 6/8/23: 1686236400
  // NYC 6/9/23 11AM: 1686322800
  // NYC 6/9/23 11PM: 1686366000
  // NYC 6/10/23: 1686409200
  const START_TIME = 1686110400;
  const END_TIME = 1686366000;

  const url = `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=40.73&lon=-73.9&start=${START_TIME}&end=${END_TIME}&appid=87fb783a54817f1793f0556477730e7c`;
  // example NYC 6/8/23 to 6/10/23
  //console.log(url);
  weatherData = loadJSON(url);
}

function parseData() {
  overTime = weatherData.list; // data points we have for our given window of time
  //console.log("overtime", overTime);
  for (let i = 0; i < overTime.length; i++) {
    const aqi = weatherData.list[i].main.aqi;
    //console.log(aqi);
    const size = min(width / 1.25, height / 1.25);
    const xVariation = random(-width / 15, width / 15);
    skeles.push(new Skele(width / 2 + xVariation, -size * 1.5, size, aqi));
  }

  let d = fallRate;
  // calculate duration of piece based on how many skeletons and
  for (let i = 0; i < overTime.length; i++) {
    if (d > fallRateMin) {
      pieceDuration += d;
      d -= fallRateDelta;
    } else {
      pieceDuration += fallRateMin;
    }
  }
}

function setup() {
  createCanvas(1080, 1920);
  background(0);
  frameRate(60);

  startColor = color(255);
  endColor = color(217, 108, 5);

  //console.log(weatherData);
  parseData();

  // threshold = (3 * height) / 4;
  threshold = height - width / 80;

  WebMidi.enable()
    .then(onEnabled)
    .catch((err) => alert(err));

  for (let i = 0; i < 108; i++) {
    let x = map(i, 0, 108, 0, width);
    zones.push(new MidiZones(x));
  }

  noLoop();
}

function draw() {
  // set the background by interpolating between a start color (white) and an end color (always-already-apocalypse orange) based on the elapsed time and total duration of the sketch
  let colorLerpAmount = map(frameCount, 0, pieceDuration, 0, 1);
  bgColor = lerpColor(startColor, endColor, colorLerpAmount);
  background(bgColor);

  // every X seconds, trigger the next skele to fall by increasing the skeleIndex and setting skele.isFalling to true
  if (frameCount % fallRate == 0 && skeleIndex < overTime.length) {
    skeles[skeleIndex].isFalling = true;
    skeleIndex++;
    //console.log(fallRate);

    // decreasing fallRate actually makes them fall more frequently...
    if (fallRate > fallRateMin) {
      fallRate -= fallRateDelta;
    }
  }

  zones.forEach((z) => {
    z.draw();
    z.update();
  });

  skeles.forEach((skele) => {
    if (skele.isFalling) {
      skele.draw();
      skele.update();
    }

    if (skele.location.y > height * 2) {
      skeles.shift();
    }

    // trigger the Midi notes to play when the skele keypoints pass the threshold
    for (let i = 0; i < skele.keyPoints.length; i++) {
      let p = skele.keyPoints[i];
      if (p.y > threshold && !skele.keyPointsPlayed[i]) {
        skele.keyPointsPlayed[i] = true;

        let zoneIndex = floor(map(p.x, 0, width, 0, 107, true));
        //console.log(zoneIndex)
        zones[zoneIndex].alpha = 200;

        const NOTE_TO_PLAY = int(map(p.x, 0, width, 0, 108, true));

        //console.log(NOTE_TO_PLAY);

        // play note if MIDI is connected
        if (myOutput) {
          myOutput.playNote(NOTE_TO_PLAY, 1, {
            duration: 1000,
            rawAttack: 100,
          });
        }
      }
    }
  });
}

function drawMidiLines() {
  for (let x = 0; x < width; x += width / 108) {
    strokeWeight(0.5);
    //stroke(255);
    line(x, 0, x, height);
  }
}

function randomDistortion(scale) {
  let randomDistortion = map(random(-scale, scale), -5, 5, -8, 8);
  return randomDistortion * randomDistortion * randomDistortion;
}

// function windowResized() {
//   background(bgColor);
//   resizeCanvas(windowWidth, windowHeight);
// }

class Skele {
  // x, y represents a center point
  constructor(x, y, size, distortScale) {
    this.size = size;
    this.location = createVector(x, y);
    this.vel = createVector(0, 1);
    this.accel = createVector(0, 0.003);
    this.distortScale = distortScale;
    this.isFalling = false;

    // hands down
    this.head = createVector(x + randomDistortion(distortScale), y - 0.29 * size + randomDistortion(distortScale));

    this.shoulderLeft = createVector(x - 0.1 * size + randomDistortion(distortScale), y - 0.2 * size + randomDistortion(distortScale));
    this.shoulderRight = createVector(x + 0.1 * size + randomDistortion(distortScale), y - 0.2 * size + randomDistortion(distortScale));

    this.elbowLeft = createVector(x - 0.15 * size + randomDistortion(distortScale), y - 0.06 * size + randomDistortion(distortScale));
    this.elbowRight = createVector(x + 0.15 * size + randomDistortion(distortScale), y - 0.06 * size + randomDistortion(distortScale));

    this.handLeft = createVector(x - 0.15 * size + randomDistortion(distortScale), y + 0.125 * size + randomDistortion(distortScale));
    this.handRight = createVector(x + 0.15 * size + randomDistortion(distortScale), y + 0.125 * size + randomDistortion(distortScale));

    this.waistLeft = createVector(x - 0.075 * size + randomDistortion(distortScale), y + 0.1 * size + randomDistortion(distortScale));
    this.waistRight = createVector(x + 0.075 * size + randomDistortion(distortScale), y + 0.1 * size + randomDistortion(distortScale));

    this.kneeLeft = createVector(x + -0.09 * size + randomDistortion(distortScale), y + 0.285 * size + randomDistortion(distortScale));
    this.kneeRight = createVector(x + 0.09 * size + randomDistortion(distortScale), y + 0.285 * size + randomDistortion(distortScale));

    this.footLeft = createVector(x - 0.09 * size + randomDistortion(distortScale), y + 0.5 * size + randomDistortion(distortScale));
    this.footRight = createVector(x + 0.09 * size + randomDistortion(distortScale), y + 0.5 * size + randomDistortion(distortScale));

    this.neck = p5.Vector.lerp(this.shoulderLeft, this.shoulderRight, 0.5);

    this.keyPoints = [this.head, this.shoulderLeft, this.shoulderRight, this.elbowLeft, this.elbowRight, this.handLeft, this.handRight, this.waistLeft, this.waistRight, this.kneeLeft, this.kneeRight, this.footLeft, this.footRight];

    this.keyPointsPlayed = [false, false, false, false, false, false, false, false, false, false, false, false, false];

    this.keyPoints = [this.head, this.shoulderLeft, this.elbowLeft, this.handLeft, this.shoulderRight, this.elbowRight, this.handRight, this.waistLeft, this.waistRight, this.kneeLeft, this.footLeft, this.kneeRight, this.footRight];
  }

  draw() {
    // draw connecting lines
    strokeWeight(3);
    stroke(17, 9, 2);
    beginShape(LINES);

    // head
    vertex(this.head.x, this.head.y);
    vertex(this.neck.x, this.neck.y);

    // left arm
    vertex(this.shoulderLeft.x, this.shoulderLeft.y);
    vertex(this.elbowLeft.x, this.elbowLeft.y);

    vertex(this.elbowLeft.x, this.elbowLeft.y);
    vertex(this.handLeft.x, this.handLeft.y);

    // right arm

    vertex(this.shoulderRight.x, this.shoulderRight.y);
    vertex(this.elbowRight.x, this.elbowRight.y);

    vertex(this.elbowRight.x, this.elbowRight.y);
    vertex(this.handRight.x, this.handRight.y);

    // torso
    vertex(this.shoulderLeft.x, this.shoulderLeft.y);
    vertex(this.waistLeft.x, this.waistLeft.y);

    vertex(this.waistLeft.x, this.waistLeft.y);
    vertex(this.waistRight.x, this.waistRight.y);

    vertex(this.waistRight.x, this.waistRight.y);
    vertex(this.shoulderRight.x, this.shoulderRight.y);

    vertex(this.shoulderRight.x, this.shoulderRight.y);
    vertex(this.shoulderLeft.x, this.shoulderLeft.y);

    // left leg
    vertex(this.waistLeft.x, this.waistLeft.y);
    vertex(this.kneeLeft.x, this.kneeLeft.y);

    vertex(this.kneeLeft.x, this.kneeLeft.y);
    vertex(this.footLeft.x, this.footLeft.y);

    // right leg
    vertex(this.waistRight.x, this.waistRight.y);
    vertex(this.kneeRight.x, this.kneeRight.y);

    vertex(this.kneeRight.x, this.kneeRight.y);
    vertex(this.footRight.x, this.footRight.y);

    endShape();

    // draw keypoints
    for (let i = 0; i < this.keyPoints.length; i++) {
      let p = this.keyPoints[i];
      strokeWeight(this.size / 40);
      //stroke(hue, 50, 100);
      if (this.keyPointsPlayed[i]) {
        stroke(217, 108, 5);
      } else {
        stroke(17, 9, 2);
      }
      point(p.x, p.y);
    }
  }

  update() {
    this.keyPoints.forEach((p) => {
      if (p.y < height - this.size / 80) {
        p.y += this.vel.y;
        this.vel.add(this.accel);
      }
    });
    this.neck = p5.Vector.lerp(this.shoulderLeft, this.shoulderRight, 0.5);
  }

  updateSize(newSize) {
    this.size = newSize;
    this.head = createVector(this.location.x, this.location.y - 0.27 * newSize);

    this.shoulderLeft = createVector(this.location.x - 0.1 * newSize, this.location.y - 0.2 * newSize);
    this.shoulderRight = createVector(this.location.x + 0.1 * newSize, this.location.y - 0.2 * newSize);

    this.elbowLeft = createVector(this.location.x - 0.15 * newSize, this.location.y - 0.335 * newSize);
    this.elbowRight = createVector(this.location.x + 0.15 * newSize, this.location.y - 0.335 * newSize);

    this.handLeft = createVector(this.location.x - 0.15 * newSize, this.location.y - 0.5 * newSize);
    this.handRight = createVector(this.location.x + 0.15 * newSize, this.location.y - 0.5 * newSize);

    this.waistLeft = createVector(this.location.x - 0.075 * newSize, this.location.y + 0.07 * newSize);
    this.waistRight = createVector(this.location.x + 0.075 * newSize, this.location.y + 0.07 * newSize);

    this.kneeLeft = createVector(this.location.x + -0.09 * newSize, this.location.y + 0.265 * newSize);
    this.kneeRight = createVector(this.location.x + 0.09 * newSize, this.location.y + 0.265 * newSize);

    this.footLeft = createVector(this.location.x - 0.09 * newSize, this.location.y + 0.5 * newSize);
    this.footRight = createVector(this.location.x + 0.09 * newSize, this.location.y + 0.5 * newSize);

    this.neck = p5.Vector.lerp(this.shoulderLeft, this.shoulderRight, 0.5);

    this.keyPoints = [this.head, this.shoulderLeft, this.elbowLeft, this.handLeft, this.shoulderRight, this.elbowRight, this.handRight, this.waistLeft, this.waistRight, this.kneeLeft, this.footLeft, this.kneeRight, this.footRight];
  }
}

class MidiZones {
  constructor(x) {
    this.position = createVector(x, 0);
    this.alpha = 0;
  }

  draw() {
    fill(230, 108, 5, this.alpha);
    noStroke();
    rect(this.position.x, 0, width / 108, height);
  }

  update() {
    if (this.alpha > 0) {
      this.alpha -= 4;
    }
  }
}

function onEnabled() {
  console.log("WebMIDI Enabled");

  // Inputs
  WebMidi.inputs.forEach((input) => console.log("Input: ", input.manufacturer, input.name));

  // Outputs
  WebMidi.outputs.forEach((output) => console.log("Output: ", output.manufacturer, output.name));

  //Looking at the first output available to us
  console.log(WebMidi.outputs[0]);

  //assign that output as the one we will use later
  myOutput = WebMidi.outputs[0];
}

// UTILITIES

// select MIDI channel from dropdown
let midiChannel;

// Function to update the global variable when an option is selected
function updateMidiChannel() {
  midiChannel = midiChannelSelect.value;
  myOutput = WebMidi.outputs[midiChannel];
  console.log("Selected MIDI Channel: " + midiChannel);
}

// Add event listener to the dropdown menu
midiChannelSelect.addEventListener("change", updateMidiChannel);

start.addEventListener("click", function () {
  loop();
  utilities.style.display = "none";
});
