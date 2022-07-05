class SpeedCounter extends PlayerLogic {
  static deleteDistance = 20;

  constructor(color) {
    super();
    this.curve = new Curve(color);
    this.ms = 300;
  }

  draw(cx) {
    if (this.curve.isEmpty()) return;
    cx.setLineDash([10]);
    this.curve.draw(cx);
    cx.setLineDash([]);
  }

  onMouseDown(e) {
    //const mousePos = new Point(e.pageX, e.pageY);
    //for (let i = 0; i < this.curve.points.length; i++) {
    //  const point = this.curve.points[i];
    //  if (point.distanceBetween(mousePos) < SpeedCounter.deleteDistance) {
    //    this.curve.clear();
    //    break;
    //  }
    //}
  }

  onMouseMove(e) {
    const mousePos = new Point(e.pageX, e.pageY);

    //for (let i = 0; i < this.curve.points.length; i++) {
    //  const point = this.curve.points[i];
    //  if (point.distanceBetween(mousePos) < SpeedCounter.deleteDistance) {
    //    this.curve.setAlertColor();
    //    break;
    //  } else this.curve.restoreColor();
    //}
    if (!this.isFocused) return;

    if (MOUSE_BUTTON_PRESSED == MouseButtons.LEFT) {
      this.curve.addPoint(mousePos, true);
    }
  }

  proceedEraser(eraser) {
    if (this.curve.shouldProceedEraser(eraser.point, eraser.radius))
      this.curve.clear();
  }

  calculate() {
    this.calculationResult =
      Math.round((this.curve.length * PX_TO_UNIT) / this.ms) + " sec";
  }
}
