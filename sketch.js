let skeles = [];

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

function preload(){
  lat = 41.878113;
  lon = -87.629799;
  let url =
    "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=87fb783a54817f1793f0556477730e7c";
  weatherData = loadJSON(url);

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  skeles.push(new Skele(0, 50, false));

  console.log(weatherData);
  parseData();
  mapData();
}

function draw() {
  background(249, 239, 207); // off white
  
  skeles.forEach((skele) => {
      skele.draw();
  });
}

function mousePressed() {
  //   skeles.push(new SkeleRandom(mouseX, mouseY));
  skeles.push(new Skele(mouseX, mouseY, true));
}

function windowResized() {
  background(0);
  resizeCanvas(windowWidth, windowHeight);
}

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
  humidity = map(humidity, 0, 100, 0, 250);
  clouds = map(clouds, 0, 100, 0, 250);
  pressure = map(pressure, 990, 1030, 0, 250);
  windDir = map(windDir, -360, 360, 0, 250);
  windSpeed = map(windSpeed, 0, 30, 0, 250); //beaufort scale converted to m/s
  temp = map(temp, 243, 333, 0, 250);
  tempMax = map(tempMax, 243, 333, 0, 250);
  tempMin = map(tempMin, 243, 333, 0, 250);
  feelsLike = map(feelsLike, 243, 333, 0, 250);
  //add to the weather array
  weatherVariables.push(humidity, clouds, pressure, windDir, windSpeed, temp, tempMax, tempMin, feelsLike);
}

class Skele {
  constructor(_x, _y, _random) {
    // base size of skeleton on smaller screen dimension
    this.size = 400;
    this.location = createVector(_x, _y);

    if (_random) {
      this.size*=1.5;
      console.log(weatherVariables);
      this.head = createVector(weatherVariables[int(random(8))], weatherVariables[int(random(8))]);
      this.shoulderLeft = createVector(
        weatherVariables[int(random(8))],
        weatherVariables[int(random(8))]
      );
      this.elbowLeft = createVector(
        weatherVariables[int(random(8))],
        weatherVariables[int(random(8))]
      );
      this.handLeft = createVector(
        weatherVariables[int(random(8))],
        weatherVariables[int(random(8))]
      );
      this.shoulderRight = createVector(
        weatherVariables[int(random(8))],
        weatherVariables[int(random(8))]
      );
      this.elbowRight = createVector(
        weatherVariables[int(random(8))],
        weatherVariables[int(random(8))]
      );
      this.handRight = createVector(
        weatherVariables[int(random(8))],
        weatherVariables[int(random(8))]
      );
      this.waistLeft = createVector(
        weatherVariables[int(random(8))],
        weatherVariables[int(random(8))]
      );
      this.waistRight = createVector(
        weatherVariables[int(random(8))],
        weatherVariables[int(random(8))]
      );
      this.kneeLeft = createVector(
        weatherVariables[int(random(8))],
        weatherVariables[int(random(8))]
      );
      this.footLeft = createVector(
        weatherVariables[int(random(8))],
        weatherVariables[int(random(8))]
      );
      this.kneeRight = createVector(
        weatherVariables[int(random(8))],
        weatherVariables[int(random(8))]
      );
      this.footRight = createVector(
        weatherVariables[int(random(8))],
        weatherVariables[int(random(8))]
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
    let hue = 0;
    push();
    translate(this.location.x, this.location.y);

    // draw connecting lines
    strokeWeight(1);
    // stroke(255);
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
    this.keyPoints.forEach((p) => {
      strokeWeight(this.size / 50);
      //stroke(hue, 50, 100);
      stroke(17, 9, 2);
      point(p.x, p.y);
      hue += 360 / this.keyPoints.length;
    });
    pop();
  }
}