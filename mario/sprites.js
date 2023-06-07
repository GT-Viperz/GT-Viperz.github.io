class Sprite {
    constructor(img, x, y, type) {
        this.img = img
        this.x = x
        this.y = y
        this.w = img.width
        this.h = img.height
        this.type = type
        this.collidable = COLLIDABLES.includes(type) ? true : false
    }

    display() {
        image(this.img, this.x, this.y, this.w, this.h)
    }
    getTop() {
        return this.y
    }
    getBottom() {
        return this.y + this.h
    }
    getLeft() {
        return this.x
    }
    getRight() {
        return this.x + this.w
    }
    setTop(y) {
        this.y = y
    }
    setBottom(y) {
        this.y = y - this.h
    }
    setLeft(x) {
        this.x = x
    }
    setRight(x) {
        this.x = x - this.w
    }
}

class AnimatedSprite extends Sprite {
    constructor(img, x, y, type, walking, idle, jumping) {
        super(img, x, y, type)
        this.dx = 0
        this.dy = 0
        this.state = 'idle'
        this.walking = walking
        this.idle = idle
        this.jumping = jumping
    }

    display() {
        if (this.state == 'idle') {
            this.animation = this.idle
        }
        else if (this.state == 'walking') {
            this.animation = this.walking
        }
        else if (this.state == 'jumping') {
            this.animation = this.jumping
        }

        let numImages = this.animation.length

        image(this.animation[frameCount % numImages], this.x, this.y)
    }
}

class Enemy extends AnimatedSprite {
    constructor(img, x, y, boundaryLeft, boundaryRight, type, idle, walking) {
        super(img, x, y, type)
        this.dx =  WALKING_SPEED / 3
        this.dy = 0 // A VERY COOL THING TO DO WOULD BE MAKE FLYING ENEMIES FOR PERSONAL TOUCH LATER
        this.state = 'walking'
        this.walking = walking
        this.boundaryLeft = boundaryLeft
        this.boundaryRight = boundaryRight
        this.collidable = true
    }

    update() {
        this.x += this.dx
        if (this.getLeft() < this.boundaryLeft) {
            this.setLeft(this.boundaryLeft)
            this.dx = -this.dx
        }
        else if (this.getRight() > this.boundaryRight) {
            this.setRight(this.boundaryRight)
            this.dx = -this.dx
        }
    }
}

class Friend extends Sprite {
    constructor(img, x, y, boundaryTop, boundaryBottom, type) {
        super(img, x, y, type)
        this.w = 25
        this.h = 25
        this.dx = 0
        this.dy = 0.5
        // this.state = 'jumping'
        // this.jumping = jumping
        this.boundaryTop = boundaryTop
        this.boundaryBottom = boundaryBottom
        this.collidable = true
    }

    update() {
        this.y += this.dy
        if (this.getTop() < this.boundaryTop) {
            // this.setTop(this.boundaryTop) removed so it doesnt jump places
            this.dy = -this.dy
        }
        else if (this.getBottom() > this.boundaryBottom) {
            // this.setBottom(this.boundaryBottom) removed so it doesnt jump places
            this.dy = -this.dy
        }
    }
}

//let it have a place where it exists and jumps up and down and that friend yoriichi gives lives++