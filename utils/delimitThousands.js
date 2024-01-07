function delimitThousands(num, delimiter = ",") {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter);
}