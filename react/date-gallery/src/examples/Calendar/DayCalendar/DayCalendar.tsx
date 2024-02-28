import { DateGallery, DateGalleryEvent } from "@uiloos/core";
import React, { CSSProperties } from "react";
import { packEventsOnAxis, EventData } from "../events";
import { CurrentHour } from "./components/CurrentHour";
import { DayEvent } from "./components/DayEvent";
import { HourIndicators } from "./components/HourIndicators";
import { WIDTH } from "./config";
import "./DayCalendar.css";

type Props = {
  dateGallery: DateGallery<EventData>;
  openNewEventForm(date: Date): void;
  openEditEventForm(event: DateGalleryEvent<EventData>): void;
};

export function DayCalendar({
  dateGallery,
  openNewEventForm,
  openEditEventForm,
}: Props) {
  const eventRows = calculateEventRows(dateGallery);

  const rows = getNoRows(eventRows);

  const style = { "--width": WIDTH } as CSSProperties;

  return (
    <ul className="calendar-day-grid" style={style}>
      <HourIndicators
        dateGallery={dateGallery}
        openNewEventForm={openNewEventForm}
        rows={rows}
      />

      <CurrentHour dateGallery={dateGallery} rows={rows} />

      {dateGallery.firstFrame.events.map((event) => (
        <DayEvent
          key={event.data.id}
          event={event}
          dateGallery={dateGallery}
          gridRow={eventRows.get(event) as string}
          onClick={() => openEditEventForm(event)}
        />
      ))}
    </ul>
  );
}

/* 
  Takes a DateGallery and returns a Map to which the events 
  are keys, and the values are CSS gridRow strings.

  For example: 
  
  {eventA: '1 / 2', eventB: '2 / 3', eventC: '3 / 4'}

  The events are packed as tight as possible so the least
  amount of rows are used.
*/
function calculateEventRows(
  dateGallery: DateGallery<EventData>,
): Map<DateGalleryEvent<EventData>, string> {
  // Step one: we place all events into the least amount of rows
  const rows = packEventsOnAxis(dateGallery.events);

  // Step two: we take the rows array and turn it into a Map of CSS
  // grid row strings.
  const eventRows = new Map<DateGalleryEvent<EventData>, string>();

  dateGallery.events.forEach((event) => {
    const row = rows.findIndex((row) => row.includes(event));

    // Finally we know where to place the event, but we need to
    // account for the fact that CSS grid starts counting at one
    // and not zero. So we +1 the rows. Also we now that the first
    // row shows the hours so another +1 is needed.
    eventRows.set(event, `${row + 2}`);
  });

  return eventRows;
}

function getNoRows(eventRows: Map<DateGalleryEvent<EventData>, string>) {
  let noRows = 0;

  eventRows.forEach((rowStr) => {
    noRows = Math.max(parseInt(rowStr, 10), noRows);
  });

  return noRows < 20 ? 20 : noRows;
}
