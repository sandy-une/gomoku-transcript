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
        this.element.addEventListener('click', () => {
            this.handleClick()
        })
    }

    handleClick() {
        if (this.status != STATUS.EMPTY) return
        this.element.classList.remove(this.status.toLowerCase())
        this.status = playerTurn === 0 ? STATUS.WHITE : STATUS.BLACK
        this.element.classList.add(this.status.toLowerCase())
        updateGameState(playCheck(this.id, this.status))
    }

    resetState() {
        this.element.classList.remove(this.status.toLowerCase())
        this.status = STATUS.EMPTY
        this.element.classList.add(this.status.toLowerCase())
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

    resetState() {
        this.stones.forEach((x) => x.resetState())
    }
}

class Board {
    rows: Row[]
    selectedStones: number[] = []
    element: HTMLDivElement

    constructor(rowNumber: number) {
        this.rows = Array.from({length: rowNumber}).map((_, index) => {
            return new Row(index, rowNumber)
        })
        this.element = document.createElement('div')
        this.element.classList.add('gameboard')
        this.element.append(...this.rows.map((row) => row.element))
    }

    resetState() {
        this.rows.forEach ( (element) => element.resetState())
    }
}

/***
 * Generates player turn indications, and functions to change it
 */

class playerName {
    element: HTMLDivElement
    constructor() {
        const p = document.createElement('p')
        p.textContent = "Player: BLACK"
        this.element = document.createElement('div')
        this.element.classList.add('playerTurn')
        this.element.append(p)
    }

    changeEndState(newOutcome: string) {
        var q = document.createElement('p')
        q.textContent = newOutcome
        this.element.replaceChildren(q)
    }

}
/***
 * Generates reset button and reset functionality
 */
class resetButton {
    element: HTMLDivElement
    constructor() {
        this.element = document.createElement('div')
        this.element.classList.add('button')
        this.element.append("Reset")
        this.element.addEventListener('click', () => {
            this.handleClick()
        })
    }

    handleClick() {
        gameBoard.resetState()
        currentPlayer.changeEndState("Player: BLACK")
        playerTurn = 1
        stoneCount = 0
        document.getElementById('gameSpace')?.classList.remove("locked")
    }

}

/********
 * Generates an array of all board pieces to check whether a winning state has been reached.
 * Inputs:
 *    stoneID = ID of latest stone;
 *    status - STATUS of current stone (white or black);
 * Returns:
 *    BLACK, WHITE or EMPTY - STATUS of winning piece, or EMPTY if no winner.
 *********/

function playCheck (stoneID: number, stoneStatus: STATUS) {
    //if (stoneCount < 8) return STATUS.EMPTY
    const currentBoardState = gameBoard.rows.map((x)=>x.stones).flat().map((y)=>y.status)
    var check = 0
    var loopCounter = 1
    while (loopCounter < 5 && check === 0) {
        check = stoneCounter(stoneID, stoneStatus,currentBoardState, loopCounter)
        loopCounter++
    }

    if (check === 1) return stoneStatus
    else if (check === 2 && stoneStatus === STATUS.WHITE) return STATUS.BLACK
    else if (check === 2 && stoneStatus === STATUS.BLACK) return STATUS.WHITE
    else return STATUS.EMPTY
}

/********
 * Takes the prodivded stone and checks for number of same colour connecting stones;
 * Inputs:
 *   stoneID - ID of latest stone placed on board;
 *   stoneStatus - STATUS of current stone (white or black);
 *   direction:
 *       1 - Horizontal
 *       2 - Vertical
 *       3 - Diagonal Foward
 *       4 - Diagonal Backward
 * Returns:
 *       0 - No winner
 *       1 - Winner
 *       2 - Loser (greater than five connected)
 *********/

function stoneCounter (stoneID: number, stoneStatus: STATUS, currentBoardState: STATUS[], direction: number) {
    var stepSize:number = 0
    switch(direction) {
        case 1: stepSize = 1; break;  //Horizontal
        case 2: stepSize = boardSize; break; //Vertical
        case 3: stepSize = boardSize - 1; break; //Diagonal Forward
        case 4: stepSize = boardSize + 1; break; //Diagonal Backward
    }
    var statusCount = 1
    //Count Upwards/Left
    var counter = 0
    var newID = stoneID
    const rowCheckStart = stoneID - (stoneID % boardSize)
    var rowCheckUpwards = rowCheckStart

    while (counter < 5) {
        newID = newID - stepSize
        if(direction != 1) rowCheckUpwards = rowCheckUpwards - boardSize
        if (newID < 0) break;
        if (newID < rowCheckUpwards) break;
        if (currentBoardState[newID] === stoneStatus) { 
            statusCount++ 
        }
        else break;
        counter++
    }

    //Count Downwards/Right
    counter = 0
    newID = stoneID
   var rowCheckDownwards = rowCheckStart + boardSize

    while (counter < 5) {
        newID = newID + stepSize
        if(direction != 1) rowCheckDownwards = rowCheckDownwards + boardSize
        if (newID >= stoneTotal) break;
        if (newID > rowCheckDownwards) break;
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

/********
 * Updates the player turn indicator, and displays win/draw messages;
 * On win / draw, locks game  board from future moves
 * Inputs:
 *   status - STATUS of current stone (white or black);
 * Returns: Nil
 *********/
function updateGameState (status: STATUS) {
    stoneCount++
    if (status === STATUS.EMPTY) {
        playerTurn = playerTurn === 0 ? 1 : 0
        currentPlayer.changeEndState("Player: " + (playerTurn===0? "WHITE" : "BLACK"))
    } else {
        currentPlayer.changeEndState((status===STATUS.WHITE? "WHITE" : "BLACK") + " WINS !!!")
        document.getElementById('gameSpace')?.classList.add("locked")
    }
     
    if (stoneCount >= stoneTotal) {
        currentPlayer.changeEndState("DRAW - No spaces left")
        document.getElementById('gameSpace')?.classList.add("locked")
    }
    return
}


/***
 * Initialisation variables and object builders
 */

var boardSize = 11

const gameBoard = new Board(boardSize)
const currentPlayer = new playerName()
const userButton = new resetButton()
const stoneTotal = boardSize * boardSize
var playerTurn = 1
var stoneCount = 0

document.getElementById('gameSpace')?.appendChild(gameBoard.element)
document.getElementById('functionality')?.appendChild(userButton.element)
document.getElementById('functionality')?.appendChild(currentPlayer.element)