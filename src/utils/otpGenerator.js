const crypto = require("crypto");

function generateOtp(length = 6) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return crypto.randomInt(min, max).toString();
}

module.exports = generateOtp;
