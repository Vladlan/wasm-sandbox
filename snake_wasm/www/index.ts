import init, { greet, World, Direction, InitOutput } from "snake_game";
import { randomInt } from "./utils/randomInt";

const CELL_SIZE = 40;
const WORLD_WIDTH = 4;
const START_BTN = <HTMLButtonElement>document.getElementById("start-button");

const GAME_STATUS_DOM_ELEM = document.getElementById("final-game-status");


const CANVAS = <HTMLCanvasElement>document.getElementById("snake-canvas");
CANVAS.height = WORLD_WIDTH * CELL_SIZE;
CANVAS.width = WORLD_WIDTH * CELL_SIZE;

let world: World;

init().then((wasm: InitOutput) => {
  // greet("V1234");

  createWorld();
  initEventListeners();

  function gameLoop() {
    setTimeout(() => {
      world.step();
      paint(CANVAS, wasm);
      requestAnimationFrame(gameLoop);
    }, 300);
  }
  gameLoop();
});

function createWorld() {
  const SNAKE_SPAWN_INDEX = randomInt(WORLD_WIDTH * WORLD_WIDTH);
  world = World.new(WORLD_WIDTH, SNAKE_SPAWN_INDEX);
}

function drawGameStatus() {
  if (!GAME_STATUS_DOM_ELEM) return;
  const gameStatusText = world.game_status_text();
  if (gameStatusText) {
    GAME_STATUS_DOM_ELEM.textContent = gameStatusText;
  }


  const gameStatus = world.game_status();
  if (gameStatus === 2 && START_BTN.textContent !== "Restart") {
    START_BTN.textContent = "Restart";
    START_BTN.addEventListener("click", () => {
      createWorld();
      world.start_game();
    });
  }
}

function handleKeyboardEvent(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowUp":
      world.change_snake_dir(Direction.Up);
      break;
    case "ArrowDown":
      world.change_snake_dir(Direction.Down);
      break;
    case "ArrowLeft":
      world.change_snake_dir(Direction.Left);
      break;
    case "ArrowRight":
      world.change_snake_dir(Direction.Right);
      break;
    default:
      break;
  }
}

function initEventListeners() {
  document.addEventListener("keydown", (event) => {
    handleKeyboardEvent(event);
  });
  
  START_BTN.addEventListener("click", () => {
    world.start_game();
  });
}

function getSnakeCells(wasm: InitOutput) {
  const snakeCellPointer = world.snake_cells();
  const snakeLength = world.snake_length();
  const snakeCells = new Uint32Array(
    wasm.memory.buffer,
    snakeCellPointer,
    snakeLength
  );
  return snakeCells;
}

function drawWorld(ctx: CanvasRenderingContext2D, ) {
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

function drawRewardCell(ctx: CanvasRenderingContext2D) {
  const worldWidth = world.width();
  const idx = world.reward_cell();
  const col = idx % worldWidth;
  const row = Math.floor(idx / worldWidth);

  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  ctx.stroke();
} 

function drawSnakeCell(ctx: CanvasRenderingContext2D, cellIndex: number, color = "black") {
  const worldWidth = world.width();

  const col = cellIndex % worldWidth;
  const row = Math.floor(cellIndex / worldWidth);

  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  ctx.stroke();
}

function drawSnake(
  ctx: CanvasRenderingContext2D,
  wasm: InitOutput
) {
  const snakeCells = getSnakeCells(wasm);

  for (let i = snakeCells.length - 1; i >= 0; i--) {
    drawSnakeCell(ctx, snakeCells[i], i === 0 ? "black" : "green");
  }
}


function paint(canvas: HTMLCanvasElement, wasm: InitOutput) {
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawSnake(ctx, wasm);
  drawRewardCell(ctx);
  drawWorld(ctx);
  drawGameStatus();
}