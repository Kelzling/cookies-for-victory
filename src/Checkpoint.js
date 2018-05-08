/* Created by Kelsey Vavasour and Thomas Baines May 2018
Conforms to StandardJS 09/05/2018 */

/* global Vec */

class Checkpoint {
  constructor (pos) {
    this.pos = pos
    this.touched = false
  }

  get type () {
    return 'checkpoint'
  }

  static create (pos) {
    return new Checkpoint(pos)
  }

  collide (state) {
    if (!this.touched) {
      let player = state.player
      player.updateRespawn(this.pos.minus(new Vec(0, 0.5)))
      this.touched = true
    }
    return state
  }

  update () {
    return this
  }
}

Checkpoint.prototype.size = new Vec(1, 1)
