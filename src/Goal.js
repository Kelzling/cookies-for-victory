/* Created by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 01/05/2018 */

/* global State, Vec */

class Goal {
  constructor (pos) {
    this.pos = pos
  }

  get type () {
    return 'goal'
  }

  static create (pos) {
    return new Goal(pos)
  }

  collide (state) {
    return new State(state.level, state.actors, 'won')
  }

  update () {
    return this
  }
}

Goal.prototype.size = new Vec(1, 1)
