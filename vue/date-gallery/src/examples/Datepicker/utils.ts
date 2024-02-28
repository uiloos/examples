/*
  It is highly recommended to use a date library parse / validate
  dates, using date-fns here, but you could also use Luxon, dayjs or 
  Moment.js
*/
import { parse } from "date-fns";

export function parseAsDate(value: string | undefined | null) {
  if (!value) {
    return null;
  }

  // Check for special strings first
  if (value.toLowerCase() === "today") {
    return new Date();
  } else if (value.toLowerCase() === "tomorrow") {
    const date = new Date();
    date.setDate(date.getDate() + 1);

    return date;
  } else if (value.toLowerCase() === "yesterday") {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    return date;
  } else {
    // If the date is in format 'MM/dd/yyyy' append 00:00
    // this makes the input a little more forgiving.
    if (value.length === 10) {
      value += " 00:00";
    }

    // If it is not a special string then parse it as a date string.
    return parse(value, "MM/dd/yyyy HH:mm", new Date());
  }
}
