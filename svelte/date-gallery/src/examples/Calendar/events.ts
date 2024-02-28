import type { DateGalleryEvent, DateGalleryEventConfig } from "@uiloos/core";

import { dateFormatter, timeFormatter, dateTimeFormatter } from "../formatters";

export type EventData = {
  id: number;
  title: string;
  description: string;
  color: string;
};

export function formatDateForInput(date: Date) {
  const time = timeFormatter.format(date);

  return `${dateFormatter.format(date)} ${time}`;
}

// Packs all events on an axis (row / column) as tightly as possible
// with the least amount of rows / columns needed.
export function packEventsOnAxis(events: DateGalleryEvent<EventData>[]) {
  // Note: the code below uses the term columns / column for clarity
  // but it also works for rows.

  // Step one: we place all events into the least amount of columns
  const columns: DateGalleryEvent<EventData>[][] = [[]];

  events.forEach((event) => {
    // Shortcut if the event does not overlap we can
    // safely place it in the first column.
    if (!event.isOverlapping) {
      columns[0].push(event);
      return;
    }

    // Find the first column we do not have overlapping events in,
    // since that is the place the event can fit into. By finding
    // the first column it fits into we make sure we use as little
    // columns as possible.
    const column = columns.find((column) => {
      return column.every(
        (otherEvent) => !event.overlappingEvents.includes(otherEvent),
      );
    });

    if (column) {
      // If we find a columm, great add the event to it.
      column.push(event);
    } else {
      // If we cannot find a column the event fits into
      // we create a new column.
      columns.push([event]);
    }
  });

  return columns;
}

export function ariaLabelForEvent(event: DateGalleryEvent<EventData>) {
  const start = dateTimeFormatter.format(event.startDate);
  const end = dateTimeFormatter.format(event.endDate);

  return `Edit event titled: '${event.data.title}', which starts on ${start} and ends on ${end}`;
}

// Generate some events for the current year
export function generateEvents(): DateGalleryEventConfig<EventData>[] {
  const currentYear = new Date().getFullYear();

  const events: DateGalleryEventConfig<EventData>[] = [];

  for (const year of [currentYear - 1, currentYear, currentYear + 1]) {
    for (let i = 1; i < 13; i++) {
      const month = i > 9 ? i : "0" + i;

      // Add a hair salon appoinment at every first of the month
      events.push({
        data: {
          id: eventId(),
          title: "Hairsalon",
          description: "Got to look sharp!",
          color: "#ef4444",
        },
        startDate: new Date(`${year}-${month}-01T12:00:00`),
        endDate: new Date(`${year}-${month}-01T12:45:00`),
      });

      // Add a gym appoinment at the 15th
      events.push({
        data: {
          id: eventId(),
          title: "Gym with friends from work",
          description: "Got to stay in shape!",
          color: "#f97316",
        },
        startDate: new Date(`${year}-${month}-15T20:00:00`),
        endDate: new Date(`${year}-${month}-15T22:00:00`),
      });

      // Add DnD appointment on 15th as well
      events.push({
        data: {
          id: eventId(),
          title: "DnD",
          description: "Or should I play DnD instead...",
          color: "#84cc16",
        },
        startDate: new Date(`${year}-${month}-15T20:00:00`),
        endDate: new Date(`${year}-${month}-15T22:00:00`),
      });

      // Add Pinball tournament on the 25th
      events.push({
        data: {
          id: eventId(),
          title: "Pinball",
          description: "At the pinball museum",
          color: "#10b981",
        },
        startDate: new Date(`${year}-${month}-25T20:00:00`),
        endDate: new Date(`${year}-${month}-25T22:00:00`),
      });

      // Add JS meetup on 15th as well
      events.push({
        data: {
          id: eventId(),
          title: "JS Meetup",
          description: "Very informative",
          color: "#3b82f6",
        },
        startDate: new Date(`${year}-${month}-15T20:00:00`),
        endDate: new Date(`${year}-${month}-15T21:00:00`),
      });

      // Add vacation from 2nd to 7th
      events.push({
        data: {
          id: eventId(),
          title: "Vacation",
          description: "Gran Canaria here I come!",
          color: "#a855f7",
        },
        startDate: new Date(`${year}-${month}-01T08:30:00`),
        endDate: new Date(`${year}-${month}-07T09:00:00`),
      });

      // Add move to new house from 5nd to 8th
      events.push({
        data: {
          id: eventId(),
          title: "Move to new house",
          description: "5th avenue",
          color: "#ec4899",
        },
        startDate: new Date(`${year}-${month}-05T08:00:00`),
        endDate: new Date(`${year}-${month}-08T09:00:00`),
      });

      // Add move to new house from 5nd to 8th
      events.push({
        data: {
          id: eventId(),
          title: "Visit grandma",
          description: "She makes delicious cookies.",
          color: "#60a5fa",
        },
        startDate: new Date(`${year}-${month}-03T08:00:00`),
        endDate: new Date(`${year}-${month}-09T09:00:00`),
      });

      // Add move to new house from 8nd to 9th
      events.push({
        data: {
          id: eventId(),
          title: "Work project",
          description: "Work day and night",
          color: "#a3e635",
        },
        startDate: new Date(`${year}-${month}-08T08:00:00`),
        endDate: new Date(`${year}-${month}-09T09:00:00`),
      });
    }
  }

  return events;
}

let id = 0;
export function eventId() {
  id++;
  return id;
}
