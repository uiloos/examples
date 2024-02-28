// Based on the background color given, it will return
// whether or not the text color should be black or white.
export function yiq(backgroundColorHex: string): "black" | "white" {
  const r = parseInt(backgroundColorHex.substr(1, 2), 16);
  const g = parseInt(backgroundColorHex.substr(3, 2), 16);
  const b = parseInt(backgroundColorHex.substr(5, 2), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}

// When given a date it returns the number of minutes
// that have passed since midnight. For example if the time
// was 12:30 you would get 12 * 60 + 30 = 750 minutes.
export function minutesSinceMidnight(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

// When given a date it returns the number of minutes
// that have passed since the startHour.
export function getMinutesSinceStart(date: Date, startHour: number) {
  const midnight = minutesSinceMidnight(date);

  // Since we start on 09:00 hours we need to treat 09:00 hours
  // as the starting point, so shift the minutes back by 09:00
  // hours.
  const minutesSinceStart = midnight - startHour * 60;

  // If the start time lied before the startHour, place it on
  // the start.
  if (minutesSinceStart < 0) {
    return 0;
  }

  return minutesSinceStart;
}

let image: HTMLImageElement | null = null;
export function emptyImage() {
  if (image) {
    return image;
  }

  // An empty image used when dragging of an event, so
  // no drag ghost appears
  image = document.createElement("img");
  // Set the src to be a 0x0 gif
  image.src =
    "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

  return image;
}
