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
#[derive(PartialEq, Clone, Copy)]
pub enum GameStatus {
    Won,
    Lost,
    Playing,
}

#[wasm_bindgen(module = "/www/utils/randomInt.js")]
extern "C" {
    fn randomInt(max: usize) -> usize;
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

#[derive(PartialEq, Clone, Copy)]
pub struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake {
    fn new(start_index: usize, size: usize) -> Snake {
        let mut body = vec![];

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
    snake_init_size: usize,
    snake: Snake,
    next_cell: Option<SnakeCell>,
    reward_cell: usize,
    status: Option<GameStatus>,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, snake_start_index: usize) -> World {
        let snake_init_size = 3;
        let snake = Snake::new(snake_start_index, snake_init_size);
        let size = width * width;

        World {
            reward_cell: World::get_reward_cell(size, &snake.body),
            width,
            size,
            snake,
            next_cell: None,
            status: None,
            snake_init_size,
        }
    }

    fn get_reward_cell(max: usize, snake_body: &Vec<SnakeCell>) -> usize {
        let mut reward_cell;

        loop {
            reward_cell = randomInt(max);
            if !snake_body.contains(&SnakeCell(reward_cell)) {
                break;
            }
        }

        return reward_cell;
    }

    pub fn width(&self) -> usize {
        self.width
    }

    pub fn reward_cell(&self) -> usize {
        self.reward_cell
    }

    pub fn start_game(&mut self) {
        if self.status == Some(GameStatus::Playing) {
            return;
        }
        if self.status == Some(GameStatus::Won) {
            return;
        }

        self.status = Some(GameStatus::Playing);
    }

    pub fn game_status(&self) -> Option<GameStatus> {
        self.status
    }

    pub fn get_points(&self) -> String {
        (self.snake_length() - self.snake_init_size).to_string()
    }


    pub fn game_status_text(&self) -> String {
        match self.status {
            Some(GameStatus::Won) => "You won! (Points: ".to_string() + self.get_points().as_str() + " )",
            Some(GameStatus::Lost) => "You lost!".to_string(),
            Some(GameStatus::Playing) => "Points: ".to_string() + self.get_points().as_str(),
            _ => "".to_string(),
        }
    }

    pub fn change_snake_dir(&mut self, direction: Direction) {
        let next_cell = self.gen_next_snake_cell(&direction);
        if self.snake.body[1].0 == next_cell.0 {
            return;
        }
        self.next_cell = Some(next_cell);
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
        match self.status {
            Some(GameStatus::Playing) => {
                let temp_snake_body = self.snake.body.clone();

                match self.next_cell {
                    Some(cell) => {
                        self.snake.body[0] = cell;
                        self.next_cell = None;
                    }
                    None => {
                        self.snake.body[0] = self.gen_next_snake_cell(&self.snake.direction);
                    }
                }
        
                let len: usize = self.snake.body.len();
        
                for i in 1..len {
                    self.snake.body[i] = SnakeCell(temp_snake_body[i - 1].0);
                }

                // Snake collision
                if self.snake.body[1..self.snake_length()].contains(&self.snake.body[0]) {
                    self.status = Some(GameStatus::Lost);
                }
        
                // Reward collision
                if self.reward_cell == self.snake_head_index() {
                    if self.snake_length() < self.size {
                        self.reward_cell = World::get_reward_cell(self.size, &self.snake.body);
                    } else {
                        self.status = Some(GameStatus::Won);
                    }
        
                    self.snake.body.push(SnakeCell(self.snake.body[1].0));
                }
            }
            _ => {}
        }
    }

    fn gen_next_snake_cell(&self, direction: &Direction) -> SnakeCell {
        let snake_idx = self.snake_head_index();
        let row = snake_idx / self.width;
        let world_height = self.width;
        let world_width = self.width;

        let log_now = format!("world_width: {}", world_width);
        log(&log_now);

        return match direction {
            Direction::Right => {
                let treshold = (row + 1) * world_width;
                if snake_idx + 1 == treshold {
                    SnakeCell(treshold - world_width)
                } else {
                    SnakeCell(snake_idx + 1)
                }
            }
            Direction::Left => {
                let treshold = row * world_width;
                if snake_idx == treshold {
                    SnakeCell(treshold + (world_width - 1))
                } else {
                    SnakeCell(snake_idx - 1)
                }
            }
            Direction::Up => {
                let treshold = snake_idx - (row * world_height);
                if snake_idx == treshold {
                    SnakeCell((self.size - world_height) + treshold)
                } else {
                    SnakeCell(snake_idx - world_height)
                }
            }
            Direction::Down => {
                let treshold = snake_idx + ((world_height - row) * world_height);
                if snake_idx + world_height == treshold {
                    SnakeCell(treshold - ((row + 1) * world_height))
                } else {
                    SnakeCell(snake_idx + world_height)
                }
            }
        };
    }
}

// to rebuild code run: (note you will have to restart web server to see changes)
// wasm-pack build --target web
