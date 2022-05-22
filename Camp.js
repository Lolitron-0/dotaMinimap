class Camp {
    static enlargedSize = canvas.width / 15 + 10
    static normalSize = canvas.width / 15

    constructor({ image, position }) {
        Camp.normalSize = canvas.width / 30
        Camp.enlargedSize = canvas.width / 30 + 10

        this.image = new Image()
        this.image.src = image
        this.relPos = position
        this.position = {
            x: canvas.width * this.relPos.x,
            y: canvas.width * this.relPos.y
        }
        this.size = Camp.normalSize
        this.hold = false
        this.type = image.split('/')[image.split('/').length - 1].split('.')[0]

        this.checked = 0; // 0 - not; 1 - radiant; 2 - dire
    }

    resize() {
        Camp.normalSize = canvas.width / 30
        Camp.enlargedSize = canvas.width / 30 + 10
        this.size = Camp.normalSize

        this.position = {
            x: canvas.width * this.relPos.x,
            y: canvas.width * this.relPos.y
        }
    }

    draw() {
        cx.drawImage(this.image, this.position.x, this.position.y, this.size, this.size)
    }
}