import { DateGallery, DateGalleryEvent, DateGalleryDate } from "@uiloos/core";
import React, { CSSProperties } from "react";
import { EventData, packEventsOnAxis } from "../events";
import { HourIndicators } from "./components/HourIndicators";
import { DayNames } from "./components/DayNames";
import { DayGrid } from "./components/DayGrid";
import { WeekEvent } from "./components/WeekEvent";
import { HEIGHT } from "./config";
import "./WeekCalendar.css";

type Props = {
  dateGallery: DateGallery<EventData>;
  openNewEventForm(date: Date): void;
  openEditEventForm(event: DateGalleryEvent<EventData>): void;
};

export function WeekCalendar({
  dateGallery,
  openNewEventForm,
  openEditEventForm,
}: Props) {
  const style = { "--height": HEIGHT } as CSSProperties;

  return (
    <div className="calendar-week" style={style}>
      <div className="calendar-week-grid">
        <HourIndicators />

        <DayNames dateGallery={dateGallery} />

        {dateGallery.firstFrame.dates.map((dateObj, index) => {
          const eventColumns = calculateEventColumns(dateObj);

          return (
            <DayGrid
              key={dateObj.date.toISOString()}
              openNewEventForm={openNewEventForm}
              date={dateObj.date}
              gridColumn={index + 2}
            >
              {dateObj.events.map((event) => {
                const gridColumn = eventColumns.get(event);

                return (
                  <WeekEvent
                    key={event.data.id}
                    event={event}
                    dateGallery={dateGallery}
                    gridColumn={gridColumn as string}
                    date={dateObj.date}
                    onClick={() => openEditEventForm(event)}
                  />
                );
              })}
            </DayGrid>
          );
        })}
      </div>
    </div>
  );
}

/* 
  Takes a DateGalleryDate and returns a Map to which the events 
  are keys, and the values are CSS gridColumn strings.

  For example: 
  
  {eventA: '1 / 2', eventB: '2 / 3', eventC: '3 / 4'}

  The events are packed as tight as possible so the least
  amount of columns are used.

  Note: since we are using a CSS grid we do get one limitation:
  you cannot always divide a CSS grid equally over multiple events.
  This is because CSS grids cannot have varying columns / rows, 
  meaning you cannot make one row have three columns, and the other
  row have two.

  This is a problem for us: say you have a day with five events, 
  three of which are overlapping, and the other two overlap as well. 
  This means we end up with 3 columns total to hold the three 
  overlapping events, but then the other 2 events also need to be 
  divided over three columns. 

  In an ideal world we would be able to say: CSS Grid make those 
  two events take the same amount of space in the 3 columms. 
  Essentialy making the 2 events the same size, but unfortunately 
  CSS cannot do this.

  So my solution is to make one of the two events take up 2/3 and 
  the other 1/3. Not ideal but it works
*/
function calculateEventColumns(dateObj: DateGalleryDate<EventData>) {
  // Step one: we place all events into the least amount of columns
  const columns = packEventsOnAxis(dateObj.events);

  // Step two: we take the columns array and turn it into a Map of CSS
  // grid column strings.
  const eventColumns = new Map<DateGalleryEvent<EventData>, string>();

  dateObj.events.forEach((event) => {
    // Shortcut if the event does not overlap make it span
    // all columns.
    if (!event.isOverlapping) {
      eventColumns.set(event, `1 / ${columns.length + 1}`);
      return;
    }

    // The start column is the first column this event can be found in.
    const startColumn = columns.findIndex((column) => column.includes(event));

    // Now that we have found the start, we need to find the end in the
    // remaining columns.
    const remainingColumns = columns.slice(startColumn);

    // The end column is the first column an overlapping event can be found in,
    // since it has to share the column with that event.
    let endColumn = remainingColumns.findIndex((column) =>
      column.some((otherEvent) => event.overlappingEvents.includes(otherEvent)),
    );

    // If we cannot find an endColumn it means it was already on the
    // last column, so place it there.
    if (endColumn === -1) {
      endColumn = columns.length;
    } else {
      // If the endColumn can be found we need to add the startColumn
      // to it since the remainingColumns start counting at 0 again,
      // so we need to make up the difference.
      endColumn += startColumn;
    }

    // Finally we know where to place the event, but we need to
    // account for the fact that CSS grid starts counting at one
    // and not zero. So we +1 the columns.
    eventColumns.set(event, `${startColumn + 1} / ${endColumn + 1}`);
  });

  return eventColumns;
}
