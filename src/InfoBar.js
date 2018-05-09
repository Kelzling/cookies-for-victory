/* Information bar class for Software Engineering 1b assignment
created April 2018
Created by Thomas Baines and Kelsey Vavasour
updated to conform to standard JS 09/05/2018
*/

/* global DOMRender, VERBOSE */

class InfoBar { // eslint-disable-line no-unused-vars
  constructor () {
    this.lives = 3
    this.coins = 0
    this.levelCoins = [0, 0]
    this.heartAlive = './img/status_heart_alive.png'
    this.heartDead = './img/status_heart_dead.png'
    this.coinSprite = './img/status_coin.png'
    this.loadInfo()
  }

  loadInfo () {
    DOMRender.makeDiv('body', 'statusBar', 'status')
    DOMRender.makeDiv('statusBar', 'Lives')
    DOMRender.insertNBS('statusBar')
    DOMRender.insertNBS('statusBar')
    DOMRender.makeDiv('statusBar', 'Coins')
    for (let i = 1; i < 4; i++) {
      DOMRender.makeImg('Lives', this.heartAlive, i, 'heart')
    }
    DOMRender.makeImg('Lives', this.heartDead, 4, 'heart')
    DOMRender.makeImg('Lives', this.heartDead, 5, 'heart')

    DOMRender.makeDiv('Coins', 'levelCoins')
    DOMRender.makeLabel('levelCoins', 'levelLabel', 'Coins:', 'statusLabel')
    DOMRender.makeLabel('levelCoins', 'levelCoinCount', '0/0', 'statusLabel')
    DOMRender.insertNBS('levelCoins')
    DOMRender.makeImg('levelCoins', this.coinSprite, 'coin01', 'coinImage')

    DOMRender.makeDiv('Coins', 'Bank')
    DOMRender.makeLabel('Bank', 'bankLabel', 'Bank:', 'statusLabel')
    DOMRender.makeLabel('Bank', 'bankCoinCount', '0', 'statusLabel')
    DOMRender.insertNBS('Bank')
    DOMRender.makeImg('Bank', this.coinSprite, 'coin02', 'coinImage')
  }

  vanish () {
    DOMRender.clearByID('statusBar')
	DOMRender.makeHeader('statusBar', 1, 'You win!', 'win')
  }

  setLevelCoins (numCoins) {
    if (VERBOSE) {
      console.log(`Number of coins is ${numCoins}`)
    }
    if (numCoins > 0) {
      this.levelCoins = [0, numCoins]
      this.display()
    } else {
      if (VERBOSE) {
        console.warn('Warning! This level has no coins.')
      }
      this.levelCoins = [0, 0]
      this.display()
    }
  }

  bank () {
    this.coins += this.levelCoins[0]
    this.levelCoins = [0, 0]
    this.display()
  }

  display () {
    // reloads the display to update when something was changed
    DOMRender.updateLabel('levelCoinCount', `${this.levelCoins[0]}/${this.levelCoins[1]}`)
    DOMRender.updateLabel('bankCoinCount', this.coins)
    for (let i = 1; i < 6; i++) {
      if (i <= this.lives) {
        DOMRender.changeImg(i, this.heartAlive)
      } else {
        DOMRender.changeImg(i, this.heartDead)
      }
    }
  }

  addCoin () {
    this.levelCoins[0]++
    this.display()
  }

  resetCoins () {
    // used when you die properly currently - will be subject to change later
    this.coins = 0
    this.levelCoins = [0, 0]
    this.display()
  }

  addLife () {
    // 1 UP!
    if (this.lives < 5) {
      if (VERBOSE) {
        console.log('1 up!')
      }
      this.lives++
      this.display()
    } else {
      // throw new RangeError('Cannot have more than five lives') // this is bad
      if (VERBOSE) {
        console.warn('Too many hearts! Heart not added.')
      }
    }
  }

  looseLife () {
    if (this.lives > 1) {
      if (VERBOSE) {
        console.log('ow!')
      }
      this.lives--
      this.display()
      return true // you haven't died totally - have lives left
    } else {
      if (VERBOSE) {
        console.log('You died!')
      }
      this.resetCoins()
      this.resetLives()
      return false // you ran out of lives, go back to the start
    }
  }

  resetLives () {
    // this is used when you die properly and are reset to level 0
    this.lives = 3
    this.display()
  }

  // code from render begins
}
