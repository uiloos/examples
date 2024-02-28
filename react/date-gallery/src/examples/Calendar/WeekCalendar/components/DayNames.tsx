import React from "react";
import { DateGallery } from "@uiloos/core";
import { weekDayFormatter } from "../../../formatters";
import { EventData } from "../../events";

type Props = {
  dateGallery: DateGallery<EventData>;
};

export function DayNames({ dateGallery }: Props) {
  return (
    <>
      {dateGallery.firstFrame.dates.map((dateObj, index) => {
        return (
          <button
            key={dateObj.date.toISOString()}
            className="calendar-week-dayname"
            style={{ gridColumn: index + 2 }}
            onClick={(e) => {
              e.preventDefault();

              dateGallery.changeConfig({
                initialDate: dateObj.date,
                mode: "day",
                numberOfFrames: 1,
              });
            }}
          >
            <time dateTime={dateObj.date.toISOString()}>
              {weekDayFormatter.format(dateObj.date)}
            </time>
          </button>
        );
      })}
    </>
  );
}
