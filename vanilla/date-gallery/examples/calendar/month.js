import { clone, yiq, emptyImage } from "./utils.js";
import {
  monthAndYearFormatter,
  timeFormatter,
  dateTimeFormatter,
} from "../formatters.js";
import { ariaLabelForEvent } from "./events.js";

// Will contain the event that is dragged
let draggedEvent = null;

export function renderMonthCalendar(calendar, dateGallery) {
  const calendarMonthTemplate = calendar.querySelector(
    "#calendar-month-template",
  );
  const calendarDayTemplate = calendar.querySelector(
    "#calendar-month-daycell-template",
  );
  const eventTemplate = calendar.querySelector(
    "#calendar-month-event-template",
  );

  calendar.calendarTitleEl.textContent = monthAndYearFormatter.format(
    dateGallery.firstFrame.anchorDate,
  );

  const calendarMonthEl = clone(calendarMonthTemplate);

  const cellsEl = calendarMonthEl.querySelector(".calendar-month-daycells");

  const eventPositionsByDay = calculateEventPositionByDay(dateGallery);

  dateGallery.firstFrame.dates.forEach((dateObj, index) => {
    const eventsForDay = eventPositionsByDay[index];

    const dayEl = clone(calendarDayTemplate);

    // Set the aria label of the button to something sensible
    const date = new Date(dateObj.date);

    // Set the date to the current hour, and to the closest 5 minutes
    const now = new Date();
    date.setHours(now.getHours(), Math.round(now.getMinutes() / 5) * 5);

    const formatted = dateTimeFormatter.format(date);
    dayEl.ariaLabel = `Create new event at around ${formatted}`;

    if (dateObj.isPadding) {
      dayEl.classList.add("padding");
    }

    // When clicking on a day open the "event form" with the
    // clicked date selected.
    dayEl.onclick = () => {
      calendar.openNewEventForm(date);
    };

    // Now set the number of the date in the right corner
    const dayNumberEl = dayEl.querySelector(".calendar-month-daycell-number");
    dayNumberEl.innerHTML = `
      <time datetime="${dateObj.date.toISOString()}">
        ${dateObj.date.getDate()}
      </time>
    `;
    dayNumberEl.onclick = (e) => {
      e.stopPropagation();

      dateGallery.changeConfig({
        initialDate: dateObj.date,
        mode: "day",
        numberOfFrames: 1,
      });
    };

    const eventsEl = dayEl.querySelector(".calendar-month-daycell-events");

    const noRows = eventsForDay.length;
    eventsEl.style.gridTemplateRows = `repeat(${noRows}, 32px)`;

    for (const event of dateObj.events) {
      const eventEl = clone(eventTemplate);

      // Needed for the ::before event dot
      eventEl.style.setProperty("--color", event.data.color);

      const buttonEl = eventEl.querySelector("button");
      buttonEl.ariaLabel = ariaLabelForEvent(event);

      const eventTitleEl = eventEl.querySelector(".calendar-month-event-title");
      eventTitleEl.title = event.data.title;

      const timeEl = eventEl.querySelector(".calendar-month-event-time");

      if (event.spansMultipleDays) {
        /*
          Here we put an event on a specific row in the CSS grid
          by doing this all event that are on multiple days are
          neatly ordered within a week, without any gaps.

          See the `calculateEventPositionByDay` function below to
          see how this is calculated.

          The +1 is needed because CSS Grid starts counting at 1.
        */
        eventEl.style.gridRow = eventsForDay.indexOf(event) + 1;

        eventEl.classList.add("multiple");

        buttonEl.style.color = yiq(event.data.color);
        eventEl.style.backgroundColor = event.data.color;

        /*
           An event that spans multiple days is rendered once in each 
           day the event occurs. 
           
           On the startDate we render the title and start time, on the 
           endDate we render the end time. For all days in between we 
           only give it a background color.
        */
        if (dateGallery.isSameDay(event.startDate, dateObj.date)) {
          // Adds a left border
          eventEl.classList.add("first-day-of-event");

          eventTitleEl.textContent = event.data.title;
          timeEl.textContent = timeFormatter.format(event.startDate);
        } else if (dateGallery.isSameDay(event.endDate, dateObj.date)) {
          timeEl.textContent = timeFormatter.format(event.endDate);
        }
      } else {
        // When an event happens on a single day show the title and start time.
        eventTitleEl.textContent = event.data.title;
        timeEl.textContent = timeFormatter.format(event.startDate);
      }

      // When clicking on an event open the "event form"
      // and prefill it with the clicked event.
      eventEl.onclick = (e) => {
        e.stopPropagation();

        calendar.openEditEventForm(event);
      };

      // All events are draggable.
      eventEl.draggable = true;

      // When the drag starts store which event is dragged
      eventEl.ondragstart = (e) => {
        e.stopPropagation();

        // Set the drag image to an empty image. Because we are
        // going to continuously "move" the event we do not need
        // a "ghost".
        e.dataTransfer.setDragImage(emptyImage, 0, 0);

        draggedEvent = event;
      };

      eventsEl.appendChild(eventEl);
    }

    // When the event is dragged over a day, set that day as the
    // events startDate, but keep the original duration of the event.
    dayEl.ondragover = (e) => {
      e.stopPropagation();

      // Create a new startDate based on the date that the event
      // has been dragged over.
      const startDate = new Date(date);

      // Now copy the original start hours.
      startDate.setHours(
        draggedEvent.startDate.getHours(),
        draggedEvent.startDate.getMinutes(),
      );

      // Calculate the duration of the event.
      const duration =
        draggedEvent.endDate.getTime() - draggedEvent.startDate.getTime();

      // Add the duration to the new startDate to get the endDate
      const endDate = new Date(startDate.getTime() + duration);

      draggedEvent.move({
        startDate,
        endDate,
      });
    };

    cellsEl.appendChild(dayEl);
  });

  calendar.calendarWrapperEl.appendChild(calendarMonthEl);
}

export function writeMonthTemplates(calendar) {
  calendar.innerHTML += `
    <template id="calendar-month-template">
      <div class="calendar-month">
        <ul class="calendar-month-daynames">
          <li class="calendar-month-dayname">Sun</li>
          <li class="calendar-month-dayname">Mon</li>
          <li class="calendar-month-dayname">Tue</li>
          <li class="calendar-month-dayname">Wed</li>
          <li class="calendar-month-dayname">Thu</li>
          <li class="calendar-month-dayname">Fri</li>
          <li class="calendar-month-dayname">Sat</li>
        </ul>

        <ul class="calendar-month-daycells"></ul>
      </div>
    </template>

    <template id="calendar-month-daycell-template">
      <li class="calendar-month-daycell" role="button">
        <button class="calendar-month-daycell-number"></button>
        <ul class="calendar-month-daycell-events">
        </ul>
      </li>
    </template>

    <template id="calendar-month-event-template">
      <li class="calendar-month-event">
        <button class="calendar-month-event-wrapper">
          <span class="calendar-month-event-title"></span>
          <span class="calendar-month-event-time"></span>
        </button>
      </li>
    </template>
  `;
}

/* 
  Takes a calendar and returns an array of arrays, each
  subarray represents a day and contains all events of that
  day. 
  
  The position / index of the event with the "day" array is 
  the "row" it should be put in the CSS Grid.
  
  The events are packed as tight as possible so the least
  amount of rows are used.
*/
function calculateEventPositionByDay(dateGallery) {
  // Will contain an array for each day of the month
  const month = [];

  dateGallery.firstFrame.dates.forEach((dateObj, index) => {
    // Will contain all events within the day.
    const day = [];

    const prevDay = month[index - 1];

    dateObj.events.forEach((event) => {
      if (!event.spansMultipleDays) {
        return;
      }

      // If there is a previous day, meaning it is not the
      // first day of the displayed month calendar
      if (prevDay) {
        // Try finding the event within the previous day
        const index = prevDay.indexOf(event);

        // If the event exists add it on this day at the same index / row
        // as the day before, this makes an event appear on the same
        // row for multiple days which is visually pleasing.
        if (index !== -1) {
          day[index] = event;
          return;
        }
      }

      let firstEmptyIndex = 0;

      // Find the first empty position within the `day` array.
      // This way we find the first empty row and fill it, this
      // makes sure the events are packed close together.
      while (day[firstEmptyIndex]) {
        firstEmptyIndex++;
      }

      day[firstEmptyIndex] = event;
    });

    month.push(day);
  });

  return month;
}
