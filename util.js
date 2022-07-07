const EPSILON = 1e-9;
const GRAD_TO_RAD = 0.017;
const playerColours = [
	"#3074f9",
	"#66ffc0",
	"#bd00b7",
	"#f8f50a",
	"#ff6901",
	"#ff88c5",
	"#a2b349",
	"#63dafa",
	"#01831f",
	"#9f6b00",
];
let UNIT_TO_PX = 0; //lateinit
let PX_TO_UNIT = 0; //lateinit
const minimapImage = new Image();
minimapImage.src = "media/Minimap.png";
const dayTimerImage = new Image();
dayTimerImage.src = "media/day_timer.png";
const nightTimerImage = new Image();
nightTimerImage.src = "media/night_timer.png";

const hiddenCanvas = document.createElement("canvas");
const hiddenContext = hiddenCanvas.getContext("2d");

class Point extends IDrawable {
	constructor(x, y) {
		super();
		this.x = x;
		this.y = y;
	}

	withX(x) {
		return new Point(x, this.y);
	}

	withY(y) {
		return new Point(this.x, y);
	}

	withAddedX(x) {
		return new Point(this.x + x, this.y);
	}

	withAddedY(y) {
		return new Point(this.x, this.y + y);
	}

	distanceBetween(other) {
		return Math.sqrt(
			Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)
		);
	}

	draw(cx) {
		cx.strokeStyle = "red";
		cx.beginPath();
		cx.arc(this.x, this.y, 5, 5, 0, 360);
		cx.stroke();
	}

	equals(other) {
		return this.x == other.x && this.y == other.y;
	}
}

class Rectangle extends IDrawable {
	constructor(position, width, height) {
		super();
		this.position = position;
		this.width = width;
		this.height = height;
	}

	draw(cx) {
		cx.lineWidth = 2;
		cx.strokeStyle = "red";
		cx.strokeRect(
			this.position.x,
			this.position.y,
			this.width,
			this.height
		);
	}

	get x() {
		return this.position.x;
	}
	get y() {
		return this.position.y;
	}
}

class Segment {
	constructor(start, end) {
		this.start = start;
		this.end = end;
	}

	draw(width, color, cx) {
		cx.lineWidth = width;
		cx.strokeStyle = color;
		cx.beginPath();
		cx.moveTo(this.start.x, this.start.y);
		cx.lineTo(this.end.x, this.end.y);
		cx.stroke();
	}

	get length() {
		return this.start.distanceBetween(this.end);
	}

	copy() {
		return new Segment(
			new Point(this.start.x, this.start.y),
			new Point(this.end.x, this.end.y)
		);
	}
}

class Parallelogramm {
	constructor(points) {
		this._points = points;
	}

	withMovedPoints(position) {
		let newPoints = this._points.slice();
		newPoints.forEach((point, i) => {
			newPoints[i] = point.withAddedX(position.x).withAddedY(position.y);
		});
		return new Parallelogramm(newPoints);
	}

	getMinYPoints() {
		let minY = this._points[0].y;
		this._points.forEach((point) => {
			if (point.y < minY) minY = point.y;
		});

		return this._points.filter((p) => p.y === minY);
	}

	getMaxYPoints() {
		let maxY = this._points[0].y;
		this._points.forEach((point) => {
			if (point.y > maxY) maxY = point.y;
		});

		return this._points.filter((p) => p.y === maxY);
	}

	/**
	 * returns -1 if if tilted left
	 */
	get tilt() {
		return this.topLeft.x < this.bottomLeft.x ? -1 : 1;
	}

	get topLeft() {
		let minYPoints = this.getMinYPoints();

		let minX = minYPoints[0].x;
		let res = minYPoints[0];
		minYPoints.forEach((point) => {
			if (point.x < minX) {
				minX = point.x;
				res = point;
			}
		});
		return res;
	}

	get topRight() {
		let minYPoints = this.getMinYPoints();

		let maxX = minYPoints[0].x;
		let res = minYPoints[0];
		minYPoints.forEach((point) => {
			if (point.x > maxX) {
				maxX = point.x;
				res = point;
			}
		});
		return res;
	}

	get bottomRight() {
		let maxYPoints = this.getMaxYPoints();

		let maxX = maxYPoints[0].x;
		let res = maxYPoints[0];
		maxYPoints.forEach((point) => {
			if (point.x > maxX) {
				maxX = point.x;
				res = point;
			}
		});
		return res;
	}

	get bottomLeft() {
		let maxYPoints = this.getMaxYPoints();

		let minX = maxYPoints[0].x;
		let res = maxYPoints[0];
		maxYPoints.forEach((point) => {
			if (point.x < minX) {
				minX = point.x;
				res = point;
			}
		});
		return res;
	}

	get leftSide() {
		return new Segment(this.topLeft, this.bottomLeft);
	}

	get rightSide() {
		return new Segment(this.topRight, this.bottomRight);
	}

	get topSideLength() {
		return this.topRight.x - this.topLeft.x;
	}

	get rect() {
		let pos = new Point(
			Math.min(this.topLeft.x, this.bottomLeft.x),
			Math.min(this.topLeft.y, this.bottomLeft.y)
		);
		return new Rectangle(
			pos,
			Math.max(this.topRight.x, this.bottomRight.x) - pos.x,
			Math.max(this.topRight.y, this.bottomRight.y) - pos.y
		);
	}
}

//a class to store and swap several items (e. g. hover, checked and normal size/color)
class ItemPalette {
	constructor(items) {
		this._items = items;
		this._index = 0;
	}

	get current() {
		return this._items[this._index];
	}

	setNewItems(items) {
		this._items = items;
		this._index %= this._items.length;
	}

	setCurrentIndex(i) {
		this._index = i;
	}
}

class MouseButtons {
	static NONE = -1;
	static LEFT = 0;
	static CENTRAL = 1;
	static RIGHT = 2;
}

let MOUSE_BUTTON_PRESSED = MouseButtons.NONE;

class DotaTeam {
	static NONE = 0;
	static RADIANT = 1;
	static DIRE = 2;
	static ALL = 3;
}

class InteractionMode {
	static NONE = -1;
	static AREAS = 0;
	static MS = 1;
	static WARDS = 2;
	static ERASE = 3;
}

function isPlayerMode(intMode){
	return intMode == InteractionMode.AREAS ||
	intMode == InteractionMode.MS
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
function isPointInsideRect(point, rect) {
	return (
		point.x >= rect.x &&
		point.x <= rect.x + rect.w &&
		point.y >= rect.y &&
		point.y <= rect.y + rect.h
	);
}

function det(a, b, c, d) {
	return a * d - b * c;
}

function between(a, b, c) {
	return Math.min(a, b) <= c + EPSILON && c <= Math.max(a, b) + EPSILON;
}

function intersection1D(a, b, c, d) {
	if (a > b) [a, b] = [b, a];
	if (c > d) [c, d] = [d, c];
	return Math.max(a, c) <= Math.min(b, d);
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
	if (seg == null || pt == null) return false;
	return between(
		0,
		EPSILON,
		seg.length - pt.distanceBetween(seg.start) - pt.distanceBetween(seg.end)
	);
}

function intersection2D(a, b) {
	let A1 = a.start.y - a.end.y,
		B1 = a.end.x - a.start.x,
		C1 = -A1 * a.start.x - B1 * a.start.y;
	let A2 = b.start.y - b.end.y,
		B2 = b.end.x - b.start.x,
		C2 = -A2 * b.start.x - B2 * b.start.y;
	let zn = det(A1, B1, A2, B2);

	let intersectionPoint = null;

	if (zn != 0) {
		intersectionPoint = new Point(
			(-det(C1, B1, C2, B2) * 1) / zn,
			(-det(A1, C1, A2, C2) * 1) / zn
		);
	}

	return isPointInsideSegment(a, intersectionPoint) &&
		isPointInsideSegment(b, intersectionPoint)
		? intersectionPoint
		: null;
}

function intersectionSegmentCircle(segment, center, radius) {
	let x1 = segment.start.x;
	let y1 = segment.start.y;
	let x2 = segment.end.x;
	let y2 = segment.end.y;
	let xC = center.x;
	let yC = center.y;

	x1 -= xC;
	y1 -= yC;
	x2 -= xC;
	y2 -= yC;

	dx = x2 - x1;
	dy = y2 - y1;

	a = dx * dx + dy * dy;
	b = 2 * (x1 * dx + y1 * dy);
	c = x1 * x1 + y1 * y1 - radius * radius;

	if (-b < 0) return c < 0;
	if (-b < 2 * a) return 4 * a * c - b * b < 0;

	return a + b + c < 0;
}

function intersectionRectangleCircle(rect, center, radius) {
	return (
		intersectionSegmentCircle(
			new Segment(rect.position, rect.position.withAddedX(rect.width)),
			center,
			radius
		) ||
		intersectionSegmentCircle(
			new Segment(
				rect.position.withAddedY(rect.height),
				rect.position.withAddedY(rect.height).withAddedX(rect.width)
			),
			center,
			radius
		) ||
		intersectionSegmentCircle(
			new Segment(rect.position, rect.position.withAddedY(rect.height)),
			center,
			radius
		) ||
		intersectionSegmentCircle(
			new Segment(
				rect.position.withAddedX(rect.width),
				rect.position.withAddedX(rect.width).withAddedY(rect.height)
			),
			center,
			radius
		)
	);
}

//alpha in grad
function rotatePoint(origin, point, alpha) {
	return new Point(
		-Math.sin(alpha * GRAD_TO_RAD) * (point.y - origin.y) +
			Math.cos(alpha * GRAD_TO_RAD) * (point.x - origin.x) +
			origin.x,
		Math.cos(alpha * GRAD_TO_RAD) * (point.y - origin.y) +
			Math.sin(alpha * GRAD_TO_RAD) * (point.x - origin.x) +
			origin.y
	);
}

function resetCampState() {
	camps.forEach((camp) => {
		camp.checked = DotaTeam.NONE;
		camp.size = Camp.normalSize;
	});
}

function updateCampSize() {
	camps.forEach((camp) => {
		camp.updateSize();
	});
}

function getCampGold(camp) {
	let res = 0;
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
			let numMelee = 3;
			let numRange = 1;
			let numCat = 1;
			if (timeSlider.value >= 15) numMelee++;
			if (timeSlider.value >= 30) numMelee++;
			if (timeSlider.value >= 35) numCat++;
			if (timeSlider.value >= 40) numRange++;
			if (timeSlider.value >= 45) numMelee++;

			res =
				2 *
				((37 + timeSlider.value / 7.5) * numMelee +
					(47 + timeSlider.value / 7.5) * numRange);

			if (timeSlider.value % 5 == 0)
				res += (65 + timeSlider.value / 7.5) * numCat;
			break;

		default:
			break;
	}

	return Math.round(res);
}

function loadJSON(callback, file) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open("GET", file, true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}

let cross = new Image();
cross.src = "media/cross.png";

const DEFAULT_ICONS = {
	CROSS: cross,
};

function getImageData(image, w, h) {
	hiddenCanvas.width = w;
	hiddenCanvas.height = h;
	hiddenContext.drawImage(image, 0, 0, w, h);
	return hiddenContext.getImageData(
		0,
		0,
		hiddenCanvas.width,
		hiddenCanvas.height
	).data;
}

function getLocalMouseEventCoords(parent, e) {
	return new Point(e.pageX - parent.clientLeft);
}

function convertToolButtonIdToInteractionMode(id) {
	switch (id) {
		case "wardmode":
			return InteractionMode.WARDS;
		case "erasemode":
			return InteractionMode.ERASE;
		case "areamode":
			return InteractionMode.AREAS;
		case "speedmode":
			return InteractionMode.MS;
		default:
			return InteractionMode.NONE;
	}
}

function convertInteractionModeToToolButtonId(id) {
	switch (id) {
		case InteractionMode.WARDS:
			return "wardmode";
		case InteractionMode.ERASE:
			return "erasemode";
		case InteractionMode.AREAS:
			return "areamode";
		case InteractionMode.MS:
			return "speedmode";
	}
}
