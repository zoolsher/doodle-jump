var StartLayer = function () {
  Tiny.Container.call(this);
  var self = this;
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;
  this.score = 0;
  var die = false;
  var end = false;
  var sprites = [];
  var initStage = function () {
    var tmp;
    var lasty = -HEIGHT;
    for (var i = 0; i < 20; i++) {
      tmp = Sprites.getGreenTap();
      tmp.x = Math.random() * WIDTH;
      tmp.y = lasty + Math.random() * 160;
      lasty = tmp.y;
      sprites.push(tmp);
      self.addChild(tmp);
    }
  };
  initStage();

  var sortSprites = function () {// i can opt this... fuck...
    for (var i = 0; i < sprites.length; i++) {
      for (var j = i; j < sprites.length; j++) {
        if (sprites[i].y < sprites[j].y) {
          var t = sprites[i];
          sprites[i] = sprites[j];
          sprites[j] = t;
        }
      }
    }
  };

  var gc = function () {
    sortSprites();
    console.log(sprites);
    for (var i = 0; i < sprites.length; i++) {
      var sprite = sprites[i];
      if (sprite.y > HEIGHT) {
        sprite.y = sprites[sprites.length - 1].y - Math.random() * 160;
        sprite.x = Math.random() * (WIDTH - sprite.width);
      }
    }
  };

  var doodle = new Doodle();
  doodle.setPosition(150, 0.9 * HEIGHT);
  this.addChild(doodle);


  this.worldGoesDown = function (dy) {
    var action;
    var tmpV = doodle.v;
    var tmpM = doodle.m;
    var tmpG = doodle.g;
    doodle.v = {x: 0, y: 0};
    doodle.m = {x: 0, y: 0};
    doodle.g = {x: 0, y: 0};
    for (var i = 0; i < sprites.length; i++) {
      action = new Tiny.MoveTo(200, {x: sprites[i].x, y: sprites[i].y - doodle.y + 0.5 * HEIGHT});
      sprites[i].runAction(action);
    }
    action.onComplete = function () {
      doodle.v = tmpV;
      doodle.m = tmpM;
      doodle.g = tmpG;
    };
  };

  var ticker = new Tiny.ticker.Ticker();
  ticker.autostart = true;
  var doodleRect = new Tiny.Rectangle(doodle.x, doodle.y + doodle.height, doodle.width, 1);
  doodleRect.height = 1;
  ticker.add(function () {
    if(self.end){
      ticker.stop();
      return;
    }
    if (self.die) {
      sortSprites();
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].y -= doodle.v.y / 100;
      }
      if (sprites[0].y < 0) {
        doodle.y += doodle.v.y / 100;
      }
      if(doodle.y>HEIGHT){
        self.end = true;
        Tiny.app.replaceScene(new DieLayer(self.score));
      }
      // doodle.y -= doodle.v.y/100;
      return;
    }
    if (doodle.y < HEIGHT * 0.5 && doodle.v.y < 0) {
      doodle.y -= doodle.v.y / 100;
      self.score += 1;
      console.log("score :" + self.score);
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].y -= doodle.v.y / 100;
      }
      gc();
    }
    doodle.emit('update');
    if (doodle.v.y > 0) {
      doodleRect.x = doodle.x;
      doodleRect.y = doodle.y + doodle.height;
      for (var i = 0; i < sprites.length; i++) {
        if (Tiny.rectIntersectsRect(doodleRect, sprites[i])) {
          doodle.emit('contact', i, self);
          //self.emit('contact', i);
          break;
        }
      }
    }
    sortSprites();
    if (doodle.y > sprites[0].y || doodle.y > HEIGHT) {
      self.die = true;
    }
  });

  ticker.start();


};
StartLayer.prototype = Object.create(Tiny.Container.prototype);
StartLayer.prototype.constructor = StartLayer;
