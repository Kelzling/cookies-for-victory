/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 19/04/2018 */

/* global levelChars, Vec */

class Level { // eslint-disable-line no-unused-vars
  constructor (plan) {
    let rows = plan.trim().split('\n').map(l => [...l])
    this.height = rows.length
    this.width = rows[0].length
    this.startActors = []

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = this.levelChars[ch]
        if (typeof type === 'string') {
          return type
        }
        this.startActors.push(
          type.create(new Vec(x, y), ch))
        return 'empty'
      })
    })
    this.validate()
  }

  touches (pos, size, type) {
    var xStart = Math.floor(pos.x)
    var xEnd = Math.ceil(pos.x + size.x)
    var yStart = Math.floor(pos.y)
    var yEnd = Math.ceil(pos.y + size.y)

    for (var y = yStart; y < yEnd; y++) {
      for (var x = xStart; x < xEnd; x++) {
        let isOutside = x < 0 || x >= this.width ||
                        y < 0 || y >= this.height
        let here = isOutside ? 'wall' : this.rows[y][x]
        if (here === type) return true
      }
    }
    return false
  }
  
  countActors(type) {
    // counts the number of 
    return (this.startActors.filter(a => a.type == type).length)
  }
  
  validate() {
  // level validation - Checks a level for instances of specific objects
  
    if (this.countActors('player') === 0) {
      console.warn('Critical Error: Level has no Player!') // critical error
      throw new ReferenceError('No Players in level!') // catch the no player problem before level is created
    } else if (VERBOSE) {
      console.log('Player detected')
    }
  
    if (this.countActors('goal') === 0) { // goal check
        console.warn('Warning! This level has no goal!') // this is a critical error, so the warning comes through irrespective of VERBOSE
    } else if (VERBOSE) {
        console.log('Goal(s) detected')
    }
    
    if (VERBOSE) { // other checks, these are only run in verbose mode
      if (this.countActors('coin') === 0) {
        console.warn('This level has no coins!')
      } else {
        console.log('Coins detected')
      }
      
      if (this.countActors('heart') === 0) {
        console.log('No hearts detected!')
      } else {
        console.log('No Hearts in level')
      }
    }
  }
}

Level.prototype.levelChars = { // eslint-disable-line no-unused-vars
  '.': 'empty',
  '#': 'wall',
  '+': 'lava',
  '@': Player,
  'o': Coin,
  '3': Heart,
  '=': Lava,
  '|': Lava,
  'v': Lava,
  '!': Goal
}
