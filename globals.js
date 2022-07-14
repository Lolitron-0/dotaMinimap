let players = [];
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

const toolPanel = new ToolPanel()

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
	new Camp(
		"./media/big.png",
		new Point(0.2119815668202765, 0.3951612903225806)
	)
);
camps.push(
	new Camp(
		"./media/big.png",
		new Point(0.7188940092165899, 0.5587557603686636)
	)
);
camps.push(
	new Camp(
		"./media/big.png",
		new Point(0.5633640552995391, 0.23847926267281105)
	)
);
camps.push(
	new Camp(
		"./media/big.png",
		new Point(0.8133640552995391, 0.7142857142857143)
	)
);
camps.push(
	new Camp(
		"./media/big.png",
		new Point(0.36059907834101385, 0.7603686635944701)
	)
);
camps.push(
	new Camp(
		"./media/big.png",
		new Point(0.565668202764977, 0.6728110599078341)
	)
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

let playerTable = new PlayerTable(() => {
	playerTable.draw(playerCx);
});