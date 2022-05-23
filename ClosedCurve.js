class ClosedCurve extends Curve {
    constructor({ color }) {
        super({ color })
        this.finished = false
    }

    finish() {
        this.finished = true
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
        if (this.finished) {
            cx.closePath()
        }
        cx.stroke();
    }
}