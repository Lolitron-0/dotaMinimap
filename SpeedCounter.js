class SpeedCounter extends PlayerLogic {
    constructor({ color }) {
        super({ cellIndex: 2 })
        this.curve = new Curve({ color })
    }

    draw() {
        if (!this.isFocused) return
        this.curve.draw()
    }

    getTimeInMs(ms) {
        return this.length / ms //TODO: smth here
    }
}