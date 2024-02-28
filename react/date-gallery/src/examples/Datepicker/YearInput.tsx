import React, { useState, useEffect } from "react";
import { DateGallery } from "@uiloos/core";

type Props = {
  dateGallery: DateGallery<unknown>;
};

export function YearInput({ dateGallery }: Props) {
  function onYearInputChanged(value: string) {
    let year = parseInt(value, 10);

    if (isNaN(year)) {
      year = new Date().getFullYear();
      setYear(year.toString());
    }

    const date = new Date(
      year,
      dateGallery.firstFrame.anchorDate.getMonth(),
      dateGallery.firstFrame.anchorDate.getDate(),
    );

    dateGallery.changeConfig({ initialDate: date });
  }

  const [year, setYear] = useState(
    dateGallery.firstFrame.anchorDate.getFullYear().toString(),
  );

  useEffect(() => {
    setYear(dateGallery.firstFrame.anchorDate.getFullYear().toString());
  }, [dateGallery.firstFrame.anchorDate]);

  return (
    <input
      className="year"
      value={year}
      onChange={(e) => setYear(e.target.value)}
      onKeyUp={(e) => {
        if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
          onYearInputChanged(e.target.value);
        }
      }}
      onBlur={(e) => onYearInputChanged(e.target.value)}
    />
  );
}
