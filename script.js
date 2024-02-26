const box = document.getElementById("box")

const field = {w: 9, h: 9, mines: 10}

let board = [], colors = ["#00f", "#008000", "#f00", "#010080", "#810101", "#008080", "#000000", "#808080"]

box.style.gridTemplateColumns = `repeat(${field.w}, 34px)`
box.style.gridTemplateRows = `repeat(${field.h}, 34px)`

for (let i = 0; i < field.h; i++) {
    board.push([])
    for (let j = 0; j < field.w; j++) {
        board[i].push(0)
        let elm = document.createElement("div")
        elm.id = `${i}_${j}`
        elm.className = "cell close"
        box.appendChild(elm)
    }
}

getMines()

function getMines() {
    for (let i = 0; i < field.mines; i++) {
        let n = Math.round(Math.random()*(field.w*field.h-1))
        if (board[Math.floor(n/field.w)][n%field.w] != -1) {
            board[Math.floor(n/field.w)][n%field.w] = -1
        } else {
            i--
        }
    }
    for (let i = 0; i < field.h; i++) {
        for (let j = 0; j < field.w; j++) {
            let temp = 0
            if (board[i][j] != -1) {
                for (let k = -1; k <= 1; k++) {
                    for (let l = -1; l <= 1; l++) {
                        if (!(k == 0 && l == 0)) {
                            try {
                                if (board[i+k][j+l] == -1) {
                                    temp++
                                }
                            } catch (e) {}
                        }
                    }
                }
                board[i][j] = temp
            }
        }
    }
}

function fetch() {
    for (let i = 0; i < field.h; i++) {
        for (let j = 0; j < field.w; j++) {
            if (!document.getElementById(`${i}_${j}`).classList.contains("close"))
            if (board[i][j] == -1) {
                document.getElementById(`${i}_${j}`).innerHTML = document.getElementById("mineSVG").outerHTML
            } else if (board[i][j] > 0) {
                document.getElementById(`${i}_${j}`).innerHTML = board[i][j]
                document.getElementById(`${i}_${j}`).style.color = colors[board[i][j]-1]
            } else {
                document.getElementById(`${i}_${j}`).innerHTML = ""
            }
        }
    }
}

box.addEventListener("click", (e) => {
    let id = e.target.id
    if (id != "box" && id != "") {
        if (id == "flagSVG") {
            id = e.target.parentNode.id
            flag(id)
        }
        click(id)
    }
})

box.addEventListener("contextmenu", (e) => {
    let id = e.target.id
    e.preventDefault()
    if (id != "box" && id != "") {
        if (id == "flagSVG" || id == "mineSVG") {
            id = e.target.parentNode.id
        }
        flag(id)
    }   
})

function flag(id) {
    console.log(id)
    let i = parseInt(id.split("_")[0]), j = parseInt(id.split("_")[1])
    if (board[i][j] > -2) {
        board[i][j]-=10
        document.getElementById(`${i}_${j}`).innerHTML = document.getElementById("flagSVG").outerHTML
    } else {
        board[i][j]+=10
        document.getElementById(`${i}_${j}`).innerHTML = ""
    }
    fetch()
}

function click(id) {
    let i = parseInt(id.split("_")[0]), j = parseInt(id.split("_")[1]) 
    if (board[i][j] == 0) {
        openNear(id)
    }
    open(id)
}

function open(id) {
    document.getElementById(id).classList.remove("close")
    fetch()
}

function openNear(id) {
    let i = parseInt(id.split("_")[0]), j = parseInt(id.split("_")[1]) 
    for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
            if (!(k == 0 && l == 0)) {
                try {
                    if (board[i+k][j+l] == 0 && document.getElementById(`${i+k}_${j+l}`).classList.contains("close")) {
                        document.getElementById(id).classList.remove("close")
                        openNear(`${i+k}_${j+l}`)
                    } else if (board[i+k][j+l] >= 0) {
                        open(`${i+k}_${j+l}`)
                    }
                } catch (e) {}
            }
        }
    }
    return true
}