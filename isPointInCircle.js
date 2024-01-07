function isPointInCircle(pointX, pointY, circleX, circleY, radius) {
  const distance = Math.sqrt((pointX - circleX) ** 2 + (pointY - circleY) ** 2);
  return distance <= radius;
}
