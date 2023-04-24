class GameOfLife {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.cellsize = 5;
    this.rows = Math.floor(height / this.cellsize);
    this.cols = Math.floor(width / this.cellsize);
    this.cells = [];

    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        this.cells.push(Math.round(Math.random()));
      }
    }
    console.log(width, height, this.rows, this.cols, this.cells.length);

    this.update = this.update.bind(this);
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
    this.ctx.clearRect(0, 0, this.width, this.height);
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (this.alive(row, col)) {
          this.ctx.fillStyle = "#fa38c0";
          this.ctx.fillRect(
            col * this.cellsize,
            row * this.cellsize,
            this.cellsize,
            this.cellsize
          );
        } else {
          this.ctx.fillStyle = "#385ffa";
          this.ctx.fillRect(
            col * this.cellsize,
            row * this.cellsize,
            this.cellsize,
            this.cellsize
          );
        }
      }
    }
  }
}

function handleClick(ctx) {
  return function (evt) {
    console.log(evt);
    const cellX = Math.floor(evt.clientX / CELLSIZE);
    const cellY = Math.floor(evt.clientY / CELLSIZE);
    ctx.fillRect(cellX * CELLSIZE, cellY * CELLSIZE, CELLSIZE, CELLSIZE);
  };
}

window.addEventListener("DOMContentLoaded", (_) => {
  const canvas = document.getElementById("canvas");
  var width = canvas.offsetWidth;
  var height = canvas.offsetHeight;
  const ctx = canvas.getContext("2d");
  // TODO: allow user to draw during the game of life simulation
  //canvas.addEventListener("click", handleClick(ctx));

  const g = new GameOfLife(ctx, width, height);
  // window.requestAnimationFrame(g.update);
  window.addEventListener("keypress", (evt) => {
    if (evt.code == "Space") {
      window.requestAnimationFrame(g.update);
    }
  });
});
