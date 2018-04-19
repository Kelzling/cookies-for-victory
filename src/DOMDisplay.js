/* Original Code from Eloquent Javascript v3 by Marijin Haverbeke
Refactored and Modified by Kelsey Vavasour and Thomas Baines April 2018
Conforms to StandardJS 19/04/2018 */

/* global elt, drawGrid, drawActors, scale */

class DOMDisplay { // eslint-disable-line no-unused-vars
  constructor (theParent, newLevel) {
    this.dom = elt('div', {class: 'game'}, drawGrid(newLevel))
    this.actorLayer = null
    theParent.appendChild(this.dom)
  }

  clear () {
    this.dom.remove()
  }

  setState (state) {
    if (this.actorLayer) {
      this.actorLayer.remove()
    }
    this.actorLayer = drawActors(state.actors)
    this.dom.appendChild(this.actorLayer)
    this.dom.className = `game ${state.status}`
    this.scrollPlayerIntoView(state)
  }

  scrollPlayerIntoView (state) {
    let width = this.dom.clientWidth
    let height = this.dom.clientHeight
    let margin = width / 3

    // the viewport
    let left = this.dom.scrollLeft
    let right = left + width
    let top = this.dom.scrollTop
    let bottom = top + height

    let player = state.player
    let center = player.pos.plus(player.size.times(0.5)).times(scale)

    if (center.x < left + margin) {
      this.dom.scrollLeft = center.x - margin
    } else if (center.x > right - margin) {
      this.dom.scrollLeft = center.x + margin - width
    }
    if (center.y < top + margin) {
      this.dom.scrollTop = center.y - margin
    } else if (center.y > bottom - margin) {
      this.dom.scrollTop = center.y + margin - height
    }
  }
}
