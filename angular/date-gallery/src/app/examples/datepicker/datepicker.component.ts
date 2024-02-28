import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { isValid } from 'date-fns';
import { parseAsDate } from './utils';
import { dateFormatter, timeFormatter } from '../formatters';
import { DatepickerDialogComponent } from './datepicker-dialog/datepicker-dialog.component';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
  standalone: true,
  imports: [CommonModule, DatepickerDialogComponent],
})
export class DatepickerComponent implements OnInit, OnChanges {
  ngOnInit(): void {
    // Validate at least once on mount.
    this.validate();
  }

  public maxDate: Date | null = null;
  public minDate: Date | null = null;

  ngOnChanges(changes: SimpleChanges) {
    // Validate whenever the model changes
    if (changes['value']) {
      this.validate();
    }

    // When the linkedPicker changes also validate this picker
    if (changes['linkedPicker']) {
      this.validate();
    }

    const minChanges = changes['min'];
    if (minChanges) {
      this.minDate = parseAsDate(minChanges.currentValue);
    }

    const maxChanges = changes['max'];
    if (maxChanges) {
      this.maxDate = parseAsDate(maxChanges.currentValue);
    }
  }

  @Input() value!: string;
  @Output() valueChange = new EventEmitter<string>();

  @Input() required?: boolean;
  @Input() min?: string;
  @Input() max?: string;
  @Input() label!: string;
  @Input() timeEnabled?: boolean;

  @Input() linkedPicker?: {
    value: string;
    label: string;
    myPosition: 'start' | 'end';
  };

  @Output() validityChanged = new EventEmitter<boolean>();
  @Output() openDialog = new EventEmitter<void>();

  public showDialog = false;
  public error = '';

  public inputValue = '';
  public timeValue = '';

  public datePicked(value: string) {
    this.inputValue = value;
    this.dateChanged();
  }

  public inputValueChanged(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.inputValue = event.target.value;
    }
  }

  public timeValueChanged(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      this.timeValue = event.target.value;
    }
  }

  public dateChanged() {
    let date = this.inputValue;

    if (date === '') {
      this.inputValue = '';
      return;
    }

    // This allows the user to enter "today" / "tomorrow" and "yesterday"
    // and get it transformed back to a date.
    if (['today', 'tomorrow', 'yesterday'].includes(date)) {
      date = dateFormatter.format(parseAsDate(date) as Date);
    }

    if (this.timeEnabled) {
      let _timeValue = this.timeValue;

      if (!_timeValue) {
        _timeValue = '00:00';
      }

      this.timeValue = _timeValue;

      this.value = `${date} ${_timeValue}`;
    } else {
      this.value = date + ' 00:00';
    }

    this.valueChange.emit(this.value);
  }

  public timeChanged() {
    this.value = `${this.inputValue} ${this.timeValue}`;
    this.valueChange.emit(this.value);
  }

  public onCalendarButtonClicked() {
    // If there is a callback call it, otherwise
    // open our dialog
    if (this.openDialog.observed) {
      this.openDialog.emit();
    } else {
      this.showDialog = !this.showDialog;
    }
  }

  public onClose() {
    this.showDialog = false;
  }

  private validate() {
    const date = parseAsDate(this.value);

    if (date && isValid(date)) {
      this.inputValue = dateFormatter.format(date);
      this.timeValue = timeFormatter.format(date);

      this.value = `${this.inputValue} ${this.timeValue}`;
      this.valueChange.emit(this.value);
    }

    // If it is required but empty report an error
    if (this.required && this.value === '') {
      this.error = `${this.label} is required`;
      this.validityChanged.emit(false);
      return;
    }

    // If it is not required and the value is empty mark as valid
    if (!this.required && this.value === '') {
      this.error = '';
      this.validityChanged.emit(true);

      return;
    }

    // Check if it is indeed valid
    if (!isValid(date)) {
      const format = this.timeEnabled ? 'mm/dd/yyyy hh:mm' : 'mm/dd/yyyy';

      this.error = `${this.label} is not a valid date in the ${format} format`;
      this.validityChanged.emit(false);

      return;
    }

    if (date) {
      if (this.minDate && date < this.minDate) {
        this.error = `${this.label} must be after ${dateFormatter.format(this.minDate)}`;
        this.validityChanged.emit(false);

        return;
      }

      if (this.maxDate && date > this.maxDate) {
        this.error = `${this.label} must be before ${dateFormatter.format(this.maxDate)}`;
        this.validityChanged.emit(false);

        return;
      }

      if (this.linkedPicker) {
        const linkedPickerDate = parseAsDate(this.linkedPicker.value);

        if (linkedPickerDate) {
          // If we are in a range picker relation and we are the start we must not be after the end.
          if (
            this.linkedPicker.myPosition === 'start' &&
            date > linkedPickerDate
          ) {
            this.error = `${this.label} lies after ${this.linkedPicker.label}`;

            this.validityChanged.emit(false);
            return;
          }

          // If we are in a range picker relation and we are the end we must not be before the start.
          if (
            this.linkedPicker.myPosition === 'end' &&
            date < linkedPickerDate
          ) {
            this.error = `${this.label} lies before ${this.linkedPicker.label}`;
            this.validityChanged.emit(false);

            return;
          }
        }
      }
    }

    this.error = '';
    this.validityChanged.emit(true);
  }
}
