class ClosedCurve extends Curve {

    _finished = false

    constructor({ color }) {
        super({ color })
    }

    get finished() {
        return this._finished
    }

    finish() {
        this._finished = true
    }

    isPointInside(point) {
        let result = false;
        let j = this.points.length - 1;
        for (let i = 0; i < this.points.length; i++) {
            if ((this.points[i].y < point.y && this.points[j].y >= point.y || this.points[j].y < point.y && this.points[i].y >= point.y) &&
                (this.points[i].x + (point.y - this.points[i].y) * (this.points[j].x - this.points[i].x) / (this.points[j].y - this.points[i].y) < point.x))
                result = !result;

            j = i;
        }

        return result;
    }

    draw() {
        super.draw()
        if (this._finished) {
            cx.closePath()
        }
        cx.stroke();
    }
}