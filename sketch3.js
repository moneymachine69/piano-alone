let skeles = [];

//MIDI
let myOutput; //the variable in charge of out MIDI output

//relating to weather
let weatherData;
let lat;
let lon;
let aqi;
let overTime;

let threshold;

let i;

function preload(){
  lat = 41.878113;
  lon = -87.629799;
  // let url =
  //   "http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=" + lat + "&lon=" + lon + "&appid=87fb783a54817f1793f0556477730e7c";
  // let url = "http://api.openweathermap.org/data/2.5/air_pollution/history?lat=" + lat + "&lon=" + lon + "&start=1687791600&end=1687964400&appid=87fb783a54817f1793f0556477730e7c";
  let url = "http://api.openweathermap.org/data/2.5/air_pollution/history?lat=40.73&lon=-73.9&start=1686236400&end=1686409200&appid=87fb783a54817f1793f0556477730e7c"; // example NYC 6/8/23 to 6/10/23
  console.log(url);
  weatherData = loadJSON(url);

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  
  skeles.push(new Skele(0, 50, 300, 1));

  console.log(weatherData);
  parseData();

  threshold = 3*height/4;

  WebMidi
  .enable()
  .then(onEnabled)
  .catch(err => alert(err));

  i= 0;
}

function draw() {
  background(249, 239, 207); // off white

  
  skeles.forEach((skele) => {
      skele.draw();
      skele.update();
      if(skele.location.y > height + 500) {
        skeles.shift();
      }
      for(let i = 0; i < skele.keyPoints.length; i++){

        let p = skele.keyPoints[i];
          if(p.y > threshold && !skele.keyPointsPlayed[i] ){
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
  line(0, threshold, width, threshold)

  for(let x = 0; x < width; x+=width/108) {
    strokeWeight(0.5);
    //stroke(255);
    line(x, 0, x, height);
  }
}

function mousePressed() {
  if (i < (overTime.length - 1)){
    skeles.push(
      // new Skele((windowWidth/overTime.length)*(i), 0, true, overTime[i].main.aqi)
      // );
      new Skele(windowWidth/2, 0, 300, overTime[i].main.aqi)
     );
    console.log(i);
    i++;
    }
  else{
    skeles.push(
      new Skele((windowWidth/overTime.length)*(i), 0, 300, overTime[i].main.aqi)
      );
    console.log(i);
    i=0;
  }
}


function randomDistortion(scale) {
  let randomDistortion = map(random(-scale, scale), -5, 5, -6, 6);

  // if (randomDistortion < 0) {
  //   return randomDistortion * randomDistortion * randomDistortion;
  // }
  return randomDistortion * randomDistortion * randomDistortion;
}

function windowResized() {
  background(249, 239, 207); // off white
  resizeCanvas(windowWidth, windowHeight);
}

function parseData() {
  aqi = weatherData.list[0].main.aqi;
  overTime = weatherData.list; // data points we have for our given window of time
  console.log(overTime);
}

class Skele {
  // x, y represents a center point
  constructor(x, y, size, distortScale) {
    this.size = size;
    this.location = createVector(x, y);
    this.vel = createVector(0, 3);
    this.accel = createVector(0, 0.001);
    this.distortScale = distortScale;

    // hands up, max vertical dimension
    // this.head = createVector(x, y - 0.29 * size);

    // this.shoulderLeft = createVector(x - 0.1 * size, y - 0.2 * size);
    // this.shoulderRight = createVector(x + 0.1 * size, y - 0.2 * size);

    // this.elbowLeft = createVector(x - 0.15 * size, y - 0.335 * size);
    // this.elbowRight = createVector(x + 0.15 * size, y - 0.335 * size);

    // this.handLeft = createVector(x - 0.15 * size, y - 0.5 * size);
    // this.handRight = createVector(x + 0.15 * size, y - 0.5 * size);

    // this.waistLeft = createVector(x - 0.075 * size, y + 0.07 * size);
    // this.waistRight = createVector(x + 0.075 * size, y + 0.07 * size);

    // this.kneeLeft = createVector(x + -0.09 * size, y + 0.265 * size);
    // this.kneeRight = createVector(x + 0.09 * size, y + 0.265 * size);

    // this.footLeft = createVector(x - 0.09 * size, y + 0.5 * size);
    // this.footRight = createVector(x + 0.09 * size, y + 0.5 * size);

    // this.neck = p5.Vector.lerp(this.shoulderLeft, this.shoulderRight, 0.5);

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

    this.keyPoints = [this.head, this.shoulderLeft, this.elbowLeft, this.handLeft, this.shoulderRight, this.elbowRight, this.handRight, this.waistLeft, this.waistRight, this.kneeLeft, this.footLeft, this.kneeRight, this.footRight];

    this.keyPointsPlayed = [false,false,false,false,false,false,false,false,false,false,false,false,false]

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
    for(let i = 0; i < this.keyPoints.length; i++){
      let p = this.keyPoints[i];
      strokeWeight(this.size / 50);
      //stroke(hue, 50, 100);
      if (this.keyPointsPlayed[i]){stroke(255, 50, 50);}else{stroke(17, 9, 2);}
      point(p.x, p.y);
      //hue += 360 / this.keyPoints.length;
    };

    // draw center point
    // stroke(255, 0, 0);
    // strokeWeight(this.size / 15);
    // point(this.location.x, this.location.y);
  }

  update() {
    this.keyPoints.forEach(p => {
      p.y+=this.vel.y;
      this.vel.add(this.accel);
    })
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

function onEnabled() {
  console.log("WebMIDI Enabled");
  
  // Inputs
  WebMidi.inputs.forEach(input => console.log("Input: ",input.manufacturer, input.name));
  
  // Outputs
  WebMidi.outputs.forEach(output => console.log("Output: ",output.manufacturer, output.name));
  
  //Looking at the first output available to us
  console.log(WebMidi.outputs[0]);

  //assign that output as the one we will use later
  myOutput = WebMidi.outputs[0];
  
}