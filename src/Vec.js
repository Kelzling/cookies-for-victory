/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 19/04/2018 */

class Vec { // eslint-disable-line no-unused-vars
  constructor (newX, newY) {
    this.x = newX
    this.y = newY
  }

  plus (otherVec) {
    let newX = this.x + otherVec.x
    let newY = this.y + otherVec.y
    return new Vec(newX, newY)
  }

  minus (otherVec) {
    let newX = this.x - otherVec.x
    let newY = this.y - otherVec.y
    return new Vec(newX, newY)
  }

  times (factor) {
    return new Vec(this.x * factor, this.y * factor)
  }

  get length () {
    let xSq = this.x * this.x
    let ySq = this.y * this.y
    let cSq = xSq + ySq
    let c = Math.sqrt(cSq)
    return c
  }
}
