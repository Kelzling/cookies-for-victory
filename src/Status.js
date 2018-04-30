/* Status bar class for Software Engineering 1b assignment
created April 2018
Created by Thomas Baines and Kelsey Vavasour 
updated to conform to standard JS 30/04/2018
*/

class Status { // eslint-disable-line no-unused-vars
  constructor () {
    this.lives = 3
    this.coins = 0
    this.levelCoins = [0, 0]
    this.heartAlive = './img/status_heart_alive.png'
    this.heartDead = './img/status_heart_dead.png'
    this.coinSprite = './img/status_coin.png'
    this.makeDiv('body', 'statusBar', 'status')
    this.makeDiv('statusBar', 'Lives')
    this.insertNBS('statusBar')
    this.insertNBS('statusBar')
    this.makeDiv('statusBar', 'Coins')
    for (let i = 1; i < 4; i++) {
      this.makeImg('Lives', this.heartAlive, i, 'heart')
    }
    this.makeImg('Lives', this.heartDead, 4, 'heart')
    this.makeImg('Lives', this.heartDead, 5, 'heart')
    
    this.makeDiv('Coins', 'levelCoins')
    this.makeLabel('levelCoins', 'levelLabel', 'Level:', 'statusLabel')
    this.makeLabel('levelCoins', 'levelCoinCount', '0/0', 'statusLabel')
    this.insertNBS('levelCoins')
    this.makeImg('levelCoins', this.coinSprite, 'coin01', 'coinImage')
    
    this.makeDiv('Coins', 'Bank')
    this.makeLabel('Bank', 'bankLabel', 'Bank:', 'statusLabel')
    this.makeLabel('Bank', 'bankCoinCount', '0', 'statusLabel')
    this.insertNBS('Bank')
    this.makeImg('Bank', this.coinSprite, 'coin02', 'coinImage')
  }
  
  vanish() {
    this.clearByID('body')
  }
  
  setLevelCoins(numCoins) {
    if (VERBOSE) {
      console.log(`Number of coins is ${numCoins}`)
    }
    if (numCoins > 0) {
      this.levelCoins = [0, numCoins]
      this.display()
    } else if (VERBOSE) {
      console.warn('Warning! This level has no coins.')
    }
  }
  
  bank() {
    this.coins += this.levelCoins[0]
    this.levelCoins = [0, 0]
    this.display()
  }

  display () {
    // reloads the display to update when something was changed
    this.updateLabel('levelCoinCount', `${this.levelCoins[0]}/${this.levelCoins[1]}`)
    this.updateLabel('bankCoinCount', this.coins)
    for (let i = 1; i < 6; i++) {
      if (i <= this.lives) {
        this.changeImg(i, this.heartAlive)
      } else {
        this.changeImg(i, this.heartDead)
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
        console.log('Too many hearts! Heart not added.')
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
  
  resetLives() {
    // this is used when you die properly and are reset to level 0
    this.lives = 3
    this.display()
  }

  // code from render begins

  find (elementID) {
    let theElement = document.getElementById(elementID)
    if (theElement) {
      return theElement
    } else {
      throw new ReferenceError('Element not found')
    }
  }

  clearMultiplebyID (...idList) {
    for (let item of idList) {
      this.clearByID(item)
    }
  }

  clearByID (elementId) {
    if (!elementId === 'body') {
      let theElement = this.find(elementId)
      theElement.innerHTML = ''
    } else {
      document.body.innerHTML = ''
    }
  }

  clearByClass (className) {
    let elementList = document.getElementsByClassName(className)
    if (elementList.length > 0) {
      for (let item of elementList) {
        item.innerHTML = ''
      }
    } else {
      throw new ReferenceError('No Elements Found')
    }
  }

  getParent (parentID) {
    if (parentID === 'body') {
      return document.body
    } else {
      return this.find(parentID)
    }
  }

  makeDiv (myParent, id, className = undefined) {
    let newDiv = document.createElement('div')
    newDiv.setAttribute('id', id)
    newDiv.setAttribute('class', className)
    let theParent = this.getParent(myParent)
    theParent.appendChild(newDiv)
  }

  makeHeader (myParent, headerType, value, id, className = undefined) {
    // this code is hacky and inelegant but case statements throw errors, and trying to make
    // the code smart enought to parse the value its given into h1, h2 and h3
    // resulted in a hail of errors I'm not smart enough to understand or resolve

    if (headerType == 1) { // eslint-disable-line eqeqeq
      var newHeader = document.createElement('h1')
    } else if (headerType == 2) { // eslint-disable-line eqeqeq
      var newHeader = document.createElement('h2') // eslint-disable-line no-redeclare
    } else if (headerType == 3) { // eslint-disable-line eqeqeq
      var newHeader = document.createElement('h3') // eslint-disable-line no-redeclare
    } else {
      throw new RangeError('Only inputs of h1, h2, and h3 are supported') // other types of headers aren't used in this program
    }

    let theValue = document.createTextNode(value)
    newHeader.appendChild(theValue)
    newHeader.setAttribute('id', id)
    newHeader.setAttribute('class', className)
    let theParent = this.getParent(myParent)
    theParent.appendChild(newHeader)
  }

  makeLabel (myParent, id, newText, className = undefined) {
    let theLabel = document.createElement('label')
    let labelText = document.createTextNode(newText)
    theLabel.appendChild(labelText)
    theLabel.setAttribute('id', id)
    theLabel.setAttribute('class', className)
    let theParent = this.getParent(myParent)
    theParent.appendChild(theLabel)
  }

  makeBreak (myParent) {
    let theParent = this.getParent(myParent)
    let newBreak = document.createElement('br')
    theParent.appendChild(newBreak)
  }

  insertNBS (myParent) {
    let theParent = this.getParent(myParent)
    theParent.innerHTML += '&nbsp'
  }

  // code from render ends

  makeImg (myParent, src, id, className = undefined) {
    // create image element using DOM suite
    let newImg = document.createElement('img')
    newImg.setAttribute('src', src)
    newImg.setAttribute('id', id)
    newImg.setAttribute('class', className)
    let theParent = this.getParent(myParent)
    theParent.appendChild(newImg)
  }

  changeImg (id, src) {
    // used to update the image on an element. Primarily to change hearts between Coloured and Grey
    let theImg = this.find(id)
    theImg.setAttribute('src', src)
  }

  updateLabel (id, newText) {
    let theLabel = this.find(id)
    theLabel.innerHTML = newText
  }
}
