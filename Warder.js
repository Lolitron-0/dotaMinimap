class Warder extends BaseLogic {
	static obsRadius = 100;
	static sentryRadius = 100;
	static grad = 5;
	static observerImage = new Image();
	static sentryImage = new Image();
	_wards = [];
	_mouseWard;
	constructor() {
		super();
		this.type = WardType.OBSERVER;
	}

	onMouseMove(e) {
		const mousePos = new Point(e.offsetX, e.offsetY);

		if (this.isFocused) {
			this._mouseWard = this.traceRays(mousePos);
		}
	}

	onMouseDown(e) {
		const pos = new Point(e.pageX, e.pageY);

		if (this.isFocused)
			this._wards.push({
				position: pos,
				icon:
					this.type == WardType.OBSERVER
						? Warder.observerImage
						: Warder.sentryImage,
				rays: this.traceRays(pos, false),
				type: this.type,
			});
	}

	//tracing the rays, returns traced arcs
	traceRays(startPoint) {
		const currentRay = new Segment(
			startPoint,
			new Point(startPoint.x - Warder.obsRadius, startPoint.y)
		);

		const rays = [];
		const treesToTrace = this.determineProcessObjects(startPoint);
		if (treesToTrace == null) return [];

		for (let i = 0; i <= 369; i += Warder.grad) {
			let cutted = null;
			for (let i = 0; i < treesToTrace.length; i++) {
				const tree = treesToTrace[i];
				let ray = tree.getTracedRay(currentRay);
				if (
					!ray.end.equals(currentRay.end) && //if ray had intersection
					(cutted == null || cutted.length > ray.length) // and its length is less than saved
				) {
					cutted = ray;
				}
			}

			if (cutted == null) {
				//if no intersection
				rays.push(currentRay.copy());
			} else {
				rays.push(cutted);
			}

			currentRay.end = rotatePoint(
				currentRay.start,
				currentRay.end,
				Warder.grad
			);
		}

		return rays;
	}

	drawSentry(point) {
		cx.beginPath();
		cx.arc(point.x, point.y, Warder.sentryRadius, 0, 360);
		cx.fillStyle = "rgba(0, 255, 255, 0.3)";
		cx.fill();
	}

	determineProcessObjects(point) {
		let maxLevel = -1;
		trees.forEach((tree) => {
			if (tree.isPointInside(point) && tree.level > maxLevel)
				maxLevel = tree.level;
		});

		if (maxLevel == GroundLevel.CANT_PLACE) return null;

		const resultObjects = [];
		trees.forEach((tree) => {
			if (tree.level > maxLevel) resultObjects.push(tree);
		});

		return resultObjects;
	}

	draw(cx) {
		this._wards.forEach((ward) => {
			cx.drawImage(
				ward.icon,
				ward.position.x - Warder.observerImage.width / 2,
				ward.position.y - Warder.observerImage.height / 2,
				ward.icon.width,
				ward.icon.height
			);
			if (ward.type == WardType.OBSERVER) {
				this.drawObsRays(ward.rays);
			} else if (this.determineProcessObjects(ward.position)) {
				this.drawSentry(ward.position);
			}
		});

		if (this.isFocused) {
			if (this.type == WardType.OBSERVER)
				this.drawObsRays(this._mouseWard);
			else this.drawSentry(this._mouseWard[0].start);
		}
	}

	drawObsRays(rays) {
		cx.beginPath();
		cx.fillStyle = "rgba(255, 255, 0, 0.3)";
		for (let i = 0; i < rays.length; i++) {
			const ray = rays[i];
			cx.arc(
				ray.start.x,
				ray.start.y,
				ray.length,
				(i * Warder.grad + 180) * GRAD_TO_RAD,
				(i * Warder.grad + 180 + Warder.grad) * GRAD_TO_RAD
			);
		}
		cx.fill();
	}

	proceedEraser(eraser) {
		for (let i = 0; i < this._wards.length; i++) {
			const ward = this._wards[i];
			if (
				intersectionRectangleCircle(
					new Rectangle(
						ward.position,
						Warder.observerImage.width,
						Warder.observerImage.height
					),
					eraser.point,
					eraser.radius
				)
			) {
				this._wards.splice(i, 1);
			}
		}
	}
}
