var DieLayer = function (scores) {
  Tiny.Container.call(this);
  var scoreSprite = new Tiny.Text(scores,{fontSize: 24, fill : 0xff1010, align : 'center'});
  scoreSprite.x = 100;
  scoreSprite.y = 100;
  scoreSprite.width = 100;
  scoreSprite.height = 100;
  this.addChild(scoreSprite);
};
DieLayer.prototype = Object.create(Tiny.Container.prototype);
DieLayer.prototype.constructor = DieLayer;
