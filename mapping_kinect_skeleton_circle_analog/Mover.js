var Mover = function (_body) {
  var body = _body;

  var loop = _loop;
  var swoosh = _swoosh;
  var swooshVol = 0;
  var strike = _strike;
  var strikeCounter = 0;

  this.update(d) {
    loop.update(d);

    var acc = body.getMagAcc(kinectron.HEAD);
    if (acc > (diag / 10) && strikeCounter > 60) {
      strike.setVolume(5);
      strike.jump();
      strike = 0;
    }
    strike++;

    // Speed of movement
    var speed = body.getSpeed(kinectron.HEAD);
    swooshVol += map(speed, 0, diag / 100, 0, 1);
    //console.log("rain", rainVol);
    swooshVol -= swooshVol > 0.01 ? swooshVol * 0.1 : 0.1;
    swoosh.setVolume(max(0, swooshVol));
  }

  this.die = function() {
    loop.die();
  }

  this.isDead = function() {
    return loop.isDead();
  }
}