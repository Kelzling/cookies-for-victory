/* Created by Kelsey Vavasour and Thomas Baines May 2018
Conforms to StandardJS xx/05/2018 */

/* global GameEngine */

class Timer {
  constructor (pos, timerMax, timerMin, timer) {
    this.pos = pos
    this.timerMax = timerMax
    this.timerMin = timerMin
    this.timer = timer
  }
  
  get type () {
    return 'timer'
  }
  
  get roundedTimer () {
    // return a whole number for display purposes
    return Math.round(this.timer)
  }
  
  static create (pos) {
    return new Timer(pos, GameEngine.timeLimit, 0, GameEngine.timeLimit)
  }
  
  collide (state) {
    // The clock does not interact with the player at all. Also the actual object is invisible nowhere near the timer is actually drawn, it should be impossible for it to be collided with.
    return state
  }
  
  update (time, state) {
    this.timer -= time
    return this
  }
}

// suspect a size is needed for display interface purposes, even though we will be drawing text, not a sprite. To be played with.
Timer.prototype.size = new Vec(1,1)