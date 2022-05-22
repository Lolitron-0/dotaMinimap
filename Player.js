class Player extends Area {

    constructor({ id, team }) {
        super({
            color: document.getElementById(id).style.cssText.split(';')[0].split(':')[1] //get color
        })
        this.row = document.getElementById(id);
        this.oldStyle = this.row.style.cssText;
        this.goldCellHandle = this.row.children[1];
        this.team = team
        this.gold = 0
        this.speedCounter = new SpeedCounter({ color: this.color })
        this.interactionMode = PlayerInteractionMode.AREAS
    }

    switchToOldStyle() {
        if (this.row.style.cssText != this.oldStyle) {
            this.row.style.cssText = this.oldStyle;
        }
    }

    //proceeds calculation according to interact mode
    proceedCalculation() {
        switch (this.interactionMode) {
            case PlayerInteractionMode.AREAS:
                this.proceedCampCalculation()
                break;

            case PlayerInteractionMode.MS:

                break;
            default:
                break;
        }

    }

    proceedMsCalculation() {
        this.speedCounter.getTimeInMs(0) //TODO: some DOM controller value
    }


    proceedCampCalculation() {
        this.gold = 0
        camps.forEach(camp => {
            if (this.isPointInside(new Point({
                    x: camp.position.x + camp.size / 2,
                    y: camp.position.y + camp.size / 2,
                })) &&
                camp.checked != this.team && camp.checked != 3) { //if its not already checked by that team and not checked by all
                if (camp.checked == 0)
                    camp.checked = this.team
                else
                    camp.checked = 3

                this.gold += getCampGold(camp)
                camp.size = Camp.enlargedSize
            }
        });
        this.goldCellHandle.innerHTML = this.gold
    }

}