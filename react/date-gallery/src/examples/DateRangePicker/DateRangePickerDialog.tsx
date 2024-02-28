import { useDateGallery } from "@uiloos/react";
import React, { useRef, useEffect, MouseEvent, KeyboardEvent } from "react";
import { isValid } from "date-fns";
import classNames from "classnames";
import { DateGalleryDate } from "@uiloos/core";
import { dateFormatter, monthFormatter } from "../formatters";
import { parseAsDate } from "../Datepicker/utils";
import { MonthSelect } from "../Datepicker/MonthSelect";
import { YearInput } from "../Datepicker/YearInput";
import { Dialog } from "../Dialog/Dialog";

type Props = {
  startDate: string;
  endDate: string;
  onChange(startDate: string, endDate: string): void;
  onClose: () => void;
  min?: Date;
  max?: Date;
};

export function DateRangePickerDialog({
  startDate,
  endDate,
  onChange,
  onClose,
  min,
  max,
}: Props) {
  const dateGallery = useDateGallery({
    mode: "month",
    maxSelectionLimit: false,
    canSelect(dateObj) {
      if (min && dateObj.date < min) {
        return false;
      } else if (max && dateObj.date > max) {
        return false;
      }

      return true;
    },
  });

  // If there is already a selection reselect it.
  useEffect(() => {
    if (startDate && endDate) {
      const start = parseAsDate(startDate);
      const end = parseAsDate(endDate);

      if (isValid(start) && isValid(end)) {
        dateGallery.changeConfig({ initialDate: end as Date });
        dateGallery.selectRange(start as Date, end as Date);
      }
    }
  }, []);

  // Will store the date that was selected first by the user
  const firstSelectedDate = useRef<Date | null>(null);
  const rangeComplete = useRef(false);
  const keyboardDirection = useRef<"earlier" | "later">("later");

  function onDateClicked(
    event: MouseEvent<HTMLButtonElement>,
    dateObj: DateGalleryDate<unknown>,
  ) {
    // Do not do anthing on "Enter" but let the onKeyDown save and close
    if (event.detail === 0) {
      // detail is the amount of times the mouse was clicked,
      // which is zero for an "Enter" via keyboard.
      return;
    }

    // If the user has not selected any date yet
    if (firstSelectedDate.current === null) {
      // Store that date that was clicked
      firstSelectedDate.current = dateObj.date;

      // Treat it as the user wanting to start
      // a new selection on that date.
      dateGallery.deselectAll();

      // Also visually select this date so it becomes blue.
      dateGallery.selectDate(firstSelectedDate.current);

      // Reset so hover animation works again.
      rangeComplete.current = false;
    } else {
      /*
        If the user has already selected a date the
        second click should close the range.

        Note: selectRange does not care in which order
        it receives the parameters, it will find the
        earlier and later dates itself.
      */
      dateGallery.selectRange(firstSelectedDate.current, dateObj.date);

      // Now reset the firstSelectedDate so the next click
      // is treated as the user wanting to change the range
      //again.
      firstSelectedDate.current = null;

      // Mark the range as complete
      rangeComplete.current = true;
    }
  }

  function saveAndClose() {
    const [startDate, endDate] = getStartAndEndDateOfSelectedDatesRange();

    onChange(dateFormatter.format(startDate), dateFormatter.format(endDate));

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
      firstSelectedDate.current = null;

      // If there is no date selected select the first date
      // that can be selected from the first frame.
      if (dateGallery.selectedDates.length === 0) {
        const dateObj = dateGallery.firstFrame.dates.find(
          (dateObj) => dateObj.canBeSelected,
        );

        if (dateObj) {
          // Select the date so it highlights in blue.
          dateGallery.selectDate(dateObj.date);
        }

        return;
      }

      // Base the direction on when the first date of the
      // range is selected. This will also be true when
      // a range is reduced to 1 again.
      if (dateGallery.selectedDates.length === 1) {
        if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
          keyboardDirection.current = "earlier";
        } else {
          keyboardDirection.current = "later";
        }
      }

      const [rangeStart, rangeEnd] = getStartAndEndDateOfSelectedDatesRange();

      // We want to change the range in the direction
      // the arrow keys go but keep the other date as is.
      let moveDate: Date | null = null;
      let otherDate: Date | null = null;

      if (keyboardDirection.current === "earlier") {
        moveDate = rangeStart;
        otherDate = rangeEnd;
      } else {
        moveDate = rangeEnd;
        otherDate = rangeStart;
      }

      // Copy last moveDate so the original is
      // not mutated. This is undesirable when the
      // start date is the same as the endDate when
      // the number of moveDate is 1, as the code
      // below would then update them both!
      moveDate = new Date(moveDate);

      // Mutate the moveDate based on the arrow keys
      if (event.key === "ArrowLeft") {
        moveDate.setDate(moveDate.getDate() - 1);
      } else if (event.key === "ArrowRight") {
        moveDate.setDate(moveDate.getDate() + 1);
      } else if (event.key === "ArrowUp") {
        moveDate.setDate(moveDate.getDate() - 7);
      } else if (event.key === "ArrowDown") {
        moveDate.setDate(moveDate.getDate() + 7);
      }

      // Select the date so it highlights in blue.
      dateGallery.deselectAll();
      dateGallery.selectRange(moveDate, otherDate);

      // Change the initialDate (changes the frames) so the user
      // can navigate to other months when month changes
      if (
        moveDate.getMonth() !== dateGallery.firstFrame.anchorDate.getMonth()
      ) {
        dateGallery.changeConfig({ initialDate: moveDate });
      }
    } else if (event.key === "Enter") {
      // When enter is pressed close the dialog and set
      // the value to the selected date.
      saveAndClose();
    }
  }

  function getStartAndEndDateOfSelectedDatesRange() {
    // Sort from past to future.
    const sorted = [...dateGallery.selectedDates].sort(
      (a, b) => a.getTime() - b.getTime(),
    );

    // The first date is the start date.
    const start = sorted[0] ?? new Date();

    // The last date is the end date
    const end = sorted[sorted.length - 1] ?? new Date();

    return [start, end];
  }

  const [rangeStart, rangeEnd] = getStartAndEndDateOfSelectedDatesRange();

  return (
    <Dialog onKeyDown={onKeyDown} onClose={onClose}>
      <div className="daterangepicker-dialog-content">
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
                  "start-of-range": dateGallery.isSameDay(
                    rangeStart,
                    dateObj.date,
                  ),
                  "end-of-range": dateGallery.isSameDay(rangeEnd, dateObj.date),
                })}
                disabled={!dateObj.canBeSelected}
                onClick={(event) => onDateClicked(event, dateObj)}
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
          <button type="button" onClick={() => saveAndClose()}>
            Save
          </button>
        </div>
      </div>
    </Dialog>
  );
}
