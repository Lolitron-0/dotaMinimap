class Player {
  _oldStyle = "";
  _area = null;
  _speedCounter = null;
  _calculationResult = 0;

  constructor({ id, team }) {
    this.row = document.getElementById(id);
    this._index = Number(id.replace("player", ""));
    this._oldStyle = this.row.style.cssText;
    this._area = new Area({
      color: this._oldStyle.split(";")[0].split(":")[1],
      team: team,
    });
    this._speedCounter = new SpeedCounter({
      color: this._oldStyle.split(";")[0].split(":")[1],
    });
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

  draw() {
    this._area.draw();
    this._speedCounter.draw();
  }

  proceedCalculation() {
    this._calculationResult = this.activeLogic.calculate();
    this.row.children[this.activeLogic.cellIndex].innerHTML =
      this._calculationResult;
  }
}
