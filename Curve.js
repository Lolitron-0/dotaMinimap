class Curve extends IDrawable {
    _pointCounter = 0;
    _color

    constructor({ color }) {
        super()
        this.points = []
        this._color = color
    }

    addPoint(point, filter = false) {
        if ((this._pointCounter == 0 && filter) || !filter)
            this.points.push(point);
        if (filter) this._pointCounter = (this._pointCounter + 1) % 2;
    }

    draw() {
        cx.strokeStyle = this._color
        cx.lineWidth = 3
        cx.moveTo(this.points[0].x, this.points[0].y)
        cx.beginPath();
        for (let i = 0; i < this.points.length; i++) {
            cx.lineTo(this.points[i].x, this.points[i].y);
        }
    }

    get length() {
        let sum = 0
        for (let i = 0; i < this.points.length - 1; i++) {
            sum += this.points[i].distanceBetween(this.points[i + 1])
        }
        return sum
    }
}