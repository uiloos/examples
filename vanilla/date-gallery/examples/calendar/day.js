import { clone, yiq, getMinutesSinceStart, emptyImage } from "./utils.js";
import { timeFormatter, dateFormatter } from "../formatters.js";
import { packEventsOnAxis, ariaLabelForEvent } from "./events.js";

// You can change the number of hours shown here,
// by default all hours are shown.
const START_HOUR = 0;
const END_HOUR = 24;
const WIDTH = (END_HOUR - START_HOUR) * 60;

// Will contain information when event is dragged.
const dragData = {
  xAtDragStart: 0,
  dragStartTime: 0,
  dragEndTime: 0,
};

export function renderDayCalendar(calendar, dateGallery) {
  const calendarDayTemplate = calendar.querySelector("#calendar-day-template");

  const eventTemplate = calendar.querySelector("#calendar-day-event-template");

  const dayDate = dateGallery.firstFrame.anchorDate;

  calendar.calendarTitleEl.textContent = dateFormatter.format(dayDate);

  const gridEl = clone(calendarDayTemplate);
  gridEl.style.setProperty("--width", WIDTH);

  const eventRows = calculateEventRows(dateGallery);

  // Render top bar hours
  renderHours(calendar, dateGallery, gridEl, eventRows);

  // Render current hour vertical red line, but only when today is shown
  renderCurrentHour(calendar, dateGallery, gridEl, eventRows);

  dateGallery.firstFrame.events.forEach((event) => {
    const eventEl = clone(eventTemplate);

    eventEl.style.backgroundColor = event.data.color;

    const buttonEl = eventEl.querySelector("button");
    buttonEl.style.backgroundColor = event.data.color;
    buttonEl.style.color = yiq(event.data.color);
    buttonEl.ariaLabel = ariaLabelForEvent(event);

    const titleEl = eventEl.querySelector("i");
    titleEl.title = event.data.title;
    titleEl.textContent = event.data.title;

    const [startTimeEl, endTimeEl] = Array.from(eventEl.querySelectorAll("b"));

    const [startTimeDragEl, endTimeDragEl] = Array.from(
      eventEl.querySelectorAll(".drag-indicator"),
    );

    if (event.spansMultipleDays) {
      if (dateGallery.isSameDay(event.startDate, dayDate)) {
        // When the event starts on this day, make it span the
        // entire day, as we know it does not end on this day.
        const start = getMinutesSinceStart(event.startDate, START_HOUR);
        eventEl.style.gridColumn = `${start + 1} / ${WIDTH}`;

        // No end time indicator as it is on another day
        endTimeDragEl.draggable = false;

        // Show start time only on first day
        startTimeEl.textContent = timeFormatter.format(event.startDate);
      } else if (dateGallery.isSameDay(event.endDate, dayDate)) {
        // When the event ends on this day start it at midnight, since
        // we know it started on a previous day.
        const end = getMinutesSinceStart(event.endDate, START_HOUR);
        eventEl.style.gridColumn = `1 / ${end + 2}`;

        // No start time drag indicator as it is on another day
        startTimeDragEl.draggable = false;

        // Show end time only on last day
        endTimeEl.textContent = timeFormatter.format(event.endDate);
      } else {
        // When the event is during this whole day
        eventEl.style.gridColumn = `1 / ${WIDTH}`;

        // No start / end drag indicator as it is on another day
        startTimeDragEl.draggable = false;
        endTimeDragEl.draggable = false;
      }
    } else {
      // The event is contained within this day.

      const start = getMinutesSinceStart(event.startDate, START_HOUR);
      const end = getMinutesSinceStart(event.endDate, START_HOUR);

      eventEl.style.gridColumn = `${start + 1} / ${end + 1}`;

      // When fully in this day show both times
      startTimeEl.textContent = timeFormatter.format(event.startDate);
      endTimeEl.textContent = timeFormatter.format(event.endDate);
    }

    eventEl.style.gridRow = eventRows.get(event);

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
      dragData.xAtDragStart = e.clientX;

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
      // the cursor (clientX) is from the clientX at the start of
      // the drag start.
      const minutesMoved = e.clientX - dragData.xAtDragStart;

      // Move by an increment of 5 minutes, to create a snap effect
      if (minutesMoved % 5 === 0) {
        // Date constructor wants milliseconds since 1970
        const msMoved = minutesMoved * 60 * 1000;

        // Note: moving the event will cause the entire DOM to be ripped
        // to shreds and be rebuilt. So the 5 minute snap effect is
        // also a performance boost.

        if (e.target === eventEl) {
          // Move both start and end times with the same values
          // so the duration of the event stays the same.
          event.move({
            startDate: new Date(dragData.dragStartTime + msMoved),
            endDate: new Date(dragData.dragEndTime + msMoved),
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

    gridEl.appendChild(eventEl);
  });

  calendar.calendarWrapperEl.appendChild(gridEl);
}

export function writeDayTemplates(calendar) {
  calendar.innerHTML += `
    <template id="calendar-day-template">
      <ul class="calendar-day-grid"></ul>
    </template>

    <template id="calendar-day-event-template">
      <li class="calendar-day-event">
        <button>
          <span class="drag-indicator" draggable="true"></span>
          <span class="text-container">
            <b></b>
            <i></i>
            <b class="end-time"></b>
          </span>
          <span class="drag-indicator" draggable="true"></span>
        </button>
      </li>
    </template>
  `;
}

/* 
  Takes a DateGallery and returns a Map to which the events 
  are keys, and the values are CSS gridRow strings.

  For example: 
  
  {eventA: '1 / 2', eventB: '2 / 3', eventC: '3 / 4'}

  The events are packed as tight as possible so the least
  amount of rows are used.
*/
function calculateEventRows(dateGallery) {
  // Step one: we place all events into the least amount of rows
  const rows = packEventsOnAxis(dateGallery.firstFrame.events);

  // Step two: we take the rows array and turn it into a Map of CSS
  // grid row strings.
  const eventRows = new Map();

  dateGallery.firstFrame.events.forEach((event) => {
    const row = rows.findIndex((row) => row.includes(event));

    // Finally we know where to place the event, but we need to
    // account for the fact that CSS grid starts counting at one
    // and not zero. So we +1 the rows. Also we now that the first
    // row shows the hours so another +1 is needed.
    eventRows.set(event, `${row + 2}`);
  });

  return eventRows;
}

function renderHours(calendar, dateGallery, gridEl, eventRows) {
  // Render the hours on the top
  for (let i = START_HOUR; i < END_HOUR; i++) {
    const hourEl = document.createElement("li");
    hourEl.className = "calendar-day-hour";
    hourEl.ariaHidden = true;

    const column = (i - START_HOUR) * 60 + 1;
    hourEl.style.gridColumn = `${column} / ${column + 60}`;

    hourEl.style.gridRow = `1 / ${getNoRows(eventRows)}`;

    const date = new Date(dateGallery.firstFrame.anchorDate);
    date.setHours(i, 0, 0, 0);

    const time = timeFormatter.format(date);
    hourEl.textContent = time;

    // When clicking on a hour open the "event form" with the
    // clicked hour selected.
    hourEl.onclick = (event) => {
      // To determine the minute we look to where the user
      // clicked in the hour cell. Remember: the hour cell
      // is 60px in height, one pixel per minute.
      const rect = hourEl.getBoundingClientRect();
      const distanceInMinutes = event.clientX - rect.left;

      // Round to closest 5 minutes
      const minute = Math.round(distanceInMinutes / 5) * 5;

      const eventDate = new Date(date);
      eventDate.setHours(date.getHours(), minute);

      calendar.openNewEventForm(eventDate);
    };

    gridEl.appendChild(hourEl);
  }
}

function renderCurrentHour(calendar, dateGallery, gridEl, eventRows) {
  // Add a red line showing the current time, but only
  // when showing today
  if (dateGallery.firstFrame.dates[0].isToday) {
    const currentHourEl = document.createElement("div");
    currentHourEl.className = "calendar-day-current-time";

    currentHourEl.style.gridRow = `1 / ${getNoRows(eventRows)}`;

    function update() {
      const now = new Date();

      const column = getMinutesSinceStart(now, START_HOUR);
      currentHourEl.style.gridColumn = `${column + 1} / ${column + 2}`;

      currentHourEl.setAttribute("time", timeFormatter.format(now));
    }

    update();

    // Update the position of the red line every second
    const id = setInterval(update, 1000);

    // Register this interval to the calendar, so the calendar
    // can remove the interval when the mode changes.
    calendar.intervalsIds.push(id);

    gridEl.append(currentHourEl);
  }
}

function getNoRows(eventRows) {
  let noRows = 0;
  eventRows.forEach((x) => {
    noRows = Math.max(parseInt(x, 10), noRows);
  });

  return noRows < 20 ? 20 : noRows;
}
