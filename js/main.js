    /*----- constants -----*/
const COLORS = {
    '0': ' white',
    '1': 'purple',
    '-1': 'orange'
};

	/*----- state variables -----*/ 

let board;
let turn;
let winner;


	/*----- cached elements  -----*/

const messageEl = document.querySelector('h1');
const playAgainBtn = document.querySelector('button');
const markerEls = [...document.querySelectorAll('#markers > div')];


	/*----- event listeners -----*/

document.getElementById('markers').addEventListener('click', handleDrop)
playAgainBtn.addEventListener('click', init);



	/*----- functions -----*/



init();
    // initialize all state, then call render()
function init() {
    board = [
        [0,0,0,0,0,0], //column 0
        [0,0,0,0,0,0], //column 1
        [0,0,0,0,0,0], //column 2
        [0,0,0,0,0,0], //column 3
        [0,0,0,0,0,0], //column 4
        [0,0,0,0,0,0], //column 5
        [0,0,0,0,0,0], //column 6
    ];
    turn = 1; //assigning the first turn to player 1
    winner = null; //there is no winner yet
    render();
}

// in response to user interaction update all impacted states, then call render();
function handleDrop(event) {
    const colIdx = markerEls.indexOf(event.target);
    // Guards (incase user misses the button and clicks next to it)
    if (colIdx === -1) return;
    // shortcut to the column array
    const colArr = board[colIdx];
    // find the index of the first zero in columnArray
    const rowIdx = colArr.indexOf(0);
    // update the board state with the current player value
    colArr[rowIdx] = turn;
    // switch turns
    turn *= -1; // same as turn = turn * -1;
    // check for winner
    winner = getWinner(colIdx, rowIdx);
    render();
}

//check for winner
//return null if no winner, 1/-1 if a player has won, 'T' if its a tie
function getWinner(colIdx, rowIdx) {
    return checkVerticalWin(colIdx, rowIdx) ||
    checkHorizontalWin(colIdx,rowIdx) ||
    checkDiagonalWinNWSE(colIdx,rowIdx);
    checkDiagonalWinNESW(colIdx,rowIdx); //checking diagonally in NorthEast and SouthWest directions
}

function checkDiagonalWinNWSE(colIdx,rowIdx) {
    const adjCountNW = countAdjacent(colIdx, rowIdx, -1, 1); 
    const adjCountSE = countAdjacent(colIdx, rowIdx, 1, -1); 
    return (adjCountNW + adjCountSE) >= 3 ? board[colIdx][rowIdx] : null;
}
function checkDiagonalWinNESW(colIdx,rowIdx) {
    const adjCountNE = countAdjacent(colIdx, rowIdx, 1, 1); 
    const adjCountSW = countAdjacent(colIdx, rowIdx, -1, -1); 
    return (adjCountNE + adjCountSW) >= 3 ? board[colIdx][rowIdx] : null;
}
function checkHorizontalWin(colIdx,rowIdx) {
    const adjCountLeft = countAdjacent(colIdx, rowIdx, -1, 0); // we leave the row at 0 because in this case only the column would change, and put column at -1 cause it decreases in that direction
    const adjCountRight = countAdjacent(colIdx, rowIdx, 1, 0); // we leave the row at 0 because in this case only the column would change, and put column at 1 cause it increases in that direction
    return (adjCountLeft + adjCountRight) >= 3 ? board[colIdx][rowIdx] : null;
}

function checkVerticalWin(colIdx,rowIdx) {
    return countAdjacent(colIdx, rowIdx, 0, -1) === 3 ? board[colIdx][rowIdx] : null; // we leave the column at 0 because in this case only the row would change
}

function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    // shortcut variable to the player value
    const player = board[colIdx][rowIdx];
    // Track count of adjacent cells with same player value
    let count = 0;
    // initialize the new coordinates
    colIdx += colOffset;
    rowIdx += rowOffset;
    while (board[colIdx] !== undefined && board[colIdx][rowIdx] !== undefined && board[colIdx][rowIdx] === player) {   // ensure that calIdx is within bounds of the board array
    //then it counts how many purple or orange there are as long as the criterea in the perameter is met (i.e its not trying to count off the board)
    count++ ;
    colIdx += colOffset;
    rowIdx += rowOffset;
    }
    return count;
}


//function of render is to visualize all states in the DOM
function render() {
    renderBoard();
    renderMessage();
    //renderControls is to hide&show UI elements (e.g play again button, markers)
    renderControls();
}

function renderBoard() {
    board.forEach(function(colArr, colIdx) {
        //this next forEach will iterate over the cells in the current column
        colArr.forEach(function(cellVal, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`;
            const cellEl = document.getElementById(cellId);
            cellEl.style.backgroundColor = COLORS[cellVal];
        });
        
    });
}

function renderMessage() {
    if (winner === 'T') {
        messageEl.innerText = "It's a Tie!!";
    } else if (winner) {
        messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner].toUpperCase()}</span> Wins!`;
    } else {
        //game is in play here
        messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn].toUpperCase()}</span>'s Turn`;
    }
} 

function renderControls() {
    // Ternary expression is the go to when you 1 or 2 values returned
    // syntax: <conditional expression> ? <truthy expression> : <falsey expression>
    playAgainBtn.style.visibility = winner ? 'visible' : 'hidden';
    // iterate over the marker elements to hide/show according to the column being full (no 0's in the column)
    markerEls.forEach(function(markerEl, colIdx) {  // this says: iterating over the markerEls to each 'markerEl' over each column 'colIdx'
        const hideMarker = !board[colIdx].includes(0) || winner;  //we put an exclamation to say hidemarker if the colindex doesnt have any zeros or if there is a winner
        markerEl.style.visibility = hideMarker ? 'hidden' : 'visible';
    });
}





