import init, { greet, World, Direction } from "snake_game";

init().then((_) => {
  // greet("V1234");

  const CELL_SIZE = 30;
  const WORLD_WIDTH = 16;
  const SNAKE_SPAWN_INDEX = Date.now() % (WORLD_WIDTH * WORLD_WIDTH);
  console.log('SNAKE_SPAWN_INDEX: ', SNAKE_SPAWN_INDEX);

  const world = World.new(WORLD_WIDTH, SNAKE_SPAWN_INDEX);
  const worldWidth = world.width();
  console.log("world.width(): ", world.width());

  const canvas = <HTMLCanvasElement> document.getElementById("snake-canvas");
  const ctx = canvas.getContext("2d")!;

  canvas.height = worldWidth * CELL_SIZE;
  canvas.width = worldWidth * CELL_SIZE;
  
  initEventListeners(world);


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

  function drawSnake() {
    const snakeIndex = world.snake_head_index();
    const col = snakeIndex % worldWidth;
    const row = Math.floor(snakeIndex / worldWidth);

    ctx.beginPath();
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.stroke();
  }

  function paint() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWorld();
    drawSnake();
  }

  function gameLoop() {
    setTimeout(() => {
      world.update();
      paint();
      requestAnimationFrame(gameLoop);
    }, 100);
  }
  gameLoop();
});

function handleKeyboardEvent(world: World, event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowUp":
      console.log("ArrowUp");
      world.change_snake_dir(Direction.Up);
      break;
    case "ArrowDown":
      console.log("ArrowDown");
      world.change_snake_dir(Direction.Down);
      break;
    case "ArrowLeft":
      console.log("ArrowLeft");
      world.change_snake_dir(Direction.Left);
      break;
    case "ArrowRight":
      console.log("ArrowRight");
      world.change_snake_dir(Direction.Right);
      break;
    default:
      break;
  }
}

function initEventListeners(world: World) {
  document.addEventListener("keydown", (event) => {
    console.log("event.key: ", event.key);
    handleKeyboardEvent(world, event);
  });
}
