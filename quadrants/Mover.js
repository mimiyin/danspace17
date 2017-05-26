var Mover = function (_id) {
  var id = _id;
  var pos = createVector(random(width), random(height));
  var ppos = pos;
  var vel = createVector();
  var speed = 0,
    pspeed = 0;
  var acc = createVector();
  var heading = 0;
  var t = random(1000);


  var rain = loadSound("data/rain.mp3", onLoadRain);
  var rainVol = 0;
  var thunder = loadSound("data/thunder.mp3");
  var thunderCounter = 0;

  function onLoadRain(rain) {
    rain.loop();
    rain.setVolume(rainVol);
  }

  this.display = function () {
    fill(255, 0, 0);
    noStroke();
    ellipse(pos.x, pos.y, 50, 50);
  }

  this.getPos = function () {
    return pos;
  }
  this.getVel = function () {
    return vel;
  }
  this.getSpeed = function () {
    return speed;
  }
  this.getAcc = function () {
    return acc;
  }
  this.getHeading = function () {
    return heading < 0 ? map(heading, -PI, 0, PI, TWO_PI) : heading;
  }

  this.update = function () {
    t += 0.01;
    // Noisy Walker
    // var towardsMouse = p5.Vector.sub(mouse, pos).mult(0.01);
    // towardsMouse.add(createVector(noise(t), noise(t + 100)));
    // pos.add(towardsMouse);
    pos = mouse.copy();
    vel = p5.Vector.sub(pos, ppos);
    speed = vel.mag();
    acc = abs(speed - pspeed);
    pspeed = speed;
    heading = vel.heading();
    ppos = pos.copy();

    if (thunder.isLoaded()) {
      // Strike
      if (acc > (diag / 10) && thunderCounter > 60) {
        thunder.setVolume(5);
        thunder.jump();
        thunderCounter = 0;
      }
      thunderCounter++;
    }

    if (rain.isLoaded()) {
      // Speed of movement
      rainVol += map(speed, 0, diag / 100, 0, 1);
      //console.log("rain", rainVol);
      rainVol -= rainVol > 0.01 ? rainVol*0.1 : 0.1;
      rain.setVolume(max(0, rainVol));
    }
  }
}