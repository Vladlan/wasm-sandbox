function factorial(x) {
  return x < 1 ? 1 : x * factorial(x - 1);
}

const startTime = performance.now();

const n = 9_111;
const res = factorial(n);

const endTime = performance.now();
const elapsedTime = endTime - startTime;

console.log(`factorial of ${n} (${res}) took ${elapsedTime.toFixed(3)} ms to execute.`);
insertResultInTheBody(`factorial of ${delimitThousands(n)} (${res}) took ${elapsedTime.toFixed(3)} ms to execute.`);
