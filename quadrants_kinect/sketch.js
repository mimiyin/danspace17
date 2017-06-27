/*
Mimi Yin NYU-ITP
Mapping Kinect Skeleton locations to floor projection.
 */

// Set up the space
var quads = [];
// Space in meters
var fov = 70.6;
var near = 0.5;
var far = 4.5;
var maxfar = 0;

// Space in feet
var hwratio = h / w;
var fm = 0.3048;
var wm = w * fm;
var hm = h * fm;

// Space in pixels
var pmratio = 0;
var pnear = 0,
  pfar = 0;
var diag = 0;

// SOUNDS
var shush = [],
  sh = 0,
  shushVol = 0,
  pshushVol = 0;
var strikes = [];

function setup() {
  var _h = hwratio * windowWidth;
  createCanvas(windowWidth, _h);
  pmratio = width / wm;
  pnear = near * pmratio;
  pfar = far * pmratio;

  diag = sqrt(sq(width) + sq(height));

  function getQuadVertex(d, dir) {
    return createVector(dir * tan(TWO_PI * (fov / 2) / 360) * d, d);
  }

  function positionQuad(origin, angle) {
    vertices = [];

    function positionVertex(d, dir) {
      var vertex = getQuadVertex(d, dir);
      vertex.rotate(angle + (PI / 2)).add(origin);
      return vertex;
    }
    vertices[0] = positionVertex(pnear, -1);
    vertices[1] = positionVertex(pfar, -1);
    vertices[2] = positionVertex(pfar, 1);
    vertices[3] = positionVertex(pnear, 1);

    return vertices;
  }

  // Caculate maximum distance from camera
  maxfar = getQuadVertex(far, 1).mag();

  for (var i = 0; i < ips.length; i++) {
    var a = i * (TWO_PI / ips.length);
    var x = (cos(a) * (width / 2)) + width / 2;
    var y = (sin(a) * (height / 2)) + height / 2;
    var o = createVector(x, y);
    var v = positionQuad(o, a);
    quads[i] = new Quad(ips[i], o, a, v);
  }

  // Clear out files
  function clearFiles(event) {
    var id = event.target.id;
    switch (id) {
      case "shush":
        for (var s = 0; s < shush.length; s++) shush[s].pause();
        shush = [];
        break;
      case "strikes":
        for (var s = 0; s < strikes.length; s++) strikes[s].pause();
        strikes = [];
        break;
      default:
        quads[id].resetSounds();
        break;
    }
  }

  function getFiles(event) {
    // love the query selector
    var id = event.target.id;
    var cls = event.target.id;
    var files = event.target.files;

    if (files.length == 0) clearFiles(event);

    for (var f = 0; f < files.length; f++) {
      // localize file var in the loop
      var file = files[f];
      loadSound(file, function (sound) {
        sound.setVolume(0);
        switch (id) {
          case "shush":
            shush.push(sound);
            break;
          case "strikes":
            strikes.push(sound);
            break;
          default:
            quads[id].addSound(sound);
            break;
        }
      });
    }
  }

  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    if (input.getAttribute("type") != "file") continue;
    // set the input element onchange to call pullfiles
    input.addEventListener('change', getFiles);
  }

}


function draw() {
  background(0);

  // Get speeds
  var speeds = [];
  // Get strikes
  var peaks = [];

  for (var q = 0; q < quads.length; q++) {
    var quad = quads[q];
    quad.update();
    quad.display();

    // Get and append speeds, strikes and headings
    speeds = speeds.concat(quad.getSpeeds());
    peaks = peaks.concat(quad.getStrikes());
  }

  function getAvgSpeed(total, num) {
    return (total + num) / speeds.length;
  }

  if (shush.length > 0 && speeds.length > 0) {
    // Play next shush sound
    // Calculate avg speed
    var avgSpeed = speeds.reduce(getAvgSpeed);
    // Go too fast, the volume falls rapidly.
    shushVol += (SHUSH_TH - avgSpeed);

    //if(avgSpeed && shushVol) console.log(nfs(avgSpeed, 0, 2), nfs(shushVol, 0, 2));

    // Bottom out at -5
    shushVol = max(SHUSH_VOL_MIN, shushVol);

    // Play a new sound whenever you can start to hear something
    if (pshushVol <= 0 && shushVol > 0) {
      shush[sh].pause();
      sh = floor(random(shush.length));
      shush[sh].loop();
    }

    //console.log(shushVol, avgSpeed);
    shush[sh].setVolume(max(0, shushVol));

    // Remember shushVol
    pshushVol = shushVol;
    textSize(64);
    fill(255);
    noStroke();
    if(avgSpeed && shushVol)
    text(nfs(avgSpeed, 0, 2) + " " + nfs(shushVol, 0, 2), width/2, height/2);
  }

  // GATHER AND DEAL WITH STRIKES
  for (var p = 0; p < peaks.length; p++) {
    if (peaks[p] == 1) {
      for (var str = 0; str < strikes.length; str++) {
        var i = floor(random(strikes.length));
        if (strikes[i].isPlaying()) continue;
        strikes[i].jump();
        break;
      }
    }
  }
}