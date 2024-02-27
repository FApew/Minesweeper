const box = document.getElementById("box")
const resetBtn = document.getElementById("reset")
const mines = document.getElementById("mines")
const time = document.getElementById("time")

const Iw = document.getElementById("Iw")
const Ih = document.getElementById("Ih")
const Im = document.getElementById("Im")

Iw.value = 9
Ih.value = 9
Im.value = 10

let game = [false, false], timer = 0, field = {w: 9, h: 9, mines: 10}, board = [], colors = ["#00f", "#008000", "#f00", "#010080", "#810101", "#008080", "#000000", "#808080"]

Iw.addEventListener("change", () => {
    if (Iw.value < 9) {
        Iw.value = 9
    }
    field.w = Iw.value
    reset()
})

Ih.addEventListener("change", () => {
    if (Ih.value < 9) {
        Ih.value = 9
    }
    field.h = Ih.value
    reset()
})

Im.addEventListener("change", () => {
    if (Im.value < 1) {
        Im.value = 1
    }
    field.mines = Im.value
    reset()
})

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

setInterval(() => {
    if (game[1]) {
        timer++
        time.innerHTML = timer
    }
}, 1000)

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

resetBtn.addEventListener("mousedown", () => {
    resetBtn.classList.add("press")
})

resetBtn.addEventListener("mouseup", () => {
    resetBtn.classList.remove("press")
})

resetBtn.addEventListener("click",reset)

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

function reset() {
    if ((field.w >= 9) && (field.h >= 9) && (field.mines > 0)) {
        resetBtn.innerHTML = "😊"
        board = []
        timer = 0
        time.innerHTML = timer
        box.querySelectorAll(".cell").forEach((elm) => {
            elm.remove()
        })
        box.style.gridTemplateColumns = `repeat(${field.w}, 34px)`
        box.style.gridTemplateRows = `repeat(${field.h}, 34px)`
        mines.innerHTML = field.mines
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

        game[1] = false
        game[0] = true
    }
}

function flag(id) {
    if (game[0]) {
        let i = parseInt(id.split("_")[0]), j = parseInt(id.split("_")[1])
        if(document.getElementById(`${i}_${j}`).classList.contains("close"))
        if (board[i][j] > -2) {
            board[i][j]-=10
            mines.innerHTML-=1
            document.getElementById(`${i}_${j}`).innerHTML = document.getElementById("flagSVG").outerHTML
            document.getElementById(`${i}_${j}`).classList.add("flag")
        } else {
            mines.innerHTML=parseInt(mines.innerHTML) + 1
            board[i][j]+=10
            document.getElementById(`${i}_${j}`).innerHTML = ""
            document.getElementById(`${i}_${j}`).classList.remove("flag")
        }
        fetch()
    }
}

function click(id) {
    if (game[0]) {
        if (!game[1]) {
            game[1] = true
        }
        let i = parseInt(id.split("_")[0]), j = parseInt(id.split("_")[1]) 
        if (board[i][j] == 0) {
            openNear(id)
        }
        open(id)
        if (board[i][j] == -1) {
            game[0] = false
            game[1] = false
            resetBtn.innerHTML = "😣"
            mines.innerHTML = field.mines
        } else {
            checkWin()
        }
    }
}

function checkWin() {
    let temp = 0
    document.querySelectorAll(".close").forEach((elm) => {
        temp++
    })
    if (temp == field.mines) { 
        document.querySelectorAll(".close").forEach((elm) => {
            if (!elm.classList.contains("flag")) {
                flag(elm.id)
            }
        })
        game[0] = false
        game[1] = false
        resetBtn.innerHTML = "😎"
        mines.innerHTML = field.mines
    }
}

function open(id) {
    document.getElementById(id).classList.remove("close")
    fetch()
}

function openNear(id) {
    let i = parseInt(id.split("_")[0]), j = parseInt(id.split("_")[1]) 
    for (let k = -1; k <= 1; k++) {
        for (let l = -1; l <= 1; l++) {
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
    return true
}

reset()