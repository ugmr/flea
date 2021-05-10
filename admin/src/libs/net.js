const RAF = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

export default class Net {
  constructor(options = {}) {
    this.cvs = options.canvas;
    this.ctx = this.cvs.getContext("2d");
    this.dotNum = options.dotNum || 150;
    this.dotSize = options.dotSize || 1;
    this.dots = [];
    this.pointer = { x: null, y: null };
    this.lineDis = options.lineDis || 20000;
    this.extendDis = options.extendDis || 5;
    this.changeTheme(options.theme);

    this.start();
  }
  // 初始化鼠标事件
  initMouseEvent() {
    const that = this;

    window.onmousemove = function (e) {
      e = e || window.event;

      that.pointer.x = e.clientX - that.cvs.offsetLeft;
      that.pointer.y = e.clientY - that.cvs.offsetTop;
    };

    window.onmouseout = function () {
      that.pointer.x = null;
      that.pointer.y = null;
    };
  }
  // 生成点
  generateDots() {
    for (let i = 0; i < this.dotNum; i++) {
      const x =
        Math.random() * (this.cvs.width + 2 * this.extendDis) - this.extendDis;
      const y =
        Math.random() * (this.cvs.height + 2 * this.extendDis) - this.extendDis;
      const xa = (Math.random() * 2 - 1) / 1.5;
      const ya = (Math.random() * 2 - 1) / 1.5;

      this.dots.push({ x, y, xa, ya });
    }
  }
  // 在canvas中画出点和线
  draw() {
    const odots = [this.pointer, ...this.dots];

    const that = this;
    this.dots.forEach((dot) => {
      // 粒子移动
      dot.x += dot.xa;
      dot.y += dot.ya;

      // 遇到边界将加速度反向
      dot.xa *=
        dot.x > that.cvs.width + that.extendDis || dot.x < -that.extendDis
          ? -1
          : 1;
      dot.ya *=
        dot.y > that.cvs.height + that.extendDis || dot.y < -that.extendDis
          ? -1
          : 1;

      // 绘制粒子
      that.ctx.beginPath();
      that.ctx.arc(dot.x, dot.y, this.dotSize, 0, 2 * Math.PI, false);
      that.ctx.fillStyle = that.dotColor;
      that.ctx.fill();
      //绘制连线
      odots.forEach((odot) => {
        if (!odot.x || !dot.y || odot == dot) return;

        const xc = dot.x - odot.x;
        const yc = dot.y - odot.y;

        if (xc > that.lineDis || yc > that.lineDis) return;

        const dis = xc * xc + yc * yc;
        if (dis < that.lineDis) {
          // 计算距离比
          const ratio = (that.lineDis - dis) / that.lineDis;

          // 粒子间连线
          that.ctx.beginPath();
          that.ctx.lineWidth = ratio / 2;
          that.ctx.strokeStyle = that.lineColor;
          that.ctx.moveTo(dot.x, dot.y);
          that.ctx.lineTo(odot.x, odot.y);
          that.ctx.stroke();
        }
      });
      // 把已经计算过的粒子从数组中删除
      odots.splice(odots.indexOf(dot), 1);
    });
  }
  // 每一帧的逻辑
  animate() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);
    this.draw();
    RAF(this.animate.bind(this));
  }
  // 开始动画
  start() {
    if (!this.cvs || !this.ctx) return false;
    this.generateDots();
    this.initMouseEvent();
    setTimeout(() => {
      this.animate();
    }, 100);
  }
  // 取消事件绑定
  destroy() {
    window.cancelAnimationFrame(RAF);
    window.onmousemove = null;
    window.onmouseout = null;
  }
  // 更换主题
  changeTheme(newTheme = {}) {
    this.theme = newTheme;
    this.lineColor = this.theme.lineColor || "#000";
    this.backgroundColor = this.theme.backgroundColor || "#fff";
    this.dotColor = this.theme.dotColor || "#000";
  }
}
