export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;

  constructor(board, value = Math.random() > 0.1 ? 2 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tiles");
    board.append(this.#tileElement);
    this.value = value;
  }

  get value() {
    return this.#value;
  }

  /* --tiles-background-lightness: 90%;
  --tiles-text-lightness: 20%; */

  set value(v) {
    this.#value = v;
    this.#tileElement.textContent = v;
    const power = Math.log2(v);
    const backgroundLightness = 100 - power * 9;
    const textLightness = 20;
    this.#tileElement.style.setProperty(
      "--tiles-background-lightness",
      `${backgroundLightness}%`
    );
    this.#tileElement.style.setProperty(
      "--tiles-text-lightness",
      `${textLightness}%`
    );
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty("--x", value);
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty("--y", value);
  }

  remove() {
    this.#tileElement.remove();
  }
}
