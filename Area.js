class Area extends PlayerLogic {
  _color = "";
  _curves = [];

  constructor(color, team) {
    super(1);
    this._color = color;
    this.team = team;
  }

  getAllCurves() {
    let res = [];
    let curvPts = [];
    this._curves.forEach((curve) => {
      curve.points.forEach((point) => {
        curvPts.push(point.x / canvas.width + " " + point.y / canvas.height);
      });
      res.push(curvPts);
      curvPts = [];
    });
    return res;
  }

  cleanUpSmall() {
    this._curves = this._curves.filter((el) => el.points.length >= 3);
  }

  onMouseDown(e) {
    if (e.button == MouseButtons.LEFT && this.isFocused) this.startNewCurve();
  }

  onMouseMove(e) {
    if (e.button == MouseButtons.LEFT && this.isFocused) {
      this.addPoint(new Point(e.pageX, e.pageY));
    }
  }

  onMouseUp(e) {
    this.cleanUpSmall();
    //if (e.button == MouseButtons.RIGHT) {
    //  this.deleteCurves({
    //    x: e.pageX,
    //    y: e.pageY,
    //  });
    //}
    this.finishAllCurves();
  }

  calculate() {
    let res = 0;
    camps.forEach((camp) => {
      if (
        this.isPointInside(
          new Point(
            camp.position.x + camp.size / 2,
            camp.position.y + camp.size / 2
          )
        ) &&
        camp.checked != this.team &&
        camp.checked != DotaTeam.ALL
      ) {
        //if its not already checked by that team and not checked by all
        if (camp.checked == DotaTeam.NONE) camp.checked = this.team;
        else camp.checked = DotaTeam.ALL;

        res += getCampGold(camp);
      }
    });
    return res;
  }

  finishAllCurves() {
    this._curves.forEach((element) => {
      element.finish();
    });
  }

  startNewCurve() {
    this._curves.push(new ClosedCurve(this._color));
  }

  addPoint(point) {
    this._curves.forEach((element) => {
      if (!element.finished) {
        element.addPoint(point, true);
      }
    });
  }

  draw(cx) {
    this._curves.forEach((element) => {
      element.draw(cx);
    });
  }

  isPointInside(point) {
    let result = false;
    this._curves.forEach((element) => {
      if (element.isPointInside(point)) result = true;
    });
    return result;
  }

  proceedEraser(eraser) {
    for (let i = 0; i < this._curves.length; i++) {
      const curve = this._curves[i];
      if (curve.shouldProceedEraser(eraser.point, eraser.radius))
        this._curves.splice(i, 1);
    }
  }
}
