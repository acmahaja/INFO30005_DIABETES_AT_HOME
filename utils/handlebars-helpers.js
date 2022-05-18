const data_title = function(currType, type){
    var result = "";
    if (currType === type) result = "selected white";
    return result;
}

const threshold_title = function (value) {
  var type = ""
  if (value === "blood_glucose") 
    type = "Blood Glucose";
  if (value === "steps")
    type = "Steps"
  if (value === "weight")
    type = "Weight"
  if (value === "insulin")
   type = "Insulin"
  
  return `Update ${type} Thresholds`;
};

const tickbox = function (value) {
  return value ? "checked" : null;
};

var check_range = function (value, min, max) {
  return min <= value && value <= max;
};

const getWeekDay = function (dateString) {
  const date = new Date(dateString);
  const week = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return week[date.getDay()];
};

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

  const date = new Date(dateString);
  return (
    date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear()
  );
};

const is_defined = function(value) {
    return value !== undefined && value !== "" && value !== [] && value !== null;
}

module.exports = {
  tickbox,
  check_range,
  formatDate,
  formatDateTime,
  getWeekDay,
  threshold_title,
  data_title,
  is_defined,
};
