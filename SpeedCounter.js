class SpeedCounter extends PlayerLogic {
  constructor({ color }) {
    super({ cellIndex: 2 });
    this.curve = new Curve({ color });
    this.ms = 300;
  }

  draw() {
    if (!this.isFocused) return;
    this.curve.draw();
  }

  onMouseDown(e) {
    if(!this.isFocused) return
    this.curve.clear();
  }

  onMouseMove(e) {
      if (!this.isFocused) return;
      console.log(MOUSE_BUTTON_PRESSED);
    if (MOUSE_BUTTON_PRESSED == MouseButtons.LEFT) {
      this.curve.addPoint(
        new Point({
          x: e.pageX,
          y: e.pageY,
        }),
        true
      );
    }
  }

  calculate() {
    return this.length / this.ms; //TODO: smth here
  }
}
