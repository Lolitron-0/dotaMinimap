class Curve {
    constructor({ color }) {
        this.points = []
        this.color = color
    }

    addPoint(point) {
        this.points.push(point);
    }

    draw() {
        cx.strokeStyle = this.color
        cx.lineWidth = 3
        cx.moveTo(this.points[0].x, this.points[0].y)
        cx.beginPath();
        for (let i = 0; i < this.points.length; i++) {
            cx.lineTo(this.points[i].x, this.points[i].y);
        }
    }

    get length() {
        let sum = 0
        for (let index = 0; index < this.points.length - 1; index++) {
            sum += this.points[i].distanceBetween(this.points[i + 1])
        }
        return sum
    }
}