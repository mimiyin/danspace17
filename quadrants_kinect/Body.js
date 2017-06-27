// Body object
var Body = function (body) {
  // Create body with id, joints and ts.
  this.id = body.trackingId;

  // Local functio for creating Joint objects
  var createJoints = function () {
    var joints = [];
    for (var j = 0; j < body.joints.length; j++) {
      joints[j] = new Joint(j, body.joints[j]);
    }
    return joints;
  }
  var joints = createJoints();
  var ts = Date.now();

  // Update body joint and ts data
  this.update = function (body) {
    for (var j = 0; j < body.joints.length; j++) {
      joints[j].update(body.joints[j]);
      ts = Date.now();
    }
  }

  // Returns joint object for specified joint
  this.getJoint = function (joint) {
    return joints[joint];
  }

  // Returns position vector for specified joint
  this.getPos = function (joint) {
    //console.log(this.joints[joint].pos);
    return joints[joint].getPos();
  }

  this.getVel = function (joint) {
    //console.log(this.joints[joint].pos);
    return joints[joint].getVel();
  }

  this.getAcc = function (joint) {
    //console.log(this.joints[joint].pos);
    return joints[joint].getAcc();
  }

  this.getStrike = function (joint) {
    return joints[joint].getStrike();
  }

  var strCounter = 0;
  var struck = -2;

  // If any joints strike, then return true
  this.getStrikes = function () {

    if (struck == -1) {
      for (var j = 0; j < joints.length; j++) {
        if (joints[j].getStrike() == 1) {
          struck = 1;
          strCounter = frameCount;
          return true;
        }
      }
    }
    // Enter waiting stage after strike
    if (frameCount - strCounter > 0 && struck == 1) {
      struck = 0;
    }
    // Wait until it's been 60 frames to make it possible to strike again
    if (frameCount - strCounter > STR_WAIT_TH && struck == 0) {
      struck = -1;
    }
    // Skip first frame
    if (struck == -2) struck = -1;

    return false;
  }

  var speeds = [];
  function getAvg(total, num) {
    return (total + num) / speeds.length;
  }

  this.getAvgSpeed = function (joint) {
    speeds.push(joints[joint].getSpeed());
    if (speeds.length > 10) speeds.shift();
    return speeds.reduce(getAvg);
  }

  // Check to see if body has been updated in last 5 seconds
  this.isDead = function () {
    return Date.now() - ts > DEATH_TH
  }
}