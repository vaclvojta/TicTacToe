let board = Array(3).fill().map(() => Array(3).fill(''));
let currentPlayer = 'X';
let gameStarted = false;
let cells = Array.from(document.getElementById('board').getElementsByTagName('td'));
let scores = {
    'X': 1,
    'O': -1,
    'tie': 0
};

document.getElementById('start').addEventListener('click', function() {
    gameStarted = true;
    document.getElementById('turn').textContent = currentPlayer + "'s turn";
});

document.getElementById('reset').addEventListener('click', function() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
        let row = Math.floor(i / 3);
        let col = i % 3;
        board[row][col] = '';
    }
    currentPlayer = 'X';
    gameStarted = false;
    document.getElementById('turn').textContent = '';
    document.getElementById('winner').textContent = '';
});

for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', function(e) {
        if(gameStarted && !e.target.textContent) {
            let row = Math.floor(i / 3);
            let col = i % 3;
            board[row][col] = currentPlayer;
            if(currentPlayer === 'X') {
                e.target.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><line x1="10" y1="10" x2="40" y2="40" stroke="white" stroke-width="2"/><line x1="40" y1="10" x2="10" y2="40" stroke="white" stroke-width="2"/></svg>';
            } else {
                e.target.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" stroke="white" stroke-width="2" fill="none" /></svg>';
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            document.getElementById('turn').textContent = currentPlayer + "'s turn";
            let winner = checkWinner();
            if (winner) {
                gameStarted = false;
                document.getElementById('winner').textContent = 'Winner: ' + winner;
            } else if (document.getElementById('algorithmicOpponent').checked && gameStarted) {
                makeComputerMove();
            }
        }
    });
}

function checkWinner() {
    let lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        let [a, b, c] = lines[i];
        let rowA = Math.floor(a / 3);
        let colA = a % 3;
        let rowB = Math.floor(b / 3);
        let colB = b % 3;
        let rowC = Math.floor(c / 3);
        let colC = c % 3;
        if (board[rowA][colA] && board[rowA][colA] === board[rowB][colB] && board[rowA][colA] === board[rowC][colC]) {
            return board[rowA][colA];
        }
    }

    if (board.flat().every(cell => cell !== '')) {
        return 'tie';
    }

    return null;
}

function makeComputerMove() {
    let emptyCells = [];
    for (let i = 0; i < cells.length; i++) {
        let row = Math.floor(i / 3);
        let col = i % 3;
        if (board[row][col] === '') {
            emptyCells.push(i);
        }
    }

    let selectedCell;
    if (document.getElementById('algorithmicOpponent').checked) {
        bestMove();
    } else if (document.getElementById('randomStrategy').checked) {
        if (emptyCells.length > 0) {
            selectedCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        }
    } else if (document.getElementById('strategyToggle').checked) {
        if (emptyCells.length > 0) {
            selectedCell = emptyCells[0];
        }
    }

    if (selectedCell !== undefined) {
        let row = Math.floor(selectedCell / 3);
        let col = selectedCell % 3;
        board[row][col] = currentPlayer;
        cells[selectedCell].innerHTML = currentPlayer === 'X' ? '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><line x1="10" y1="10" x2="40" y2="40" stroke="white" stroke-width="2"/><line x1="40" y1="10" x2="10" y2="40" stroke="white" stroke-width="2"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" stroke="white" stroke-width="2" fill="none" /></svg>';
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        document.getElementById('turn').textContent = currentPlayer + "'s turn";
        let winner = checkWinner();
        if (winner) {
            gameStarted = false;
            document.getElementById('winner').textContent = 'Winner: ' + winner;
        }
    }
}

function minimax(board, depth, isMaximizingPlayer) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'O'; // Change here
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'X'; // Change here
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = 'O'; // Change here
                let score = minimax(board, 0, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = {i, j};
                }
            }
        }
    }
    board[move.i][move.j] = 'O'; // Change here
    let cellIndex = move.i * 3 + move.j;
    cells[cellIndex].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" stroke="white" stroke-width="2" fill="none" /></svg>';
    currentPlayer = 'X';
    document.getElementById('turn').textContent = currentPlayer + "'s turn";
    let winner = checkWinner();
    if (winner) {
        gameStarted = false;
        document.getElementById('winner').textContent = 'Winner: ' + winner;
    }
}

let hamburger = document.getElementById('hamburger');
let dropdown = document.getElementById('dropdown');

hamburger.addEventListener('click', function() {
    dropdown.classList.toggle('show');
});