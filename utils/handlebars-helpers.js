var check_range =  function (value, min, max) {
  console.log(value);
  return min < value && value < max;
};

module.exports.check_range = check_range;
