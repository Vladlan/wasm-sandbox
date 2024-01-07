function calculatePiAndDraw(
  rectangleX,
  rectangleY,
  rectangleWidth,
  rectangleHeight,
  circleX,
  circleY,
  circleRadius
) {
  const PI_TO_CALCULATE = `${Math.PI}`.slice(0, 7);
  let dotsInCircle = 0;
  let dotsInSquare = 0;
  // fill rectangle with dots starting from top left corner till bottom right corner
  let calPi = 0;
  for (let y = rectangleY; y < rectangleY + rectangleHeight; y++) {
    for (let x = rectangleX; x < rectangleX + rectangleWidth; x++) {
      // Draw dot
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI);

      if (isPointInCircle(x, y, circleX, circleY, circleRadius)) {
        dotsInCircle++;
        ctx.fillStyle = "red";
      } else {
        ctx.fillStyle = "blue";
      }
      ctx.fill();

      dotsInSquare++;
      calPi = (4 * dotsInCircle) / dotsInSquare;
    }
  }

  console.log(
    `It took ${dotsInSquare} iterations to calculate ${`${calPi}`.slice(
      0,
      7
    )}, actual PI is ${PI_TO_CALCULATE}`
  );
}
