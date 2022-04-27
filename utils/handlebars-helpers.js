var check_range =  function (value, min, max) {
  return min < value && value < max;
};

module.exports.check_range = check_range;
