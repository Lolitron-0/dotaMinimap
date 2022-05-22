function refresh(e) {
    if (drawing) {
        players[selectedIndex].addPoint(new Point({
            x: e.pageX,
            y: e.pageY
        }))
    }

    resetCampCheckedState();

    cx.drawImage(minimapImage, 0, 0, canvas.width, canvas.height);

    players.forEach(player => {
        player.proceedCalculation()
        player.draw()
    });

    camps.forEach(camp => {
        camp.draw()
    });

}

let players = null
let table = null

const canvas = document.querySelector('canvas')
const cx = canvas.getContext('2d')
canvas.width = document.documentElement.clientWidth / 2;
canvas.height = document.documentElement.clientWidth / 2;

const minimapImage = new Image();
minimapImage.src = "media/Minimap.png";

let selectedIndex = 0;
let drawing = false

const camps = []
    //mfs when camps init
    {
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
    }

const timeSlider = document.querySelector('input')
const matchTimeText = document.querySelector('a')

window.onresize = function() {
    canvas.width = document.documentElement.clientWidth / 2
    canvas.height = document.documentElement.clientWidth / 2

    camps.forEach(element => {
        element.resize()
    });

    refresh(null)
}

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
    player1.row.style = "--bs-table-bg: black;  --bs-table-hover-bg: black; --bs-table-color: white; --bs-table-hover-color: white; border-color: transparent; ";

    for (let i = 0; i < players.length; i++) {
        const element = players[i];

        element.row.onclick = function() {
            selectedIndex = i
            players.forEach(element => {
                element.switchToOldStyle()
            });
            element.row.style = "--bs-table-bg: black;  --bs-table-hover-bg: black; --bs-table-color: white; --bs-table-hover-color: white; border-color: transparent; ";
        }
    }

    refresh(null)
};

timeSlider.onmousemove = function(e) {
    matchTimeText.innerHTML = "Minutes: " + timeSlider.value;
    refresh(null)
}

canvas.onmousedown = function(e) {
    if (e.button == 0) {
        drawing = true;
        players[selectedIndex].startNewCurve();
    }

    for (let i = 0; i < camps.length; i++) {
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
    drawing = false;
    players[selectedIndex].cleanUpSmall()

    if (e.button == 2) {
        for (let i = players.length - 1; i >= 0; i--) {
            const element = players[i];
            if (element.deleteCurves({
                    point: {
                        x: e.pageX,
                        y: e.pageY,
                    }
                }))
                break;
        }
    }
    players[selectedIndex].finishAllCurves();
    refresh(e)
}

canvas.onmousemove = function(e) {
    refresh(e)
};