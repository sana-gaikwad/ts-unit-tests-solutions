// Originally created by Naoki Inomata (https://codepen.io/I-NO/pen/rNxRGxa)

const Y_AXIS = 1;
const X_AXIS = 2;
let canvas;
let fireworks = [];

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function setup() {
	background(24, 24, 24);
  let canvas = document.getElementById('secret');
  let ctx = canvas.getContext('2d');
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  colorMode(RGB);
  frameRate(60);
}

function draw() {
  background(36, 36, 36);
  noStroke();
  if (document.querySelector('#secret').getAttribute('start') !== 'true') {
    return;
  }

  if (0 === frameCount % 100) {

    let speed = random(10, 30);
    fireworks.push(new FireWork(random(width), height, 0, speed, 0.98));
  }

  for (let fw of fireworks) {

    if (2 === fw.getType || 30000 < fw.getFrame) {
      fireworks = fireworks.filter((n) => n !== fw);
      continue;
    }


    fw.fire();
  }
}

class FireWork {
  constructor(x, y, vx, vy, gv) {

    this.frame = 0;
    this.type = 0;
    this.next = 0;

    this.r = random(155) + 80;
    this.g = random(155) + 80;
    this.b = random(155) + 80;
    this.a = 255;


    this.x = x;
    this.y = y;


    this.w = random(10, 5);


    this.maxHeight = random(height / 6, height / 2);
    this.fireHeight = height - this.maxHeight;


    this.vx = vx;
    this.vy = vy;
    this.gv = gv;


    this.afterImages = [];

    this.explosions = [];


    this.exDelay = random(10, 40);

    this.large = random(5, 15);

    this.ball = random(20, 100);

    this.exEnd = random(20, 40);

    this.exStop = 0.96;
  }

  get getFrame() {
    return this.frame;
  }

  get getType() {
    return this.type;
  }

  fire() {

    switch (this.type) {
      case 0:
        this.rising();
        break;
      case 1:
        this.explosion();
        break;
    }
  }

  rising() {

    if (this.y * 0.8 < this.maxHeight) {
      this.a = this.a - 6;
    }


    this.x += this.vx;
    this.y -= this.vy * ((this.fireHeight - (height - this.y)) / this.fireHeight);


    this.afterImages.push(new Afterimage(this.r, this.g, this.b, this.x, this.y, this.w, this.a));
    for (let ai of this.afterImages) {
      if (ai.getAlpha <= 0) {
        this.afterImages = this.afterImages.filter((n) => n !== ai);
        continue;
      }
      ai.rsImage();
    }


    this.update(this.x, this.y, this.w);


    if (0 == this.afterImages.length) {
      if (0 === this.next) {

        this.next = this.frame + Math.round(this.exDelay);
      } else if (this.next === this.frame) {

        for (let i = 0; i < this.ball; i++) {

          let r = random(0, 360);

          let s = random(0.1, 0.9);
          let vx = Math.cos((r * Math.PI) / 180) * s * this.large;
          let vy = Math.sin((r * Math.PI) / 180) * s * this.large;
          this.explosions.push(new FireWork(this.x, this.y, vx, vy, this.exStop));

          let cr = random(0, 360);
          let cs = random(0.9, 1);
          let cvx = Math.cos((cr * Math.PI) / 180) * cs * this.large;
          let cvy = Math.sin((cr * Math.PI) / 180) * cs * this.large;
          this.explosions.push(new FireWork(this.x, this.y, cvx, cvy, this.exStop));
        }
        this.a = 255;
        this.type = 1;
      }
    }
  }

  explosion() {
    for (let ex of this.explosions) {
      ex.frame++;

      if (2 === ex.getType) {
        this.explosions = this.explosions.filter((n) => n !== ex);
        continue;
      }


      if (0 === Math.round(random(0, 32))) {
        ex.afterImages.push(new Afterimage(this.r, this.g, this.b, ex.x, ex.y, ex.w, ex.a));
      }

      for (let ai of ex.afterImages) {
        if (ai.getAlpha < 0) {
          ex.afterImages = ex.afterImages.filter((n) => n !== ai);
          continue;
        }
        ai.exImage();
      }


      this.update(ex.x, ex.y, ex.w, ex.a);
      ex.x += ex.vx;
      ex.y += ex.vy;
      ex.vx = ex.vx * ex.gv;
      ex.vy = ex.vy * ex.gv;
      ex.vy = ex.vy + ex.gv / 30;
      if (this.exEnd < ex.frame) {
        ex.w -= 0.1;
        ex.a = ex.a - 4;
        if (ex.a < 0 && 0 === ex.afterImages.length) {
          ex.type = 2;
        }
      }
    }
  }

  update(x, y, w, a) {
    this.frame++;
    if (0 < this.a) {
      let c = color(this.r, this.g, this.b);
      c.setAlpha(a);
      fill(c);
      ellipse(x, y, w, w);
    }
  }
}
class Afterimage {
  constructor(r, g, b, x, y, w, a) {
    this.frame = 0;
    this.r = r;
    this.g = g;
    this.b = b;
    this.x = x;
    this.y = y;
    this.w = w;
    this.a = a;
    this.vx = random(-0.24, 0.24);
    this.vy = random(0.2, 0.8);
    this.vw = random(0.05, 0.2);
  }

  get getAlpha() {
    return this.a;
  }

  rsImage() {
    if (0 < this.a) {
      this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a);
      this.r += 4;
      this.g += 4;
      this.b += 4;
      this.x = this.x + this.vx;
      this.y = this.y + this.vy;
      if (0 < this.w) {
        this.w = this.w - this.vw;
      }
      this.a = this.a - 4;
    }
  }

  exImage() {
    if (0 < this.a) {
      this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a);
      this.r += 2.5;
      this.g += 2.5;
      this.b += 2.5;
      this.x = this.x + this.vx;
      this.y = this.y + this.vy;
      if (0 < this.w) {
        this.w = this.w - this.vw;
      }
      this.a = this.a - 1.5;
    }
  }

  update(r, g, b, x, y, w, a) {
    this.frame++;
    let c = color(r, g, b);
    c.setAlpha(a);
    fill(c);
    ellipse(x, y, w, w);
  }
}