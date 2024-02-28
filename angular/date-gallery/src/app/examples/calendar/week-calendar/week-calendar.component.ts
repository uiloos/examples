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
  createDateGallerySubscriber,
  UnsubscribeFunction,
} from '@uiloos/core';
import { EventData, packEventsOnAxis } from '../events';
import { DateGalleryEvent, DateGalleryDate } from '@uiloos/core';
import { WeekEventComponent } from './components/week-event/week-event.component';
import { HourIndicatorsComponent } from './components/hour-indicators/hour-indicators.component';
import { DayGridComponent } from './components/day-grid/day-grid.component';
import { DayNamesComponent } from './components/day-names/day-names.component';
import { HEIGHT } from './config';

type Entry = {
  dateObj: DateGalleryDate<EventData>;
  eventColumns: Map<DateGalleryEvent<EventData>, string>;
};

@Component({
  selector: 'week-calendar',
  templateUrl: './week-calendar.component.html',
  styleUrl: './week-calendar.component.css',
  standalone: true,
  imports: [
    CommonModule,
    WeekEventComponent,
    HourIndicatorsComponent,
    DayGridComponent,
    DayNamesComponent,
  ],
})
export class WeekCalendarComponent implements OnInit, OnDestroy {
  @Input() dateGallery!: DateGallery<EventData>;

  @Output() openNewEventForm = new EventEmitter<Date>();
  @Output() openEditEventForm = new EventEmitter<DateGalleryEvent<EventData>>();

  public height = HEIGHT;

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
    return this.dateGallery.firstFrame.dates.map((dateObj) => {
      const eventColumns = this.calculateEventColumns(dateObj);

      return { dateObj, eventColumns };
    });
  }

  /* 
    Takes a DateGalleryDate and returns a Map to which the events 
    are keys, and the values are CSS gridColumn strings.
  
    For example: 
    
    {eventA: '1 / 2', eventB: '2 / 3', eventC: '3 / 4'}
  
    The events are packed as tight as possible so the least
    amount of columns are used.
  
    Note: since we are using a CSS grid we do get one limitation:
    you cannot always divide a CSS grid equally over multiple events.
    This is because CSS grids cannot have varying columns / rows, 
    meaning you cannot make one row have three columns, and the other
    row have two.
  
    This is a problem for us: say you have a day with five events, 
    three of which are overlapping, and the other two overlap as well. 
    This means we end up with 3 columns total to hold the three 
    overlapping events, but then the other 2 events also need to be 
    divided over three columns. 
  
    In an ideal world we would be able to say: CSS Grid make those 
    two events take the same amount of space in the 3 columms. 
    Essentialy making the 2 events the same size, but unfortunately 
    CSS cannot do this.
  
    So my solution is to make one of the two events take up 2/3 and 
    the other 1/3. Not ideal but it works
  */
  calculateEventColumns(dateObj: DateGalleryDate<EventData>) {
    // Step one: we place all events into the least amount of columns
    const columns = packEventsOnAxis(dateObj.events);

    // Step two: we take the columns array and turn it into a Map of CSS
    // grid column strings.
    const eventColumns = new Map<DateGalleryEvent<EventData>, string>();

    dateObj.events.forEach((event) => {
      // Shortcut if the event does not overlap make it span
      // all columns.
      if (!event.isOverlapping) {
        eventColumns.set(event, `1 / ${columns.length + 1}`);
        return;
      }

      // The start column is the first column this event can be found in.
      const startColumn = columns.findIndex((column) => column.includes(event));

      // Now that we have found the start, we need to find the end in the
      // remaining columns.
      const remainingColumns = columns.slice(startColumn);

      // The end column is the first column an overlapping event can be found in,
      // since it has to share the column with that event.
      let endColumn = remainingColumns.findIndex((column) =>
        column.some((otherEvent) =>
          event.overlappingEvents.includes(otherEvent),
        ),
      );

      // If we cannot find an endColumn it means it was already on the
      // last column, so place it there.
      if (endColumn === -1) {
        endColumn = columns.length;
      } else {
        // If the endColumn can be found we need to add the startColumn
        // to it since the remainingColumns start counting at 0 again,
        // so we need to make up the difference.
        endColumn += startColumn;
      }

      // Finally we know where to place the event, but we need to
      // account for the fact that CSS grid starts counting at one
      // and not zero. So we +1 the columns.
      eventColumns.set(event, `${startColumn + 1} / ${endColumn + 1}`);
    });

    return eventColumns;
  }

  public entryTrackBy(index: number, entry: Entry) {
    return entry.dateObj.date.toISOString();
  }

  public eventTrackBy(index: number, event: DateGalleryEvent<EventData>) {
    return event.data.id;
  }

  public newEventForm(date: Date) {
    this.openNewEventForm.emit(date);
  }

  public openEditForm(event: DateGalleryEvent<EventData>) {
    this.openEditEventForm.emit(event);
  }
}
