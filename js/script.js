import Grids from "./Grids.js";
import Tile from "./Tile.js";

const board = document.getElementById("board");

const grid = new Grids(board);

grid.randomEmptyCell().tile = new Tile(board);
grid.randomEmptyCell().tile = new Tile(board);

const setUpInput = () => {
  window.addEventListener("keydown", handlePress, { once: true });
};

const handlePress = (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setUpInput();
        return;
      }
      moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setUpInput();
        return;
      }
      moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setUpInput();
        return;
      }
      moveLeft();
      break;
    case "ArrowRight":
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
    alert(`You have lost.`);
    return;
  }
  setUpInput();
};

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
