use rust_sum::sum;

fn main() {
    let mut message = "Hello, world!";
    message = "Goodbye, world!";
    println!("{}", message);


    let a = 10;
    let b = 20;

    println!("{} + {} = {}", a, b, sum(a, b));
}
