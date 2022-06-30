class Player {
  _oldStyle = "";
  _area = null;
  _speedCounter = null;
  _calculationResult = 0;

  constructor(id, team) {
    this.row = document.getElementById(id);
    this._index = Number(id.replace("player", ""));
    this._oldStyle = this.row.style.cssText;
    this._area = new Area(this._oldStyle.split(";")[0].split(":")[1], team);
    this._speedCounter = new SpeedCounter(
      this._oldStyle.split(";")[0].split(":")[1],
    );
    this.activeLogic = this._area;
  }

  setSelected(value) {
    if (value) {
      this.row.style = SELECTED_ROW_STYLE;
    } else this.row.style.cssText = this._oldStyle;

    document.getElementById("range" + this._index).style.display = value
      ? "initial"
      : "none";

    this.activeLogic.isFocused = value;
  }

  setSpeedCounterMs(ms) {
    this._speedCounter.ms = Number(ms);
  }

  switchTo(mode) {
    switch (mode) {
      case PlayerInteractionMode.AREAS:
        this.activeLogic = this._area;
        break;
      case PlayerInteractionMode.MS:
        this.activeLogic = this._speedCounter;
        break;
      default:
        break;
    }
  }

  getMode() {
    return Play;
  }

  draw(cx) {
    this._area.draw(cx);
    this._speedCounter.draw(cx);
  }

  proceedCalculation() {
    this._calculationResult = this._area.calculate();
    this.row.children[this._area.cellIndex].innerHTML = this._calculationResult;

    this._calculationResult = this._speedCounter.calculate();
    this.row.children[this._speedCounter.cellIndex].innerHTML =
      this._calculationResult;
  }

  proceedEraser(eraser){
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
}
