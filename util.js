const SELECTED_ROW_STYLE = "--bs-table-bg: black;  --bs-table-hover-bg: black; --bs-table-color: white; --bs-table-hover-color: white; border-left: 3px white solid; "
const EPSILON = 1e-9
const GRAD_TO_RAD = 0.017
let UNIT_TO_PX = 0 //lateinit
let PX_TO_UNIT = 0 //lateinit
const minimapImage = new Image();
minimapImage.src = "media/Minimap.png";
const dayTimerImage = new Image()
dayTimerImage.src = "media/day_timer.png"
const nightTimerImage = new Image()
nightTimerImage.src = "media/night_timer.png"


class Point extends IDrawable {
    constructor({ x, y }) {
        super()
        this.x = x
        this.y = y
    }

    distanceBetween(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2))
    }

    draw() {
        cx.lineWidth = 2
        cx.strokeStyle = "red"
        cx.strokeRect(this.x, this.y, 2, 2)
    }

    equals(other) {
        return this.x == other.x &&
            this.y == other.y
    }
}

class Segment extends IDrawable {
    constructor({ start, end }) {
        super()
        this.start = start
        this.end = end
    }

    draw(width, color) {
        cx.lineWidth = width
        cx.strokeStyle = color
        cx.beginPath()
        cx.moveTo(this.start.x, this.start.y)
        cx.lineTo(this.end.x, this.end.y)
        cx.stroke()
    }

    get length() {
        return this.start.distanceBetween(this.end)
    }

    copy() {
        return new Segment({
            start: new Point({ x: this.start.x, y: this.start.y }),
            end: new Point({ x: this.end.x, y: this.end.y }),
        })
    }
}

class MouseButtons {
    static NONE = -1;
    static LEFT = 0;
    static CENTRAL = 1;
    static RIGHT = 2;
}

let MOUSE_BUTTON_PRESSED = MouseButtons.NONE


class DotaTeam {
    static NONE = 0;
    static RADIANT = 1;
    static DIRE = 2;
    static ALL = 3;
}

class PlayerInteractionMode {
    static AREAS = 0;
    static MS = 1;
}

class GroundLevel {
    static RIVER = 0;
    static LOW_GROUND = 1;
    static HIGH_GROUND = 2;
    static CANT_PLACE = 3;
    static CLIFF = 4;
}

class WardType {
    static OBSERVER = 0;
    static SENTRY = 1;
}

//rect is {x,y,w,h}
function isPointInsideRect( point, rect ) {
    return point.x >= rect.x &&
        point.x <= rect.x + rect.w &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.h
}

function det(a, b, c, d) {
    return a * d - b * c;
}

function between(a, b, c) {
    return Math.min(a, b) <= c + EPSILON && c <= Math.max(a, b) + EPSILON;
}

function intersection1D(a, b, c, d) {
    if (a > b)[a, b] = [b, a]
    if (c > d)[c, d] = [d, c]
    return Math.max(a, c) <= Math.min(b, d)
}

//function intersection2D(a, b) {
//    let A1 = a.y - b.y,
//        B1 = b.x - a.x,
//        C1 = -A1 * a.x - B1 * a.y;
//    let A2 = c.y - d.y,
//        B2 = d.x - c.x,
//        C2 = -A2 * c.x - B2 * c.y;
//    let zn = det(A1, B1, A2, B2);
//
//    let intersectionPoint = null
//
//    if (zn != 0) {
//        intersectionPoint = new Point({
//            x: -det(C1, B1, C2, B2) * 1. / zn,
//            y: -det(A1, C1, A2, C2) * 1. / zn
//        })
//    }
//
//    return intersectionPoint
//}


function isPointInsideSegment(seg, pt) {
    if (seg == null || pt == null) return false
    return between(0, EPSILON, seg.length - pt.distanceBetween(seg.start) - pt.distanceBetween(seg.end))
}




function intersection2D(a, b) {
    let A1 = a.start.y - a.end.y,
        B1 = a.end.x - a.start.x,
        C1 = -A1 * a.start.x - B1 * a.start.y;
    let A2 = b.start.y - b.end.y,
        B2 = b.end.x - b.start.x,
        C2 = -A2 * b.start.x - B2 * b.start.y;
    let zn = det(A1, B1, A2, B2);

    let intersectionPoint = null

    if (zn != 0) {
        intersectionPoint = new Point({
            x: -det(C1, B1, C2, B2) * 1. / zn,
            y: -det(A1, C1, A2, C2) * 1. / zn
        })
    }


    return ((isPointInsideSegment(a, intersectionPoint) &&
            isPointInsideSegment(b, intersectionPoint)) ?
        intersectionPoint : null)
}

//alpha in grad
function rotatePoint(origin, point, alpha) {
    return new Point({
        x: -Math.sin(alpha * GRAD_TO_RAD) * (point.y - origin.y) + Math.cos(alpha * GRAD_TO_RAD) * (point.x - origin.x) + origin.x,
        y: Math.cos(alpha * GRAD_TO_RAD) * (point.y - origin.y) + Math.sin(alpha * GRAD_TO_RAD) * (point.x - origin.x) + origin.y
    })
}

function resetCampCheckedState() {
    camps.forEach(camp => {
        camp.checked = 0
        camp.size = Camp.normalSize
    });
}


function getCampGold(camp) {
    let res = 0
    switch (camp.type) {
        case "small":
            res = 67 + 4 * (timeSlider.value / 7.5);
            break;
        case "medium":
            res = 88 + 4 * (timeSlider.value / 7.5);
            break;
        case "big":
            res = 100 + 4 * (timeSlider.value / 7.5);
            break;
        case "ancient":
            res = 169 + 3 * (timeSlider.value / 7.5);
            break;
        case "lane":
            let numMelee = 3
            let numRange = 1
            let numCat = 1
            if (timeSlider.value >= 15) numMelee++;
            if (timeSlider.value >= 30) numMelee++;
            if (timeSlider.value >= 35) numCat++;
            if (timeSlider.value >= 40) numRange++;
            if (timeSlider.value >= 45) numMelee++;

            res = 2 * ((37 + timeSlider.value / 7.5) * numMelee +
                (47 + timeSlider.value / 7.5) * numRange);

            if (timeSlider.value % 5 == 0)
                res += (65 + timeSlider.value / 7.5) * numCat
            break;

        default:
            break;
    }

    return Math.round(res)
}

function loadJSON(callback, file) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    }
    xobj.send(null);
}

let cross = new Image()
cross.src = "media/cross.png"

const DEFAULT_ICONS = {
    CROSS:cross,
}