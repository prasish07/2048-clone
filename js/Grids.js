const gridSize = 4;
const cellSize = 20;
const cellGap = 2;

// Class that get the grid property and create gird elements
export default class Grids {
  // Making the cells element private to prevent it from accessing outside the Grids call
  #cells;
  constructor(gridElement) {
    gridElement.style.setProperty("--board-row-column", gridSize);
    gridElement.style.setProperty("--cell-size", `${cellSize}vmin`);
    gridElement.style.setProperty("--cell-gap", `${cellGap}vmin`);
    this.#cells = createGirdCells(gridElement).map((cellElement, index) => {
      const x = index % gridSize;
      const y = Math.floor(index / gridSize);
      return new Cell(cellElement, x, y);
    });
  }

  get cells() {
    return this.#cells;
  }

  // Getting all the empty cells
  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }

  // Choosing one from empty cells randomly
  randomEmptyCell() {
    const emptyCells = this.#emptyCells;
    if (emptyCells.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  // Organize by column
  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;
      return cellGrid;
    }, []);
  }

  // Organize by row
  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;
      return cellGrid;
    }, []);
  }
}

class Cell {
  // setting the private here also
  #x;
  #y;
  #cellElement;
  #tile;
  #mergeTile;
  constructor(cellElement, x, y) {
    this.#x = x;
    this.#y = y;
    this.#cellElement = cellElement;
  }

  // Class that get the cell x and y
  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }

  // Set the tite of the cell
  set tile(value) {
    this.#tile = value;
    if (value == null) return;
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  // Getting the merge tile
  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;
    if (value == null) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  // Checking if the next tile can be move to another tile
  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    );
  }

  // Merging the value of the tile and deleting the mergeTile value
  mergeTiles() {
    let score = document.querySelector(".score-value");
    let scoreValue = score.textContent;
    if (this.tile == null || this.mergeTile == null) return;
    this.tile.value = this.tile.value + this.mergeTile.value;
    scoreValue = parseInt(scoreValue);
    scoreValue += parseInt(this.tile.value);
    score.innerHTML = scoreValue;

    this.mergeTile.remove();
    this.mergeTile = null;
  }
}

// function that create the new div inside the girdElement and add class cell there
const createGirdCells = (gridElement) => {
  const cellCount = gridSize * gridSize;
  const cellArray = [];
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cellArray.push(cell);
    gridElement.appendChild(cell);
  }
  return cellArray;
};
