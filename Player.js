class Player {
  _oldStyle = "";
  _area = null;
  _speedCounter = null;
  _calculationResult = 0;

  constructor({ id, team }) {
    this.row = document.getElementById(id);
    this._oldStyle = this.row.style.cssText;
    this._area = new Area({
      color: this._oldStyle.split(";")[0].split(":")[1],
      team: team,
    });
    this._speedCounter = new SpeedCounter({
      color: this._area.color,
    });
    this.activeLogic = this._area;
  }

  setSelected(value) {
    if (value) {
      this.row.style = SELECTED_ROW_STYLE;
    } else this.row.style.cssText = this._oldStyle;

    this.activeLogic.isFocused = value;
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

  draw() {
    this.activeLogic.draw();
  }

  proceedCalculation() {
    this._calculationResult = this.activeLogic.calculate();
    this.row.children[this.activeLogic.cellIndex].innerHTML =
      this._calculationResult;
  }
}
