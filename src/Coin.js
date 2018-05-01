/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 19/04/2018 */

/* global Vec, State, wobbleSpeed, wobbleDist, infoBar */

class Coin {
  constructor (pos, basePos, wobble) {
    this.pos = pos
    this.basePos = basePos
    this.wobble = wobble
  }

  get type () {
    return 'coin'
  }

  static create (pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1))
    return new Coin(basePos, basePos, Math.random() * Math.PI * 2)
  }

  collide (state) {
    infoBar.addCoin()
    let filtered = state.actors.filter(a => a !== this)
    let status = state.status
    /* if (!filtered.some(a => a.type === 'coin')) {
      status = 'won'
    } */ // this is no longer the win condition
    return new State(state.level, filtered, status)
  }

  update (time) {
    let wobble = this.wobble + time * wobbleSpeed
    let wobblePos = Math.sin(wobble) * wobbleDist
    return new Coin(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble)
  }
}

Coin.prototype.size = new Vec(0.6, 0.6)
