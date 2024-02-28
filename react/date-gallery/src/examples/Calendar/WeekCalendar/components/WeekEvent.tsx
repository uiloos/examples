import React, { useRef, DragEvent, useEffect } from "react";
import { DateGallery, DateGalleryEvent } from "@uiloos/core";
import { ariaLabelForEvent, EventData } from "../../events";
import { yiq, getMinutesSinceStart, emptyImage } from "../../utils";
import { timeFormatter } from "../../../formatters";
import { HEIGHT, START_HOUR } from "../config";

type Props = {
  date: Date;
  dateGallery: DateGallery<EventData>;
  event: DateGalleryEvent<EventData>;
  gridColumn: string;
  onClick(): void;
};

export function WeekEvent({
  event,
  gridColumn,
  dateGallery,
  date,
  onClick,
}: Props) {
  const eventRef = useRef<HTMLLIElement | null>(null);
  const startDragRef = useRef<HTMLSpanElement | null>(null);
  const endDragRef = useRef<HTMLSpanElement | null>(null);

  let startDraggable = true;
  let endDraggable = true;

  let dragData = useRef({
    yAtDragStart: 0,
    dragStartTime: 0,
    dragEndTime: 0,
    mode: "",
  });

  /*
    Warning dirty hack: 

    In the `WeekCalendar` we render a `DayGrid` which contains the `WeekEvent`
    components, whenever a `WeekEvent` component is dragged over a `DayGrid`
    it is moved to that day, the code to actually move is here in 
    `WeekEvent`'s `onDrag` in the `hoveredDayEl` logic.

    This causes React to re-render and since the `WeekEvent` is no longer 
    the child of his old `DayGrid` it is removed from the DOM and re-created.

    But this causes a problem for us: if we used Reacts `onDrag`, the 
    dragging stops. When an element is removed React no longer sends 
    dragging events. This makes sense since the element from Reacts 
    point of view does not exist any longer. This is not what we want, 
    we want to keep dragging the element!

    Luckily for us the `ondrag` from JS does not care if an element is 
    no longer in the DOM.
    
    So we manually keep it in memory by setting an `ondrag` on the element 
    behind React's back, and cleaning it up manually. This way the 
    element will stay in memory, due to us keeping a reference to it.
  */
  useEffect(() => {
    if (eventRef.current) {
      eventRef.current.ondrag = (e) => {
        // @ts-expect-error allow me to pass in a native drag
        onDrag(e);
      };

      return () => {
        if (eventRef.current) {
          eventRef.current.ondrag = null;
        }
      };
    }
  }, []);

  // When the drag starts store information about which event is dragged
  function onDragStart(e: DragEvent<HTMLElement>) {
    e.stopPropagation();

    // Store what the mouse position was at the start of the drag.
    // Used to calulate how many minutes the user wants the event
    // to move.
    dragData.current.yAtDragStart = e.clientY;

    // Set store the original start and end time for when
    // the dragging began. This way we always know the
    // original times even after we "move" the event.
    dragData.current.dragStartTime = new Date(event.startDate).getTime();
    dragData.current.dragEndTime = new Date(event.endDate).getTime();

    if (e.target === eventRef.current) {
      dragData.current.mode = "event";
    } else if (e.target === startDragRef.current) {
      dragData.current.mode = "start";
    } else {
      dragData.current.mode = "end";
    }

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
    // the cursor (clientY) is from the clientY at the start of
    // the drag start.
    const minutesMoved = e.clientY - dragData.current.yAtDragStart;

    // Find the dayEl element the cursor is currently hovering
    // over, if it has found one the date of the event must
    // be changed.
    const hoveredDayEl = document
      .elementsFromPoint(e.clientX, e.clientY)
      .find((element) => {
        return element.classList.contains("calendar-week-day-grid");
      });

    // The user might mouse out of the calendar, in that case default
    // to the current startDate
    let movedToDate = event.startDate;
    if (hoveredDayEl && hoveredDayEl instanceof HTMLElement) {
      const date = hoveredDayEl.dataset.date ?? "0";

      movedToDate = new Date(parseInt(date, 10));
    }

    // Move by an increment of 5 minutes, to create a snap effect
    if (
      minutesMoved % 5 === 0 ||
      !dateGallery.isSameDay(movedToDate, event.startDate)
    ) {
      // Date constructor wants milliseconds since 1970
      const msMoved = minutesMoved * 60 * 1000;

      // Note: moving the event will cause the entire DOM to be ripped
      // to shreds and be rebuilt. So the 5 minute snap effect is
      // also a performance boost.

      if (dragData.current.mode === "event") {
        const duration =
          dragData.current.dragEndTime - dragData.current.dragStartTime;

        // First update to the new start time
        const startDate = new Date(dragData.current.dragStartTime + msMoved);

        /* 
          Second update the start date.
          
          We do this via a call to `setFullYear` with all date parts. 
          Setting them in separate calls like this:
          
          startDate.setFullYear(movedToDate.getFullYear());
          startDate.setMonth(movedToDate.getMonth());
          startDate.setDate(movedToDate.getDate());

          Could cause a very nasty bug were it could set the date to a non 
          existing date. But only for very few dates were the size of the 
          month differs from the month the date is moved into.
          
          The bug can be triggered like so:

          const d = new Date(2024, 30, 1); // 1/30/2024 - Feb 30th 2024
          d.setFullYear(2025) // Date is now 1/30/2025
          d.setMonth(2); // Date tries to be 2/30/2025, which doesn't exist, and rolls over to 3/1/2025
          d.setDate(15); // Date is now 3/15/2025 instead of 2/15/2025 as expected

          The above I credit to Marc Hughes see: https://github.com/Simon-Initiative/oli-torus/pull/4614
        */
        startDate.setFullYear(
          movedToDate.getFullYear(),
          movedToDate.getMonth(),
          movedToDate.getDate(),
        );

        // Move both start and end times with the same values
        // so the duration of the event stays the same.
        event.move({
          startDate: startDate,
          endDate: new Date(startDate.getTime() + duration),
        });
      } else if (dragData.current.mode === "start") {
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

  let gridRow = "";
  let showStartTime = false;
  let showEndTime = false;

  /*
    An event that spans multiple days is rendered once in each 
    day the event occurs. 
    
    On dates that match the startDate and endDate we make draggable.
  */
  if (event.spansMultipleDays) {
    if (dateGallery.isSameDay(event.startDate, date)) {
      // When the event starts on this day, make it span the
      // entire day, as we know it does not end on this day.
      const start = getMinutesSinceStart(event.startDate, START_HOUR);
      gridRow = `${start + 1} / ${HEIGHT}`;

      // No end time indicator as it is on another day
      endDraggable = false;

      // Show start time only on first day
      showStartTime = true;
    } else if (dateGallery.isSameDay(event.endDate, date)) {
      // When the event ends on this day start it at midnight, since
      // we know it started on a previous day.
      const end = getMinutesSinceStart(event.endDate, START_HOUR);

      gridRow = `1 / ${end + 2}`;

      // No start time drag indicator as it is on another day
      startDraggable = false;

      // Show end time only on last day
      showEndTime = true;
    } else {
      // When the event is during this whole day take up all space
      gridRow = `1 / ${HEIGHT}`;

      // No start / end drag indicator as it is on another day
      startDraggable = false;
      endDraggable = false;
    }
  } else {
    // The event is contained within this day.

    const start = getMinutesSinceStart(event.startDate, START_HOUR);
    const end = getMinutesSinceStart(event.endDate, START_HOUR);

    gridRow = `${start + 1} / ${end + 1}`;

    // When fully in this day show both times
    showStartTime = true;
    showEndTime = true;
  }

  return (
    <li
      ref={eventRef}
      className="calendar-week-event"
      style={{ backgroundColor: event.data.color, gridColumn, gridRow }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      draggable={event.spansMultipleDays === false}
      onDragStart={onDragStart}
    >
      <button
        style={{
          backgroundColor: event.data.color,
          color: yiq(event.data.color),
        }}
        aria-label={ariaLabelForEvent(event)}
      >
        <span
          ref={startDragRef}
          className="drag-indicator"
          draggable={startDraggable}
          onDragStart={onDragStart}
          onDrag={onDrag}
        ></span>
        <span className="text-container">
          <span className="inner-text-container">
            {showStartTime ? (
              <b>{timeFormatter.format(event.startDate)}</b>
            ) : null}
            <i title={event.data.title}>{event.data.title}</i>
            <p>{event.data.description}</p>
          </span>
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
