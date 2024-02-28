import { DateGallery } from "@uiloos/core";
import React from "react";
import { EventData } from "../events";
import { monthFormatter } from "../../formatters";
import classNames from "classnames";
import "./YearCalendar.css";

type Props = {
  dateGallery: DateGallery<EventData>;
};

export function YearCalendar({ dateGallery }: Props) {
  return (
    <ul className="calendar-year-months">
      {dateGallery.frames.map((frame) => (
        <li key={frame.anchorDate.toISOString()} className="calendar-year">
          <button
            className="calendar-year-monthname"
            onClick={() => {
              dateGallery.changeConfig({
                mode: "month-six-weeks",
                numberOfFrames: 1,
                initialDate: frame.anchorDate,
              });
            }}
          >
            {monthFormatter.format(frame.anchorDate)}
          </button>

          <ul className="calendar-year-daynames">
            <li className="calendar-year-dayname">
              <abbr title="Sunday">S</abbr>
            </li>
            <li className="calendar-year-dayname">
              <abbr title="Monday">M</abbr>
            </li>
            <li className="calendar-year-dayname">
              <abbr title="Tuesday">T</abbr>
            </li>
            <li className="calendar-year-dayname">
              <abbr title="Wednesday">W</abbr>
            </li>
            <li className="calendar-year-dayname">
              <abbr title="Thursday">T</abbr>
            </li>
            <li className="calendar-year-dayname">
              <abbr title="Friday">F</abbr>
            </li>
            <li className="calendar-year-dayname">
              <abbr title="Saturday">S</abbr>
            </li>
          </ul>

          <ul className="calendar-year-daycells">
            {frame.dates.map((dateObj) => {
              /*
                Place the days in the correct column, this is only needed
                for the "month" mode because it starts at the first of the 
                month, which may be on an other day than the start of 
                the week.

                The +1 is needed because CSS Grid starts counting at 1.
              */
              const gridColumn = dateObj.date.getDay() + 1;

              return (
                <li
                  key={dateObj.date.toISOString()}
                  className={classNames("calendar-year-daycell", {
                    "has-event": dateObj.hasEvents,
                  })}
                  style={{ gridColumn }}
                >
                  <button
                    className="calendar-year-daycell-number"
                    onClick={() =>
                      dateGallery.changeConfig({
                        initialDate: dateObj.date,
                        mode: "day",
                        numberOfFrames: 1,
                      })
                    }
                  >
                    <time dateTime={dateObj.date.toISOString()}>
                      {dateObj.date.getDate()}
                    </time>
                  </button>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}
