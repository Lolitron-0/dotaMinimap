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

	//this is the only method to manage players logics focus
	switchTo(mode) {
		switch (mode) {
			case InteractionMode.AREAS:
				this.activeLogic = this._area;
				this._area.isFocused = true;
				this._speedCounter.isFocused = false;
				break;
			case InteractionMode.MS:
				this.activeLogic = this._speedCounter;
				this._speedCounter.isFocused = true;
				this._area.isFocused = false;
				break;
			default:
				this.activeLogic.isFocused = false;
				break;
		}
	}

	draw(cx) {
		this._area.draw(cx);
		this._speedCounter.draw(cx);
	}

	proceedCalculation() {
		this._area.calculate();
		this._speedCounter.ms = playerTable.getPlayerMs(this.index)
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