
//====================================================================

function refreshMain() {
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
	players.forEach((player) => {
		playerTable.cells[player.index].gold.setText(player.gold);
		playerTable.cells[player.index].time.setText(player.travelTime);
	});
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
	}, "./collision.json")
}

//====================================================================

window.onload = function () {
	for (let i = 0; i < 10; i++) {
		players.push(
			new Player(
				i < 5 ? DotaTeam.RADIANT : DotaTeam.DIRE,
				playerColours[i],
				i
			)
		);
	}
	playerTable.setCheckedPlayerIndex(0);

	loadTrees();

	refreshMain(null);

	UNIT_TO_PX = canvas.width / 15000;
	PX_TO_UNIT = 15000 / canvas.width;

	Warder.obsRadius = 1600 * UNIT_TO_PX;
	Warder.sentryRadius = 900 * UNIT_TO_PX;
	Warder.observerImage.src = "media/obs_icon.png";
	Warder.sentryImage.src = "media/sentry_icon.png";

	//for (let i = 1; i <= 10; i++) {
	//	let rowBox = document
	//		.getElementById("player" + i)
	//		.getBoundingClientRect();
	//	let slider = document.getElementById("range" + i);
	//	let div = document.getElementById("range" + i + "div");
	//	let text = document.getElementById("range" + i + "a");
	//	if (i != 1) slider.style.display = "none"; // 1st is selected
	//	div.style.top =
	//		rowBox.y +
	//		rowBox.height / 2 -
	//		div.getBoundingClientRect().height / 2 +
	//		"px";
	//	slider.oninput = function () {
	//		players[i - 1].setSpeedCounterMs(slider.value);
	//		text.innerHTML = slider.value + "ms";
	//		refreshMain(null);
	//	};
	//}
};


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

//timeSlider.oninput = function (e) {
//	playerTable.timer.setMinutes(timeSlider.value);
//	recalculateAllPlayers();
//	refreshMain();
//	refreshPlayerCanvas();
//};

canvas.onmousedown = function (e) {
	MOUSE_BUTTON_PRESSED = e.button;

	players.forEach((player) => {
		player.onMouseDown(e);
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
	players.forEach((player) => {
		player.onMouseMove(e);
		if (eraser.erasing) player.proceedEraser(eraser);
	});

	recalculateAllPlayers();

	if (eraser.erasing) {
		warder.proceedEraser(eraser);
	}

	eraser.onMouseMove(e);
	warder.onMouseMove(e);

	refreshMain();
	refreshPlayerCanvas();
};

//==========================================================================================

playerCanvas.onmousemove = function (e) {
	playerTable.onMouseMove(e);
	refreshPlayerCanvas();
};

playerCanvas.onmousedown = function (e) {
	playerTable.onMouseDown(e);
	refreshPlayerCanvas();
};

playerTable.onselectionchanged = () => {
	players.forEach((player) => {
		player.switchTo(InteractionMode.NONE);
	}); //uncheck all
	players[playerTable.lastCheckedIndex].switchTo(toolPanel.lastCheckedPlayerMode); //switch current player to current mode
	toolPanel.setCheckedMode(toolPanel.lastCheckedPlayerMode)
};

playerTable.addEventListener("requestRefresh", refreshPlayerCanvas)

toolPanel.onselectionchanged = ()=>{
	players[playerTable.lastCheckedIndex].switchTo(toolPanel.checkedMode);
	if(isPlayerMode(toolPanel.checkedMode)) playerTable.restoreCheck()
}
//==========================================================================================

function recalculateAllPlayers() {
	resetCampState();
	players.forEach((player) => {
		player.proceedCalculation();
	});
	updateCampSize();
}
