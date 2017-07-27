## 【上手】用 Tiny 写个 DoodleJump 给你看

keyword: `碰撞` `简单的运动系统` `重力感应事件` `键盘事件` `ES5` `no-wewbpack` `no-babel`

---

### 1. 需求说明：

  + 有一个 Doodle 的小玩偶，他会负责来回在跳板上跳来跳去，移动端依靠重力感应，电脑端依靠方向键。
  + 有各种各样的跳板，不同的跳板与小玩偶发生碰撞的时候会有不同的行为发生。
  + 有三个面板 Start Main End。

### 2. 来吧游戏跑起来

  利用 [tiny-cli](http://tinyjs.net/#/tools/tinyjs-cli) 工具可以快速搭建一个适合 Tiny 游戏开发的模板引擎系统。
  
  ```shell
  $ npm install tinyjs-cli -g
  $ tiny init
  ```
  
  目录中你可以看到

  ```
  +-res
  | |
  | +--images // 图片资源目录
  | +--sounds // 音频资源目录
  |
  +-src
  | |
  | + Resource.js // 加载资源用
  | + StartLayer.js // 起始页面，写代码就从这里开始
  |
  +-index.html //入口HTML
  |
  +-main.js //启动Tiny的JS
  |
  +-...
  ```
  
### 3.资源加载与游戏启动
  1. 资源加载
  ```HTML
  <body>
  <div class="bar">
      <i id="progress"></i>
  </div>
  <p id="percent">Loading..</p>
  <script src='https://a.alipayobjects.com/g/tiny/tiny/1.0.0/tiny.js'></script>
  <script src='src/Resource.js'></script>
  <script src='src/StartLayer.js'></script>
  <script src='main.js'></script>
  </body>
  ```

  在Resource.js中可以看到
  ```javascript
  var RESOURCES = {
  // images,
  "s_Tiny.js_png": "res/images/Tiny.js.png",
  // sounds
  };
  ```
  你可以在这里引入你想要使用的资源，也可以是CDN远程文件的url地址。当然你可以会用到雪碧图。请参考[tiling插件](http://tinyjs.net/plugins/tinyjs-plugin-tiling/docs/)。

2. 游戏启动 `main.js`
  
  游戏启动配置，配置项可以参考[这里](http://tinyjs.net/docs/Tiny.html#.config)
  ```javascript
  var config = {
    showFPS: true,
    width: window.innerWidth,
    height: window.innerHeight,
    renderOptions: {
      antialias: true,
      backgroundColor: 0xFEF3E8,
    },
  };
  Tiny.app = new Tiny.Application(config);
  ```
  这里的Tiny.app要保持单例。一个游戏只启动一个Application。

  加载资源与完善游戏loading动画。如果想更改游戏加载的动画可以修改这里的代码。
  ```javascript
  var resources = [];
  for (var key in RESOURCES) {
    resources.push(RESOURCES[key]);
  }
  var progress = document.getElementById('progress');
  var percent = document.getElementById('percent');

  Tiny.Loader.run({
    resources: resources,
    onProgress: function (pre, res) { //每加载完成一个资源更新一次
      console.log('percent:', pre + '%', res.name);

      var num = ~~pre;
      //更新UI
      percent.innerHTML = num + '%';
      progress.style.width = num + '%';
    },
    onAllComplete: function () { // 全部加载完调用
      console.log('all complete');
      //clear DOM
      var body = document.body;
      body.removeChild(percent);
      body.removeChild(progress.parentNode);
      Tiny.app.run(new StartLayer());
    },
  });
  ```
  在 app 还没有启动的时候，选择一个Tiny.app.run(layer)来启动游戏。这里`layer`一定要是Container的子类。通过下面的代码可以实现继承。
  ``` javascript
  var StartLayer = function () {
    Tiny.Container.call(this);
  };
  StartLayer.prototype = Object.create(Tiny.Container.prototype);
  StartLayer.prototype.constructor = StartLayer;
  ```

  游戏启动之后，再要切换的话，需要调用`Tiny.app.replaceScene`方法，**如果再次调用`run`会发生异常**。

### 4. 启动页面 `BitmapText` `Event` `rotation` `position`

#### 4.1 关于漂亮的字体

一般的素材我们采用贴图的方式，但这次带大家体验一次[BitmapText](http://tinyjs.net/plugins/tinyjs-plugin-bitmap-text/docs/)。 这个插件可以将如下所示的图片裁剪并贴在场景里。

![](https://gw.alipayobjects.com/zos/rmsportal/dXKtTbhoyePjmfvJDZFB.png)

制作这种图片可以使用这个[工具](http://kvazars.com/littera/)


在Resource中如此load一下。
```javascript
var RESOURCES = {
  "s_font_fnt": "res/fonts/font.fnt",
  "s_font_png": "res/fonts/font.png"
};

```

之后就可以在代码中使用了。

```javascript
  var title = new Tiny.BitmapText('doodle jump', {
    font: '54px font', // 这个font的名字来自你的 fnt 文件中的 info 字段。
    tint: '0x5a5816'
  });

  title.setPosition(30, 130);
  title.rotation = -3.14 / 7;
```
这里最后就出现了大家再游戏出息页面看到的title。

#### 4.2 关于事件还有场景切换

启动页还有一个功能是点击开始按钮以后开始游戏，那么如何处理点击事件。

Tiny帮大家屏蔽了click和touch事件的区别，定义了`pointerdown`的事件。但是一定要记得先开启[eventenable](http://tinyjs.net/docs/Tiny.Sprite.html#setEventEnabled);

那么开始游戏这个开始的动作怎么完成呢？我们可以利用Tiny.app来切换场景从而达到启动和结束游戏的效果。

```javascript
  restartBtn.setEventEnabled(true);
  restartBtn.on('pointerdown', function () {
    Tiny.app.replaceScene(new MainLayer());
  });
```

**注意** 在结束动画的场景中我们可能需要渲染用户的得分，正确的姿势是在new这个Layer的时候将参数传进入。

```javascript
Tiny.app.replaceScene(new EndLayer(self.score));//传入参数
```

而不是去把参数写到全局变量，EndLayer的constructor再拿回来。


### 5. 主页面跳跳跳 `Sprite` `重力感应` `键盘事件` `自己实现运动系统`

doodle jump游戏的主人公是我们的Doodle，为了保证代码的整洁，我打算采用继承Sprite的方式，为Doodle单独做一个类Doodle.js。

#### 5.1 解决Doodle的脸怎么向左向右

这里使用Doodle的时候没有使用Doodle的雪碧图插件，如果使用雪碧图会容易的多。

doodle的所有形象全部在`Tiny.TextureCache[RESOURCES['all.png']]`中，向左的图，向右的图，还有跳的时候的图。

我们采用直接对Texture进行裁剪的暴力方式来实现Doodle的样子变换，但是如果不clone的话，这个操作会应用在所有使用该素材的Sprite上。

```javascript
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
```

这样我们再不同的时候只要去更改`all.frame`对应的`rect`就好。

### 5.2 自己的运动系统 `重力` `速度` `摩擦力`

一个简单的牛顿运动系统，考虑摩擦力，重力，速度在内。

doodle在最开始的时候要有一个向上运动的速度，所以 v 初始化的时候是 向上的100 。

```javascript
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
    self.y += self.v.y / CONFIG.speed; // 根据 速度 去改变doodle的位置，从而实现运动的效果
    self.x += self.v.x / CONFIG.speed;
    self.v.x += self.g.x; // 根据 加速度 去改变速度，实现掉落的效果
    self.v.y += self.g.y;
    if (self.m.x !== 0) { // 摩擦力 
      var tx = self.v.x + self.m.x;
      if (tx * self.m.x >= 0) { // 速度减到0的时候就不要再减了 判断方式是判断摩擦力和运动方向同向
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
```

当我们希望doodle向右动 

```javascript 
doodle.v.x = 100;
```

当我们希望doodle带减速的向右动 

```javascript 
doodle.v.x = 100;
doodle.m.x = -10;
```


#### 5.3 重力感应 和 键盘 控制

event.gamma标识了手机绕Y轴旋转的角度从-90到90.

```javascript
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
```

这里使用[tiny keyboard插件](http://tinyjs.net/plugins/tinyjs-plugin-keyboard/docs/)

```javascript
var keyLeft = new Tiny.Keyboard(37);//left
var keyRight = new Tiny.Keyboard(39);//right

keyLeft.press = function (e) {
  self.goLeft();
};
keyRight.press = function (e) {
  self.goRight();
};
```

```javascript
if(Tiny.isMobile.phone) //这里可判断是不是移动端进而可以确定通过什么方式处理事件。
```


#### 5.4 碰撞 `没有使用碰撞系统的碰撞`

碰撞的场景其实很多，但是真实的使用中，不要怕，我们对碰撞大部分场景可以做抽象。

比如在我们的这个场景里，我们把doodle的模型抽象成在doodle最底部的高度为`1`的一个`条`。

这样就可以直接判断这个`条`和每个跳板的两个矩形是不是发生了接触，接触了那就是发生了`所谓的碰撞`。

```javascript
var doodleRect = new Tiny.Rectangle(doodle.x, doodle.y + doodle.height, doodle.width, 1);
for (var i = 0; i < sprites.length; i++) {
  if (Tiny.rectIntersectsRect(doodleRect, sprites[i])) {
    doodle.emit('contact', i, self);
    break;
  }
}
```

### 6. 总结

爽。