import { DateGallery } from "@uiloos/core";
import React, { ReactNode } from "react";
import { timeFormatter } from "../../../formatters";
import { EventData } from "../../events";
import { START_HOUR, END_HOUR } from "../config";

type Props = {
  dateGallery: DateGallery<EventData>;
  rows: number;
  openNewEventForm(date: Date): void;
};

export function HourIndicators({ dateGallery, rows, openNewEventForm }: Props) {
  const times: ReactNode[] = [];

  for (let i = START_HOUR; i < END_HOUR + 1; i++) {
    const column = (i - START_HOUR) * 60 + 1;

    const date = new Date(dateGallery.firstFrame.anchorDate);
    date.setHours(i, 0, 0, 0);

    const time = timeFormatter.format(date);

    times.push(
      <li
        key={i}
        className="calendar-day-hour"
        aria-hidden
        style={{
          gridColumn: `${column} / ${column + 60}`,
          gridRow: `1 / ${rows}`,
        }}
        onClick={(event) => {
          if (event.target instanceof HTMLElement) {
            // To determine the minute we look to where the user
            // clicked in the hour cell. Remember: the hour cell
            // is 60px in height, one pixel per minute.
            const rect = event.target.getBoundingClientRect();
            const distanceInMinutes = event.clientX - rect.left;

            // Round to closest 5 minutes
            const minute = Math.round(distanceInMinutes / 5) * 5;

            const eventDate = new Date(date);
            eventDate.setHours(date.getHours(), minute);

            openNewEventForm(eventDate);
          }
        }}
      >
        {time}
      </li>,
    );
  }

  return <>{times}</>;
}
