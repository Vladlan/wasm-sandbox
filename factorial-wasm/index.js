async function main () {
  const response = await fetch('factorial.wasm');
  const buffer = await response.arrayBuffer();
  const wasm = await WebAssembly.instantiate(buffer);
  console.log('wasm.instance.exports: ', wasm.instance.exports);
  const factorial = wasm.instance.exports.fac;
  const startTime = performance.now();
  const n = 12_111;
  const res = factorial(n);
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;
  console.log(`factorial of ${n} (${res}) took ${elapsedTime.toFixed(3)} ms to execute.`);
  insertResultInTheBody(`factorial of ${delimitThousands(n)} (${res}) took ${elapsedTime.toFixed(3)} ms to execute.`);
}


main();