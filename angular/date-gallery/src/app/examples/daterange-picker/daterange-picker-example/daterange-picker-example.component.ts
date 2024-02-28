import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DaterangePickerComponent } from '../daterange-picker.component';

@Component({
  selector: 'daterange-picker-example',
  templateUrl: './daterange-picker-example.component.html',
  styleUrls: ['./daterange-picker-example.component.css'],
  standalone: true,
  imports: [CommonModule, DaterangePickerComponent],
})
export class DaterangePickerExampleComponent {
  public startDate = '01/01/2040 23:00';
  public endDate = '01/07/2040 23:00';
  public vacationIsValid = true;

  public vacationIsValidChanged(value: boolean) {
    this.vacationIsValid = value;
  }
}
