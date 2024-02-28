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
import { DateGalleryEvent } from '@uiloos/core';
import { DayEventComponent } from './components/day-event/day-event.component';
import { HourIndicatorsComponent } from './components/hour-indicators/hour-indicators.component';
import { CurrentHourComponent } from './components/current-hour/current-hour.component';
import { WIDTH } from './config';

@Component({
  selector: 'day-calendar',
  templateUrl: './day-calendar.component.html',
  styleUrl: './day-calendar.component.css',
  standalone: true,
  imports: [
    CommonModule,
    HourIndicatorsComponent,
    CurrentHourComponent,
    DayEventComponent,
  ],
})
export class DayCalendarComponent implements OnInit, OnDestroy {
  @Input() dateGallery!: DateGallery<EventData>;

  @Output() openNewEventForm = new EventEmitter<Date>();
  @Output() openEditEventForm = new EventEmitter<DateGalleryEvent<EventData>>();

  public width = WIDTH;
  public eventRows: Map<DateGalleryEvent<EventData>, string> = new Map();
  public rows = '0';

  private unsubscribe: UnsubscribeFunction | null = null;

  ngOnInit(): void {
    this.sync();

    const self = this;

    this.unsubscribe = this.dateGallery.subscribe(
      createDateGallerySubscriber({
        onFrameChanged() {
          self.sync();
        },
        onEventMoved() {
          self.sync();
        },
        onEventAdded() {
          self.sync();
        },
        onEventRemoved() {
          self.sync();
        },
      }),
    );
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  sync() {
    this.eventRows = this.calculateEventRows();
    this.rows = this.getNoRows().toString();
  }

  /* 
    Takes a DateGallery and returns a Map to which the events 
    are keys, and the values are CSS gridRow strings.
  
    For example: 
    
    {eventA: '1 / 2', eventB: '2 / 3', eventC: '3 / 4'}
  
    The events are packed as tight as possible so the least
    amount of rows are used.
  */
  calculateEventRows(): Map<DateGalleryEvent<EventData>, string> {
    // Step one: we place all events into the least amount of rows
    const rows = packEventsOnAxis(this.dateGallery.events);

    // Step two: we take the rows array and turn it into a Map of CSS
    // grid row strings.
    const eventRows = new Map<DateGalleryEvent<EventData>, string>();

    this.dateGallery.events.forEach((event) => {
      const row = rows.findIndex((row) => row.includes(event));

      // Finally we know where to place the event, but we need to
      // account for the fact that CSS grid starts counting at one
      // and not zero. So we +1 the rows. Also we now that the first
      // row shows the hours so another +1 is needed.
      eventRows.set(event, `${row + 2}`);
    });

    return eventRows;
  }

  getNoRows() {
    let noRows = 0;

    this.eventRows.forEach((rowStr) => {
      noRows = Math.max(parseInt(rowStr, 10), noRows);
    });

    return noRows < 20 ? 20 : noRows;
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
