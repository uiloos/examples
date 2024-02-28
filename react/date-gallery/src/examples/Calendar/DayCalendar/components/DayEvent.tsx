import React, { useRef, DragEvent } from "react";
import { DateGallery, DateGalleryEvent } from "@uiloos/core";
import { EventData, ariaLabelForEvent } from "../../events";
import { yiq, getMinutesSinceStart, emptyImage } from "../../utils";
import { timeFormatter } from "../../../formatters";
import { START_HOUR, WIDTH } from "../config";

type Props = {
  dateGallery: DateGallery<EventData>;
  event: DateGalleryEvent<EventData>;
  gridRow: string;
  onClick(): void;
};

export function DayEvent({ dateGallery, event, onClick, gridRow }: Props) {
  const eventRef = useRef<HTMLLIElement | null>(null);
  const startDragRef = useRef<HTMLSpanElement | null>(null);
  const endDragRef = useRef<HTMLSpanElement | null>(null);

  let startDraggable = true;
  let endDraggable = true;

  let dragData = useRef({
    xAtDragStart: 0,
    dragStartTime: 0,
    dragEndTime: 0,
  });

  // When the drag starts store information about which event is dragged
  function onDragStart(e: DragEvent<HTMLElement>) {
    e.stopPropagation();

    // Store what the mouse position was at the start of the drag.
    // Used to calulate how many minutes the user wants the event
    // to move.
    dragData.current.xAtDragStart = e.clientX;

    // Set store the original start and end time for when
    // the dragging began. This way we always know the
    // original times even after we "move" the event.
    dragData.current.dragStartTime = new Date(event.startDate).getTime();
    dragData.current.dragEndTime = new Date(event.endDate).getTime();

    // Set the drag image to an empty image. Because we are
    // going to continuously "move" the event we do not need
    // a "ghost".
    e.dataTransfer.setDragImage(emptyImage, 0, 0);
  }

  // When the the event is dragged alter the time period of the vent.
  function onDrag(e: DragEvent<HTMLElement>) {
    e.stopPropagation();

    // Sometimes the clientX is suddenly zero on drag end,
    // do nothing if this is the case. Otherwise the event
    // will suddenly jump to the previous day
    if (e.clientX === 0) {
      return;
    }

    // The number of minutes moved is the amount of pixels away
    // the cursor (clientX) is from the clientX at the start of
    // the drag start.
    const minutesMoved = e.clientX - dragData.current.xAtDragStart;

    // Move by an increment of 5 minutes, to create a snap effect
    if (minutesMoved % 5 === 0) {
      // Date constructor wants milliseconds since 1970
      const msMoved = minutesMoved * 60 * 1000;

      // Note: moving the event will cause the entire DOM to be ripped
      // to shreds and be rebuilt. So the 5 minute snap effect is
      // also a performance boost.

      if (e.target === eventRef.current) {
        // Move both start and end times with the same values
        // so the duration of the event stays the same.
        event.move({
          startDate: new Date(dragData.current.dragStartTime + msMoved),
          endDate: new Date(dragData.current.dragEndTime + msMoved),
        });
      } else if (e.target === startDragRef.current) {
        // Move only the start time
        event.move({
          startDate: new Date(dragData.current.dragStartTime + msMoved),
          endDate: event.endDate,
        });
      } else {
        // Move only the end time
        event.move({
          startDate: event.startDate,
          endDate: new Date(dragData.current.dragEndTime + msMoved),
        });
      }
    }
  }

  let gridColumn = "";
  let showStartTime = false;
  let showEndTime = false;

  const dayDate = dateGallery.firstFrame.anchorDate;

  if (event.spansMultipleDays) {
    if (dateGallery.isSameDay(event.startDate, dayDate)) {
      // When the event starts on this day, make it span the
      // entire day, as we know it does not end on this day.
      const start = getMinutesSinceStart(event.startDate, START_HOUR);
      gridColumn = `${start + 1} / ${WIDTH}`;

      // No end time indicator as it is on another day
      endDraggable = false;

      // Show start time only on first day
      showStartTime = true;
    } else if (dateGallery.isSameDay(event.endDate, dayDate)) {
      // When the event ends on this day start it at midnight, since
      // we know it started on a previous day.
      const end = getMinutesSinceStart(event.endDate, START_HOUR);
      gridColumn = `1 / ${end + 2}`;

      // No start time drag indicator as it is on another day
      startDraggable = false;

      // Show end time only on last day
      showEndTime = true;
    } else {
      // When the event is during this whole day
      gridColumn = `1 / ${WIDTH}`;

      // No start / end drag indicator as it is on another day
      startDraggable = false;
      endDraggable = false;
    }
  } else {
    // The event is contained within this day.

    const start = getMinutesSinceStart(event.startDate, START_HOUR);
    const end = getMinutesSinceStart(event.endDate, START_HOUR);

    gridColumn = `${start + 1} / ${end + 1}`;

    // When fully in this day show both times
    showStartTime = true;
    showEndTime = true;
  }

  return (
    <li
      ref={eventRef}
      draggable={event.spansMultipleDays === false}
      onDragStart={onDragStart}
      onDrag={onDrag}
      className="calendar-day-event"
      style={{
        backgroundColor: event.data.color,
        gridRow,
        gridColumn,
      }}
    >
      <button
        aria-label={ariaLabelForEvent(event)}
        style={{
          backgroundColor: event.data.color,
          color: yiq(event.data.color),
        }}
        onClick={onClick}
      >
        <span
          ref={startDragRef}
          className="drag-indicator"
          draggable={startDraggable}
          onDragStart={onDragStart}
          onDrag={onDrag}
        ></span>
        <span className="text-container">
          {showStartTime ? (
            <b>{timeFormatter.format(event.startDate)}</b>
          ) : null}

          <i title={event.data.title}>{event.data.title}</i>

          {showEndTime ? (
            <b className="end-time">{timeFormatter.format(event.endDate)}</b>
          ) : null}
        </span>
        <span
          ref={endDragRef}
          className="drag-indicator"
          draggable={endDraggable}
          onDragStart={onDragStart}
          onDrag={onDrag}
        ></span>
      </button>
    </li>
  );
}
