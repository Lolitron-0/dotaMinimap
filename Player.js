class Player {
	_area = null;
	_speedCounter = null;

	constructor(team, color, index) {
		this._area = new Area(color, team);
		this._speedCounter = new SpeedCounter(color);
		this.activeLogic = this._area;
		this.index = index
	}

	setMoveSpeed(ms) {
		this._speedCounter.ms = Number(ms);
		this.proceedCalculation();
	}

	switchTo(mode) {
		this.activeLogic.isFocused = true;
		switch (mode) {
			case PlayerInteractionMode.AREAS:
				this.activeLogic = this._area;
				break;
			case PlayerInteractionMode.MS:
				this.activeLogic = this._speedCounter;
				break;
			case PlayerInteractionMode.NONE:
				this.activeLogic.isFocused = false;
				break;
			default:
				break;
		}
	}

	draw(cx) {
		this._area.draw(cx);
		this._speedCounter.draw(cx);
	}

	proceedCalculation() {
		this._area.calculate();
		this._speedCounter.calculate();
	}

	proceedEraser(eraser) {
		this._speedCounter.proceedEraser(eraser);
		this._area.proceedEraser(eraser);
	}

	onMouseDown(e) {
		this.activeLogic.onMouseDown(e);
	}

	onMouseMove(e) {
		this._area.onMouseMove(e);
		this._speedCounter.onMouseMove(e);
	}

	onMouseUp(e) {
		this.activeLogic.onMouseUp(e);
	}

	get gold(){
		return this._area.calculationResult
	}
	get travelTime(){
		return this._speedCounter.calculationResult
	}
}