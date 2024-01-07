function insertResultInTheBody(result) {
  const body = document.querySelector("body");
  const resultElement = document.createElement("p");
  resultElement.innerHTML = result;
  body.appendChild(resultElement);
}
