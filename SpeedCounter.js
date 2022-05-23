class SpeedCounter extends BaseLogic {
    constructor({ color }) {
        super({ cellIndex: 2 })
        this.curve = new Curve({ color })
    }

    getTimeInMs(ms) {
        return this.length / ms //TODO: some math here
    }
}