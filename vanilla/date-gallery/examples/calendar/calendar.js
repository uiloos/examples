/*
  It is highly recommended to use a date library parse / validate
  dates, using date-fns here, but you could also use Luxon, dayjs or 
  Moment.js
*/
import { isValid } from "https://unpkg.com/date-fns@3.2.0/isValid.mjs";
import { generateEvents, formatDateForInput, eventId } from "./events.js";
import { isoFormatter } from "../formatters.js";
import { renderMonthCalendar, writeMonthTemplates } from "./month.js";
import { renderYearCalendar, writeYearTemplates } from "./year.js";
import { renderWeekCalendar, writeWeekTemplates } from "./week.js";
import { renderDayCalendar, writeDayTemplates } from "./day.js";

class Calendar extends HTMLElement {
  connectedCallback() {
    // Write the HTML into the <uiloos-calendar /> component needed
    // for the component to render.
    this.writeHTML();

    // For each mode write the <templates> that the modes need
    // this is so the <templates> used per mode is located in
    // the file that renders the mode.
    writeYearTemplates(this);
    writeMonthTemplates(this);
    writeWeekTemplates(this);
    writeDayTemplates(this);

    // The formEvent tracks which event is shown in the <form>
    // element, when null it means a new event is added.
    this.formEvent = null;

    this.calendarWrapperEl = this.querySelector(".calendar-wrapper");
    this.calendarTitleEl = this.querySelector(".calendar-title");
    this.calendarEventFormEl = this.querySelector(".calendar-event-form");
    this.addEventDialogEl = this.querySelector("dialog");
    this.deleteButtonEl = this.querySelector(".delete-event-button");
    this.modeButtonsEls = Array.from(this.querySelectorAll(".mode-button"));

    const { mode, numberOfFrames, initialDate } = this.readConfigFromUrl();

    // An array which holds ids returned from setInterval calls,
    // is cleared after a mode change. The idea is that some modes
    // may use window.setInterval to register some recurring action
    // but that these should be cleanup whenever the mode changes.
    this.intervalsIds = [];

    const calendar = this;
    this.dateGallery = new window.uiloosDateGallery.DateGallery(
      {
        mode,
        numberOfFrames,
        initialDate,
        events: generateEvents(),
      },
      (dateGallery) => {
        // Sync the query parameters, so that the url changes and the
        // user can reload the page and still see the same calendar
        const url = new URL(window.location.href);
        url.searchParams.set("mode", dateGallery.mode);
        url.searchParams.set(
          "initialDate",
          isoFormatter.format(dateGallery.firstFrame.anchorDate),
        );

        // Only push if the url has actually changed,
        // otherwise it will push duplicates.
        if (url.href !== window.location.href) {
          window.history.pushState({}, "", url);
        }

        // The day mode runs an
        calendar.intervalsIds.forEach((id) => {
          clearInterval(id);
        });
        calendar.intervalsIds.length = 0;

        // The delay is needed so modeSegmentedButton is initialized
        setTimeout(() => {
          // Sync with the mode segemented button
          calendar.activateMode(dateGallery.mode);
        }, 1);

        // Clear the wrapper so the mode can render cleanly
        calendar.calendarWrapperEl.innerHTML = "";

        // Delegate the rendering of the actual mode to
        // the various render helper functions.
        if (dateGallery.mode === "month-six-weeks") {
          renderMonthCalendar(calendar, dateGallery);
        } else if (dateGallery.mode === "month") {
          renderYearCalendar(calendar, dateGallery);
        } else if (dateGallery.mode === "week") {
          renderWeekCalendar(calendar, dateGallery);
        } else {
          renderDayCalendar(calendar, dateGallery);
        }
      },
    );

    window.addEventListener("popstate", this.syncFromUrl);

    this.modeSegmentedButton = new window.uiloosActiveList.ActiveList(
      {
        contents: this.modeButtonsEls,
      },
      window.uiloosActiveList.createActiveListSubscriber({
        onActivated(event, modeSegmentedButton) {
          if (modeSegmentedButton.lastDeactivated) {
            modeSegmentedButton.lastDeactivated.classList.remove("active");
          }

          modeSegmentedButton.lastActivated.classList.add("active");

          // Sync with the DateGallery
          calendar.activateMode(modeSegmentedButton.lastActivated.dataset.mode);
        },
      }),
    );

    this.activateMode(mode);

    this.registerInteractions();
  }

  disconnectedCallback() {
    window.removeEventListener("popstate", this.syncFromUrl);

    this.calendarWrapperEl = null;
    this.calendarTitleEl = null;
    this.calendarEventFormEl = null;
    this.addEventDialogEl = null;
    this.deleteButtonEl = null;
    this.modeButtonsEls = null;

    this.dateGallery = null;
    this.modeSegmentedButton = null;
  }

  syncFromUrl = () => {
    const config = this.readConfigFromUrl();

    this.dateGallery.changeConfig(config);
  };

  // Writes the initial HTML into the uiloos-calendar element
  writeHTML() {
    this.innerHTML = `
      <div class="calendar-example">
        <dialog>
          <form class="calendar-event-form">
            <b class="calendar-event-form-title">Edit event</b>
      
            <div class="calendar-event-form-field">
              <label for="title">Title</label>
              <input id="title" name="title" required />
            </div>
      
            <div class="calendar-event-form-field">
              <label for="description">Description</label>
              <textarea
                id="description"
                name="description"
                cols="4"
                rows="4"
                required
              ></textarea>
            </div>

            <uiloos-daterangepicker
              time
              start-name="start"
              end-name="end"
              start-label="Start (mm/dd/yyyy hh:mm)"
              end-label="End (mm/dd/yyyy hh:mm)"
              start-error-label="Start"
              end-error-label="End"
              required
            >
              Loading...
            </uiloos-daterangepicker>
      
            <div class="calendar-event-form-field">
              <label for="color">Color</label>
              <input id="color" name="color" type="color" required />
            </div>
      
            <button type="submit">Save</button>
          </form>

          <button class="delete-event-button">Delete event</button>
        </dialog>
      
        <div class="calender-topbar">
          <div class="calendar-mode">
            <button class="mode-button" data-mode='month'>Year</button>
            <button class="mode-button" data-mode='month-six-weeks'>Month</button>
            <button class="mode-button" data-mode='week'>Week</button>
            <button class="mode-button" data-mode='day'>Day</button>
          </div>
          
          <div class='calendar-controls'>
            <button class="calendar-previous calendar-button">
              previous
            </button>
            <span class="calendar-title">Loading...</span>
            <button class="calendar-next calendar-button">next</button>
          </div>
      
          <div class="calendar-actions">
            <button class="calendar-today calendar-button">today</button>
            <button class="calendar-add-event calendar-button">
              + add event
            </button>
          </div>
        </div>
      
        <div class="calendar-wrapper">Loading...</div>
      </div>
    `;
  }

  // Gathers all buttons / forms and sets up what happens when you use them
  registerInteractions() {
    // Step 1: setup the topbar actions
    this.querySelector(".calendar-next").onclick = () => {
      this.dateGallery.next();
    };

    this.querySelector(".calendar-previous").onclick = () => {
      this.dateGallery.previous();
    };

    this.querySelector(".calendar-today").onclick = () => {
      this.dateGallery.today();
    };

    this.modeButtonsEls.forEach((button) => {
      button.onclick = () => {
        this.modeSegmentedButton.activate(button);
      };
    });

    // Step 2: setup the actions that are about adding events.
    this.querySelector(".calendar-add-event").onclick = () => {
      // Mark the form as being for a new event.
      this.formEvent = null;

      this.openNewEventForm(new Date());
    };

    // Reset the form whenever it is closed, will be
    // on submit and when esc or backdrop is clicked
    this.addEventDialogEl.onclose = () => {
      // Whenever the event is closed reset the form,
      // since it is re-used.
      this.calendarEventFormEl.reset();

      // Set to null so we do not keep an event in memory,
      this.formEvent = null;

      this.deleteButtonEl.onclick = undefined;
    };

    // Close dialog when backdrop is clicked
    this.addEventDialogEl.onclick = (event) => {
      if (event.target.nodeName === "DIALOG") {
        this.addEventDialogEl.close();
      }
    };

    // Create a new event, or edit the event based on whether or not
    // there is a formEvent.
    this.calendarEventFormEl.onsubmit = (event) => {
      event.preventDefault();

      const formData = new FormData(this.calendarEventFormEl);

      const isCreating = this.formEvent === null;

      if (isCreating) {
        // Inform the dateGallery of the new event
        this.dateGallery.addEvent({
          data: {
            id: eventId(),
            title: formData.get("title"),
            description: formData.get("description"),
            color: formData.get("color"),
          },
          startDate: formData.get("start"),
          endDate: formData.get("end"),
        });
      } else {
        // Inform the dateGallery that the event has changed.

        // First update the data object of the event, to whatever
        // the user filled in.
        this.formEvent.changeData({
          id: this.formEvent.data.id,
          title: formData.get("title"),
          description: formData.get("description"),
          color: formData.get("color"),
        });

        // Then tell the DateGallery that the event has actually moved
        this.formEvent.move({
          startDate: formData.get("start"),
          endDate: formData.get("end"),
        });
      }

      // Close the dialog, note that this causes the
      // `addEventDialogEl.onclose` to fire.
      this.addEventDialogEl.close();
    };
  }

  // Activates a mode and syncs both the dateGallery and modeSegmentedButton (ActiveList)
  // This way no matter how the mode changes, either from inside the dateGallery subscriber
  // or via a button click on the mode segemented button they will always be in sync.
  activateMode(mode) {
    // Step 1: sync with the segmented button

    // Find the button that represents the mode
    const button = this.modeButtonsEls.find(
      (button) => button.dataset.mode === mode,
    );
    // and activate that button.
    this.modeSegmentedButton.activate(button);

    // Step 2: sync with the DateGallery

    // When the 'mode' is month it means 'year' has been selected
    // and we show 12 month calenders side by side.
    if (mode === "month") {
      // Anchor date to january first, otherwise the 'year' will start
      // at the current month.
      const initialDate = new Date(this.dateGallery.firstFrame.anchorDate);
      initialDate.setMonth(0);
      initialDate.setDate(1);

      this.dateGallery.changeConfig({
        mode,
        numberOfFrames: 12,
        initialDate,
      });
    } else {
      this.dateGallery.changeConfig({ mode, numberOfFrames: 1 });
    }
  }

  // Opens the "event form" in "new" mode and sets the start date and time
  // to the Date object provided.
  openNewEventForm(startDate) {
    const rangePickerEl = this.calendarEventFormEl.querySelector(
      "uiloos-daterangepicker",
    );

    // Set the startDate to what was provided.
    rangePickerEl.setAttribute("start-value", formatDateForInput(startDate));

    // Set the endDate to the startDate plus one hour
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1, startDate.getMinutes());

    rangePickerEl.setAttribute("end-value", formatDateForInput(endDate));

    this.addEventDialogEl.showModal();
    this.calendarEventFormEl.querySelector(
      ".calendar-event-form-title",
    ).textContent = "Add event";

    this.deleteButtonEl.style.display = "none";
    this.deleteButtonEl.onclick = () => undefined;
  }

  // Opens the "event form" in "edit" mode and sets all input fields to the
  // provided event.
  openEditEventForm(event) {
    this.formEvent = event;

    this.calendarEventFormEl.querySelector("#title").value = event.data.title;

    this.calendarEventFormEl.querySelector("#description").value =
      event.data.description;

    this.calendarEventFormEl.querySelector("#color").value = event.data.color;

    const rangePickerEl = this.calendarEventFormEl.querySelector(
      "uiloos-daterangepicker",
    );

    rangePickerEl.setAttribute(
      "start-value",
      formatDateForInput(event.startDate),
    );

    rangePickerEl.setAttribute("end-value", formatDateForInput(event.endDate));

    this.addEventDialogEl.showModal();
    this.calendarEventFormEl.querySelector(
      ".calendar-event-form-title",
    ).textContent = "Edit event";

    this.deleteButtonEl.style.display = "block";
    this.deleteButtonEl.onclick = () => {
      this.formEvent.remove();

      // Close the dialog, note that this causes the
      // `addEventDialogEl.onclose` to fire.
      this.addEventDialogEl.close();
    };
  }

  readConfigFromUrl() {
    const url = new URL(window.location.href);

    let mode = url.searchParams.get("mode") ?? "month";

    if (
      !["month", "month-six-weeks", "week", "day"].includes(mode.toLowerCase())
    ) {
      mode = "month";
    }

    const numberOfFrames = mode === "month" ? 12 : 1;

    let initialDate = url.searchParams.get("initialDate") ?? new Date();
    initialDate = new Date(initialDate);

    if (!isValid(initialDate)) {
      initialDate = new Date();
    }

    return {
      mode,
      numberOfFrames,
      initialDate,
    };
  }
}

customElements.define("uiloos-calendar", Calendar);
