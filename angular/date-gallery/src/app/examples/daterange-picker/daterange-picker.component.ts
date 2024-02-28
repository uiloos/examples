import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { isValid } from 'date-fns';
import { timeFormatter } from '../formatters';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { parseAsDate } from '../datepicker/utils';
import { DaterangePickerDialogComponent } from './daterange-picker-dialog/daterange-picker-dialog.component';

@Component({
  selector: 'daterange-picker',
  templateUrl: './daterange-picker.component.html',
  styleUrls: ['./daterange-picker.component.css'],
  standalone: true,
  imports: [CommonModule, DatepickerComponent, DaterangePickerDialogComponent],
})
export class DaterangePickerComponent {
  @Input() start!: string;
  @Output() startChange = new EventEmitter<string>();

  @Input() end!: string;
  @Output() endChange = new EventEmitter<string>();

  @Input() startLabel = 'Start';
  @Input() startErrorLabel = 'Start';

  @Input() endLabel = 'End';
  @Input() endErrorLabel = 'End';

  @Input() required?: boolean;
  @Input() min?: string;
  @Input() max?: string;

  @Input() timeEnabled?: boolean;

  @Output() validityChanged = new EventEmitter<boolean>();

  public showDialog = false;
  public startDateIsValid = true;
  public endDateIsValid = true;
  public minDate = parseAsDate(this.min);
  public maxDate = parseAsDate(this.max);

  setStart(value: string) {
    this.start = value;

    this.startChange.emit(value);
  }

  setEnd(value: string) {
    this.end = value;

    this.endChange.emit(value);
  }

  onStartValidityChanged(valid: boolean) {
    this.startDateIsValid = valid;

    this.validityChanged.emit(this.startDateIsValid && this.endDateIsValid);
  }

  onEndValidityChanged(valid: boolean) {
    this.endDateIsValid = valid;

    this.validityChanged.emit(this.startDateIsValid && this.endDateIsValid);
  }

  rangeChanged({ start, end }: { start: string; end: string }) {
    if (this.timeEnabled) {
      const startTime = this.getTimeOfDate(this.start ?? '');
      const endTime = this.getTimeOfDate(this.end ?? '');

      this.start = `${start} ${startTime}`;
      this.end = `${end} ${endTime}`;
    } else {
      this.start = start;
      this.end = end;
    }

    this.startChange.emit(this.start);
    this.endChange.emit(this.end);
  }

  getTimeOfDate(date: string) {
    let time = parseAsDate(date);

    if (isValid(time)) {
      return timeFormatter.format(time as Date);
    } else {
      return '00:00';
    }
  }

  openDialog() {
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }
}
