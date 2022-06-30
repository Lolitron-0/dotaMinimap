let players = null;
let table = null;
let lastSelected = 0;
let lastSelectedMode = PlayerInteractionMode.AREAS;
let trees = [];
const warder = new Warder();
const eraser = new Eraser();

const canvas = document.getElementById("canvas");
const cx = canvas.getContext("2d");
canvas.width = document.documentElement.clientWidth / 2;
canvas.height = document.documentElement.clientWidth / 2;

const playerCanvas = document.getElementById("playerCanvas");
playerCanvas.width = playerCanvas.parentElement.clientWidth;
const playerCx = playerCanvas.getContext("2d");

const camps = [];
//mfs when camps init
//#region CAMPS_INIT
camps.push(
  new Camp(
    "./media/small.png",
    new Point(0.2870229007633588, 0.5206106870229008)
  )
);
camps.push(
  new Camp(
    "./media/small.png",
    new Point(0.2994440031771247, 0.14853057982525814)
  )
);
camps.push(
  new Camp(
    "./media/small.png",
    new Point(0.6405529953917051, 0.5046082949308756)
  )
);
camps.push(
  new Camp(
    "./media/small.png",
    new Point(0.7188940092165899, 0.7903225806451613)
  )
);
camps.push(
  new Camp(
    "./media/medium.png",
    new Point(0.4735023041474654, 0.22350230414746544)
  )
);
camps.push(
  new Camp(
    "./media/medium.png",
    new Point(0.3663594470046083, 0.1728110599078341)
  )
);
camps.push(
  new Camp(
    "./media/medium.png",
    new Point(0.6670506912442397, 0.7730414746543779)
  )
);
camps.push(
  new Camp(
    "./media/medium.png",
    new Point(0.5241935483870968, 0.7672811059907834)
  )
);
camps.push(
  new Camp("./media/big.png", new Point(0.2119815668202765, 0.3951612903225806))
);
camps.push(
  new Camp("./media/big.png", new Point(0.7188940092165899, 0.5587557603686636))
);
camps.push(
  new Camp(
    "./media/big.png",
    new Point(0.5633640552995391, 0.23847926267281105)
  )
);
camps.push(
  new Camp("./media/big.png", new Point(0.8133640552995391, 0.7142857142857143))
);
camps.push(
  new Camp(
    "./media/big.png",
    new Point(0.36059907834101385, 0.7603686635944701)
  )
);
camps.push(
  new Camp("./media/big.png", new Point(0.565668202764977, 0.6728110599078341))
);
camps.push(
  new Camp(
    "./media/big.png",
    new Point(0.35714285714285715, 0.2315668202764977)
  )
);
camps.push(
  new Camp(
    "./media/big.png",
    new Point(0.1728110599078341, 0.22465437788018433)
  )
);
camps.push(
  new Camp(
    "./media/ancient.png",
    new Point(0.15207373271889402, 0.4930875576036866)
  )
);
camps.push(
  new Camp(
    "./media/ancient.png",
    new Point(0.7764976958525346, 0.48963133640552997)
  )
);
camps.push(
  new Camp(
    "./media/lane.png",
    new Point(0.4596774193548387, 0.4976958525345622)
  )
);
camps.push(
  new Camp(
    "./media/lane.png",
    new Point(0.07949308755760369, 0.09216589861751152)
  )
);
camps.push(
  new Camp(
    "./media/lane.png",
    new Point(0.8974654377880185, 0.8847926267281107)
  )
);
//#endregion

const timeSlider = document.getElementById("timeSlider");

let playerTable;

//====================================================================

function refreshMain(e) {
  cx.drawImage(minimapImage, 0, 0, canvas.width, canvas.height);

  players.forEach((player) => {
    player.draw(cx);
  });

  camps.forEach((camp) => {
    camp.draw(cx);
  });

  warder.draw(cx);
  eraser.draw(cx);
}

function refreshPlayerCanvas() {
  playerCx.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
  playerTable.draw(playerCx);
}

function loadTrees() {
  trees = [];
  loadJSON(function (response) {
    data = JSON.parse(response);
    data.forEach((group) => {
      group.trees.forEach((curve) => {
        let current = new Tree(group.level);
        curve.forEach((pair) => {
          current.addPoint(
            new Point(
              pair.split(" ")[0] * canvas.width,
              pair.split(" ")[1] * canvas.height
            ),
            false
          );
        });
        trees.push(current);
      });
    });
    refreshMain(null);
  }, "collision.json");
}

//====================================================================

window.onload = function () {
  playerTable = new PlayerTable(() => {
    playerTable.draw(playerCx);
  });

  const player1 = new Player("player1", DotaTeam.RADIANT);
  const player2 = new Player("player2", DotaTeam.RADIANT);
  const player3 = new Player("player3", DotaTeam.RADIANT);
  const player4 = new Player("player4", DotaTeam.RADIANT);
  const player5 = new Player("player5", DotaTeam.RADIANT);
  const player6 = new Player("player6", DotaTeam.DIRE);
  const player7 = new Player("player7", DotaTeam.DIRE);
  const player8 = new Player("player8", DotaTeam.DIRE);
  const player9 = new Player("player9", DotaTeam.DIRE);
  const player10 = new Player("player10", DotaTeam.DIRE);
  table = document.getElementById("tableBody");

  players = [
    player1,
    player2,
    player3,
    player4,
    player5,
    player6,
    player7,
    player8,
    player9,
    player10,
  ];
  players[0].setSelected(true);

  for (let i = 0; i < players.length; i++) {
    const element = players[i];

    element.row.onclick = function () {
      players.forEach((element) => {
        element.setSelected(false);
      });
      element.setSelected(true);
      Array.from(document.getElementsByClassName("tool-button")).forEach(
        (button) => {
          document.getElementById(button.id).style.transform = "scale(1)";
          warder.isFocused = false;
          eraser.isFocused = false;
        }
      );
      lastSelected = i;

      document.getElementById(
        lastSelectedMode == PlayerInteractionMode.AREAS
          ? "areamode"
          : "speedmode"
      ).style.transform = "scale(0.8)";
    };
  }
  loadTrees();

  refreshMain(null);

  UNIT_TO_PX = canvas.width / 15000;
  PX_TO_UNIT = 15000 / canvas.width;
  Warder.obsRadius = 1600 * UNIT_TO_PX;
  Warder.sentryRadius = 900 * UNIT_TO_PX;

  var b = document.getElementById("wardmode");
  b.setAttribute("state", "obs");
  b.style.background = "url(media/observer_wards.png)";
  Warder.observerImage.src = "media/obs_icon.png";
  Warder.sentryImage.src = "media/sentry_icon.png";

  for (let i = 1; i <= 10; i++) {
    let rowBox = document.getElementById("player" + i).getBoundingClientRect();
    let slider = document.getElementById("range" + i);
    let div = document.getElementById("range" + i + "div");
    let text = document.getElementById("range" + i + "a");
    if (i != 1) slider.style.display = "none"; // 1st is selected
    div.style.top =
      rowBox.y +
      rowBox.height / 2 -
      div.getBoundingClientRect().height / 2 +
      "px";
    slider.oninput = function () {
      players[i - 1].setSpeedCounterMs(slider.value);
      text.innerHTML = slider.value + "ms";
      refreshMain(null);
    };
  }
};

Array.from(document.getElementsByClassName("tool-button")).forEach((button) => {
  button.onclick = function () {
    if (button.id == "wardmode" && button.style.transform == "scale(0.8)") {
      if (button.getAttribute("state") == "obs") {
        button.setAttribute("state", "sentry");
        button.style.background = "url(media/sentry_wards.png)";
        warder.type = WardType.SENTRY;
      } else if (button.getAttribute("state") == "sentry") {
        button.setAttribute("state", "obs");
        button.style.background = "url(media/observer_wards.png)";
        warder.type = WardType.OBSERVER;
      }
    }

    Array.from(document.getElementsByClassName("tool-button")).forEach(
      (button) => {
        button.style.transform = "scale(1)";
        warder.isFocused = false;
        eraser.isFocused = false;
        players.forEach((player) => {
          player.setSelected(false);
        });
      }
    );

    button.style.transform = "scale(0.8)";

    switch (button.id) {
      case "wardmode":
        warder.isFocused = true;
        break;

      case "erasemode":
        eraser.isFocused = true;
        break;

      case "areamode":
        lastSelectedMode = PlayerInteractionMode.AREAS;
        players.forEach((player) => {
          player.switchTo(PlayerInteractionMode.AREAS);
        });
        players[lastSelected].setSelected(true);
        break;

      case "speedmode":
        lastSelectedMode = PlayerInteractionMode.MS;
        players.forEach((player) => {
          player.switchTo(PlayerInteractionMode.MS);
        });
        players[lastSelected].setSelected(true);
        break;

      default:
        break;
    }
  };

  button.onmouseenter = (e) => {
    const tipWindow = document.getElementById("tip");
    tipWindow.style.display = "inherit";
    tipWindow.style.left = e.pageX + 3 + "px";
    tipWindow.style.top = e.pageY + 3 - tipWindow.clientHeight + "px";
    tipWindow.innerHTML = button.getAttribute("text");
  };

  button.onmousemove = (e) => {
    const tipWindow = document.getElementById("tip");
    tipWindow.style.left = e.pageX + 3 + "px";
    tipWindow.style.top = e.pageY + 3 - tipWindow.clientHeight + "px";
  };

  button.onmouseleave = (e) => {
    const tipWindow = document.getElementById("tip");
    tipWindow.style.display = "none";
  };
});

window.onresize = function () {
  canvas.width = document.documentElement.clientHeight / 2;
  canvas.height = document.documentElement.clientHeight / 2;

  camps.forEach((element) => {
    element.resize();
  });

  UNIT_TO_PX = canvas.width / 15000;
  PX_TO_UNIT = 15000 / canvas.width;
  Warder.obsRadius = 1600 * UNIT_TO_PX;
  Warder.sentryRadius = 900 * UNIT_TO_PX;
  loadTrees();
  refreshMain(null);
};

timeSlider.onmousemove = function (e) {
  refreshMain(null);
};

canvas.onmousedown = function (e) {
  MOUSE_BUTTON_PRESSED = e.button;

  players.forEach((player) => {
    player.activeLogic.onMouseDown(e);
  });
  warder.onMouseDown(e);
  eraser.onMouseDown(e);

  if (MOUSE_BUTTON_PRESSED == MouseButtons.CENTRAL) {
    //collision JSON save
    let river = {
      trees: players[0]._area.getAllCurves(),
      level: GroundLevel.RIVER,
    };
    let lg = {
      trees: players[1]._area.getAllCurves(),
      level: GroundLevel.LOW_GROUND,
    };
    let hg = {
      trees: players[2]._area.getAllCurves(),
      level: GroundLevel.HIGH_GROUND,
    };
    let cliff = {
      trees: players[3]._area.getAllCurves(),
      level: GroundLevel.CLIFF,
    };
    let trees = {
      trees: players[4]._area.getAllCurves(),
      level: GroundLevel.CANT_PLACE,
    };

    let data = JSON.stringify([river, lg, hg, cliff, trees]);

    var blob = new Blob([data], { type: "text/json" }),
      e = document.createEvent("MouseEvents"),
      a = document.createElement("a");

    a.download = "collision.json";
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
    e.initMouseEvent(
      "click",
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
    a.dispatchEvent(e);
  }

  for (let i = 0; i < camps.length; i++) {
    //dragging camps
    const element = camps[i];
    if (e.button == 0)
      if (
        isPointInsideRect(
          new Point({
            x: e.pageX,
            y: e.pageX,
          }),
          {
            x: element.position.x,
            y: element.position.y,
            w: element.size,
            h: element.size,
          }
        )
      ) {
        element.hold = true;
        break;
      }
    if (e.button == 2) {
      element.hold = false;
    }
  }
};

canvas.onmouseup = function (e) {
  MOUSE_BUTTON_PRESSED = MouseButtons.NONE;
  players.forEach((player) => {
    player.onMouseUp(e);
  });
  eraser.onMouseUp(e);
  refreshMain(e);
};

canvas.onmousemove = function (e) {
  resetCampState();

  players.forEach((player) => {
    player.onMouseMove(e);
    player.proceedCalculation();
    if (eraser.erasing) player.proceedEraser(eraser);
  });

  updateCampSize();

  if (eraser.erasing) {
    warder.proceedEraser(eraser);
  }

  eraser.onMouseMove(e);
  warder.onMouseMove(e);

  refreshMain(e);
};

//==========================================================================================

playerCanvas.onmousemove = function (e) {
  playerTable.onMouseMove(e)
  refreshPlayerCanvas()
}

//==========================================================================================

