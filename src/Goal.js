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