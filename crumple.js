let skele;

function setup() {
  createCanvas(windowWidth, windowHeight);

  skele = new Skele(width / 2, height / 2, 400);
}

function draw() {
  skele.draw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Skele {
  // x, y represents a center point
  constructor(x, y, size) {
    this.size = size;
    this.location = createVector(x, y);

    // this.head = createVector(this.location.x + this.size / 2, this.location.y + 0);
    // this.shoulderLeft = createVector(this.location.x + (2 * this.size) / 5, this.location.y + this.size / 15);
    // this.elbowLeft = createVector(this.location.x + (2 * this.size) / 7, this.location.y + this.size / 7);
    // this.handLeft = createVector(this.location.x + (2 * this.size) / 7, this.location.y + (2 * this.size) / 7);
    // this.shoulderRight = createVector(this.location.x + (3 * this.size) / 5, this.location.y + this.size / 15);
    // this.elbowRight = createVector(this.location.x + (5 * this.size) / 7, this.location.y + this.size / 7);
    // this.handRight = createVector(this.location.x + (5 * this.size) / 7, this.location.y + (2 * this.size) / 7);
    // this.waistLeft = createVector(this.location.x + (3 * this.size) / 7, this.location.y + this.size / 3);
    // this.waistRight = createVector(this.location.x + (4 * this.size) / 7, this.location.y + this.size / 3);
    // this.kneeLeft = createVector(this.location.x + (3 * this.size) / 8, this.location.y + (6 * this.size) / 12);
    // this.footLeft = createVector(this.location.x + (3 * this.size) / 7, this.location.y + (8 * this.size) / 12);
    // this.kneeRight = createVector(this.location.x + (4 * this.size) / 8, this.location.y + (6 * this.size) / 12);
    // this.footRight = createVector(this.location.x + (4 * this.size) / 7, this.location.y + (8 * this.size) / 12);
    // this.neck = p5.Vector.lerp(this.shoulderLeft, this.shoulderRight, 0.5);

    this.head = createVector(x, y - 0.25 * size);
    this.shoulderLeft = createVector(x - 0.2 * size, y - 0.125 * size);
    this.shoulderRight = createVector(x + 0.2 * size, y - 0.125 * size);

    this.elbowLeft = createVector(x - 0.325 * size, y + 0.125 * size);
    this.elbowRight = createVector(x + 0.325 * size, y + 0.125 * size);

    this.handLeft = createVector(x - 0.25 * size, y + 0.45 * size);
    this.handRight = createVector(x + 0.25 * size, y + 0.45 * size);

    this.waistLeft = createVector(x - 0.125 * size, y + 0.4 * size);
    this.waistRight = createVector(x + 0.125 * size, y + 0.4 * size);
    
    this.kneeLeft = createVector(x + 0.6 * size, y + 0.6 * size);
    this.kneeRight = createVector(x + 0.6 * size, y + 0.6 * size);

    this.footLeft = createVector(x + 0.6 * size, y + 0.6 * size);
    this.footRight = createVector(x + 0.6 * size, y + 0.6 * size);


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
      strokeWeight(this.size / 25);
      point(p.x, p.y);
    }
    
    strokeWeight(this.size/10)
    point(this.location.x, this.location.y);
  }

  update() {}
}
