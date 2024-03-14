let skeles = [];

//MIDI
let myOutput; //the variable in charge of out MIDI output

//relating to weather
let weatherData;
let lat;
let lon;
let overTime;
let skeleIndex = 0;
let threshold;

function preload() {
  lat = 41.878113;
  lon = -87.629799;
  // let url =
  //   "http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=" + lat + "&lon=" + lon + "&appid=87fb783a54817f1793f0556477730e7c";
  // let url = "http://api.openweathermap.org/data/2.5/air_pollution/history?lat=" + lat + "&lon=" + lon + "&start=1687791600&end=1687964400&appid=87fb783a54817f1793f0556477730e7c";

  // started the date a day earlier to better build up to the climactic aqi 5.
  // NYC 6/7/23: 1686150000
  // NYC 6/8/23: 1686236400
  // NYC 6/10/23: 1686409200
  const START_TIME = 1686150000
  const END_TIME = 1686409200
  
  const url =
    `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=40.73&lon=-73.9&start=${START_TIME}&end=${END_TIME}&appid=87fb783a54817f1793f0556477730e7c`; 
    // example NYC 6/8/23 to 6/10/23
  console.log(url);
  weatherData = loadJSON(url);
}

function parseData() {
  overTime = weatherData.list; // data points we have for our given window of time
  console.log("overtime", overTime);
  for (let i = 0; i < overTime.length; i++) {
    const aqi = weatherData.list[i].main.aqi;
    console.log(aqi);
    skeles.push(new Skele(width / 2, -500, 400, aqi));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  //skeles.push(new Skele(0, 50, 300, 1));

  console.log(weatherData);
  parseData();

  threshold = (3 * height) / 4;

  WebMidi.enable()
    .then(onEnabled)
    .catch((err) => alert(err));

  i = 0;
}

function draw() {
  background(249, 239, 207); // off white

  // every 2 seconds, trigger the next skele to fall by increasing the skeleIndex and setting skele.isFalling to true
  if (frameCount % 120 == 0 && skeleIndex < overTime.length) {
    skeles[skeleIndex].isFalling = true;
    skeleIndex++;
  }

  skeles.forEach((skele) => {
    if (skele.isFalling) {
      skele.draw();
      skele.update();
    }

    if (skele.location.y > height + 500) {
      skeles.shift();
    }

    // trigger the Midi notes to play when the skele keypoints pass the threshold
    for (let i = 0; i < skele.keyPoints.length; i++) {
      let p = skele.keyPoints[i];
      if (p.y > threshold && !skele.keyPointsPlayed[i]) {
        skele.keyPointsPlayed[i] = true;
        //myOutput.playNote(int(map(p.x, 0, width, 0, 108)), 1, {duration: 1000, rawAttack: 100});
        // console.log(int(map(p.x, 0, width, 0, 108)));
        // remember to pass ints to midi
      }
    }
  });

  strokeWeight(2);
  //stroke(255);
  stroke(17, 9, 2);
  line(0, threshold, width, threshold);

  drawMidiZones();
}

function drawMidiZones() {
  for (let x = 0; x < width; x += width / 108) {
    strokeWeight(0.5);
    //stroke(255);
    line(x, 0, x, height);
  }
}

function randomDistortion(scale) {
  let randomDistortion = map(random(-scale, scale), -5, 5, -6, 6);
  return randomDistortion * randomDistortion * randomDistortion;
}

function windowResized() {
  background(249, 239, 207); // off white
  resizeCanvas(windowWidth, windowHeight);
}

class Skele {
  // x, y represents a center point
  constructor(x, y, size, distortScale) {
    this.size = size;
    this.location = createVector(x, y);
    this.vel = createVector(0, 3);
    this.accel = createVector(0, 0.001);
    this.distortScale = distortScale;
    this.isFalling = false;

    // hands down
    this.head = createVector(
      x + randomDistortion(distortScale),
      y - 0.29 * size + randomDistortion(distortScale)
    );

    this.shoulderLeft = createVector(
      x - 0.1 * size + randomDistortion(distortScale),
      y - 0.2 * size + randomDistortion(distortScale)
    );
    this.shoulderRight = createVector(
      x + 0.1 * size + randomDistortion(distortScale),
      y - 0.2 * size + randomDistortion(distortScale)
    );

    this.elbowLeft = createVector(
      x - 0.15 * size + randomDistortion(distortScale),
      y - 0.06 * size + randomDistortion(distortScale)
    );
    this.elbowRight = createVector(
      x + 0.15 * size + randomDistortion(distortScale),
      y - 0.06 * size + randomDistortion(distortScale)
    );

    this.handLeft = createVector(
      x - 0.15 * size + randomDistortion(distortScale),
      y + 0.125 * size + randomDistortion(distortScale)
    );
    this.handRight = createVector(
      x + 0.15 * size + randomDistortion(distortScale),
      y + 0.125 * size + randomDistortion(distortScale)
    );

    this.waistLeft = createVector(
      x - 0.075 * size + randomDistortion(distortScale),
      y + 0.1 * size + randomDistortion(distortScale)
    );
    this.waistRight = createVector(
      x + 0.075 * size + randomDistortion(distortScale),
      y + 0.1 * size + randomDistortion(distortScale)
    );

    this.kneeLeft = createVector(
      x + -0.09 * size + randomDistortion(distortScale),
      y + 0.285 * size + randomDistortion(distortScale)
    );
    this.kneeRight = createVector(
      x + 0.09 * size + randomDistortion(distortScale),
      y + 0.285 * size + randomDistortion(distortScale)
    );

    this.footLeft = createVector(
      x - 0.09 * size + randomDistortion(distortScale),
      y + 0.5 * size + randomDistortion(distortScale)
    );
    this.footRight = createVector(
      x + 0.09 * size + randomDistortion(distortScale),
      y + 0.5 * size + randomDistortion(distortScale)
    );

    this.neck = p5.Vector.lerp(this.shoulderLeft, this.shoulderRight, 0.5);

    this.keyPoints = [
      this.head,
      this.shoulderLeft,
      this.shoulderRight,
      this.elbowLeft,
      this.elbowRight,
      this.handLeft,
      this.handRight,
      this.waistLeft,
      this.waistRight,
      this.kneeLeft,
      this.kneeRight,
      this.footLeft,
      this.footRight,
    ];

    this.keyPointsPlayed = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ];

    this.keyPoints = [
      this.head,
      this.shoulderLeft,
      this.elbowLeft,
      this.handLeft,
      this.shoulderRight,
      this.elbowRight,
      this.handRight,
      this.waistLeft,
      this.waistRight,
      this.kneeLeft,
      this.footLeft,
      this.kneeRight,
      this.footRight,
    ];
  }

  draw() {
    //colorMode(HSB);
    //let hue = 0;
    // draw connecting lines
    strokeWeight(2);
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
      strokeWeight(this.size / 50);
      //stroke(hue, 50, 100);
      if (this.keyPointsPlayed[i]) {
        stroke(255, 50, 50);
      } else {
        stroke(17, 9, 2);
      }
      point(p.x, p.y);
      //hue += 360 / this.keyPoints.length;
    }
  }

  update() {
    this.keyPoints.forEach((p) => {
      p.y += this.vel.y;
      this.vel.add(this.accel);
    });
    this.neck = p5.Vector.lerp(this.shoulderLeft, this.shoulderRight, 0.5);
  }

  updateSize(newSize) {
    this.size = newSize;
    this.head = createVector(this.location.x, this.location.y - 0.27 * newSize);

    this.shoulderLeft = createVector(
      this.location.x - 0.1 * newSize,
      this.location.y - 0.2 * newSize
    );
    this.shoulderRight = createVector(
      this.location.x + 0.1 * newSize,
      this.location.y - 0.2 * newSize
    );

    this.elbowLeft = createVector(
      this.location.x - 0.15 * newSize,
      this.location.y - 0.335 * newSize
    );
    this.elbowRight = createVector(
      this.location.x + 0.15 * newSize,
      this.location.y - 0.335 * newSize
    );

    this.handLeft = createVector(
      this.location.x - 0.15 * newSize,
      this.location.y - 0.5 * newSize
    );
    this.handRight = createVector(
      this.location.x + 0.15 * newSize,
      this.location.y - 0.5 * newSize
    );

    this.waistLeft = createVector(
      this.location.x - 0.075 * newSize,
      this.location.y + 0.07 * newSize
    );
    this.waistRight = createVector(
      this.location.x + 0.075 * newSize,
      this.location.y + 0.07 * newSize
    );

    this.kneeLeft = createVector(
      this.location.x + -0.09 * newSize,
      this.location.y + 0.265 * newSize
    );
    this.kneeRight = createVector(
      this.location.x + 0.09 * newSize,
      this.location.y + 0.265 * newSize
    );

    this.footLeft = createVector(
      this.location.x - 0.09 * newSize,
      this.location.y + 0.5 * newSize
    );
    this.footRight = createVector(
      this.location.x + 0.09 * newSize,
      this.location.y + 0.5 * newSize
    );

    this.neck = p5.Vector.lerp(this.shoulderLeft, this.shoulderRight, 0.5);

    this.keyPoints = [
      this.head,
      this.shoulderLeft,
      this.elbowLeft,
      this.handLeft,
      this.shoulderRight,
      this.elbowRight,
      this.handRight,
      this.waistLeft,
      this.waistRight,
      this.kneeLeft,
      this.footLeft,
      this.kneeRight,
      this.footRight,
    ];
  }
}

function onEnabled() {
  console.log("WebMIDI Enabled");

  // Inputs
  WebMidi.inputs.forEach((input) =>
    console.log("Input: ", input.manufacturer, input.name)
  );

  // Outputs
  WebMidi.outputs.forEach((output) =>
    console.log("Output: ", output.manufacturer, output.name)
  );

  //Looking at the first output available to us
  console.log(WebMidi.outputs[0]);

  //assign that output as the one we will use later
  myOutput = WebMidi.outputs[0];
}
