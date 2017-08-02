var MainLayer = function () {
  Tiny.Container.call(this);

  var WIDTH = Tiny.WIN_SIZE.width;
  var HEIGHT = Tiny.WIN_SIZE.height;
  for (var j = 0; j < HEIGHT / 50; j++) {
    for (var i = 0; i < WIDTH / 50; i++) {
      var alltexture = Tiny.TextureCache[RESOURCES['all.png']].clone();
      alltexture.frame = new Tiny.Rectangle(0, 640, 50, 50);
      var backgroundImage = new Tiny.Sprite(alltexture);
      backgroundImage.x = i * 50;
      backgroundImage.y = j * 50;
      this.addChild(backgroundImage);
    }
  }

  var self = this;

  this.score = 0;
  this.die = false;
  var sprites = [];
  var initStage = function () {
    var tmp;
    var lasty = HEIGHT;
    for (var i = 0; i < 20; i++) {
      tmp = Sprites.getGreenTap();
      tmp.x = Math.random() * (WIDTH - tmp.width);
      tmp.y = lasty - Math.random() * (160 - tmp.height) - tmp.height;
      lasty = tmp.y;
      sprites.unshift(tmp);
      self.addChild(tmp);
    }
  };
  initStage();

  var sortSprites = function () { // i can opt this......
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
        sprite.y = sprites[sprites.length - 1].y - Math.random() * (160 - sprite.height) - sprite.height;
        sprite.x = Math.random() * (WIDTH - sprite.width);
      }
    }
  };

  var doodle = new Doodle();
  doodle.setPosition(sprites[sprites.length - 1].x, sprites[sprites.length - 1].y - doodle.height);
  this.addChild(doodle);

  var score = new Tiny.BitmapText('score : ' + self.score, {
    font: '24px font',
    tint: 0x000000
  });
  score.y = 0;
  score.x = 0;
  self.addChild(score);


  this.worldGoesDown = function (dy) {
    var action;
    var tmpV = doodle.v;
    var tmpM = doodle.m;
    var tmpG = doodle.g;
    doodle.v = {
      x: 0,
      y: 0
    };
    doodle.m = {
      x: 0,
      y: 0
    };
    doodle.g = {
      x: 0,
      y: 0
    };
    for (var i = 0; i < sprites.length; i++) {
      action = new Tiny.MoveTo(200, {
        x: sprites[i].x,
        y: sprites[i].y - doodle.y + 0.5 * HEIGHT
      });
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
    score.text = 'score : ' + self.score;
    if (self.die) {
      sortSprites();
      doodle.emit('update');
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].y -= doodle.v.y / CONFIG.speed;
      }
      if (sprites[0].y < 0) {
        doodle.y += doodle.v.y / CONFIG.speed;
      }
      if (doodle.y > HEIGHT) {
        ticker.stop();
        Tiny.app.replaceScene(new EndLayer(self.score));
        return;
      }
      // doodle.y -= doodle.v.y/100;
      return;
    }
    if (doodle.y < HEIGHT * 0.5 && doodle.v.y < 0) {
      doodle.y -= doodle.v.y / CONFIG.speed;
      self.score += 1;
      console.log("score :" + self.score);
      for (var i = 0; i < sprites.length; i++) {
        sprites[i].y -= doodle.v.y / CONFIG.speed;
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
MainLayer.prototype = Object.create(Tiny.Container.prototype);
MainLayer.prototype.constructor = MainLayer;
