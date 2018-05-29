/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 21/05/2018 */

/* global Vec, GameEngine, State */

class Cone {
  constructor (pos, speed) {
    this.pos = pos
    this.speed = speed
  }

  get type () {
    return 'cone'
  }

  static create (pos) {
    return new Cone(pos, new Vec(2, 0))
  }

  collide (state) {
    // two options. Player runs into side of cone, or player jumps on cone from above.
    let player = state.player
    if (GameEngine.isAbove(state, player.pos, this.type)) { // player hit the cone from above
      let filtered = state.actors.filter(a => a !== this)
      let status = state.status
      
      filtered.push(Coin.create(this.pos)) // create a coin where the cone was, to add to the number of coins in the level
      let newState = new State(state.level, filtered, status)
      theInfoBar.addLevelCoins(1)
      return newState
    } else { // hit the cone from the side or below, and therefore died
      return player.die(state)
    }
  }

  update (time, state) {
    let newPos = this.pos.plus(this.speed.times(time))
    if (!state.level.touches(newPos, this.size, 'wall')) {
      let edgedPos = new Vec(newPos.x, newPos.y) // initalize variable
      edgedPos.x = (this.speed.x < 0) ? edgedPos.x - 0.5 : edgedPos.x + 0.5 // correct the edge value depending on the direction the cone is traveling in
      if (GameEngine.isAbove(state, edgedPos, 'wall')) { // if it's above a wall, keep going
        // console.log('next pos is above wall')
        return new Cone(newPos, this.speed)
      }
    }
    return new Cone(this.pos, this.speed.times(-1))
    // this is deliberately not inside an else clause
    // the above line needs to occur if __either__ of the logical tests are true. edgedPos is delcared within the if for efficency purposes.
    // for some reason, this code doesn't result in the cone turning around and going the other way
  }
}

Cone.prototype.size = new Vec(1, 1)
