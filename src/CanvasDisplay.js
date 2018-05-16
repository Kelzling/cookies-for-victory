/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 17/05/2018 */

/* global GameEngine */

class CanvasDisplay { // eslint-disable-line no-unused-vars
  constructor (parent, level) {
    this.playerXOverlap = 4
    this.canvas = document.createElement('canvas')
    this.canvas.width = Math.min(600, level.width * GameEngine.scale)
    this.canvas.height = Math.min(450, level.height * GameEngine.scale)
    parent.appendChild(this.canvas)
    this.cx = this.canvas.getContext('2d')

    this.flipPlayer = false

    this.viewport = {
      left: 0,
      top: 0,
      width: this.canvas.width / GameEngine.scale,
      height: this.canvas.height / GameEngine.scale
    }
  }

  clear () {
    this.canvas.remove()
  }

  setState (state) {
    this.updateViewport(state)
    this.clearDisplay(state.status)
    this.drawBackground(state.level)
    this.drawActors(state.actors)
  }

  updateViewport (state) {
    let view = this.viewport
    let margin = view.width / 3
    let player = state.player
    let center = player.pos.plus(player.size.times(0.5))

    if (center.x < view.left + margin) {
      view.left = Math.max(center.x - margin, 0)
    } else if (center.x > view.left + view.width - margin) {
      view.left = Math.min(center.x + margin - view.width, state.level.width - view.width)
    }
    if (center.y < view.top + margin) {
      view.top = Math.max(center.y - margin, 0)
    } else if (center.y > view.top + view.height - margin) {
      view.top = Math.min(center.y + margin - view.height, state.level.height - view.height)
    }
  }

  clearDisplay (status) {
    if (status === 'won') {
      this.cx.fillStyle = 'rgb(68, 191, 255)'
    } else if (status === 'lost' || status === 'dead') {
      this.cx.fillStyle = 'rgb(44, 136, 214'
    } else {
      this.cx.fillStyle = 'rgb(52, 166, 251)'
    }
    this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  flipHorizontally (context, around) {
    context.translate(around, 0)
    context.scale(-1, 1)
    context.translate(-around, 0)
  }

  drawBackground (level) {
    let {left, top, width, height} = this.viewport
    let xStart = Math.floor(left)
    let xEnd = Math.ceil(left + width)
    let yStart = Math.floor(top)
    let yEnd = Math.ceil(top + height)

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        let tile = level.rows[y][x]
        if (tile === 'empty') continue
        let screenX = (x - left) * GameEngine.scale
        let screenY = (y - top) * GameEngine.scale
        let tileX = tile === 'lava' ? GameEngine.scale : 0
        this.cx.drawImage(this.otherSprites,
                          tileX, 0, GameEngine.scale, GameEngine.scale,
                          screenX, screenY, GameEngine.scale, GameEngine.scale)
      }
    }
  }

  drawPlayer (player, x, y,
                        width, height) {
    width += this.playerXOverlap * 2
    x -= this.playerXOverlap
    if (player.speed.x !== 0) {
      this.flipPlayer = player.speed.x < 0
    }

    let tile = 8
    if (player.speed.y !== 0) {
      tile = 9
    } else if (player.speed.x !== 0) {
      tile = Math.floor(Date.now() / 60) % 8
    }

    this.cx.save()
    if (this.flipPlayer) {
      this.flipHorizontally(this.cx, x + width / 2)
    }
    let tileX = tile * width
    this.cx.drawImage(this.playerSprites, tileX, 0, width, height,
                                     x, y, width, height)
    this.cx.restore()
  };

  drawActors (actors) {
    for (let actor of actors) {
      let width = actor.size.x * GameEngine.scale
      let height = actor.size.y * GameEngine.scale
      let x = (actor.pos.x - this.viewport.left) * GameEngine.scale
      let y = (actor.pos.y - this.viewport.top) * GameEngine.scale
      if (actor.type === 'player') {
        this.drawPlayer(actor, x, y, width, height)
      } else {
        // let tileX = (actor.type === 'coin' ? 2 : 1) * GameEngine.scale
        let tileX = 0 // initalize variable
        switch (actor.type) { // select correct displacement to load sprite for the actor.
          case 'lava':
            tileX = 1 * GameEngine.scale
            break
          case 'coin':
            tileX = 2 * GameEngine.scale
            break
          case 'heart':
            tileX = 3 * GameEngine.scale
            break
          case 'cone': // THIS IS A PLACEHOLDER. DO NOT LEAVE THIS AS IS. CHANGE TO NEW TEXTURE ASAP
            tileX = 4 * GameEngine.scale
            break
          case 'goal':
            tileX = 4 * GameEngine.scale
            break
          case 'checkpoint':
            tileX = 5 * GameEngine.scale
            break
        }

        this.cx.drawImage(this.otherSprites,
                          tileX, 0, width, height,
                          x, y, width, height)
      }
    }
  }
}

CanvasDisplay.prototype.otherSprites = document.createElement('img')
CanvasDisplay.prototype.otherSprites.src = 'img/sprites_20.png'

CanvasDisplay.prototype.playerSprites = document.createElement('img')
CanvasDisplay.prototype.playerSprites.src = 'img/player_30.png'
