var check_range =  function (value, min, max) {
  return min <= value && value <= max;
};


const getWeekDay = function (dateString) {
  const date = new Date(dateString)
  const week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  return week[date.getDay()]
}


const formatDateTime = function (dateString) {
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

  const date = new Date(dateString);
  return (
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds() +
    "         " +
    date.getDate() +
    " " +
    months[date.getMonth()] +
    " " +
    date.getFullYear()
  );
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
  return  date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
};

module.exports = { check_range, formatDate, formatDateTime, getWeekDay };
