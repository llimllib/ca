const ALIVE = "#fa38c0";
const DEAD = "#385ffa";

class GameOfLife {
  constructor(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.cellsize = 5;
    this.rows = Math.floor(height / this.cellsize);
    this.cols = Math.floor(width / this.cellsize);
    this.cells = [];
    this.isMouseDown = false;

    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        this.cells.push(Math.round(Math.random()));
      }
    }

    this.update = this.update.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.drawCells();
  }

  alive(row, col) {
    if (
      row < 0 ||
      col < 0 ||
      row >= this.rows ||
      col >= this.cols ||
      this.cells[row * this.cols + col] == 0
    ) {
      return 0;
    }
    return 1;
  }

  update(_) {
    this.cells = this.cells.map((_, idx) => {
      const row = Math.floor(idx / this.cols);
      const col = idx - row * this.cols;
      const nabes =
        this.alive(row - 1, col - 1) +
        this.alive(row - 1, col) +
        this.alive(row - 1, col + 1) +
        this.alive(row, col - 1) +
        this.alive(row, col + 1) +
        this.alive(row + 1, col - 1) +
        this.alive(row + 1, col) +
        this.alive(row + 1, col + 1);
      if (this.alive(row, col)) {
        // alive cells turn off if their neighbor count is not 2 or 3
        if (nabes != 2 && nabes != 3) {
          return 0;
        }
        return 1;
      } else {
        if (nabes == 3) {
          return 1;
        }
        return 0;
      }
    });
    this.drawCells();
  }

  drawCells() {
    const data = this.ctx.createImageData(this.width, this.height);
    const buf = new Uint32Array(data.data.buffer);
    const alive = 0xffc038fa;
    const dead = 0xfffa5f38;
    let i = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // convert from screen coords into automata coords
        const cellx = Math.floor(x / this.cellsize);
        const celly = Math.floor(y / this.cellsize);
        buf[i++] = this.cells[celly * this.cols + cellx] ? alive : dead;
      }
    }
    this.ctx.putImageData(data, 0, 0);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = DEAD;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.cells = [];
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        this.cells.push(0);
      }
    }
  }

  handleMouseDown(evt) {
    // https://stackoverflow.com/a/18053642/42559
    //
    // more complete and very thorough answer that I don't need yet in this
    // code:
    // https://stackoverflow.com/a/17130415/42559
    const rect = this.canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    const row = Math.floor(y / this.cellsize);
    const col = Math.floor(x / this.cellsize);
    this.isMouseDown = true;

    this.ctx.fillRect(
      col * this.cellsize,
      row * this.cellsize,
      this.cellsize,
      this.cellsize,
    );

    // should it _flip_ the cell or set it?
    this.cells[row * this.cols + col] = 1;
  }

  handleMouseMove(evt) {
    if (!this.isMouseDown) {
      return;
    }

    // https://stackoverflow.com/a/18053642/42559
    const rect = this.canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;
    const y = evt.clientY - rect.top;

    const row = Math.floor(y / this.cellsize);
    const col = Math.floor(x / this.cellsize);

    this.ctx.fillStyle = ALIVE;
    this.ctx.fillRect(
      col * this.cellsize,
      row * this.cellsize,
      this.cellsize,
      this.cellsize,
    );

    // should it _flip_ the cell or set it?
    this.cells[row * this.cols + col] = 1;
  }

  handleMouseUp() {
    this.isMouseDown = false;
  }
}

window.addEventListener("DOMContentLoaded", (_) => {
  const canvas = document.getElementById("canvas");
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;

  const g = new GameOfLife(canvas, width, height);

  //canvas.addEventListener("click", g.handleClick);
  canvas.addEventListener("mousedown", g.handleMouseDown);
  canvas.addEventListener("mousemove", g.handleMouseMove);
  canvas.addEventListener("mouseup", g.handleMouseUp);

  // advance the simulation on space bar
  window.addEventListener("keypress", (evt) => {
    if (evt.code == "Space") {
      window.requestAnimationFrame(g.update);
    } else if (evt.code == "KeyC") {
      g.clear();
    }
    evt.preventDefault();
  });
});
