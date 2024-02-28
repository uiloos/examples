import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { monthFormatter } from '../../formatters';
import type { EventData } from '../events';
import { DateGallery, DateGalleryDate, DateGalleryFrame } from '@uiloos/core';

@Component({
  selector: 'year-calendar',
  templateUrl: './year-calendar.component.html',
  styleUrls: ['./year-calendar.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class YearCalendarComponent {
  @Input() dateGallery!: DateGallery<EventData>;

  public monthFormatter!: Intl.DateTimeFormat;

  constructor() {
    this.monthFormatter = monthFormatter;
  }

  public monthClicked(initialDate: Date) {
    this.dateGallery.changeConfig({
      initialDate,
      mode: 'month-six-weeks',
      numberOfFrames: 1,
    });
  }

  public dayClicked(initialDate: Date) {
    this.dateGallery.changeConfig({
      initialDate,
      mode: 'day',
      numberOfFrames: 1,
    });
  }

  public frameTrackBy(index: number, frame: DateGalleryFrame<EventData>) {
    return frame.anchorDate.toISOString();
  }

  public dateTrackBy(index: number, dateObj: DateGalleryDate<EventData>) {
    return dateObj.date.toISOString();
  }
}
