function price_to_number(v) {
  if (!v) {
    return 0;
  }
  v = v.split(".").join("");
  v = v.split(",").join(".");
  return Number(v.replace(/[^0-9.]/g, ""));
}

module.exports = price_to_number;
