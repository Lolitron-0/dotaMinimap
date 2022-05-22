class SpeedCounter extends Curve {
    getTimeInMs(ms) {
        return this.length / ms //TODO: some math here
    }
}