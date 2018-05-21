/* Created by Kelsey Vavasour and Thomas Baines May 2018
Conforms to StandardJS xx/05/2018 */

class Clock {
  constructor (pos, basePos, wobble) {
    this.pos = pos
    this.basePos = basePos
    this.wobble = wobble
    this.bonusTime = GameEngine.bonusTime
  }

  get type () {
    return 'clock'
  }

  static create (pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1))
    return new Clock(basePos, basePos, Math.random() * Math.PI * 2)
  }

  collide (state) {
    // adds time to Timer when collected, and is then removed from the level
    let timer = state.timer
    timer.addTime(this.bonusTime)
    let filtered = state.actors.filter(a => a !== this)
    let status = state.status
    return new State(state.level, filtered, status)
  }

  update (time) {
    let wobble = this.wobble + time * GameEngine.wobbleSpeed
    let wobblePos = Math.sin(wobble) * GameEngine.wobbleDist
    return new Clock(this.basePos.plus(new Vec(0, wobblePos)), this.basePos, wobble)
  }
}

Clock.prototype.size = new Vec(0.6, 0.6)
