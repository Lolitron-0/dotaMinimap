class Point {
    constructor({ x, y }) {
        this.x = x
        this.y = y
    }

    distanceBetween(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2))
    }
}

//point is {x,y}, rect is {x,y,w,h}
function isPointInsideRect({ point, rect }) {
    return point.x >= rect.x &&
        point.x <= rect.x + rect.w &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.h
}

class DotaTeam {
    static RADIANT = 1;
    static DIRE = 2;
}

class PlayerInteractionMode {
    static AREAS = 0;
    static MS = 1;
}

function resetCampCheckedState() {
    camps.forEach(camp => {
        camp.checked = 0
        camp.size = Camp.normalSize
    });
}


function getCampGold(camp) {
    let res = 0
    switch (camp.type) {
        case "small":
            res = 67 + 4 * (timeSlider.value / 7.5);
            break;
        case "medium":
            res = 88 + 4 * (timeSlider.value / 7.5);
            break;
        case "big":
            res = 100 + 4 * (timeSlider.value / 7.5);
            break;
        case "ancient":
            res = 169 + 3 * (timeSlider.value / 7.5);
            break;
        case "lane":
            let numMelee = 3
            let numRange = 1
            let numCat = 1
            if (timeSlider.value >= 15) numMelee++;
            if (timeSlider.value >= 30) numMelee++;
            if (timeSlider.value >= 35) numCat++;
            if (timeSlider.value >= 40) numRange++;
            if (timeSlider.value >= 45) numMelee++;

            res = 2 * ((37 + timeSlider.value / 7.5) * numMelee +
                (47 + timeSlider.value / 7.5) * numRange);

            if (timeSlider.value % 5 == 0)
                res += (65 + timeSlider.value / 7.5) * numCat
            break;

        default:
            break;
    }

    return Math.round(res)
}