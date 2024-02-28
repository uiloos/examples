import React, { useEffect, useState } from "react";
import { useActiveList, useDateGallery } from "@uiloos/react";
import { generateEvents, EventData } from "./events";
import { isoFormatter } from "../formatters";
import {
  DateGallery,
  DateGalleryEvent,
  DateGalleryMode,
  DateGalleryConfig,
} from "@uiloos/core";
import "./Calendar.css";
import classNames from "classnames";
import { YearCalendar } from "./YearCalendar/YearCalendar";
import { YearCalendarTitle } from "./YearCalendar/YearCalendarTitle";
import { WeekCalendar } from ".//WeekCalendar/WeekCalendar";
import { WeekCalendarTitle } from ".//WeekCalendar/WeekCalendarTitle";
import { DayCalendar } from "./DayCalendar/DayCalendar";
import { DayCalendarTitle } from "./DayCalendar/DayCalendarTitle";
import { MonthCalendar } from "./MonthCalendar/MonthCalendar";
import { MonthCalendarTitle } from "./MonthCalendar/MonthCalendarTitle";
import { EventForm } from "./EventForm/EventForm";
import { isValid } from "date-fns";

type Mode = {
  mode: DateGalleryMode;
  label: string;
};

const modeOptions: Mode[] = [
  { mode: "month", label: "Year" },
  { mode: "month-six-weeks", label: "Month" },
  { mode: "week", label: "Week" },
  { mode: "day", label: "Day" },
];

export function Calendar() {
  const { mode, numberOfFrames, initialDate } = readConfigFromUrl();

  const dateGallery = useDateGallery({
    mode,
    numberOfFrames,
    initialDate,
    events: generateEvents(),
  });

  const modeSegmentedButton = useActiveList({
    contents: modeOptions,
    activeIndexes: modeOptions.findIndex((option) => option.mode === mode),
  });

  // Sync the query parameters, so that the url changes and the
  // user can reload the page and still see the same calendar
  useEffect(() => {
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
      activateMode(dateGallery.mode);
    }
  }, [dateGallery.mode, dateGallery.firstFrame.anchorDate]);

  // Sync the query parameters, so that the url changes and the
  // user can reload the page and still see the same calendar
  useEffect(() => {
    function syncFromUrl() {
      const config = readConfigFromUrl();

      dateGallery.changeConfig(config);

      modeSegmentedButton.activateByPredicate((data) => {
        return data.value.mode === config.mode;
      });
    }

    window.addEventListener("popstate", syncFromUrl);

    return () => {
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, []);

  // Activates a mode and syncs both the dateGallery and modeSegmentedButton (ActiveList)
  // This way no matter how the mode changes, either from inside the dateGallery subscriber
  // or via a button click on the mode segemented button they will always be in sync.
  function activateMode(mode: DateGalleryMode) {
    // Step 1: sync with the segmented button
    modeSegmentedButton.activateByPredicate((data) => {
      return data.value.mode === mode;
    });

    // Step 2: sync with the DateGallery

    // When the 'mode' is month it means 'year' has been selected
    // and we show 12 month calenders side by side.
    if (mode === "month") {
      // Anchor date to january first, otherwise the 'year' will start
      // at the current month.
      const initialDate = new Date(dateGallery.firstFrame.anchorDate);
      initialDate.setMonth(0);
      initialDate.setDate(1);

      dateGallery.changeConfig({
        mode,
        numberOfFrames: 12,
        initialDate,
      });
    } else {
      dateGallery.changeConfig({ mode, numberOfFrames: 1 });
    }
  }

  const [showForm, setShowForm] = useState(false);
  const [formEvent, setFormEvent] = useState<
    DateGalleryEvent<EventData> | undefined
  >(undefined);
  const [formDate, setFormDate] = useState<Date | undefined>(undefined);

  function openNewEventForm(date: Date) {
    setShowForm(true);
    setFormDate(date);
    setFormEvent(undefined);
  }

  function openEditEventForm(event: DateGalleryEvent<EventData>) {
    setShowForm(true);
    setFormDate(undefined);
    setFormEvent(event);
  }

  function closeEventForm() {
    setShowForm(false);
    setFormEvent(undefined);
  }

  return (
    <div className="calendar-example">
      {showForm ? (
        <EventForm
          formEvent={formEvent}
          formDate={formDate}
          onClose={closeEventForm}
          dateGallery={dateGallery}
        />
      ) : null}

      <div className="calender-topbar">
        <div className="calendar-mode">
          {modeSegmentedButton.contents.map((content) => (
            <button
              key={content.value.label}
              onClick={() => activateMode(content.value.mode)}
              className={classNames({
                active: content.isActive,
              })}
            >
              {content.value.label}
            </button>
          ))}
        </div>

        <div className="calendar-controls">
          <button
            className="calendar-previous calendar-button"
            onClick={() => dateGallery.previous()}
          >
            previous
          </button>
          <span className="calendar-title">
            <RenderCalendarTitle dateGallery={dateGallery} />
          </span>
          <button
            className="calendar-next calendar-button"
            onClick={() => dateGallery.next()}
          >
            next
          </button>
        </div>

        <div className="calendar-actions">
          <button
            className="calendar-today calendar-button"
            onClick={() => dateGallery.today()}
          >
            today
          </button>
          <button
            className="calendar-add-event calendar-button"
            onClick={() => openNewEventForm(new Date())}
          >
            + add event
          </button>
        </div>
      </div>

      <div className="calendar-wrapper">
        <RenderCalendar
          dateGallery={dateGallery}
          openNewEventForm={openNewEventForm}
          openEditEventForm={openEditEventForm}
        />
      </div>
    </div>
  );
}

function RenderCalendar({
  dateGallery,
  openNewEventForm,
  openEditEventForm,
}: {
  dateGallery: DateGallery<EventData>;
  openNewEventForm(date: Date): void;
  openEditEventForm(event: DateGalleryEvent<EventData>): void;
}) {
  // Delegate the rendering of the actual mode to
  // the various render helper functions.
  if (dateGallery.mode === "month-six-weeks") {
    return (
      <MonthCalendar
        dateGallery={dateGallery}
        openNewEventForm={openNewEventForm}
        openEditEventForm={openEditEventForm}
      />
    );
  } else if (dateGallery.mode === "month") {
    return <YearCalendar dateGallery={dateGallery} />;
  } else if (dateGallery.mode === "week") {
    return (
      <WeekCalendar
        dateGallery={dateGallery}
        openNewEventForm={openNewEventForm}
        openEditEventForm={openEditEventForm}
      />
    );
  } else {
    return (
      <DayCalendar
        dateGallery={dateGallery}
        openNewEventForm={openNewEventForm}
        openEditEventForm={openEditEventForm}
      />
    );
  }
}

function RenderCalendarTitle({
  dateGallery,
}: {
  dateGallery: DateGallery<EventData>;
}) {
  // Delegate the rendering of the actual mode to
  // the various render helper functions.
  if (dateGallery.mode === "month-six-weeks") {
    return <MonthCalendarTitle dateGallery={dateGallery} />;
  } else if (dateGallery.mode === "month") {
    return <YearCalendarTitle dateGallery={dateGallery} />;
  } else if (dateGallery.mode === "week") {
    return <WeekCalendarTitle dateGallery={dateGallery} />;
  } else {
    return <DayCalendarTitle dateGallery={dateGallery} />;
  }
}

function readConfigFromUrl(): DateGalleryConfig<EventData> {
  const url = new URL(window.location.href);

  let mode = url.searchParams.get("mode") ?? "month";

  if (
    !["month", "month-six-weeks", "week", "day"].includes(mode.toLowerCase())
  ) {
    mode = "month";
  }

  const typedMode = mode as DateGalleryMode;

  const numberOfFrames = mode === "month" ? 12 : 1;

  let initialDate = url.searchParams.get("initialDate") ?? new Date();
  initialDate = new Date(initialDate);

  if (!isValid(initialDate)) {
    initialDate = new Date();
  }

  return {
    mode: typedMode,
    numberOfFrames,
    initialDate,
  };
}
