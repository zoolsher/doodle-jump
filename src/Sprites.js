//TODO:in case there is a faster cachable way i didn't notice...

var Sprites = (function () {
  var tapScale = 0.7;
  function cropSprite(rect){
    var all = Tiny.TextureCache[RESOURCES['all.png']].clone();
    all.frame = rect;
    var sprite = new Tiny.Sprite(all);
    sprite.scale = {x: tapScale, y: tapScale};
    return sprite;
  };
  return {
    getGreenTap: function () {
      var rect = new Tiny.Rectangle(0, 0, 105, 30);
      var sp = cropSprite(rect);
      return sp;
    },
    getRedTap: function () {
      var rect = new Tiny.Rectangle(0, 30, 105, 30);
      return cropSprite(rect);
    },
    getBlueTap: function () {
      var rect = new Tiny.Rectangle(0, 60, 105, 30);
      return cropSprite(rect);
    },
    getWhiteTap: function () {
      var rect = new Tiny.Rectangle(0, 90, 105, 30);
      return cropSprite(rect);
    },
  }
})();
