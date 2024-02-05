let skeles = []

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}



function draw() {
    background(0);
    skeles.forEach(skele => {
        skele.draw();
    })
}

function mousePressed() {
    skeles.push(new Skele(mouseX, mouseY));
}

function windowResized() {
    background(0);
    resizeCanvas(windowWidth, windowHeight);
}

class Skele {
  constructor(_x, _y) {
    // base size of skeleton on smaller screen dimension
    this.size = 400;
    this.location = createVector(_x, _y)

    this.head = createVector(random(this.size / 4), random(this.size / 4));
    this.neck = createVector(random(this.size / 4), random(this.size / 4));
    this.shoulderLeft = createVector(random(this.size / 4), random(this.size / 4));
    this.elbowLeft = createVector(random(this.size / 4), random(this.size / 4));
    this.handLeft = createVector(random(this.size / 4), random(this.size / 4));
    this.shoulderRight = createVector(random(this.size / 4), random(this.size / 4));
    this.elbowRight = createVector(random(this.size / 4), random(this.size / 4));
    this.handRight = createVector(random(this.size / 4), random(this.size / 4));
    this.torsoUpper = createVector(random(this.size / 4), random(this.size / 4));
    this.torsoLower = createVector(random(this.size / 4), random(this.size / 4));
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
      this.torsoUpper,
      this.torsoLower,
      this.kneeLeft,
      this.kneeRight,
      this.footRight,
    ];
  }

  draw() {
    colorMode(HSB);
    let hue = 0;
    push()
    translate(this.location.x, this.location.y);

    // draw connecting lines
    strokeWeight(2);
    stroke(255);
    beginShape(LINES)
    vertex(this.head.x, this.head.y);
    vertex(this.neck.x, this.neck.y);

    vertex(this.neck.x, this.neck.y);
    vertex(this.shoulderLeft.x, this.shoulderLeft.y)
    
    vertex(this.shoulderLeft.x, this.shoulderRight.x)
    endShape();

    // draw keypoints
    this.keyPoints.forEach(p => {
        strokeWeight(this.size/40);
        stroke(hue, 100, 100);
        point(p.x, p.y)
        hue+=360/this.keyPoints.length
    })
    pop()
  }
}
