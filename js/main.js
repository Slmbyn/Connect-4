    /*----- constants -----*/
const COLORS = {
    '0': ' white',
    '1': 'purple',
    '-1': 'orange'
};

	/*----- state variables -----*/ //things that will need to be able to change during the game
//  turn: 1 & -1 -> represents each player by color
//  board: 2D array (array of arrays)
        //'null' to represent that no one is there yet
        // 1 or -1 represents the player at that cell

let board; //array of all 7 column arrays
let turn; // 1 or -1
let winner // null = no winner; 1 or -1 = winner; 'T'=tie



//  winner:
        // null -> no winner yet
        // 1/-1 -> winner
        // 'T' -> tie

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
    return checkVerticalWin(colIdx, rowIdx);
}

function checkVerticalWin(colIdx,rowIdx) {
    return countAdjacent(colIdx, rowIdx, 0, -1) === 3 ? board[colIdx, rowIdx] : null;
}

function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    // shortcut variable to the player value
    const player = board[colIdx][rowIdx];
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





