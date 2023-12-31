import Grids from "./Grids.js";
import Tile from "./Tile.js";

const board = document.getElementById("board");
const gameOver = document.querySelector(".game-over");
let score = document.querySelector(".score-value");

const grid = new Grids(board);

grid.randomEmptyCell().tile = new Tile(board);
grid.randomEmptyCell().tile = new Tile(board);

const setUpInput = () => {
  window.addEventListener("keydown", handlePress, { once: true });
};

// Event listener with (up,down,right,left=> arrow and wsad => key) to move the tile
const handlePress = (event) => {
  switch (event.key) {
    case "ArrowUp":
    case "w":
      if (!canMoveUp()) {
        setUpInput();
        return;
      }
      moveUp();
      break;
    case "ArrowDown":
    case "s":
      if (!canMoveDown()) {
        setUpInput();
        return;
      }
      moveDown();
      break;
    case "ArrowLeft":
    case "a":
      if (!canMoveLeft()) {
        setUpInput();
        return;
      }
      moveLeft();
      break;
    case "ArrowRight":
    case "d":
      if (!canMoveRight()) {
        setUpInput();
        return;
      }
      moveRight();
      break;
    default:
      setUpInput();
      return;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());

  grid.randomEmptyCell().tile = new Tile(board);

  // can if any movement is possible
  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    gameOver.style.display = "flex";
    return;
  }
  setUpInput();
};

// Restarting the game
let restartBtn = document.querySelector(".btn");
restartBtn.addEventListener("click", () => {
  grid.cells.forEach((cell) => {
    cell.tile = null;
    cell.mergeTile = null;
  });
  const tiles = board.querySelectorAll(".tiles");
  tiles.forEach((tile) => tile.remove());
  gameOver.style.display = "none";

  // Create new tiles and start the game
  grid.randomEmptyCell().tile = new Tile(board);
  grid.randomEmptyCell().tile = new Tile(board);
  setUpInput();
  score.textContent = 0;
});

setUpInput();

const moveUp = () => {
  return slideTiles(grid.cellsByColumn);
};

const moveDown = () => {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
};
const moveLeft = () => {
  return slideTiles(grid.cellsByRow);
};
const moveRight = () => {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
};

// Moving the tile
const slideTiles = (cells) => {
  cells.forEach((group) => {
    for (let i = 1; i < group.length; i++) {
      const cell = group[i];
      if (cell.tile == null) continue;
      let lastValidCell;
      for (let j = i - 1; j >= 0; j--) {
        const moveToCell = group[j];
        if (!moveToCell.canAccept(cell.tile)) break;
        lastValidCell = moveToCell;
      }
      if (lastValidCell != null) {
        if (lastValidCell.tile != null) {
          lastValidCell.mergeTile = cell.tile;
        } else {
          lastValidCell.tile = cell.tile;
        }
        cell.tile = null;
      }
    }
  });
};

const canMoveUp = () => {
  return canMove(grid.cellsByColumn);
};

const canMoveLeft = () => {
  return canMove(grid.cellsByRow);
};
const canMoveDown = () => {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
};
const canMoveRight = () => {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
};

// checking if the move is possible or not
const canMove = (cells) => {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.tile == null) return false;
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
};
