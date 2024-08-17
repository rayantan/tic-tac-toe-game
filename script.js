
const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6] 
];


let currentPlayer;
let board;

const cells = document.querySelectorAll('.cell');

// Function to start the game
function startGame() {
    board = Array.from(Array(9).keys());
    currentPlayer = X_CLASS;
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    if (currentPlayer === O_CLASS) {
        
        minimax(board, O_CLASS).index;
    }
}


function handleClick(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.dataset.index);

    
    if (typeof board[cellIndex] === 'number') {
        
        placeMarker(cellIndex, currentPlayer);

        if (checkWin(currentPlayer)) {
            alert(`${currentPlayer} wins!`);
        } else if (checkTie()) {
            alert("It's a tie!");
        } else {
            
            currentPlayer = currentPlayer === X_CLASS ? O_CLASS : X_CLASS;
            
            if (currentPlayer === O_CLASS) {
                const bestMove = minimax(board, O_CLASS);
                placeMarker(bestMove.index, O_CLASS);
                currentPlayer = X_CLASS;
            }
        }
    }
}


function placeMarker(cellIndex, player) {
    board[cellIndex] = player;
    cells[cellIndex].classList.add(player);
}

function checkWin(player) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return board[index] === player;
        });
    });
}

function checkTie() {
    return board.every(cell => typeof cell === 'string');
}

function minimax(newBoard, player) {
    const availableSpots = emptyCells(newBoard);

    if (checkWin(X_CLASS)) {
        return { score: -10 };
    } else if (checkWin(O_CLASS)) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = newBoard[availableSpots[i]];
        newBoard[availableSpots[i]] = player;

        if (player === O_CLASS) {
            const result = minimax(newBoard, X_CLASS);
            move.score = result.score;
        } else {
            const result = minimax(newBoard, O_CLASS);
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = move.index;
        moves.push(move);
    }

    let bestMove;
    if (player === O_CLASS) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function emptyCells(board) {
    return board.filter(cell => typeof cell === 'number');
}

document.getElementById('reset-btn').addEventListener('click', startGame);

// Start the game
startGame();
