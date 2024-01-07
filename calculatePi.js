const PI_TO_CALCULATE = `${Math.PI}`.slice(0, 7);
let dotsInCircle = 0;
let dotsInSquare = 0;

function calculatePi(
  rectangleX,
  rectangleY,
  rectangleWidth,
  rectangleHeight,
) {
  //   for (let i = 0; i < numberOfDots; i++) {
  // for (let i = 0; i < numberOfDots; i++) {
  //   const { dotX, dotY } = generateRandomDotInsideRectangle(rectangleX, rectangleY, rectangleWidth, rectangleHeight);

  //   // Draw dot
  //   ctx.beginPath();
  //   ctx.arc(dotX, dotY, 2, 0, 2 * Math.PI);

  //   if (isPointInCircle(dotX, dotY, circleX, circleY, circleRadius)) {
  //     dotsInCircle++;
  //       ctx.fillStyle = 'red';
  //   } else {
  //       ctx.fillStyle = 'blue';
  //   }
  //   ctx.fill();

  //   dotsInSquare++;
  //   console.log('PI = ', 4 * dotsInCircle / dotsInSquare);

  // }

  // fill rectangle with dots starting from top left corner till bottom right corner
  let calPi = 0
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
      // console.log("PI = ", calPi);
    }
  }

  console.log(
    `It took ${dotsInSquare} iterations to calculate ${`${calPi}`.slice(0, 7)}, actual PI is ${PI_TO_CALCULATE}`
  );
}
