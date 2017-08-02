var EndLayer = function (scores) {
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


  var gameOver = new Tiny.BitmapText('Game Over!', {
    font: '40px font',
    tint: '0x5a5816'
  });
  gameOver.setPosition(30, 130);
  gameOver.rotation = -3.14 / 7;
  this.addChild(gameOver);

  var scoreSprite = new Tiny.BitmapText('you scored ' + scores + ' points!', {
    font: '24px font',
    tint: '0x5e96be'
  });
  scoreSprite.setPosition(130, 130);

  var restartBtn = new Tiny.BitmapText('restart', {
    font: '15px font',
    tint: '0x000000'
  });
  restartBtn.x = width / 2 - restartBtn.width / 2;
  restartBtn.y = height - restartBtn.height * 5;

  restartBtn.setEventEnabled(true);
  restartBtn.on('pointerdown', function () {
    Tiny.app.replaceScene(new MainLayer());
  });
  var tap = new Sprites.getGreenTap();

  tap.x = width / 2 - tap.width / 2;
  tap.y = restartBtn.y;
  this.addChild(tap);

  this.addChild(scoreSprite);
  this.addChild(restartBtn);
};
EndLayer.prototype = Object.create(Tiny.Container.prototype);
EndLayer.prototype.constructor = EndLayer;
