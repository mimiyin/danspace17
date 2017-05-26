var Sound = function(_sound) {
  var sound = _sound;
  var lifespan = 0;
  var volume = 5;

  sound.loop();
  sound.setVolume(volume);

  this.update = function(d) {
    volume = map(d, 0, 1, -1, 5);
    sound.setVolume(volume);
    lifespan++;
    //console.log(lifespan);
  }

  this.die = function() {
    lifespan--;
    //console.log(lifespan);
  }

  this.isDead = function() {
    if(lifespan < 0) sound.pause();
    return lifespan < 0;
  }
}