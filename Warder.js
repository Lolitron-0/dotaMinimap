class Warder extends BaseLogic {
    static radius = 100
    _wards = []
    constructor() {
        super()
    }

    onMouseMove(e) {
        if (!this.isFocused) return
        this.draw(new Point({
            x: e.pageX,
            y: e.pageY
        }))
    }


    draw(startPoint) {
        const currentRay = new Segment({
            start: startPoint,
            end: new Point({
                x: startPoint.x - Warder.radius,
                y: startPoint.y
            })
        })
        for (let i = 0; i <= 369; i += .5) {
            let cutted = null
            for (let i = 0; i < trees.length; i++) {
                const tree = trees[i];
                if (!tree.isPointInside(currentRay.start)) {
                    let ray = tree.getTracedRay(currentRay)
                    document.body.style.cursor = "crosshair";

                    if (!ray.end.equals(currentRay.end) && //if ray had intersection
                        (cutted == null || cutted.length > ray.length)) { // and its length is less than saved 
                        cutted = ray
                    }
                } else {
                    document.body.style.cursor = "not-allowed";
                }
            }

            if (cutted == null) //if no intersection
                currentRay.draw(1, "rgba(255, 255, 0, 0.2)")
            else
                cutted.draw(1, "rgba(255, 255, 0, 0.2)")


            currentRay.end = rotatePoint(currentRay.start, currentRay.end, .5)
        }
    }

}