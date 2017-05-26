var Quad = function (x, y, _a, _sounds) {
  var pos = createVector(x, y);
  var a = _a;
  var polygon = new Polygon();
  var sounds = _sounds;
  var movers = [];

  function positionVertex(distance, isAbove) {
    var d = distance * pmratio;
    var dir = isAbove ? -1 : 1;
    var vertex = createVector(d, dir * tan(TWO_PI * (fov / 2) / 360) * d);
    vertex.rotate(a).add(pos);
    return vertex;
  }

  var vertices = [];
  vertices[0] = positionVertex(near, true);
  vertices[1] = positionVertex(far, true);
  vertices[2] = positionVertex(far, false);
  vertices[3] = positionVertex(near, false);

  polygon.addVertices(vertices);

  this.display = function () {
    push();
    fill(255, 32);
    noStroke();
    beginShape();
    for (var v = 0; v < vertices.length; v++) {
      vertex(vertices[v].x, vertices[v].y);
    }
    endShape();
    pop();
  }

  this.manage = function(mover) {
    var sound = movers[mover.id] || null;
    var mpos = mover.getPos();

    // Replace this with checking if body has moved
    if(polygon.contains(mpos)) {
      if(!(mover.id in movers)) {
        sound = new Sound(sounds[floor(random(sounds.length))]);
        movers[mover.id] = sound;
      }
      var d = p5.Vector.dist(mpos, pos) / pfar;
      sound.update(d);
    }
    else if(mover.id in movers) {
      sound.die();
      if(sound.isDead()) {
        delete movers[mover.id];
        console.log(movers[mover.id]);
      };
    }
  }

  this.getSound = function(pos) {
    return sounds[floor(random(sounds.length))];
  }
}