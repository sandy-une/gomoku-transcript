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
        console.log(this.status)
        if (this.status != STATUS.EMPTY) return
        this.element.classList.remove(this.status.toLowerCase())
        this.status = playerTurn === 0 ? STATUS.WHITE : STATUS.BLACK
        playerTurn = playerTurn === 0 ? 1 : 0
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


console.log("Starting Build")
const gameBoard = new Board(8)
var playerTurn = 0
document.getElementById('gameSpace')?.appendChild(gameBoard.element)