function factorial(n) {
  if (n === 0) {
    return 1
  }
  return n * factorial(n - 1)
}

const startTime = performance.now();

const n = 2511;
const res = factorial(n);

const endTime = performance.now();
const elapsedTime = endTime - startTime;

console.log(`factorial of ${n} (${res}) took ${elapsedTime} ms to execute.`);
