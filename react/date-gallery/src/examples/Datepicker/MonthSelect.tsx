import React, { ChangeEvent } from "react";
import { DateGallery } from "@uiloos/core";
import { monthFormatter } from "../formatters";

type Props = {
  dateGallery: DateGallery<unknown>;
};

export function MonthSelect({ dateGallery }: Props) {
  function onMonthChanged(e: ChangeEvent<HTMLSelectElement>) {
    const month = parseInt(e.target.value, 10);

    const date = new Date(dateGallery.firstFrame.anchorDate);
    date.setMonth(month);

    dateGallery.changeConfig({ initialDate: date });
  }

  return (
    <select
      className="month"
      value={dateGallery.firstFrame.anchorDate.getMonth()}
      onChange={onMonthChanged}
    >
      {[...Array(12).keys()].map((month) => {
        const label = monthFormatter.format(new Date(2000, month, 1));

        return (
          <option key={label} value={month}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
