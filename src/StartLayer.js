var StartLayer = function () {
  Tiny.Container.call(this);
  var self = this;
  var WIDTH = window.innerWidth;
  var HEIGHT = window.innerHeight;
  var score = 0;
  var taps = [];
  var sprites = [];
  var tmp;
  var lasty = -HEIGHT;
  for (var i = 0; i < 20; i++) {
    tmp = Sprites.getGreenTap();
    tmp.x = Math.random() * WIDTH;
    tmp.y = lasty + Math.random() * 160;
    lasty = tmp.y;
    sprites.push(tmp);
    this.addChild(tmp);
    taps.push(new Tiny.Rectangle(tmp.x, tmp.y, tmp.width, tmp.height));
  }

  var doodle = new Doodle();
  doodle.setPosition(150, 0.9 * HEIGHT);
  this.addChild(doodle);

  self.on('contacst', function (i) {
    if (sprites[i].y < 0.7 * HEIGHT) {
      this.worldGoesDown(0.8 * HEIGHT - taps[i].y);
    }
  });

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
  ticker.add(function () {
    if (doodle.y < HEIGHT * 0.5 && doodle.v.y < 0) {
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].y -= doodle.v.y / 100;
      }
      doodle.emit('update');
    }else{
      doodle.emit('update');
    }
    if (doodle.v.y > 0) {
      for (var i = 0; i < sprites.length; i++) {
        if (Tiny.rectIntersectsRect(doodle, sprites[i])) {
          doodle.emit('contact', i, self);
          //self.emit('contact', i);
          break;
        }
      }
    }
  });

  ticker.start();


};
StartLayer.prototype = Object.create(Tiny.Container.prototype);
StartLayer.prototype.constructor = StartLayer;
