import { DateGallery } from "@uiloos/core";
import { monthAndYearFormatter } from "../../formatters";
import { EventData } from "../events";

type Props = {
  dateGallery: DateGallery<EventData>;
};

export function WeekCalendarTitle({ dateGallery }: Props) {
  return monthAndYearFormatter.format(dateGallery.firstFrame.anchorDate);
}
