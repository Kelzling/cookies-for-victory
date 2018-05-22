/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 23/05/2018 */

/* global State, Level, requestAnimationFrame, theInfoBar */

// constant variables for game functions

class GameEngine { // eslint-disable-line no-unused-vars
  static get scale () {
    return 20
  }

  static get wobbleSpeed () {
    return 8
  }

  static get wobbleDist () {
    return 0.07
  }

  static get gravity () {
    return 30
  }

  static get jumpSpeed () {
    return 17
  }

  static get backgroundObjects () {
    return ['empty', 'lava', 'wall']
  }

  static overlap (actor1, actor2) { // eslint-disable-line no-unused-vars
    return actor1.pos.x + actor1.size.x > actor2.pos.x &&
         actor1.pos.x < actor2.pos.x + actor2.size.x &&
         actor1.pos.y + actor1.size.y > actor2.pos.y &&
         actor1.pos.y < actor2.pos.y + actor2.size.y
  }

  static trackKeys (keys) {
    let down = Object.create(null)
    function track (event) {
      if (keys.includes(event.key)) {
        down[event.key] = event.type === 'keydown'
        event.preventDefault()
      }
    }
    window.addEventListener('keydown', track)
    window.addEventListener('keyup', track)
    return down
  }

  static runAnimation (frameFunc) {
    let lastTime = null
    function frame (time) {
      if (lastTime != null) {
        let timeStep = Math.min(time - lastTime, 100) / 1000
        if (frameFunc(timeStep) === false) return
      }
      lastTime = time
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  }

  static runLevel (level, Display, gameKeys) {
    let display = new Display(document.body, level)
    let state = State.start(level)
    theInfoBar.setLevelCoins(level.countActors('coin'))
    let ending = 1
    return new Promise(resolve => {
      GameEngine.runAnimation(time => {
        state = state.update(time, gameKeys)
        display.setState(state)
        if (state.status === 'playing') {
          return true
        } else if (ending > 0) {
          // give the player time to observe their failure
          ending -= time
          return true
        } else if (state.status === 'dead') {
          // Remove the current Player object from the actors array and store it
          let actors = state.actors
          let playerIndex = actors.indexOf(state.player)
          let player = actors.splice(playerIndex, 1)[0] // splice returns an array, so this sets the variable to the one element that is returned
          // Replace it with a new instance of Player that has been moved to the respawn location
          actors.push(player.respawn())
          // reset State to 'playing' with the modified actors array, then update the display and reset the ending variable.
          state = new State(level, actors, 'playing')
          display.setState(state)
          ending = 1
          return true
        } else {
          display.clear()
          resolve(state.status)
          return false
        }
      })
    })
  }

  static async runGame (plans, Display) { // eslint-disable-line no-unused-vars
    const gameKeys = GameEngine.trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Tab', 'Backspace'])
    for (let level = 0; level < plans.length;) {
      let status = await GameEngine.runLevel(new Level(plans[level]), Display, gameKeys)
      if (status === 'won') {
        // add collected coins to the bank and increment the level
        theInfoBar.bank()
        level++
      } else if (status === 'skip' && level < plans.length - 1) {
        level++
      } else if (status === 'back' && level > 0) {
        level--
      } else if (status === 'lost') {
        level = 0 // resets you to the first level
      } else {
        console.warn("shouldn't be getting this message")
      }
    }
    theInfoBar.vanish()
    console.log("You've won!")
  }

  static isAbove (state, pos, objectType) {
    // takes the current state, a vector, and the object type as a string
    if (this.backgroundObjects.includes(objectType)) { // is it one of the background objects
      if (objectType !== 'lava') { // lava can also exist as an actor
        if (state.level.rows[Math.round(pos.y + 1)][Math.round(pos.x)] === objectType) { // had to round x and y values in order to actually access the array elements
          return true
        } else { // is not above what you're expecting
          return false
        }
      } else { // type you're looking for is lava, this is an exception because it might be an actor also
        if (state.level.rows[Math.floor(pos.y + 1)][Math.round(pos.x)] === objectType) {
          return true
        }
      }
    } else { // this means the thing being searched for is an actor
      let filteredActors = state.filterActors(objectType)
      if (filteredActors.length !== 0) {
        // search the array
        for (let theActor of filteredActors) {
          if (theActor.pos.y > pos.y + 1 && // actor must be below the position on the Y axis
            theActor.pos.y >= pos.y - 1.5 && // but not too far below, tolerance of 1.5 units due to falling speed
            theActor.pos.x > pos.x - 1.2 && theActor.pos.x < pos.x + 1.2 // The actor being searched for is under the absolute position of the player, plus or minus 0.5 units
            ) { // fuzzy check to see if the given position is generally above the object type - levels of tolerance are needed
            return true
          } else {
            // this is not the actor you are looking for
            ;
          }
        }
        return false
        /* if you completely execute the for loop, and none of the actors of the provided type are below the position
          then the Position is not above the actor type provided */
      } else { // actor you're looking for does not exist in level, therefore the position can't be above it
        console.warn(`isAbove was called on ${objectType}. There are no instances of this object in the level!`)
        return false
      }
    }
  }
}
