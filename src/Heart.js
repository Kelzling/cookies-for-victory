/* Created by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 09/05/2018 */

/* global Vec, State, GameEngine, theInfoBar */

class Heart {
  constructor (pos, basePos, wobble) {
    this.pos = pos
    this.basePos = basePos
    this.wobble = wobble
  }

  get type () {
    return 'heart'
  }

  static create (pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1))
    return new Heart(basePos, basePos, Math.random() * Math.PI * 2)
  }

  collide (state) {
    if(theInfoBar.addLife()) {
      let filtered = state.actors.filter(a => a !== this)
      let status = state.status
      return new State(state.level, filtered, status)
    } else {
      return state
    }
  }

  update (time) {
    let wobble = this.wobble + time * GameEngine.wobbleSpeed
    let wobblePos = Math.sin(wobble) * GameEngine.wobbleDist
    return new Heart(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble)
  }
}

Heart.prototype.size = new Vec(0.6, 0.6)
