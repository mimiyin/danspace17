// Joint object
var Joint = function (_id, joint) {
  // Create joint with id and position data
  var id = _id;
  var pos = createVector(joint.cameraX, joint.cameraY, joint.cameraZ);
  var ppos = null;
  var vel = null;
  var pvel = null;
  var acc = null;
  var struck = -2;
  var strCounter = 0;

  function getAvg(total, num) {
    return (total + num) / speeds.length;
  }

  // Update joint position, speed and acceleration data
  this.update = function (joint) {
    // Store current values as previous values
    ppos = pos.copy();
    if (vel) pvel = vel.copy();

    // Update joint with new values for pos, speed and acceleration
    pos = createVector(joint.cameraX, joint.cameraY, joint.cameraZ);
    vel = p5.Vector.sub(pos, ppos);
    if (pvel) acc = p5.Vector.sub(vel, pvel);
  }

  this.getPos = function () {
    return pos;
  }

  this.getVel = function () {
    return vel;
  }

  this.getSpeed = function () {
    return vel ? vel.mag() : null;
  }

  this.getAcc = function () {
    return acc;
  }

  // Keep track of strikes
  var strikes = [];

  this.getStrike = function () {
    var x = frameCount % width;
    stroke(255);
    if (vel) line(x, 0, x, vel.mag() * 250);
    if (acc) line(x, 250, x, 250 + acc.mag() * 250);

    // Reject too close
    if(pos.mag() < near) return -1;

    // empty every 5 frames
    if (frameCount % 5 == 0) strikes = [];

    // Strike, if it's been 60 frames since last strike
    if (acc && acc.mag() > STR_TH && struck == -1) {
      //console.log(nfs(acc.mag(), 0, 2), STR_TH);
      strikes.push(1);
    }

    if (strikes.length >= 3) {
      struck = 1;
      strCounter = frameCount;
      fill(255);
      noStroke();
      textSize(64);
      text("STRIKE! " + JOINT_NAMES[id], width / 3, height / 2);
    }
    // Enter waiting stage after strike
    else if (frameCount - strCounter > 0 && struck == 1) {
      struck = 0;
    }
    // Wait until it's been 60 frames to make it possible to strike again
    else if (frameCount - strCounter > STR_WAIT_TH && struck == 0) {
      struck = -1;
    }
    // Skip first frame
    else if (struck == -2) struck = -1;
    return struck;
  }
}