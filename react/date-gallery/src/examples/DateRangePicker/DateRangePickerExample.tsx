import React, { useState } from "react";

import { DateRangePicker } from "./DateRangePicker";

export function DateRangePickerExample() {
  const [startDate, setStartDate] = useState("01/01/2040 23:00");
  const [endDate, setEndDate] = useState("01/07/2040 23:00");
  const [vacationIsValid, setVacationIsValid] = useState(true);

  return (
    <>
      <div className="center">
        <div id="vacationForm">
          <span>Request vacation</span>

          <DateRangePicker
            timeEnabled
            startValue={startDate}
            onStartChanged={setStartDate}
            endValue={endDate}
            onEndChanged={setEndDate}
            validityChanged={setVacationIsValid}
            startLabel="From (mm/dd/yyyy)"
            endLabel="Till (mm/dd/yyyy)"
            startErrorLabel="From"
            endErrorLabel="Till"
            required
            min="yesterday"
          />

          {startDate && endDate && vacationIsValid ? (
            <p>
              Your vacation starts on: {startDate} and ends on {endDate}
            </p>
          ) : null}
        </div>
      </div>

      <div className="description">
        <p>
          The example above shows a date range picker component which is
          implemented as a custom element which ties two datepickers from the
          "Datepicker" example together.
        </p>
      </div>
    </>
  );
}
