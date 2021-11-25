export function formatDate(date) {
  try {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const msec = Date.parse(date);
    var date = new Date(msec);
    const dateString = date.toLocaleDateString("en-US", options);
    return dateString;
  } catch (err) {
    console.log(err);
    return "";
  }
}

export function formatDateWithHourAndSeconds(date) {
  try {
    const msec = Date.parse(date);
    var date1 = new Date(msec);
    // Date portion of string
    const options1 = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const dateString1 = date1.toLocaleDateString("en-US", options1);
    // Time portion of string
    const options2 = { hour: "2-digit", minute: "2-digit", second: "2-digit" };
    const dateString2 = date1.toLocaleTimeString("en-US", options2);
    return dateString1 + " " + dateString2;
  } catch (err) {
    console.log(err);
    return "";
  }
}
