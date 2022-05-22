class Area {

    constructor({ color }) {
        this.color = color;
        this.curves = [];
    }

    cleanUpSmall() {
        this.curves.forEach(element => {
            if (element.points.length <= 3) {
                this.curves.splice(this.curves.findIndex((el) => el == element), 1)
            }
        });
    }

    //returns if anything was 
    deleteCurves({ point }) {
        let deleted = false;
        for (let i = this.curves.length - 1; i >= 0; i--) {
            if (this.curves[i].isPointInside({ point }) && this.curves[i].finished) {
                this.curves.splice(i, 1);
                deleted = true;
                break
            }
        }
        return deleted
    }

    finishAllCurves() {
        this.curves.forEach(element => {
            element.finished = true;
        });
    }

    startNewCurve() {
        this.curves.push(new ClosedCurve({ color: this.color }))
    }

    addPoint(point) {
        this.curves.forEach(element => {
            if (!element.finished) {
                element.addPoint(point)
            }
        });
    }

    draw() {
        this.curves.forEach(element => {
            element.draw()
        });
    }

    isPointInside(point) {
        let result = false
        this.curves.forEach(element => {
            if (element.isPointInside({ point }))
                result = true
        });
        return result
    }

}