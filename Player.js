class Player {

    constructor({ id, team }) {
        this.id = id
        this.row = document.getElementById(id);
        this.oldStyle = this.row.style.cssText;
        this.team = team
        this.area = new Area({
            color: this.oldStyle.split(';')[0].split(':')[1],
            team: this.team
        })
        this.speedCounter = new SpeedCounter({
            color: this.area.color
        })
        this.activeLogic = this.area
        this.calculationResult = 0
        this.interactionMode = PlayerInteractionMode.AREAS
    }

    setSelected(value) {
        if (value) {
            this.row.style = SELECTED_STYLE
        } else
            this.row.style.cssText = this.oldStyle;

        this.activeLogic.isFocused = value
    }

    switchTo(mode) {
        this.interactionMode = mode
        switch (mode) {
            case PlayerInteractionMode.AREAS:
                this.activeLogic = this.area
                break;
            case PlayerInteractionMode.MS:
                this.activeLogic = this.speedCounter
                break;
            default:
                break;
        }
    }

    draw() {
        this.activeLogic.draw()
    }


    proceedCalculation() {
        this.calculationResult = this.activeLogic.calculate()
        this.row.children[this.activeLogic.cellIndex].innerHTML = this.calculationResult
    }

}