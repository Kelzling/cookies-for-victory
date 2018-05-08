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
  '!': Goal,
  '&': Checkpoint
}