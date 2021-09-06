import { smelter, space } from "./initEquipments.js"
import { cashText, stats, g, valueText, healthText, operationText, totalText, repairText } from "./main.js"

export let toBeSmelted = []
const productsMaxMove = 75
let productsMoveAmount = 0
let smeltTime, currentSmeltTime, spaceValue

let operationCost

let total

export function moveToSmelter() {
  if (productsMoveAmount < productsMaxMove) {
    productsMoveAmount += 5
    toBeSmelted.forEach(p => p.x -= 5)
    g.wait(5, () => {
      moveToSmelter()
    })
  } else {
    productsMoveAmount = 0
    startSmelting()
  }
}

function startSmelting() {

  smeltTime = g.randomNum(150, 400)
  currentSmeltTime = 0
  smelter.readyBar.visible = false
  
  smelt()

  spaceValue = 0

  operationCost = 10 * [...new Set(toBeSmelted)].length

  toBeSmelted.forEach(p => {
    spaceValue += p.value
    smelter.health -= p.damage
    g.remove(p)
  })

  stats.repairCost += (smelter.baseHealth - smelter.health) * 10

  toBeSmelted.length = 0
  
}

function smelt() {
  if (currentSmeltTime < smeltTime) {
    currentSmeltTime += 1
    smelter.bar.width = (currentSmeltTime / smeltTime) * 60
    g.wait(5, () => smelt())
  } else {
    leftAmount = 0
    upAmount = 0
    space.visible = true

    total = spaceValue - operationCost

    valueText.content = `Value = ${spaceValue}`
    operationText.content = `Operation Cost = ${operationCost}`
    totalText.content = `Total = ${total}`

    repairText.content = `Repair Cost = ${stats.repairCost}`

    
    
    healthText.content = `Health: ${smelter.health}`
    if (smelter.health <= 0) {
      smelter.break()
    } else {
      g.wait(1000, () => {
        smelter.readyBar.visible = true
        smelter.ready = true
      })
    }



    eject()
  }
}

const leftSteps = 115
const upSteps = 500
let leftAmount, upAmount

function eject() {
  if (leftAmount < leftSteps) {
    leftAmount += 5
    space.x -= 5
    g.wait(1, eject)
  } else {
    

    // stats.currentCash += stats.displayedCash + spaceValue
    stats.currentCash += total

    changeValue()

    g.wait(500, moveUp)
    
  }
}

function moveUp() {
  if (upAmount < upSteps) {
    upAmount += 7
    space.y -= 7
    g.wait(1, moveUp)
  } else {
    space.visible = false
    space.x = 310
    space.y = 115
  }
}

export function changeValue() {
  if (stats.displayedCash != stats.currentCash) {
    if (stats.displayedCash < stats.currentCash) stats.displayedCash += 5
    else stats.displayedCash -= 5
    cashText.content = `${stats.displayedCash}`
    g.wait(2, changeValue)
  }
}

