import { clone } from "./utils.js";
import { yearFormatter, monthFormatter } from "../formatters.js";

export function renderYearCalendar(calendar, dateGallery) {
  const calendarMonthTemplate = calendar.querySelector(
    "#calendar-year-template",
  );

  const calendarDayTemplate = calendar.querySelector(
    "#calendar-year-daycell-template",
  );

  calendar.calendarTitleEl.textContent = yearFormatter.format(
    dateGallery.firstFrame.anchorDate,
  );

  const wrapperEl = document.createElement("ul");
  wrapperEl.className = "calendar-year-months";

  dateGallery.frames.forEach((frame) => {
    const calendarMonthEl = clone(calendarMonthTemplate);

    const monthNameEl = calendarMonthEl.querySelector(
      ".calendar-year-monthname",
    );
    monthNameEl.textContent = monthFormatter.format(frame.anchorDate);
    monthNameEl.onclick = () => {
      dateGallery.changeConfig({
        mode: "month-six-weeks",
        numberOfFrames: 1,
        initialDate: frame.anchorDate,
      });
    };

    const cellsEl = calendarMonthEl.querySelector(".calendar-year-daycells");

    frame.dates.forEach((dateObj) => {
      const dayEl = clone(calendarDayTemplate);

      /*
       Place the dayEl in the correct column, this is only needed
       for the "month" mode because it starts at the first of the 
       month, which may be on an other day than the start of 
       the week.

       The +1 is needed because CSS Grid starts counting at 1.
    */
      dayEl.style.gridColumn = dateObj.date.getDay() + 1;

      if (dateObj.hasEvents) {
        dayEl.classList.add("has-event");
      }

      // When clicking on a day open the "event form" with the
      // clicked date selected.
      dayEl.onclick = (e) => {
        e.preventDefault();

        dateGallery.changeConfig({
          initialDate: dateObj.date,
          mode: "day",
          numberOfFrames: 1,
        });
      };

      // Now set the number of the date in the right corner
      const dayNumberEl = dayEl.querySelector(".calendar-year-daycell-number");
      dayNumberEl.innerHTML = `
        <time datetime="${dateObj.date.toISOString()}">
          ${dateObj.date.getDate()}
        </time>
      `;

      cellsEl.appendChild(dayEl);
    });

    wrapperEl.appendChild(calendarMonthEl);
  });

  calendar.calendarWrapperEl.appendChild(wrapperEl);
}

export function writeYearTemplates(calendar) {
  calendar.innerHTML += `
    <template id="calendar-year-template">
      <li class="calendar-year">
        <button class="calendar-year-monthname">December</button>

        <ul class="calendar-year-daynames">
          <li class="calendar-year-dayname"><abbr title="Sunday">S</abbr></li>
          <li class="calendar-year-dayname"><abbr title="Monday">M</abbr></li>
          <li class="calendar-year-dayname"><abbr title="Tuesday">T</abbr></li>
          <li class="calendar-year-dayname"><abbr title="Wednesday">W</abbr></li>
          <li class="calendar-year-dayname"><abbr title="Thursday">T</abbr></li>
          <li class="calendar-year-dayname"><abbr title="Friday">F</abbr></li>
          <li class="calendar-year-dayname"><abbr title="Saturday">S</abbr></li>
        </ul>

        <ul class="calendar-year-daycells"></ul>
      </li>
    </template>

    <template id="calendar-year-daycell-template">
      <li class="calendar-year-daycell">
        <button class="calendar-year-daycell-number"></button>
      </li>
    </template>
  `;
}
