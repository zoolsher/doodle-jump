## 使用`Tiny.js` 开发 `doodle jump`

1. 使用 tiny-cli 脚手架 构建一个基本的工作环境。

2. load 相应的资源

   ```javascript
   var RESOURCES = {
   	"all.png":"res/images/2WEhf.png",
   };

   ```

3. 切雪碧图

   在 src 目录中新建了一个 Sprites.js，对所有获取 sprite 的操作进行一次封装，第一是防止后期更改素材，第二是我也不知道会不会有更高效的方式来引入素材精灵。

   ```javascript
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
   };

   ```

   注意这里的clone。如果不clone的话，那么第二次有使用`Tiny.TextureCache[RESOURCES['all.png']]`时，设置了frame，那么第一次得frame就会失效，因为毕竟他们是全局共享的…小坑…勿踩…

   将doodle处理为一个单独的类，方便操作。

   ```javascript
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
     this.setEventEnabled(true);
     this.on('pointerdown',function(){
       this.contact();
     });
   };
   Doodle.prototype = Object.create(Tiny.Sprite.prototype);
   Doodle.prototype.constructor = Doodle;
   ```

   测试一下：

   ```javascript
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
   ```

   都出现在视图上了。点击一下doodle，那么你应该可以看到doodle的腿缩起来了。

   ​

