function calculatePiWithDrawing(
  rectangleX,
  rectangleY,
  rectangleWidth,
  rectangleHeight,
  circleX,
  circleY,
  circleRadius
) {
  let calculatedPi = 0;
  const imgDataArr = [];
  const PI_TO_CALCULATE = `${Math.PI}`.slice(0, 7);
  let dotsInCircle = 0;
  let dotsInSquare = 0;

  // fill rectangle with dots starting from top left corner till bottom right corner
  for (let y = rectangleY; y < rectangleY + rectangleHeight; y++) {
    for (let x = rectangleX; x < rectangleX + rectangleWidth; x++) {
      const i = dotsInSquare * 4;

      if (isPointInCircle(x, y, circleX, circleY, circleRadius)) {
        dotsInCircle++;

        imgDataArr[i + 0] = 255;
        imgDataArr[i + 1] = 0;
        imgDataArr[i + 2] = 0;
      } else {
        imgDataArr[i + 0] = 0;
        imgDataArr[i + 1] = 0;
        imgDataArr[i + 2] = 255;
      }
      imgDataArr[i + 3] = 255;

      dotsInSquare++;
      calculatedPi = (4 * dotsInCircle) / dotsInSquare;
    }
  }

  console.log(
    `It took ${dotsInSquare} iterations to calculate ${`${calculatedPi}`.slice(
      0,
      7
    )}, actual PI is ${PI_TO_CALCULATE}`
  );

  return imgDataArr;
}
