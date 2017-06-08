var Doodle = function () {
  //call this var doodle = new Doodle();
  Tiny.Sprite.call(this);
  var all = Tiny.TextureCache[RESOURCES['all.png']].clone();
  var height = 81;
  var contactheight = 85;
  var width = 110;
  var rightRect = new Tiny.Rectangle(0, 120, width, height);
  var leftRect = new Tiny.Rectangle(0, 120 + height, width, height);
  var rightContactRect = new Tiny.Rectangle(0, 120 + 2 * height, width, contactheight);
  var leftContactRect = new Tiny.Rectangle(0, 120 + 2 * height + contactheight, width, height);
  all.frame = rightRect;
  this.goingLeft = false;
  this.texture = all;
  this.goLeft = function () {
    this.goingLeft = true;
    all.frame = leftRect;
  };
  this.goRight = function () {
    this.goingLeft = false;
    all.frame = rightRect;
  };
  this.contact = function () {
    if (this.goingLeft) {
      all.frame = leftContactRect;
    } else {
      all.frame = rightContactRect;
    }
  };
};
Doodle.prototype = Object.create(Tiny.Sprite.prototype);
Doodle.prototype.constructor = Doodle;

//TODO:in case there is a faster cachable way i didn't notice...
var Sprites = {
  getGreenTap: function () {
    var all = Tiny.TextureCache[RESOURCES['all.png']].clone();
    var rect = new Tiny.Rectangle(0, 0, 105, 30);
    all.frame = rect;
    var sprite = new Tiny.Sprite(all);
    return sprite;
  },
  getRedTap: function () {
    var all = Tiny.TextureCache[RESOURCES['all.png']].clone();
    var rect = new Tiny.Rectangle(0, 30, 105, 30);
    all.frame = rect;
    var sprite = new Tiny.Sprite(all);
    return sprite;
  },
  getBlueTap: function () {
    var all = Tiny.TextureCache[RESOURCES['all.png']].clone();
    var rect = new Tiny.Rectangle(0, 60, 105, 30);
    all.frame = rect;
    var sprite = new Tiny.Sprite(all);
    return sprite;
  },
  getWhiteTap: function () {
    var all = Tiny.TextureCache[RESOURCES['all.png']].clone();
    var rect = new Tiny.Rectangle(0, 90, 105, 30);
    all.frame = rect;
    var sprite = new Tiny.Sprite(all);
    return sprite;
  },
  getDoodle: function () {

  }
};
