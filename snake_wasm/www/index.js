import init, { greet, World } from "snake_game";

init().then(_ => {
  // greet("V1234");

  const CELL_SIZE = 30;
  console.log("OK! 123");

  const world = World.new(16);
  const worldWidth = world.width();
  console.log('world: ', world.width());

  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');


  canvas.height = worldWidth * CELL_SIZE;
  canvas.width = worldWidth * CELL_SIZE;

  function drawWorld() {
    ctx.beginPath();
    for (let x = 0; x < worldWidth + 1; x++) {
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, worldWidth * CELL_SIZE);
    }

    for (let y = 0; y < worldWidth + 1; y++) {
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(worldWidth * CELL_SIZE, y * CELL_SIZE);
    }

    ctx.stroke();
  }

  drawWorld()
})