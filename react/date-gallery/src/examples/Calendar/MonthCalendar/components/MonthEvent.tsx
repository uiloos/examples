import React, { useRef, DragEvent, useEffect } from "react";
import { DateGallery, DateGalleryEvent, DateGalleryDate } from "@uiloos/core";
import { EventData, ariaLabelForEvent } from "../../events";
import { yiq, emptyImage } from "../../utils";
import { timeFormatter } from "../../../formatters";
import classNames from "classnames";

type Props = {
  dateGallery: DateGallery<EventData>;
  event: DateGalleryEvent<EventData>;
  dateObj: DateGalleryDate<EventData>;
  gridRow: number;
  onClick(): void;
  onDrag(event: DateGalleryEvent<EventData>): void;
};

export function MonthEvent({
  dateGallery,
  event,
  onClick,
  gridRow,
  dateObj,
  onDrag,
}: Props) {
  const eventRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (eventRef.current) {
      eventRef.current.style.setProperty("--color", event.data.color);
    }
  }, [event.data.color]);

  let title = "";
  let time = "";

  if (event.spansMultipleDays) {
    /*
      An event that spans multiple days is rendered once in each 
      day the event occurs. 
        
      On the startDate we render the title and start time, on the 
      endDate we render the end time. For all days in between we 
      only give it a background color.
    */
    if (dateGallery.isSameDay(event.startDate, dateObj.date)) {
      title = event.data.title;
      time = timeFormatter.format(event.startDate);
    } else if (dateGallery.isSameDay(event.endDate, dateObj.date)) {
      time = timeFormatter.format(event.endDate);
    }
  } else {
    // When an event happens on a single day show the title and start time.
    title = event.data.title;
    time = timeFormatter.format(event.startDate);
  }

  function onDragStart(e: DragEvent<HTMLLIElement>) {
    e.stopPropagation();

    onDrag(event);

    // Set the drag image to an empty image. Because we are
    // going to continuously "move" the event we do not need
    // a "ghost".
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
  }

  return (
    <li
      ref={eventRef}
      className={classNames("calendar-month-event", {
        multiple: event.spansMultipleDays,
        "first-day-of-event":
          event.spansMultipleDays &&
          dateGallery.isSameDay(event.startDate, dateObj.date),
      })}
      style={{
        gridRow,
        backgroundColor: event.spansMultipleDays ? event.data.color : undefined,
      }}
      draggable
      onDragStart={onDragStart}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <button
        className="calendar-month-event-wrapper"
        style={{
          color: event.spansMultipleDays ? yiq(event.data.color) : undefined,
        }}
        aria-label={ariaLabelForEvent(event)}
      >
        <span className="calendar-month-event-title">{title}</span>
        <span className="calendar-month-event-time">{time}</span>
      </button>
    </li>
  );
}
