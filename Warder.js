class Warder extends BaseLogic {
  static obsRadius = 100;
  static sentryRadius = 100;
  static grad = 5;
  static observerImage = new Image();
  static sentryImage = new Image();
  _wards = [];
  constructor() {
    super();
    this.type = WardType.OBSERVER;
  }

  onMouseMove(e) {
    const mousePos = new Point({
      x: e.pageX,
      y: e.pageY,
    });

    this._wards.forEach((ward) => {
      ward.hovered = isPointInsideRect(mousePos, {
        x: ward.position.x - Warder.observerImage.width / 2,
        y: ward.position.y - Warder.observerImage.height / 2,
        w: Warder.observerImage.width,
        h: Warder.observerImage.height,
      });
    });
    if (this.isFocused) {
      if (this.type == WardType.OBSERVER) this.traceRays(mousePos, true);
      else this.drawSentry(mousePos);
    }
  }

  onMouseDown(e) {
    const pos = new Point({
      x: e.pageX,
      y: e.pageY,
    });

    let idxHover = this._wards.findIndex((ward) => ward.hovered);
    if (idxHover != -1) {
      this._wards.splice(idxHover, 1);
    } else if (this.isFocused)
      this._wards.push({
        position: pos,
        icon:
          this.type == WardType.OBSERVER
            ? Warder.observerImage
            : Warder.sentryImage,
        rays: this.traceRays(pos, false),
        hovered: false,
        type: this.type,
      });
  }

  //tracing the rays, returns traced arcs
  traceRays(startPoint, draw = false) {
    const currentRay = new Segment({
      start: startPoint,
      end: new Point({
        x: startPoint.x - Warder.obsRadius,
        y: startPoint.y,
      }),
    });

    const rays = [];
    if (draw) cx.beginPath();
    for (let i = 0; i <= 369; i += Warder.grad) {
      let cutted = null;
      for (let i = 0; i < trees.length; i++) {
        const tree = trees[i];
        if (!tree.isPointInside(currentRay.start)) {
          let ray = tree.getTracedRay(currentRay);
          document.body.style.cursor = "crosshair";

          if (
            !ray.end.equals(currentRay.end) && //if ray had intersection
            (cutted == null || cutted.length > ray.length)
          ) {
            // and its length is less than saved
            cutted = ray;
          }
        } else {
          document.body.style.cursor = "not-allowed";
        }
      }

      if (cutted == null) {
        //if no intersection
        if (draw)
          cx.arc(
            startPoint.x,
            startPoint.y,
            currentRay.length,
            (i + 180) * GRAD_TO_RAD,
            (i + 180 + Warder.grad) * GRAD_TO_RAD
          );
        rays.push(currentRay.copy());
      } else {
        if (draw)
          cx.arc(
            startPoint.x,
            startPoint.y,
            cutted.length,
            (i + 180) * GRAD_TO_RAD,
            (i + 180 + Warder.grad) * GRAD_TO_RAD
          );
        rays.push(cutted);
      }

      currentRay.end = rotatePoint(
        currentRay.start,
        currentRay.end,
        Warder.grad
      );
    }
    if (draw) {
      cx.fillStyle = "rgba(255, 255, 0, 0.3)";
      cx.fill();
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
    let maxTree = null;
    trees.forEach((tree) => {
        if (tree.isPointInside(point) && tree.level > maxLevel) maxTree = tree;
    });
    const resultObjects = [];


  }

  draw() {
    this._wards.forEach((ward) => {
      cx.drawImage(
        ward.hovered ? DEFAULT_ICONS.CROSS : ward.icon,
        ward.position.x - Warder.observerImage.width / 2,
        ward.position.y - Warder.observerImage.height / 2,
        40,
        40
      );
      if (ward.type == WardType.OBSERVER) {
        cx.beginPath();
        cx.fillStyle = "rgba(255, 255, 0, 0.3)";
        for (let i = 0; i < ward.rays.length; i++) {
          const ray = ward.rays[i];
          cx.arc(
            ward.position.x,
            ward.position.y,
            ray.length,
            (i * Warder.grad + 180) * GRAD_TO_RAD,
            (i * Warder.grad + 180 + Warder.grad) * GRAD_TO_RAD
          );
        }
        cx.fill();
      } else {
        this.drawSentry(ward.position);
      }
    });
  }
}
