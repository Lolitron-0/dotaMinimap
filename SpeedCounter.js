class SpeedCounter extends PlayerLogic {
  static deleteDistance = 20;

  constructor({ color }) {
    super({ cellIndex: 2 });
    this.curve = new Curve({ color });
    this.ms = 300;
  }

  draw() {
    if (this.curve.isEmpty()) return;
    this.curve.draw();
  }

  onMouseDown(e) {
    if (!this.isFocused) return;
    const mousePos = new Point({
      x: e.pageX,
      y: e.pageY,
    });
    for (let i = 0; i < this.curve.points.length; i++) {
      const point = this.curve.points[i];
      if (point.distanceBetween(mousePos) < SpeedCounter.deleteDistance) {
        this.curve.clear();
        break;
      }
    }
  }

  onMouseMove(e) {
    if (!this.isFocused) return;

    const mousePos = new Point({
      x: e.pageX,
      y: e.pageY,
    });

    for (let i = 0; i < this.curve.points.length; i++) {
      const point = this.curve.points[i];
      if (point.distanceBetween(mousePos) < SpeedCounter.deleteDistance) {
        this.curve.setAlertColor();
        break;
      } else this.curve.restoreColor();
    }

    if (MOUSE_BUTTON_PRESSED == MouseButtons.LEFT) {
      this.curve.addPoint(mousePos, true);
    }
  }

  calculate() {
    return Math.round((this.curve.length * PX_TO_UNIT) / this.ms) + " sec";
  }
}
