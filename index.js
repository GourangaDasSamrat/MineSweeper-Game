const grid = document.getElementById("grid");
let lockGame = false;
let minesCount = 20;
// Set test mode to true if you want see mines location
const testMode = false;
generateGrid();

// Generate 10 * 10 Grid
function generateGrid() {
  lockGame = false;
  grid.innerHTML = "";
  for (var i = 0; i < 10; i++) {
    row = grid.insertRow(i);
    for (var j = 0; j < 10; j++) {
      cell = row.insertCell(j);
      cell.onclick = function () {
        init(this);
      };
      cell.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(this);
      };
      var mine = document.createAttribute("mine");
      mine.value = "false";
      cell.setAttributeNode(mine);
    }
  }
  generateMines();
}

// Generate mines randomly without duplicates
function generateMines() {
  let minesPlaced = 0;
  while (minesPlaced < minesCount) {
    var row = Math.floor(Math.random() * 10);
    var col = Math.floor(Math.random() * 10);
    var cell = grid.rows[row].cells[col];

    // Only place mine if the cell doesn't already have one
    if (cell.getAttribute("mine") === "false") {
      cell.setAttribute("mine", "true");
      if (testMode) {
        cell.innerHTML = "X";
      }
      minesPlaced++;
    }
  }
}

// Add or remove flag on right click
function addFlag(cell) {
  if (lockGame) return;

  if (!cell.classList.contains("active")) {
    if (cell.innerHTML === "") {
      cell.innerHTML = "🚩";
    } else if (cell.innerHTML === "🚩") {
      cell.innerHTML = "";
    }
  }
}

// Highlight all mines red
function revealMines() {
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      var cell = grid.rows[i].cells[j];
      if (cell.getAttribute("mine") === "true") {
        cell.className = "mine";
        cell.innerHTML = "💣";
      }
    }
  }
}

function checkGameComplete() {
  var gameComplete = true;
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      var cell = grid.rows[i].cells[j];
      if (
        cell.getAttribute("mine") === "false" &&
        (cell.innerHTML === "" || cell.innerHTML === "🚩")
      ) {
        gameComplete = false;
      }
    }
  }
  if (gameComplete) {
    alert("Congratulations! You Found All Mines! 🎉");
    lockGame = true;
    revealMines();
  }
}

function gameOver() {
  lockGame = true;
  revealMines();
  setTimeout(() => {
    alert("Game Over! 💣 Try again!");
  }, 500);
}

function init(cell) {
  if (lockGame || cell.innerHTML === "🚩") {
    return;
  }

  if (cell.getAttribute("mine") === "true") {
    gameOver();
    return;
  }

  cell.className = "active";
  // Display number of mines around cell
  var mineCount = 0;
  var cellRow = cell.parentNode.rowIndex;
  var cellCol = cell.cellIndex;

  // Count adjacent mines
  for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
    for (var j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, 9); j++) {
      if (grid.rows[i].cells[j].getAttribute("mine") === "true") {
        mineCount++;
      }
    }
  }

  if (mineCount === 0) {
    // Auto-reveal adjacent cells if no mines nearby
    cell.innerHTML = "";
    for (var i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, 9); i++) {
      for (
        var j = Math.max(cellCol - 1, 0);
        j <= Math.min(cellCol + 1, 9);
        j++
      ) {
        var adjacentCell = grid.rows[i].cells[j];
        if (
          adjacentCell.innerHTML === "" &&
          !adjacentCell.classList.contains("active")
        ) {
          init(adjacentCell);
        }
      }
    }
  } else {
    cell.innerHTML = mineCount;
  }

  checkGameComplete();
}
