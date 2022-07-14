class PlayerTable extends EventTarget {
	static tableScale = 1.14;
	constructor(onload = () => {}) {
		//setting up initial positions and boundaries
		super();
		this.requestRefreshEvent = new Event("requestRefresh");
		this.cells = [];
		//#region cells init
		const opaqueWidth = 80 * PlayerTable.tableScale;
		const defaultWidth = 88 * PlayerTable.tableScale;
		const defaultHeight = 56 * PlayerTable.tableScale;
		const radiantBoundary = new Parallelogramm([
			new Point(0, 0),
			new Point(opaqueWidth, 0),
			new Point(defaultWidth, defaultHeight),
			new Point(defaultWidth - opaqueWidth, defaultHeight),
		]);
		for (let i = 0; i < 5; i++) {
			const newCell = new PlayerCell(
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
			PlayerTable.tableScale
		);
		this.timer.addEventListener("timerRequestRefersh", () => {
			this._requestRefresh();
		});

		this.timer.setOnload(() => {
			const direBoundary = new Parallelogramm([
				new Point(defaultWidth - opaqueWidth, 0),
				new Point(defaultWidth, 0),
				new Point(opaqueWidth, defaultHeight),
				new Point(0, defaultHeight),
			]);
			for (let i = 5; i < 10; i++) {
				const newCell = new PlayerCell(
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

		this.cells.forEach((cell) => {
			cell.addEventListener("cellRequestRefresh", () => {
				this._requestRefresh();
			});
		});

		//#endregion
		this.selectionChangedEvent = new Event("selectionchanged");
		this.lastCheckedIndex = 0;
		this.setCheckedPlayerIndex(0);
		this.onselectionchanged = () => {};
		this.addEventListener("selectionchanged", () => {
			this.onselectionchanged();
		});
	}

	_requestRefresh() {
		this.dispatchEvent(this.requestRefreshEvent);
	}

	getPlayerMs(playerIndex) {
		return this.cells[playerIndex].msSlider.value;
	}

	setCheckedPlayerIndex(i) {
		if (i < 0 || i > this.cells.length - 1) return;

		this.lastCheckedIndex = i;
		this.cells.forEach((cell) => {
			cell.setPositionIndex(PlayerCell.normalPaletteIndex);
			cell.checked = false;
		});
		this.cells[i].setPositionIndex(PlayerCell.checkedPaletteIndex);
		this.cells[i].checked = true;
		this.dispatchEvent(this.selectionChangedEvent);
	}

	restoreCheck() {
		this.cells[this.lastCheckedIndex].setPositionIndex(
			PlayerCell.checkedPaletteIndex
		);
		this._requestRefresh();
	}

	uncheckAll() {
		this.cells.forEach((cell) => {
			cell.setPositionIndex(PlayerCell.normalPaletteIndex);
		});
		this._requestRefresh();
	}

	onMouseDown(e) {
		this.setCheckedPlayerIndex(
			this.cells.findIndex((cell) =>
				cell.isPointInside(new Point(e.offsetX, e.offsetY))
			)
		);
	}

	onMouseMove(e) {
		this.cells
			.filter((cell) => !cell.checked)
			.forEach((cell) => {
				cell.onMouseMove(e);
			});
	}

	draw(cx) {
		this.timer.draw(cx);
		this.cells.forEach((cell) => {
			cell.draw(cx);
		});
	}
}

class PlayerCell extends EventTarget {
	static normalPaletteIndex = 0;
	static hoveredPaletteIndex = 1;
	static checkedPaletteIndex = 2;

	constructor(imageSource, parallelogrammBounds, position) {
		super();
		this.cellImage = new Image();
		this.cellImage.src = imageSource;
		this.localParallelogramm = parallelogrammBounds;
		this._positionPalette = new ItemPalette(
			this._getPositionsArray(position)
		);
		const goldIcon = new Image();
		goldIcon.src = "media/gold.png";
		this.gold = new TextLine("0", 16, goldIcon);
		const stopWatchIcon = new Image();
		stopWatchIcon.src = "media/stopwatch.png";
		this.time = new TextLine("0 sec", 16, stopWatchIcon);
		this._updateTextPosition();
		this.checked = false;

		this.msSlider = new Slider(
			100,
			this.absolutePosition
				.withAddedX(this.imageWidth / 2)
				.withAddedY(this.imageHeight + 5),
			"media/boot_icon.png",
			250,
			550,
			10,
			300
		);
		this.msSlider.setMeasureUnits("ms");
		this._requestRefreshEvent = new Event("cellRequestRefresh");

		this.msSlider.setOninput(() => {
			recalculateAllPlayers();
			this._requestRefresh();
		});
	}

	_requestRefresh() {
		this.dispatchEvent(this._requestRefreshEvent);
	}

	_getPositionsArray(position) {
		return [
			position,
			position
				.withAddedY(this.imageHeight / 6)
				.withAddedX(
					(this.localParallelogramm.tilt *
						-1 *
						(this.imageWidth - this.opaqueWidth)) /
						6
				),
			position
				.withAddedY(this.imageHeight / 3)
				.withAddedX(
					(this.localParallelogramm.tilt *
						-1 *
						(this.imageWidth - this.opaqueWidth)) /
						3
				),
		];
	}

	_updateTextPosition() {
		this.gold.setPosition(
			this.position
				.withAddedY(this.imageHeight / 4)
				.withAddedX(this.localParallelogramm.rect.width / 5)
		);
		this.time.setPosition(
			this.position
				.withAddedY((2 * this.imageHeight) / 4)
				.withAddedX(this.localParallelogramm.rect.width / 5)
		);
	}

	onMouseMove(e) {
		if (this.checked) return;
		if (this.isPointInside(new Point(e.offsetX, e.offsetY))) {
			this.setPositionIndex(PlayerCell.hoveredPaletteIndex);
		} else this.setPositionIndex(PlayerCell.normalPaletteIndex);
	}

	setOnload(onload) {
		this.cellImage.onload = onload;
	}

	isPointInside(point) {
		let actualBounds = this.localParallelogramm.withMovedPoints(
			this.position
		);
		let raySegment = new Segment(point, point.withAddedX(-10000));
		let res = false;
		if (intersection2D(raySegment, actualBounds.leftSide)) res = !res;
		if (intersection2D(raySegment, actualBounds.rightSide)) res = !res;
		return res;
	}

	setPositionIndex(i) {
		this._positionPalette.setCurrentIndex(i);
		this._updateTextPosition();
		this.msSlider.setPosition(
			this.absolutePosition
				.withAddedX(this.imageWidth / 2)
				.withAddedY(this.imageHeight + 5)
		);
	}

	setPosition(pos) {
		this._positionPalette.setNewItems(this._getPositionsArray(pos));
		this._updateTextPosition();
	}

	draw(cx) {
		cx.drawImage(
			this.cellImage,
			this.position.x,
			this.position.y,
			this.localParallelogramm.rect.width,
			this.localParallelogramm.rect.height
		);
		this.gold.draw(cx);
		this.time.draw(cx);
	}

	get position() {
		return this._positionPalette.current;
	}

	get absolutePosition() {
		return this.position
			.withAddedX(playerCanvas.offsetLeft)
			.withAddedY(playerCanvas.offsetTop);
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

class TextLine extends IDrawable {
	constructor(text, fontSize, icon = new Image()) {
		super();
		this.text = text;
		this.position = new Point(0, 0);
		this.icon = icon;
		this.fontSize = fontSize;
	}

	setPosition(position) {
		this.position = position;
	}

	setText(text) {
		this.text = text;
	}

	draw(cx) {
		cx.drawImage(this.icon, this.position.x, this.position.y);
		cx.font = this.fontSize + "px calibri";
		cx.strokeStyle = "white";
		cx.lineWidth = 1;
		cx.strokeText(
			this.text,
			this.position.x + this.icon.width * 1.3,
			this.position.y + (7 * this.icon.height) / 8
		);
	}
}

class DotaTimer extends EventTarget {
	constructor(position, scale) {
		super();
		this.dayImage = new Image();
		this.dayImage.src = "media/day_timer.png";
		this.nightImage = new Image();
		this.nightImage.src = "media/night_timer.png";
		this._minutes = 30;
		this.position = position;
		this.scale = scale;
		this._requestRefreshEvent = new Event("timerRequestRefersh");

		this.timeSlider = new Slider(
			300,
			new Point(0, 0),
			"media/clock_icon.png",
			10,
			60,
			1,
			30
		);
		this.timeSlider.setLabelEnabled(false);

		this.nightImage.addEventListener("load", () => {
			this.timeSlider.setPosition(
				this.absolutePosition
					.withAddedX(this.width / 2)
					.withAddedY(this.height + 5)
			);
		});
		this.timeSlider.setOninput(() => {
			this.setMinutes(this.timeSlider.value);
			recalculateAllPlayers();
			this._requestRefresh();
		});
	}

	_requestRefresh() {
		this.dispatchEvent(this._requestRefreshEvent);
	}

	setMinutes(minutes) {
		this._minutes = minutes;
	}

	getMinutes() {
		return this._minutes;
	}

	setPosition(position) {
		this.position = position;
	}

	setOnload(onload) {
		this.nightImage.onload = onload;
	}

	draw(cx) {
		if (Math.floor(this._minutes / 5) % 2 == 0)
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

		cx.font = "16px calibri";
		cx.strokeStyle = "white";
		cx.lineWidth = 1;
		cx.strokeText(
			this._minutes + ":00",
			this.position.x + this.dayImage.width / 2,
			this.position.y + this.dayImage.height * 0.95
		);
	}

	get width() {
		return this.dayImage.width * this.scale;
	}

	get height() {
		return this.dayImage.height * this.scale;
	}

	get absolutePosition() {
		return this.position
			.withAddedX(playerCanvas.offsetLeft)
			.withAddedY(playerCanvas.offsetTop);
	}
}
