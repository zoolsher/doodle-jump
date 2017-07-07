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

  游戏启动之后，再要切换的话，需要调用`Tiny.app.replaceScene`方法，如果再次调用`run`会发生异常。

### 4. 启动页面 `BitmapText` `Event` `rotation` `position`

一般的素材我们采用贴图的方式，但这次带大家体验一次BitmapText。 很好用的一个插件，可以用来将默写  


http://kvazars.com/littera/

http://tinyjs.net/plugins/tinyjs-plugin-bitmap-text/docs/