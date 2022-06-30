class ClosedCurve extends Curve {
  _finished = false;

  constructor( color ) {
    super( color );
  }

  get finished() {
    return this._finished;
  }

  finish() {
    this._finished = true;
  }

  isPointInside(point) {
    let result = false;
    let j = this.points.length - 1;
    for (let i = 0; i < this.points.length; i++) {
      if (
        ((this.points[i].y < point.y && this.points[j].y >= point.y) ||
          (this.points[j].y < point.y && this.points[i].y >= point.y)) &&
        this.points[i].x +
          ((point.y - this.points[i].y) *
            (this.points[j].x - this.points[i].x)) /
            (this.points[j].y - this.points[i].y) <
          point.x
      )
        result = !result;

      j = i;
    }

    return result;
  }
  //isPointInside(point) {
  //  let result = false;
  //  let j = this.points.length - 1;
  //  let raySegment = new Segment(point.withAddedX(-1000),point)
  //  for (let i = 0; i < this.points.length; i++) {
  //    if (intersection2D(new Segment(this.points[i],this.points[j]), raySegment))
  //      result = !result;
  //    j = i;
  //  }
//
  //  return result;
  //}

  isCurveInside(curve) {
    let ptsInside = 0;
    curve.points.forEach((point) => {
      if (this.isPointInside(point)) ptsInside++;
    });

    return ptsInside >= curve.points.length/2
  }

  shouldProceedEraser(point, radius) {
    let j = this.points.length-1
    for (let i = 0; i < this.points.length; i++) {
      const segment = new Segment(this.points[i], this.points[j]);
      if (intersectionSegmentCircle(segment, point, radius)) {
        return true;
      }
      j=i
    }
    return false;
  }

  draw(cx) {
    super.draw(cx);
    if (this._finished) {
      cx.closePath();
    }
    cx.stroke();
  }
}
