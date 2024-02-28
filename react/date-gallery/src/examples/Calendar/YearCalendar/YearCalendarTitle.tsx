import { DateGallery } from "@uiloos/core";
import { yearFormatter } from "../../formatters";
import { EventData } from "../events";

type Props = {
  dateGallery: DateGallery<EventData>;
};

export function YearCalendarTitle({ dateGallery }: Props) {
  return yearFormatter.format(dateGallery.firstFrame.anchorDate);
}
