var check_range =  function (value, min, max) {
  return min <= value && value <= max;
};

const formatDate = function (dateString) {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUNE",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

  const date = new Date(dateString)
  return date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
};

module.exports = { check_range, formatDate };
