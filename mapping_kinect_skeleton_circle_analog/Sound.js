var Sound = function (_sound, _s) {
  var sound = _sound;
  var s = _s;
  var lifespan = 0;
  var volume = 5;
  var volLeft = 5;
  var duration = sound.duration();
  var counter = 0;
  var startedDying = false;
  var loop_wait_th = random(LOOP_WAIT_TH, 3*LOOP_WAIT_TH);

  sound.jump();
  sound.setVolume(volume);

  function playSound() {
    sound.setVolume(max(0, volume));
    if(!sound.isPlaying() && counter > loop_wait_th) {
      sound.jump(0);
      counter = 0;
    }
    counter++;
  }

  this.update = function (d) {
    d = constrain(d, 0.25, 1);
    volume = map(d, 0, 1, -1, 4);
    //console.log("d", nfs(d, 0, 2), "v", nfs(volume, 0, 2));
    lifespan++;
    playSound();
  }

  this.die = function () {
    lifespan--;
    console.log(lifespan, sound.isPlaying(), volume);
    playSound();
  }

  this.kill = function() {
    sound.pause();
  }

  this.isDead = function () {
    // Wait for sound to finish before killing it off
    // If there's more than 30 seconds left though, fade out the volume in 10s and kill it
    if(lifespan == 0) volLeft = volume;
    if(lifespan < 1 && (duration - sound.currentTime() > 10)) {
      volume-=volLeft / (60*10);
      playSound();
      //sound.setVolume(volume);
    }
    return lifespan < 1 && (!sound.isPlaying() || volume < 0);
  }

  this.getSound = function() {
    return sound;
  }

  this.getIndex = function() {
    return s;
  }
}