import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';

import { isValid } from 'date-fns';
import { DateGallery, DateGalleryDate } from '@uiloos/core';
import { dateFormatter } from '../../formatters';
import { parseAsDate } from './../utils';
import { MyDialogComponent } from '../../my-dialog/my-dialog.component';
import { MonthSelectComponent } from '../month-select/month-select.component';
import { CommonModule } from '@angular/common';
import { YearInputComponent } from '../year-input/year-input.component';

@Component({
  selector: 'datepicker-dialog',
  templateUrl: './datepicker-dialog.component.html',
  styleUrls: ['./datepicker-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MyDialogComponent,
    MonthSelectComponent,
    YearInputComponent,
  ],
})
export class DatepickerDialogComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  @Input() value!: string;
  @Output() selected = new EventEmitter<string>();

  @Input() min?: Date;
  @Input() max?: Date;

  public dateGallery!: DateGallery<unknown>;

  public dateFormatter!: Intl.DateTimeFormat;

  ngOnInit() {
    this.dateFormatter = dateFormatter;

    let initialDate = new Date();
    if (this.value) {
      const date = parseAsDate(this.value);

      if (isValid(date)) {
        initialDate = date as Date;
      }
    }

    const self = this;

    this.dateGallery = new DateGallery({
      mode: 'month',
      initialDate,
      selectedDates: [initialDate],
      maxSelectionLimit: 1,
      canSelect(dateObj: DateGalleryDate<unknown>) {
        if (self.min && dateObj.date < self.min) {
          return false;
        } else if (self.max && dateObj.date > self.max) {
          return false;
        }

        return true;
      },
    });
  }

  onDateClicked(dateObj: DateGalleryDate<unknown>) {
    const date = dateFormatter.format(dateObj.date);

    this.selected.emit(date);
    this.close.emit();
  }

  public closeDialog() {
    this.close.emit();
  }

  public onKeydown(event: KeyboardEvent) {
    // Do not interfere with the year <input>
    if (
      event.target &&
      event.target instanceof HTMLElement &&
      event.target.nodeName &&
      event.target.nodeName === 'INPUT'
    ) {
      return;
    }

    // Stop the propagation here so not all elements
    // are called for better performance.
    event.stopPropagation();

    if (
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    ) {
      // Copy date as not to mutate the selected date.
      const date = new Date(this.dateGallery.selectedDates[0]);

      // Mutate the date based on the arrow keys
      if (event.key === 'ArrowLeft') {
        date.setDate(date.getDate() - 1);
      } else if (event.key === 'ArrowRight') {
        date.setDate(date.getDate() + 1);
      } else if (event.key === 'ArrowUp') {
        date.setDate(date.getDate() - 7);
      } else if (event.key === 'ArrowDown') {
        date.setDate(date.getDate() + 7);
      }

      // Select the date so it highlights in blue.
      this.dateGallery.selectDate(date);

      // Change the initialDate (changes the frames) so the user
      // can navigate to other months.
      this.dateGallery.changeConfig({ initialDate: date });
    } else if (event.key === 'Enter') {
      // When enter is pressed close the dialog and set
      // the value to the selected date.

      // We do not want the dialog to open again.
      event.preventDefault();

      const date = dateFormatter.format(this.dateGallery.selectedDates[0]);

      this.selected.emit(date);
      this.close.emit();
    }
  }

  dateTrackBy(index: number, dateObj: DateGalleryDate<unknown>) {
    return dateObj.date.toISOString();
  }
}
