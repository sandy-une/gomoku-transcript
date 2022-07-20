import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript"

enum STATUS {
    EMPTY = "EMPTY",
    WHITE = "WHITE",
    BLACK = "BLACK",
}

class Stone {
    id: number
    status: STATUS
    element: HTMLDivElement

    constructor(id: number, isFilled: boolean = false) {
        this.id = id
        this.status = isFilled ? STATUS.WHITE : STATUS.EMPTY
        this.element = document.createElement('div')
        this.element.classList.add('stone')
        this.element.classList.add(this.status.toLowerCase())
        //this.element.classList.add(this.status.toLowerCase())
        this.element.addEventListener('click', () => {
            this.handleClick()
        })
    }


    handleClick() {
        if (this.status != STATUS.EMPTY) return
        this.element.classList.remove(this.status.toLowerCase())
        this.status = playerTurn === 0 ? STATUS.WHITE : STATUS.BLACK
        this.element.classList.add(this.status.toLowerCase())
        console.log("Returned state: " + playCheck(this.id, this.status))
        playerTurn = playerTurn === 0 ? 1 : 0
        stoneCount++
    }

}

class Row {
    id: number
    stones: Stone[]
    element: HTMLDivElement

    constructor (id: number, stoneNumber: number) {
        this.id = id
        this.stones = Array.from({length:stoneNumber}).map((_, index) => {
            const stoneID = stoneNumber * id + index
            return new Stone(stoneID)
        })
        this.element = document.createElement('div')
        this.element.classList.add('row')
        this.element.append(...this.stones.map((stone) => stone.element))
    }

}

class Board {
    rows: Row[]
    selectedStones: number[] = []
    element: HTMLDivElement

    constructor(rowNumber: number) {          //Square Board
        this.rows = Array.from({length: rowNumber}).map((_, index) => {
            return new Row(index, rowNumber)
        })
        this.element = document.createElement('div')
        this.element.classList.add('gameboard')
        this.element.append(...this.rows.map((row) => row.element))
    }

}

//TO DO : flatMap??


function playCheck (stoneID: number, stoneStatus: STATUS) {
    console.log("triggered playCheck function")
    //if (stoneCount < 10) return
    const currentBoardState = gameBoard.rows.map((x)=>x.stones).flat().map((y)=>y.status)
    var check = 0
    var loopCounter = 1
    while (loopCounter < 5 && check === 0) {
        check = stoneCounter(stoneID, stoneStatus,currentBoardState, loopCounter)
        loopCounter++
    }

    console.log("Final loop counter value should be 5: " + loopCounter)
    console.log("Final Check Count 0=PlayOn 1=WIN 2=LOSE: " + check)

    if (check === 1) return stoneStatus
    else if (check === 2 && stoneStatus === STATUS.WHITE) return STATUS.BLACK
    else if (check === 2 && stoneStatus === STATUS.BLACK) return STATUS.WHITE
    else return STATUS.EMPTY
}

/********
 * Function: stoneCounter;
 * Takes the prodivded stone and checks for number of same colour connecting stones;
 * Inputs:
 *   stoneID - ID of current stone;
 *   stoneStatus - STATUS of current stone (white or black);
 *   direction:
 *       1 - Horizontal
 *       2 - Vertical
 *       3 - Diagonal Foward
 *       4 - Diagonal Backward
 *********/

function stoneCounter (stoneID: number, stoneStatus: STATUS, currentBoardState: STATUS[], direction: number) {
    const stoneTotal = boardSize * boardSize
    var stepSize:number = 0
    switch(direction) {
        case 1: stepSize = 1; break;
        case 2: stepSize = boardSize; break;
        case 3: stepSize = boardSize - 1; break;
        case 4: stepSize = boardSize + 1; break;
    }
    var statusCount = 1
    //Count Upwards
    var counter = 0
    var newID = stoneID

    while(counter < 5) {
        newID = newID - stepSize
        if (newID < 0) break
        if (currentBoardState[newID] === stoneStatus) { 
            statusCount++ 
        }
        else break;
        counter++
    }

    counter = 0
    newID = stoneID
    while(counter < 5) {
        newID = newID + stepSize
        if (newID >= stoneTotal) break;
        if (currentBoardState[newID] === stoneStatus) {
            statusCount++
        }
        else break;
        counter++
    }

    if (statusCount === 5) return 1
    else if (statusCount > 5) return 2
    else return 0

}


console.log("Starting Build")
var boardSize = 8
const gameBoard = new Board(boardSize)
var playerTurn = 0
var stoneCount = 0
document.getElementById('gameSpace')?.appendChild(gameBoard.element)