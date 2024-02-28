import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { isValid } from 'date-fns';
import { MonthSelectComponent } from '../../datepicker/month-select/month-select.component';
import { YearInputComponent } from '../../datepicker/year-input/year-input.component';
import { MyDialogComponent } from '../../my-dialog/my-dialog.component';
import {
  DateGallery,
  DateGalleryDate,
  createDateGallerySubscriber,
} from '@uiloos/core';
import { dateFormatter } from '../../formatters';
import { parseAsDate } from '../../datepicker/utils';

@Component({
  selector: 'daterange-picker-dialog',
  templateUrl: './daterange-picker-dialog.component.html',
  styleUrls: ['./daterange-picker-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MonthSelectComponent,
    YearInputComponent,
    MyDialogComponent,
  ],
})
export class DaterangePickerDialogComponent implements OnInit, OnDestroy {
  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() min?: Date;
  @Input() max?: Date;

  @Output() rangeChanged = new EventEmitter<{
    start: string;
    end: string;
  }>();
  @Output() close = new EventEmitter<void>();

  public dateGallery!: DateGallery<unknown>;
  public dateFormatter!: Intl.DateTimeFormat;

  public rangeStart = new Date();
  public rangeEnd = new Date();

  ngOnInit(): void {
    this.dateFormatter = dateFormatter;

    const self = this;
    this.dateGallery = new DateGallery(
      {
        mode: 'month',
        maxSelectionLimit: false,
        canSelect(dateObj: DateGalleryDate<unknown>) {
          if (self.min && dateObj.date < self.min) {
            return false;
          } else if (self.max && dateObj.date > self.max) {
            return false;
          }

          return true;
        },
      },
      createDateGallerySubscriber({
        onDateSelected() {
          self.onRangeChanged();
        },
        onDateSelectedMultiple() {
          self.onRangeChanged();
        },
      }),
    );

    // If there is already a selection reselect it.
    if (this.startDate && this.endDate) {
      const start = parseAsDate(this.startDate);
      const end = parseAsDate(this.endDate);

      if (isValid(start) && isValid(end)) {
        this.dateGallery.changeConfig({ initialDate: end as Date });
        this.dateGallery.selectRange(start as Date, end as Date);
      }
    }
  }

  ngOnDestroy(): void {
    this.dateGallery.unsubscribeAll();
  }

  // Will store the date that was selected first by the user
  private firstSelectedDate: Date | null = null;
  private rangeComplete = false;
  private keyboardDirection: 'earlier' | 'later' = 'later';

  onDateClicked(event: MouseEvent, dateObj: DateGalleryDate<unknown>) {
    // Do not do anthing on "Enter" but let the onKeydown save and close
    if (event.detail === 0) {
      // detail is the amount of times the mouse was clicked,
      // which is zero for an "Enter" via keyboard.
      return;
    }

    // If the user has not selected any date yet
    if (this.firstSelectedDate === null) {
      // Store that date that was clicked
      this.firstSelectedDate = dateObj.date;

      // Treat it as the user wanting to start
      // a new selection on that date.
      this.dateGallery.deselectAll();

      // Also visually select this date so it becomes blue.
      this.dateGallery.selectDate(this.firstSelectedDate);

      // Reset so hover animation works again.
      this.rangeComplete = false;
    } else {
      /*
        If the user has already selected a date the
        second click should close the range.

        Note: selectRange does not care in which order
        it receives the parameters, it will find the
        earlier and later dates itself.
      */
      this.dateGallery.selectRange(this.firstSelectedDate, dateObj.date);

      // Now reset the firstSelectedDate so the next click
      // is treated as the user wanting to change the range
      //again.
      this.firstSelectedDate = null;

      // Mark the range as complete
      this.rangeComplete = true;
    }
  }

  saveAndClose() {
    const [startDate, endDate] = this.getStartAndEndDateOfSelectedDatesRange();

    const start = dateFormatter.format(startDate);
    const end = dateFormatter.format(endDate);

    this.rangeChanged.emit({ start, end });
    this.close.emit();
  }

  onKeydown(event: KeyboardEvent) {
    // Do not interfere with the year <input>
    if (
      event.target &&
      event.target instanceof HTMLElement &&
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
      this.firstSelectedDate = null;

      // If there is no date selected select the first date
      // that can be selected from the first frame.
      if (this.dateGallery.selectedDates.length === 0) {
        const dateObj = this.dateGallery.firstFrame.dates.find(
          (dateObj) => dateObj.canBeSelected,
        );

        if (dateObj) {
          // Select the date so it highlights in blue.
          this.dateGallery.selectDate(dateObj.date);
        }

        return;
      }

      // Base the direction on when the first date of the
      // range is selected. This will also be true when
      // a range is reduced to 1 again.
      if (this.dateGallery.selectedDates.length === 1) {
        if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
          this.keyboardDirection = 'earlier';
        } else {
          this.keyboardDirection = 'later';
        }
      }

      const [rangeStart, rangeEnd] =
        this.getStartAndEndDateOfSelectedDatesRange();

      // We want to change the range in the direction
      // the arrow keys go but keep the other date as is.
      let moveDate: Date | null = null;
      let otherDate: Date | null = null;

      if (this.keyboardDirection === 'earlier') {
        moveDate = rangeStart;
        otherDate = rangeEnd;
      } else {
        moveDate = rangeEnd;
        otherDate = rangeStart;
      }

      // Copy last moveDate so the original is
      // not mutated. This is undesirable when the
      // start date is the same as the endDate when
      // the number of moveDate is 1, as the code
      // below would then update them both!
      moveDate = new Date(moveDate);

      // Mutate the moveDate based on the arrow keys
      if (event.key === 'ArrowLeft') {
        moveDate.setDate(moveDate.getDate() - 1);
      } else if (event.key === 'ArrowRight') {
        moveDate.setDate(moveDate.getDate() + 1);
      } else if (event.key === 'ArrowUp') {
        moveDate.setDate(moveDate.getDate() - 7);
      } else if (event.key === 'ArrowDown') {
        moveDate.setDate(moveDate.getDate() + 7);
      }

      // Select the date so it highlights in blue.
      this.dateGallery.deselectAll();
      this.dateGallery.selectRange(moveDate, otherDate);

      // Change the initialDate (changes the frames) so the user
      // can navigate to other months when month changes
      if (
        moveDate.getMonth() !==
        this.dateGallery.firstFrame.anchorDate.getMonth()
      ) {
        this.dateGallery.changeConfig({ initialDate: moveDate });
      }
    } else if (event.key === 'Enter') {
      // When enter is pressed close the dialog and set
      // the value to the selected date.
      this.saveAndClose();
    }
  }

  getStartAndEndDateOfSelectedDatesRange() {
    // Sort from past to future.
    const sorted: Date[] = [...this.dateGallery.selectedDates].sort(
      (a, b) => a.getTime() - b.getTime(),
    );

    // The first date is the start date.
    const start = sorted[0] ?? new Date();

    // The last date is the end date
    const end = sorted[sorted.length - 1] ?? new Date();

    return [start, end] as const;
  }

  closeDialog() {
    this.close.emit();
  }

  onRangeChanged() {
    const [newRangeStart, newRangeEnd] =
      this.getStartAndEndDateOfSelectedDatesRange();

    this.rangeStart = newRangeStart;
    this.rangeEnd = newRangeEnd;
  }

  dateTrackBy(index: number, dateObj: DateGalleryDate<unknown>) {
    return dateObj.date.toISOString();
  }
}
