var StartLayer = function () {
  Tiny.Container.call(this);

  var sprite = Sprites.getGreenTap();
  var sprite2 = Sprites.getRedTap();
  var sprite3 = Sprites.getBlueTap();
  var sprite4 = Sprites.getWhiteTap();
  var doodle = new Doodle();
  sprite.setPosition(0,30); 
  sprite2.setPosition(0,60);
  sprite3.setPosition(0,90);
  sprite4.setPosition(0,120);
  doodle.setPosition(150,0);
  this.addChild(sprite);
  this.addChild(sprite2);
  this.addChild(sprite3);
  this.addChild(sprite4);
  this.addChild(doodle);
};
StartLayer.prototype = Object.create(Tiny.Container.prototype);
StartLayer.prototype.constructor = StartLayer;
