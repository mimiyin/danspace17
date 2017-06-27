var quads = [];
var fov = 70.6;
var near = 500;
var far = 4500;
var w = 40;
var h = 36;
var hwratio = h / w;
var fmm = 304.8;
var wmm = w * fmm;
var hmm = h * fmm;
var pmratio;
var pnear, pfar;
var diag;

var marimba;
var marimbaVol = 0;

var movers = [];
var sounds = [];

var mouse;

function preload() {
  marimba = loadSound("data/marimba.mp3");

  // For every quadrant
  for (var q = 0; q < 4; q++) {
    sounds[q] = [];
    for (var s = 0; s < 1; s++) {
      var index = 1; //(q*s) + s;
      sounds[q][s] = loadSound("data/quads/" + index + ".wav");
    }
  }
}

function setup() {
  var _h = hwratio * windowWidth;
  createCanvas(windowWidth, _h);
  pmratio = width / wmm;
  pnear = near * pmratio;
  pfar = far * pmratio;
  diag = sqrt(sq(width) + sq(height));



  quads[0] = new Quad(0, height / 2, 0, sounds[0]);
  quads[1] = new Quad(width / 2, 0, PI / 2, sounds[1]);
  quads[2] = new Quad(width, height / 2, PI, sounds[2]);
  quads[3] = new Quad(width / 2, height, 3 * PI / 2, sounds[3]);

  // Number of movers
  // for (var m = 0; m < 1; m++) {
    movers[m] = new Mover(m);
  }

  marimba.loop();
  marimba.setVolume(0);

}

function draw() {
  background(0);
  mouse = createVector(mouseX, mouseY);

  // Find the average heading
  var avgHeading = 0;
  var headings = [];

  for (var q = 0; q < quads.length; q++) {
    var quad = quads[q];
    quad.display();
    for (var m = 0; m < movers.length; m++) {
      var mover = movers[m];
      mover.update();
      mover.display();
      var mheading = mover.getHeading();
      avgHeading += mheading;
      headings.push(mheading);
      quad.manage(mover);
    }
  }

  avgHeading /= movers.length;

  // Find the variance
  var delta = 0;
  for (var h = 0; h < headings.length; h++) {
    delta += abs(headings[h] - avgHeading);
  }
  //normalize the variance
  delta /= TWO_PI;

  // Alignment quiets marimba
  // marimbaVol += delta;
  // marimbaVol -= marimbaVol > 0.01 ? marimbaVol*0.1 : 0.1;
  // marimba.setVolume(marimbaVol);

}