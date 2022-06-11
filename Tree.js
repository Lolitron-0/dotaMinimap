class Tree extends ClosedCurve {
    constructor({ level }) {
        super({ color: "red" })
        this.level = level
    }

    getTracedRay(ray) {
        let j = this.points.length - 1;
        let resPt = null
        for (let i = 0; i < this.points.length; i++) {
            let pt = intersection2D(ray, new Segment({
                start: this.points[i],
                end: this.points[j]
            }))

            if (resPt == null ||
                (pt != null && pt.distanceBetween(ray.start) < resPt.distanceBetween(ray.start))) {
                resPt = pt
            }

            j = i;
        }

        return new Segment({
            start: ray.start,
            end: ((resPt == null || resPt.distanceBetween(ray.start) > Warder.radius) ? ray.end : resPt)
        })
    }
}