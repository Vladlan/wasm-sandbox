function factorial(n) {
  if (!Number.isSafeInteger(n) || n < 0) {
    throw new RangeError("n must be a non-negative safe integer");
  }

  let result = 1n;
  for (let value = 2; value <= n; value++) {
    result *= BigInt(value);
  }
  return result;
}

const startTime = performance.now();

const n = 9_111;
const res = factorial(n);

const endTime = performance.now();
const elapsedTime = endTime - startTime;

console.log(`factorial of ${n} (${res}) took ${elapsedTime.toFixed(3)} ms to execute.`);
insertResultInTheBody(`factorial of ${delimitThousands(n)} (${res}) took ${elapsedTime.toFixed(3)} ms to execute.`);
