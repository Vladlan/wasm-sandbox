import init, { greet, World, Direction, InitOutput } from "snake_game";
import { randomInt } from "./utils/randomInt";

const CELL_SIZE = 40;
const WORLD_WIDTH = 4;
const SNAKE_SPAWN_INDEX = randomInt(WORLD_WIDTH * WORLD_WIDTH);
const START_BTN = <HTMLButtonElement>document.getElementById("start-button");

init().then((wasm: InitOutput) => {
  // greet("V1234");

  console.log("SNAKE_SPAWN_INDEX: ", SNAKE_SPAWN_INDEX);
  const world = World.new(WORLD_WIDTH, SNAKE_SPAWN_INDEX);
  const worldWidth = world.width();
  console.log("world.width(): ", world.width());

  const canvas = <HTMLCanvasElement>document.getElementById("snake-canvas");
  canvas.height = worldWidth * CELL_SIZE;
  canvas.width = worldWidth * CELL_SIZE;


  initEventListeners(world);

  function gameLoop() {
    setTimeout(() => {
      world.step();
      paint(canvas, world, wasm);
      requestAnimationFrame(gameLoop);
    }, 300);
  }
  gameLoop();
});

function drawGameStatus(world: World) {
  const gameStatusDomElem = document.getElementById("final-game-status");
  if (!gameStatusDomElem) return;
  const gameStatusText = world.game_status_text();
  if (gameStatusText) {
    gameStatusDomElem.innerHTML = gameStatusText;
  }
  const gameStatus = world.game_status();
  if (gameStatus === 2) {
    START_BTN.textContent = "Restart";
    START_BTN.addEventListener("click", () => {
      window.location.reload();
    });
  }
}

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
  
  START_BTN.addEventListener("click", () => {
    world.start_game();
  });
}

function getSnakeCells(world: World, wasm: InitOutput) {
  const snakeCellPointer = world.snake_cells();
  const snakeLength = world.snake_length();
  const snakeCells = new Uint32Array(
    wasm.memory.buffer,
    snakeCellPointer,
    snakeLength
  );
  return snakeCells;
}

function drawWorld(ctx: CanvasRenderingContext2D, world: World) {
  const worldWidth = world.width();
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

function drawRewardCell(world: World, ctx: CanvasRenderingContext2D) {
  const worldWidth = world.width();
  const idx = world.reward_cell();
  const col = idx % worldWidth;
  const row = Math.floor(idx / worldWidth);

  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  ctx.stroke();
} 

function drawSnakeCell(world: World, ctx: CanvasRenderingContext2D, cellIndex: number, color = "black") {
  const worldWidth = world.width();

  const col = cellIndex % worldWidth;
  const row = Math.floor(cellIndex / worldWidth);

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  ctx.stroke();
}

function drawSnake(
  world: World,
  ctx: CanvasRenderingContext2D,
  wasm: InitOutput
) {
  const snakeCells = getSnakeCells(world, wasm);

  for (let i = snakeCells.length - 1; i >= 0; i--) {
    drawSnakeCell(world, ctx, snakeCells[i], i === 0 ? "black" : "green");
  }
}


function paint(canvas: HTMLCanvasElement, world: World, wasm: InitOutput) {
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake(world, ctx, wasm);
  drawRewardCell(world, ctx);
  drawWorld(ctx, world);
  drawGameStatus(world);
}