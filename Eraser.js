class Eraser extends BaseLogic {
  constructor() {
    super();
    this.erasing = false;
    this.point = new Point(-1, -1);
    this.radius = 20
  }

  onMouseMove(e) {
    if (!this.isFocused) {
      canvas.style.cursor = "crosshair";
      return;
    }
    canvas.style.cursor = "none";
    this.point.x = e.pageX;
    this.point.y = e.pageY;
  }

  onMouseDown(e) {
    if (!this.isFocused) return;
    if (e.button == MouseButtons.LEFT && this.isFocused) this.erasing = true;
    this.point.x = e.pageX;
    this.point.y = e.pageY;
  }

  onMouseUp(e) {
    if (!this.isFocused) return;
    this.erasing = false;
    this.point.x = -1;
    this.point.y = -1;
  }

  draw(cx) {
    if(!this.isFocused) return;
    cx.strokeStyle = "grey";
    cx.fillStyle = "rgba(0,0,0,0.3)";
    cx.lineWidth = 3;
    cx.beginPath();
    cx.arc(this.point.x, this.point.y, this.radius, this.radius, 0, 360);
    cx.stroke();
    cx.fill();
  }
}
