import React, { ReactNode } from "react";
import { START_HOUR } from "../config";

type Props = {
  date: Date;
  gridColumn: number;
  openNewEventForm(date: Date): void;
  children: ReactNode;
};

export function DayGrid({
  openNewEventForm,
  date,
  gridColumn,
  children,
}: Props) {
  return (
    <ul
      data-date={date.getTime()}
      className="calendar-week-day-grid"
      style={{ gridColumn }}
      onClick={(e) => {
        if (e.target instanceof HTMLElement) {
          // To determine the minute we look to where the user
          // clicked in the day cell. Remember: the day cell
          // is HEIGHT in height, one pixel per minute.
          const rect = e.target.getBoundingClientRect();
          const distanceInMinutes = e.clientY - rect.top;

          let hour = Math.floor(distanceInMinutes / 60);
          hour += START_HOUR;

          let minute = Math.round(distanceInMinutes % 60);
          // Round to closest 5 minutes
          minute = Math.round(minute / 5) * 5;

          const startDate = new Date(date);
          startDate.setHours(hour, minute);
          openNewEventForm(startDate);
        }
      }}
    >
      {children}
    </ul>
  );
}
