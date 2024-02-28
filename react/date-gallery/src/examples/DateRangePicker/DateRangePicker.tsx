import React, { useState, useRef } from "react";
import { Datepicker } from "../Datepicker/Datepicker";
import "./DateRangePicker.css";
import { DateRangePickerDialog } from "./DateRangePickerDialog";
import { parseAsDate } from "../Datepicker/utils";
import { timeFormatter } from "../formatters";
import { isValid } from "date-fns";

type Props = {
  startValue: string;
  onStartChanged(value: string): void;
  startLabel?: string;
  startErrorLabel?: string;

  endValue: string;
  onEndChanged(value: string): void;
  endLabel?: string;
  endErrorLabel?: string;

  required?: boolean;
  min?: string;
  max?: string;

  timeEnabled?: boolean;

  validityChanged(valid: boolean): void;
};

/*
  DateRangePicker is a custom element that combines two Datepicker elements
  together, adds a single picker for both of them, and adds a validation check
  that the start date must lie on or before the end date.
*/
export function DateRangePicker({
  startValue,
  onStartChanged,
  startLabel = "Start",
  startErrorLabel = "Start",

  onEndChanged,
  endValue,
  endLabel = "End",
  endErrorLabel = "End",

  required,
  min,
  max,

  timeEnabled,
  validityChanged,
}: Props) {
  const [showDialog, setShowDialog] = useState(false);

  const startDateIsValid = useRef(true);
  const endDateIsValid = useRef(true);

  function onStartValidityChanged(valid: boolean) {
    startDateIsValid.current = valid;

    validityChanged(startDateIsValid.current && endDateIsValid.current);
  }

  function onEndValidityChanged(valid: boolean) {
    endDateIsValid.current = valid;

    validityChanged(startDateIsValid.current && endDateIsValid.current);
  }

  function rangeChanged(start: string, end: string) {
    if (timeEnabled) {
      const startTime = getTimeOfDate(startValue);
      const endTime = getTimeOfDate(endValue);

      onStartChanged(`${start} ${startTime}`);
      onEndChanged(`${end} ${endTime}`);
    } else {
      onStartChanged(start);
      onEndChanged(end);
    }
  }

  const minDate = parseAsDate(min);
  const maxDate = parseAsDate(max);

  return (
    <div className="daterangepicker">
      <label>
        {startLabel}:
        <Datepicker
          value={startValue}
          timeEnabled={timeEnabled}
          label={startErrorLabel}
          onChange={onStartChanged}
          min={min}
          max={max}
          required={required}
          onValidityChanged={onStartValidityChanged}
          onOpenDialog={() => setShowDialog(true)}
          linkedPicker={{
            label: endErrorLabel,
            value: endValue,
            myPosition: "start",
          }}
        />
      </label>

      <label>
        {endLabel}:
        <Datepicker
          value={endValue}
          timeEnabled={timeEnabled}
          label={endErrorLabel}
          onChange={onEndChanged}
          min={min}
          max={max}
          required={required}
          onValidityChanged={onEndValidityChanged}
          onOpenDialog={() => setShowDialog(true)}
          linkedPicker={{
            label: startErrorLabel,
            value: startValue,
            myPosition: "end",
          }}
        />
      </label>

      {showDialog ? (
        <DateRangePickerDialog
          startDate={startValue}
          endDate={endValue}
          onChange={rangeChanged}
          onClose={() => setShowDialog(false)}
          min={minDate ?? undefined}
          max={maxDate ?? undefined}
        />
      ) : null}
    </div>
  );
}

function getTimeOfDate(date: string) {
  let time = parseAsDate(date);

  if (isValid(time)) {
    return timeFormatter.format(time as Date);
  } else {
    return "00:00";
  }
}
