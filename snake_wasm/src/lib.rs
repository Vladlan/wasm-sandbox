use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


#[wasm_bindgen]
pub fn greet(name: &str) {
    let name = format!("name: {}", name);
    alert(&name);

    log(&name);
}

#[wasm_bindgen]
extern {
   pub fn alert(name: &str);
}

// the same for console.log
#[wasm_bindgen(js_namespace = console)]
extern {
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
    body: Vec<SnakeCell>
}

impl Snake {
    fn new(start_index: usize) -> Snake {
        Snake {
            body: vec![SnakeCell(start_index)]
        }
    }
}
#[wasm_bindgen]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, snake_start_index: usize) -> World {
        World {
            width,
            size: width * width,
            snake: Snake::new(snake_start_index)
        }
    }

    pub fn width(&self) -> usize {
        self.width
    }


    pub fn snake_head_index(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn update(&mut self) {
        let snake_index = self.snake_head_index();
        self.snake.body[0].0 = (snake_index + 1) % self.size;

    }
}
