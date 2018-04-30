/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 30/04/2018 */

/* global Player, Coin, Lava, State, Level, requestAnimationFrame, infoBar */

// constant variables for game functions

const levelChars = { // eslint-disable-line no-unused-vars
  '.': 'empty',
  '#': 'wall',
  '+': 'lava',
  '@': Player,
  'o': Coin,
  '3': Heart,
  '=': Lava,
  '|': Lava,
  'v': Lava
}
const scale = 20
const wobbleSpeed = 8 // eslint-disable-line no-unused-vars
const wobbleDist = 0.07 // eslint-disable-line no-unused-vars
const playerXSpeed = 7 // eslint-disable-line no-unused-vars
const gravity = 30 // eslint-disable-line no-unused-vars
const jumpSpeed = 17 // eslint-disable-line no-unused-vars
const otherSprites = document.createElement('img')
otherSprites.src = 'img/sprites_20.png'
const playerSprites = document.createElement('img')
playerSprites.src = 'img/player_30.png'
const playerXOverlap = 4 // eslint-disable-line no-unused-vars

// functions currently unattached to a class

function elt (name, attrs, ...children) {
  // try and figure out why he named this function that, or give it a more sensible name, it confuses me.
  let dom = document.createElement(name)
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr])
  }
  for (let child of children) {
    dom.appendChild(child)
  }
  return dom
}

function drawGrid (level) { // eslint-disable-line no-unused-vars
  return elt('table', {
    class: 'background',
    style: `width: ${level.width * scale}px`
  }, ...level.rows.map(row =>
    elt('tr', {style: `height: ${scale}px`},
    ...row.map(type => elt('td', {class: type})))
  ))
}

function drawActors (actors) { // eslint-disable-line no-unused-vars
  return elt('div', {}, ...actors.map(actor => {
    let rect = elt('div', {class: `actor ${actor.type}`})
    rect.style.width = `${actor.size.x * scale}px`
    rect.style.height = `${actor.size.y * scale}px`
    rect.style.left = `${actor.pos.x * scale}px`
    rect.style.top = `${actor.pos.y * scale}px`
    return rect
  }))
}

function overlap (actor1, actor2) { // eslint-disable-line no-unused-vars
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
         actor1.pos.x < actor2.pos.x + actor2.size.x &&
         actor1.pos.y + actor1.size.y > actor2.pos.y &&
         actor1.pos.y < actor2.pos.y + actor2.size.y
}

function trackKeys (keys) {
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

const arrowKeys = trackKeys(['ArrowLeft', 'ArrowRight', 'ArrowUp'])

function runAnimation (frameFunc) {
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

function runLevel (level, Display) {
  let display = new Display(document.body, level)
  let state = State.start(level)
  infoBar.setLevelCoins(level.startActors.filter(a => a.type == 'coin').length)
  let ending = 1
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys)
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
}

async function runGame (plans, Display) { // eslint-disable-line no-unused-vars
  for (let level = 0; level < plans.length;) {
    let status = await runLevel(new Level(plans[level]), Display)
    if (status === 'won') {
      infoBar.bank()
      level++
    } else {
      if (!infoBar.looseLife()) { // check if you ran out of lives
        level = 0 // resets you to the first level
      }
    }
  }
  infoBar.vanish()
  console.log("You've won!")
}
