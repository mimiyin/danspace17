// The Quad represents the fov of the kinect camera
var Quad = function (ip, _o, _a, _v) {
  // Position quad
  var o = _o;
  var a = _a;
  var sounds = [];
  var selectFrom = [];
  var playlist = {};
  var quad = new Polygon(_v);

  function bodyTracked(body) {
    var id = body.trackingId;
    // When there is a new body
    if (bm.isTracking(id)) bm.update(body);
    else bm.add(body);

    // If there are sounds left to choose from
    // And this body doesn't have a sound yet..
    if (selectFrom.length > 0 && !(id in playlist) && IS_ALL_QUAD_STRIKE) {
      var ssel = floor(random(selectFrom.length));
      var s = selectFrom[ssel];
      playlist[id] = new Sound(sounds[s], s);
      selectFrom.splice(ssel, 1);
    }
  }

  // Create kinect
  var kinectron = new Kinectron(ip);
  kinectron.makeConnection();
  // Request all tracked bodies and pass data to your callback
  kinectron.startTrackedBodies(bodyTracked);

  // Define joint
  var joint = kinectron[JOINT];
  var shJoint = kinectron[SH_JOINT];
  var strJoint = kinectron[STR_JOINT];

  // Managing kinect bodies
  var bm = new BodyManager();

  this.addSound = function (sound) {
    sounds.push(sound);
    selectFrom.push(sounds.length - 1);
  }

  this.resetSounds = function () {
    for (var s = 0; s < sounds.length; s++) sounds[s].pause();
    playlist = {};
    sounds = [];
    selectFrom = [];
  }

  this.display = function () {
    fill(255, 32);
    noStroke();
    quad.display();
  }

  // Scale the data to fit the screen
  // Move it to the center of the screen
  // Return it as a vector
  // Use z as x
  // Use x as y
  function getPixelPos(joint) {
    var pos = createVector(joint.x * pmratio, joint.z * pmratio);
    return pos.rotate(a + (PI / 2)).add(o);
  }

  this.update = function () {
    fill(255);
    ellipse(o.x, o.y, 50, 50);
    // Get positions of all tracked bodies
    var bodies = bm.getBodies();
    for (var b = 0; b < bodies.length; b++) {
      // Draw all the body positions
      var body = bodies[b];
      var id = body.id;
      var pos = getPixelPos(body.getPos(joint));
      noStroke();
      fill(255, 0, 0);
      ellipse(pos.x, pos.y, 50, 50);
      var d = body.getPos(joint).mag() / maxfar;
      if (id in playlist) playlist[id].update(d);
    }

    // Check all the ids in movers to see if they are dead
    // If they are, kill the loops
    for (var id in playlist) {
      var item = playlist[id];
      // If body is dead
      if (item.isDead()) {
        console.log("DEAD!", id);
        selectFrom.push(item.getIndex());
        playlist[id].kill();
        delete playlist[id];
      }
      else if (!(bm.isTracking(id))) item.die();
    }
  }

  this.getSpeeds = function () {
    var speeds = [];
    var bodies = bm.getBodies();
    for (var b = 0; b < bodies.length; b++) {
      // Draw all the body positions
      var body = bodies[b];
      speeds.push(body.getAvgSpeed(shJoint));
    }
    return speeds;
  }

  this.getAccs = function () {
    var accs = [];
    var bodies = bm.getBodies();
    for (var b = 0; b < bodies.length; b++) {
      // Draw all the body positions
      var body = bodies[b];
      accs.push(body.getAcc(joint).mag());
    }
    return accs;
  }

  this.getStrikes = function () {
    var strikes = [];
    var bodies = bm.getBodies();
    for (var b = 0; b < bodies.length; b++) {
      // Draw all the body positions
      var body = bodies[b];
      for (var i = 0; i < SEL_JOINTS.length; i++) {
        var j = kinectron[SEL_JOINTS[i]];
        var strike = body.getStrike(j);
        strikes.push(strike);
        if(strike == 1 && !IS_ALL_QUAD_STRIKE) {
          for(var s = 0; s < sounds.length; s++) {
            var index = floor(random(sounds.length));
            if(sounds[index].isPlaying()) continue;
            sounds[index].jump();
            break;
          }
        }
      }
    }
    return strikes;
  }

  this.getHeadings = function () {
    var headings = [];
    var bodies = bm.getBodies();
    for (var b = 0; b < bodies.length; b++) {
      // Draw all the body positions
      var body = bodies[b];
      var heading = map(body.getVel(joint).heading(), -PI, PI, 0, TWO_PI);
      headings.push(heading);
    }
    return headings;
  }
}