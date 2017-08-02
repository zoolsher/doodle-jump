var StartLayer = function () {
  Tiny.Container.call(this);


  var height = Tiny.WIN_SIZE.height;
  var width = Tiny.WIN_SIZE.width;
  for (var j = 0; j < height / 50; j++) {
    for (var i = 0; i < width / 50; i++) {
      var alltexture = Tiny.TextureCache[RESOURCES['all.png']].clone();
      alltexture.frame = new Tiny.Rectangle(0, 640, 50, 50);
      var backgroundImage = new Tiny.Sprite(alltexture);
      backgroundImage.x = i * 50;
      backgroundImage.y = j * 50;
      this.addChild(backgroundImage);
    }
  }

  console.log(Tiny.BitmapText.fonts);

  var title = new Tiny.BitmapText('doodle jump', {
    font: '54px font',
    tint: '0x5a5816'
  });

  title.setPosition(30, 130);
  title.rotation = -3.14 / 7;

  var usingTiny = new Tiny.BitmapText('using Tiny.js', {
    font: '20px font',
    tint: '0x5e96be'
  });

  usingTiny.setPosition(230, 130);

  var zoolsher = new Tiny.BitmapText('by zoolsher', {
    font: '20px font',
    tint: '0x5e96be'
  });

  zoolsher.setPosition(245, 160);

  this.addChild(title);
  this.addChild(usingTiny);
  this.addChild(zoolsher);


  var restartBtn = new Tiny.BitmapText('start', {
    font: '15px font',
    tint: '0x000000'
  });
  restartBtn.x = width / 2 - restartBtn.width / 2;
  restartBtn.y = height - restartBtn.height * 5;

  restartBtn.setEventEnabled(true);
  restartBtn.on('pointerdown', function () {
    Tiny.app.replaceScene(new MainLayer());
  });

  var doodle = new Doodle(false);
  var tap = new Sprites.getGreenTap();

  tap.x = width / 2 - tap.width / 2;
  tap.y = restartBtn.y;
  doodle.x = width / 2 - doodle.width / 2;
  doodle.y = height;
  doodle.v.y = -900;
  doodle.v.x = 0;

  this.addChild(tap);
  this.addChild(doodle);
  this.addChild(restartBtn);




  var ticker = new Tiny.ticker.Ticker();
  ticker.autostart = true;
  ticker.add(function () {
    if (doodle.y + doodle.height > tap.y) {
      doodle.emit('contact');
    }
    doodle.emit('update');

  });
  ticker.start();
};
StartLayer.prototype = Object.create(Tiny.Container.prototype);
StartLayer.prototype.constructor = StartLayer;
