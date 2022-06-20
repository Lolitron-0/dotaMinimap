class Area extends PlayerLogic {
  _color = "";
  _curves = [];

  constructor({ color, team }) {
    super({ cellIndex: 1 });
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
    super.onMouseMove(e);
    if (e.button == MouseButtons.LEFT && this.isFocused) {
      this.addPoint(
        new Point({
          x: e.pageX,
          y: e.pageY,
        })
      );
    }
  }

  onMouseUp(e) {
    super.onMouseUp(e);
    this.cleanUpSmall();
    if (e.button == MouseButtons.RIGHT) {
      this.delete_curves({
        x: e.pageX,
        y: e.pageY,
      });
    }
    this.finishAllCurves();
  }

  calculate() {
    let res = 0;
    camps.forEach((camp) => {
      if (
        this.isPointInside(
          new Point({
            x: camp.position.x + camp.size / 2,
            y: camp.position.y + camp.size / 2,
          })
        ) &&
        camp.checked != this.team &&
        camp.checked != DotaTeam.ALL
      ) {
        //if its not already checked by that team and not checked by all
        if (camp.checked == DotaTeam.NONE) camp.checked = this.team;
        else camp.checked = DotaTeam.ALL;

        res += getCampGold(camp);
        camp.size = Camp.enlargedSize;
      }
    });
    return res;
  }

  //returns if anything was deleted
  delete_curves(point) {
    let deleted = false;
    for (let i = this._curves.length - 1; i >= 0; i--) {
      if (this._curves[i].isPointInside(point) && this._curves[i].finished) {
        this._curves.splice(i, 1);
        deleted = true;
        break;
      }
    }
    return deleted;
  }

  finishAllCurves() {
    this._curves.forEach((element) => {
      element.finish();
    });
  }

  startNewCurve() {
    this._curves.push(new ClosedCurve({ color: this._color }));
  }

  addPoint(point) {
    this._curves.forEach((element) => {
      if (!element.finished) {
        element.addPoint(point, true);
      }
    });
  }

  draw() {
    this._curves.forEach((element) => {
      element.draw();
    });
  }

  isPointInside(point) {
    let result = false;
    this._curves.forEach((element) => {
      if (element.isPointInside(point)) result = true;
    });
    return result;
  }
}
