import React, { useState } from "react";
import { Datepicker } from "./Datepicker";

export function DatepickerExample() {
  /*
    The DatepickerExample here is an example of how to create a form 
    in React without using a form library, in real life I would recommend 
    using a form library such as: react-hook-form, formik or final-form.
  */
  const [birthday, setBirthday] = useState("");
  const [birthdayIsValid, setBirthdayIsValid] = useState(false);
  const [appointment, setAppointment] = useState("today");
  const [appointmentIsValid, setAppointmentIsValid] = useState(false);

  return (
    <>
      <div className="center">
        <div id="birthdayForm">
          <label htmlFor="birthday"> Birthday (mm/dd/yyyy) </label>
          <Datepicker
            value={birthday}
            onChange={setBirthday}
            onValidityChanged={setBirthdayIsValid}
            required
            min="01/01/1900"
            max="tomorrow"
            label="Birthday"
          />

          <label htmlFor="appointment"> Appointment (mm/dd/yyyy hh:mm) </label>
          <Datepicker
            value={appointment}
            onChange={setAppointment}
            onValidityChanged={setAppointmentIsValid}
            label="Appointment"
            required
            min="yesterday"
            timeEnabled
          />

          {birthday && appointment && birthdayIsValid && appointmentIsValid ? (
            <p>
              Your birthday is: {birthday} your appointment is on {appointment}
            </p>
          ) : null}
        </div>
      </div>

      <div className="description">
        <p>
          The example above shows a datepicker component which is implemented as
          a custom element that integrates with regular HTML form elements.
        </p>

        <p>
          It does this by creating a web component which has the
          "formAssociated" static property set to true.
        </p>

        <p>
          Tip: try entering "today" or "yesterday" or "tomorrow" in the inputs
          without the quotes!
        </p>
      </div>
    </>
  );
}
