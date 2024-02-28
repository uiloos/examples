import { DateGallery, DateGalleryEvent } from "@uiloos/core";
import React, { useState, FormEvent, useRef } from "react";
import { Dialog } from "../../Dialog/Dialog";
import { EventData, eventId, formatDateForInput } from "./../events";
import { DateRangePicker } from "../../DateRangePicker/DateRangePicker";
import "./EventForm.css";

type Props = {
  dateGallery: DateGallery<EventData>;
  formEvent?: DateGalleryEvent<EventData>;
  formDate?: Date;
  onClose(): void;
};

export function EventForm({
  formEvent,
  onClose,
  dateGallery,
  formDate,
}: Props) {
  // Please use a good form library such as Formik, Final Form or react-hook-form
  // instead of this

  const [title, setTitle] = useState(() =>
    formEvent ? formEvent.data.title : "",
  );
  const [titleError, setTitleError] = useState("");

  const [description, setDescription] = useState(() =>
    formEvent ? formEvent.data.description : "",
  );
  const [descripitonError, setDescriptionError] = useState("");

  const [startDate, setStartDate] = useState(() => {
    if (formEvent) {
      return formatDateForInput(formEvent.startDate);
    } else if (formDate) {
      return formatDateForInput(formDate);
    } else {
      return "";
    }
  });
  const [endDate, setEndDate] = useState(() => {
    if (formEvent) {
      return formatDateForInput(formEvent.endDate);
    } else if (formDate) {
      const date = new Date(formDate);
      date.setHours(formDate.getHours() + 1, formDate.getMinutes());

      return formatDateForInput(date);
    } else {
      return "";
    }
  });
  const [rangeValid, setRangeValid] = useState(false);

  const [color, setColor] = useState(() =>
    formEvent ? formEvent.data.color : "#000000",
  );
  const [colorError, setColorError] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    let valid = true;

    if (title === "") {
      setTitleError("Title is required");
      valid = false;
    } else {
      setTitleError("");
    }

    if (description === "") {
      setDescriptionError("Description is required");
      valid = false;
    } else {
      setDescriptionError("");
    }

    if (color === "") {
      setColorError("Color is required");
      valid = false;
    } else {
      setColorError("");
    }

    if (!rangeValid || !valid) {
      return;
    }

    const isCreating = formEvent === undefined;

    if (isCreating) {
      // Inform the dateGallery of the new event
      dateGallery.addEvent({
        data: {
          id: eventId(),
          title,
          description,
          color,
        },
        startDate,
        endDate,
      });
    } else {
      // Inform the dateGallery that the event has changed.

      // First update the data object of the event, to whatever
      // the user filled in.
      formEvent.changeData({
        id: formEvent.data.id,
        title,
        description,
        color,
      });

      // Then tell the DateGallery that the event has actually moved
      formEvent.move({
        startDate,
        endDate,
      });
    }

    onClose();
  }

  function deleteButtonClicked() {
    if (formEvent) {
      formEvent.remove();
      onClose();
    }
  }

  return (
    <Dialog onClose={onClose}>
      <form className="calendar-event-form" onSubmit={onSubmit}>
        <b className="calendar-event-form-title">
          {formEvent ? "Edit event" : "Add event"}
        </b>

        <div className="calendar-event-form-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {titleError ? <span className="error">{titleError}</span> : null}
        </div>

        <div className="calendar-event-form-field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            cols={4}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {descripitonError ? (
            <span className="error">{descripitonError}</span>
          ) : null}
        </div>

        <DateRangePicker
          timeEnabled
          startValue={startDate}
          onStartChanged={setStartDate}
          endValue={endDate}
          onEndChanged={setEndDate}
          validityChanged={setRangeValid}
          startLabel="Start (mm/dd/yyyy hh:mm)"
          endLabel="End (mm/dd/yyyy hh:mm)"
          startErrorLabel="Start"
          endErrorLabel="End"
          required
        />

        <div className="calendar-event-form-field">
          <label htmlFor="color">Color</label>
          <input
            id="color"
            name="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          {colorError ? <span className="error">{colorError}</span> : null}
        </div>

        <button type="submit">Save</button>
      </form>

      {formEvent ? (
        <button className="delete-event-button" onClick={deleteButtonClicked}>
          Delete event
        </button>
      ) : null}
    </Dialog>
  );
}
