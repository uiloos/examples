import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  DateGallery,
  UnsubscribeFunction,
  createDateGallerySubscriber,
} from '@uiloos/core';
import { EventData } from '../events';
import { DateGalleryEvent, DateGalleryDate } from '@uiloos/core';
import { dateTimeFormatter } from '../../formatters';
import { MonthEventComponent } from './components/month-event.component';

type Entry = {
  dateObj: DateGalleryDate<EventData>;
  ariaLabel: string;
  gridTemplateRows: string;
  eventsForDay: DateGalleryEvent<EventData>[];
  date: Date;
};

@Component({
  selector: 'month-calendar',
  templateUrl: './month-calendar.component.html',
  styleUrl: './month-calendar.component.css',
  standalone: true,
  imports: [CommonModule, MonthEventComponent],
})
export class MonthCalendarComponent implements OnInit, OnDestroy {
  @Input() dateGallery!: DateGallery<EventData>;

  @Output() openNewEventForm = new EventEmitter<Date>();
  @Output() openEditEventForm = new EventEmitter<DateGalleryEvent<EventData>>();

  private draggedEvent: DateGalleryEvent<EventData> | null = null;

  public entries: Entry[] = [];

  private unsubscribe: UnsubscribeFunction | null = null;

  ngOnInit(): void {
    this.entries = this.generateEntries();

    const self = this;

    this.unsubscribe = this.dateGallery.subscribe(
      createDateGallerySubscriber({
        onFrameChanged() {
          self.entries = self.generateEntries();
        },
        onEventMoved() {
          self.entries = self.generateEntries();
        },
        onEventAdded() {
          self.entries = self.generateEntries();
        },
        onEventRemoved() {
          self.entries = self.generateEntries();
        },
      }),
    );
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  generateEntries(): Entry[] {
    const eventPositionsByDay = this.calculateEventPositionByDay();

    return this.dateGallery.firstFrame.dates.map((dateObj, index) => {
      const eventsForDay = eventPositionsByDay[index];

      // Set the aria label of the button to something sensible
      const date = new Date(dateObj.date);

      // Set the date to the current hour, and to the closest 5 minutes
      const now = new Date();
      date.setHours(now.getHours(), Math.round(now.getMinutes() / 5) * 5);

      const formatted = dateTimeFormatter.format(date);
      const ariaLabel = `Create new event at around ${formatted}`;

      const noRows = eventsForDay.length;
      const gridTemplateRows = `repeat(${noRows}, 32px)`;

      return {
        dateObj,
        ariaLabel,
        gridTemplateRows,
        eventsForDay,
        date,
      };
    });
  }

  onDragOver(e: DragEvent, dateObj: DateGalleryDate<EventData>) {
    e.stopPropagation();

    if (!this.draggedEvent) {
      return;
    }

    // Create a new startDate based on the date that the event
    // has been dragged over.
    const startDate = new Date(dateObj.date);

    // Now copy the original start hours.
    startDate.setHours(
      this.draggedEvent.startDate.getHours(),
      this.draggedEvent.startDate.getMinutes(),
    );

    // Calculate the duration of the event.
    const duration =
      this.draggedEvent.endDate.getTime() -
      this.draggedEvent.startDate.getTime();

    // Add the duration to the new startDate to get the endDate
    const endDate = new Date(startDate.getTime() + duration);

    this.draggedEvent.move({
      startDate,
      endDate,
    });
  }

  /* 
    Takes a calendar and returns an array of arrays, each
    subarray represents a day and contains all events of that
    day. 
  
    The position / index of the event with the "day" array is 
    the "row" it should be put in the CSS Grid.
  
    The events are packed as tight as possible so the least
    amount of rows are used.
  */
  calculateEventPositionByDay() {
    // Will contain an array for each day of the month
    const month: DateGalleryEvent<EventData>[][] = [];

    this.dateGallery.firstFrame.dates.forEach((dateObj, index) => {
      // Will contain all events within the day.
      const day: DateGalleryEvent<EventData>[] = [];

      const prevDay = month[index - 1];

      dateObj.events.forEach((event) => {
        if (!event.spansMultipleDays) {
          return;
        }

        // If there is a previous day, meaning it is not the
        // first day of the displayed month calendar
        if (prevDay) {
          // Try finding the event within the previous day
          const index = prevDay.indexOf(event);

          // If the event exists add it on this day at the same index / row
          // as the day before, this makes an event appear on the same
          // row for multiple days which is visually pleasing.
          if (index !== -1) {
            day[index] = event;
            return;
          }
        }

        let firstEmptyIndex = 0;

        // Find the first empty position within the `day` array.
        // This way we find the first empty row and fill it, this
        // makes sure the events are packed close together.
        while (day[firstEmptyIndex]) {
          firstEmptyIndex++;
        }

        day[firstEmptyIndex] = event;
      });

      month.push(day);
    });

    return month;
  }

  public dayNumberClicked(event: Event, dateObj: DateGalleryDate<EventData>) {
    event.stopPropagation();

    this.dateGallery.changeConfig({
      initialDate: dateObj.date,
      mode: 'day',
      numberOfFrames: 1,
    });
  }

  public setDraggedEvent(event: DateGalleryEvent<EventData>) {
    this.draggedEvent = event;
  }

  public newEventForm(e: Event, date: Date) {
    e.stopPropagation();

    this.openNewEventForm.emit(date);
  }

  public openEditForm(event: DateGalleryEvent<EventData>) {
    this.openEditEventForm.emit(event);
  }

  public entryTrackBy(index: number, entry: Entry) {
    return entry.dateObj.date.toISOString();
  }

  public eventTrackBy(index: number, event: DateGalleryEvent<EventData>) {
    return event.data.id;
  }
}
