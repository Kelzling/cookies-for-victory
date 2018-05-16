/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 17/05/2018 */

/* global Vec, GameEngine, State */

class Cone {
  constructor (pos, speed) {
    this.pos = pos
    this.speed = speed
  }

  get type () {
    return 'cone'
  }

  static create (pos, ch) {
    return new Cone(pos, new Vec(2, 0))
  }

  collide (state) {
    // two options. Player runs into side of cone, or player jumps on cone from above.
    let player = state.player
    if (GameEngine.isAbove(state, player.pos, this.type)) { // player hit the cone from above
      let filtered = state.actors.filter(a => a !== this)
      let status = state.status
      return new State(state.level, filtered, status)
    } else { // hit the cone from the side or below, and therefore died
      return player.die(state)
    }
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
