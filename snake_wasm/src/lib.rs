use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(PartialEq)]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    let name = format!("name: {}", name);
    alert(&name);

    log(&name);
}

#[wasm_bindgen]
extern "C" {
    pub fn alert(name: &str);
}

// the same for console.log
#[wasm_bindgen(js_namespace = console)]
extern "C" {
    #[wasm_bindgen(js_name = log)]
    pub fn log(s: &str);

    // Optionally, bind multiple arguments or other console methods
    #[wasm_bindgen(js_name = error)]
    pub fn error(s: &str);
}

// to rebuild code run: (note you will have to restart web server to see changes)
// wasm-pack build --target web

struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake {
    fn new(start_index: usize) -> Snake {
        Snake {
            body: vec![SnakeCell(start_index)],
            direction: Direction::Down,
        }
    }
}
#[wasm_bindgen]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, snake_start_index: usize) -> World {
        World {
            width,
            size: width * width,
            snake: Snake::new(snake_start_index),
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn change_snake_dir(&mut self, direction: Direction) {
        self.snake.direction = direction;
    }

    pub fn snake_head_index(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn update(&mut self) {
        let snake_index = self.snake_head_index();
        let (row, col) = self.index_to_cell(snake_index);
        let (row, col) = match self.snake.direction {
            Direction::Up => {((row - 1) % self.width, col)},
            Direction::Down => {((row + 1) % self.width, col)},
            Direction::Left => {(row, (col - 1) % self.width)},
            Direction::Right => {(row, (col + 1) % self.width)},
        };

        let next_idx = self.cell_to_index(row, col);
        self.set_snake_head(next_idx)
    }

    fn set_snake_head(&mut self, idx: usize) {
        self.snake.body[0].0 = idx;
    }

    fn index_to_cell(&self, idx: usize) -> (usize, usize) {
        (idx / self.width, idx % self.width)
    }

    fn cell_to_index(&self, row: usize, col: usize) -> usize {
        (row * self.width) + col
    }
}
