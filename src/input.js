export class InputMapper {
  constructor() {
    this.keys = new Map();
    this.toolIndex = 0;
    this._listeners = [];
  }

  init() {
    window.addEventListener("keydown", (e) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          " ",
          "Enter",
          "m",
          "M",
          "q",
          "Q",
          "e",
          "E",
          "r",
          "R",
          "1",
          "2",
          "3",
          "4",
          "Escape",
          "F1",
          "F2",
          "F3",
          "F4",
          "F5",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }
      this.keys.set(e.key.toLowerCase(), true);
      this._listeners.forEach((fn) => fn(e.key.toLowerCase(), true));
    });
    window.addEventListener("keyup", (e) => {
      this.keys.delete(e.key.toLowerCase());
      this._listeners.forEach((fn) => fn(e.key.toLowerCase(), false));
    });
  }

  onChange(fn) {
    this._listeners.push(fn);
  }

  isDown(key) {
    return this.keys.has(key.toLowerCase());
  }

  setToolIndex(index) {
    this.toolIndex = index;
  }
}
