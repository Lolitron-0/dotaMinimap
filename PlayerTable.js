class PlayerTable extends IDrawable {
  static scale = 1.14;
  constructor(onload = () => {}) {
    //setting up initial positions and boundaries
    super();
    this.cells = [];
    const opaqueWidth = 80 * PlayerTable.scale;
    const defaultWidth = 88 * PlayerTable.scale;
    const defaultHeight = 56 * PlayerTable.scale;
    const radiantBoundary = new Parallelogramm([
      new Point(0, 0),
      new Point(opaqueWidth, 0),
      new Point(defaultWidth, defaultHeight),
      new Point(defaultWidth - opaqueWidth, defaultHeight),
    ]);
    for (let i = 0; i < 5; i++) {
      const newCell = new PlayerCell(
        PlayerTable.scale,
        "media/player" + (i + 1) + ".png",
        radiantBoundary,
        new Point(radiantBoundary.topSideLength * i, 0)
      );
      this.cells.push(newCell);
    }

    this.timer = new DotaTimer(
      this.cells[this.cells.length - 1].position.withAddedX(
        this.cells[this.cells.length - 1].opaqueWidth
      ),
      PlayerTable.scale
    );

    this.timer.setOnload(() => {
      const direBoundary = new Parallelogramm([
        new Point(defaultWidth - opaqueWidth, 0),
        new Point(defaultWidth, 0),
        new Point(opaqueWidth, defaultHeight),
        new Point(0, defaultHeight),
      ]);
      for (let i = 5; i < 10; i++) {
        const newCell = new PlayerCell(
          PlayerTable.scale,
          "media/player" + (i + 1) + ".png",
          direBoundary,
          new Point(
            this.timer.position.x +
              this.timer.width -
              (defaultWidth - opaqueWidth) +
              direBoundary.topSideLength * (i - 5),
            0
          )
        );
        this.cells.push(newCell);
      }
      this.cells[this.cells.length - 1].setOnload(onload);
    });
  }

  onMouseMove(e) {
    this.cells[1].localParallelogramm.withMovedPoints(this.cells[3].position);
    this.cells.forEach((cell) => {
      if (cell.isPointInside(new Point(e.offsetX, e.offsetY))) {
        cell.positionPair.setSecond();
      }
      else
      cell.positionPair.setFirst()
    });
  }

  draw(cx) {
    this.timer.draw(cx);
    this.cells.forEach((cell) => {
      cell.draw(cx);
    });
  }
}

class PlayerCell {
  //bounding curve in local coords
  constructor(scale, imageSource, parallelogrammBounds, position) {
    this.cellImage = new Image();
    this.cellImage.src = imageSource;
    this.localParallelogramm = parallelogrammBounds;
    this.positionPair = new DoubleValue(
      position,
      position
        .withAddedY(this.imageHeight / 6)
        .withAddedX(this.localParallelogramm.tilt*-1*(this.imageWidth - this.opaqueWidth) / 6)
    );
    this.scale = scale;
    this.gold = 0;
    this.time = 0;
    this.checked = false;
    this.updateBoundingCurve();
  }

  setOnload(onload) {
    this.cellImage.onload = onload;
  }

  isPointInside(point) {
    let actualBounds = this.localParallelogramm.withMovedPoints(this.position);
    let raySegment = new Segment(point, point.withAddedX(-10000));
    let res = false;
    if (intersection2D(raySegment, actualBounds.leftSide)) res = !res;
    if (intersection2D(raySegment, actualBounds.rightSide)) res = !res;
    return res;
  }

  setPosition(pos) {
    this.position = new DoubleValue(
      pos,
      pos
        .withAddedY(this.imageHeight / 3)
        .withAddedX((this.imageWidth - this.opaqueWidth) / 3)
    );
    this.updateBoundingCurve();
  }

  updateBoundingCurve() {}

  draw(cx) {
    cx.drawImage(
      this.cellImage,
      this.position.x,
      this.position.y,
      this.localParallelogramm.rect.width,
      this.localParallelogramm.rect.height
    );
  }

  get position() {
    return this.positionPair.current;
  }

  get imageWidth() {
    return this.localParallelogramm.rect.width;
  }

  get imageHeight() {
    return this.localParallelogramm.rect.height;
  }

  get opaqueWidth() {
    return this.localParallelogramm.topSideLength;
  }
}

class DotaTimer extends IDrawable {
  constructor(position, scale) {
    super();
    this.dayImage = new Image();
    this.dayImage.src = "media/day_timer.png";
    this.nightImage = new Image();
    this.nightImage.src = "media/night_timer.png";
    this.minutes = 30;
    this.position = position;
    this.scale = scale;
  }

  setMinutes(minutes) {
    this.minutes = minutes;
  }

  setPosition(position) {
    this.position = position;
  }

  setOnload(onload) {
    this.nightImage.onload = onload;
  }

  draw(cx) {
    if (Math.floor(this.minutes / 5) % 2 == 0)
      cx.drawImage(
        this.dayImage,
        this.position.x,
        this.position.y,
        this.dayImage.width * this.scale,
        this.dayImage.height * this.scale
      );
    else
      cx.drawImage(
        this.nightImage,
        this.position.x,
        this.position.y,
        this.nightImage.width * this.scale,
        this.nightImage.height * this.scale
      );

    cx.font = "16px serif";
    cx.strokeStyle = "white";
    cx.lineWidth = 1;
    cx.strokeText(
      this.minutes + ":00",
      this.position + this.dayImage.width / 2,
      this.position.y + this.dayImage.height / 2
    );
  }

  get width() {
    return this.dayImage.width * this.scale;
  }

  get height() {
    return this.dayImage.height * this.scale;
  }
}
