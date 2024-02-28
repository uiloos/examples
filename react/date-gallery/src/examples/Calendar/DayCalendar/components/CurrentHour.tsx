import { DateGallery } from "@uiloos/core";
import React, { useRef, useEffect } from "react";
import { timeFormatter } from "../../../formatters";
import { EventData } from "../../events";
import { getMinutesSinceStart } from "../../utils";
import { START_HOUR } from "../config";

type Props = {
  dateGallery: DateGallery<EventData>;
  rows: number;
};

export function CurrentHour({ dateGallery, rows }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function update() {
      if (!ref.current) {
        return;
      }

      const now = new Date();
      const column = getMinutesSinceStart(now, START_HOUR);
      ref.current.style.gridColumn = `${column + 1} / ${column + 2}`;

      ref.current.setAttribute("time", timeFormatter.format(now));
    }

    const interval = setInterval(() => {
      update();
    }, 1000);

    update();

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Add a red line showing the current time, but only
  // when showing today
  if (!dateGallery.firstFrame.dates[0].isToday) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="calendar-day-current-time"
      style={{
        gridRow: `1 / ${rows}`,
      }}
    ></div>
  );
}
