let skeles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  skeles.push(new SkeleStandard(width/2, height/2));
}

function draw() {
  background(0);
  noFill();
  stroke(255);
  rect(width/2, height/2, 400, 400);
  skeles.forEach((skele) => {
    skele.draw();
  });
}

function mousePressed() {
//   skeles.push(new SkeleRandom(mouseX, mouseY));
    skeles.push(new SkeleStandard(mouseX, mouseY));
}

function windowResized() {
  background(0);
  resizeCanvas(windowWidth, windowHeight);
}

class SkeleStandard {
  constructor(_x, _y) {
    // base size of skeleton on smaller screen dimension
    this.size = 400;
    this.location = createVector(_x, _y);

    this.head = createVector(this.size/2, 0);
    // this.neck = createVector(this.size/2, this.size/20);
    this.shoulderLeft = createVector(2*this.size/5, this.size/15);
    this.elbowLeft = createVector(2*this.size/7, this.size/7);
    this.handLeft = createVector(2*this.size/7, 2*this.size/7);
    this.shoulderRight = createVector(3*this.size/5, this.size/15);
    this.elbowRight = createVector(5*this.size/7, this.size/7);
    this.handRight = createVector(5*this.size/7, 2*this.size/7);
    this.waistLeft = createVector(3*this.size/7, this.size/3);
    this.waistRight = createVector(4*this.size/7, this.size/3);
    this.kneeLeft = createVector(3*this.size/8, 6*this.size/12);
    this.footLeft = createVector(3*this.size/7, 8*this.size/12);
    this.kneeRight = createVector(4*this.size/8, 6*this.size/12);
    this.footRight = createVector(4*this.size/7, 8*this.size/12);

    this.keyPoints = [
      this.head,
    //   this.neck,
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
    colorMode(HSB);
    let hue = 0;
    push();
    translate(this.location.x, this.location.y);

    // draw connecting lines
    strokeWeight(1);
    stroke(255);
    beginShape(LINES);

    // head
    // vertex(this.head.x, this.head.y);
    // vertex(this.neck.x, this.neck.y);

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
      stroke(hue, 100, 100);
      point(p.x, p.y);
      hue += 360 / this.keyPoints.length;
    });
    pop();
  }
}

class SkeleRandom {
  constructor(_x, _y) {
    // base size of skeleton on smaller screen dimension
    this.size = 400;
    this.location = createVector(_x, _y);

    this.head = createVector(random(this.size / 4), random(this.size / 4));
    this.neck = createVector(random(this.size / 4), random(this.size / 4));
    this.shoulderLeft = createVector(
      random(this.size / 4),
      random(this.size / 4)
    );
    this.elbowLeft = createVector(random(this.size / 4), random(this.size / 4));
    this.handLeft = createVector(random(this.size / 4), random(this.size / 4));
    this.shoulderRight = createVector(
      random(this.size / 4),
      random(this.size / 4)
    );
    this.elbowRight = createVector(
      random(this.size / 4),
      random(this.size / 4)
    );
    this.handRight = createVector(random(this.size / 4), random(this.size / 4));
    this.waistLeft = createVector(
      random(this.size / 4),
      random(this.size / 4)
    );
    this.waistRight = createVector(
      random(this.size / 4),
      random(this.size / 4)
    );
    this.kneeLeft = createVector(random(this.size / 4), random(this.size / 4));
    this.footLeft = createVector(random(this.size / 4), random(this.size / 4));
    this.kneeRight = createVector(random(this.size / 4), random(this.size / 4));
    this.footRight = createVector(random(this.size / 4), random(this.size / 4));

    this.keyPoints = [
      this.head,
      this.neck,
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
    colorMode(HSB);
    let hue = 0;
    push();
    translate(this.location.x, this.location.y);

    // draw connecting lines
    strokeWeight(1);
    stroke(255);
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
    this.keyPoints.forEach((p) => {
      strokeWeight(this.size / 50);
      stroke(hue, 100, 100);
      point(p.x, p.y);
      hue += 360 / this.keyPoints.length;
    });
    pop();
  }
}
