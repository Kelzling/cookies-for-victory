/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 03/05/2018 */

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
      if(objectType !== 'lava') { // lava can also exist as an actor
        if (state.level.rows[(pos.y+1)][pos.x] === objectType) {
          return true
        } else { // is not above what you're expecting
          return false
        }
      } else { // type you're looking for is lava, this is an exception because it might be an actor also
        if (state.level.rows[(pos.y+1)][pos.x] === objectType) {
          return true
        }
      }
    } else { // this means the thing being searched for is an actor
      let filteredActors = state.filterActors(objectType)
      if (filteredActors.length !== 0) {
        // search the array
        for (let theActor of filteredActors) {
          if (theActor.pos.y > pos.y + 1 // actor must be below the position on the Y axis
            && theActor.pos.y >= pos.y - 1.5 // but not too far below, tolerance of 1.5 units due to falling speed
            && theActor.pos.x > pos.x - 1.2  && theActor.pos.x < pos.x + 1.2 // The actor being searched for is under the absolute position of the player, plus or minus 0.5 units
            ) { // fuzzy check to see if the given position is generally above the object type - levels of tolerance are needed
            return true
          } else {
            return false
          }
        }
      } else { // actor you're looking for does not exist in level, therefore the position can't be above it
        console.warn(`isAbove was called on ${objectType}. There are no instances of this object in the level!`)
        return false
      }
    }
  }
  
}

// const scale = 20
// const wobbleSpeed = 8 // eslint-disable-line no-unused-vars
// const wobbleDist = 0.07 // eslint-disable-line no-unused-vars
// const playerXSpeed = 7 // eslint-disable-line no-unused-vars
// const gravity = 30 // eslint-disable-line no-unused-vars
// const jumpSpeed = 17 // eslint-disable-line no-unused-vars
// const otherSprites = document.createElement('img')
// otherSprites.src = 'img/sprites_20.png'
// const playerSprites = document.createElement('img')
// playerSprites.src = 'img/player_30.png'
// const playerXOverlap = 4 // eslint-disable-line no-unused-vars

// functions currently unattached to a class

// to be moved to Render() and investigated later
/* function elt (name, attrs, ...children) {
  // called elt because it creates elements and gives it some children and child nodes
  let dom = document.createElement(name)
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr])
  }
  for (let child of children) {
    dom.appendChild(child)
  }
  return dom
} */

// depreciated
/* function drawGrid (level) { // eslint-disable-line no-unused-vars
  return elt('table', {
    class: 'background',
    style: `width: ${level.width * scale}px`
  }, ...level.rows.map(row =>
    elt('tr', {style: `height: ${scale}px`},
    ...row.map(type => elt('td', {class: type})))
  ))
} */

// depreciated
/* function drawActors (actors) { // eslint-disable-line no-unused-vars
  return elt('div', {}, ...actors.map(actor => {
    let rect = elt('div', {class: `actor ${actor.type}`})
    rect.style.width = `${actor.size.x * scale}px`
    rect.style.height = `${actor.size.y * scale}px`
    rect.style.left = `${actor.pos.x * scale}px`
    rect.style.top = `${actor.pos.y * scale}px`
    return rect
  }))
} */

/* function overlap (actor1, actor2) { // eslint-disable-line no-unused-vars
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
         actor1.pos.x < actor2.pos.x + actor2.size.x &&
         actor1.pos.y + actor1.size.y > actor2.pos.y &&
         actor1.pos.y < actor2.pos.y + actor2.size.y
} */

/* function trackKeys (keys) {
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
} */

// const gameKeys = GameEngine.trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Tab', 'Backspace'])

/* function runAnimation (frameFunc) {
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
} */

/* function runLevel (level, Display, gameKeys) {
  let display = new Display(document.body, level)
  let state = State.start(level)
  theInfoBar.setLevelCoins(level.startActors.filter(a => a.type == 'coin').length)
  let ending = 1
  return new Promise(resolve => {
    GameEngine.runAnimation(time => {
      state = state.update(time, gameKeys)
      display.setState(state)
      if (state.status === 'playing') {
        return true
      } else if (ending > 0) {
        ending -= time
        return true
      } else {
        display.clear()
        resolve(state.status)
        return false
      }
    })
  })
} */

/* async function runGame (plans, Display) { // eslint-disable-line no-unused-vars
  const gameKeys = GameEngine.trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Tab', 'Backspace'])
  for (let level = 0; level < plans.length;) {
    let status = await GameEngine.runLevel(new Level(plans[level]), Display, gameKeys)
    if (status === 'won') {
      theInfoBar.bank()
      level++
    } else if (status === 'skip' && level < plans.length - 1) {
      level++
    } else if (status === 'back' && level > 0) {
      level--
    } else {
      if (!theInfoBar.looseLife()) { // check if you ran out of lives
        level = 0 // resets you to the first level
      }
    }
  }
  theInfoBar.vanish()
  console.log("You've won!")
} */
