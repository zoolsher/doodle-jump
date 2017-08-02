var Doodle = function (eventEnabled) {
  //call this var doodle = new Doodle();
  Tiny.Sprite.call(this);
  var self = this;

  // init texture of doodle
  var all = Tiny.TextureCache[RESOURCES['all.png']].clone();
  var height = 81;
  var contactheight = 85;
  var width = 110;
  var rightRect = new Tiny.Rectangle(0, 121, width, height);
  var leftRect = new Tiny.Rectangle(0, 201, width - 20, height);
  var rightContactRect = new Tiny.Rectangle(0, 289, width, contactheight);
  var leftContactRect = new Tiny.Rectangle(0, 371, width, height);
  all.frame = rightRect;
  this.texture = all;

  /**
   * should react the user event
   * @type {boolean}
   */
  this.eventEnabled = eventEnabled === undefined;
  /**
   * if doodle is facing left
   * @type {boolean}
   */
  this.goingLeft = false;
  /**
   * scale the doodle
   * @type {{x: number, y: number}}
   */
  this.scale = {x: 0.5, y: 0.5};

  /**
   * goLeft func
   * @type {function}
   */
  this.goLeft = function (v) {
    this.goingLeft = true;
    all.frame = leftRect;
    if (v) {
      self.v.x = (v + 5) / 70 * 800 - 100;
    } else {
      self.v.x = -500;
    }
    self.m.x = 10;
  };
  /**
   * goRight func
   * @type {function}
   */
  this.goRight = function (v) {
    this.goingLeft = false;
    all.frame = rightRect;
    if (v) {
      self.v.x = (v - 5) / 70 * 800 + 100;
    } else {
      self.v.x = 500;
    }
    self.m.x = -10;
  };
  /**
   *
   */
  this.stopsX = function () {
    self.m.x = 2 * self.m.x;
  };
  /**
   * doodle 碰到跳台的时候会缩腿
   * @type {function}
   */
  this.contact = function () {
    if (this.goingLeft) {
      all.frame = leftContactRect;
    } else {
      all.frame = rightContactRect;
    }
  };
  /**
   * doodle 跳起来之后再伸开腿
   * @type {function}
   */
  this.uncontact = function () {
    if (this.goingLeft) {
      all.frame = leftRect;
    } else {
      all.frame = rightRect;
    }
  };
  //handle event
  this.setEventEnabled(true);
  if (self.eventEnabled) {
    if (!Tiny.isMobile.phone) {
      // handle keyboard event
      var keyLeft = new Tiny.Keyboard(37);//left
      var keyRight = new Tiny.Keyboard(39);//right

      keyLeft.press = function (e) {
        self.goLeft();
      };
      keyRight.press = function (e) {
        self.goRight();
      };
    } else {
      // TODO handle mobile phone
      window.addEventListener("deviceorientation", function (event) {
        var g = event.gamma;
        if (g >= 5) {
          self.goRight(g);
          return;
        }
        if (g < 5) {
          self.goLeft(g);
          return;
        }
        // self.stopsX();
      }, true);
    }
  }
  /**
   * @description 速度
   * @type {{x: number, y: number}}
   */
  this.v = {x: 0, y: -100};
  /**
   * @description 摩擦力
   * @type {{x: number, y: number}}
   */
  this.m = {x: 0, y: 0};
  /**
   * @description 重力
   * @type {{x: number, y: number}}
   */
  this.g = {x: 0, y: 10};
  /**
   * @description update 每一帧更新doodle的速度等参数
   */
  this.on('update', function () {
    if (self.x < 0) {
      self.x = self.x + Tiny.WIN_SIZE.width;
    }
    if (self.x > Tiny.WIN_SIZE.width) {
      self.x = self.x - Tiny.WIN_SIZE.width;
    }
    self.y += self.v.y / CONFIG.speed;
    self.x += self.v.x / CONFIG.speed;
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
  /**
   * 发生碰撞时给doodle一个向上的速度。并不改变横向速度。
   */
  this.on('contact', function () {
    self.v.y = -550;
    self.contact();
    setTimeout(function () {
      self.emit('uncontact')
    }, 100);
  });
  this.on('uncontact', function () {
    self.uncontact();
  })


};
Doodle.prototype = Object.create(Tiny.Sprite.prototype);
Doodle.prototype.constructor = Doodle;
