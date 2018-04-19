/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 19/04/2018 */

/* global Vec, playerXSpeed, gravity, jumpSpeed */

class Player {
  constructor (pos, speed) {
    this.pos = pos
    this.speed = speed
  }

  get type () {
    return 'player'
  }

  static create (pos) {
    return new Player(pos.plus(new Vec(0, -0.5)),
                      new Vec(0, 0))
  }

  update (time, state, keys) {
    let xSpeed = 0
    if (keys.ArrowLeft) {
      xSpeed -= playerXSpeed
    }
    if (keys.ArrowRight) {
      xSpeed += playerXSpeed
    }
    let pos = this.pos
    let movedX = pos.plus(new Vec(xSpeed * time, 0))
    if (!state.level.touches(movedX, this.size, 'wall')) {
      pos = movedX
    }

    let ySpeed = this.speed.y + time * gravity
    let movedY = pos.plus(new Vec(0, ySpeed * time))
    if (!state.level.touches(movedY, this.size, 'wall')) {
      pos = movedY
    } else if (keys.ArrowUp && ySpeed > 0) {
      ySpeed = -jumpSpeed
    } else {
      ySpeed = 0
    }
    return new Player(pos, new Vec(xSpeed, ySpeed))
  }
}

Player.prototype.size = new Vec(0.8, 1.5)
