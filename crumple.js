let skele;
let distortion = 0;
let increaseButton, decreaseButton;

function setup() {

  increaseButton = createButton('Increase');
  increaseButton.position(20, 20);
  increaseButton.mousePressed(increaseDistortion);
  
  // Create the decrease button
  decreaseButton = createButton('Decrease');
  decreaseButton.position(100, 20);
  decreaseButton.mousePressed(decreaseDistortion);
  createCanvas(windowWidth, windowHeight);

  skele = new Skele(width / 2, height / 2, 600, 1);
  frameRate(10);
}

function draw() {
  background(255);
  skele = new Skele(width / 2, height / 2, 600, distortion);
  //console.log(skele.shoulderLeft.x)
  skele.draw();
  textAlign(CENTER);
  textSize(30);
  strokeWeight(1);
  text(`Distortion: ${distortion}`, width/2, 100)
  textSize(20);
  text(`Use up/down arrows to change distortion (0-5)`, width/2, 150)
  // skele.updateSize(map(mouseX, 0, width, 5, 800))
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function randomDistortion(scale) {
  let randomDistortion = map(random(-scale, scale), -5, 5, -6, 6);

  // if (randomDistortion < 0) {
  //   return randomDistortion * randomDistortion * randomDistortion;
  // }
  return randomDistortion * randomDistortion * randomDistortion;
}

class Skele {
  // x, y represents a center point
  constructor(x, y, size, distortScale) {
    this.size = size;
    this.location = createVector(x, y);
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
      strokeWeight(this.size / 30);
      point(p.x, p.y);
    }

    // draw center point
    // stroke(255, 0, 0);
    // strokeWeight(this.size / 15);
    // point(this.location.x, this.location.y);
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

function keyPressed() {
  switch (keyCode) {
    case UP_ARROW:
      if (distortion < 5) {
        distortion++;
      }
      break;
    case DOWN_ARROW:
      if (distortion > 0) {
        distortion--;
      }
      break;
    default:
      // Do nothing for other keys
      break;
  }
}

function increaseDistortion() {
  if (distortion < 5) {
    distortion++;
  }
}

function decreaseDistortion() {
  if (distortion > 0) {
    distortion--;
  }
}