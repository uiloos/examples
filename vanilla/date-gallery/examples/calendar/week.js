import { clone, yiq, getMinutesSinceStart, emptyImage } from "./utils.js";
import {
  timeFormatter,
  monthAndYearFormatter,
  weekDayFormatter,
} from "../formatters.js";
import { ariaLabelForEvent, packEventsOnAxis } from "./events.js";

const START_HOUR = 0;
const END_HOUR = 24;

// You can change the number of hours shown here,
// by default all hours are shown.
const HEIGHT = (END_HOUR - START_HOUR) * 60;

// Will contain information when event is dragged.
const dragData = {
  yAtDragStart: 0,
  dragStartTime: 0,
  dragEndTime: 0,
};

export function renderWeekCalendar(calendar, dateGallery) {
  const calendarWeekTemplate = calendar.querySelector(
    "#calendar-week-template",
  );

  const eventTemplate = calendar.querySelector("#calendar-week-event-template");

  calendar.calendarTitleEl.textContent = monthAndYearFormatter.format(
    dateGallery.firstFrame.anchorDate,
  );

  const weekEl = clone(calendarWeekTemplate);

  const gridEl = weekEl.querySelector(".calendar-week-grid");
  gridEl.style.setProperty("--height", HEIGHT);

  renderLeftHours(gridEl);

  dateGallery.firstFrame.dates.forEach((dateObj, index) => {
    const eventColumns = calculateEventColumns(dateObj);

    const dayNameEl = document.createElement("button");
    dayNameEl.className = "calendar-week-dayname";
    dayNameEl.innerHTML = `
        <time datetime="${dateObj.date.toISOString()}">
          ${weekDayFormatter.format(dateObj.date)}
        </time>
      `;
    dayNameEl.style.gridColumn = index + 2;

    // When clicking on a day open the "event form" with the
    // clicked date selected.
    dayNameEl.onclick = (e) => {
      e.preventDefault();

      dateGallery.changeConfig({
        initialDate: dateObj.date,
        mode: "day",
        numberOfFrames: 1,
      });
    };

    gridEl.appendChild(dayNameEl);

    // Will be a subgrid for each day containing the events
    const dayEl = document.createElement("ul");

    // Store the date of this element, for event drag and drop
    dayEl.dataset.date = dateObj.date.getTime();

    // Create sub grid for each day in the week.
    dayEl.className = "calendar-week-day-grid";
    dayEl.style.gridColumn = dateObj.date.getDay() + 2;

    dateObj.events.forEach((event) => {
      const eventEl = clone(eventTemplate);

      eventEl.style.backgroundColor = event.data.color;

      const buttonEl = eventEl.querySelector("button");
      buttonEl.style.backgroundColor = event.data.color;
      buttonEl.style.color = yiq(event.data.color);
      buttonEl.ariaLabel = ariaLabelForEvent(event);

      const titleEl = eventEl.querySelector("i");
      titleEl.title = event.data.title;
      titleEl.textContent = event.data.title;

      const [startTimeEl, endTimeEl] = Array.from(
        eventEl.querySelectorAll("b"),
      );

      eventEl.querySelector(".event-description").textContent =
        event.data.description;

      const [startTimeDragEl, endTimeDragEl] = Array.from(
        eventEl.querySelectorAll(".drag-indicator"),
      );

      /*
        An event that spans multiple days is rendered once in each 
        day the event occurs. 
        
        On dates that match the startDate and endDate we make draggable.
      */
      if (event.spansMultipleDays) {
        if (dateGallery.isSameDay(event.startDate, dateObj.date)) {
          // When the event starts on this day, make it span the
          // entire day, as we know it does not end on this day.
          const start = getMinutesSinceStart(event.startDate, START_HOUR);
          eventEl.style.gridRow = `${start + 1} / ${HEIGHT}`;

          // No end time indicator as it is on another day
          endTimeDragEl.draggable = false;

          // Show start time only on first day
          startTimeEl.textContent = timeFormatter.format(event.startDate);
        } else if (dateGallery.isSameDay(event.endDate, dateObj.date)) {
          // When the event ends on this day start it at midnight, since
          // we know it started on a previous day.
          const end = getMinutesSinceStart(event.endDate, START_HOUR);

          eventEl.style.gridRow = `1 / ${end + 2}`;

          // No start time drag indicator as it is on another day
          startTimeDragEl.draggable = false;

          // Show end time only on last day
          endTimeEl.textContent = timeFormatter.format(event.endDate);
        } else {
          // When the event is during this whole day take up all space
          eventEl.style.gridRow = `1 / ${HEIGHT}`;

          // No start / end drag indicator as it is on another day
          startTimeDragEl.draggable = false;
          endTimeDragEl.draggable = false;
        }
      } else {
        // The event is contained within this day.

        const start = getMinutesSinceStart(event.startDate, START_HOUR);
        const end = getMinutesSinceStart(event.endDate, START_HOUR);

        eventEl.style.gridRow = `${start + 1} / ${end + 1}`;

        // It has both start and end time drag, and additionaly
        // the event can be dragged itself.
        event.draggable = true;

        // When fully in this day show both times
        startTimeEl.textContent = timeFormatter.format(event.startDate);
        endTimeEl.textContent = timeFormatter.format(event.endDate);
      }

      eventEl.style.gridColumn = eventColumns.get(event);

      // When clicking on an event open the "event form"
      // and prefill it with the clicked event.
      eventEl.onclick = (e) => {
        e.stopPropagation();

        calendar.openEditEventForm(event);
      };

      // An event is draggable when it can be fitted on this day
      eventEl.draggable = event.spansMultipleDays === false;

      // When the drag starts store information about which event is dragged
      function onDragStart(e) {
        e.stopPropagation();

        // Store what the mouse position was at the start of the drag.
        // Used to calulate how many minutes the user wants the event
        // to move.
        dragData.yAtDragStart = e.clientY;

        // Set store the original start and end time for when
        // the dragging began. This way we always know the
        // original times even after we "move" the event.
        dragData.dragStartTime = new Date(event.startDate).getTime();
        dragData.dragEndTime = new Date(event.endDate).getTime();

        // Set the drag image to an empty image. Because we are
        // going to continuously "move" the event we do not need
        // a "ghost".
        e.dataTransfer.setDragImage(emptyImage, 0, 0);
      }

      // When the the event is dragged alter the time period of the vent.
      function onDrag(e) {
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
        const minutesMoved = e.clientY - dragData.yAtDragStart;

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
        if (hoveredDayEl) {
          movedToDate = new Date(parseInt(hoveredDayEl.dataset.date, 10));
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

          if (e.target === eventEl) {
            const duration = dragData.dragEndTime - dragData.dragStartTime;

            // First update to the new start time
            const startDate = new Date(dragData.dragStartTime + msMoved);

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
          } else if (e.target === startTimeDragEl) {
            // Move only the start time
            event.move({
              startDate: new Date(dragData.dragStartTime + msMoved),
              endDate: event.endDate,
            });
          } else {
            // Move only the end time
            event.move({
              startDate: event.startDate,
              endDate: new Date(dragData.dragEndTime + msMoved),
            });
          }
        }
      }

      eventEl.ondragstart = onDragStart;
      startTimeDragEl.ondragstart = onDragStart;
      endTimeDragEl.ondragstart = onDragStart;

      eventEl.ondrag = onDrag;
      startTimeDragEl.ondrag = onDrag;
      endTimeDragEl.ondrag = onDrag;

      dayEl.appendChild(eventEl);
    });

    // When clicking on a hour open the "event form" with the
    // clicked hour selected.
    dayEl.onclick = (event) => {
      // To determine the minute we look to where the user
      // clicked in the day cell. Remember: the day cell
      // is HEIGHTpx in height, one pixel per minute.
      const rect = dayEl.getBoundingClientRect();
      const distanceInMinutes = event.clientY - rect.top;

      const hour = Math.floor(distanceInMinutes / 60);

      let minute = Math.round(distanceInMinutes % 60);
      // Round to closest 5 minutes
      minute = Math.round(minute / 5) * 5;

      const date = new Date(dateObj.date);
      date.setHours(hour, minute);

      calendar.openNewEventForm(date);
    };

    gridEl.appendChild(dayEl);
  });

  calendar.calendarWrapperEl.appendChild(weekEl);
}

function renderLeftHours(gridEl) {
  // Render the hours on the left
  for (let i = START_HOUR; i < END_HOUR + 1; i++) {
    const hourEl = document.createElement("span");
    hourEl.className = "calendar-week-hour";
    hourEl.ariaHidden = true;

    const row = (i - START_HOUR) * 60 + 3;
    hourEl.style.gridRow = `${row} / ${row + 60}`;

    const date = new Date();
    date.setHours(i, 0, 0, 0);

    const time = timeFormatter.format(date);
    hourEl.textContent = time;

    gridEl.appendChild(hourEl);
  }
}

export function writeWeekTemplates(calendar) {
  calendar.innerHTML += `
    <template id="calendar-week-template">
      <div class="calendar-week">
        <div class="calendar-week-grid"></div>
      </div>
    </template>

    <template id="calendar-week-event-template">
      <li class="calendar-week-event">
        <button>
          <span class="drag-indicator" draggable="true"></span>
          <span class="text-container">
            <span class="inner-text-container">
              <b></b>
              <i></i>
              <span class="event-description"></span>
            </span>
            <b class="end-time"></b>
          </span>
          <span class="drag-indicator" draggable="true"></span>
        </button>
      </li>
    </template>
  `;
}

/* 
  Takes a DateGalleryDate and returns a Map to which the events 
  are keys, and the values are CSS gridColumn strings.

  For example: 
  
  {eventA: '1 / 2', eventB: '2 / 3', eventC: '3 / 4'}

  The events are packed as tight as possible so the least
  amount of columns are used.

  Note: since we are using a CSS grid we do get one limitation:
  you cannot always divide a CSS grid equally over multiple events.
  This is because CSS grids cannot have varying columns / rows, 
  meaning you cannot make one row have three columns, and the other
  row have two.

  This is a problem for us: say you have a day with five events, 
  three of which are overlapping, and the other two overlap as well. 
  This means we end up with 3 columns total to hold the three 
  overlapping events, but then the other 2 events also need to be 
  divided over three columns. 

  In an ideal world we would be able to say: CSS Grid make those 
  two events take the same amount of space in the 3 columms. 
  Essentialy making the 2 events the same size, but unfortunately 
  CSS cannot do this.

  So my solution is to make one of the two events take up 2/3 and 
  the other 1/3. Not ideal but it works
*/
function calculateEventColumns(dateObj) {
  // Step one: we place all events into the least amount of columns
  const columns = packEventsOnAxis(dateObj.events);

  // Step two: we take the columns array and turn it into a Map of CSS
  // grid column strings.
  const eventColumns = new Map();

  dateObj.events.forEach((event) => {
    // Shortcut if the event does not overlap make it span
    // all columns.
    if (!event.isOverlapping) {
      eventColumns.set(event, `1 / ${columns.length + 1}`);
      return;
    }

    // The start column is the first column this event can be found in.
    const startColumn = columns.findIndex((column) => column.includes(event));

    // Now that we have found the start, we need to find the end in the
    // remaining columns.
    const remainingColumns = columns.slice(startColumn);

    // The end column is the first column an overlapping event can be found in,
    // since it has to share the column with that event.
    let endColumn = remainingColumns.findIndex((column) =>
      column.some((otherEvent) => event.overlappingEvents.includes(otherEvent)),
    );

    // If we cannot find an endColumn it means it was already on the
    // last column, so place it there.
    if (endColumn === -1) {
      endColumn = columns.length;
    } else {
      // If the endColumn can be found we need to add the startColumn
      // to it since the remainingColumns start counting at 0 again,
      // so we need to make up the difference.
      endColumn += startColumn;
    }

    // Finally we know where to place the event, but we need to
    // account for the fact that CSS grid starts counting at one
    // and not zero. So we +1 the columns.
    eventColumns.set(event, `${startColumn + 1} / ${endColumn + 1}`);
  });

  return eventColumns;
}
