const canvas = document.getElementById("myCanvas");
const canvas2 = document.getElementById("myCanvas2");
const ctx = canvas.getContext("2d");
const ctx2 = canvas2.getContext("2d");

// Draw a rectangle
const rectangleX = 150;
const rectangleY = 150;
const rectangleWidth = 200;
const rectangleHeight = 200;
drawRectangle(rectangleX, rectangleY, rectangleWidth, rectangleHeight);
// Check if dot is inside a circle (for example, centered at the middle of the rectangle)
const circleX = rectangleX + rectangleWidth / 2;
const circleY = rectangleY + rectangleHeight / 2;
const circleRadius = Math.min(rectangleWidth, rectangleHeight) / 2;
drawCircle(circleX, circleY, circleRadius);

const startTime = performance.now();
calculatePiAndDraw(
  rectangleX,
  rectangleY,
  rectangleWidth,
  rectangleHeight,
  circleX,
  circleY,
  circleRadius
);
const imgDataArr = calculatePiWithDrawing(
  rectangleX,
  rectangleY,
  rectangleWidth,
  rectangleHeight,
  circleX,
  circleY,
  circleRadius
);

const imgData = ctx2.createImageData(rectangleHeight, rectangleWidth);
imgData.data.set(imgDataArr);
ctx2.putImageData(imgData, rectangleX, rectangleY);
const endTime = performance.now();
const elapsedTime = endTime - startTime;

console.log(`Function took ${elapsedTime.toFixed(3)} milliseconds to execute.`);
