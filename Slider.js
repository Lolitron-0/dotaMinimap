class Slider {
	constructor(
		height,
		position,
		iconSrc,
		min = 0,
		max = 100,
		step = 1,
		value = 50
	) {
		this._track = document.createElement("div");
		document.body.insertBefore(this._track, insertionElement);

		this._thumb = document.createElement("div");
		this._track.appendChild(this._thumb);
		this._label = document.createElement("div");
		this._labelEnabled = true;
		document.body.insertBefore(this._label, insertionElement);
		this._measureUnits = "";
		this._setupStyle(height, iconSrc);
		this.oninput = () => {};
		this.min = min;
		this.max = max;
		this.step = step;
		this.value = value;
		this._thumbGrabbed = false;
		this.setPosition(position);
		this._setValueForced(value);
		this._setupUiCallbacks();
	}

	setPosition(position) {
		this._track.style.left =
			position.x - this._track.clientWidth / 2 + "px";
		this._track.style.top = position.y + "px";
		this._label.style.left =
			this._track.offsetLeft - this._label.clientWidth / 2 + "px";
		this._label.style.top =
			this._track.offsetTop + this._track.clientHeight + 5 + "px";
		this._updateValueUi();
	}

	setOninput(callback) {
		this.oninput = callback;
	}

	setMeasureUnits(units) {
		this._measureUnits = units;
	}

	setLabelEnabled(val) {
		this._labelEnabled = val;
		this._updateValueUi();
	}

	//sets value ignoring steps
	_setValueForced(value) {
		if (this.value != value) {
			this.value = value;
			this._updateValueUi();
			this.oninput();
		}
	}

	//sets the value as closest step
	_setValue(value) {
		this._setValueForced(
			closestBound(
				Math.floor(value / this.step) * this.step,
				(Math.floor(value / this.step) + 1) * this.step,
				value
			)
		);
	}

	_updateValueUi() {
		this._thumb.style.left =
			this._track.clientWidth / 2 - this._thumb.clientWidth / 2 + "px";

		this._thumb.style.top =
			this._track.clientHeight *
				(1 - (this.value - this.min) / (this.max - this.min)) -
			this._thumb.clientHeight / 2 +
			"px";

		if (this._labelEnabled)
			this._label.innerHTML = Math.round(this.value) + this._measureUnits;
		else this._label.innerHTML = "";
		this._label.style.left =
			this._track.offsetLeft - this._label.clientWidth / 2 + "px";
		this._label.style.top =
			this._track.offsetTop + this._track.clientHeight + 5 + "px";
	}

	_setupStyle(height, iconSrc) {
		this._track.style.height = height + "px";
		this._track.style.width = "5px";
		this._track.style.position = "absolute";
		this._track.style.borderRadius = "5px";
		this._track.style.backgroundColor = "rgb(78, 78, 78)";
		this._track.style.zIndex = "10";
		this._track.style.cursor = "pointer";

		this._thumb.style.width = "25px";
		this._thumb.style.height = "25px";
		this._thumb.style.position = "absolute";
		this._thumb.style.backgroundColor = "transparent";
		this._thumb.style.backgroundImage = 'url("' + iconSrc + '")';
		this._thumb.style.backgroundRepeat = "round";
		this._thumb.style.zIndex = "10";
		this._thumb.style.cursor = "pointer";

		this._label.style.width = "min-content";
		this._label.style.position = "absolute";
		this._label.style.zIndex = "10";
		this._label.style.color = "white";
	}

	_setupUiCallbacks() {
		this._track.onmouseup = (e) => {
			this._setValue(
				this.min +
					(1 -
						(e.clientY - this._track.offsetTop) /
							this._track.clientHeight) *
						(this.max - this.min)
			);
		};

		this._thumb.onmousedown = () => {
			this._thumbGrabbed = true;
		};

		window.addEventListener("mouseup", () => {
			this._thumbGrabbed = false;
		});

		window.addEventListener("mousemove", (e) => {
			if (this._thumbGrabbed) {
				let safeMouseY = e.clientY; //filtered out input values here
				if (e.clientY - this._track.offsetTop < 0)
					safeMouseY = this._track.offsetTop;
				else if (
					e.clientY - this._track.offsetTop >
					this._track.clientHeight
				)
					safeMouseY =
						this._track.clientHeight + this._track.offsetTop;

				this._setValue(
					this.min +
						(1 -
							(safeMouseY - this._track.offsetTop) /
								this._track.clientHeight) *
							(this.max - this.min)
				);
			}
		});
	}
}
