import React, { useState, useEffect } from "react";
import "./Datepicker.css";
import { DatepickerDialog } from "./DatepickerDialog";
import { dateFormatter, timeFormatter } from "../formatters";
import { isValid } from "date-fns";
import { parseAsDate } from "./utils";

type Props = {
  value: string;
  onChange(value: string): void;
  onValidityChanged(valid: boolean): void;
  required?: boolean;
  min?: string;
  max?: string;
  label: string;
  timeEnabled?: boolean;
  onOpenDialog?: () => void;

  linkedPicker?: {
    value: string;
    label: string;
    myPosition: "start" | "end";
  };
};

/*
  The Datepicker here is an example of how to create a form input 
  element in React without using a form library, in real life I 
  would recommend using a form library such as: react-hook-form,
  formik or final-form.
*/
export function Datepicker({
  timeEnabled = false,
  value,
  onChange,
  onValidityChanged,
  required = false,
  label,
  min,
  max,
  onOpenDialog,
  linkedPicker,
}: Props) {
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [timeValue, setTimeValue] = useState("");

  const minDate = parseAsDate(min);
  const maxDate = parseAsDate(max);

  useEffect(() => {
    // Parse the date entered
    const date = parseAsDate(value);

    if (date && isValid(date)) {
      const inputValue = dateFormatter.format(date);
      const timeValue = timeFormatter.format(date);

      setInputValue(inputValue);
      setTimeValue(timeValue);

      onChange(`${inputValue} ${timeValue}`);
    }

    // If it is required but empty report an error
    if (required && value === "") {
      setError(`${label} is required`);
      onValidityChanged(false);
      return;
    }

    // If it is not required and the value is empty mark as valid
    if (!required && value === "") {
      setError("");
      onValidityChanged(true);

      return;
    }

    // Check if it is indeed valid
    if (!isValid(date)) {
      const format = timeEnabled ? "mm/dd/yyyy hh:mm" : "mm/dd/yyyy";

      setError(`${label} is not a valid date in the ${format} format`);
      onValidityChanged(false);

      return;
    }

    if (date) {
      if (minDate && date < minDate) {
        setError(`${label} must be after ${dateFormatter.format(minDate)}`);
        onValidityChanged(false);

        return;
      }

      if (maxDate && date > maxDate) {
        setError(`${label} must be before ${dateFormatter.format(maxDate)}`);
        onValidityChanged(false);

        return;
      }

      if (linkedPicker) {
        const linkedPickerDate = parseAsDate(linkedPicker.value);

        if (linkedPickerDate) {
          // If we are in a range picker relation and we are the start we must not be after the end.
          if (linkedPicker.myPosition === "start" && date > linkedPickerDate) {
            setError(`${label} lies after ${linkedPicker.label}`);

            onValidityChanged(false);
            return;
          }

          // If we are in a range picker relation and we are the end we must not be before the start.
          if (linkedPicker.myPosition === "end" && date < linkedPickerDate) {
            setError(`${label} lies before ${linkedPicker.label}`);
            onValidityChanged(false);

            return;
          }
        }
      }
    }

    setError("");
    onValidityChanged(true);
  }, [value, linkedPicker?.value]);

  function dateChanged(date: string) {
    if (date === "") {
      onChange("");
      return;
    }

    // This allows the user to enter "today" / "tomorrow" and "yesterday"
    // and get it transformed back to a date.
    if (["today", "tomorrow", "yesterday"].includes(date)) {
      date = dateFormatter.format(parseAsDate(date) as Date);
    }

    if (timeEnabled) {
      let _timeValue = timeValue;

      if (!_timeValue) {
        _timeValue = "00:00";
      }

      setTimeValue(_timeValue);

      onChange(`${date} ${_timeValue}`);
    } else {
      onChange(date + " 00:00");
    }
  }

  function timeChanged(time: string) {
    setTimeValue(time);

    onChange(`${inputValue} ${time}`);
  }

  function onCalendarButtonClicked() {
    // If there is a callback call it, otherwise
    // open our dialog
    if (onOpenDialog) {
      onOpenDialog();
    } else {
      setShowDialog(!showDialog);
    }
  }

  return (
    <div className="datepicker">
      <div className="datepicker-input-wrapper">
        <input
          type="text"
          className="date"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={(e) => dateChanged(e.target.value)}
          placeholder="06/31/2000"
        />
        {timeEnabled ? (
          <input
            type="text"
            className="time"
            placeholder="12:30"
            value={timeValue}
            onChange={(e) => setTimeValue(e.target.value)}
            onBlur={(e) => timeChanged(e.target.value)}
          />
        ) : null}
        <button
          aria-label="Open calendar"
          className="calendar-button"
          type="button"
          onClick={onCalendarButtonClicked}
        >
          📅
        </button>
      </div>
      {error ? <span className="error">{error}</span> : null}
      {showDialog ? (
        <DatepickerDialog
          value={value}
          onChange={dateChanged}
          onClose={() => setShowDialog(false)}
          min={minDate ?? undefined}
          max={maxDate ?? undefined}
        />
      ) : null}
    </div>
  );
}
