import { useDateGallery } from "@uiloos/react";
import React, { KeyboardEvent } from "react";
import { isValid } from "date-fns";
import classNames from "classnames";
import { DateGalleryDate } from "@uiloos/core";
import { dateFormatter } from "../formatters";
import { MonthSelect } from "./MonthSelect";
import { YearInput } from "./YearInput";
import { Dialog } from "../Dialog/Dialog";
import { parseAsDate } from "./utils";

type Props = {
  value: string;
  onChange(value: string): void;
  onClose: () => void;
  min?: Date;
  max?: Date;
};

export function DatepickerDialog({
  value,
  onChange,
  onClose,
  min,
  max,
}: Props) {
  let initialDate = new Date();
  if (value) {
    const date = parseAsDate(value);

    if (isValid(date)) {
      initialDate = date as Date;
    }
  }

  const dateGallery = useDateGallery({
    mode: "month",
    initialDate,
    selectedDates: [initialDate],
    maxSelectionLimit: 1,
    canSelect(dateObj) {
      if (min && dateObj.date < min) {
        return false;
      } else if (max && dateObj.date > max) {
        return false;
      }

      return true;
    },
  });

  function onDateClicked(dateObj: DateGalleryDate<unknown>) {
    const date = dateFormatter.format(dateObj.date);
    onChange(date);
    onClose();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    // Do not interfere with the year <input>
    if (
      event.target &&
      event.target instanceof HTMLElement &&
      event.target.nodeName === "INPUT"
    ) {
      return;
    }

    // Stop the propagation here so not all elements
    // are called for better performance.
    event.stopPropagation();

    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)
    ) {
      // Copy date as not to mutate the selected date.
      const date = new Date(dateGallery.selectedDates[0]);

      // Mutate the date based on the arrow keys
      if (event.key === "ArrowLeft") {
        date.setDate(date.getDate() - 1);
      } else if (event.key === "ArrowRight") {
        date.setDate(date.getDate() + 1);
      } else if (event.key === "ArrowUp") {
        date.setDate(date.getDate() - 7);
      } else if (event.key === "ArrowDown") {
        date.setDate(date.getDate() + 7);
      }

      // Select the date so it highlights in blue.
      dateGallery.selectDate(date);

      // Change the initialDate (changes the frames) so the user
      // can navigate to other months.
      dateGallery.changeConfig({ initialDate: date });
    } else if (event.key === "Enter") {
      // When enter is pressed close the dialog and set
      // the value to the selected date.

      // We do not want the dialog to open again.
      event.preventDefault();

      const date = dateFormatter.format(dateGallery.selectedDates[0]);

      onChange(date);
      onClose();
    }
  }

  return (
    <Dialog onKeyDown={onKeyDown} onClose={onClose}>
      <div className="datepicker-dialog-content">
        <div className="topbar">
          <button
            aria-label="previous"
            type="button"
            onClick={() => dateGallery.previous()}
          >
            ‹
          </button>
          <span>
            <MonthSelect dateGallery={dateGallery} />
            <YearInput dateGallery={dateGallery} />
          </span>
          <button
            aria-label="next"
            type="button"
            onClick={() => dateGallery.next()}
          >
            ›
          </button>
        </div>

        <ul className="daygrid">
          <li>
            <abbr title="Sunday">S</abbr>
          </li>
          <li>
            <abbr title="Monday">M</abbr>
          </li>
          <li>
            <abbr title="Tuesday">T</abbr>
          </li>
          <li>
            <abbr title="Wednesday">W</abbr>
          </li>
          <li>
            <abbr title="Thursday">T</abbr>
          </li>
          <li>
            <abbr title="Friday">F</abbr>
          </li>
          <li>
            <abbr title="Saturday">S</abbr>
          </li>
        </ul>

        <ul className="dates daygrid">
          {dateGallery.firstFrame.dates.map((dateObj) => (
            <li
              key={dateObj.date.toISOString()}
              style={{ gridColumn: dateObj.date.getDay() + 1 }}
            >
              <button
                aria-label={`Select ${dateFormatter.format(dateObj.date)}`}
                type="button"
                className={classNames({
                  selected: dateObj.isSelected,
                  today: dateObj.isToday,
                })}
                disabled={!dateObj.canBeSelected}
                onClick={() => onDateClicked(dateObj)}
              >
                <time dateTime={dateObj.date.toISOString()}>
                  {dateObj.date.getDate()}
                </time>
              </button>
            </li>
          ))}
        </ul>

        <div className="bottombar">
          <button type="button" onClick={() => onClose()}>
            Cancel
          </button>
          <button type="button" onClick={() => dateGallery.today()}>
            Today
          </button>
        </div>
      </div>
    </Dialog>
  );
}
