function generateRandomDotInsideRectangle(
  rectangleX,
  rectangleY,
  rectangleWidth,
  rectangleHeight
) {
  const dotX = rectangleX + Math.random() * rectangleWidth;
  const dotY = rectangleY + Math.random() * rectangleHeight;
  return { dotX, dotY };
}