import React, { ReactNode } from "react";
import { START_HOUR, END_HOUR } from "../config";

import { timeFormatter } from "../../../formatters";

export function HourIndicators() {
  const times: ReactNode[] = [];

  for (let i = START_HOUR; i < END_HOUR + 1; i++) {
    const row = (i - START_HOUR) * 60 + 3;
    const gridRow = `${row} / ${row + 60}`;

    const date = new Date();
    date.setHours(i, 0, 0, 0);

    const time = timeFormatter.format(date);

    times.push(
      <span
        key={i}
        className="calendar-week-hour"
        style={{ gridRow }}
        aria-hidden
      >
        {time}
      </span>,
    );
  }

  return <>{times}</>;
}
