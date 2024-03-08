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

#[derive(Clone)]
pub struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake {
    fn new(start_index: usize, size: usize) -> Snake {
        let mut body = vec!();

        for i in 0..size { 
            body.push(SnakeCell(start_index - i))
        }

        Snake {
            body,
            direction: Direction::Right,
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
            snake: Snake::new(snake_start_index, 3),
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn snake_head_idx(&self) -> usize {
        self.snake.body[0].0
     }

    pub fn change_snake_dir(&mut self, direction: Direction) {
        let next_cell = self.gen_next_snake_cell(&direction);
        if self.snake.body[1].0 == next_cell.0 { return; }
        self.snake.direction = direction;
    }

    pub fn snake_head_index(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn snake_length(&self) -> usize {
        self.snake.body.len()
    }

    // memory raw pointer (*const) to snake cells
    pub fn snake_cells(&self) -> *const SnakeCell {
        self.snake.body.as_ptr() 
    }

    pub fn step(&mut self) {
        let temp_snake_body = self.snake.body.clone();
        let next_position_of_head_cell = self.gen_next_snake_cell(&self.snake.direction);
        self.snake.body[0] = next_position_of_head_cell;

        let len: usize = self.snake.body.len();

        for i in 1..len {
            self.snake.body[i] = SnakeCell(temp_snake_body[i - 1].0);
        }
    }

    fn gen_next_snake_cell(&self, direction: &Direction) -> SnakeCell {
        let snake_idx = self.snake_head_idx();
        let row = snake_idx / self.width;
        let world_height = self.width;
        let world_width = self.width;

        return match direction {
            Direction::Right => {
                let treshold = (row + 1) * world_width;
                if snake_idx + 1 == treshold {
                    SnakeCell(treshold - world_width)
                } else {
                    SnakeCell(snake_idx + 1)
                }
            },
            Direction::Left => {
                let treshold = row * world_width;
                if snake_idx == treshold {
                    SnakeCell(treshold + (world_width - 1))
                } else {
                    SnakeCell(snake_idx - 1)
                }
            },
            Direction::Up => {
                let treshold = snake_idx - (row * world_height);
                if snake_idx == treshold {
                    SnakeCell((self.size - world_height) + treshold)
                } else {
                    SnakeCell(snake_idx - world_height)
                }
            },
            Direction::Down => {
                let treshold = snake_idx + ((world_height - row) * world_height);
                if snake_idx + world_height == treshold {
                    SnakeCell(treshold - ((row + 1) * world_height))
                } else {
                    SnakeCell(snake_idx + world_height)
                }
            },
        };
    }
}



// to rebuild code run: (note you will have to restart web server to see changes)
// wasm-pack build --target web