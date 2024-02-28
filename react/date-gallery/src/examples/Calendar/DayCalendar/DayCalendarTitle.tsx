import { DateGallery } from "@uiloos/core";
import { dateFormatter } from "../../formatters";
import { EventData } from "../events";

type Props = {
  dateGallery: DateGallery<EventData>;
};

export function DayCalendarTitle({ dateGallery }: Props) {
  return dateFormatter.format(dateGallery.firstFrame.anchorDate);
}
