import { GA } from './ga_minTest.js'
import { buttons } from './main/mainSetUp/initBottomPanel.js'
import { initLayers, uiLayer } from './main/mainSetUp/initLayers.js'
import { canvas, initCanvasEvents } from './main/mainSetUp/initCanvas.js'
import { initMap } from './main/mainSetUp/initMap.js'
import { debugShape } from '../debug.js'

// export const mainCanvas = {
//   get width() { return 380 },
//   get height() { return 540}
//   // get width() { return canvas.width },
//   // get height() { return canvas.height}
// }


const objects = [
  '🎮',
  '🍴',
  '🎹',
  '🎧',
  '🎥',
  '🎤',
  '🏆',
  '💍',
  '📎',
  '📏',
  '📐',
  '📞',
  '📢',
  '📷',
  '📼',
  '📿',
  '🔧',
  '📌',
  '🛒',
  '🚲'
]

const nonSolids = [
  '🍖',
  '🍔',
  '🍕',
  '🍓',
  '🍎',
  '🍉',
  '🍅',
  '🍰',
  '🐁',
  '🐠',
  '🐓',
  '🐌'
]

const uiStuff = [
  '💵',
  '⭐'
]

const building = [
  '🏭',
]

const movingElements = []

let elementsCanMove = true


const maxShift = 25
const moveSteps = 5
let shiftAmount = 0


const mainBelt = []

const products = []

let pushed = false

let inserted = 0

const surfaceWidth = 414
const surfaceHeight = 812
const cellSize = 73
const PI = Math.PI


let removeElementIndex

const currentAction = {
  placingBuilding: false,
  started: false
}

const K = {
  b : '#000',
  w : '#fff',
  r : '#f00',
  y : '#ff0',
  g : '#555'
}

let g
export let menu
let solids = []
let units = []
let playerUnits = []
let selectedUnits = []
let movingUnits = []
let armedUnits = []
let enemies = []
let attackingTarget = []
let shots = []
let bloodDrops = []
let fadeOuts = []
let miners = []

let removed = false

let debug1
let debug2
let debug3


export let uiElements = []


g = GA.create(mainMenu)
g.start()

// function setSize(element, p1, p2) {
//   element.width = mainCanvas.width * p1
//   element.height = mainCanvas.height * p2
// }

// export function setPos(element, p1, p2, xOffset = 0, yOffset = 0) {
//   element.x = mainCanvas.width * p1 + xOffset
//   element.y = mainCanvas.height * p2 + yOffset
// }

// export function adjustElement(e, w, h, tx, ty) {
//   setSize(e, w, h)
//   if (e.text) {
//     e.text.x = e.width * tx
//     e.text.y = e.height * ty
//   }
// }

function buttonPress(b) {
  b.f = '#FFF'
    g.wait(60, () => b.f = '#800')
}

function removeElement(n) {
  if (elementsCanMove && !pushed) {
    const index = mainBelt.length - n
    const item = mainBelt[index]
    if (item) {
      g.removeItem(mainBelt, item)
      item.visible = false
    }
  }
}

function addElement(x = 10, y = buttons[0].y - 50) {
  const randomElement = nonSolids[g.randomNum(0, nonSolids.length)]
  const t = g.makeText(uiLayer, randomElement, 18, '#FFF', x, y)
  // t.adjust = () => {

  //   // t.y = uiElements[0]. y - 50
  //   // if (DynamicSize) adjustElement(button, width, height, textX, textY)
  //   // if (DynamicPos) setPos(button, xPer, yPer, xOff, -button.height)
  // }
  mainBelt.unshift(t)
  // uiElements.push(t)
}

function moveElements(n = 0) {
  if (elementsCanMove) {
    elementsCanMove = false
    const index = mainBelt.length - n

    for (let i = 0; i < index; i++) {
      movingElements.push(mainBelt[i])
    }

    moveElementsNOW()
  }
  
}

function moveElementsNOW() {
    for (const item of movingElements) {
      item.x += moveSteps
    }
    if (shiftAmount < maxShift) {
      g.wait(1, () => moveElementsNOW())
      
    } else {
      shiftAmount = 0
      
      addElement()
      if (pushed) {
        if (inserted < 2) {
          inserted += 1
          movingElements.push(mainBelt[0])
          moveElementsNOW()
        } else {
          pushed = false
          inserted = 0
          elementsCanMove = true
          movingElements.length = 0
        }
      } else {
        elementsCanMove = true
        movingElements.length = 0
      }
    }
    shiftAmount += moveSteps
  // }
}

function mainMenu(){
  initCanvasEvents()
  initLayers()
  // menu = g.simpleButton('>', 0, 1, 0, .4, .4, () => {
  //   // if (!mainBelt.length) addElement()
  //   // else moveElements()
  //   // buttonPress(menu)
  // }, .15, .1)

  const buttonsHeight = 540
  
  const r1 = g.simpleButton('discard', 4, buttonsHeight, 8, 10, () => {
    removeElement(3)
    moveElements(2)
    buttonPress(r1)
  })

  const r2 = g.simpleButton('remove', r1.x + r1.width + 4, buttonsHeight, 8, 10, () => {
    removeElement(2)
    moveElements(1)
    buttonPress(r2)
  })

  const r3 = g.simpleButton('delete', r2.x + r2.width + 4, buttonsHeight, 8, 10, () => {
    if (elementsCanMove && !pushed) {
      mainBelt.pop().visible = false
      moveElements(0)
    }
    buttonPress(r3)
  })

  const ok = g.simpleButton('OK', r3.x + r3.width + 4, buttonsHeight, 8, 10, () => {

    if (elementsCanMove && !pushed) {
      pushed = true

      const l = mainBelt.length
      for (let i = 1; i < 4; i++) {
        const item = mainBelt[l - i]
        g.removeItem(mainBelt, item)
        products.push(item)
      }
      
      
      products.forEach(p => p.y -= 40)
      moveElements()
    }
    
    buttonPress(ok)
  })

  // const squareWidth = 100
  // const squareHeight = 100
  
  // uiElements.forEach(e => e.adjust())



  for (let i = 0; i < 4; i++) {
    addElement(10 + (25 * (3 - i)))
  }
  
  setup()
}

debug1 = g.makeText(g.stage, 'text 1', 20, '#FFF')
debug2 = g.makeText(g.stage, 'text 2', 20, '#FFF', 0, 20)
debug3 = g.makeText(g.stage, 'text 2', 20, '#FFF', 0, 40)

function setup(){
  // initMap()
  g.state = play
}

function play(){

  debug1.content = `${window.innerWidth}`
  debug2.content = `${window.innerHeight}`


  debug3.content = `canvas ${canvas.width} , ${canvas.height}`

  // if (mainBelt.length < 10) {
  //   addElement()
  // }
  // theText.content = `
  // ${g.pointer.x.toFixed(2)}
  // ${g.pointer.y.toFixed(2)}
  // `

  // theText2.content = `
  // ${menu.gx.toFixed(2)}
  // ${menu.gy.toFixed(2)}
  // `

  // if (g.hitTestPoint(g.pointer, menu)) {
  //   menu.f = '#FFF'
  //   g.wait(50, () => {
  //     menu.f = '#800'
  //   })
  //   console.log('pointer = ', g.pointer.x.toFixed(2), g.pointer.y.toFixed(2))
  //   console.log('button = ', menu.gx, menu.gy)
  // }

  

}

export { 
  g,
  K,
  PI,
  currentAction,
  surfaceHeight,
  surfaceWidth,
  units,
  playerUnits,
  selectedUnits,
  movingUnits,
  miners,
  enemies,
  shots,
  solids,
  attackingTarget,
  armedUnits,
  bloodDrops,
  fadeOuts,
  cellSize
}