import init, { greet, World } from "snake_game";

init().then(_ => {
  // greet("V1234");
  console.log("OK! 123");

  const world = World.new(16);
  console.log('world: ', world.width());
})