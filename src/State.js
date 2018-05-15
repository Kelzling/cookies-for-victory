/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 09/05/2018 */

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
    
    if (CHEATMODE) {
      if (keys.Tab) {
        newState.status = 'skip'
      }
      
      if (keys.Backspace) {
        newState.status = 'back'
      }
    }
    
    if (newState.status !== 'playing') {
      return newState
    }

    let player = newState.player
    if (this.level.touches(player.pos, player.size, 'lava')) {
      return player.die(this)
    }

    for (let actor of actors) {
      if (actor !== player && GameEngine.overlap(actor, player)) {
        newState = actor.collide(newState)
      }
    }
    return newState
  }
  
  filterActors (type) {
    // returns a filtered list of actors containing only the provided type
    let filteredActors = this.startActors.filter(a => a.type === type)
    return filteredActors
  }
  
}
