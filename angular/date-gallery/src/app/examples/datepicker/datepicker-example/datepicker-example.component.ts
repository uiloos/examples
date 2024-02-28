import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DatepickerComponent } from '../datepicker.component';

@Component({
  selector: 'datepicker-example',
  templateUrl: './datepicker-example.component.html',
  styleUrls: ['./datepicker-example.component.css'],
  standalone: true,
  imports: [CommonModule, DatepickerComponent],
})
export class DatepickerExampleComponent {
  public birthday = '';
  public appointment = '';
  public birthdayIsValid = false;
  public appointmentIsValid = false;

  public birthdayValidityChanged(value: boolean) {
    this.birthdayIsValid = value;
  }

  public appointmentValidityChanged(value: boolean) {
    this.appointmentIsValid = value;
  }
}
