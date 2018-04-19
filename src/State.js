/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 19/04/2018 */

/* global overlap */

class State { // eslint-disable-line no-unused-vars
  constructor (newLevel, newActors, newStatus) {
    this.level = newLevel
    this.actors = newActors
    this.status = newStatus
  }

  static start (level) {
    return new State(level, level.startActors, 'playing')
  }

  get player () {
    return this.actors.find(a => a.type === 'player')
  }

  update (time, keys) {
    let actors = this.actors.map(actor => actor.update(time, this, keys))
    let newState = new State(this.level, actors, this.status)

    if (newState.status !== 'playing') {
      return newState
    }

    let player = newState.player
    if (this.level.touches(player.pos, player.size, 'lava')) {
      return new State(this.level, actors, 'lost')
    }

    for (let actor of actors) {
      if (actor !== player && overlap(actor, player)) {
        newState = actor.collide(newState)
      }
    }
    return newState
  }
}
