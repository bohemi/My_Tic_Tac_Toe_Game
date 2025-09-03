const cells = [...document.querySelectorAll(".cell")];
let playerOne = makePlayer(document.getElementById("player1NameInput").value, "X", 0);
let playerTwo = makePlayer(document.getElementById("player2NameInput").value, "O", 0);
let gameFlow = {
    currentPlayer: playerOne,
    switchPlayer: function () {
        this.currentPlayer =
            this.currentPlayer === playerOne ? playerTwo : playerOne;
        // console.log(`${this.currentPlayer.marker}` + " 's turn");
    }
};

let gameBoard = {
    board: ["", "", "", "", "", "", "", "", ""],
    winningCombinations: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],

    checkWin: function () {
        // Check rows, columns, and diagonals for a win
        for (let i = 0; i < this.winningCombinations.length; i++) {
            if (gameBoard.board[this.winningCombinations[i][0]] === 'X' &&
                gameBoard.board[this.winningCombinations[i][1]] === 'X' &&
                gameBoard.board[this.winningCombinations[i][2]] === 'X'
            ) {
                cells[this.winningCombinations[i][0]].style.backgroundColor = "white";
                cells[this.winningCombinations[i][1]].style.backgroundColor = "white";
                cells[this.winningCombinations[i][2]].style.backgroundColor = "white";
                updateScore(playerOne);
                setTimeout(resetBoard, 1000);
                console.log("X wins");
                break;
            }
            else if (gameBoard.board[this.winningCombinations[i][0]] === 'O' &&
                gameBoard.board[this.winningCombinations[i][1]] === 'O' &&
                gameBoard.board[this.winningCombinations[i][2]] === 'O'
            ) {
                cells[this.winningCombinations[i][0]].style.backgroundColor = "black";
                cells[this.winningCombinations[i][1]].style.backgroundColor = "black";
                cells[this.winningCombinations[i][2]].style.backgroundColor = "black";
                updateScore(playerTwo);
                setTimeout(resetBoard, 1000);
                console.log("O wins");
                break;
            }
        }
    }
};
// Calls
gameInitialSetup();
function resetBoard() {
    gameBoard.board.fill("");
    const currentCells = [...document.querySelectorAll(".cell")];
    gameBoard.board = currentCells.slice();
    for (const cell of currentCells) {
        cell.style.backgroundImage = "none";
        cell.style.backgroundColor = "grey";
        // Remove any previous click handler before adding a new one
        cell.removeEventListener("click", cellClickHandler);
        cell.addEventListener("click", cellClickHandler, { once: true });
    }
    console.log("Board Reset");
}
// removing directly the DOM elements rather than removing only eventListener.
// function resetBoards() {
//     gameBoard.board.fill("");
//     // This grabs all the current ".cell" elements from the DOM before any replacements.
//     // we loop over these to clear their styles and replace them with clones.
//     const newCells = [...document.querySelectorAll(".cell")];
//     gameBoard.board = newCells.slice();
//     for (const cell of newCells) {
//         cell.style.backgroundImage = "none";
//         cell.style.backgroundColor = "grey";
//         // cloning all newCells with the newCell variable. and the true in param means it will copy its childs too.
//         const newCell = cell.cloneNode(true);
//         // then we are replacing the original cells with the copied one. Which is actually replacing the DOM element
//         // from the DOM with the clon one because these clones are freshly made without the eventListener on them. so
//         // the old element`s event listener will be gone when replacing them. To prevent multiple listeners being attached.
//         cell.parentNode.replaceChild(newCell, cell);
//     }
//     // now, here we are getting the freshly made DOM elements which we cloned before to add eventListener on them.
//     const finalCells = [...document.querySelectorAll(".cell")];
//     gameBoard.board = finalCells.slice();
//     for (const cell of finalCells) {
//         cell.addEventListener("click", cellClickHandler, { once: true });
//     }
//     console.log("Board Reset");
// }
function gameInitialSetup() {
    document.getElementById("playerScoreContainer").style.display = "none";
    document.getElementById("boardContainer").style.display = "none";
    document.getElementById("resetBtn").style.display = "none";
    // will be reset from the resetButton
    // filling the board with div cells which converted into an array.
    // We add buttonEventListener to each cell, to identify which cell was clicked.
    gameBoard.board = cells.slice();
    dialogBoxHandler();
    for (const element of cells) {
        // No need to call the remove line below since this functionis being only called at the startup and
        // later this logic is being handle in the reset function. but just in case as a sadety feature it
        // should remain here so whenever we call this function in the future multiple times then it will
        // not break the game.
        element.removeEventListener("click", cellClickHandler);
        element.addEventListener("click", cellClickHandler, { once: true });
    }
    document.getElementById("resetBtn").addEventListener("click", ()=>{
        resetGame(playerOne, playerTwo);
    })
}
function cellClickHandler(event) {
    const cell = event.target;
    drawOnCell(cell, gameFlow.currentPlayer.marker);
    for (let i = 0; i < gameBoard.board.length; i++) {
        if (gameBoard.board[i] === cell) {
            gameBoard.board[i] = gameFlow.currentPlayer.marker;
            break;
        }
    }
    gameBoard.checkWin();
    gameFlow.switchPlayer();
}
function makePlayer(name, marker, score) {
    return { name, marker, score };
}
function drawOnCell(cell, playerMarker) {
    if (playerMarker === 'X') {
        cell.style.backgroundImage =
            "url(https://cdn-icons-png.flaticon.com/128/2976/2976286.png)";
    }
    else if (playerMarker === 'O') {
        cell.style.backgroundImage =
            "url(https://cdn-icons-png.flaticon.com/128/3524/3524377.png)";
    }
}
function dialogBoxHandler() {
    const dialog = document.getElementById("gameStartDialog");
    const closeDialogBtn = document.getElementById("closeDialogBtn");
    const player1NameInput = document.getElementById("player1NameInput");
    const player2NameInput = document.getElementById("player2NameInput");
    document.addEventListener('', function () {
        dialog.showModal();
    });

    closeDialogBtn.addEventListener("click", () => {
        document.getElementById("player1").innerHTML = `${player1NameInput.value}'s Score:`;
        document.getElementById("player2").innerHTML = `${player2NameInput.value}'s Score:`;
        dialog.style.display = "none";
        dialog.close();
        document.getElementById("playerScoreContainer").style.display = "flex";
        document.getElementById("boardContainer").style.display = "grid";
        document.getElementById("resetBtn").style.display = "block";
    });
}
function updateScore(player) {
    if (player === playerOne) {
        playerOne.score++;
        document.getElementById("player1").innerHTML = `${player1NameInput.value}'s Score:${playerOne.score}`;
    }
    else if (player === playerTwo) {
        playerTwo.score++;
        document.getElementById("player2").innerHTML = `${player2NameInput.value}'s Score:${playerTwo.score}`;
    }
}
function resetGame(player1, player2){
    player1.score = 0;
    player2.score = 0;
    resetBoard();
    document.getElementById("player1").innerHTML = `${player1NameInput.value}'s Score:${playerOne.score}`;
    document.getElementById("player2").innerHTML = `${player2NameInput.value}'s Score:${playerTwo.score}`;
    element.removeEventListener("click", cellClickHandler);
    element.addEventListener("click", cellClickHandler, { once: true });
}