class Area extends BaseLogic {

    constructor({ color, team }) {
        super({ cellIndex: 1 })
        this.color = color;
        this.curves = [];
        this.team = team
    }

    cleanUpSmall() {
        this.curves = this.curves.filter((el) => el.points.length > 5)
    }

    onMouseDown(e) {
        if (e.button == MouseButtons.LEFT &&
            this.isFocused)
            this.startNewCurve()
    }

    onMouseMove(e) {
        if (e.button == MouseButtons.LEFT &&
            this.isFocused) {
            this.addPoint(new Point({
                x: e.pageX,
                y: e.pageY
            }))
        }
    }

    onMouseUp(e) {
        this.cleanUpSmall()
        if (e.button == MouseButtons.RIGHT) {
            this.deleteCurves({
                x: e.pageX,
                y: e.pageY
            })
        }
        this.finishAllCurves()
    }

    calculate() {
        let res = 0
        camps.forEach(camp => {
            if (this.isPointInside(new Point({
                    x: camp.position.x + camp.size / 2,
                    y: camp.position.y + camp.size / 2,
                })) &&
                camp.checked != this.team && camp.checked != DotaTeam.ALL) { //if its not already checked by that team and not checked by all
                if (camp.checked == DotaTeam.NONE)
                    camp.checked = this.team
                else
                    camp.checked = DotaTeam.ALL

                res += getCampGold(camp)
                camp.size = Camp.enlargedSize
            }
        });
        return res
    }


    //returns if anything was deleted
    deleteCurves(point) {
        let deleted = false;
        for (let i = this.curves.length - 1; i >= 0; i--) {
            if (this.curves[i].isPointInside(point) && this.curves[i].finished) {
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
            if (element.isPointInside(point))
                result = true
        });
        return result
    }

}