var MoveBy = function (duration, to) {
  const action = new Tiny.Action(duration, to);
  action.yoyo = false;
  action.onUpdate = function (tween, object) {
    object.setPosition(tween.x, tween.y);
  };
  return action;
};
var Doodle = function () {
  //call this var doodle = new Doodle();
  Tiny.Sprite.call(this);
  var self = this;
  // init texture
  var all = Tiny.TextureCache[RESOURCES['all.png']].clone();
  var height = 81;
  var contactheight = 85;
  var width = 110;
  var rightRect = new Tiny.Rectangle(20, 120, width-20, height);
  var leftRect = new Tiny.Rectangle(0, 120 + height, width-20, height);
  var rightContactRect = new Tiny.Rectangle(0, 120 + 2 * height, width, contactheight);
  var leftContactRect = new Tiny.Rectangle(0, 120 + 2 * height + contactheight, width, height);
  all.frame = rightRect;
  this.goingLeft = false;
  this.scale = {x: 0.5, y: 0.5};
  this.texture = all;
  this.goLeft = function () {
    this.goingLeft = true;
    all.frame = leftRect;
    self.v.x = -500;
    self.m.x = 10;
  };
  this.goRight = function () {
    this.goingLeft = false;
    all.frame = rightRect;
    self.v.x = 500;
    self.m.x = -10;
  };
  this.contact = function () {
    if (this.goingLeft) {
      all.frame = leftContactRect;
    } else {
      all.frame = rightContactRect;
    }
  };
  this.uncontact = function () {
    if (this.goingLeft) {
      all.frame = leftRect;
    } else {
      all.frame = rightRect;
    }
  };
  //handle event
  this.setEventEnabled(true);

  // handle keyboard event
  var keyLeft = new Tiny.Keyboard(37);//left
  var keyRight = new Tiny.Keyboard(39);//right

  keyLeft.press = function (e) {
    self.goLeft();
  };
  keyRight.press = function (e) {
    self.goRight();
  };

  this.v = {x: 0, y: -100};
  this.m = {x: 0, y: 0};
  this.g = {x: 0, y: 10};
  this.on('update', function () {
    if (self.x < 0) {
      self.x = self.x + window.innerWidth
    }
    if (self.x > window.innerWidth) {
      self.x = self.x - window.innerWidth;
    }
    self.y += self.v.y / 100;
    self.x += self.v.x / 100;
    self.v.x += self.g.x;
    self.v.y += self.g.y;
    if (self.m.x !== 0) {
      var tx = self.v.x + self.m.x;
      if (tx * self.m.x >= 0) {
        self.v.x = 0;
        self.m.x = 0;
      } else {
        self.v.x = tx;
      }
    }
    if (self.m.y !== 0) {
      var ty = self.v.y + self.m.y;
      if (ty * self.m.y >= 0) {
        self.v.y = 0;
        self.m.y = 0;
      } else {
        self.v.y = ty;
      }
    }
  });
  this.on('contact', function () {
    self.v.y = -550;
    self.contact();
    self.emit('uncontact');
  });
  this.on('uncontact', function () {
    self.uncontact();
  })


};
Doodle.prototype = Object.create(Tiny.Sprite.prototype);
Doodle.prototype.constructor = Doodle;
