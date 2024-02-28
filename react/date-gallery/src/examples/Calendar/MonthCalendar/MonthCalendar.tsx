import { DateGallery, DateGalleryDate, DateGalleryEvent } from "@uiloos/core";
import React, { DragEvent, useRef } from "react";
import { EventData } from "../events";
import classNames from "classnames";
import { dateTimeFormatter } from "../../formatters";
import { MonthEvent } from "./components/MonthEvent";

import "./MonthCalendar.css";

type Props = {
  dateGallery: DateGallery<EventData>;
  openNewEventForm(date: Date): void;
  openEditEventForm(event: DateGalleryEvent<EventData>): void;
};

export function MonthCalendar({
  dateGallery,
  openNewEventForm,
  openEditEventForm,
}: Props) {
  const eventPositionsByDay = calculateEventPositionByDay(dateGallery);

  let draggedEventRef = useRef<DateGalleryEvent<EventData> | null>(null);

  function onDragOver(
    e: DragEvent<HTMLLIElement>,
    dateObj: DateGalleryDate<EventData>,
  ) {
    e.stopPropagation();

    const draggedEvent = draggedEventRef.current;

    if (!draggedEvent) {
      return;
    }

    // Create a new startDate based on the date that the event
    // has been dragged over.
    const startDate = new Date(dateObj.date);

    // Now copy the original start hours.
    startDate.setHours(
      draggedEvent.startDate.getHours(),
      draggedEvent.startDate.getMinutes(),
    );

    // Calculate the duration of the event.
    const duration =
      draggedEvent.endDate.getTime() - draggedEvent.startDate.getTime();

    // Add the duration to the new startDate to get the endDate
    const endDate = new Date(startDate.getTime() + duration);

    draggedEvent.move({
      startDate,
      endDate,
    });
  }

  return (
    <div className="calendar-month">
      <ul className="calendar-month-daynames">
        <li className="calendar-month-dayname">Sun</li>
        <li className="calendar-month-dayname">Mon</li>
        <li className="calendar-month-dayname">Tue</li>
        <li className="calendar-month-dayname">Wed</li>
        <li className="calendar-month-dayname">Thu</li>
        <li className="calendar-month-dayname">Fri</li>
        <li className="calendar-month-dayname">Sat</li>
      </ul>

      <ul className="calendar-month-daycells">
        {dateGallery.firstFrame.dates.map((dateObj, index) => {
          const eventsForDay = eventPositionsByDay[index];

          // Set the aria label of the button to something sensible
          const date = new Date(dateObj.date);

          // Set the date to the current hour, and to the closest 5 minutes
          const now = new Date();
          date.setHours(now.getHours(), Math.round(now.getMinutes() / 5) * 5);

          const formatted = dateTimeFormatter.format(date);
          const ariaLabel = `Create new event at around ${formatted}`;

          const noRows = eventsForDay.length;
          const gridTemplateRows = `repeat(${noRows}, 32px)`;

          return (
            <li
              key={dateObj.date.toISOString()}
              className={classNames("calendar-month-daycell", {
                padding: dateObj.isPadding,
              })}
              role="button"
              aria-label={ariaLabel}
              onClick={() => openNewEventForm(date)}
              onDragOver={(e) => onDragOver(e, dateObj)}
            >
              <button
                className="calendar-month-daycell-number"
                onClick={(e) => {
                  e.stopPropagation();

                  dateGallery.changeConfig({
                    initialDate: dateObj.date,
                    mode: "day",
                    numberOfFrames: 1,
                  });
                }}
              >
                <time dateTime={dateObj.date.toISOString()}>
                  {dateObj.date.getDate()}
                </time>
              </button>
              <ul
                className="calendar-month-daycell-events"
                style={{ gridTemplateRows }}
              >
                {dateObj.events.map((event) => {
                  /*
                    Here we put an event on a specific row in the CSS grid
                    by doing this all event that are on multiple days are
                    neatly ordered within a week, without any gaps.

                    See the `calculateEventPositionByDay` function below to
                    see how this is calculated.

                    The +1 is needed because CSS Grid starts counting at 1.
                  */
                  const gridRow = eventsForDay.indexOf(event) + 1;

                  return (
                    <MonthEvent
                      key={event.data.id}
                      event={event}
                      dateGallery={dateGallery}
                      dateObj={dateObj}
                      gridRow={gridRow ?? 2}
                      onDrag={(event) => {
                        draggedEventRef.current = event;
                      }}
                      onClick={() => openEditEventForm(event)}
                    />
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* 
  Takes a calendar and returns an array of arrays, each
  subarray represents a day and contains all events of that
  day. 
  
  The position / index of the event with the "day" array is 
  the "row" it should be put in the CSS Grid.
  
  The events are packed as tight as possible so the least
  amount of rows are used.
*/
function calculateEventPositionByDay(dateGallery: DateGallery<EventData>) {
  // Will contain an array for each day of the month
  const month: DateGalleryEvent<EventData>[][] = [];

  dateGallery.firstFrame.dates.forEach((dateObj, index) => {
    // Will contain all events within the day.
    const day: DateGalleryEvent<EventData>[] = [];

    const prevDay = month[index - 1];

    dateObj.events.forEach((event) => {
      if (!event.spansMultipleDays) {
        return;
      }

      // If there is a previous day, meaning it is not the
      // first day of the displayed month calendar
      if (prevDay) {
        // Try finding the event within the previous day
        const index = prevDay.indexOf(event);

        // If the event exists add it on this day at the same index / row
        // as the day before, this makes an event appear on the same
        // row for multiple days which is visually pleasing.
        if (index !== -1) {
          day[index] = event;
          return;
        }
      }

      let firstEmptyIndex = 0;

      // Find the first empty position within the `day` array.
      // This way we find the first empty row and fill it, this
      // makes sure the events are packed close together.
      while (day[firstEmptyIndex]) {
        firstEmptyIndex++;
      }

      day[firstEmptyIndex] = event;
    });

    month.push(day);
  });

  return month;
}
