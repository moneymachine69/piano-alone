let skeles = [];

//MIDI
let myOutput; //the variable in charge of out MIDI output

//relating to weather
let weatherVariables= new Array();
let weatherData;
let lat;
let lon;
let pressure; //hPa (around 1k usually)
let humidity; //%
let windSpeed; //meter/sec
let windDir; //degrees 360
let clouds; //%
//UTC
let unixDT;
let unixSunrise;
let unixSunset;
//kelvin
let temp;
let feelsLike;
let tempMin;
let tempMax;

let threshold;

function preload(){
  lat = 41.878113;
  lon = -87.629799;
  let url =
    "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=87fb783a54817f1793f0556477730e7c";
  weatherData = loadJSON(url);

}

function setup() {
  createCanvas(1080, 1920);
  background(0);
  skeles.push(new Skele(0, 50, false));

  console.log(weatherData);
  parseData();
  mapData();

  threshold = 3*height/4;

  WebMidi
  .enable()
  .then(onEnabled)
  .catch(err => alert(err));
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
          
            const NOTE_TO_PLAY = int(map(p.x, 0, width, 0, 108, true))
            // myOutput.playNote(NOTE_TO_PLAY, 1, {duration: 500, rawAttack: 80});
            console.log(NOTE_TO_PLAY);
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
  //   skeles.push(new SkeleRandom(mouseX, mouseY));
  skeles.push(new Skele(mouseX, mouseY, true));
}

// setInterval(function(){
//   skeles.push(new Skele(random(width/6, 8*width/10), -500, true));
// }, 2200)

// function windowResized() {
//   background(249, 239, 207); // off white
//   resizeCanvas(windowWidth, windowHeight);
// }
//

function parseData() {
  pressure = weatherData.main.pressure; 
  humidity = weatherData.main.humidity; 
  windSpeed = weatherData.wind.speed; 
  windDir = weatherData.wind.deg; 
  clouds = weatherData.clouds.all;
  unixDT = weatherData.dt;
  unixSunrise = weatherData.sunrise;
  unixSunset = weatherData.sunset;
  temp = weatherData.main.temp;
  feelsLike = weatherData.main.feels_like;
  tempMin = weatherData.main.temp_min;
  tempMax = weatherData.main.temp_max;
}

function mapData(){
  const maxValue = 500
  humidity = map(humidity, 0, 100, 0, maxValue);
  clouds = map(clouds, 0, 100, 0, maxValue);
  pressure = map(pressure, 990, 1030, 0, maxValue);
  windDir = map(windDir, -360, 360, 0, maxValue);
  windSpeed = map(windSpeed, 0, 30, 0, maxValue); //beaufort scale converted to m/s
  temp = map(temp, 243, 333, 0, maxValue);
  tempMax = map(tempMax, 243, 333, 0, maxValue);
  tempMin = map(tempMin, 243, 333, 0, maxValue);
  feelsLike = map(feelsLike, 243, 333, 0, maxValue);
  //add to the weather array
  weatherVariables.push(humidity, clouds, pressure, windDir, windSpeed, temp, tempMax, tempMin, feelsLike);
  console.log(weatherVariables);
}

class Skele {
  constructor(_x, _y, _random) {
    // base size of skeleton on smaller screen dimension
    this.size = 400;
    this.location = createVector(_x, _y);
    this.vel = createVector(0, 3);
    this.accel = createVector(0, 0.001);
    this.crumpleFactor = random(.175, 3);

    if (_random) {
      this.size*=1.5;
      this.head = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4));
      this.shoulderLeft = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4)
      );
      this.elbowLeft = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4)
      );
      this.handLeft = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4)
      );
      this.shoulderRight = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4)
      );
      this.elbowRight = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4)
      );
      this.handRight = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4)
      );
      this.waistLeft = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4)
      );
      this.waistRight = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4)
      );
      this.kneeLeft = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4)
      );
      this.footLeft = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4)
      );
      this.kneeRight = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4)
      );
      this.footRight = createVector(
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.x - this.size/4),
        (weatherVariables[int(random(8))]/this.crumpleFactor) + (this.location.y - this.size/4)
      );
    } else {
      this.head = createVector(this.size / 2, 0);
      this.shoulderLeft = createVector((2 * this.size) / 5, this.size / 15);
      this.elbowLeft = createVector((2 * this.size) / 7, this.size / 7);
      this.handLeft = createVector((2 * this.size) / 7, (2 * this.size) / 7);
      this.shoulderRight = createVector((3 * this.size) / 5, this.size / 15);
      this.elbowRight = createVector((5 * this.size) / 7, this.size / 7);
      this.handRight = createVector((5 * this.size) / 7, (2 * this.size) / 7);
      this.waistLeft = createVector((3 * this.size) / 7, this.size / 3);
      this.waistRight = createVector((4 * this.size) / 7, this.size / 3);
      this.kneeLeft = createVector((3 * this.size) / 8, (6 * this.size) / 12);
      this.footLeft = createVector((3 * this.size) / 7, (8 * this.size) / 12);
      this.kneeRight = createVector((4 * this.size) / 8, (6 * this.size) / 12);
      this.footRight = createVector((4 * this.size) / 7, (8 * this.size) / 12);
    }

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

  update() {
    this.keyPoints.forEach(p => {
      p.y+=this.vel.y;
      this.vel.add(this.accel);
    })
  }

  draw() {
    //colorMode(HSB);
    //let hue = 0;
    push();
   // translate(this.location.x, this.location.y);

    // draw connecting lines
    strokeWeight(1);
    //stroke(255);
    stroke(17, 9, 2);
    beginShape(LINES);

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
    pop();
  }
}

function onEnabled() {
  console.log("WebMIDI Enabled");
  
  // Inputs
  WebMidi.inputs.forEach(input => console.log("Input: ",input.manufacturer, input.name));
  
  // Outputs
  WebMidi.outputs.forEach(output => console.log("Output: ",output.manufacturer, output.name));
  
  //Looking at the first output available to us
  console.log(WebMidi.outputs);

  //assign that output as the one we will use later//
  myOutput = WebMidi.outputs[0];
}