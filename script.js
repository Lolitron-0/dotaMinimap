let players = null
let table = null
let trees = []

const canvas = document.querySelector('canvas')
const cx = canvas.getContext('2d')
canvas.width = document.documentElement.clientWidth / 2;
canvas.height = document.documentElement.clientWidth / 2;

const minimapImage = new Image();
minimapImage.src = "media/Minimap.png";


const camps = []
    //mfs when camps init
    //#region CAMPS_INIT
camps.push(new Camp({
    image: "./media/small.png",
    position: {
        x: 0.2870229007633588,
        y: 0.5206106870229008
    }
}))
camps.push(new Camp({
    image: "./media/small.png",
    position: {
        x: 0.2994440031771247,
        y: 0.14853057982525814
    }
}))
camps.push(new Camp({
    image: "./media/small.png",
    position: {
        x: 0.6405529953917051,
        y: 0.5046082949308756
    }
}))
camps.push(new Camp({
    image: "./media/small.png",
    position: {
        x: 0.7188940092165899,
        y: 0.7903225806451613
    }
}))
camps.push(new Camp({
    image: "./media/medium.png",
    position: {
        x: 0.4735023041474654,
        y: 0.22350230414746544
    }
}))
camps.push(new Camp({
    image: "./media/medium.png",
    position: {
        x: 0.3663594470046083,
        y: 0.1728110599078341
    }
}))
camps.push(new Camp({
    image: "./media/medium.png",
    position: {
        x: 0.6670506912442397,
        y: 0.7730414746543779
    }
}))
camps.push(new Camp({
    image: "./media/medium.png",
    position: {
        x: 0.5241935483870968,
        y: 0.7672811059907834
    }
}))
camps.push(new Camp({
    image: "./media/big.png",
    position: {
        x: 0.2119815668202765,
        y: 0.3951612903225806
    }
}))
camps.push(new Camp({
    image: "./media/big.png",
    position: {
        x: 0.7188940092165899,
        y: 0.5587557603686636
    }
}))
camps.push(new Camp({
    image: "./media/big.png",
    position: {
        x: 0.5633640552995391,
        y: 0.23847926267281105
    }
}))
camps.push(new Camp({
    image: "./media/big.png",
    position: {
        x: 0.8133640552995391,
        y: 0.7142857142857143
    }
}))
camps.push(new Camp({
    image: "./media/big.png",
    position: {
        x: 0.36059907834101385,
        y: 0.7603686635944701
    }
}))
camps.push(new Camp({
    image: "./media/big.png",
    position: {
        x: 0.565668202764977,
        y: 0.6728110599078341
    }
}))
camps.push(new Camp({
    image: "./media/big.png",
    position: {
        x: 0.35714285714285715,
        y: 0.2315668202764977
    }
}))
camps.push(new Camp({
    image: "./media/big.png",
    position: {
        x: 0.1728110599078341,
        y: 0.22465437788018433
    }
}))
camps.push(new Camp({
    image: "./media/ancient.png",
    position: {
        x: 0.15207373271889402,
        y: 0.4930875576036866
    }
}))
camps.push(new Camp({
    image: "./media/ancient.png",
    position: {
        x: 0.7764976958525346,
        y: 0.48963133640552997
    }
}))
camps.push(new Camp({
    image: "./media/lane.png",
    position: {
        x: 0.4596774193548387,
        y: 0.4976958525345622
    }
}))
camps.push(new Camp({
    image: "./media/lane.png",
    position: {
        x: 0.07949308755760369,
        y: 0.09216589861751152
    }
}))
camps.push(new Camp({
        image: "./media/lane.png",
        position: {
            x: 0.8974654377880185,
            y: 0.8847926267281107
        }
    }))
    //#endregion

const timeSlider = document.querySelector('input')
const matchTimeText = document.querySelector('a')


warder = new Warder()

//====================================================================


function refresh(e) {
    if (e != null)
        players.forEach(player => {
            player.activeLogic.onMouseMove(e)
        });

    resetCampCheckedState();

    cx.drawImage(minimapImage, 0, 0, canvas.width, canvas.height);

    players.forEach(player => {
        player.proceedCalculation()
        player.draw()
    });

    camps.forEach(camp => {
        camp.draw()
    });

    //for (let i = 0; i < trees.length; i++) {
    //    const tree = trees[i];
    //    tree.draw()
    //}

}

function loadTrees() {
    loadJSON(function(response) {
        data = JSON.parse(response)
        data.forEach(curve => {
            current = new Tree({ level: GroundLevel.HIGH_GROUND })
            curve.forEach(pair => {
                current.addPoint(new Point({
                    x: pair.split(' ')[0] * canvas.width,
                    y: pair.split(' ')[1] * canvas.height
                }), false)
            });
            trees.push(current)
        });
        refresh(null)
    }, "collision.json")
}

//====================================================================


window.onload = function() {
    const player1 = new Player({ id: "player1", team: DotaTeam.RADIANT })
    const player2 = new Player({ id: "player2", team: DotaTeam.RADIANT })
    const player3 = new Player({ id: "player3", team: DotaTeam.RADIANT })
    const player4 = new Player({ id: "player4", team: DotaTeam.RADIANT })
    const player5 = new Player({ id: "player5", team: DotaTeam.RADIANT })
    const player6 = new Player({ id: "player6", team: DotaTeam.DIRE })
    const player7 = new Player({ id: "player7", team: DotaTeam.DIRE })
    const player8 = new Player({ id: "player8", team: DotaTeam.DIRE })
    const player9 = new Player({ id: "player9", team: DotaTeam.DIRE })
    const player10 = new Player({ id: "player10", team: DotaTeam.DIRE })
    table = document.getElementById("tableBody");

    players = [player1, player2, player3, player4, player5, player6, player7, player8, player9, player10];
    players[0].setSelected(true);

    for (let i = 0; i < players.length; i++) {
        const element = players[i];

        element.row.onclick = function() {
            players.forEach(element => {
                element.setSelected(false)
            });
            element.setSelected(true);
        }
    }

    loadTrees()

    refresh(null)
};


window.onresize = function() {
    canvas.width = document.documentElement.clientWidth / 2
    canvas.height = document.documentElement.clientWidth / 2

    camps.forEach(element => {
        element.resize()
    });

    refresh(null)
}


timeSlider.onmousemove = function(e) {
    matchTimeText.innerHTML = "Minutes: " + timeSlider.value;
    refresh(null)
}

window.onkeydown = function(e) {
    if (e.code == 'KeyW') {
        warder.isFocused = !warder.isFocused
    }
}


canvas.onmousedown = function(e) {
    MOUSE_BUTTON_PRESSED = e.button

    players.forEach(player => {
        player.activeLogic.onMouseDown(e)
    });

    if (MOUSE_BUTTON_PRESSED == MouseButtons.CENTRAL) {
        let river = [players[0].activeLogic.getAllCurves(), GroundLevel.RIVER]
        let lg = [players[1].activeLogic.getAllCurves(), GroundLevel.LOW_GROUND]
        let hg = [players[2].activeLogic.getAllCurves(), GroundLevel.HIGH_GROUND]
        let cliff = [players[3].activeLogic.getAllCurves(), GroundLevel.CLIFF]
        let trees = [players[4].activeLogic.getAllCurves(), GroundLevel.CANT_PLACE]

        let data = JSON.stringify([river, lg, hg, cliff, trees])

        var blob = new Blob([data], { type: 'text/json' }),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a')

        a.download = "collision.json"
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }

    for (let i = 0; i < camps.length; i++) { //dragging camps
        const element = camps[i]
        if (e.button == 0)
            if (isPointInsideRect({
                    point: {
                        x: e.pageX,
                        y: e.pageX,
                    },
                    rect: {
                        x: element.position.x,
                        y: element.position.y,
                        w: element.size,
                        h: element.size,
                    }
                })) {
                element.hold = true;
                break;
            }
        if (e.button == 2) {
            element.hold = false;
        }
    }
}

canvas.onmouseup = function(e) {
    players.forEach(player => {
        player.activeLogic.onMouseUp(e)
    });
    refresh(e)
}

canvas.onmousemove = function(e) {
    refresh(e)
    warder.onMouseMove(e)
};