/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 19/04/2018 */

/* global Vec */

class Cone {
  constructor (pos, speed) {
    this.pos = pos
    this.speed = speed
  }

  get type () {
    return 'cone'
  }

  static create (pos, ch) {
    return new cone(pos, new Vec(2, 0))
  }

  collide (state) {
    // player is dying here
    let player = state.player
    return player.die(state)
  }

  update (time, state) {
    let newPos = this.pos.plus(this.speed.times(time))
    if (!state.level.touches(newPos, this.size, 'wall')) {
      return new Cone(newPos, this.speed)
    } else {
      return new Cone(this.pos, this.speed.times(-1))
    }
  }
}

Cone.prototype.size = new Vec(1, 1)