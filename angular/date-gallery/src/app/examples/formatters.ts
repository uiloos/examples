// December 2002
export const monthAndYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
});

// 2000-01-01
export const isoFormatter = new Intl.DateTimeFormat('fr-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

// 12:45
export const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23', // 00:00 to 23:59 instead of 24:00
});

// 2000
export const yearFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
});

// December
export const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
});

// 12-31-2000
export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

// 12-31-2000, 12:34
export const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23', // 00:00 to 23:59 instead of 24:00
});

// Monday 1
export const weekDayFormatter = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  weekday: 'short',
});
